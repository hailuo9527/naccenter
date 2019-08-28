import MyHome from '@/components/my-home'
import Layout from '@/components/layout'
import Controler from '@/components/systemControl'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

let appRouters = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录'
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: 'register - 注册'
    },
    component: () => import('@/view/register/register.vue')
  },
  {
    path: '/bind',
    name: 'bind',
    meta: {
      title: '绑定'
    },
    component: () => import('@/view/bind/bind.vue')
  },
  {
    path: '/forgotPassword',
    name: 'forgotPassword',
    meta: {
      title: '重置密码'
    },
    component: () => import('@/view/forgot-password/forgot-password.vue')
  },
  {
    path: '/visitorLogin',
    name: 'visitorLogin',
    meta: {
      title: '访客登录'
    },
    component: () => import('@/view/visitor-login/visitor-login.vue')
  },
  {
    path: '/',
    name: '_myHome',
    redirect: '/home',
    component: MyHome,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页'
        },
        component: () => import('@/view/home/home.vue')
      }
    ]
  },
  {
    path: '/chart',
    component: Layout,
    children: [
      {
        path: '',
        name: 'chartChild',
        meta: {
          title: '图表',
          notCache: true
        },
        component: () => import('@/view/chart/chart.vue')
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    children: [
      {
        path: '',
        name: 'configChild',
        meta: {
          title: '配置',
          notCache: true
        },
        component: () => import('@/view/config/config.vue')
      }
    ]
  },

  {
    path: '/management',
    component: Layout,
    children: [
      {
        meta: {
          title: '资产视图',
          notCache: true
        },
        path: '',
        name: 'managementChild',
        component: () => import('@/view/management/management.vue')
      }
    ]
  },
  {
    path: '/warning',
    component: Layout,
    children: [
      {
        meta: {
          title: '报警',
          notCache: true
        },
        path: '',
        name: 'warningChild',
        component: () => import('@/view/warning/warning.vue')
      }
    ]
  },
  {
    path: '/ipManage',
    component: Layout,
    children: [
      {
        meta: {
          title: 'ip管理',
          notCache: true
        },
        path: '',
        name: 'ipManageChild',
        component: () => import('@/view/ip-manage/ip-manage.vue')
      }
    ]
  }
]
export const systemChild = [
  {
    path: '/system/userManage',
    name: 'userManage',
    meta: {
      access: 1,
      icon: 'ios-settings',
      title: '用户管理'
    },
    component: () => import('@/view/system/userManage/userManage.vue')
  },
  {
    path: '/system/roleManage',
    name: 'roleManage',
    meta: {
      access: 1,
      icon: 'ios-contact',
      title: '角色管理'
    },
    component: () => import('@/view/system/roleManage/roleManage.vue')
  },
  {
    path: '/system/groupManage',
    name: 'groupManage',
    meta: {
      icon: 'md-contacts',
      title: '分组管理'
    },
    component: () => import('@/view/system/groupManage/groupManage.vue')
  },
  {
    path: '/system/applyManage',
    name: 'applyManage',
    meta: {
      icon: 'md-text',
      title: '申请管理'
    },
    component: () => import('@/view/system/bind-apply/bindApply.vue')
  },
  {
    path: '/system/userInfo',
    name: 'userInfo',
    meta: {
      icon: 'ios-build',
      title: '修改个人信息'
    },
    component: () => import('@/view/system/userInfo/userInfo.vue')
  }
]
let accessRouters = [
  // 设置路由
  {
    path: '/system',
    name: 'userConfig',
    meta: {
      title: '设置'
    },
    component: Controler,
    //redirect: '/system/userManage',
    children: [...systemChild]
  }
]
let err = [
  {
    path: '/401',
    name: 'error_401',
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    component: () => import('@/view/error-page/404.vue')
  }
]

export const routers = [
  ...appRouters,
  ...accessRouters,
  ...err
]
