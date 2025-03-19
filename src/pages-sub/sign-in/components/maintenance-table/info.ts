export const maintenanceInfo = Array.from({ length: 20 }, (value, index) => ({
  id: index,
  name: '机房环境',
  value: '清洁，室温符合要求，门窗完好，照明正常',
  check: false,
  suggestion: '',
}))
