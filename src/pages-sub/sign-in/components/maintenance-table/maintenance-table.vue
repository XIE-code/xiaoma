<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '急修列表',
  },
}
</route>

<template>
  <view class="table-container">
    <wd-table border :data="maintenanceList" height="100%" fixed custom-class="custom-maintenance">
      <wd-table-col fixed align="center" width="13%" prop="pillType" label="选择">
        <template #value="{ row }">
          <wd-checkbox
            :disabled="[1, 4].includes(row.pillType)"
            checked-color="rgb(83, 157, 243)"
            :modelValue="row.check"
            shape="square"
            @change="handleCheckboxChange(row)"
          ></wd-checkbox>
        </template>
      </wd-table-col>
      <wd-table-col align="center" width="13%" prop="index" label="序号"></wd-table-col>
      <wd-table-col
        align="center"
        width="22%"
        fixed
        prop="projectContent"
        label="维保项目名称"
      ></wd-table-col>
      <wd-table-col
        align="center"
        width="22%"
        prop="projectSyn"
        label="维保备注信息"
      ></wd-table-col>
      <wd-table-col
        custom-class="custom-operation"
        align="center"
        width="30%"
        prop="pillRemark"
        label="维保项目信息"
      >
        <template #value="{ row }">
          <view v-if="row.pillType === 0" style="display: flex; justify-content: space-around">
            <wd-button
              type="text"
              custom-style="display:flex;color: blue;height:1rem;"
              @click="handleComplete(row)"
            >
              已完成
            </wd-button>
            <wd-button
              type="text"
              custom-style="display:flex;height:1rem;color: green;"
              @click="handleClickPrompt(row)"
            >
              未完成
            </wd-button>
          </view>
          <view v-else-if="row.pillType === 1">已完成</view>
          <view v-else-if="row.pillType === 4">
            {{ row.pillRemark }}
          </view>
        </template>
      </wd-table-col>
    </wd-table>
    <view class="footer">
      <view>
        <wd-checkbox
          @change="handleCheckboxAllChange"
          checked-color="rgb(83, 157, 243)"
          :modelValue="selectAll"
          shape="square"
        >
          全选
        </wd-checkbox>
      </view>
      <!-- <wd-pagination
        show-icon
        v-model="page"
        :total="total"
        @change="showDateByPage"
      ></wd-pagination> -->
    </view>
    <wd-button
      custom-style="background:rgb(83, 157, 243);color:white;"
      type="primary"
      @click="handleClickSubmit"
    >
      确认
    </wd-button>
    <wd-message-box />
  </view>
</template>

<script lang="ts" setup>
/* components */
import { useMessage } from '../../../../../node_modules/wot-design-uni'
// import { useMessage } from 'wot-design-uni'
import { http } from '@/utils/http'
/* service */
import { maintenanceInfo } from './info'
import { uniShowToast } from '@/utils/tools'

const themeVars = reactive({
  buttonPrimaryBgColor: '#07c160',
  buttonPrimaryColor: '#07c160',
})

// 内容区域
// const maintenanceList = ref(maintenanceInfo)
const maintenanceList = ref([])

// 分页
const showData = ref([])
const page = ref(1)
const limit = ref(10)
const total = ref(maintenanceList.value.length)

const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
})

const getFaultList = () => {
  http
    .post('/maint/get_main_project', { maint_id: props.id })
    .then((res) => {
      if (res.list.length === 0) return

      res.list.forEach((element, index) => {
        element.index = index + 1
        if (!element.pillType) element.check = false
      })
      maintenanceList.value = res.list
      console.log('getFaultList :>> ', maintenanceList.value)
      total.value = res.list.length
      // showDataByPage()
    })
    .catch((err) => {
      console.log('getFaultList :>> ', err)
    })
}

// const showDataByPage = ({ index: number }) => {
//   page.value = index || page.value
//   showData.value = maintenanceList.value.slice(
//     (page.value - 1) * limit.value,
//     page.value * limit.value,
//   )
// }

