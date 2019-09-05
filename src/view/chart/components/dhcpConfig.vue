<template>
  <div style="padding: 20px">
    <!--固定ip-->
      <Row class="list-head" type="flex" justify="space-between" align="top">
        <Col span="6"><h3>DHCP信息列表:</h3></Col>
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
  import { getDHCPInfo } from "../../../api/chart";

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
        tableList: []
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
      }
    },
    mounted () {
      this.getDHCPInfo()
    }
  }
</script>
<style lang="less" scoped>
  @import "../../config/config.less";
</style>
