<template>
  <div class="main-content">
    <Tabs value="tab1">
      <TabPane label="修改用户信息" name="tab1">
        <Row justify="center" type="flex" style="margin-top: 50px;">
          <Col span="8">
            <Form :model="insUserForm" :label-width="80" ref="addUser" :rules="insUserFormValidate"  label-position="left">
              <FormItem label="账号">
                <Input v-model="insUserForm.userNo" placeholder="请输入用户账号" disabled v-if=""></Input>
              </FormItem>
              <FormItem label="用户名" prop="userName">
                <Input v-model="insUserForm.userName" autocomplete ="new-password" placeholder="请输入用户名"></Input>
              </FormItem>
              <FormItem label="密码" prop="password">
                <Input v-model="insUserForm.password" autocomplete ="new-password" placeholder="请输入密码" type="password"></Input>
              </FormItem>
              <FormItem label="确认密码" prop="ensurePassword">
                <Input v-model="insUserForm.ensurePassword" autocomplete ="new-password" placeholder="请确认密码" type="password"></Input>
              </FormItem>
              <FormItem label="角色名称">
                <Select v-model="insUserForm.roleName" disabled>
                  <Option :value="item.roleName" v-for="(item, index) in roleNameList">{{item.roleName}}</Option>
                </Select>
              </FormItem>
            </Form>
            <Row justify="center" type="flex" style="margin-top: 40px;">
              <Button type="primary" long :loading="saveLoading" @click="handleSubmit('addUser')" ghost>保存</Button>
            </Row>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { selUserInfo, updateUser, insUser, uptUserStatus } from '../../../api/userManage'
import { selRoleInfo } from '../../../api/roleInfo'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'userInfo',
  data () {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请确认密码'))
      } else if (value !== this.insUserForm.password) {
        callback('两次输入的密码不一致')
      } else {
        callback()
      }
    }
    return {
      saveLoading: false,
      roleNameList: [],
      insUserForm: {
      },
      insUserFormValidate: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' },
          { type: 'string', max: 15, message: '密码不能大于15位', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change', type: 'number' }
        ],
        ensurePassword: [
          { required: true, trigger: 'blur', validator: validatePassword },
          { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' },
          { type: 'string', max: 15, message: '密码不能大于15位', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo
    })
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    /* 获取用户信息 */
    async selUserInfo (userName) {
      let res = await selUserInfo({ userName: userName })
      //console.log(res)
      if (res.data.code === 'success') {
        this.insUserForm = res.data.result[0]
        this.insUserForm.password = ''
      }
    },
    /* 修改用户信息 */
    async updateUser () {
      //console.log({ ...this.insUserForm })
      let json = {
        ...this.insUserForm
      }
      let res = await updateUser(json)
      //console.log(res)
      if (res.data.code === 'success') {
        this.$Message.success('操作成功')
        this.handleLogin({ userNo: this.insUserForm.userNo, password: this.insUserForm.password }).then(res => {
          if (res.data.code === 'success') {
            this.selUserInfo(this.userInfo.userName)
          } else {
            this.$Message.error(res.data.result)
          }
        })
      }
      // console.log(res)
    },
    /* 获取角色列表 */
    async selRoleInfo () {
      let res = await selRoleInfo()
      if (res.data.code === 'success') {
        this.roleNameList = res.data.result
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.updateUser()
        } else {
          this.$Message.error('操作失败，请检查输入信息格式是否正确!')
        }
      })
    },
  },
  mounted () {
    this.selRoleInfo()
    this.selUserInfo(this.userInfo.userName)
  }
}
</script>
<style lang="less" scoped>
  @import "userInfo";
</style>
