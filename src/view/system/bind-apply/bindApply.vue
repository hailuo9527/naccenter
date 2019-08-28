<template>
  <div class="main-content">
    <Tabs value="tab1">
      <TabPane label="申请列表" name="tab1">
        <Table border :columns="tableColumns" :data="applyList" :loading="tableLoad">
          <template slot-scope="{ row }" slot="applyUserName">
            <strong>{{ row.applyUserName }}</strong>
          </template>
          <template slot-scope="{ row }" slot="flowState">
            {{ row.flowState | flowState }}
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" :disabled="row.flowState !== 1 || row.applyUserName === userInfo.userName" @click="show(row)">审核</Button>
          </template>
        </Table>
      </TabPane>
    </Tabs>
    <!--对话框-->
    <Modal
      v-model="changeApplySateModal"
      :loading = "changeApplyStateLoading"
      title="审核">
      <div style="padding: 20px">
        <Form :model="activeApplyInfo" :label-width="80" ref="uptApply" :rules="uptApplyValidate">
          <FormItem label="状态" prop="state">
            <Select v-model="activeApplyInfo.state">
              <Option :value="item.state" v-for="(item, index) in stateList">{{item.stateName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="审核理由" prop="reason">
            <Input v-model="activeApplyInfo.reason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="审核理由..."></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="changeApplySateModal = false">取消</Button>
        <Button type="info"  @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getAllUserFlow, checkUserApplyBind } from '../../../api/userBind'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'bindApply',
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
          title: '申请用户',
          key: 'applyUserName',
          slot: 'applyUserName'
        },
        {
          title: '申请理由',
          key: 'applyReason'
        },
        {
          title: '审核人',
          key: 'auditUserName'
        },
        {
          title: '审核状态',
          key: 'flowState',
          slot: 'flowState'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          slot: 'action'
        }
      ],
      applyList: [],
      stateList: [
        { state: 1, stateName: '通过' },
        { state: 0, stateName: '拒绝' }
      ],
      flowId: null,
      changeApplyStateLoading: false,
      changeApplySateModal: false,
      activeApplyInfo: {
        state: 1,
        reason: ''
      },
      uptApplyValidate: {
        state: [
          { required: true, message: '审核状态不能为空！', type: 'number', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo
    })
  },
  filters: {
    flowState (value) {
      switch (value) {
        case 1:
          return '待审核'
        case 2:
          return '通过'
        case 3:
          return '拒绝'
      }
    }
  },
  methods: {
    ...mapMutations(['setApplyCount']),
    ...mapActions(['getApplyCount']),
    /* 查询所有流程 */
    async getAllUserFlow () {
      let res = await getAllUserFlow()
    //  console.log(res)
      if (res.data.code === 'success') {
        this.applyList = res.data.result
      } else {
       // console.log(res)
      }
    },
    /* 提交审核结果 */
    async checkUserApplyBind () {
      let json = {
        state: this.activeApplyInfo.state === 1,
        auditReason: this.activeApplyInfo.reason,
        flowId: this.flowId
      }
      this.changeApplyStateLoading = true
      let res = await checkUserApplyBind(json)
      this.changeApplyStateLoading = false
      this.changeApplySateModal = false
      if (res.data.code === 'success') {
        this.$Message.success('审核提交成功！')
        this.getAllUserFlow()
      } else {
        this.$Message.error(res.data.result)
      }
      this.getApplyCount()
    },
    show (row) {
      this.changeApplySateModal = true
      this.flowId = row.flowId
    },
    ok () {
      this.$refs['uptApply'].validate((valid) => {
        if (valid) {
          this.checkUserApplyBind()
        } else {
          this.$Message.error('操作失败，请检查输入信息格式是否正确!')
        }
      })
    }
  },
  mounted () {
    this.getAllUserFlow()
  }
}
</script>
<style lang="less" scoped>
  @import "bindApply";
</style>
