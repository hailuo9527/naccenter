<template>
  <div class="main-content">
    <Tabs value="tab1" name="main-tab" >
      <TabPane label="自动分配的IP段" name="tab1" tab="main-tab">
        <Table border :columns="tableColumns" :data="tableList" :loading="loading" max-height="500">
        </Table>
        <div style="text-align: right; margin-top: 20px;">
          <Button type="primary" @click="modal = true">添加</Button>
        </div>
      </TabPane>
    </Tabs>
    <Modal v-model="modal" width="360">
      <p slot="header" style="color:#333;text-align:center">
        <span>添加IP段</span>
      </p>
      <div>
        <Form :model="ipForm"  ref="formValidate" :rules="ipFormRules">
          <FormItem label="子网掩码" prop="mask">
            <Input v-model.trim="ipForm.mask" placeholder="请输入子网掩码"></Input>
          </FormItem>
          <FormItem label="选择分组" prop="groupId">
            <Select v-model="ipForm.groupId">
              <Option :value="item.groupId" v-for="(item, index) in groupList">{{item.groupName}}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="loading" @click="handleSubmit('formValidate')">确认添加</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getIpAutoMode, setIpAutoMode } from '../../../api/ipAutoMode'
import { getAllGroup } from '../../../api/group'

export default {
  name: 'ipAutoConfig',
  data () {
    const ipSubRules = (rule, value, callback) => {
      if (!value) callback(new Error('请输入子网掩码！'))
      let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/
      if (!reg.test(value)) {
        callback(new Error('请检查子网掩码格式！'))
      }
      callback()
    }
    return {
      tableColumns: [
        {
          type: 'index',
          // width: 60,
          align: 'center'
        },
        {
          title: '起始IP',
          key: 'ipStart'
        },
        {
          title: '结束IP',
          key: 'ipEnd'
        },
        {
          title: 'nb序列号',
          key: 'nbCode'
        }
      ],
      tableList: [],
      ipForm: {
      },
      ipFormRules: {
        mask: [
          { required: true, validator: ipSubRules, trigger: 'blur' }
        ],
        groupId: [
          { required: true, message: '请选择分组!', trigger: 'change', type: 'numbe  r' }
        ]
      },
      groupList: [],
      modal: false,
      loading: false
    }
  },
  methods: {
    // 获取自动分配的IP段
    async getIpAutoMode () {
      let res = await getIpAutoMode()
      console.log(res)
      if (res.data.code === 'success') {
        this.tableList = res.data.result || []
      }
    },
    // 添加自动分配的IP段
    async setIpAutoMode () {
      let json = {
        ...this.ipForm
      }
      this.loading = true
      let res = await setIpAutoMode(json)
      this.loading = false
      if (res.data.code === 'success') {
        this.$Message.success('添加成功！')
        this.getIpAutoMode()
        this.modal = false
      } else {
        this.$Message.error(res.data.result)
      }
    },
    /* 获取所有分组 */
    async getAllGroup () {
      let res = await getAllGroup()
      console.log(res)
      if (res.data.code === 'success') {
        this.groupList = res.data.result
      } else {
        // console.log(res.data.result)
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.setIpAutoMode()
        } else {
          this.$Message.error('操作失败，请检查输入信息格式是否正确!')
        }
      })
    }
  },
  mounted () {
    this.getAllGroup()
    this.getIpAutoMode()
  }
}
</script>
<style scoped lang="less">
  @import "ipAutoConfig";
</style>
