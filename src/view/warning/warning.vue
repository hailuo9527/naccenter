<template>
  <div class="view-content">
    <div class="title">
      {{activeNb.nbName}} <span>{{activeNb.nbCode}}</span>
    </div>
    <div class="info-list" style="padding: 20px">
      <Row>
        <span style="font-size: 14px;font-weight: bold;color: #333" >请选择时间段：</span>
        <Select v-model="timeSelect" style="width:200px" prefix="md-alarm"  @on-change="timeChange">
          <Option v-for="item in timeList" :value="item" :key="item">{{ item }} 分钟内</Option>
        </Select>
      </Row>

      <Row class="table-container" style="width: 100%;overflow: auto;margin-top: 30px;">
        <Col span="24">
          <Table border :columns="tableColumns" :data="warningList" :loading="tableLoad" stripe :height="500">
            <template slot-scope="{ row }" slot="ipAddress">
              <strong>{{ row.ipAddress }}</strong>
            </template>
            <template slot-scope="{ row }" slot="createTime">
              {{ row.createTime }}
            </template>
          </Table>
        </Col>
      </Row>
    </div>

  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { getBlockRosterList } from '../../api/warning'

export default {
  name: 'chart',
  data () {
    return {
      tableLoad: false,
      tableColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: 'ip地址',
          key: 'ipAddress',
          slot: 'ipAddress'
        },
        {
          title: '入侵时间',
          key: 'createTime',
          slot: 'createTime'
        }
      ],
      warningList: [],
      timeSelect: 5,
      timeList: [
        5, 10, 30
      ]
    }
  },
  methods: {
    ...mapMutations([
      'setActiveNb'
    ]),
    ...mapActions([
      'getAsideList'
    ]),
    async getBlockRosterList (data) {
      let res = await getBlockRosterList({ nbCode: this.activeNb.nbCode, time: data || this.timeSelect })
      if (res.data.code === 'success') {
        this.warningList = res.data.result ? res.data.result : []
      }
    },
    timeChange (data) {
      this.getBlockRosterList(data)
    }

  },
  computed: {
    ...mapState({
      activeNb: state => state.app.activeNb
    })
  },
  watch: {
    activeNb: {
      handler (newVal, old) {
        this.$Loading.start()
        this.getBlockRosterList()
        this.$Loading.finish()
      },
      deep: true
      // immediate: true
    }
  },
  mounted () {
    this.getBlockRosterList()
  }
}
</script>
<style lang="less" scoped>
  @import "warning";
</style>
