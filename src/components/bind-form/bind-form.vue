<template>
  <Form ref="regForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userNo">
      <Input v-model="form.userNo" placeholder="请输入手机号">
        <span slot="prepend">
          <Icon :size="16" type="md-phone-portrait"></Icon>
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
      <Button @click="handleSubmit" type="primary" long>绑定</Button>
    </FormItem>
  </Form>
</template>
<script>
import { checkUserNo } from '../../api/login'

export default {
  name: 'RegForm',
  props: {
    userNoRules: {
      type: Array,
      default: function () {
        const  validatePhone = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('手机号不能为空'))
          } else if (!/^1[345789]\d{9}$/.test(value)) {
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
        smsCode: this.smsCodeRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.regForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userNo: this.form.userNo,
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
