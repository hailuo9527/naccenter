<template>
  <div class="">
    <Row class="list-head" type="flex" justify="space-between" align="top">
      <Col span="6"><h3>回收IP列表:</h3></Col>
      <!--<Col span="6">
        <Input suffix="ios-search" placeholder="Enter text" />
      </Col>-->
    </Row>
    <Row class="table-container">
      <Table :columns="table" :data="list" :loading="loading" height="300"  stripe
             size="small">
        <template slot-scope="{ row }" slot="ipAddress">
          <span style="font-size: 12px;color: #666"><span style="color: #00e9bc">{{ row.ip }}</span></span>
        </template>
       <!-- <template slot-scope="{ row, index }" slot="action">
          <Icon type="ios-build" size="24" color="#00e9bc" style="cursor: pointer" @click="modifyIp(row)"/>
        </template>-->
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
        <span>{{type ? '修改固定ip' : '添加需要回收的ip'}}</span>
      </p>
      <div style="text-align:center">
        <Form :model="ipModifyForm"  label-position="left" ref="ipModifyForm" :rules="ipModifyFormRules">
          <FormItem label="ip地址" prop="ipAddress">
            <Input v-model.trim="ipModifyForm.ipAddress" placeholder="请输入ip地址"></Input>
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
  import { getIpRecovery, insIpRecovery } from '../../../api/ipManage'
  export default {
    name: 'ipRecovery',
    data () {
      const ipaddressRules = (rule, value, callback) => {
        if (!value) callback()
        let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (!reg.test(value)) {
          callback(new Error('请检查IP地址格式！'))
        }
        callback()
      }
      return {
        type: 0,
        loading: false,
        table: [
          {
            type: 'index',
            width: 60,
          },
          {
            title: 'Ip地址',
            slot: 'ipAddress'
          }
        ],
        list: [],
        ipModifyModal: false,
        ipModifyForm: {
          ipAddress: ''
        },
        ipModifyFormRules: {
          ipAddress: [
            { validator: ipaddressRules, trigger: 'blur' }
          ],
        }
      }
    },
    watch: {
      nbCode () {
        this.getIpRecovery()
      }
    },
    props: {
      nbCode: {
        type: String,
        default: ''
      }
    },
    methods: {
      // 获取回收的IP列表
      async getIpRecovery () {
        let res = await getIpRecovery({ nbCode: this.nbCode })
        console.log(res)
        if (res.data.code === 'success' && res.data.result) {
            res.data.result.map((item, index) => {
              this.list.push({ip: item})
            })
        }
        console.log(this.list)
      },
      // 添加回收的ip
      async insIpRecovery () {
        let res = await insIpRecovery({ nbCode: this.nbCode, ipAddress: this.ipModifyForm.ipAddress })
        console.log(res)
        if (res.data.code === 'success') {
          this.$Message.success('添加成功！')
          this.getIpRecovery()
          this.ipModifyModal = false
        } else {
          this.$Message.error(res.data.result)
        }
      },
      addIp() {
        this.ipModifyModal = true
      },
      modalChange () {

      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.insIpRecovery()
          } else {
            this.$Message.error('请检查输入信息是否有误')
          }
        })
      },
    },
    mounted () {
      this.getIpRecovery()
    }
  }
</script>
<style lang="less" scoped>
  @import "../ip-manage";
</style>
