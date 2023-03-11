<template>
  <div class="page">
    <!-- <div v-if="BusinessLogoUrl" class="logo" v-lazy:background-image="BusinessLogoUrl"></div> -->
    <p class="fontred">{{Business.BusinessName}}</p>
    <div v-if="SubscribePicture">
      <div class="picture" v-lazy:background-image="SubscribePicture"></div>
      <!-- <img class="picture" :src="`${this.OpenService}/GetQrCode?QrCode=${encodeURIComponent(`${WeiXinService}/WeiXin/JumpAuthorizeUrl?AppID=${Business.AppID}&Type=ScanDesk&Data=${DeskID}`)}`" width="300" height="300"  /> -->
      <p>长按关注公众号</p>
      <p>以方便接收点餐消息及更多活动通知</p>
    </div>
    <div v-else style="margin-top:50px">请先到管理后台配置关注二维码图片路径</div>
    <div class="closebtn iconfont iconchahao" @click="OnClose"></div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from "vuex";
  export default {
    computed: {
      ...mapGetters(["Business","Member","BusinessConfig","OpenService","WeiXinService","DeskID"]),
      BusinessLogoUrl(){
        if(this.Business){return this.Business.LogoUrl}
        return false;
      },
      SubscribePicture(){
        return 'https://qr.api.cli.im/newqr/create?data=https%253A%252F%252Fmp.weixin.qq.com%252Fmp%252Fprofile_ext%253Faction%253Dhome%2526__biz%253DMzU2MTcxOTgzMA%253D%253D%2523wechat_redirect&level=H&transparent=false&bgcolor=%23FFFFFF&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&logoshape=no&size=500&kid=cliim&key=327974cc8961c40ec70fc434b872c800';
        // return 'http://www.dsskvip.com/api//GetQrCode?QrCode=http%3A%2F%2Fweixin.dsskvip.com%2FWeiXin%2FJumpAuthorizeUrl%3FAppID%3Dwxca5a290aee8bcb3b%26Type%3DScanDesk%26Data%3Db812ca4a631145aa848c5907b27e59f5';
        // return this.Business.SubscribePicture;
      },
    },
    data() {
      return {
      }
    },
    created () {

    },
    methods: {
      OnClose() {
        this.$emit("OnClose",{})
      }
    },
  }
</script>

<style scoped>
.page{position: absolute;top: 0;bottom: 0;width: 100%;left: 0;background: white;z-index: 999; text-align: center;padding-top: 30%;}
.logo,.picture{background-size: cover; background-repeat: no-repeat; background-position: center;border-top-right-radius: 10px;border-top-left-radius: 10px; margin: 0 auto;}
.logo{width: 80px;height: 80px; border-radius: 10px; margin: 20px auto;}
.picture{width: 200px;height: 200px; border-radius: 10px;margin: 10px auto 20px;}
.fontred{color: #ea454c; font-weight: bold;}
.closebtn{position:absolute;top:50px;right: 30px;text-align: center;font-size: 38px; }
</style>