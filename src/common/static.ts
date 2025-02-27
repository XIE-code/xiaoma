const baseSvgUrl = import.meta.env.VITE_STATIC_BASEURL + '/svg'
const baseImageUrl = import.meta.env.VITE_STATIC_BASEURL + '/image'
const baseTabbarUrl = import.meta.env.VITE_STATIC_BASEURL + '/tabbar'

export const svgStatic = {
  aboutUs: `${baseSvgUrl}/about-us.svg`,
  addElevator: `${baseSvgUrl}/add-elevator.svg`,
  address: `${baseSvgUrl}/address.svg`,
  archive: `${baseSvgUrl}/archive.svg`,
  back: `${baseSvgUrl}/back.svg`,
  certificate: `${baseSvgUrl}/certificate.svg`,
  changePassword: `${baseSvgUrl}/change-password.svg`,
  cubeBlue: `${baseSvgUrl}/cube-blue.svg`,
  cubeGreen: `${baseSvgUrl}/cube-green.svg`,
  cubeRed: `${baseSvgUrl}/cube-red.svg`,
  dashed: `${baseSvgUrl}/dashed.svg`,
  files: `${baseSvgUrl}/files.svg`,
  knowledge: `${baseSvgUrl}/knowledge.svg`,
  monitor: `${baseSvgUrl}/monitor.svg`,
  myNews: `${baseSvgUrl}/my-news.svg`,
  notificationError: `${baseSvgUrl}/notification-error.svg`,
  notificationPrimary: `${baseSvgUrl}/notification-primary.svg`,
  notificationSecondary: `${baseSvgUrl}/notification-secondary.svg`,
  notification: `${baseSvgUrl}/notification.svg`,
  star: `${baseSvgUrl}/star.svg`,
}

export const imageStatic = {
  homeLogo: `${baseImageUrl}/home-logo.png`,
  lifeCycleSwiper: `${baseImageUrl}/life-cycle-swiper.png`,
  liftSwiper: `${baseImageUrl}/lift-swiper.png`,
  loginBottom: `${baseImageUrl}/login-bottom.png`,
  loginLogo: `${baseImageUrl}/login-logo.png`,
  loginMedium: `${baseImageUrl}/login-medium.png`,
  loginTop: `${baseImageUrl}/login-top.png`,
  document: `${baseImageUrl}/document.png`,
  lift: `${baseImageUrl}/lift.jpg`,
}

export const tabbarStatic = {
  home: `${baseTabbarUrl}/home.png`,
  homeSelect: `${baseTabbarUrl}/home-select.png`,
  maintenance: `${baseTabbarUrl}/maintenance.png`,
  maintenanceSelect: `${baseTabbarUrl}/maintenance-select.png`,
  personal: `${baseTabbarUrl}/personal.png`,
  personalSelect: `${baseTabbarUrl}/personal-select.png`,
  urgentRepair: `${baseTabbarUrl}/urgent-repair.png`,
  urgentRepairSelect: `${baseTabbarUrl}/urgent-repair-select.png`,
}
