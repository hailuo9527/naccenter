<template>
  <div class="">
    <!--ip-->
    <div>
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
          <span @click="addIp(0)" >添加</span>

        </Col>
      </Row>
    </div>
    <!--ip段-->
   <div>
     <Row class="list-head" type="flex" justify="space-between" align="top">
       <Col span="6"><h3>回收IP段列表:</h3></Col>
       <!--<Col span="6">
         <Input suffix="ios-search" placeholder="Enter text" />
       </Col>-->
     </Row>
     <Row class="table-container">
       <Table :columns="table2" :data="list2" :loading="loading" height="300"  stripe
              size="small">
         <template slot-scope="{ row }" slot="ipStart">
           <span style="font-size: 12px;color: #666"><span style="color: #00e9bc">{{ row.ipStart }}</span></span>
         </template>
         <template slot-scope="{ row }" slot="ipEnd">
           <span style="font-size: 12px;color: #666"><span style="color: #00e9bc">{{ row.ipEnd }}</span></span>
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
         <span @click="addIp(1)" >添加</span>

       </Col>
     </Row>
   </div>

    <Modal v-model="ipModifyModal" @on-visible-change="modalChange" width="360">
      <p slot="header" style="color:#333;text-align:center">
        <span>{{type ? '添加回收IP段' : '添加需要回收的ip'}}</span>
      </p>
      <div style="text-align:center">
        <Form :model="ipModifyForm"  v-if="type" label-position="left" ref="ipModifyForm" :rules="ipModifyFormRules">
          <FormItem label="起始IP" prop="ipStart">
            <Input v-model.trim="ipModifyForm.ipStart" placeholder="请输入起始IP"></Input>
          </FormItem>
          <FormItem label="结束IP" prop="ipEnd">
            <Input v-model.trim="ipModifyForm.ipEnd" placeholder="请输入结束IP"></Input>
          </FormItem>
        </Form>
        <Form :model="ipModifyForm" v-if="!type"  label-position="left" ref="ipModifyForm" :rules="ipModifyFormRules">
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
          width: 60
        },
        {
          title: 'Ip地址',
          slot: 'ipAddress'
        }
      ],
      list: [],
      table2: [
        {
          type: 'index',
          width: 60
        },
        {
          title: '起始IP',
          slot: 'ipStart'
        },
        {
          title: '结束IP',
          slot: 'ipEnd'
        }
      ],
      list2: [],
      ipModifyModal: false,
      ipModifyForm: {
      },
      ipModifyFormRules: {
        ipAddress: [
          { required: true, message: '请输入ip地址！', validator: ipaddressRules, trigger: 'blur' }
        ],
        ipStart: [
          { required: true, message: '请输入ip地址！', validator: ipaddressRules, trigger: 'blur' }
        ],
        ipEnd: [
          { required: true, message: '请输入ip地址！', validator: ipaddressRules, trigger: 'blur' }
        ]
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
        res.data.result.iplist.map((item, index) => {
          this.list.push({ ip: item })
        })
        this.list2 = res.data.result.ipSegmentList || []
      }
      console.log(this.list)
    },
    // 添加回收的ip
    async insIpRecovery () {
      let json = {
        nbCode: this.nbCode,
        ipAddress: this.ipModifyForm.ipAddress || null,
        ipEnd: this.ipModifyForm.ipEnd || null,
        ipStart: this.ipModifyForm.ipStart || null,
        type: this.type
      }
      let res = await insIpRecovery(json)
      // console.log(res)
      this.ipModifyForm = {}
      if (res.data.code === 'success') {
        this.$Message.success('添加成功！')
        this.getIpRecovery()
        this.ipModifyModal = false
      } else {
        this.$Message.error(res.data.result)
      }
    },
    addIp (type) {
      this.ipModifyModal = true
      this.type = type
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
    }
  },
  mounted () {
    this.getIpRecovery()
  }
}
</script>
<style lang="less" scoped>
  @import "../../config/config.less";
</style>
