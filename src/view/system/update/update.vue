<template>
  <div class="main-content">
    <Tabs value="tab1">
      <TabPane label="系统更新" name="tab1">
        <div style="padding-bottom: 50px">
          <Card v-if="userInfo.roleId === 1">
            <p class="title">上传新版本系统镜像：</p>

            <div>
              <Upload
                multiple
                ref="upload"
                type="drag"
                :max-size="5000"
                :before-upload="handleUpload"
                :action="baseUrl">
                <div style="padding: 20px 0;">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p>点击或者拖拽到此次上传文件, <span style="color: red">请先上传系统文件，然后上传备注文件</span></p>
                </div>
              </Upload>
              <div>
                <ul class="file-list" v-for="(list,index) in file" :key="index">
                  <li class="file-item">
                    <Icon type="ios-checkmark-circle" :size="20" color="#00e9bc"/>
                    文件名:
                    <span style="font-size:15px;">{{ list.name }}</span>
                    <Icon type="ios-close" :size="26" style="float:right;cursor: pointer" @click="delFileList(index)"></Icon>
                  </li>
                </ul>
              </div>
              <div style="text-align: center; padding: 20px 0;">
                <Button @click="upload" :loading="loading" type="info">上传</Button>
              </div>
            </div>

          </Card>
          <Card style="margin-top: 20px;" v-if="updateMsg">
            <p class="title">有新版本可用，更新内容如下：</p>
            <div style="padding: 20px; min-height: 100px; white-space: pre" v-html="bateInfo" >
              <!--{{bateInfo === '' ? '暂无更新数据' : bateInfo }}-->
            </div>
            <div style="padding: 50px 0">
              <Card :bordered="false" style="min-height: 300px">
                <p class="title">可升级设备：</p>
                <Table border ref="selection" @on-selection-change="selectNbChange" :columns="columns" :data="updatableNbList"></Table>
                <Button style="margin-top: 20px;" @click="updatVersionToNB" :loading="loading2" type="info" v-if="willUpdateNbList.length">更新</Button>
              </Card>


            </div>
          </Card>
          <div v-if="!updateMsg && userInfo.roleId !== 1" style="display: flex; justify-content: center; align-items: center; height: 500px;width: 100%;font-size: 16px">
            暂无更新信息
          </div>
        </div>

      </TabPane>
      <TabPane label="初始化NB序列号"  v-if="userInfo.roleId === 1" name="tab2">
        <Card v-if="userInfo.roleId === 1">
          <p class="title">上传NB序列号文件：</p>

          <div>
            <Upload
              ref="nbUpload"
              type="drag"
              :max-size="5000"
              :format="['txt']"
              accept=".txt"
              :before-upload="nbFileUpload"
              :action="baseUrl">
              <div style="padding: 20px 0;">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或者拖拽到此次上传文件, <span style="color: red">请上传txt文件</span></p>
              </div>
            </Upload>
            <div v-if="nbCodeFile">
              <Icon type="ios-checkmark-circle" color="#00e9bc" size="20"/>
              文件名:
              <span style="font-size:15px;">{{ nbCodeFile.name }}</span>
              <Icon type="ios-close" size="26"  style="float:right;cursor: pointer" @click="nbCodeFile = null"></Icon>
            </div>
            <div style="text-align: center; padding: 20px 0;">
              <Button @click="uploadNbCodeFile" :loading="loading" type="info">上传</Button>
            </div>
          </div>

        </Card>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
  import axios from 'axios'
  import { getToken } from '../../../libs/util'
  import { selLatestEdition, updatVersionToNB } from "../../../api/update";
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'update',
    data () {
      return {
        willUpdateNbList: [],
        updatableNbList: [],
        baseUrl: '',
        file: [],
        nbCodeFile: null,
        loading: false,
        loading2: false,
        bateInfo: '',
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '机器名称',
            key: 'nbName'
          },
          {
            title: '机器序列号',
            key: 'nbCode'
          }
        ],
      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.login.userInfo,
        updateMsg: state => state.app.updateMsg
      })
    },
    methods: {
      ...mapActions([
        'getUpdateMsg'
      ]),
      delFileList(index){
        let that = this;
        that.file.splice(index, 1);
      },
      handleUpload (file) {
        let that = this;
        if(that.file.length >= 2){
          this.$Message.info("最多只能上传2个文件");
        }else{
          that.file.push(file);
        }
        return false;
      },
      /* 上传更新文件 */
      upload(){
        let that = this;
        if(that.file.length > 0){
          if (that.file.length === 1) {
            that.$Message.error("请上传备注文件！");
            return
          }
          that.loading = true;
          //创建 formData 对象
          let formData = new FormData();

          //多个文件上传
        /*  for(var i=0; i< that.file.length; i++){
            formData.append("uploadFile",that.file[i]);   // 文件对象
          }*/
          formData.append("updFile",that.file[0]);   // 文件对象
          formData.append("remarkFile",that.file[1]);   // 文件对象
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          axios.post(that.$config.baseUrl.pro + "/upload", formData, {
            timeout: 10000,
            headers: {
              'Content-Type': 'multipart/form-data',
              AUTHORIZATION: getToken()
            }
          }).then(function (res) {
            that.loading = false;
            if (res.data.code === 'success') {
              that.$Message.success(res.data.result)
            }

          }).catch(function (error) {
            that.loading = false;
            that.$Message.error('服务器错误' + error);
          });
        }
         else {
          that.$Message.error("请上传系统文件！");
        }
      },
      /* 获取NacBox最新版本介绍公告 */
      async selLatestEdition () {
        let res = await selLatestEdition()
        if (res.data.code === 'success') {
          let reg = /\n/g
          this.bateInfo = res.data.result === '' ? '暂无信息' : res.data.result
          this.bateInfo = this.bateInfo.replace(reg, '</br>')
        } else {
          this.$Message.error(res.data.result)
        }
      },
      /* 获取可更新NB列表 */
      checkVersion () {
        this.getUpdateMsg().then((res) => {
          if (res.data.code === 'success') {
            this.updatableNbList = res.data.result || {}
          } else {
            this.$Message.error(res.data.result)
          }
        })
      },
      /* 更新nb系统版本 */
      async updatVersionToNB () {
        this.loading2 = true
        let res = await  updatVersionToNB(this.willUpdateNbList)
        this.loading2 = false
        if (res.data.code === 'success') {
          this.$Message.success({
            content: '更新指令已发出，五分钟后即可更新到新版本！',
            duration: 3
          })
        } else {
          this.$Message.error(res.data.result)
        }
      },

      nbFileUpload (file) {
        this.nbCodeFile = file
        return false;
      },
      /* 上传NB序列号初始化文件 */
      uploadNbCodeFile(){
        let that = this;
        if(that.nbCodeFile){
          that.loading = true;
          //创建 formData 对象
          let formData = new FormData();

          formData.append("nbCodeFile",that.nbCodeFile);   // 文件对象
          axios.post(that.$config.baseUrl.pro + "/uploadNbCodeFile", formData, {
            timeout: 10000,
            headers: {
              'Content-Type': 'multipart/form-data',
              AUTHORIZATION: getToken()
            }
          }).then(function (res) {
            that.loading = false;
            if (res.data.code === 'success') {
              that.$Message.success(res.data.result)
            }

          }).catch(function (error) {
            that.loading = false;
            that.$Message.error('服务器错误' + error);
          });
        }
        else {
          that.$Message.error("请上传NB序列号初始化文件！");
        }
      },

     /* 选中要更新的机器 */
      selectNbChange (selection) {
        let arr = []
        selection.map((item) => {
          arr.push(item.nbCode)
        })
        this.willUpdateNbList = arr

      }
    },
    mounted() {
      this.selLatestEdition()
      this.checkVersion()
    }
  }
</script>
<style lang="less" scoped>
  @import "../userInfo/userInfo";
  @import "update";
</style>
