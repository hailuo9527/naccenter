<template>
  <div class="main-content">
    <Tabs value="tab1" name="main-tab">
      <TabPane label="分组信息" name="tab1" tab="main-tab">
        <Card bordered :shadow="false">
          <div class="panel-content">
            <div class="role-list">
              <div class="title">
                分组列表
              </div>
              <div class="role-item-wrap">
                <div style="text-align: center;font-size: 12px; color: #999" v-if="!groupList.length">暂无分组</div>
                <div class="role-item"
                     v-for="(item, index) in groupList"
                     @click="changeGroup(item.groupId, index)"
                     :class="active === index ? 'active': ''">
                  {{item.groupName}}
                  <Icon color="#2d8cf0" type="ios-arrow-forward" v-if="active === index"/>
                </div>
              </div>
              <div class="add">
                <Button long icon="md-add" @click="addModal = true">新增分组</Button>
              </div>
              <Modal
                v-model="addModal"
                title="新增分组"
                :loading="loading"
                @on-ok="add('addGroupForm')">
                <Form ref="addGroupForm" :model="addGroupForm" :rules="addGroupRule" :label-width="80">
                  <FormItem label="分组名" prop="groupName">
                    <Input v-model="addGroupForm.groupName" placeholder="请输入分组名"></Input>
                  </FormItem>
                  <FormItem label="备注">
                    <Input v-model="addGroupForm.remarks" placeholder="请输入分组名"></Input>
                  </FormItem>
                </Form>
              </Modal>
            </div>
            <div class="menu-list">
              <Tabs  v-model="activeNav" name="sub-tab" @on-click="changeNav"  :animated="false">
                <TabPane label="机器列表" name="supTab1" tab="sub-tab">
                  <div style="padding:10px;margin-bottom:6px;">
                    <Checkbox
                      :indeterminate="indeterminate"
                      :value="checkAll"
                      @click.prevent.native="handleCheckAll">全选
                    </Checkbox>
                  </div>
                  <Card :bordered="false" style="min-height: 300px">
                    <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange" class="box-group">
                      <Checkbox :label="item.nbCode" v-for="(item, index) in nbList" class="box-item">
                        <span>{{item.nbName}}</span>
                      </Checkbox>
                    </CheckboxGroup>
                  </Card>
                  <div class="save" style="margin-top: 20px;">
                    <Button @click="save">保存</Button>
                  </div>
                </TabPane>
                <TabPane label="模式参数" name="supTab2" tab="sub-tab">
                  <div class="nav-content">
                    <div class="form-group">
                      <Row :gutter="30">
                        <Col span="12">
                          <div class="form-item">
                            <label for="" class="my-label">btime:</label>
                            <input type="number" class="my-input" @input="handleInput('btime',defaultConfig.btime)"
                                   v-model.trim="defaultConfig.btime" placeholder="请输入正整数，单位秒">
                            <!--<span>请输入正整数，单位秒</span>-->
                          </div>
                        </Col>
                        <Col span="12">
                          <div class="form-item">
                            <label for="" class="my-label">ctime:</label>
                            <input type="number" class="my-input" @input="handleInput('ctime',defaultConfig.ctime)"
                                   v-model.trim="defaultConfig.ctime" placeholder="请输入正整数，单位秒">
                            <!-- <span>请输入正整数，单位秒</span>-->
                          </div>
                        </Col>

                      </Row>
                      <Row :gutter="30">
                        <Col span="12">
                          <div class="form-item">
                            <label for="" class="my-label">ltime:</label>
                            <input type="number" class="my-input" @input="handleInput('ltime',defaultConfig.ltime)"
                                   v-model.trim="defaultConfig.ltime" placeholder="请输入正整数，单位秒">
                            <!-- <span>请输入正整数，单位秒</span>-->
                          </div>
                        </Col>
                      </Row>
                      <Row :gutter="30">
                        <Col span="12">
                          <div class="form-item">
                            <label for="" class="my-label">学习模式:</label>
                            <i-switch v-model="defaultConfig.learning"/>
                          </div>
                        </Col>
                        <Col span="12">
                          <div class="form-item">
                            <label for="" class="my-label">单向模式:</label>
                            <i-switch v-model="defaultConfig.single"/>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div class="save"><span @click="uptGroupParam(defaultConfig)">保存</span></div>
                  </div>
                </TabPane>
                <TabPane label="白名单" name="supTab3" tab="sub-tab">
                  <!--白名单-->
                  <div class="nav-content2" >
                    <Row class="table-container">
                      <Table :columns="white" :data="whiteList" :loading="loading"  height="300" :show-header="false" stripe
                             size="small">
                        <template slot-scope="{ row }" slot="macAdress">
                          <span style="font-size: 12px;color: #666">MAC地址：<span style="color: #00e9bc;margin-left: 20px">{{ row.macAddress }}</span></span>
                        </template>
                        <template slot-scope="{ row }" slot="ipAdress">
                          <span style="font-size: 12px;color: #666">IP地址：<span style="color: #00e9bc;margin-left: 20px">{{ row.ipAddress }}</span></span>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                          <Icon type="ios-trash" size="24" color="#00e9bc" @click="removeList(row.id, index)"/>
                        </template>
                      </Table>
                    </Row>
                    <Row type="flex" justify="space-between" class="opera">
                      <Col>
                      </Col>
                      <Col class="btn-group">
                        <span @click="addWhiteModel = true">添加</span>
                        <span @click="removeAll" v-if="whiteList.length>0">清空列表</span>
                      </Col>
                    </Row>
                    <Modal v-model="addWhiteModel" width="360"  >
                      <p slot="header" style="color:#333;text-align:center">
                        <span>添加白名单</span>
                      </p>
                      <div style="text-align:center">
                        <Form :model="addWhiteForm"  label-position="left" ref="whiteFormRules" :rules="whiteFormRules">
                          <FormItem label="mac地址" prop="macAdress">
                            <Input v-model.trim="addWhiteForm.macAdress" placeholder="请输入mac地址"></Input>
                          </FormItem>
                          <FormItem label="ip地址" prop="ipAdress">
                            <Input v-model.trim="addWhiteForm.ipAdress" placeholder="请输入ip地址"></Input>
                          </FormItem>
                        </Form>
                      </div>
                      <div slot="footer">
                        <Button type="info" size="large" long :loading="addWhiteLoading" @click="handleSubmit('whiteFormRules')">确认添加</Button>
                      </div>
                    </Modal>
                  </div>
                </TabPane>
                <TabPane label="忽略名单" name="supTab4" tab="sub-tab">
                  <div class="nav-content2" >
                    <Row class="table-container">
                      <Table :columns="ignore" height="300" :data="ignoreList" :loading="loading" :show-header="false" stripe
                             size="small">
                        <template slot-scope="{ row }" slot="mac">
                          <span style="font-size: 12px;color: #666">MAC地址：<span style="color: #00e9bc;margin-left: 20px">{{ row.macAddress }}</span></span>
                        </template>
                        <template slot-scope="{ row }" slot="ip">
                          <span style="font-size: 12px;color: #666">IP地址：<span style="color: #00e9bc;margin-left: 20px">{{ row.ipAddress }}</span></span>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                          <Icon type="ios-trash" size="24" color="#00e9bc" @click="removeList(row.id, index)"/>
                        </template>
                      </Table>
                    </Row>
                    <Row type="flex" justify="space-between" class="opera">
                      <Col>

                      </Col>
                      <Col class="btn-group">
                        <span @click="addIgnoreModel = true">添加</span>
                        <span @click="removeAll" v-if="ignoreList.length>0">清空列表</span>
                      </Col>
                    </Row>
                    <Modal v-model="addIgnoreModel" width="360">
                      <p slot="header" style="color:#333;text-align:center">
                        <span>添加忽略名单</span>
                      </p>
                      <div style="text-align:center">
                        <Form :model="addIgnoreForm" label-position="left" ref="ignoreFormRules" :rules="ignoreFormRules">
                          <FormItem label="mac地址" prop="macAdress">
                            <Input v-model.trim="addIgnoreForm.macAdress" placeholder="请输入mac地址"></Input>
                          </FormItem>
                          <FormItem label="ip地址" prop="ipAdress">
                            <Input v-model.trim="addIgnoreForm.ipAdress" placeholder="请输入ip地址"></Input>
                          </FormItem>
                        </Form>
                      </div>
                      <div slot="footer">
                        <Button type="info" size="large" long :loading="addIgnoreLoading" @click="handleSubmit('ignoreFormRules')">确认添加</Button>
                      </div>
                    </Modal>
                  </div>
                </TabPane>

              </Tabs>
            </div>
          </div>
        </Card>
      </TabPane>
      <TabPane label="修改分组" name="tab2" tab="main-tab">
        <Row type="flex" justify="center">
          <Col span="24">
            <div class="modify">
              <div v-if="!groupList.length">暂无分组</div>
              <div class="role-item" v-for="(item) in groupList" :key="item.roleId">
                <span class="item-text">
                   {{item.groupName}}
                </span>
                <Button type="primary" ghost size="small" @click="modify(item.groupId)" style="margin-right: 10px">修改</Button>
                <Button type="error" ghost size="small" @click="remove(item.groupId)">删除</Button>
              </div>
            </div>
          </Col>
        </Row>
        <Modal
          v-model="modifyModal"
          title="修改分组"
          :loading="groupLoading"
          @on-ok="modifyHandler('addGroupForm')">
          <Form ref="addGroupForm" :model="addGroupForm" :rules="addGroupRule" :label-width="80">
            <FormItem label="分组名" prop="groupName">
              <Input v-model="addGroupForm.groupName" placeholder="请输入分组名"></Input>
            </FormItem>
          </Form>
        </Modal>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import {
  addGroup,
  addNbToGroup,
  delGroup,
  delGroupRoster,
  getGroupRoster,
  insGroupRoster,
  getAllGroup,
  selNbByGroupId,
  getNbCodeInfoByGroupId,
  updateNbGroup,
  uptGroupParam
} from '../../../api/group.js'

