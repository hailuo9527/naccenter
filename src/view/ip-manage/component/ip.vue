<template>
  <div class="">
    <Row class="list-head" :gutter="20" type="flex"  align="top">
      <Col>
        <h3>DHCP:</h3>
      </Col>
      <Col >
        <i-switch type="small" v-model="dhcp">
        </i-switch>
      </Col>
    </Row>
    <Row>
      <h3>固定IP:</h3>
      <div class="form-group">

      </div>
    </Row>
    <!--<Row class="table-container">
      <Table :columns="table" :data="list" :loading="loading" height="300" :show-header="false" stripe
             size="small">
        <template slot-scope="{ row }" slot="macAddress">
          <span style="font-size: 12px;color: #666">MAC地址：<span style="color: #00e9bc;margin-left: 20px">{{ row.macAddress }}</span></span>
        </template>
        <template slot-scope="{ row }" slot="ipAddress">
          <span style="font-size: 12px;color: #666">IP地址：<span style="color: #00e9bc;margin-left: 20px">{{ row.ipAddress }}</span></span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Icon type="ios-build" size="24" color="#00e9bc" style="cursor: pointer" @click="modifyIp(row)"/>
        </template>
      </Table>
    </Row>-->
    <Row type="flex" justify="space-between" class="opera">
      <Col>
      </Col>
      <Col class="btn-group">
        <span @click="addIp" >添加</span>
      </Col>
    </Row>
    <Modal v-model="ipModifyModal" @on-visible-change="modalChange" width="360">
      <p slot="header" style="color:#333;text-align:center">
        <span>{{type ? '修改固定ip' : '添加固定ip'}}</span>
      </p>
      <div style="text-align:center">
        <Form :model="ipModifyForm"  label-position="left" ref="ipModifyForm" :rules="ipModifyFormRules">
          <FormItem label="mac地址" prop="macAddress">
            <Input v-model.trim="ipModifyForm.macAddress" placeholder="请输入mac地址"></Input>
          </FormItem>
          <FormItem label="ip地址" prop="ipAddress">
            <Input v-model.trim="ipModifyForm.ipAddress" placeholder="请输入ip地址"></Input>
          </FormItem>
          <FormItem label="类型" prop="type">
            <Select v-model="ipModifyForm.type" placeholder="请选择类型">
              <Option value="0">游客</Option>
              <Option value="1">普通</Option>

            </Select>
          </FormItem>

        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="loading" @click="handleSubmit('ipModifyForm')">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { selIpManage, insIpManage, uptIpManage } from '../../../api/ipManage'
  export default {
    name: 'ip',
    data () {
      const ipaddressRules = (rule, value, callback) => {
        if (!value) callback(new Error('请输入ip地址！'))
        let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (!reg.test(value)) {
          callback(new Error('请检查IP地址格式！'))
        }
        callback()
      }
      const macAddressRules = (rule, value, callback) => {
        if (!value) callback(new Error('请输入mac地址！'))
        let reg = /^[a-fA-F0-9]{2}([:-][a-fA-F0-9]{2}){5}$/
        if (!reg.test(value)) {
          callback(new Error('请检查IP地址格式！'))
        }
        callback()
      }
      return {

        ipModifyModal: false,
        ipModifyForm: {},
        ipModifyFormRules: {
          macAddress: [
            { required: true, validator: macAddressRules, trigger: 'blur' }
          ],
          ipAddress: [
            { required: true, validator: ipaddressRules, trigger: 'blur' }
          ],
          type: [
            { required: true,  message: '请选择类型', trigger: 'change' }
          ]
        },
        type: 0, // 修改
        loading: false,
        table: [
          {
            title: 'Mac地址',
            slot: 'macAddress',
            width: 350
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
        list: [],
      }
    },
    watch: {
      nbCode () {
        this.selIpManage()
      }
    },
    props: {
      nbCode: {
        type: String,
        default: ''
      }
    },
    methods: {
      // 获取ip列表
      async selIpManage () {
        this.loading = true
        let res = await selIpManage({ nbCode: this.nbCode })
        this.loading = false
        if (res.data.code === 'success') {
          this.list = res.data.result || []
        }
      },
      // 添加ip
      async insIpManage () {
        this.loading = true
        let json = Object.assign(this.ipModifyForm, {})
        json.nbCode = this.nbCode
        let res = await insIpManage({ipManage: json})
        this.loading = false
        if (res.data.code === 'success') {
          this.selIpManage()
          this.$Message.success('添加成功！')
          this.ipModifyModal = false
        } else {
          this.$Message.error(res.data.result)
        }
      },
      // 修改ip
      async uptIpManage (obj) {
        this.loading = true
        let json = Object.assign(this.ipModifyForm, {})
        json.nbCode = this.nbCode
        let res = await uptIpManage(json)
        this.loading = false
        if (res.data.code === 'success') {
          this.selIpManage()
          this.$Message.success('修改成功！')
          this.ipModifyModal = false
        } else {
          this.$Message.error(res.data.result)
        }
      },
      // 修改ip
      modifyIp (item) {
        this.ipModifyForm = item
        this.type = 1
        this.ipModifyModal = true
      },
      // 添加ip
      addIp () {
        this.type = 0
        this.ipModifyModal = true
      },

      modalChange (data) {
        if (!data) this.ipModifyForm = {}
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.type ? this.uptIpManage() : this.insIpManage()

          } else {
            this.$Message.error('请检查输入信息是否有误')
          }
        })
      },
    },
    mounted () {
      this.selIpManage()
    }
  }
</script>
<style lang="less" scoped>
  @import "../ip-manage";
</style>
