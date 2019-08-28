<style lang="less" scoped>
  @import '../../view/register/register.less';
</style>

<template>
  <div class="login">
    <div class="login-bg"></div>
    <div class="login-con">
      <Card icon="log-in" title="重置密码" :bordered="false">
        <div class="form-con">
          <forgot-form @on-success-valid="handleSubmit" @on-getCode="getCode"></forgot-form>
          <p class="login-tip"></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import ForgotForm from '_c/forgot-form'
import { getSmsCode, getBackPassWord } from '../../api/login'
export default {
  components: {
    ForgotForm
  },
  methods: {
    async handleSubmit (data) {
      let json = {
        phoneNumber: data.userNo,
        password: data.password,
        codeMsg: data.smsCode
      }
      let res = await getBackPassWord(json)
      if (res.data.code === 'success') {
        this.$Notice.open({
          title: '密码已重置成功，请重新登录！',
          desc: '3秒钟后将跳转到登录页。',
          duration: 3
        })
        setTimeout(() => {
          this.$router.push({ path: '/login' })
        }, 3000)
      } else {
        this.$Message.error('重置失败！')
      }
    },
    async getCode (data) {
      let res = await getSmsCode({ userNo: data })
      if (res.data.code === 'success') {
        this.$Message.success(res.data.result)
      }
    }
  },
  mounted () {
  }
}
</script>

<style>

</style>