const handleCheckboxChange = (row) => {
  console.log('handleCheckboxChange row :>> ', row)
  maintenanceList.value.forEach((item) => {
    if (item.pillId === row.pillId) {
      item.check = !item.check
    }
  })
  const filterList = maintenanceList.value.filter((item) => item.pillType === 0)
  const falseFlat = filterList.every((item) => item.check === false)
  const trueFlat = filterList.every((item) => item.check === true)
  if (falseFlat) selectAll.value = false
  if (trueFlat) selectAll.value = true

  if (selectAll.value && !trueFlat) {
    selectAll.value = false
  }
}

const handleCheckboxAllChange = () => {
  maintenanceList.value.forEach((item) => {
    if (item.pillType === 0) {
      item.check = !selectAll.value
    }
  })
  selectAll.value = !selectAll.value
}

const msgBoxValue = ref('')

const selectAll = ref(false)
const message = useMessage()

function handleComplete(row) {
  maintenanceList.value.forEach((item) => {
    if (item.pillId === row.pillId) {
      item.pillType = 1
    }
  })
  sendMaintBatchPresent('single', row)
}

function handleClickPrompt(row) {
  message
    .prompt({
      title: '请输入建议',
      inputValue: msgBoxValue.value,
      confirmButtonProps: {
        type: 'primary',
        customStyle: 'background-color:rgb(83, 157, 243);; color: #fff',
      },
    })
    .then((resp) => {
      maintenanceList.value.forEach((item) => {
        if (item.pillId === row.pillId) {
          item.pillRemark = resp.value
          item.pillType = 4
        }
      })
      sendMaintBatchPresent('single', row)
    })
    .catch((error) => {
      console.log(error)
    })
}

const sendMaintBatchPresent = async (type: string, row: any = {}) => {
  const info = []
  if (type === 'single') {
    info.push({
      pill_id: row.pillId,
      pill_type: row.pillType,
      pill_remark: row.pillRemark === '已完成' ? '' : row.pillRemark,
    })
    // 更新维保项目状态
    http.post('/maint/batch_present', { info }).then((res) => {
      console.log('batch_present :>> ', res)
    })
  } else if (type === 'all') {
    getFaultList()
    const list = maintenanceList.value.filter((item) => [0].includes(item.pillType))
    list.forEach((item) => {
      info.push({
        pill_id: item.pillId,
        pill_type: 1,
        pill_remark: item.pillRemark,
      })
    })

    info.length &&
      http.post('/maint/batch_present', { info }).then((res) => {
        emit('changeState')
      })
  }
}

const handleClickSubmit = () => {
  // getFaultList()
  const hasNoDeal = maintenanceList.value.some((item) => [0].includes(item.pillType))

  if (selectAll.value) {
    message
      .confirm({
        msg: '已完成全部选项吗？',
        title: '提示',
        confirmButtonProps: {
          type: 'primary',
          customStyle: 'background-color:rgb(83, 157, 243);; color: #fff',
        },
      })
      .then((resp) => {
        if (selectAll.value !== true) {
          handleCheckboxAllChange()
        }
        sendMaintBatchPresent('all')
        emit('changeState')
      })
  } else if (hasNoDeal) {
    return uniShowToast('请完成所有选项')
  } else {
    emit('changeState')
  }
}

onMounted(() => {
  getFaultList()
})

const emit = defineEmits(['changeState'])
</script>

<style lang="scss" scoped>
$rpx-92: px2rpx(92);

/* 内容区域 */
.table-container {
  @extend %flex-column;
  gap: $rpx-16;
  justify-content: flex-start;
  height: 100%;
  overflow: scroll;
  background: $color-white;
  border-radius: $rpx-20 $rpx-20 0 0;

  :deep() {
    .wd-table__cell {
      .custom-operation {
        display: flex;
        flex-direction: row;
        gap: $rpx-2;
      }
    }
  }

  .footer {
    @extend %flex-center;
    justify-content: space-between;
    padding: $rpx-4 $rpx-16;

    :deep(.wd-pager) {
      width: 80%;
      .wd-pager__current {
        color: $color-primary;
      }
    }
  }
}
</style>
