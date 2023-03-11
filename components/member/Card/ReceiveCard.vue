<template>
<div class="container card">
    <div class="bg">
        <div class="picture"><img :src="CardInfo.Picture" class="icon" alt=""></div>
        <div class="cardtype">{{CardInfo.CardType}}</div>
        <div class="cardname">{{CardInfo.CardName}}{{SendNumber>1?' · '+SendNumber+'张':''}}</div>
        <div class="btn" v-if="!isDisable" @click="GetCard">立即领取</div>
        <div class="btn_disable" v-if="isDisable">{{BtnText}}</div>
        <div class="content">
            <strong>使用条件：</strong>消费满{{CardInfo.SatisfyAmount}}元可用，<span v-if="CardInfo.CardType!='礼品券'">领取后{{CardInfo.AfterHours==0?'及时':CardInfo.AfterHours+'小时'}}生效</span><span v-else>仅支持门店线下核销</span>
            <br/>
            <!-- <strong>可用时间：</strong>{{ dateFormart(CardInfo.StartDate,'YYYY.MM.DD')}} - {{ dateFormart(CardInfo.EndDate,'YYYY.MM.DD')}} -->
            <strong>可用时间：</strong>{{CardInfo.UseMode=='FixedDays'?dateFormart(CardInfo.StartDay,'YYYY.MM.DD')+' - '+dateFormart(CardInfo.EndDay,'YYYY.MM.DD'):'领取后'+CardInfo.EffectiveDays+'天内有效'}}
        </div>
        <div class="spline">
            <div class="left"></div>
            <div class="right"></div>
            <div class="line"></div>
        </div>
        <div class="content">
            <div v-if="CardInfo.ApplyStores&&CardInfo.ApplyStores.length>0" class="Storesbox" :class="{showmore:ShowMoreStores}">
                <strong>可用门店：</strong>
                <span v-for="(item,index) in CardInfo.ApplyStores" :key="index">
                  <span style="margin-right:5px">{{item.StoreName}}</span>
                </span>
                <div class="iconmore" v-show="!ShowMoreStores" @click="ShowMoreStores=true">-- 展开更多 --</div>
            </div>
            <div>
                <strong>使用说明：</strong><span style="white-space: pre-wrap;"><br/>{{CardInfo.Content}}</span><br/>活动最终解释权归商家所有
            </div>
            
        </div>
    </div>
</div>
</template>


<script>

import {GetCard,GetReceiveCard,SendCard,GetLimitState} from '@/api/card'
import { mapActions, mapGetters } from 'vuex'
import { Toast } from 'mint-ui'
import moment from 'moment'

