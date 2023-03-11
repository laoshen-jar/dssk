<template>
  <div>
    <nut-popup
        position="center" closeable round
        v-model="Visiabl"
        :style="{ width:'300px' }"
        class="popupbox"
        style="border-radius:20px"
      >
    <div class="poputtitle">完善手机号</div>
    <div class="poputminiinfo">储值金额需要与手机号绑定</div>
    <div class="poputclumn">请输入手机号</div>
    <div class="inputPhone" style="margin-bottom:10px">
      <span class="flex">+86</span>
      <input type="number" class="popupinput" maxlength="11" v-model="Phone1" @blur="OnBlur(1)">
      <div class="errmsg" v-if="Phone1ErrorMsg">{{Phone1ErrorMsg}}</div>
    </div>
    <div class="poputclumn">请再次输入手机号</div>
    <div class="inputPhone">
      <span class="flex">+86</span>
      <input type="number" class="popupinput" maxlength="11" v-model="Phone2" @blur="OnBlur(2)">
      <div class="errmsg" v-if="Phone2ErrorMsg">{{Phone2ErrorMsg}}</div>
    </div>
    <div class="errmsg" v-if="ErrorMsg">{{ErrorMsg}}</div>
    <div class="btngroup">
      <input type="button" value="取消" class="cancelbtn">
      <input type="button" value="确定" class="submitbtn" :class="{disabled:!EnterOver}" :disabled="!EnterOver" @click="OnSubmit">
    </div>
    </nut-popup>
  </div>
</template>

<script>
  import {UpdatePhone} from '@/api/member';
  import { mapActions, mapGetters } from 'vuex'
  export default {
    props:{
      ShowGetPhone:{type:Boolean,default:true}
    },
    data() {
      return {
        Phone1: '',
        Phone2:'',
        Phone1ErrorMsg:'',
        Phone2ErrorMsg:'',
        ErrorMsg:'',
        Visiabl:false,
      }
    },
    computed: {
      ...mapGetters(['Member']),
      EnterOver() {
        return this.Phone1==this.Phone2&&this.Phone1.length==11;
      }
    },
    created () {
      this.Visiabl=this.ShowGetPhone;
    },
    methods: {
      OnBlur(i) {
        var Phone=i==1?this.Phone1:this.Phone2;
          console.log(Phone)
         if(Phone&&!(/^1[3456789]\d{9}$/.test(Phone))){
          if(i==1){
            this.Phone1ErrorMsg='请输入正确的手机号'
          }
          else{
            this.Phone2ErrorMsg='请输入正确的手机号'
          }
        }
        else{
          if(i==1){
            this.Phone1ErrorMsg=''
          }
          else{
            this.Phone2ErrorMsg=''
          }
        }
        this.OnErrorMsg();
      },
      OnErrorMsg() {
        if(this.Phone1&&this.Phone2&&this.Phone1!=this.Phone2){
          this.ErrorMsg = '两次输入手机号不一致';
        }
        else{
          this.ErrorMsg='';
        }
      },
      OnSubmit(){
        UpdatePhone({MemberCode:this.Member.MemberCode,Phone:this.Phone1}).then(res=>{
          if(res.state!=200){
            this.$notify.warn('手机号保存异常！'+res.msg);
          }
          else{
            this.$notify.success('保存成功');

            var member=JSON.parse(JSON.stringify(this.Member));
            member.Phone=this.Phone1;
            this.$store.commit('set_Member',member);
            setTimeout(() =>{
              this.$emit('CallBack',{state:true,Phone:this.Phone1})
            },2000);
          }
        })
      },
    },
    watch: {
      ShowGetPhone(newValue, oldValue) {
        this.Visiabl=newValue;
      },
      Visiabl(newValue, oldValue) {
        if(!newValue&&oldValue){
          this.$emit('CallBack',{state:false})
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
.popupbox{padding: 20px;}
.poputtitle{font-size: 16px;line-height: 40px;text-align: center; color: #1a1a1a; }
.poputminiinfo{font-size: 12px;line-height: 24px;text-align: center;color: gray;margin-bottom: 10px;}
.poputclumn{font-size: 12px;line-height: 24px;color: #1a1a1a;}
.inputPhone{font-size: 16px;position: relative;}
.inputPhone .flex{position: absolute;left: 0;top: 0;height: 100%;width: 50px;text-align: center; line-height: 40px;display: inline-block;}
.inputPhone .popupinput{ width: 100%;height: 41px;margin: 0 auto;text-indent: 50px; background: whitesmoke;border-radius: 4px;border: 1px solid #ddd;letter-spacing:5px }
.errmsg{font-size: 12px;color:#f2270c ;margin-top: 5px; }
.btngroup {text-align: center;padding: 30px 0 10px;margin-top: 10px;}
.btngroup input{width: 110px;height: 36px;border-radius:18px;font-size: 14px; border-width: 1px; margin: 0 7px 10px;}
.btngroup .cancelbtn{background: #fff;color: #fa2c19;border: 1px solid #fa2c19;}
.btngroup .submitbtn{color:white ; background: linear-gradient(135deg,#fa2c19 0%,#fa6419 100%);border: none; }
.btngroup .disabled{opacity: 0.3;}
</style>