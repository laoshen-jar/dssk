<template>
<div class="container">
    <!-- excharge -->
    <div class="excharge">
        <div class="excharge-cot">
            <p class="num">￥{{Member.StoredBalance}}</p>
            <p class="text">可用余额(元)</p>
        </div>
        <div class="excharge-record">
            <router-link to="/member/stored-detail">
                <p class="text">储值记录</p>
                <i class="iconfont iconjiantou-b-copy-l"></i>
            </router-link>
        </div>
    </div>
    <!-- excharge end -->
    <!-- save -->
    <div class="save-box">
        <ul class="save-list clearfix">
            <li v-for="(item,index) in StoredRules" :key="index" :class="{'active':UsedRecord!=null&&UsedRecord.RowNumber == item.RowNumber}">
                <div class="item" @click="selectStoredRecord(item)">
                    <h6 class="title">{{item.Amount}}</h6>
                    <p class="text">送<span class="num">{{item.GiveAmount}}</span>元</p>
                    <div class="select">
                        <img src="../../../../../static/images/selected.png" alt="选中" />
                    </div>
                </div>
            </li>
        </ul>
        <!-- <p class="score" v-if="UsedRecord!=null">充值 {{UsedRecord.Amount}} 元 , 送 {{UsedRecord.GiveAmount}} 元，充值后储值结余 {{parseFloat(Member.StoredBalance+UsedRecord.Amount+UsedRecord.GiveAmount).toFixed(2)}} 元</p> -->
        <p class="score" v-if="UsedRecord!=null">充值 {{UsedRecord.Amount}} 元 , 送 {{UsedRecord.GiveAmount}} 元，充值后储值结余 {{((Member.StoredBalance*100+UsedRecord.Amount*100+UsedRecord.GiveAmount*100)/100).toFixed(2)}} 元</p>
        <!-- <p class="score">赠送积分：100</p> -->
        <!-- <div class="line"></div> -->
        <div class="line"></div>
        <div v-if="OnActivity && Branch=='DSSK' && Member.BusinessCode=='c5e6baa9861e452dbd420bc16721e474'">
          <div class="line" style="text-align:center;font-size: 14px;">-- 咨询电话 --</div>
          <a class="line" href="tel:17671630898" style="text-align:center;font-size: 14px;">客服1：17671630898</a>
          <a class="line" href="tel:15671043558" style="text-align:center;font-size: 14px;">客服2：15671043558</a>
          <a class="line" href="tel:15522942677" style="text-align:center;font-size: 14px;">客服3：15522942677</a>
          <div class="line" style="text-align:center;font-size: 14px;">也可以通过公众号发送文字与我们联系哦！</div>
        </div>
        <div v-if="OnActivity && Branch=='DSSK' && Member.BusinessCode=='6e7be0825baa48609588ec6445356481'">
          <div class="line" style="text-align:center;font-size: 14px;">-- 咨询电话 --</div>
          <a class="line" href="tel:18062621288" style="text-align:center;font-size: 14px;">客服：18062621288</a>
          <div class="line" style="text-align:center;font-size: 14px;">也可以通过公众号发送文字与我们联系哦！</div>
        </div>
        <a class="line" href="tel:13317186492" style="text-align:center;font-size: 14px;" v-else>技术支持：13317186492</a>
        
        <div class="line"></div>
        <div class="line"></div>
        <div class="btn-box">
            <div class="btn" :class="{acitve:UsedRecord!=null}" @click="StartRecharge">确认充值</div>
        </div>
    </div>
    <GetPhone :ShowGetPhone="ShowGetPhone" @CallBack="GetPhoneCallBack"></GetPhone>
</div>
</template>

