<template>
  <div class="aside-wrap">
    <div class="aside-list">
      <div class="aside-item " v-for="(item, index) in menu" :class="name === item.name ? 'active' : ''"  @click="changeItem(item.name)">
        <div class="title">
          <Icon :type="item.meta.icon" class="icon"/>
          {{ item.meta.title }}
          <Badge :count="count" v-if="item.meta.title==='申请管理'"></Badge>
          <Badge :count="updateMsg" v-if="item.meta.title==='系统更新'"></Badge>
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
      name: '',
      menu: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo,
      count: state => state.app.applyCount,
      updateMsg: state => state.app.updateMsg
    })
  },
  watch: {
    $route: {
      handler (newVal, old) {
        this.name = newVal.name
        // console.log(newVal)
        if (newVal.name === 'userConfig') {
          this.$router.replace({ name: this.menu[0].name })
        }
      },
      deep: true
    }
  },
  methods: {
    // ...mapActions(['getApplyCount']),
    changeItem (name) {
      this.$router.push({ name: name })
      this.path = name
    },
    /* async selNewMessage () {
      let res = await selNewMessage()
      if (res.data.code === 'success') {
        this.count = res.data.result
      }
    }, */
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
    this.$router.push({ name: this.menu[0].name })
    this.name = this.$route.name
    // this.getApplyCount()
  }
}
</script>
<style scoped lang="less">
@import "aside";
</style>
