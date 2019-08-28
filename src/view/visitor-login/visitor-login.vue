<template>
  <div class="welcome">
    <Alert show-icon type="warning">
      提示：
      <Icon type="ios-bulb-outline" slot="icon"></Icon>
      <template slot="desc">
        您正在尝试接入受控网络，该局域网络属于专有网络,如果您是合法访问用户,请通过以下方式接入网络:
      </template>
    </Alert>
    <Divider>选择登录方式</Divider>
    <div class="con">
      <Card :bordered="false" dis-hover style="width: 400px;height: 80%">
        <div class="login-wrap">
          <div class="tab tab1" v-show="tab === 'tab1'">
            <div class="title">
              <span>雇员登录</span>
              <span @click="visitorLogin">访客登录</span>
            </div>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" class="form">
              <FormItem label="" prop="name">
                <Input v-model="formValidate.name" placeholder="用户名"></Input>
              </FormItem>
              <FormItem label="" prop="phone">
                <Input v-model="formValidate.phone" placeholder="手机号"></Input>
              </FormItem>
              <FormItem label="" prop="code">
                <div style="display: flex; align-items: center;justify-content: center">
                  <Input v-model="formValidate.code" placeholder="请输入验证码" style="width: 50%;">
                  </Input>
                  <Button style="flex: 1;margin-left: 20px;" @click="getCode">{{this.content}}</Button>
                </div>
              </FormItem>
              <FormItem>
                <Button type="primary" long @click="handleSubmit('formValidate')">登录</Button>
              </FormItem>
            </Form>
          </div>
          <div class=" tab tab2" v-show="tab === 'tab2'">
            <div class="title">
              <span>访客登录</span>
              <span @click="tab = 'tab1'">雇员登录</span>
            </div>
            <div id="qrcode"></div>
          </div>
        </div>

      </Card>
    </div>

    <div class="footer">
      <Divider>感谢使用Wingsbro Nacsys系统</Divider>
    </div>
  </div>
</template>
<script>
import { wxUserLogin, getSmsCode, addStaffNetworking } from '../../api/login'
export default {
  data () {
    const  validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        callback('手机号格式不正确')
      } else {
        callback()
      }
    }
    return {
      tab: 'tab1',
      formValidate: {
        name: '',
        phone: '',
        code: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请填写账号', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { type: 'string', min: 4, message: '验证码输入错误', max: 4 }
        ]
      },
      content: '获取验证码', // 按钮内容
      totalTime: 60,  // 倒计时
      canClick: true // 是否可点击
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addStaffNetworking()
        } else {
          this.$Message.error('请检查输入信息是否正确!')
        }
      })
    },
    // 雇员登录
    async addStaffNetworking () {
      let json = {
        staffName: this.formValidate.name,
        staffTel: this.formValidate.phone,
        smsCode: this.formValidate.code,
        staffIP: this.$route.query.ip,
        nbCode: this.$route.query.nbCode
      }
      let res = await addStaffNetworking(json)
      //console.log(res)
      if (res.data.code === 'success') {
        this.$Notice.success({
          title: '提示',
          desc: res.data.result,
          duration: 0
        });
      } else {
        this.$Notice.error({
          title: '提示',
          desc: res.data.result,
          duration: 0
        });
      }

    },
    // 访客登录
    visitorLogin () {
      this.tab = 'tab2'
      this.weChatLogin()
    },
    async weChatLogin () {
      this.createWxQrcode()
    },
    /* weixin */
    createWxQrcode () {
      let json = this.$route.query
      console.log(json)
      var obj=new WxLogin(this.$config.wxConfig)
    },
    // 验证是否扫码登录
    async checkWxLogin () {
      if (this.$route.query.code || this.$route.query.nbCode){
        // 存储参数
        if (this.$route.query.nbCode) {
          let visitorParams = JSON.stringify(this.$route.query)
          sessionStorage.setItem('visitorParams', visitorParams)
        }
        // 重定向后取出参数
        if (this.$route.query.code) {
          let visitorParams = JSON.parse(sessionStorage.getItem('visitorParams'))
          if (!visitorParams) return
          let json = {
            code : this.$route.query.code[1],
            ...visitorParams
          }

          let res = await wxUserLogin(json)
           // console.log(res)
          if (res.data.code === 'success') {
            this.$Notice.success({
              title: '提示',
              desc: res.data.result,
              duration: 0
            });
          } else {
            this.$Notice.error({
              title: '提示',
              desc: res.data.result,
              duration: 0
            });
          }
        }
      } else {
        this.$router.push({ path: '/404' })
      }

    },
    async getCode () {
      if (!this.canClick) return  // 不可重复点击
      if (this.formValidate.phone === ''){
        this.$Message.error('请填写手机号')
        return
      }
      let res = await getSmsCode({ userNo: this.formValidate.phone })
      if (res.data.code === 'success') {
        this.$Message.success(res.data.result)
      }
      this.canClick = false
      this.content = this.totalTime + 's后重新发送'
      let clock = window.setInterval(() => {
        this.totalTime--
        this.content = this.totalTime + 's后重新发送'
        if (this.totalTime < 0) {
          window.clearInterval(clock)
          this.content = '重新发送'
          this.totalTime = 60
          this.canClick = true
        }
      }, 1000)
    }
  },
  mounted () {
    this.visitorLogin()
    this.checkWxLogin()
  }

}
</script>
<style lang="less" scoped>
  @import "visitor-login";
</style>
