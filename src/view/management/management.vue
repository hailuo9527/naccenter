<template>
  <div class="view-content">
    <div class="title">
      {{activeNb.nbName}} <span>{{activeNb.nbCode}}</span>
    </div>
    <div class="info-list">
      <Row  style="text-align: right">
        <ButtonGroup>
          <Button @click="getManage" style="background: #00e9bc; color: #fff">拉取数据</Button>
          <Button type="warning" @click="deleteManage">清除数据</Button>
        </ButtonGroup>
        <Button icon="md-download" :loading="exportLoading" @click="exportExcel" style="margin: 20px;" type="info">导出excel表格</Button>
      </Row>
      <Row class="table-container" style="width: 100%;overflow: auto">
        <Col span="24">
          <Table :columns="management" :data="managementList" height="500" :loading="loading" stripe class="table" align="">
            <template slot-scope="{ row }" slot="f01">
              <span style="font-size: 12px;color: #666"><span style="color: #333;margin-left: 20px">{{ row.f01 }}</span></span>
            </template>
            <template slot-scope="{ row }" slot="ipAddress">
              <span style="font-size: 12px;color: #666"><span style="color: #333;margin-left: 20px">{{ row.ipAddress }}</span></span>
            </template>
            <template slot-scope="{ row }" slot="f02">
              <span style="font-size: 12px;color: #666"><span style="color: #333;margin-left: 20px">{{ row.f02 }}</span></span>
            </template>
            <template slot-scope="{ row }" slot="f03">
              <span style="font-size: 12px;color: #666"><span style="color: #333;margin-left: 20px">{{ row.f03 }}</span></span>
            </template>
            <template slot-scope="{ row }" slot="f04">
              <span style="font-size: 12px;color: #666"><span style="color: #333;margin-left: 20px">{{ row.f04 }}</span></span>
            </template>
            <template slot-scope="{ row }" slot="f05">
              <span style="font-size: 12px;color: #666"><span style="color: #333;margin-left: 20px">{{ row.f05 }}</span></span>
            </template>
            <template slot-scope="{ row }" slot="f06">
              <span style="font-size: 12px;color: #666"><span style="color: #333;margin-left: 20px">{{ row.f06 }}</span></span>
            </template>
            <template slot-scope="{ row }" slot="f07">
              <span style="font-size: 12px;color: #666"><span style="color: #333;margin-left: 20px">{{ row.f07 }}</span></span>
            </template>
            <template slot-scope="{ row }" slot="f08">
              <span style="font-size: 12px;color: #666"><span style="color: #333;"><Icon type="ios-create-outline" color="rgb(0, 233, 188)" size="20" @click="modify([row.f01, row.ipAddress, row.f02, row.f03, row.f04, row.f05, row.f06, row.f07])"/></span></span>
            </template>

          </Table>
        </Col>
      </Row>

     <!-- <Row type="flex" justify="center" class="opera">
        <Col>
          <Page :total="pageInfo.total" @on-change="pageChange" prev-text="上一页" next-text="下一页" :page-size="pageInfo.pageSize" />
        </Col>
      </Row>-->
    </div>

    <!-- 修改信息 -->
    <Modal
        v-model="status"
        width="360"
        title="修改操作"
        @on-ok="modifyConfirm">
        <p class="management-form-item"><span>主机名</span><Input v-model ="singleRowData[0]" placeholder="主机名" clearable style="width: 100%" /></p>
        <p class="management-form-item"><span>IP地址</span><Input v-model ="singleRowData[1]" placeholder="IP地址" disabled clearable style="width: 100%" /></p>
        <p class="management-form-item"><span>主机MAC地址</span><Input v-model ="singleRowData[2]" placeholder="主机MAC地址" disabled clearable style="width: 100%" /></p>
        <p class="management-form-item"><span>主机MAC厂商</span><Input v-model ="singleRowData[3]" placeholder="主机MAC厂商" clearable style="width: 100%" /></p>
        <p class="management-form-item"><span>操作系统类型</span><Input v-model ="singleRowData[4]" placeholder="操作系统类型" clearable style="width: 100%" /></p>
        <p class="management-form-item"><span>终端类型</span><Input v-model ="singleRowData[5]" placeholder="终端类型" clearable style="width: 100%" /></p>
        <p class="management-form-item"><span>终端厂商</span><Input v-model ="singleRowData[6]" placeholder="终端厂商" clearable style="width: 100%" /></p>
        <p class="management-form-item"><span>开启的端口</span><Input v-model ="singleRowData[7]" placeholder="开启的端口" disabled clearable style="width: 100%" /></p>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { getManagement, delHostManage, changeStatus, updateHostManage } from '../../api/chart'
