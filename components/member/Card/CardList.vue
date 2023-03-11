<template>
<div class="container">
    <!-- tab-list -->
    <div class="tab-list">
        <ul class="list">
            <li :class="{active:usableCards.active}" @click="changTab(usableCards)">
                <p class="text">未使用（{{usableCards.Cards.length}}）</p>
            </li>
            <li :class="{active:usedCards.active}" @click="changTab(usedCards)">
                <p class="text">已使用（{{usedCards.Cards.length}}）</p>
            </li>
            <li :class="{active:expiredCards.active}" @click="changTab(expiredCards)">
                <p class="text">已过期（{{expiredCards.Cards.length}}）</p>
            </li>
        </ul>
    </div>
    <!-- tab-list end -->
    <div class="division"></div>
    <div class="division"></div>
    <!-- coupon-list -->
    <div class="conpon-list-box" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="isAutoFill">

            <div class="notuse" v-if="usableCards.active">
                <ul class="list">
                    <li v-for="(card,index) in usableCards.Cards" :key="'usableCards'+index">
                        <router-link :to="{name:'CardDetail',query:{MemberCardCode:card.MemberCardCode,CardCode:card.CardCode}}" class="item">
                            <div class="msg">
                                <div class="img">
                                    <img :src="card.Picture" :alt="card.CardName" />
                                </div>
                                <div class="text-box">
                                    <h6 class="title">{{card.CardName}}（{{card.CardType}}）</h6>
                                    <p class="condition">使用条件：<span v-if="card.CardType!='礼品券'">消费满{{card.SatisfyAmount}}元可用</span><span v-else>消费满{{card.SatisfyAmount}}元可用,门店核销线下核销</span></p>
                                    <p class="date">有效期：{{card.EndDate|DateFilter}}</p>
                                    <!-- <p class="tip">{{card.expire}}天到期</p> -->
                                </div>
                            </div>
                            <div class="select-box">
                                <p :class="moment(card.StartDate)>moment()?'red':'text'">{{moment(card.StartDate)>moment()?'未开始':'使 用'}}</p>
                            </div>
                        </router-link>
                    </li>
                </ul>

                <!-- coupon-list end -->
                <transition name="fade">
                    <div class="noresult" v-if="usableCards.noresult">
                        <div class="noresult-cot">
                            <div class="img">
                                <img src="../../../../../static/images/noresult.png" alt="无结果" />
                            </div>
                            <p class="text">暂无优惠券</p>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="used" v-if="usedCards.active">
                <ul class="list">
                    <li v-for="(card,index) in usedCards.Cards" :key="'usableCards'+index">
                        <router-link :to="{name:'CardDetail',query:{MemberCardCode:card.MemberCardCode,CardCode:card.CardCode}}" class="item">
                            <div class="msg">
                                <div class="text-box">
                                    <h6 class="title">{{card.CardName}}（{{card.CardType}}）</h6>
                                    <p class="condition">使用时间：{{card.WriteOffTime|DateFilter}}</p>
                                </div>
                            </div>
                            <div class="select-box">
                                <p class="text">已使用</p>
                            </div>
                        </router-link>
                    </li>
                </ul>

                <!-- coupon-list end -->
                <transition name="fade">
                    <div class="noresult" v-if="usedCards.noresult">
                        <div class="noresult-cot">
                            <div class="img">
                                <img src="../../../../../static/images/noresult.png" alt="无结果" />
                            </div>
                            <p class="text">暂无优惠券</p>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="overtime" v-if="expiredCards.active">
                <ul class="list">
                    <li v-for="(card,index) in expiredCards.Cards" :key="'usableCards'+index">
                        <router-link :to="{name:'CardDetail',query:{MemberCardCode:card.MemberCardCode,CardCode:card.CardCode}}" class="item">
                            <div class="msg">
                                <div class="text-box">
                                    <h6 class="title">{{card.CardName}}（{{card.CardType}}）</h6>
                                    <p class="condition">有效期至：{{card.EndDate|DateFilter}}</p>
                                </div>
                            </div>
                            <div class="select-box">
                                <p class="text">已过期</p>
                            </div>
                        </router-link>
                    </li>
                </ul>
                
                <!-- coupon-list end -->
                <transition name="fade">
                    <div class="noresult" v-if="expiredCards.noresult">
                        <div class="noresult-cot">
                            <div class="img">
                                <img src="../../../../../static/images/noresult.png" alt="无结果" />
                            </div>
                            <p class="text">暂无优惠券</p>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- activicity -->
            <!-- <transition name="fade">
                <div class="activicity" v-if="allLoaded">
                    <div class="title-box">
                        <div class="title-cot">
                            <h5 class="title">活动</h5>
                        </div>
                    </div>
                    <div class="img">
                        <img src="../../../../../static/images/activicity.jpg" alt="" />
                    </div>
                    <div class="support">本服务由武汉邦越提供技术支持</div>
                </div>
            </transition> -->
            <!-- activicity end -->
        </mt-loadmore>
    </div>
    <!-- coupon-list end -->
    <transition name="fade">
        <div class="noresult" v-show="noresult">
            <div class="noresult-cot">
                <div class="img">
                    <img src="../../../../../static/images/noresult.png" alt="无结果" />
                </div>
                <p class="text">暂无优惠券</p>
            </div>
        </div>
    </transition>
