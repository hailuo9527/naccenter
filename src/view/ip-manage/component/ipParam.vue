<template>
  <div>
    <Row class="list-head" type="flex" justify="space-between" align="top">
      <Col ><h3>ip管理:</h3></Col>
      <Col >
        <ButtonGroup shape="circle">
          <Button :disabled="!listType" @click="getList()" >全部</Button>
          <Button :disabled="listType=== '1'" @click="getList('1')">普通</Button>
          <Button :disabled="listType=== '0'" @click="getList('0')">游客</Button>
        </ButtonGroup>
      </Col>
    </Row>
    <Row class="table-container">
      <Table :columns="table" :data="list" :loading="loading" height="300" :show-header="false" stripe
             size="small">
        <template slot-scope="{ row }" slot="dscp">
          <span style="font-size: 12px;color: #666">开关：<span style="color: #00e9bc;margin-left: 20px">{{ row.dscp | flowState}}</span></span>
        </template>
        <template slot-scope="{ row }" slot="gateway">
          <span style="font-size: 12px;color: #666">网关：<span style="color: #00e9bc;margin-left: 20px">{{ row.gateway }}</span></span>
        </template>
        <template slot-scope="{ row }" slot="ipStart">
          <span style="font-size: 12px;color: #666">开始：<span style="color: #00e9bc;margin-left: 20px">{{ row.ipStart }}</span></span>
        </template>
        <template slot-scope="{ row }" slot="ipEnd">
          <span style="font-size: 12px;color: #666">结束：<span style="color: #00e9bc;margin-left: 20px">{{ row.ipEnd }}</span></span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Icon type="ios-build" size="24" color="#00e9bc" style="cursor: pointer" @click="modifyIpParam(row)"/>
        </template>
      </Table>
    </Row>
    <Row type="flex" justify="space-between" class="opera">
      <Col>
      </Col>
      <Col class="btn-group">
        <span @click="addIp" >添加</span>

      </Col>
    </Row>
    <Modal v-model="ipModifyModal" @on-visible-change="modalChange" width="360">
      <p slot="header" style="color:#333;text-align:center">
        <span>{{type ? '修改ip段' : '添加ip段'}}</span>
      </p>
      <div style="text-align:center">
        <Form :model="ipModifyForm"  label-position="left" ref="ipModifyForm" :rules="ipModifyFormRules">
          <FormItem label="开关:" prop="dscp" class="switchForm">
            <i-switch v-model="ipModifyForm.dscp" size="large">
              <span slot="open">On</span>
              <span slot="close">Off</span>
            </i-switch>
          </FormItem>
          <FormItem label="网关：" prop="gateway">
            <Input type="text" v-model.trim="ipModifyForm.gateway" placeholder="请输入网关数据"></Input>
          </FormItem>
          <FormItem label="起始Ip：" prop="ipStart" v-if="ipModifyForm.dscp">
            <Input type="text" v-model.trim="ipModifyForm.ipStart" placeholder="请输入起始Ip"></Input>
          </FormItem>
          <FormItem label="结束Ip：" prop="ipEnd" v-if="ipModifyForm.dscp">
            <Input type="text" v-model.trim="ipModifyForm.ipEnd" placeholder="请输入结束Ip"></Input>
          </FormItem>
          <FormItem label="类型:" prop="type">
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
  import { getIpParam, insIpParam, uptIpParam, selIpParam } from '../../../api/ipManage'

  export default {
    name: 'ipParam',
    data () {
      const gatewayRules = (rule, value, callback) => {
        if (!value) callback(new Error('请输入网关！'))
        let reg = /^192\.168(\.(\d|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))){2}$/
        if (!reg.test(value)) {
          callback(new Error('请检查网关格式！'))
        }
        callback()
      }
      const ipaddressRules = (rule, value, callback) => {
        if (!value) callback(new Error('请输入ip地址！'))
        let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (!reg.test(value)) {
          callback(new Error('请检查IP地址格式！'))
        }
        callback()
      }
      return {
        listType: null,
        type: 0, // 修改
        loading: false,
        ipModifyModal: false,
        ipModifyForm: {
          dscp: true
        },
        ipModifyFormRules: {
          dscp: [
            { required: true }
          ],
         /* type: [
            { required: true,  message: '请选择类型', trigger: 'change' }
          ],
          gateway: [
            { required: true, validator: gatewayRules, trigger: 'blur' }
          ],
          ipStart: [
            { required: true, validator: ipaddressRules, trigger: 'blur' }
          ],
          ipEnd: [
            { required: true, validator: ipaddressRules, trigger: 'blur' }
          ]*/
        },
        table: [
          {
            title: '开关',
            slot: 'dscp',
            width: 200
          },
          {
            title: '网关',
            slot: 'gateway',
            width: 200
          },
          {
            title: '开始',
            slot: 'ipStart',
            width: 200
          },
          {
            title: '结束',
            slot: 'ipEnd',
            width: 200
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
    props: {
      nbCode: {
        type: String,
        default: ''
      }
    },
    filters: {
      flowState (value) {
        switch (value) {
          case 'on':
            return '开'
          case 'off':
            return '关'
        }
      }
    },
    methods: {
      // 获取ip段列表
      async getList (listType) {
        this.listType = listType
        let res
        this.loading = true
        listType
          ? res = await getIpParam({ nbCode: this.nbCode, type: listType })
          :  res = await selIpParam({ nbCode: this.nbCode })
        this.loading = false
        if (res.data.code === 'success') {
          this.list = res.data.result || []
        }
      },
      // 添加 ip段
      async insIpParam () {
        this.loading = true
        let json = Object.assign({},this.ipModifyForm)
        json.dscp = json.dscp ? 'on' : 'off'
        json.nbCode = this.nbCode
        let res = await insIpParam(json)
        this.loading = false
        if (res.data.code === 'success') {
          this.$Message.success('添加成功！')
          this.getList(this.listType)
          this.ipModifyModal = false
        } else {
          this.$Message.error(res.data.result)
        }
      },
      // 修改 ip段
      async uptIpParam () {
        this.loading = true
        let json = Object.assign({},this.ipModifyForm)
        json.dscp = json.dscp ? 'on' : 'off'
        let res = await uptIpParam({ipParam: json})
        this.loading = false
        if (res.data.code === 'success') {
          this.$Message.success('修改成功！')
          this.getList(this.listType)
          this.ipModifyModal = false
        } else {
          this.$Message.error(res.data.result)
        }
      },

      // 添加ip
      addIp () {
        this.type = 0
        this.ipModifyModal = true
      },
      // 修改ip
      modifyIp (item) {
        this.ipModifyForm = item
        this.type = 1
        this.ipModifyModal = true
      },
      modalChange (data) {
        if (!data) this.ipModifyForm = {}
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.type ? this.uptIpParam() : this.insIpParam()

          } else {
            this.$Message.error('请检查输入信息是否有误')
          }
        })
      },
    },
    mounted () {
      this.getList(this.listType)
    }
  }
</script>
<style lang="less" scoped>
  @import "../ip-manage";
  .switchForm{
    /deep/.ivu-form-item-content{
     text-align: right!important;
    }
  }
</style>
