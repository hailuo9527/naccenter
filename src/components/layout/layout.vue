<template>
  <Layout class="main" style="height: 100%;">
    <header-bar></header-bar>
    <Layout style="height: 100%;overflow: hidden">
     <div class="container">
       <div class="aside">
         <my-aside></my-aside>
       </div>
       <div class="content">
         <router-view />
       </div>
     </div>
    </Layout>
  </Layout>
</template>
<script>
import HeaderBar from '../my-home/components/header/header'
import MyAside from './components/aside/aside'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'my-layout',
  components: { HeaderBar, MyAside },
  computed: {
    ...mapState({
      activeNb: state => state.app.activeNb,
      asideList: state => state.app.asideList
    })
  },
  methods: {
    ...mapActions([
      'getAsideList'
    ])
  },
  beforeRouteEnter (to, from, next) {
    next()
  },
}
</script>
<style lang="less" scoped>
  @import "./layout";
</style>
