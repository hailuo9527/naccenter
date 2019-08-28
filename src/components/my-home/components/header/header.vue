<template>
    <Row class="header">
      <div class="logo">
        <div class="img">
          <img :src="logo" alt="">
        </div>
        <div class="text">NacCenter</div>
      </div>
      <div class="tags-nav">
        <router-link :to="{path: '/home'}">系统概览</router-link>
        <router-link :to="{path: `/chart`}">图表</router-link>
        <router-link :to="{path: `/config`}" >配置</router-link>
        <router-link :to="{path: `/management`}">资产视图</router-link>
        <!--  <router-link :to="{path: `/system`}">系统管理</router-link>-->
        <router-link :to="{path: `/warning`}">报警</router-link>
        <router-link :to="{path: `/ipManage`}">IP管理</router-link>
      </div>
      <div class="profile">
        <Dropdown style="margin-left: 20px" placement="bottom-end" trigger="click"  @on-click="dropEvent">
          <a href="javascript:void(0)"  class="trigger">
            {{userInfo.userName}}
            <Badge :count="applyCount"></Badge>
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="sysControl">
              <router-link :to="{path: `/system`}" style="color: #333">系统管理  <Badge :count="applyCount"></Badge></router-link>
            </DropdownItem>
            <DropdownItem name="logout">退出</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

    </row>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import logo from '@/assets/images/logo.svg'
export default {
  name: 'my-header',
  data () {
    return {
      logo: logo
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo,
      activeNb: state => state.app.activeNb,
      asideList: state => state.app.asideList,
      applyCount: state => state.app.applyCount
    })
  },
  methods: {
    ...mapActions([
      'handleLoginOut', 'getAsideList', 'getApplyCount'
    ]),
    ...mapMutations([
      'setActiveNb', 'setApplyCount'
    ]),
    loginOut () {
      this.handleLoginOut().then(res => {
        if (res.data.code === 'success') {
          localStorage.clear()
          this.$router.push('/login')
        }
      })
    },
    dropEvent (data) {
      switch (data) {
        case 'logout':
          this.loginOut()
          break
      }
    }
  },
  mounted () {
    this.getApplyCount()
  }
}
</script>
<style scoped lang="less">
  .router-link-exact-active,.router-link-active{
    color: #00c5a2!important;
  }
  .header{
    display: flex;
    height: 94px;
    min-width: 996px;
    background: #fff;
    align-items: center;
    .logo{
      display: flex;
     align-items: center;
      .img{
        height: 50px;
        width: 50px;
        img{
          width: 80%;
          height: 80%;
        }
      }
      .text{
        font-size: 30px;
      }
      width: 239px;
      height: 69px;
      margin-left: 20px;

    }
    .tags-nav{
      flex: 1;
      margin-left: 50px;
      a{
        font-size: 24px;
        color: #505050;
        margin: 0 20px;
      }
    }
    .profile{
      //background: #e5e5e5;
      &:hover{
        background: #e5e5e5;
      }
      height: 100%;
      display: flex;
      align-items: center;
      /deep/.ivu-dropdown{
        height: 100%;
      }
      /deep/.ivu-dropdown-rel{
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 16px;
        padding: 0 30px;
        a{
          color: #666;
        }
      }
    }
  }

</style>
