<template>
<div class="container">
    <!-- can-use -->
    <div class="can-use">
        <p class="text">可用积分：{{MemberInfo.IntegralBalance}}</p>
        <router-link to="/score" class="link">
            <p class="text">积分记录</p>
            <i class="iconfont iconjiantou-b-copy-l"></i>
        </router-link>
    </div>
    <!-- can-use end -->
    <div class="division"></div>
    <!-- shop-list -->
    <div class="shop-list-box" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="isAutoFill">
            <div class="shop-list">
                <ul class="list clearfix">
                    <li v-for="(item,index) in GoodsList" :key="index">
                        <router-link class="item" :to="{name:'GoodsInfo',query:{GoodsCode:item.GoodsCode}}">
                            <div class="img">
                                <img :src="item.Picture" :alt="item.GoodsName" />
                            </div>
                            <div class="text-box">
                                <h6 class="title">{{item.GoodsName}}</h6>
                                <p style="text-align: -webkit-center"><span class="Price">￥{{item.Price}}</span> <span class="Amount" v-if="item.Amount!=item.Price">￥{{item.Amount}}</span></p>
                            </div>
                        </router-link>
                    </li>
                </ul>
                <p v-if="allLoaded==false" style="font-size:12px;color:#777777;text-align:center" @click="loadBottom">点击加载更多</p>
                <p v-else style="font-size:12px;color:#777777;text-align:center" @click="loadBottom">暂无商品信息</p>
            </div>
        </mt-loadmore>
        <transition name="fade">
            <!-- activicity -->
            <div class="activicity">
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
            <!-- activicity end -->
        </transition>
    </div>
    <!-- shop-list end -->
    <!-- excharge-racord -->
    <div class="excharge-racord">
        <router-link to="/exchargerecord">
            <p class="text">兑换</br>记录</p>
        </router-link>
    </div>
    <!-- excharge-racord end -->
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { GetGoodsList } from '@/api/integralShop'
import { GetMember } from '@/api/member'
import { Toast } from 'mint-ui'

export default {
    name: 'shop',
    computed: {
        ...mapGetters(['MemberCode', 'StoreCode', 'DeskID']),
    },
    data() {
        return {
            allLoaded: false, // 是否全部加载
            isAutoFill: false, // 自动上拉加载一次
            wrapperHeight: 0, // 滚动区域高度
            count: null,
            pageNo: 1,
            GoodsList: [], //加载商品列表
            MemberInfo: {}, //会员信息
        }
    },
    mounted() {
        // 父控件要加上高度，否则会出现上拉不动的情况
        this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    },
    created() {
        // 请求数据
        var parmas = {};
        parmas.MemberCodeOrOpenID = this.MemberCode;
        parmas.searchKey = this.searchKey;
        parmas.pageIndex = this.pageNo;
        parmas.PageSize = 6;
        GetGoodsList(parmas).then(res => {
            console.log('商品列表',res)
            if (res.state == 200) {
                this.GoodsList = res.data
                if(res.data.length>6){
                    this.allLoaded=false
                }else{
                    this.allLoaded=true
                }
                this.count = res.count
            } else {
                Toast({
                    message: res.state + '-' + res.msg,
                    position: 'top',
                    duration: 2000
                });
            }
        });
        parmas = {};
        parmas.MemberCodeOrOpenID = this.MemberCode;
        GetMember(parmas).then(res => {
            console.log('会员信息',res)
            if (res.state == 200) {
                this.MemberInfo = res.data
            } else {
                Toast({
                    message: res.state + '-' + res.msg,
                    position: 'top',
                    duration: 2000
                });
            }
        })
    },
    methods: {
        // 触底加载
        loadBottom() {
            if (this.GoodsList.length < this.count) {
                var parameter = {};
				parameter.MemberCodeOrOpenID = this.MemberCode;
				this.pageNo=this.pageNo+1;
                parameter.pageNo = this.pageNo;
                parameter.pageSize = 6;
                GetGoodsList(parameter).then((res) => {
                        console.log("加载更多", res.data)
                        res.data.forEach(item => {
                            this.GoodsList.push(item);
                        });
                        if (this.GoodsList.length == this.count) {
                            this.allLoaded = true; // 数据已全部获取完毕
                        }
                        console.log("res", res)
                        console.log("parameter", parameter)
                        console.log("GoodsList", this.GoodsList)
                        this.$refs.loadmore.onBottomLoaded(); // 重置下拉加载
                    })
                    .catch(err => console.log(err));
            }
        }
    }
}
</script>

<style lang="scss" scoped>
$main: #ffbb05;
$red: #ff423e;
$border: #e6e6ea;
$grey: #777;
$glod:#b6986a;

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
    height: 100vh;
    padding-bottom: 165px;
    background: #F2F2F6;
    overflow: hidden;
}

/* can-use */
.can-use {
    height: 45px;
    padding: 0 10px;
    background: #fff;

    >.text {
        float: left;
        line-height: 45px;
        font-size: 14px;
    }

    .link {
        float: right;
        font-size: 14px;
        line-height: 45px;

        .text {
            float: left;
            margin-right: 2px;
            color: $grey;
        }

        i {
            font-size: 12px;
            color: $grey;
        }
    }
}

/* can-use end */
/* shop-list */
.shop-list-box {
    overflow: scroll;
    background: #fff;

    .shop-list {
        padding: 15px;
        padding-bottom: 10px;
    }

    ul {
        margin: -5px -7px;
    }

    li {
        width: 50%;
        padding: 5px 7px;
        float: left;

        .item {
            width: 100%;

            .img {
                height: 44vw;
                @include border-radius(5px);
                overflow: hidden;

                img {
                    width: 100%;
                    display: block;
                }
            }

            .title {
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-top: 10px;
                text-align: center;
            }

            .Amount {
                color: $grey;
                font-size: 12px;
                margin-top: 5px;
                text-decoration: line-through;
                text-align: -webkit-center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .Price {
                color: $red;
                font-size: 12px;
                margin-top: 5px;
                text-align: -webkit-center;
                white-space: nowrap;
                font-weight: 900;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
}

/* shop-list end */
/* excharge-racord */
.excharge-racord {
    position: fixed;
    bottom: 200px;
    right: 10px;
    z-index: 99;

    a {
        width: 45px;
        height: 45px;
        border: 2px solid #888;
        display: block;
        background: #fff;
        padding-top: 5px;
        text-align: center;
        @include border-radius(50%);

        .text {
            font-size: 10px;
            color: $main;
        }
    }
}

/* excharge-racord end */
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
