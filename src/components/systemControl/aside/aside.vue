<template>
  <div class="aside-wrap">
    <div class="aside-list">
      <div class="aside-item " v-for="(item, index) in menu" :class="path === item.path ? 'active' : ''"  @click="changeItem(item.path)">
        <div class="title">
          <Icon :type="item.meta.icon" class="icon"/>
          {{ item.meta.title }}
          <Badge :count="count" v-if="item.meta.title==='申请管理'"></Badge>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { systemChild } from '../../../router/routers'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'controlerAside',
  data () {
    return {
      path: '',
      menu: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo,
      count: state => state.app.applyCount
    })
  },
  watch: {
    $route: {
      handler (newVal, old) {
        //console.log(newVal)
        this.path = newVal.path
      },
      deep: true
    }
  },
  methods: {
   // ...mapActions(['getApplyCount']),
    changeItem (path) {
      this.$router.push({ path: path })
      this.path = path
    },
    /*async selNewMessage () {
      let res = await selNewMessage()
      if (res.data.code === 'success') {
        this.count = res.data.result
      }
    },*/
    getMenu: function () {
      if (this.userInfo.roleId === 2 || this.userInfo.roleId === 1) {
        this.menu = systemChild
      } else {
        let arr = []
        systemChild.map((item) => {
          if (!item.meta.access) {
            arr.push(item)
          }
        })
        this.menu = arr
      }
    }
  },
  mounted () {
    this.getMenu()
    this.$router.push({ path: this.menu[0].path })
    this.path = this.$route.path
    //this.getApplyCount()
  }
}
</script>
<style scoped lang="less">
@import "aside";
</style>
