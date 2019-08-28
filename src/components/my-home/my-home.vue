<template>
  <Layout class="main" style="height: 100%;">
    <header-bar></header-bar>
    <Layout style="height: 100%;">
      <router-view/>
    </Layout>
  </Layout>
</template>
<script>
import './my-home.less'
import HeaderBar from './components/header/header'
import Logo from '@/assets/images/logo.png'
export default {
  name: 'MyHome',
  data () {
    return {
      Logo
    }
  },
  components: {
    HeaderBar
  }
}
</script>