import { mapState } from 'vuex'

export default {
  name: 'roleManage',
  data () {
    const validategroupName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入分组名！'))
      }
      callback()
    }
    const macAddressRules = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入MAC地址'))
      } else {
        let reg = /[A-F\d]{2}[:-][A-F\d]{2}[:-][A-F\d]{2}[:-][A-F\d]{2}[:-][A-F\d]{2}[:-][A-F\d]{2}/
        if (!reg.test(value)) {
          callback(new Error('请检查IP地址格式！'))
        }
      }
      callback()
    }
    const ipAddress = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入IP地址'))
      } else {
        let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (!reg.test(value)) {
          callback(new Error('请检查IP地址格式！'))
        }
      }
      callback()
    }
    return {
      active: 0,
      activeGroupId: '',
      indeterminate: true,
      checkAll: false,
      nbList: [],
      checkAllGroup: [],
      groupList: [],
      groupLoading: false,
      addModal: false,
      modifyModal: false,
      addGroupForm: {},
      addGroupRule: {
        groupName: [
          { required: true, validator: validategroupName, trigger: 'blur' }
        ]
      },
      activeModifyGroupId: null,
      activeNav: 'supTab1',
      loading: false,
      white: [
        {
          title: 'Mac地址',
          slot: 'macAddress',
        },
        {
          title: 'Ip地址',
          slot: 'ipAddress'
        },

        {
          title: 'Action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      whiteList: [],
      ignore: [
        {
          title: 'Mac地址',
          slot: 'mac',
        },
        {
          title: 'Ip地址',
          slot: 'ip'
        },

        {
          title: 'Action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      ignoreList: [],
      defaultConfig: {
        btime: '',
        ctime: '',
        ltime: '',
        learning: false,
        single: false
      },
      addWhiteModel: false,
      addWhiteLoading: false,
      addWhiteForm: {
        macAdress: null,
        ipAdress: null
      },
      whiteFormRules: {
        macAdress: [
          { required: true, validator: macAddressRules, trigger: 'blur' }
        ],
        ipAdress: [
          { required: true, validator: ipAddress, trigger: 'blur' }
        ]
      },
      addIgnoreLoading: false,
      addIgnoreModel: false,
      addIgnoreForm: {
        macAdress: null,
        ipAdress: null
      },
      ignoreFormRules: {
        macAdress: [
          { required: true, validator: macAddressRules, trigger: 'blur' }
        ],
        ipAdress: [
          { required: true, validator: ipAddress, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo,
      //nbList: state => state.app.asideList
    })
  },
  methods: {
    /* 获取所有分组 */
    async getAllGroup () {
      let res = await getAllGroup()
      //console.log(res)
      if (res.data.code === 'success') {
        this.groupList = res.data.result
        if (this.groupList[0] !== undefined) {
          this.changeGroup(this.groupList[0].groupId || '', 0)
        }
      } else {
       // console.log(res.data.result)
      }
    },
    /* 根据id获取菜单 */
    async getNbCodeInfoByGroupId (groupId) {
      let res = await getNbCodeInfoByGroupId({ groupId: groupId })
      // console.log(res)
      this.checkAllGroup = []
      if (res.data.code === 'success') {
        if (!res.data.result) return
        res.data.result.map((item, index) => {
          this.checkAllGroup.push(item.nbCode)
        })
      }
      // console.log(this.checkAllGroup)
    },
    /* 新增分组信息 */
    async addGroup () {
      this.loading = true
      let res = await addGroup({ ...this.addGroupForm })
      if (res.data.code === 'success') {
        this.$Message.success('新增分组成功')
        this.loading = false
        this.addGroupForm = {}
        this.getAllGroup()
      } else {
        this.$Message.error(res.data.result)
      }
    },
    /* 修改分组信息 */
    async uptGroupInfo (groupName, groupId) {
      this.loading = true
      let res = await updateNbGroup({ groupId: groupId, groupName: groupName, parentId: this.userInfo.parentId })
      // console.log(res)
      if (res.data.code === 'success') {
        this.loading = false
        this.$Message.success('修改分组成功')
        this.getAllGroup()
      } else {
        this.$Message.error(res.data.result)
      }
    },
    /* 删除分组 */
    async delGroup (groupId) {
      let res = await delGroup(groupId)
      this.$Modal.remove()
      if (res.data.code === 'success') {
        this.getAllGroup()
        this.$Message.success('删除成功！')
      } else {
        this.$Message.error(res.data.result)
      }
    },
    /* 添加机器到分组 */
    async addNbToGroup () {
      let res = await addNbToGroup({ groupId: this.activeGroupId }, this.checkAllGroup)
      if (res.data.code === 'success') {
        this.$Message.success('保存成功！')
      } else {
        this.$Message.error(res.data.result)
      }
    },
    /* 根据分组查找nb */
    async selNbByGroupId (groupId) {
      let res = await selNbByGroupId(groupId)
      if (res.data.code === 'success') {
        this.nbList = res.data.result
      }
    },
    /* 保存模式设置 */
    async uptGroupParam (arr) {
      let args = Object.assign({}, arr)
      args.groupId = this.activeGroupId
      args.learning = arr.learning ? 'on' : 'off'
      args.single = arr.single ? 'on' : 'off'
      let res = await uptGroupParam({ ...args })
      if (res.data.code === 'success') {
        this.$Message.success('保存成功')
      } else {
        this.$Message.error(res.data.result)
      }
    },
    /* 获取名单 */
    async getList () {
      let res = await getGroupRoster({ groupId: this.activeGroupId })
      if (res.data.code === 'success') {
        if (res.data.result.length) {
          let arrWhite = []
          let arrIgnore = []
          res.data.result.map((item, index) => {
            if (item.type === 4) {
              arrWhite.push(item)
            } else {
              arrIgnore.push(item)
            }
          })
          this.whiteList = arrWhite
          this.ignoreList = arrIgnore
        }
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
        this.nbList.map((item, index) => {
          arr.push(item.nbCode)
        })
        this.checkAllGroup = arr
      } else {
        this.checkAllGroup = []
      }
    },
    checkAllGroupChange (data) {
      if (data.length === this.nbList.length) {
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
    changeGroup (groupId, index) {
      this.active = index
      this.activeGroupId = groupId
      this.getNbCodeInfoByGroupId(groupId)
      this.selNbByGroupId(groupId)
      this.activeNav = 'supTab1'
    },
    add (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addGroup()
        } else {
          this.$Message.error('操作失败，请检查输入信息格式是否正确!')
        }
      })
    },
    save () {
      this.addNbToGroup()
    },
    modify (groupId) {
      this.modifyModal = true
      this.activeModifyGroupId = groupId
    },
    modifyHandler (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.uptGroupInfo(this.addGroupForm.groupName, this.activeModifyGroupId)
        } else {
          this.$Message.error('操作失败，请检查输入信息格式是否正确!')
        }
      })
    },
    remove (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定删除此条分组吗？</p>',
        loading: true,
        onOk: () => {
          this.delGroup(id)
        }
      })
    },
    removeList (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定删除这条名单吗？</p>',
        loading: true,
        onOk: () => {
          this.delGroupRoster(id)
        }
      })
    },
    removeAll () {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要清空名单吗？</p>',
        loading: true,
        onOk: () => {
          this.delGroupRoster(null, this.activeGroupId)
        }
      })
    },
    async delGroupRoster (id, groupId) {
      let res = await delGroupRoster({ id: id, groupId: groupId })
      if (res.data.code === 'success') {
        this.getList()
      } else {
        this.$Message.error(res.data.result)
      }
    },
    // 切换tab
    changeNav (data) {
      this.activeNav = data
      if (data === 'supTab3') {
        this.getList()
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addIp()
        } else {
          this.$Message.error('请输入名单信息或者上传文件!')
        }
      })
    },

    async addIp () {
      let type = ''
      /* 白名单 */
      if (this.activeNav === 'supTab3') {
        type = 4
        this.addWhiteLoading = true
        let json = {
          groupId: this.activeGroupId,
          type: type,
          ipAddress: this.addWhiteForm.ipAdress,
          macAddress: this.addWhiteForm.macAdress
        }
        let res = await insGroupRoster(json)
        this.addWhiteLoading = false
        this.addWhiteModel = false
        if (res.data.code === 'success') {
          this.$Message.success('添加成功')
          this.getList()
        } else {
          this.$Message.error(res.data.result)
        }
      }
      /* 忽略名单 */
      else if (this.activeNav === 'supTab4') {
        type = 5
        this.addIgnoreLoading = true
        let json = {
          groupId: this.activeGroupId,
          type: type,
          ipAddress: this.addIgnoreForm.ipAdress,
          macAddress: this.addIgnoreForm.macAdress
        }
        let res = await insGroupRoster(json)
        this.addIgnoreModel = false
        this.addIgnoreLoading = false
        if (res.data.code === 'success') {
          this.$Message.success('添加成功')
          this.getList()
        } else {
          this.$Message.error(res.data.result)
        }
      }
    },

    // 只能输入数字
    handleInput (e, val) {
      this.defaultConfig[e] = val.replace(/[^0-9]+/g, '')
    }
  },
  mounted () {
    this.getAllGroup()
  }
}
</script>
<style lang="less" scoped>
  @import "groupManage";
</style>
