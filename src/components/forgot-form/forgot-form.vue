<template>
  <Form ref="forgotForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userNo">
      <Input v-model="form.userNo" placeholder="请输入手机号">
        <span slot="prepend">
          <Icon :size="16" type="md-phone-portrait"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="ensurePassword" >
      <Input type="password" v-model="form.ensurePassword" placeholder="请再次输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="smsCode">
      <div style="display: flex; align-items: center;justify-content: center">
        <Input v-model="form.smsCode" placeholder="请输入验证码">
        <span slot="prepend">
          <Icon :size="16" type="ios-send"></Icon>
        </span>
        </Input>
        <Button style="flex: 1;margin-left: 20px" @click="getCode">{{this.content}}</Button>
      </div>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>重置密码</Button>
    </FormItem>
  </Form>
</template>
<script>

export default {
  name: 'ForgotForm',
  props: {
    userNoRules: {
      type: Array,
      default: function () {
        const validatePhone = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('手机号不能为空'))
          } else if (!/^1[34578]\d{9}$/.test(value)) {
            callback('手机号格式不正确')
          } else {
            callback()
          }
        }
        return [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: function () {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    ensurePasswordRules: {
      type: Array,
      default: function () {
        const validatePassCheck = (rule, value, callback) => {
          if (value === '') {
            return callback(new Error('请再次输入密码'))
          } else if (value !== this.form.password) {
            return callback(new Error('两次密码不一致'))
          } else {
            callback()
          }
        }
        return [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    },
    smsCodeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { type: 'string', min: 4, message: '验证码输入错误', max: 4 }
        ]
      }
    }

  },
  data () {
    return {
      form: {
        userNo: '',
        password: '',
        ensurePassword: '',
        smsCode: ''
      },
      content: '获取验证码', // 按钮内容
      totalTime: 60,  // 倒计时
      canClick: true // 是否可点击
    }
  },
  computed: {
    rules () {
      return {
        userNo: this.userNoRules,
        password: this.passwordRules,
        ensurePassword: this.ensurePasswordRules,
        smsCode: this.smsCodeRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.forgotForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userNo: this.form.userNo,
            password: this.form.password,
            smsCode: this.form.smsCode
          })
        }
      })
    },
    getCode () {
      if (!this.canClick) return  // 不可重复点击
      this.$emit('on-getCode', this.form.userNo)
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
  }
}
</script>
