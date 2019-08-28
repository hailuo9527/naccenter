<template>
  <div class="main-content">
    <Tabs :value="tab" @on-click="tabChange" >
      <TabPane label="用户列表" name="tab1">
        <Table border :columns="tableColumns" :data="userList" :loading="tableLoad">
          <template slot-scope="{ row }" slot="userName">
            <strong>{{ row.userName }}</strong>
          </template>
          <template slot-scope="{ row }" slot="activation">
            {{ row.activation? '是' : '否' }}
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" v-if="row.userNo !== userInfo.userNo" style="margin-right: 5px" @click="show(index, row)">修改</Button>
            <Button type="warning" size="small" v-if="row.userNo === userInfo.userNo" :disabled="row.roleId === '1'" style="margin-right: 5px" @click="changeAccess">权限转让</Button>
          </template>
        </Table>
        <!-- <Table border :columns="columns7" :data="data6" max-height="500"></Table>-->
      </TabPane>
     <!-- <TabPane label="分配用户" name="tab2">
        <Row justify="center" type="flex" style="margin-top: 50px;">
          <Col span="8">
            <Form :model="insUserForm" :label-width="80" ref="addUser" :rules="insUserFormValidate"  label-position="left">
              <FormItem label="账号" prop="userNo">
                <Input v-model="insUserForm.userNo" placeholder="请输入用户账号"></Input>
              </FormItem>
              <FormItem label="用户名" prop="userName">
                <Input v-model="insUserForm.userName" placeholder="请输入用户名"></Input>
              </FormItem>
              <FormItem label="密码" prop="password">
                <Input v-model="insUserForm.password" placeholder="请输入密码"></Input>
              </FormItem>
              <FormItem label="角色名称" prop="roleId">
                <Select v-model="insUserForm.roleId">
                  <Option :value="item.roleId" v-for="(item, index) in roleNameList">{{item.roleName}}</Option>
                </Select>
              </FormItem>
              <FormItem label="激活" style="text-align: right">
                <i-switch v-model="insUserForm.activation" size="large">
                  <span slot="open">On</span>
                  <span slot="close">Off</span>
                </i-switch>
              </FormItem>
            </Form>
            <Row justify="center" type="flex" style="margin-top: 40px;">
              <Button type="primary" long :loading="saveLoading" @click="handleSubmit('addUser')" ghost>保存</Button>
            </Row>
          </Col>
        </Row>

      </TabPane>-->
      <Input search v-model="searchText" placeholder="输入用户名查询" slot="extra" @on-search="selUserInfo(searchText)" v-if="tab === 'tab1'"/>
      <!--修改信息对话框-->
      <Modal
        v-model="modal"
        title="修改用户信息"
        @on-ok="ok">
        <div style="padding: 20px">
          <Form :model="activeUserInfo" :label-width="80" ref="uptUser" :rules="uptUserValidate">
            <FormItem label="用户名" prop="userName">
              <Input v-model="activeUserInfo.userName" placeholder="请输入用户名"></Input>
            </FormItem>
            <!-- <FormItem label="账号">
               <Input v-model="activeUserInfo.userNo" disabled></Input>
             </FormItem>-->
             <FormItem label="角色名称">
               <Select v-model="activeUserInfo.roleId">
                 <Option :value="item.roleId" v-for="(item, index) in roleNameList">{{item.roleName}}</Option>
               </Select>
             </FormItem>
            <FormItem label="激活" style="text-align: right">
              <i-switch v-model="activeUserInfo.activation" size="large">
                <span slot="open">On</span>
                <span slot="close">Off</span>
              </i-switch>
            </FormItem>
          </Form>
        </div>

      </Modal>
      <!--权限转让对话框-->
      <Modal
        v-model="accessModal"
        title="转让权限"
        @on-ok="submitAccessChange">
        <div style="padding: 20px">
          <Form :model="accessForm" :label-width="80" ref="access" :rules="accessRules">
            <FormItem label="选择用户" prop="user">
              <Select v-model="accessForm.activeUserId" @on-change="userChange">
                <Option :value="item.userId" v-if="userInfo.userId !== item.userId" v-for="(item, index) in userList">{{item.userName}}</Option>
              </Select>
            </FormItem>
          </Form>
        </div>

      </Modal>
    </Tabs>
  </div>
</template>
<script>
import { selUserInfo, updateUser, insUser, uptUserStatus } from '../../../api/userManage'
import { roleTransfer } from '../../../api/login'
import { selRoleInfo } from '../../../api/roleInfo'
import { mapState } from 'vuex'