<script>
  import GetPhone from '@/components/views/member/modules/GetPhone';
    import { mapActions, mapGetters } from 'vuex'
    import { CreatePayOrder } from '@/api/pay'
    import { GetStoredRuleActive,CreateRecharge } from '@/api/stored'
    import { Toast, Indicator } from "mint-ui";
    import DSSKData from '@/store/modules/DSSKData.json'
    import moment from 'moment'
    export default {
        name: 'Recharge',
        components: {
          GetPhone,
        },
        data() {
            return {
                StoredRules: [], // 储值规则列表
                UsedRecord: null, // 使用的储值规则 
                save: {},
                DSSKData,
                ShowGetPhone:false,
            }
        },
        computed: {
            ...mapGetters(['MemberCode', 'StoreCode', 'DeskID', 'Member','BusinessConfig','Branch','OnActivity']),
        },
        created() {
            Indicator.open("加载中...");
            this.NeedMember().then(res => { // 重新加载会员，更新储值余额及积分信息
                if(this.OnActivity && this.Branch=='DSSK' && this.Member.BusinessCode=='c5e6baa9861e452dbd420bc16721e474'){
                  this.StoredRules = this.DSSKData.ActiveStoredRules;
                  if(!this.StoredRules){
                    this.StoredRules=[];
                  }
                  if(this.Member.MemberCode=='o0Hzev32lXbvX3womtVQOFH6t1A8'){
                    this.StoredRules.push({
                      "RowNumber": "0",
                      "GiveIntegral": 0.0,
                      "GiveCards": [],
                      "StoredGradientCode": "13d2e3abb5f2450fac1be20f242e67aa",
                      "BusinessCode": "c5e6baa9861e452dbd420bc16721e474",
                      "StoreCode": null,
                      "Amount": 1.00,
                      "GiveAmount": 0.50
                    });;
                  }
                  if(this.StoredRules.length>0){
                    // 大圣烧烤默认选择400
                    var R=this.StoredRules.find(a=>a.Amount==400);
                    if(R){
                      this.UsedRecord=R;
                    }
                    if(!this.UsedRecord && this.StoredRules.length>0){
                      this.UsedRecord=this.StoredRules[0];
                    }
                  }
                  Indicator.close();
                }
                else{
                  this.loadStoredRule().then(res => { // 重新加载会员，更新储值余额及积分信息
                    Indicator.close();
                  });
                }
            });
        },
        methods: {
            ...mapActions(['NeedMember','PushErrorPage']),
            loadStoredRule() {
                return new Promise((resolve, reject) => { 
                    var paramer = {};
                    paramer.BusinessCode = this.Member.BusinessCode;
                    // paramer.StoreCode = this.StoreCode; 
                    GetStoredRuleActive(paramer).then(res => {
                        if (res.state == 200) {
                            if (res.StoredSwitch == 1) {
                                // console.log('GetStoredRuleActive.res', JSON.stringify(res.data));
                                this.StoredRules = res.data;
                            } else {
                                //储值未开启，现有储值余额可用
                            }
                            resolve(res);
                        } else {
                            console.log('GetStoredRuleActive.error', res);
                            this.PushErrorPage(this,res);
                            reject(res);
                        }
                    }).catch(res => {
                        console.log('GetStoredRuleActive.catch', res);
                        reject(res);
                    }).finally(res => {});
                });
            },
            selectStoredRecord(record) {
                this.UsedRecord = record;
            },
            // 开始执行充值
            StartRecharge(){
              if(this.BusinessConfig.StoredMustPhoneSwitch&&!this.Member.Phone){
                this.ShowGetPhone=true;
                return;
              }
                Indicator.open("加载中...");
                var paramer={};
                paramer.MemberCodeOrStoredCode=this.MemberCode; 
                paramer.TaskKey='提前充值：'+this.Member.StoredBalance+'+'+parseInt(this.UsedRecord.Amount*100+this.UsedRecord.GiveAmount*100)/100+'='+parseInt(this.Member.StoredBalance*100+this.UsedRecord.Amount*100+this.UsedRecord.GiveAmount*100)/100;
                paramer.TradePrincipal=this.UsedRecord.Amount; 
                paramer.TradeGift=this.UsedRecord.GiveAmount 
                paramer.OperName='自主充值'; 
                // paramer.StoreCode=this.StoreCode; 
                paramer.BillCode=''; 
                paramer.RecordType='充值'; 
                paramer.SceneID='微信储值'; 
                paramer.SceneContent='';
                paramer.PayList=[{PayMethod:'微信',Amount:this.UsedRecord.Amount,DataCode:"",Remark:'提前充值'}];
                CreateRecharge(paramer).then(res=>{
                    if(res.state==200){
                        let StoredRecordCode=res.data;
                        console.log('GoPay', '储值充值',StoredRecordCode);
                        this.GoPay('储值充值',null,StoredRecordCode);
                        // this.$router.push({ name: 'PayT', query: { StoredRecordCode: StoredRecordCode,TradePrincipal:this.UsedRecord.Amount,TradeGift:this.UsedRecord.GiveAmount } });
                    }
                    else{
                      Indicator.close();
                    }
                }).catch(res=>{});
            },


            GoPay(SceneType,CheckOrderCode,StoredRecordCode){
                var PayOrder={
                    BusinessCode:this.Member.BusinessCode,
                    // StoreCode:this.StoreCode,
                    MemberCode:this.MemberCode,
                    SceneType:SceneType,
                    Amount:this.UsedRecord.Amount,
                    BillID:'',
                    CheckOrderCode:CheckOrderCode,
                    StoredRecordCode:StoredRecordCode,
                    PayCallBackOpenIDUrl:window.location.origin+'/pay/main'
                }
                CreatePayOrder(PayOrder).then(res=>{
                    if(res.state!=200){console.warn('CreatePayOrder.error', res);}
                    else{
                        PayOrder.PayOrderCode=res.data.PayOrderCode;// 结帐单号
                        PayOrder.PayState=0;
                        var GetOpenIDUrl=res.data.GetOpenIDUrl;


                        
                        // this.$router.push({name:'CheckPay',query:{Code:this.editingBill.BillID+"_"+PayOrder.PayOrderCode,openid:"123"}});//跳过支付
                        Indicator.close();
                        window.location.href=GetOpenIDUrl;
                        // console.log(GetOpenIDUrl);

                        // https://open.51shoubei.com/openpay/jsapi/getauth2?redirect_uri=https%3A%2F%2Fwww.baidu.com%3Faa%3D123&inst_no=900001&mch_no=851902270018&sign=b4e64d988059c1cf6b824a03b4a18b80
                        // https://open.51shoubei.com/openpay/jsapi/getauth2?inst_no=900120&mch_no=852002260003&redirect_uri=192.168.124.6:8080/check-pay?PayOrderCode=a4501e59e3804a23b57a3fe6f8ba5368&sign=93b9a3a09ea000771deffe8a44d42069
                        // https://open.51shoubei.com/openpay/jsapi/getauth2?inst_no=900120&mch_no=852002260003&redirect_uri=192.168.124.6:8080/check-pay?PayOrderCode=a4501e59e3804a23b57a3fe6f8ba5368&sign=93b9a3a09ea000771deffe8a44d42069
                        // this.$router.push({ name: 'CheckPay', query: { PayOrderCode:PayOrder.PayOrderCode },params:{PayOrder:PayOrder} });
                    }
                }).catch(res=>{console.warn('CreatePayOrder.catch', res);})
            },

            GetPhoneCallBack(res){
              this.ShowGetPhone=false;
              console.log('GetPhoneCallBack',res);
              if(res.state){
                // 继续执行充值
                this.StartRecharge();
              }
            },

        }
    }
