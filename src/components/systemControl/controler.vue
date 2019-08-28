<template>
  <Layout class="main" style="height: 100%;">
    <header-bar></header-bar>
    <Layout style="height: 100%;overflow: hidden">
      <div class="container">
        <div class="aside">
          <aside-bar></aside-bar>
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
import AsideBar from './aside/aside'
export default {
  name: 'controler',
  components: { HeaderBar, AsideBar }
}
</script>

<style scoped lang="less">
  @import "controler";
</style>
