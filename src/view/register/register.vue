<style lang="less" scoped>
  @import 'register.less';
</style>

<template>
  <div class="login">
    <div class="login-bg"></div>
    <div class="login-con">
      <Card icon="log-in" title="欢迎注册" :bordered="false">
        <div class="form-con">
          <reg-form @on-success-valid="handleSubmit" @on-getCode="getCode"></reg-form>
          <p class="login-tip"></p>
          <div style="text-align: right">
            <router-link to="/login">已有账号？返回登陆</router-link>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import RegForm from '_c/register-form'
import { register, getSmsCode, checkUserNo, wxUserBinding } from '../../api/login'

export default {
  components: {
    RegForm
  },
  methods: {
    async handleSubmit (data) {
      let json = {
        userNo: data.userNo,
        userName: data.userName,
        password: data.password,
        smsCode: data.smsCode,
        openid: this.$route.query.openid ? this.$route.query.openid : ''
      }
      let res = await register(json)
      if (res.data.code === 'success') {
        this.$Notice.open({
          title: '恭喜！',
          desc: '注册成功，3秒钟后跳转到登陆页！',
          duration: 3
        })
        setTimeout(() => {
          this.$router.push({ path: '/login' })
        }, 3000)
      } else {
        this.$Message.error('注册失败')
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
