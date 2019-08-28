<template>
  <Row type="flex" justify="center" >
    <div class="select-box">
      <div class="select-panel">
        <div class="title">
          选择注册或关联账号
        </div>
        <div class="item">
          <h3>注册新账号</h3>
          <p>
            使用此微信注册一个新账号
          </p>
          <div class="arrow"  @click="$router.push({ path:'register',query:{ openid: openid }})">
            <Icons type="icon-arrow-up" color="#00a4ff" :size="40" ></Icons>
          </div>
        </div>
        <div class="item" >
          <h3>关联已有账号</h3>
          <p>
            关联此微信到已有账号，，您可以通过微信快速登录
          </p>
          <div class="arrow" @click="$router.push({ path:'bind',query:{ openid: openid }})">
            <Icons type="icon-arrow-up" :size="40" ></Icons>
          </div>
        </div>
      </div>
    </div>
  </Row>
</template>
<script>
export default {
  name: 'fillUserInfo',
  data () {
    return {
      openid: ''
    }
  },
  mounted () {

  }
}
</script>
<style scoped lang="less">
  @import "login";
</style>
