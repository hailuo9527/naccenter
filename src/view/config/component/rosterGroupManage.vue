<template>
  <div>
    <!-- 名单组管理 -->
    <Row class="multiexpoconfig-table">
      <h3 style="margin: 0 0 20px 0">名单组管理:</h3>
      <Table
        ref="selection"
        :columns="multiexpoconfig"
        :data="multiexpoconfiglist"
        :loading="loading"
        max-height="300"
        stripe
        size="small"
      >
        <template slot-scope="{row}" slot="groupName">
          <span style="font-size: 12px;color: #666">
            <span style="color: #00e9bc;">{{row.groupName}}</span>
          </span>
        </template>
        <template slot-scope="{row}" slot="remark">
          <span style="font-size: 12px;color: #666">
            <span style="color: #00e9bc;">{{row.remark}}</span>
          </span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Icon
            Icon
            type="ios-create-outline"
            size="24"
            color="#00e9bc"
            style="cursor: pointer; margin-right: 10px"
            @click="row.type !== 'def' ? modifyGroupName(row, row.id) : ''"
          />
          <!-- 修改组名 -->
          <Modal v-model="modifyMultiExpoConfigModal" width="360">
            <p slot="header" style="color:#333;text-align:center">
              <span>修改组名</span>
            </p>
            <div style="text-align:center">
              <Form
                :model="addRouteForm"
                ref="modifyMultiExpoConfigFormValidate"
                label-position="left"
                :rules="routeFormRules"
              >
                <FormItem label="组名" prop="groupName">
                  <Input v-model.trim="addRouteForm.groupName" placeholder="请输入组名"></Input>
                </FormItem>
                <FormItem label="备注" prop="remark">
                  <Input v-model.trim="addRouteForm.remark"></Input>
                </FormItem>
              </Form>
            </div>
            <div slot="footer">
              <Button
                type="info"
                size="large"
                long
                :loading="addRouteLoading"
                @click="handleModify('modifyMultiExpoConfigFormValidate')"
              >确认修改</Button>
            </div>
          </Modal>
          <!-- 删除单一条组信息 -->
          <Icon
            type="ios-trash"
            size="24"
            style="cursor: pointer"
            color="#00e9bc"
            @click="row.type !== 'def' ? removeSingleInfo(row.id, index) : ''"
          />
          <!-- 分配名单和分配网络出口 -->
          <Icon
            type="ios-list-box"
            size="24"
            style="cursor: pointer;margin-left: 10px"
            color="#00e9bc"
            @click="distributionGroups(row.id, index)"
          />
          <Modal v-model="modifyGroupModal" width="600">
            <p slot="header" style="color:#333;text-align:center">
              <span>操作</span>
            </p>
            <Tabs v-model="name" @on-click="getTabValue">
              <!-- 分配名单 -->
              <TabPane label="分配名单" name="roster">
                <div style="text-align:center">
                  <Table
                    ref="selection"
                    :columns="multiexpoconfiggroup"
                    :data="multiexpoconfiggrouplist"
                    :loading="addRouteLoading"
                    max-height="300"
                    stripe
                    size="small"
                    @on-selection-change="getRosterValue"
                  >
                    <template slot-scope="{ row }" slot="macAddress">
                      <span style="font-size: 12px;color: #666">
                        <span style="color: #00e9bc;">{{row.macAddress}}</span>
                      </span>
                    </template>
                    <template slot-scope="{ row }" slot="ipAddress">
                      <span style="font-size: 12px;color: #666">
                        <span style="color: #00e9bc;">{{row.ipAddress}}</span>
                      </span>
                    </template>
                    <template slot-scope="{row}" slot="userName">
                      <span style="font-size: 12px;color: #666">
                        <span style="color: #00e9bc;">{{row.userName || '未命名'}}</span>
                      </span>
                    </template>
                  </Table>
                </div>
              </TabPane>
              <!-- 分配网络出口 -->
              <TabPane label="分配网络出口" name="export">
                <div style="text-align:center">
                  <Table
                    ref="selection"
                    :columns="exportGroup"
                    :data="exportList"
                    :loading="addRouteLoading"
                    max-height="300"
                    stripe
                    size="small"
                    @on-selection-change="getExportValue"
                  >
                    <template slot-scope="{row}" slot="rtrName">
                      <span style="font-size: 12px;color: #666">
                        <span style="color: #00e9bc;">{{row.rtrName || '未命名'}}</span>
                      </span>
                    </template>
                    <template slot-scope="{ row }" slot="macAddress">
                      <span style="font-size: 12px;color: #666">
                        <span style="color: #00e9bc;">{{row.rtrMAC}}</span>
                      </span>
                    </template>
                    <template slot-scope="{ row }" slot="ipAddress">
                      <span style="font-size: 12px;color: #666">
                        <span style="color: #00e9bc;">{{row.rtrIP}}</span>
                      </span>
                    </template>
                  </Table>
                </div>
              </TabPane>
            </Tabs>
            <div slot="footer">
              <Button type="info" size="large" long @click="handleModifyGroup()">确认修改</Button>
            </div>
          </Modal>
        </template>
      </Table>
    </Row>
    <!-- 添加分组 -->
    <Row type="flex" justify="space-between" class="opera">
      <Col></Col>
      <Col class="btn-group">
        <span @click="addmultiexpoconfigModal = true">添加</span>
      </Col>
    </Row>
    <Modal v-model="addmultiexpoconfigModal" width="360">
      <p slot="header" style="color:#333;text-align:center">
        <span>添加分组</span>
      </p>
      <div style="text-align:center">
        <Form
          :model="addRouteForm"
          ref="addMultiExpoConfigFormValidate"
          label-position="left"
          :rules="routeFormRules"
        >
          <FormItem label="组名" prop="groupName">
            <Input v-model.trim="addRouteForm.groupName" placeholder="请输入组名"></Input>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <Input v-model.trim="addRouteForm.remark"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button
          type="info"
          size="large"
          long
          :loading="addRouteLoading"
          @click="handleSubmit('addMultiExpoConfigFormValidate')"
        >确认添加</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  addRGInfo,
  selRGInfoByNbCode,
  delRGInfoById,
  updRGInfo,
  selRGNameList,
  addRosterToRGInfo,
  addRTRToRGInfo,
  selRtrAllByRGId
} from "../../../api/nbConfig";
export default {
  name: "multiExpoConfig",
  data() {
    const macAdress = (rule, value, callback) => {
      if (!value) callback(new Error("请检查MAC地址格式！"));
      if (value) {
        let reg = /^[a-fA-F0-9]{2}([:-][a-fA-F0-9]{2}){5}$/;
        if (!reg.test(value)) {
          callback(new Error("请检查MAC地址格式！"));
        } else {
          callback();
        }
      }
    };
    const ipAdress = (rule, value, callback) => {
      if (!value) callback(new Error("请检查IP地址格式！"));
      if (value) {
        let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (!reg.test(value)) {
          callback(new Error("请检查IP地址格式！"));
        } else {
          callback();
        }
      }
    };
    return {
      loading: false,
      multiexpoconfig: [
        {
          type: "index",
          align: "center",
          width: 60
        },
        {
          title: "组名",
          slot: "groupName"
        },
        {
          title: "备注",
          slot: "remark"
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      multiexpoconfiglist: [],
      addmultiexpoconfigModal: false,
      modifyMultiExpoConfigModal: false,
      addRouteForm: {
        groupName: "",
        remark: ""
      },
      routeFormRules: {
        macAddress: [{ validator: macAdress, trigger: "blur" }],
        ipAddress: [{ validator: ipAdress, trigger: "blur" }],
        groupName: [
          { required: true, message: "组名不能为空", trigger: "blur" }
        ]
        // groupName:[
        //   {validator: groupName, trigger: 'blur'}
        // ]
      },
      addRouteLoading: false,
      modifyGroupModal: false,
      multiexpoconfiggroup: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          type: "index",
          align: "center",
          width: 60
        },
        {
          title: "MAC地址",
          slot: "macAddress"
        },
        {
          title: "IP地址",
          slot: "ipAddress"
        },
        {
          title: "别名",
          slot: "userName"
        }
      ],
      exportGroup: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          type: "index",
          align: "center",
          width: 60
        },
        {
          title: "网络出口",
          slot: "rtrName"
        },
        {
          title: "MAC地址",
          slot: "macAddress"
        },
        {
          title: "IP地址",
          slot: "ipAddress"
        }
      ],
      multiexpoconfiggrouplist: [],
      exportList: [],
      rosters: [],
      roster: [],
      rtrId: [],
      rtrIds: [],
      name: "roster",
      id: "",
      ids: [],
      ID: ""
    };
  },
  props: {
    nbCode: {
      type: String,
      default: ""
    }
  },
  methods: {
    /* 获取名单组管理信息 */
    async selRGInfoByNbCode() {
      this.loading = true;
      let res = await selRGInfoByNbCode({ nbCode: this.nbCode });
      this.loading = false;
      if (res.data.code === "success") {
        // console.log(res.data.result);
        this.multiexpoconfiglist = res.data.result || [];
      }
    },
    // 添加名单分组
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.addRGInfo();
        } else {
          this.$Message.error("请输入组名!");
        }
      });
    },
    async addRGInfo() {
      this.addRouteLoading = true;
      let json = {
        nbCode: this.nbCode,
        groupName: this.addRouteForm.groupName,
        remark: this.addRouteForm.remark
      };
      let res = await addRGInfo(json);
      this.addRouteLoading = false;
      this.addmultiexpoconfigModal = false;
      if (res.data.code === "success") {
        this.$Message.success("添加成功");
        this.selRGInfoByNbCode();
        // console.log(res.data);
      } else {
        this.$Message.error(res.data.result);
      }
    },
    //修改组名
    handleModify(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.updRGInfo();
        } else {
          this.$Message.error("请输入组名!");
        }
      });
    },
    async updRGInfo() {
      // console.log(this.ID);
      this.addRouteLoading = true;
      let json = {
        id: this.ID,
        nbCode: this.nbCode,
        groupName: this.addRouteForm.groupName,
        remark: this.addRouteForm.remark
      };
      let res = await updRGInfo(json);
      this.addRouteLoading = false;
      this.modifyMultiExpoConfigModal = false;
      if (res.data.code === "success") {
        this.$Message.success("修改成功");
        this.selRGInfoByNbCode();
      } else {
        this.$Message.error(res.data.result);
      }
    },
    // 删除单一条路由信息
    removeSingleInfo(id, index) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确定要删除这条列表吗？</p>",
        loading: true,
        onOk: async () => {
          let res = await delRGInfoById({ id: id });
          if (res.data.code === "success") {
            this.$Modal.remove();
            this.$Message.info(res.data.result);
            this.selRGInfoByNbCode();
          } else {
            this.$Modal.remove();
            this.$Message.error(res.data.result);
          }
        }
      });
    },
    // 点击修改分组
    async distributionGroups(id, index) {
      // console.log(this.name)
      this.name = "roster";
      // console.log(this.name)
      this.id = id;
      this.modifyGroupModal = true;
      this.addRouteLoading = true;
      let json = {
        id: id,
        nbCode: this.nbCode
      };
      let res = await selRGNameList(json);
      this.addRouteLoading = false;
      if (res.data.code === "success") {
        // console.log(res.data.result);
        for (let i = 0; i < res.data.result.length; i++) {
          if (res.data.result[i].groupId == id) {
            res.data.result[i]._checked = true;
          }
        }
        this.multiexpoconfiggrouplist = res.data.result;
        // console.log(this.multiexpoconfiggrouplist);
      }
    },
    // 点击确认修改分组
    async handleModifyGroup() {
      if (this.name == "roster") {
        this.rosters = [];
        for (let item in this.roster) {
          this.rosters.push(this.roster[item].id);
        }
        // console.log(this.rosters);
        let res = await addRosterToRGInfo({ id: this.id }, this.rosters);
        // this.modifyGroupModal = false;
        if (res.data.code === "success") {
          this.$Message.success("修改成功");
          this.selRGInfoByNbCode();
        } else {
          this.$Message.error(res.data.result);
        }
      } else {
        this.rtrIds = [];
        for (let item in this.rtrId) {
          this.rtrIds.push(this.rtrId[item].rtrId);
        }
        let res = await addRTRToRGInfo({ id: this.id }, this.rtrIds);
        // this.modifyGroupModal = false;
        if (res.data.code === "success") {
          this.$Message.success("修改成功");
          this.selRGInfoByNbCode();
        } else {
          this.$Message.error(res.data.result);
        }
      }
    },
    /* 获取网络出口 */
    async getSelAllByNbCode() {
      this.loading = true;
      let res = await selRtrAllByRGId({ id: this.id, nbCode: this.nbCode });
      this.loading = false;
      if (res.data.code === "success") {
        // console.log(res.data.result);
        for (let i = 0; i < res.data.result.length; i++) {
          if (res.data.result[i].rosterGroupId == this.id) {
            res.data.result[i]._checked = true;
          }
        }
        this.exportList = res.data.result;
      }
    },
    //获取名单
    async getDistributionGroups() {
      this.addRouteLoading = true;
      let res = await selRGNameList({ id: this.id, nbCode: this.nbCode });
      this.addRouteLoading = false;
      if (res.data.code === "success") {
        // console.log(res.data.result);
        for (let i = 0; i < res.data.result.length; i++) {
          if (res.data.result[i].groupId == this.id) {
            res.data.result[i]._checked = true;
          }
        }
        this.multiexpoconfiggrouplist = res.data.result;
      }
    },
    // 弹出Modal,获取当前行的值
    modifyGroupName(row, id) {
      this.modifyMultiExpoConfigModal = true;
      this.ID = id;
      this.addRouteForm.groupName = row.groupName;
      this.addRouteForm.remark = row.remark;
    },
    //获取分配名单里勾选的值
    getRosterValue(data) {
      this.roster = data;
      // console.log(data);
    },
    //获取分配网络出口里勾选的值
    getExportValue(data) {
      this.rtrId = data;
      // console.log(this.rtrId);
    },
    getTabValue(name) {
      this.name = name;
      // console.log(name);
      if (name == "export") {
        this.getSelAllByNbCode();
      } else {
        this.getDistributionGroups();
      }
    }
  },
  mounted() {
    //配置$Message存在时长
    this.$Message.config({
      duration: 3
    });
    this.selRGInfoByNbCode();
  }
};
</script>
<style scoped lang="less">
@import "../config";
</style>