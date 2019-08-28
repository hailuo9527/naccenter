<template>
  <div>
    <Row class="list-head" :gutter="30" type="flex"  align="middle">
      <Col>
        <h3>DHCP:</h3>
      </Col>
      <Col span="2">
        <i-switch type="small" v-model="dhcp">
        </i-switch>
      </Col>
    </Row>
    <div v-show="dhcp">
      <div style="margin-top: 20px;">
        <Row :gutter="30" type="flex" align="middle">
          <Col  style="font-size: 14px;font-weight: bold">
            固定IP:
          </Col>
          <Col span="2">
            <i-switch type="small" v-model="ipConfig">
            </i-switch>
          </Col>

        </Row>
        <div class="form-group">
          <Form ref="netConfigForm" :model="netConfig" :rules="netConfigRules" :label-width="130" label-position="left">

            <Row :gutter="30" style="margin-top: 20px;" type="flex" align="middle">
              <Col span="12">
                <FormItem label="起始ip：" prop="ipStart">
                  <Input type="text" v-model.trim="netConfig.ipStart" placeholder="请输入起始IP地址"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="结束ip：" prop="ipEnd">
                  <Input type="text" v-model.trim="netConfig.ipEnd" placeholder="请输入结束IP"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="DNS服务地址：" prop="dnsServer">
                  <Input type="text" v-model.trim="netConfig.dnsServer" placeholder="请输入起始DNS服务地址"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="网关地址：" prop="gateway">
                  <Input type="text" v-model.trim="netConfig.gateway" placeholder="请输入网关地址"></Input>
                </FormItem>
              </Col>
            </Row>
            <div class="save"><span style="font-size: 14px" @click="saveNetInfoHandle">保存</span></div>
          </Form>
        </div>

      </div>
      <div v-show="ipConfig">
        <!--固定ip-->
        <div class="nav-content2" style="padding: 0 20px;">

          <Row class="list-head" type="flex" justify="space-between" align="top">
            <Col span="6"><h3>固定IP列表:</h3></Col>
            <!--<Col span="6">
              <Input suffix="ios-search" placeholder="Enter text" />
            </Col>-->
          </Row>
          <Row class="table-container">
            <Table :columns="white" :data="whiteList" :loading="loading" height="300" stripe
                   size="small">
              <template slot-scope="{ row }" slot="macAddress">
                <span style="font-size: 12px;color: #666"><span style="color: #00e9bc;">{{ row.macAddress }}</span></span>
              </template>
              <template slot-scope="{ row }" slot="ipAddress">
                <span style="font-size: 12px;color: #666">
                  <span style="color: #00e9bc;">{{ row.ipAddress }}</span>
                  <Icon style="cursor: pointer" type="ios-create-outline" size="16" @click="changeIp(row)"/>
                </span>
              </template>
           <!--   <template slot-scope="{ row }" slot="hostName">
                <span style="font-size: 12px;color: #666"><span style="color: #00e9bc;">{{ row.hostName || 'unknow' }}</span></span>
              </template>-->
            <!--  <template slot-scope="{ row, index }" slot="userName">
                <span style="font-size: 12px;color: #666; display: flex;align-items: center">
                  <span style="color: #00e9bc;">{{ row.userName || '未命名' }}</span>
                  <Icon style="cursor: pointer" type="ios-create-outline" size="16" @click="changeName(row.id)"/>
                </span>
              </template>-->
              <template slot-scope="{ row, index }" slot="action">
                <Icon type="ios-trash" size="24" color="#00e9bc" @click="removeList(row, index)"/>
              </template>
            </Table>
          </Row>
          <Row type="flex" justify="space-between" class="opera">
            <Col>
            </Col>
            <Col class="btn-group">
              <span @click="addWhiteModel = true">添加</span>
            </Col>
          </Row>

        </div>
        <!--自由分配-->
        <div class="nav-content2" style="padding: 0 20px;">

          <Row class="list-head" type="flex" justify="space-between" align="top">
            <Col span="6"><h3>动态IP列表:</h3></Col>
          </Row>
          <Row class="table-container">
            <Table :columns="liveIp" :data="liveIpList" :loading="loading" height="300" stripe
                   size="small">
              <template slot-scope="{ row }" slot="macAddress">
                <span style="font-size: 12px;color: #666"><span style="color: #00e9bc;">{{ row.macAddress }}</span></span>
              </template>
            <!--  <template slot-scope="{ row }" slot="ipAddress">
                <span style="font-size: 12px;color: #666"><span style="color: #00e9bc;">{{ row.ipAddress }}</span></span>
              </template>-->
              <template slot-scope="{ row }" slot="hostName">
                <span style="font-size: 12px;color: #666"><span style="color: #00e9bc;">{{ row.hostName || 'unknow' }}</span></span>
              </template>
              <template slot-scope="{ row, index }" slot="userName">
                <span style="font-size: 12px;color: #666; display: flex;align-items: center">
                  <span style="color: #00e9bc;">{{ row.userName || '未命名' }}</span>
                  <Icon style="cursor: pointer" type="ios-create-outline" size="16" @click="changeName(row.id)"/>
                </span>
              </template>
              <!--<template slot-scope="{ row, index }" slot="action">
                <Icon type="ios-trash" size="24" color="#00e9bc" @click="removeList(row.id, index)"/>
              </template>-->
            </Table>
          </Row>

        </div>
      </div>


    </div>
    <!--修改ip-->
    <Modal v-model="editIp" width="360">
      <p slot="header" style="color:#333;text-align:center">
        <span>修改Ip</span>
      </p>
      <div style="text-align:center">
        <Form :model="editIpForm"  label-position="left" ref="editIpForm" :rules="editIpFormRules">
          <FormItem label="IP地址" prop="ipAddress">
            <Input v-model.trim="editIpForm.ipAddress" placeholder="请输入ip地址"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long  @click="modifyIp">确认</Button>
      </div>
    </Modal>
    <!--添加名单-->
    <Modal v-model="addWhiteModel" width="360">
      <p slot="header" style="color:#333;text-align:center">
        <span>添加白名单</span>
      </p>
      <div style="text-align:center">
        <Form :model="addWhiteForm"  label-position="left" ref="whiteFormValidate" :rules="whiteFormRules">
          <FormItem label="mac地址" prop="macAddress">
            <Input v-model.trim="addWhiteForm.macAddress" placeholder="请输入mac地址"></Input>
          </FormItem>
          <FormItem label="ip地址" prop="ipAdress">
            <Input v-model.trim="addWhiteForm.ipAddress" placeholder="请输入ip地址"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="addWhiteLoading" @click="handleSubmit('whiteFormValidate')">确认添加</Button>
      </div>
    </Modal>
   <!-- &lt;!&ndash;修改别名&ndash;&gt;
    <Modal v-model="editName" width="360">
      <p slot="header" style="color:#333;text-align:center">
        <span>修改别名</span>
      </p>
      <div style="text-align:center">
        <Form :model="editNameForm"  label-position="left">
          <FormItem label="别名">
            <Input v-model.trim="editNameForm.userName" placeholder="可以输入自定义别名"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long  @click="updNameListById">确认</Button>
      </div>
    </Modal>-->
  </div>

