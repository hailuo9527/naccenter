<template>
  <div class="main-content">
    <Tabs value="tab1">
      <TabPane label="角色信息" name="tab1">
        <Card bordered :shadow="false">
          <div class="panel-content">
            <div class="role-list">
              <div class="title">
                角色列表
              </div>
              <div class="role-item-wrap">
                <div style="text-align: center; font-size: 12px;color: #999" v-if="!roleList.length">暂无角色</div>
                <div class="role-item"
                     v-if="roleList.length"
                     v-for="(item, index) in roleList"
                     @click="changeRole(item.roleId,index)"
                     :class = "active === index ? 'active': ''">
                  {{item.roleName}}
                  <Icon color="#2d8cf0" type="ios-arrow-forward" v-if="active === index"/>
                </div>
              </div>
              <div class="add">
                <Button long icon="md-add" @click="addModal = true">新增角色</Button>
              </div>
              <Modal
                v-model="addModal"
                title="新增角色"
                :loading="loading"
                @on-ok="add('addRoleForm')">
                <Form ref="addRoleForm" :model="addRoleForm" :rules="addRoleRule" :label-width="80">
                  <FormItem label="角色名" prop="roleName">
                    <Input v-model="addRoleForm.roleName" placeholder="请输入角色名"></Input>
                  </FormItem>
                </Form>
              </Modal>
            </div>
            <div class="menu-list">
              <div class="title">
                菜单列表
              </div>
              <div style="padding:10px;margin-bottom:6px;">
                <Checkbox
                  :indeterminate="indeterminate"
                  :value="checkAll"
                  @click.prevent.native="handleCheckAll">全选</Checkbox>
              </div>
              <Card :bordered="false" style="min-height: 300px">
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange" class="box-group">
                  <Checkbox :label="item.treeId" v-for="(item, index) in allMenu" class="box-item">
                    <span>{{item.treeName}}</span>
                  </Checkbox>
                </CheckboxGroup>
              </Card>
              <div class="save">
                <Button @click="save">保存</Button>
              </div>
            </div>
          </div>
        </Card>
      </TabPane>
      <TabPane label="修改角色" name="tab2">
        <div class="modify">
          <div v-if="!roleList.length" style="text-align: center; font-size: 12px">暂无角色</div>
          <div class="role-item" v-for="(item) in roleList" :key="item.roleId">
            <span class="item-text">
               {{item.roleName}}
            </span>
            <Button type="primary" ghost size="small" @click="modifyRole(item.roleId)" style="margin-right: 10px">修改</Button>
            <Button type="error" ghost size="small" @click="remove(item.roleId)">删除</Button>
          </div>
        </div>
        <Modal
          v-model="modifyModal"
          title="修改角色"
          :loading="loading"
          @on-ok="modify('addRoleForm')">
          <Form ref="addRoleForm" :model="addRoleForm" :rules="addRoleRule" :label-width="80">
            <FormItem label="角色名" prop="roleName">
              <Input v-model="addRoleForm.roleName" placeholder="请输入角色名"></Input>
            </FormItem>
          </Form>
        </Modal>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { bindTreeInfoByRoleId,
  delRoleInfo,
  getTreeByRoleId,
  insRoleInfo,
  selRoleInfo,
  selRoleName,
  uptRoleInfo } from '../../../api/roleInfo'