</div>
</template>

<script>
import {GetCardList} from "@/api/card"
import { mapActions, mapGetters} from 'vuex'
import { Toast,Indicator} from 'mint-ui'
import moment from 'moment'
export default {
    name: 'CardList',
    computed: {
        ...mapGetters(['MemberCode', 'BusinessCode', 'DeskID', 'Member']),
    },
    beforeRouteEnter(to,from,next){
      if(from.name=='ReceiveCard'){
        next(()=>{
          history.pushState(null, null, document.URL);
          window.addEventListener('popstate', function() {
          history.pushState(null, null, document.URL);
          });
        })
      }else{ 
        next()
      }
        
    },
    filters: {
      DateFilter: function(value) {
          return moment(value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    data() {
        return {
            moment,
            CanotBack:false,
            usableCards: {
                active: false,
                Cards: []
            },
            usedCards: {
                active: false,
                Cards: []
            },
            expiredCards: {
                active: false,
                Cards: []
            },
            coupon: [{
                    "text": "未使用",
                    "num": 3,
                    "active": true,
                    "couponlist": [{
                        "src": "../../../../../static/images/coupon.jpg",
                        "title": "商品券",
                        "condition": "满100元可用",
                        "time": "2019-01-01",
                        "expire": "3天后到期",
                        "use": ""
                    }]
                },
                {
                    "text": "已使用",
                    "num": 3,
                    "active": false,
                    "couponlist": [{
                        "src": "../../../../../static/images/coupon.jpg",
                        "title": "商品券",
                        "condition": "满100元可用",
                        "time": "2019-01-01",
                        "expire": "3天后到期",
                        "use": "2019-01-02",
                        "effective": ""
                    }]
                }, {
                    "text": "已过期",
                    "num": 3,
                    "active": false,
                    "couponlist": [{
                        "src": "../../../../../static/images/coupon.jpg",
                        "title": "商品券",
                        "condition": "满100元可用",
                        "time": "2019-01-01",
                        "expire": "3天后到期",
                        "use": "",
                        "effective": "2019-01-02"
                    }]
                }
            ], // 卡券列表
            cardList: [],
            allLoaded: false, // 是否全部加载
            isAutoFill: false, // 自动上拉加载一次
            wrapperHeight: 0, // 滚动区域高度
            noresult: false, // 无结果
        }
    },
    mounted() {
        // 父控件要加上高度，否则会出现上拉不动的情况
        this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top; 
        if (this.CanotBack&&window.history && window.history.pushState) {
          history.pushState(null, null, document.URL);
          window.addEventListener('popstate', this.goBack, false);
      }
    },
    created() {
        // 请求数据
        Indicator.open('加载中...')
        if(this.$route.query.CanotBack){
            this.CanotBack=true;
            }
        var parameter = {}
        parameter.MemberCode = this.MemberCode // '236c771bd1a9472ab9fa9d3cc39448e4'
        parameter.BusinessCode = this.BusinessCode
        parameter.StartTime = '2020-01-01 00:00:00'
        parameter.EndTime = '2050-07-01 00:00:00'
        parameter.pageIndex = 1,
        parameter.pageSize = 999
        console.log('parameter', parameter)
        console.log('Member', this.Member)
        GetCardList(parameter).then(res => {
            if (res.state == 200) {
                console.log('GetCardList.res', res)
                    this.usableCards.active = true
                    this.usableCards.Cards = res.data.filter(item => moment(moment(item.EndDate).format("YYYY-MM-DD 23:59:59"))>moment() && item.IsWriteOff == 0)

                    this.usedCards.Cards = res.data.filter(item =>  item.IsWriteOff == 1)

                    this.expiredCards.Cards = res.data.filter(item => item.IsWriteOff == 0 && moment(moment(item.EndDate).format("YYYY-MM-DD 23:59:59"))<moment())
                    if (this.usableCards.Cards.length == 0) {
                        this.usableCards.noresult = true
                    } else {
                        this.usableCards.noresult = false
                    }
                    if (this.usedCards.Cards.length == 0) {
                        this.usedCards.noresult = true
                    } else {
                        this.usedCards.noresult = false
                    }
                    if (this.expiredCards.Cards.length == 0) {
                        this.expiredCards.noresult = true
                    } else {
                        this.expiredCards.noresult = false
                    }
                    console.log('未使用', this.usableCards, this.usedCards, this.expiredCards)
            } else {
                Toast({
                    message: '卡券数据加载失败！',
                    position: 'mideel',
                    duration: 2000
                });
            }
        }).catch(err => console.log(err)).finally(()=>{Indicator.close()})
    },
    methods: {
        goBack(){
            console.log('goBack');
            this.$router.replace({name: 'MemberCenter',query: {MemberCenter: this.MemberCenter}});
            //replace替换原路由，作用是避免回退死循环
        },
        IsUsable(time){
            return moment(time)>moment()
        },
        changTab(data) {
            this.usableCards.active = false;
            this.usedCards.active = false;
            this.expiredCards.active = false;
            data.active = true;
        },
        loadBottom() {
            this.$axios.get('../../../../../static/js/data.json')
                .then((res) => {
                    //		if(res) {
                    //		this.$refs.loadmore.onBottomLoaded(); // 重置下拉加载
                    //		} else {
                    this.allLoaded = true; // 数据已全部获取完毕
                    //		}
                })
                .catch(err => console.log)
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

/* tab-list */

.tab-list {
    width: 100%;
    height: 50px;
    background: #fff;

    li {
        width: 33.33%;
        height: 50px;
        float: left;
        text-align: center;

        .text {
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 14px;
            display: inline-block;
        }
    }

    .active {
        .text {
            position: relative;
            color: $main;

            &:after {
                content: '';
                width: 100%;
                height: 3px;
                background: $main;
                position: absolute;
                left: 0;
                bottom: 0;
                @include border-radius(2px);
            }
        }
    }
}

/* tab-list end */
.conpon-list-box {
    overflow: scroll;
}

/* notuse */

.notuse {
    padding: 15px 10px;

    li {
        margin-top: 10px;

        &:first-child {
            margin-top: 0;
        }
    }

    .item {
        // height: 110px;
        padding-right: 60px;
        position: relative;
        display: block;

        .msg {
            width: 100%;
            // height: 110px;
            background: #fff;
            padding: 10px ;
            @include border-radius(10px);
            -webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
            -moz-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
            box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);

            .img {
                width: 80px;
                height: 80px;
                float: left;
                overflow: hidden;
                @include border-radius(5px);

                img {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            }

            .text-box {
                margin-left: 90px;
                // padding-top: 10px;

                .title {
                    font-size: 14px;
                    font-weight: bold;
                    line-height: 30px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }

                .condition {
                    font-size: 12px;
                    color: $grey;
                    line-height: 24px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }

                .date {
                    font-size: 12px;
                    color: $grey;
                    line-height: 24px;
                }

                .tip {
                    font-size: 14px;
                    color: $red;
                    line-height: 1;
                    margin-top: 10px;
                }
            }
        }

        .select-box {
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

            .text {
                width: 60px;
                height: 100%;
                line-height: 60px;
                text-align: center;
                -webkit-writing-mode: vertical-rl;
                -ms-writing-mode: bt-rl;
                writing-mode: vertical-rl;
                font-size: 14px;
                color: $main;
                letter-spacing: 1px;
            }
            .red {
                width: 60px;
                height: 100%;
                line-height: 60px;
                text-align: center;
                -webkit-writing-mode: vertical-rl;
                -ms-writing-mode: bt-rl;
                writing-mode: vertical-rl;
                font-size: 12px;
                color: $red;
                letter-spacing: 1px;
            }
        }
    }
}

/* notuse end */
/* used */
.used,
.overtime {
    padding: 15px 10px;

    li {
        margin-top: 10px;

        &:first-child {
            margin-top: 0;
        }
    }

    .item {
        height: 65px;
        padding-right: 60px;
        position: relative;
        display: block;

        .msg {
            width: 100%;
            height: 65px;
            background: #fff;
            padding: 10px;
            @include border-radius(10px);
            -webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
            -moz-box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);
            box-shadow: 0 0 3px 0 rgba(0, 0, 0, .1);

            .text-box {
                padding-top: 5px;

                .title {
                    font-size: 14px;
                    line-height: 1;
                    margin-bottom: 10px;
                }

                .condition {
                    font-size: 12px;
                    color: $grey;
                    line-height: 1;
                }
            }
        }

        .select-box {
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

            .text {
                width: 60px;
                height: 100%;
                line-height: 60px;
                text-align: center;
                -webkit-writing-mode: vertical-rl;
                -ms-writing-mode: bt-rl;
                writing-mode: vertical-rl;
                font-size: 12px;
                letter-spacing: 1px;
            }
        }
    }
}

/* used end */
/* noresult */
.noresult {
    position: fixed;
    top: 50px;
    bottom: 165px;
    left: 0;
    right: 0;
    z-index: 9;
    background: #fff;

    .noresult-cot {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -60px;

        .img {
            width: 70px;
            margin: 0 auto;

            img {
                width: 100%;
                display: block;
            }
        }

        .text {
            font-size: 14px;
            color: $grey;
            margin-top: 15px;
            line-height: 1;
            text-align: center;
        }
    }
}

/* noresult end */
/* activicity */

.activicity {
    height: 165px;
    padding: 15px 10px 0 15px;
    background: #f2f2f6;
    @include transition;

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

/*fade*/
</style>
