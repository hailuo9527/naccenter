<style lang="less" scoped>
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-bg"></div>
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <div class="forget">
            <router-link to="/forgotPassword">忘记密码?</router-link>
          </div>
          <div class="other">
            <div>
              <span>其他登录方式：</span>
              <Icons type="icon-yooxi" @click.native="weChatLogin"></Icons>
            </div>
            <router-link to="/register" style=" font-size: 12px;">注册</router-link>
          </div>
        </div>
      </Card>
    </div>
    <Modal
      v-model="qrCodeModal"
      title="请使用微信扫码登录！"
      class-name="vertical-center-modal"
      footer-hide width="350">
     <!-- <div class="qrcode" ref="qrCodeUrl" v-if="qrCodeModal" ></div>-->
      <div id="qrcode"></div>
    </Modal>
    <Modal v-model="bindModel" footer-hide fullscreen title="" class-name="bind-modal">
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

    </Modal>
    <Particles/>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { wxUserLogin } from '../../api/login'
import { mapActions, mapMutations } from 'vuex'
import Icons from '_c/icons'
import Particles from '_c/particles'
export default {
  data () {
    return {
      qrCodeModal: false,
      bindModel: false,
      openid: ''
    }
  },
  components: {
    LoginForm, Icons,
    Particles
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    ...mapMutations([
      'setUserInfo',
      'setToken'
    ]),
    handleSubmit (data) {
      this.handleLogin({ userNo: data.userName, password: data.password }).then(res => {
        if (res.data.code === 'success') {
          this.$router.push({
            name: this.$config.homeName
          })
        } else {
          this.$Message.error(res.data.result)
        }
      })
    },
    async weChatLogin () {
      this.qrCodeModal = true
      this.createWxQrcode()
    },
    /* weixin */
    createWxQrcode () {
      var obj=new WxLogin(this.$config.wxConfig)
    },
    // 验证是否扫码登录
    async checkWxLogin () {
      if (this.$route.query.code) {
       // console.log('已扫码')
        let json = {
          code: this.$route.query.code[1]
        }
        let res = await wxUserLogin(json)
        // console.log(res)
        if (res.data.code === 'success') {
          this.setUserInfo(res.data.result)
          this.setToken(res.data.result.token)
          this.$router.push({ name: 'home' })
        } else {
          if (res.data.result) {
            this.bindModel = true
            this.openid = res.data.result
          } else {
            this.$Message.error('请重新扫码')
          }
        }
      }
    }
  },
  mounted() {
    console.log(this.$config.wxConfig.redirect_uri)
    this.checkWxLogin()
  },
  destroyed () {
  }
}
</script>

<style>

</style>
