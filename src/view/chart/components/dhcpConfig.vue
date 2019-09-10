<template>
  <div style="padding: 20px">
    <!--信息面板-->
    <Row class="list-head" type="flex" justify="space-between" align="top">
      <Col span="6"><h3>DHCP运行信息:</h3></Col>
    </Row>
    <div class="form-group" style="margin: 20px 0">
      <Row :gutter="30">
        <Col span="12">
          <div class="form-item">
           系统状态:
           <!-- <i-switch v-model="statusList.dhcp"/>-->
            <span class="ivu-switch ivu-switch-default" v-if="statusList.dhcp == 'off'"></span>
            <span class="ivu-switch ivu-switch-checked ivu-switch-default" v-else-if="statusList.dhcp == 'on'"></span>
          </div>
        </Col>
        <Col span="12">

        </Col>
      </Row>
      <Row :gutter="30">
        <Col span="12">
          <div class="form-item">
            网关地址: <span>{{statusList.dhcpGateway != null ? statusList.dhcpGateway:'unknow'}}</span>
          </div>
        </Col>
        <Col span="12">
          <div class="form-item">
            DNS服务地址: <span>{{statusList.dhcpDnsServer != null ? statusList.dhcpDnsServer:'unknow'}}</span>
          </div>
        </Col>
      </Row>
      <Row :gutter="30">
        <Col span="12">
          <div class="form-item">
            起始IP: <span>{{statusList.ipStart != null ? statusList.ipStart:'unknow'}}</span>
          </div>
        </Col>
        <Col span="12">
          <div class="form-item">
            结束IP: <span>{{statusList.ipEnd != null ? statusList.ipEnd:'unknow'}}</span>
          </div>
        </Col>
      </Row>
    </div>

    <Row class="list-head" type="flex" justify="space-between" align="top">
      <Col span="6"><h3>租约信息列表:</h3></Col>
    </Row>
    <Row class="table-container">
        <Table :columns="table" :data="tableList" :loading="loading" height="300" stripe
               size="small">
       <!--   <template slot-scope="{ row }" slot="dhcpIp">
            <span style="font-size: 12px;color: #666"><span style="color: #00e9bc;">{{ row.dhcpIp }}</span></span>
          </template>-->
        </Table>
      </Row>
  </div>

</template>

<script>
import { getDHCPInfo, getSystemStatus } from '../../../api/chart'

export default {
  name: 'dhcpConfig',
  data () {
    return {
      loading: false,
      table: [
        {
          type: 'index',
          width: 60
        },
        {
          title: 'IP地址',
          key: 'dhcpIp'
        },
        {
          title: 'MAC地址',
          key: 'dhcpMac'
        },
        {
          title: '到期时间',
          key: 'remainingTime'
        },
        {
          title: '主机名',
          key: 'hostName'
        }
      ],
      tableList: [],
	      statusList: {
	        }
    }
  },
  props: {
    nbCode: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 获取配置信息
    async getDHCPInfo () {
      this.loading = true
      let res = await getDHCPInfo({ nbCode: this.nbCode })
      this.loading = false
      if (res.data.code === 'success') {
        this.tableList = res.data.result || []
      }
    },
	    // 获取系统状态
	    async getSystemStatus () {
	      let res = await getSystemStatus({ nbCode: this.nbCode })
	      if (res.data.code === 'success') {
		      this.statusList = res.data.result || {}
	      }
    }
  },
  mounted () {
    this.getDHCPInfo(),
    this.getSystemStatus()
  }
}
</script>
<style lang="less" scoped>
  @import "../../config/config.less";
  .view-content .nav-content2 .form-group .form-item{
    font-size: 16px;
    border: none;
    padding: 10px;
  }
</style>
