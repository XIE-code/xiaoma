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
    <wd-table border :data="maintenanceList" height="100%" fixed customClass="custom-maintenance">
      <wd-table-col fixed align="center" width="15%" prop="check" label="选择">
        <template #value="{ row }">
          <wd-checkbox
            checked-color="rgb(83, 157, 243)"
            :modelValue="row.check"
            shape="square"
            @change="handleCheckboxChange(row)"
          ></wd-checkbox>
        </template>
      </wd-table-col>
      <wd-table-col fixed align="center" width="15%" prop="id" label="序号">
        <template #value="{ row }">{{ row.id }}</template>
      </wd-table-col>
      <wd-table-col
        align="center"
        width="22%"
        fixed
        prop="name"
        label="维护保养项目"
      ></wd-table-col>
      <wd-table-col align="center" width="20%" prop="value" label="维护保养基本要求"></wd-table-col>
      <wd-table-col align="center" width="28%" prop="value" label="操作">
        <template #value="{ row }">
          <view class="table-operation">
            <wd-button type="text" @click="handleClickPrompt(row)" style="color: blue">
              已完成
            </wd-button>
            <wd-button type="text" @click="handleClickPrompt(row)">未完成</wd-button>
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
      <wd-pagination show-icon v-model="page" :total="total" @change="getFaultList"></wd-pagination>
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
import { useMessage } from 'wot-design-uni'
import { http } from '@/utils/http'
/* service */
import { ILiftListResponse } from '@/pages-sub/service/lift/type'
import { maintenanceInfo } from './info'

// 内容区域
const maintenanceList = ref<ILiftListResponse[]>(maintenanceInfo)

const page = ref(1)
const limit = ref(10)
const total = ref(maintenanceList.value.length)

const getFaultList = (event) => {
  http.post('/maint/fault_order', { page: event.value, limit: limit.value }).then((res) => {
    res.list.forEach((element) => {
      const stateList = [
        '待审核',
        '待接警',
        '待处理',
        '到达现场处理中',
        '维修完成',
        '误报确认',
        '自动修复',
      ]
      element.repairType = stateList[element.repairType]
    })
    maintenanceList.value = res.list
    total.value = res.count
  })
}

const handleCheckboxChange = (row) => {
  const index = row.id
  maintenanceList.value[index].check = !maintenanceList.value[index].check
  console.log(row)
}

const handleCheckboxAllChange = () => {
  maintenanceList.value = maintenanceList.value.map((item) => {
    item.check = !selectAll.value
    return item
  })
  selectAll.value = !selectAll.value
}

const msgBoxValue = ref('')

const selectAll = ref(false)
const message = useMessage()

function handleClickPrompt(row) {
  message
    .prompt({
      title: '请输入建议',
      inputValue: msgBoxValue.value,
    })
    .then((resp) => {
      maintenanceList.value[row.id].suggestion = resp.value
      console.log(maintenanceList.value[row.id].suggestion)
    })
    .catch((error) => {
      console.log(error)
    })
}

const handleClickSubmit = () => {
  console.log('btn-submit :>> ')
  if (selectAll.value) {
    message
      .confirm({
        msg: '已完成全部选项吗？',
        title: '提示',
      })
      .then((resp) => {
        emit('changeState')
      })
  } else {
    emit('changeState')
  }
}

onShow(() => {
  // getFaultList({ value: 1 })
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

  :deep(.wd-table) {
    .table-operation {
      @extend %flex-center;
      gap: $rpx-2;
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

  :deep(.wd-message-bo) {
    .wd-button .is-primary {
      background: $color-primary;
    }
  }
}
</style>