</template>

<script>
  import {
    deleteNbList,
    addIp,
    updNameListById
  } from '../../../api/nbConfig'
  import { getNameListByType, insIpParam, uptIpManage } from '../../../api/ipManage'
  import { uploadFile } from '../../../api/upload'
  export default {
    name: 'config',
    data () {
      const ipaddressRules = (rule, value, callback) => {
        if (!value) callback()
        let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (!reg.test(value)) {
          callback(new Error('请检查IP地址格式！'))
        }
        callback()
      }
      const macAddressRules = (rule, value, callback) => {
        if (!value) callback()
        let reg = /^[a-fA-F0-9]{2}([:-][a-fA-F0-9]{2}){5}$/
        if (!reg.test(value)) {
          callback(new Error('请检查MAC地址格式！'))
        }
        callback()
      }
      const dnsserRules = (rule, value, callback) => {
        if (!value) callback()
        let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (!reg.test(value)) {
          callback(new Error('请检查DNS地址格式！'))
        }
        callback()
      }
      const gatewayRules = (rule, value, callback) => {
        if (!value) callback()
        let reg = /^192\.168(\.(\d|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))){2}$/
        if (!reg.test(value)) {
          callback(new Error('请检查网关格式！'))
        }
        callback()
      }
      return {
        dhcp: false,
        ipConfig: false,
        //editName: false,
       //editNameForm: {},
        editIp: false,
        editIpForm: {},
        editIpFormRules: {
          ipAddress: [
            { validator: ipaddressRules, trigger: 'blur' }
          ]
        },

        download:{
          // url: 'http://app.wingbro.com:8070/名单导入模板.xls',
          name: '名单导入模板.xls'
        },
        loading: false,
        white: [
          {
            type: 'index',
            width: 60,
          },
          {
            title: 'Mac地址',
            slot: 'macAddress',
            // width: 350
          },
          {
            title: 'Ip地址',
            slot: 'ipAddress'
          },
         /* {
            title: '主机名',
            slot: 'hostName'
          },
          {
            title: '别名',
            slot: 'userName'
          },*/
          {
            title: '操作',
            slot: 'action',
            width: 150,
          }
        ],
        whiteList: [],
        liveIp: [
          {
            type: 'index',
            width: 60,
          },
          {
            title: 'Mac地址',
            slot: 'macAddress',
            // width: 350
          },
          /*{
            title: 'Ip地址',
            slot: 'ipAddress'
          },*/
          /*{
            title: '主机名',
            slot: 'hostName'
          },
          {
            title: '别名',
            slot: 'userName'
          },*/
          /*{
            title: '操作',
            slot: 'action',
            width: 150,
          }*/
        ],
        liveIpList: [],
        addWhiteModel: false,
        addWhiteLoading: false,
        addWhiteForm: {
        },
        whiteFormRules: {
          macAddress: [
            { validator: macAddressRules, trigger: 'blur' }
          ],
          ipAddress: [
            { validator: ipaddressRules, trigger: 'blur' }
          ]
        },
        netConfig: {
        },
        netConfigRules: {
          ipStart: [
            { validator: ipaddressRules, trigger: 'blur' }
          ],
          ipEnd: [
            { validator: ipaddressRules, trigger: 'blur' }
          ],
          dnsServer: [
            { validator: dnsserRules, trigger: 'blur' }
          ],
          gateway: [
            { validator: gatewayRules, trigger: 'blur' }
          ]
        },
      }
    },
    props: {
      nbCode: {
        type: String,
        default: ''
      }
    },
    watch: {
      nbCode () {
        this.getNameList(0)
        this.getNameList(1)
      }
    },
    methods: {

      saveNetInfoHandle () {
        this.$refs['netConfigForm'].validate((valid) => {
          if (valid) {
            console.log('保存')
            this.insIpParam()
          } else {
            this.$Message.error('请检查输入格式是否正确!')
          }
        })
      },
      // 保存ip段
      async insIpParam () {

        let res = await insIpParam(this.netConfig)
        console.log(res)
        if (res.data.code === 'success') {
          this.$Message.success('保存成功!')
        } else {
          this.$Message.error(res.data.result)
        }
      },
      /* 获取名单 */
      async getNameList (type) {
        this.loading = true
        let res = await getNameListByType({ nbCode: this.nbCode, type: type })
        this.loading = false
        if (res.data.code === 'success') {
          type ? this.liveIpList = res.data.result || [] : this.whiteList = res.data.result || []
        }
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.addIp()
          } else {
            //this.$Message.error('请输入名单信息或者上传文件!')
          }
        })
      },
     /* // 修改别名
      async updNameListById () {
        let res = await updNameListById({...this.editNameForm})
        this.editName = false
        if (res.data.code === 'success') {
          this.$Message.success('修改成功！')
          this.getNameList(0)
          this.getNameList(1)
          this.editNameForm.userName = ''
        } else {
          this.$Message.error(res.data.result)
        }
      },*/
      // 修改IP
      modifyIp () {
        this.$refs['editIpForm'].validate(async (valid) => {
          if (valid) {
            let res = await uptIpManage(this.editIpForm)
            //console.log(res)
            if (res.data.code === 'success') {
              this.editIp = false
              this.$Message.success('修改成功！')
              this.editIpForm.ipAddress = ''
              this.getNameList(0)
              this.getNameList(1)
            } else {
              this.$Message.error(res.data.result)
            }
          } else {
            this.$Message.error('请检查输入格式是否正确!')
          }
        })

      },
      changeIp (obj) {
        this.editIp = true
        this.editIpForm = obj
      },
      /*changeName (id) {
        this.editName = true
        this.editNameForm.id = id

      },*/
    /*  async upload (type) {
        if (!this.file) return
        let fileFormData = new FormData()
        fileFormData.append('file', this.file)
        let res = await uploadFile({ file: fileFormData, nbCode: this.nbCode })
        if (type === 4) {
          this.addWhiteModel = false
        } else {
          this.addIgnoreModel = false
        }
        if (res.data.code === 'success') {
          this.$Message.success('上传成功！')
          this.getNameList(0)
        } else {
          this.$Message.error('上传失败！')
        }
      },*/
      /* 添加名单 */
      async addIp () {
        let type = ''
        type = 4
       /* if (this.addWhiteForm.ipAdress === '' && this.addWhiteForm.macAdress === '') {
          this.upload(type)
          return
        }*/

        this.addWhiteLoading = true
        let json = {
          nbCode: this.nbCode,
          type: type,
          ipAddress: this.addWhiteForm.ipAddress,
          macAddress: this.addWhiteForm.macAddress,
         // userName: this.addWhiteForm.userName
        }
        let res = await addIp(json)
        console.log(res)
        this.addWhiteLoading = false
        this.addWhiteModel = false
        if (res.data.code === 'success') {
          this.$Message.success('添加成功')
          this.getNameList(0)
        } else {
          this.$Message.error(res.data.result)
        }
      },
      /* 删除列表 */
      removeList (item, index) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要删除这条列表吗？</p>',
          loading: true,
          onOk: async () => {
            let json = {
              id: item.id,
              macAddress: item.macAddress,
              ipAddress: null,
              nbCode: this.nbCode
            }
            let res = await uptIpManage(json)
            console.log(res)
            if (res.data.code === 'success') {
              this.$Modal.remove()
              this.$Message.info(res.data.result)
              this.getNameList(0)
              this.getNameList(1)
            } else {
              this.$Modal.remove()
              this.$Message.error(res.data.result)
            }
          }
        })
      },

    },
    mounted () {
      this.getNameList(0)
      this.getNameList(1)
    },
  }
</script>
<style lang="less" scoped>
  @import "../../config/config.less";
  /deep/ .ivu-form .ivu-form-item-label {
    font-size: 14px !important;
  }
  /deep/.ivu-switch-checked{
    border-color: #00e9bc;
    background-color: #00e9bc;
  }
  .view-content .nav-content .form-group{
    margin: 20px;
  }
</style>