export default {
  name: 'userManage',
  data () {
    const validatePhone = (rule, value, callback) => {
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
      modal: false,
      tableLoad: false,
      saveLoading: false,
      searchText: '',
      activeUserInfo: {
      },
      tableColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'userName',
          slot: 'userName'
        },
        {
          title: '用户账号',
          key: 'userNo'
        },
        {
          title: '角色名称',
          key: 'roleName'
        },
        {
          title: '是否激活',
          key: 'activation',
          slot: 'activation'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          slot: 'action'
        }
      ],
      userList: [],
      roleNameList: [], // 角色名称列表
      insUserForm: {

      },
      insUserFormValidate: {
        userNo: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' },
          { type: 'string', max: 15, message: '密码不能大于15位', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change', type: 'string' }
        ]
      },
      uptUserValidate: {
      },
      accessModal: false,
      accessForm: {
        activeUserId: null
      },
      accessRules: {
        user: [
          { required: true, message: '用户不能为空！', trigger: 'change' }
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
    tabChange (name) {
      // console.log(name)
      this.tab = name
    },
    show (index, row) {
      this.modal = true
      this.activeUserInfo = Object.assign(this.activeUserInfo, row)
      this.activeUserInfo.userName = row.userName
    },
    ok () {
      this.$refs['uptUser'].validate((valid) => {
        if (valid) {
          this.updateUser()
        } else {
          this.$Message.error('操作失败，请检查输入信息格式是否正确!')
        }
      })
    },
    /* 获取用户列表 */
    async selUserInfo (userName) {
      this.tableLoad = true
      let res = await selUserInfo({ userName: userName })
      this.tableLoad = false
      if (res.data.code === 'success') {
        this.userList = res.data.result
      }
    },
    /* 新增用户 */
    async insUser () {
      let json = {
        userNo: this.insUserForm.userNo,
        userName: this.insUserForm.userName,
        password: this.insUserForm.password,
        parentId: this.userInfo.parentId,
        activation: this.insUserForm.activation,
        roleId: this.insUserForm.roleId,
        userId: this.insUserForm.userId
      }
      this.saveLoading = true
      let res = await insUser(json)
      this.saveLoading = false
      if (res.data.code === 'success') {
        this.$Message.success('保存成功')
      } else {
        this.$Message.error('保存失败')
      }
      console.log(res)
    },
    /* 获取角色列表 */
    async selRoleInfo () {
      let res = await selRoleInfo()
      if (res.data.code === 'success') {
        this.roleNameList = res.data.result
      }
    },
    /* 修改用户信息 */
    async updateUser () {
      let json = {
        userNo: this.activeUserInfo.userNo,
        userName: this.activeUserInfo.userName,
        password: this.activeUserInfo.password,
        parentId: this.activeUserInfo.parentId,
        activation: this.activeUserInfo.activation,
        roleId: this.activeUserInfo.roleId,
        userId: this.insUserForm.userId
      }
      let res = await updateUser(json)
      if (res.data.code === 'success') {
        this.$Message.success('操作成功')
        this.selUserInfo()
      }
      // console.log(res)
    },
    /* 修改用户状态 */
    async uptUserStatus () {
      let res = await uptUserStatus({
        userNo: this.activeUserInfo.userNo,
        activation: this.activeUserInfo.activation
      })
      //console.log(res)
      if (res.data.code === 'success') {
        this.$Message.success(res.data.result)
        this.selUserInfo()
      }
    },
    /* 请求转让 */
    async roleTransfer () {
      let res = await roleTransfer({ userId: this.accessForm.activeUserId })
     // console.log(res)
    },
    userChange (data) {
      this.$Message.success(data)
    },
    /* 权限转让 */
    changeAccess () {
      this.$Modal.confirm({
        title: '提示',
        content: '</p>转让后将不能继续使用权限，确定要转让您的权限吗？</p>',
        onOk: () => {
          this.accessModal = true
        },
      })
    },
    submitAccessChange () {
      this.$refs['access'].validate((valid) => {
        if (valid) {
          this.roleTransfer()
        } else {
          this.$Message.error('操作失败，请检查输入信息格式是否正确!')
        }
      })
    },
    /* */
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.insUser()
        } else {
          this.$Message.error('操作失败，请检查输入信息格式是否正确!')
        }
      })
    },
  },
  mounted () {
    this.selUserInfo()
    this.selRoleInfo()
  }
}
</script>
<style lang="less" scoped>
  @import "userManage";
</style>
