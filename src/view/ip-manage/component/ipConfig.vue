<template>
  <div>
    <Row class="list-head" :gutter="30" type="flex"  align="middle">
      <Col>
        <h3>DHCP:</h3>
      </Col>
      <Col span="4">
        <i-switch type="small" v-model="dhcp" :loading="changeDhcp" @on-change="uptIpParamStatus">
        </i-switch>
        <pop-tip style="margin-left: 20px" placement="bottom" content='开启DHCP并配置如下参数后，NacBox将会自动为动态白名单分配IP（分配的IP在配置好的IP段内），租约时长为分配的IP有效时间（分钟）'/>
      </Col>
    </Row>
    <div v-show="dhcp">
      <div style="margin-top: 20px;">
        <div class="form-group">
          <Form ref="netConfigForm" :model="netConfig" :rules="netConfigRules" :label-width="130" label-position="left">

            <Row :gutter="30" style="margin-top: 20px;" type="flex" align="middle">
              <Col span="12">
                <FormItem label="起始IP：" prop="ipStart">
                  <Input type="text" v-model.trim="netConfig.ipStart" placeholder="请输入起始IP地址"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="结束IP：" prop="ipEnd">
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
              <Col span="12">
                <FormItem label="租约时长：" prop="dhcpDuration" style="position: relative">
                  <Input type="text" v-model.trim="netConfig.dhcpDuration || 10080" placeholder="请输入租约时长">
                    <pop-tip slot="prepend" content='租约时长为分配的IP有效时间（分钟）'/>
                  </Input>
                </FormItem>

              </Col>
            </Row>
            <div class="save"><span style="font-size: 14px" @click="saveNetInfoHandle">保存</span></div>
          </Form>
        </div>

      </div>

    </div>
  </div>

</template>

<script>
import { getNameListByType, insIpParam, getIpParam, insRosterTemp, uptRosterTemp, saveIpManage, uptIpParamStatus } from '../../../api/ipManage'
import PopTip from '@/components/pop-tip'
export default {
  name: 'config',
  components: {
    PopTip
  },
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
    const dhcpDurationRules = (rule, value, callback) => {
      if (!value) callback()
      let reg = /^[0-9]*$/
      if (!reg.test(value)) {
        callback(new Error('请输入数字！'))
      }
      callback()
    }
    return {
      dhcp: false,
      changeDhcp: false,
      ipConfig: false,
      // editName: false,
      // editNameForm: {},
      editIp: false,
      editIpForm: {},
      editIpFormRules: {
        ipAddress: [
          { validator: ipaddressRules, trigger: 'blur' }
        ]
      },
      loading: false,
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
        ],
        dhcpDuration: [
          { validator: dhcpDurationRules, trigger: 'blur' }
        ]
      },
      reBackIpModel: false
    }
  },
  props: {
    nbCode: {
      type: String,
      default: ''
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
    // 获取默认配置
    async getIpParam () {
      let res = await getIpParam({ nbCode: this.nbCode, type: 0 })
      console.log(res)
      if (res.data.code === 'success') {
        this.netConfig = res.data.result || {}
        this.dhcp = res.data.result.dscp === 'on'
      }
    },
    // 修改dhcp配置
    uptIpParamStatus (data) {
      if (!data) {
        this.changeDhcp = true
        this.$Modal.confirm({
          title: '提示',
          content: '确定要关闭DHCP配置吗？',
          onOk: async () => {
            let res = await uptIpParamStatus({ nbCode: this.nbCode })

            if (res.data.code) {
              this.$Message.success('DHCP配置已关闭！')
              this.changeDhcp = false
            } else {
              this.$Message.error(res.data.result)
            }
          },
          onCancel: () => {
            this.dhcp = true
            this.changeDhcp = false
          }
        })
      }
    },
    // 保存dsch配置
    async insIpParam () {
      this.netConfig.nbCode = this.nbCode
      this.netConfig.dscp = this.dhcp ? 'on' : 'off'
      let res = await insIpParam(this.netConfig)
      console.log(res)
      if (res.data.code === 'success') {
        this.$Message.success('保存成功!')
      } else {
        this.$Message.error(res.data.result)
      }
    }
  },
  mounted () {
    this.getIpParam()
  }
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
  /deep/.ivu-input-group-prepend{
    position: absolute;
    right: 8px;
    z-index: 999;
    border: none;
    background: #fff;
    .ivu-tooltip-popper{
      width: 200px;
    }
  }
</style>
