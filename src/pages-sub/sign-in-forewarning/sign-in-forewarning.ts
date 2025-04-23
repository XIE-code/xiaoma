// 定义接口
export interface IRepairInfo {
  repairType: number
  faultSyn: string
}
// 急修单详情中的data.ele数据
export interface EleInfo {
  elevator_number: number
  name: string
  model: string
  type: string
  load: number
  speed: string
  s_d_f: string
  longitude: number
  latitude: number
  address: string
  variety_type: string
  user_name: number
  phone: number
  company_id: number
}
// 急修单详情中的data.repair数据
export interface RepairInfo {
  id: number
  repair_sn: string
  repair_type: number
  fault_source: number
  fault_syn: string
  fault_start_time: string
  fault_end_time: string
  iden: number
  signature_img_one: string
  signature_img_two: string
  signature_img_three: string
  suggest: number
  is_replace: number
  content: string
  name: string
  fault_attr: number
  group_name: number
  is_authority: number
  video: number
  image: number
}
