<style lang="less" scoped>
  @import '../register/register';
</style>

<template>
  <div class="login">
    <div class="login-bg"></div>
    <div class="login-con">
      <Card icon="log-in" title="绑定已有账号" :bordered="false">
        <div class="form-con">
          <bind-form @on-success-valid="handleSubmit" @on-getCode="getCode"></bind-form>
          <p class="login-tip"></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import BindForm from '_c/bind-form'
import { getSmsCode, wxUserBinding } from '../../api/login'
import { mapMutations } from 'vuex'

export default {
  components: {
    BindForm
  },
  methods: {
    ...mapMutations([
      'setUserInfo',
      'setToken'
    ]),
    async handleSubmit (data) {
      let res = await wxUserBinding({ userNo: data.userNo, smsCode: data.smsCode, openid: this.$route.query.openid })
      if (res.data.code === 'success') {
        this.setUserInfo(res.data.result)
        this.setToken(res.data.result.token)
        this.$router.push({ name: 'home' })
      } else {
        this.$Message.error(res.data.result)
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
