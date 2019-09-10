<template>
  <div style="padding: 20px">
    <!--访客基础信息-->
    <Row class="list-head" type="flex" justify="space-between" align="top">
      <Col span="6"><h3>访客基础信息:</h3></Col>
    </Row>
    <div class="form-group" style="margin: 20px 0">
      <Row :gutter="30">
        <Col span="12">
          <div class="form-item">
            访客状态:
            <!--<i-switch  v-model="vistorList.dhcp"/>-->
            <span class="ivu-switch ivu-switch-default" v-if="vistorList.visitor === 'off'"></span>
            <span class="ivu-switch ivu-switch-checked ivu-switch-default"
                  v-else-if="vistorList.visitor === 'on'"></span>
          </div>
        </Col>
        <Col span="12">
          <div class="form-item">

          </div>
        </Col>
      </Row>
      <Row :gutter="30">
        <Col span="12">
          <div class="form-item">
            时长: <span>{{vistorList.visitDuration != null ? vistorList.visitDuration : 'unknow'}}</span>
          </div>
        </Col>
        <Col span="12">
          <div class="form-item">
            访问次数: <span>{{vistorList.visitCount != null ? vistorList.visitCount:'unknow'}}</span>
          </div>
        </Col>
      </Row>
    </div>
    <!--列表-->
    <div>
      <Row class="list-head" type="flex" justify="space-between" align="top">
        <Col span="6"><h3>访客信息列表:</h3></Col>
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
  </div>

</template>

<script>
import { getVistorInfo, getSystemStatus } from '../../../api/chart'

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
          title: '访客IP',
          key: 'visitorIp'
        },
        {
          title: '访客MAC',
          key: 'visitorMac'
        },
        {
          title: '到期时间',
          key: 'useTime'
        },
        {
          title: '主机名',
          key: 'hostName'
        }
      ],
      tableList: [],
      vistorList: []
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
    async getVistorInfo () {
      this.loading = true
      let res = await getVistorInfo({ nbCode: this.nbCode })
      console.log(res)
      this.loading = false
      if (res.data.code === 'success') {
        this.tableList = res.data.result || []
      }
    },
    // 获取系统状态
    async getSystemStatus () {
      let res = await getSystemStatus({ nbCode: this.nbCode })
      if (res.data.code === 'success') {
        this.vistorList = res.data.result || {}
      }
    }
  },
  mounted () {
    this.getVistorInfo(),
    this.getSystemStatus()
  }
}
</script>
<style lang="less" scoped>
  @import "../../config/config.less";

  .view-content .nav-content2 .form-group .form-item {
    font-size: 16px;
    border: none;
    padding: 10px;
  }

  .ivu-row-flex-top {
    margin-top: 20px;
  }
</style>
