<template>
  <div class="main-content">
    <Tabs value="tab1">
      <TabPane label="系统更新" name="tab1">
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
                  <Icon type="ios-checkmark-circle" />
                  文件名:
                  <span style="font-size:15px;">{{ list.name }}</span>
                  <Icon type="ios-close" size="20" style="float:right;" @click="delFileList(index)"></Icon>
                </li>
              </ul>
            </div>
            <div style="text-align: center">
              <Button @click="upload" :loading="loading" type="info">上传</Button>
            </div>
          </div>

        </Card>
        <Card style="margin-top: 20px;">
          <p class="title">有新版本可用，更新内容如下：</p>
          <div style="padding: 20px; min-height: 100px">
            {{bateInfo === '' ? '暂无更新数据' : bateInfo }}
          </div>
          <div style="padding: 50px 0">
            <i-select v-model="willUpdateNbList" multiple style="width:260px">
              <Option v-for="item in updatableNbList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </i-select>
            <Button @click="updatVersionToNB" :loading="loading2" type="info" v-if="willUpdateNbList.length">更新</Button>
          </div>
        </Card>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
  import axios from 'axios'
  import { getToken } from '../../../libs/util'
  import { checkVersion, selLatestEdition, updatVersionToNB } from "../../../api/update";
  import { mapState } from 'vuex'
  export default {
    name: 'update',
    data () {
      return {
        willUpdateNbList: [],
        updatableNbList: [],
        baseUrl: '',
        file: [],
        loading: false,
        loading2: false,
        bateInfo: ''
      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.login.userInfo
      })
    },
    methods: {
      delFileList(index){
        let that = this;
        that.file.splice(index, 1);
        console.log(that.file);
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
        console.log(res)
        if (res.data.code === 'success') {
          this.bateInfo = res.data.result
        } else {
          this.$Message.error(res.data.result)
        }
      },
      /* 获取可更新NB列表 */
      async checkVersion () {
        let res = await checkVersion()
        console.log(res)
        if (res.data.code === 'success') {
          this.updatableNbList = res.data.result || []
        } else {
          this.$Message.error(res.data.result)
        }
      },
      /* 更新nb系统版本 */
      async updatVersionToNB () {
        console.log(this.willUpdateNbList)
        this.loading2 = true
        let res = await  updatVersionToNB(this.willUpdateNbList)
        this.loading2 = false
        if (res.data.code === 'success') {
          this.$Message.success('更新成功')
        } else {
          this.$Message.error(res.data.result)
        }
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