export default {
    name: 'CardInfo',
    computed: {
        ...mapGetters(['MemberCode', 'StoreCode', 'DeskID','Member']),
    },
    data() {
        return {
            shop: {}, // 商品详情
            CardInfo: {}, //商品详情
            Availablestores:[],//卡券可用门店
            BtnText:'',//按钮文字
            SendNumber:1,
            isDisable:false,//领取按钮能否点击
            LimitRule:null,//卡券领取限制条件
            ShowMoreStores:false,
        }
    },
    created() {
        // 请求数据
        // this.GoodsCode = this.$route.query.GoodsCode;
        console.log('Member',this.Member)
        this.SendNumber=this.$route.query.SendNumber?this.$route.query.SendNumber:1;
        var params = {}
        params.CardCode = this.$route.query.CardCode //'4e23629964da467195c0a13b4a0dc76c';
        params.MemberCode = this.MemberCode //'1c5fd4ac47cc4c919cda20e8b55f0b27';
        params.TaskKey = this.$route.query.TaskKey //'41562106546851987468468';
        GetReceiveCard(params).then(res => {
            if (res.state == 200) {
                this.CardInfo = res.data
                if(res.MemberCardCode){
                    this.isDisable=true
                    this.BtnText='已领取'
                }
                else{
                    if(res.data){
                      if(res.data.IsActivate==0||res.data.IsEnable==0||res.data.Stock==0||moment(res.data.EndDate)<moment()){
                        this.isDisable=true
                        this.BtnText='活动已结束'
                      }else{
                        this.GetCardLimitState()
                      }
                    }else{
                        Toast({
                        message: '卡券不存在！',
                        position: 'middle',
                        duration: 2000
                        });
                    }
                }
            } 
            else {
                Toast({
                    message: res.msg,
                    position: 'middle',
                    duration: 2000
                });
                this.isDisable=true

            }
        }).catch(err=>{
            Toast({
                    message: err.Message,
                    position: 'middle',
                    duration: 2000
                });
            })
    },
    methods: {
        GetCardLimitState(){
          var params = {}
          params.CardCode = this.$route.query.CardCode //'4e23629964da467195c0a13b4a0dc76c';
          params.MemberCode = this.MemberCode //'1c5fd4ac47cc4c919cda20e8b55f0b27';
          params.TaskKey = this.$route.query.TaskKey //'41562106546851987468468';
          GetLimitState(params).then(Limit=>{
            if(Limit.state==200){
                this.LimitRule=Limit.data;
                console.log('Limit',Limit)
                var HopeSendNumber=JSON.parse(JSON.stringify(this.SendNumber));//卡券初始发放数量
                if(parseInt(Limit.data.LimitTotleNumber) > parseInt(Limit.data.HoldNumber)){
                    if(Limit.data.LimitCycle=='None'){
                        var canSendNumberTotle=Limit.data.LimitTotleNumber-Limit.data.HoldNumber;
                        var msg="";
                         if(canSendNumberTotle>=this.SendNumber){
                            this.isDisable=false
                        }else{
                            this.SendNumber=canSendNumberTotle;
                            this.isDisable=false;
                            Limit.data.HoldNumber>0?Toast({message: '您已领取'+Limit.data.HoldNumber+'张，'+(this.SendNumber>0?'本次可领取'+this.SendNumber+'张':'已达到领取上限'),position: 'middle',duration: 2000}):''
                        }
                    }else{
                        var canSendNumberOnCycle=Limit.data.LimitNumberCycle-Limit.data.HoldNumberOnCycle;
                        var canSendNumberTotle=Limit.data.LimitTotleNumber-Limit.data.HoldNumber;
                        console.log('canSendNumberOnCycle',canSendNumberOnCycle)
                        console.log('canSendNumberTotle',canSendNumberTotle)
                        if(canSendNumberTotle>=HopeSendNumber&&canSendNumberOnCycle>=HopeSendNumber){
                                console.log('this.SendNumber1',this.SendNumber)
                        }else if(canSendNumberTotle<HopeSendNumber&&canSendNumberOnCycle<HopeSendNumber){
                                this.SendNumber=canSendNumberTotle-canSendNumberOnCycle>=0?canSendNumberOnCycle:canSendNumberTotle;
                                Toast({message: '您已领取'+(canSendNumberTotle-canSendNumberOnCycle>=0?Limit.data.HoldNumberOnCycle:Limit.data.HoldNumber)+'张，'+(this.SendNumber>0?'本次可领取'+this.SendNumber+'张':'已达到领取上限'),position: 'middle',duration: 2000})
                                console.log('this.SendNumber2',this.SendNumber)
                        }else{
                                this.SendNumber=(canSendNumberTotle<HopeSendNumber)?canSendNumberTotle:canSendNumberOnCycle;
                               Toast({message: '您已领取'+(canSendNumberTotle<HopeSendNumber?Limit.data.HoldNumber:Limit.data.HoldNumberOnCycle)+'张，'+(this.SendNumber>0?'本次可领取'+this.SendNumber+'张':'已达到领取上限'),position: 'middle',duration: 2000})
                                console.log('this.SendNumber3',this.SendNumber)
                        }
                        
                        this.isDisable=!this.SendNumber>0;
                        this.BtnText='立即领取'
                        // Limit.data.HoldNumberOnCycle>0?Toast({message: '您已领取'+Limit.data.HoldNumberOnCycle+'张，'+(this.SendNumber>0?'本次可领取'+this.SendNumber+'张':'已达到领取上限'),position: 'middle',duration: 2000}):''
                    }
                }else{
                    this.isDisable=true;
                    this.BtnText='立即领取'
                    Toast({message: '卡券已达到领取上限',position: 'middle',duration: 2000})
                }
            }else{
                Toast({
                message: '服务器连接异常，请稍后再试',
                position: 'middle',
                duration: 2000
                });
                this.BtnText='立即领取';
                this.isDisable=true;
            }
        })
        },
        dateFormart(time,formart){
          return moment(time).format(formart);
        },
        cardRuleMatch(){
            if(this.LimitRule.HoldNumber<this.LimitRule.LimitTotleNumber){
                    if(this.LimitRule.LimitCycle=='None'){
                         if(this.LimitRule.LimitTotleNumber-this.LimitRule.HoldNumber>=this.SendNumber){
                            this.isDisable=false
                        }else{
                            this.SendNumber=this.LimitRule.LimitTotleNumber-this.LimitRule.HoldNumber
                            this.isDisable=false;
                            Toast({message: '您已领取'+this.LimitRule.HoldNumber+'张'+'，本次可领取'+this.SendNumber+'张',position: 'middle',duration: 2000})
                        }
                    }else{
                        if(this.LimitRule.LimitTotleNumber-this.LimitRule.HoldNumber>=this.SendNumber&&this.LimitRule.LimitNumberCycle-this.LimitRule.HoldNumberOnCycle>=this.SendNumber){
                            var canSendNumberOnCycle=this.LimitRule.LimitNumberCycle-this.LimitRule.HoldNumberOnCycle;
                            var canSendNumberTotle=this.LimitRule.LimitTotleNumber-this.LimitRule.HoldNumber;
                            this.isDisable=false;
                            this.BtnText='立即领取'
                            this.SendNumber=canSendNumberOnCycle>canSendNumberTotle?canSendNumberTotle:canSendNumberOnCycle
                            Toast({message: '您已领取'+this.LimitRule.HoldNumber+'张'+'，本次可领取'+this.SendNumber+'张',position: 'middle',duration: 2000})
                        }
                    }
                   
                }
        },
        GetCard(){
            var params={};
            var members=[];
            var cards=[];
            this.BtnText='领取中'
            this.isDisable=true;
            members.push(this.Member.MemberCode);
            cards.push({CardCode:this.CardInfo.CardCode,SendNumber:this.SendNumber});
            params.BusinessCode=this.Member.BusinessCode;
            params.TaskKey=this.$route.query.TaskKey;
            params.SceneID=this.$route.query.SceneID;
            params.SceneContent='';
            params.Mode='放入';
            params.GrantTime=moment().format('YYYY-MM-DD HH:mm:ss');
            params.SendMembers=members;
            params.SendCards=cards;
            SendCard(params).then(res=>{
                if(res.state==200){
                    if(res.SendErrorMembers&&res.SendErrorMembers.length>0){
                        Toast({
                            message: res.SendErrorMembers[0].ErrorMsg,
                            position: 'middle',
                            duration: 2000
                        });
                        this.isDisable=false;
                    }else{
                    this.BtnText='已领取'
                    Toast({
                            message: '卡券领取成功！',
                            position: 'middle',
                            duration: 2000
                        });
                    setTimeout(() => {
                        this.$router.push({
                            path: '/member/card-list',
                            query:{ MemberCode:this.$route.query.MemberCode}
                            })}, 1500)

                    }
                }else{
                    this.isDisable=false;
                    Toast({
                            message: '卡券领取失败，请稍后重试！',
                            position: 'middle',
                            duration: 2000
                        });
                }
            }).catch(err=>{
                console.log('err',err)
                Toast({
                        message: err,
                        position: 'middle',
                        duration: 2000
                    });
            })

        }
    }
}
</script>