import { selectAllMenu } from '../../../api/menuManage'
import { mapState } from 'vuex'
export default {
  name: 'roleManage',
  data () {
    const validateRoleName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入角色名！'))
      }
      selRoleName({ roleName: value, parentId: this.userInfo.parentId }).then((res) => {
        if (res.data.result === '角色名已存在！') {
          callback(new Error('该角色名已存在！'))
        } else {
          callback()
        }
      })
    }
    return {
      active: 0,
      activeRoleId: '',
      modifyRoleId: '',
      indeterminate: true,
      checkAll: false,
      checkAllGroup: [],
      allMenu: [], // 所有菜单
      roleList: [],
      loading: false,
      addModal: false,
      modifyModal: false,
      addRoleForm: {},
      addRoleRule: {
        roleName: [
          { required: true, validator: validateRoleName, trigger: 'change' }
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
    /* 获取所有角色 */
    async selRoleInfo () {
      let res = await selRoleInfo()
      if (res.data.code === 'success') {
        this.roleList = res.data.result || []
        if (this.roleList.length) {
          this.changeRole(this.roleList[0].roleId, 0)
        }
      } else {
        //console.log(res)
      }
    },
    /* 根据id获取菜单 */
    async getTreeByRoleId (roleId) {
      let res = await getTreeByRoleId({ roleId: roleId })
      //console.log(res)
      this.checkAllGroup = []
      if (res.data.code === 'success') {
        res.data.result.map((item, index) => {
          this.checkAllGroup.push(item.treeId)
        })
      }
      // console.log(this.checkAllGroup)
    },
    /* 查询所有菜单 */
    async selectAllMenu (treeId) {
      let res = await selectAllMenu({ treeId: treeId })
      if (res.data.code === 'success') {
        this.allMenu = res.data.result
      }
    },
    /* 新增角色信息 */
    async insRoleInfo (roleName) {
      this.loading = true
      let res = await insRoleInfo({ roleName: roleName, parentId: this.userInfo.parentId })
      if (res.data.code === 'success') {
        this.$Message.success('新增角色成功')
        this.loading = false
        this.addRoleForm.roleName = ''
        this.selRoleInfo()
      }
    },
    /* 修改角色信息 */
    async uptRoleInfo (roleName) {
      this.loading = true
      let res = await uptRoleInfo({ roleName: roleName, roleId: this.modifyRoleId })
      //console.log(res)
      if (res.data.code === 'success') {
        this.loading = false
        this.$Message.success('修改角色成功')
        this.selRoleInfo()
      }
    },
    /* 根据角色Id绑定菜单 */
    async bindTreeInfoByRoleId () {
      let res = await bindTreeInfoByRoleId({ roleId: this.activeRoleId, list: this.checkAllGroup })
      //console.log(res)
      if (res.data.code === 'success') {
        this.$Message.success('保存成功')
      } else {
        this.$Message.error('保存失败')
      }
    },
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false

      if (this.checkAll) {
        let arr = []
        this.allMenu.map((item, index) => {
          arr.push(item.treeId)
        })
        this.checkAllGroup = arr
      } else {
        this.checkAllGroup = []
      }
    },
    checkAllGroupChange (data) {
      if (data.length === this.allMenu.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
    changeRole (roleId, index) {
      this.active = index
      this.activeRoleId = roleId
      this.getTreeByRoleId(roleId)
    },
    add (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.insRoleInfo(this.addRoleForm.roleName)
        } else {
          this.$Message.error('操作失败，请检查输入信息格式是否正确!')
        }
      })
    },
    save () {
      this.bindTreeInfoByRoleId()
    },
    modify (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.uptRoleInfo(this.addRoleForm.roleName)
        } else {
          this.$Message.error('操作失败，请检查输入信息格式是否正确！')
        }
      })
    },
    modifyRole (roleId) {
      this.modifyModal = true
      this.modifyRoleId = roleId
    },
    remove (roleId) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定删除此条角色吗？</p>',
        loading: true,
        onOk: () => {
          delRoleInfo({ roleId: roleId }).then((res) => {
            // console.log(res)
            if (res.data.code === 'success') {
              this.$Modal.remove()
              this.selRoleInfo()
            }
          }).catch((res) => {
           // console.log(res)
          })
        }
      })
    }
  },
  mounted () {
    this.selRoleInfo()
    this.selectAllMenu()

    //
  }
}
</script>
<style lang="less" scoped>
  @import "roleManage";
</style>