</script>

<style lang="scss" scoped>
$main: #ffbb05;
$red: #ff423e;
$border: #e6e6ea;
$grey: #777;
$glod:#b6986a;
$green: #09bb07;

@mixin border-radius($size) {
    -webkit-border-radius: $size;
    -moz-border-radius: $size;
    border-radius: $size;
}

@mixin transition {
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
}

.container {
    min-height: 100vh;
}

/* excharge */
.excharge {
    width: 100%;
    height: 85px;
    background: -webkit-linear-gradient(#f2980b, #ffbb05);
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#f2980b, #ffbb05);
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#f2980b, #ffbb05);
    /* Firefox 3.6 - 15 */
    background: linear-gradient(#f2980b, #ffbb05);
    /* 标准的语法 */
    position: relative;

    .excharge-cot {
        padding-top: 20px;
        text-align: center;

        .num {
            color: #fff;
            line-height: 1;
            font-size: 20px;
            text-indent: -10px;
        }

        .text {
            font-size: 12px;
            line-height: 1;
            margin-top: 10px;
            color: #fff;
        }
    }

    .excharge-record {
        position: absolute;
        right: 10px;
        top: 15px;
        color: #fff;
        font-size: 12px;

        .text {
            display: inline-block;
        }

        i {
            font-size: 10px;
        }
    }
}

/* excharge end */
/* save-box */
.save-box {
    padding: 10px;

    .save-list {
        margin: -5px;

        li {
            width: 33.33%;
            float: left;
            padding: 5px;
        }

        .item {
            width: 100%;
            height: 65px;
            border: 1px solid #dadada;
            position: relative;
            padding-top: 15px;
            background: #fff;
            @include border-radius(5px);

            .title {
                font-size: 16px;
                line-height: 1;
                text-align: center;
            }

            .text {
                font-size: 12px;
                line-height: 1;
                text-align: center;
                margin-top: 5px;
                color: $grey;

                .num {
                    color: $red;
                }
            }

            .select {
                width: 27px;
                position: absolute;
                right: -1px;
                top: -1px;
                opacity: 0;
                @include transition;

                img {
                    width: 100%;
                    display: block;
                }
            }
        }

        .active {
            .item {
                border-color: $main;

                .select {
                    opacity: 1;
                }
            }
        }
    }

    .data {
        margin-top: 25px;
        font-size: 14px;
        line-height: 1;
    }

    .score {
        font-size: 14px;
        line-height: 1;
        margin-top: 15px;
    }

    .give-coupon {
        margin-top: 15px;

        >.title {
            font-size: 14px;
            line-height: 1;
            margin-top: 15px;
        }

        .coupon-list {
            margin-top: 15px;

            li {
                margin-top: 10px;
            }

            .item {
                height: 110px;
                padding-right: 60px;
                position: relative;

                .msg {
                    width: 100%;
                    height: 110px;
                    background: #fff;
                    padding: 10px;
                    @include border-radius(10px);
                    -webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
                    -moz-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
                    box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);

                    .img {
                        width: 90px;
                        height: 90px;
                        float: left;
                        overflow: hidden;
                        @include border-radius(5px);

                        img {
                            width: 100%;
                            display: block;
                        }
                    }

                    .text-box {
                        margin-left: 100px;
                        padding-top: 10px;

                        .title {
                            font-size: 14px;
                            line-height: 1;
                            margin-bottom: 20px;
                        }

                        .condition {
                            font-size: 12px;
                            color: $grey;
                            line-height: 1;
                        }

                        .date {
                            font-size: 12px;
                            color: $grey;
                            margin-top: 10px;
                            line-height: 1;
                        }
                    }
                }

                .int {
                    width: 60px;
                    height: 100%;
                    text-align: center;
                    background: #fff;
                    @include border-radius(10px);
                    position: absolute;
                    right: 0;
                    top: 0;
                    -webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
                    -moz-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
                    box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);

                    &:before {
                        content: '';
                        height: 90px;
                        border-left: 1px dashed #e6e6ea;
                        position: absolute;
                        left: 0;
                        top: 10px;
                    }

                    p {
                        width: 60px;
                        height: 110px;
                        text-align: center;
                        line-height: 60px;
                        -webkit-writing-mode: vertical-rl;
                        -ms-writing-mode: bt-rl;
                        writing-mode: vertical-rl;
                        font-size: 12px;
                        color: $grey;
                    }
                }
            }
        }
    }

    .btn-box {
        padding: 10px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #f2f2f6;

        .btn {
            width: 100%;
            height: 50px;
            background: $grey;
            @include border-radius(25px);
            line-height: 50px;
            text-align: center;
            font-size: 14px;
        }
        .btn.acitve{
            background: $main;
        }
    }
}

/* save-box end */
/* activicity */

.activicity {
    height: 165px;
    padding: 15px 10px 0 15px;
    background: #f2f2f6;

    .title-box {
        text-align: center;

        .title-cot {
            line-height: 1;
            display: inline-block;
            position: relative;
            padding: 0 40px;
            z-index: 2;

            &:after {
                content: '';
                width: 100%;
                height: 1px;
                background: #d0d0d0;
                position: absolute;
                top: 6px;
                left: 0;
                z-index: -1;
            }
        }

        .title {
            font-size: 14px;
            padding: 0 15px;
            line-height: 1;
            background: #f2f2f6;
        }
    }

    .img {
        overflow: hidden;
        margin-top: 15px;
        @include border-radius(5px);

        img {
            width: 100%;
            display: block;
        }
    }

    .support {
        height: 25px;
        line-height: 25px;
        text-align: center;
        font-size: 10px;
        text-align: center;
        color: $grey;
    }
}

/* activicity end */
/*fade*/

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
.line{width: 100%;min-height: 30px;line-height: 30px;display: block;}
/*fade*/
</style>