<style lang="scss" scoped>
    .card{background-color: #2d9e66;position: fixed;top: 0;bottom: 0;left: 0;right:0;padding: 0 6px;}
    .card .bg{background: #fff;border-radius: 3px;margin-top:50px;padding:0 10px 10px; width: 100%;position: relative;}
    .card .bg .picture{width: 100%;text-align: center;position: relative;height: 30px;}
    .card .bg .picture .icon{width:60px;height: 60px;border-radius: 50%;margin-top: -30px}
    .card .bg .cardtype{font-size: 12px;color: #666;text-align: center; margin-top: 10px;}
    .card .bg .cardname{font-size: 24px;color: #000;text-align: center; line-height: 70px;font-weight: bold;}
    .card .bg .btn{ width: 120px;line-height: 34px;;margin: 0 auto;background-color: #2d9e66;border-radius: 3px;color: #fff;font-size: 16px;text-align: center;}
    .card .bg .btn_disable{ width: 120px;line-height: 34px;;margin: 0 auto;background-color: rgb(172, 170, 170);border-radius: 3px;color: #fff;font-size: 16px;text-align: center;}
    .card .bg .content{font-size: 12px;color: #666; line-height: 24px;margin: 20px 0 10px;}
    .card .bg .spline{position: relative;height: 8px;width: 100%;margin: 10px 0;}
    .card .bg .spline .left,.card .bg .spline .right{position: absolute;top:0px; width: 8px;height: 8px;display: block;border-radius: 50px;background-color:#2d9e66 ;}
    .card .bg .spline .left{left:0px;margin-left: -14px;}
    .card .bg .spline .right{right:0px;margin-right: -14px;}
    .card .bg .spline .line{height: 4px;border-bottom: 1px dashed #ccc;}
    .content .Storesbox{max-height: 120px;overflow: hidden;}
    .content .showmore.Storesbox{max-height: initial;}
    .content .iconmore{height: 30px;line-height: 30px;text-align: center;}
</style>