import excel from '@/libs/excel'

export default {
  name: 'chart',
  data () {
    return {
      status: false,
      loading: false,
      pageInfo: {
        pageNo: 1,
        pageSize: 8
      },
      management: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '主机名',
          slot: 'f01',
          width: 120,
          align: 'center'
        },
        {
          title: 'IP地址',
          slot: 'ipAddress',
          width: 150,
          align: 'center'
        },
        {
          title: '主机MAC地址',
          slot: 'f02',
          width: 200,
          align: 'center'
        },
        {
          title: '主机MAC厂商',
          slot: 'f03',
          width: 150,
          align: 'center'
        },
        {
          title: '操作系统类型',
          slot: 'f04',
          width: 150,
          align: 'center'
        },
        {
          title: '终端类型',
          slot: 'f05',
          width: 150,
          align: 'center'
        },
        {
          title: '终端厂商',
          slot: 'f06',
          width: 150,
          align: 'center'
        },
        {
          title: '开启的端口',
          slot: 'f07',
          width: 150,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            let texts = params.row.f07
            if (texts !== null) {
              if (texts.length > 20) {
                texts = texts.slice(0, 10) + '......'
              }
            }
            return h('div', [
              h('Tooltip', {
                props: {
                  placement: 'top',
                  transfer: true
                }
              }, [texts, h('span', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal'
                }
              }, params.row.f07)])

            ])
          }
        },
        {
          title: '操作',
          slot: 'f08',
          width: 150,
          tooltip: true
        }

      ],
      managementList: [
      ],
      exportLoading: false,
      singleRowData: []
    }
  },
  methods: {
    ...mapMutations([
      'setActiveNb'
    ]),
    ...mapActions([
      'getAsideList'
    ]),
    async getManagement () {
      this.loading = true
      let res = await getManagement({ nbCode: this.activeNb.nbCode })
      this.loading = false
      if (res.data.code === 'success') {
        this.managementList = res.data.result ? res.data.result : []
      }
      this.pageInfo.total = res.data.totalCount
    },
    /* 清除数据 */
    async deleteManage () {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要清除数据吗？</p>',
        loading: true,
        onOk: async () => {
          let res = await delHostManage({ nbCode: this.activeNb.nbCode })
          // console.log(res)
          if (res.data.code === 'success') {
            this.$Modal.remove()
            this.$Message.info('清除成功')
            this.managementList = []
          } else {
            this.$Modal.remove()
            this.$Message.error(res.data.result)
          }
        }
      })
    },
    /* 拉取数据 */
    async getManage () {
      this.loading = true
      let res = await changeStatus({ nbCode: this.activeNb.nbCode })
      this.loading = false
      // console.log(res)
      if (res.data.code === 'success') {
        this.$Message.success('拉取数据中，请稍后刷新！')
      } else {
        this.$Message.error(res.data.result)
      }
    },
    exportExcel () {
      if (this.managementList.length) {
        this.exportLoading = true
        const params = {
          title: [ '主机名', 'ipAddress',	'IP地址',	'主机MAC地址',	'主机MAC厂商',	'操作系统类型',	'终端类型',	'终端厂商', '开启的端口'],
          key: ['f01', 'f02', 'f03', 'f04', 'f05', 'f06', 'f07'],
          data: this.managementList,
          autoWidth: true,
          filename: '资产列表'
        }
        excel.export_array_to_excel(params)
        this.exportLoading = false
      } else {
        this.$Message.info('表格数据不能为空！')
      }
    },
    // 修改资产视图操作
    modify (e) {
      this.status = true
      this.singleRowData = e
    },
    // 修改资产视图操作确认
    async modifyConfirm () {
      this.loading = true
      let res = await updateHostManage({ nbCode: this.activeNb.nbCode, f01: this.singleRowData[0], ipAddress: this.singleRowData[1], f02: this.singleRowData[2], f03: this.singleRowData[3], f04: this.singleRowData[4], f05: this.singleRowData[5], f06: this.singleRowData[6], f07: this.singleRowData[7] })
      this.loading = false
      if (res.data.code == 'success') {
        this.$Loading.start()
        this.getManagement(1)
        this.$Loading.finish()
      }
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
        this.getManagement(1)
        this.$Loading.finish()
      },
      deep: true
      // immediate: true
    }
  },
  mounted () {
    this.getManagement(1)
  }
/*  beforeDestroy () {
    this.getAsideList()
  } */

}
</script>
<style lang="less" scoped>
  @import "management";
</style>
