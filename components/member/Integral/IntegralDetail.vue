<template>
	<div class="container">
		<!-- score -->
		<div class="score-box">
			<div class="score">
				<div class="score-cot">
					<p class="num">{{Member.IntegralBalance}}</p>
					<p class="text">可用积分</p>
				</div>
			</div>
			<p class="newly">累计 {{Member.IntegralCumulativeBalance}} 积分</p>
			<div class="excharge"> 
                <router-link :to="{path:'/member/Integral/GoodsShop',query:{MemberCode:this.Member.MemberCode,BusinessCode:this.Member.BusinessCode}}">
                    <p class="text">积分商城</p>
                    <i class="iconfont iconjiantou-b-copy-l"></i>
                </router-link>
            </div>
		</div>
		<!-- score end -->
		<!-- score-record -->
		<div class="score-record" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
            <!-- 上拉加载事件:bottom-method="loadBottom" -->
			<mt-loadmore :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="isAutoFill" v-if="IntegralRecord.length>0">
				<ul class="record-list">
					<li v-for="(item,index) in IntegralRecord" :key="index">
						<div class="text-box">
							<h6 class="title">{{item.SceneID}}</h6>
							<p class="time">{{dateFormart(item.CreateTime,'YYYY-MM-DD HH:mm:ss')}}</p>
						</div>
						<div class="data-box">
							<p :class="item.AddIntegral>0?'change':'give'">{{item.AddIntegral>0?"+":""}}{{item.AddIntegral}}</p>
							<p class="state">{{item.state}}</p>
						</div>
					</li>
				</ul>
                <p v-if="allLoaded==false" style="font-size:12px;color:#777777;text-align:center;margin-top:12px;line-height:30px" @click="loadBottom">点击加载更多</p>
			</mt-loadmore>
        <NoDate  v-if="IntegralRecord.length==0" showtext="暂无积分记录"/>
		</div>
			<!-- activicity -->
			<!-- <transition name="fade">
				<div class="activicity" v-if="true">
					<div class="title-box">
						<div class="title-cot">
							<h5 class="title">活动</h5>
						</div>
					</div>
					<div class="img">
						<img src="../../../../../static/images/activicity.jpg" alt="" />
					</div>
					<div class="support">本服务由武汉越步提供技术支持</div>
				</div>
			</transition> -->
		    <!-- activicity end -->
		<!-- score-record end -->
	</div>
</template>

<script>
import {GetIntegralRecord} from "@/api/member"
import {Toast} from "mint-ui"
import NoDate from "../modules/NoDate"
import {mapActions,mapGetters} from "vuex"
import moment from "moment"
	export default {
        name: 'score',
        components:{NoDate},
		data() {
			return {
				score:{
					"currentscore": 10000,
					"newly": 125,
                } , // 积分对象
                IntegralRecord:[],//积分记录
				allLoaded: false, // 是否全部加载
				isAutoFill: false, // 自动上拉加载一次
				wrapperHeight: 0, // 滚动区域高度
                count: null,
                pageNo: 1,
			}
		},
        computed: {
            ...mapGetters(["MemberCode", "StoreCode", "DeskID", "Member"])
        },
		mounted() {
			// 父控件要加上高度，否则会出现上拉不动的情况
			this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top-0;
		},
		created() {
            // 请求数据
            var params={}
            params.MemberCode=this.Member.MemberCode
            params.pageNo = this.pageNo
            params.pageSize = 10
			GetIntegralRecord(params).then(res=>{
                console.log('res',res)
                if (res.state == 200) {
                    res.data.forEach(element => {
                        if(element.AddIntegral>=0){
                            element.state='新增'
                        }else{
                            element.state='抵扣'
                        }
                    });
                this.IntegralRecord=res.data
                this.count = res.count;
                if (this.IntegralRecord.length == this.count) {
                    this.allLoaded = true; // 数据已全部获取完毕
                }
            } else {
                Toast({
                    message: "会员积分记录加载失败！",
                    position: "middle",
                    duration: 2000
                });

            }  
			}).catch(err=>{
                console.log('err',err)
                Toast({
                    message: "会员积分记录加载失败！"+err,
                    position: "middle",
                    duration: 2000
                });
            })
		},
		methods: {
            
            //封装函数：
            dateFormart(time, formart) {
                return moment(time).format(formart);
            },
			// 触底加载
			loadBottom() {
				if (this.IntegralRecord.length < this.count) {
                var parameter = {};
                var pageCount = Math.ceil(this.count / 8);
                parameter.MemberCode = this.Member.MemberCode
                if (this.pageNo < pageCount) {
                    this.pageNo = this.pageNo + 1;
                }
                parameter.pageNo = this.pageNo;
                parameter.pageSize = 10;
                GetIntegralRecord(parameter)
                    .then(res => {
                        res.data.forEach(item => {
                            if(item.AddIntegral>=0){
                                item.state='新增'
                            }else{
                                item.state='抵扣'
                            }
                            this.IntegralRecord.push(item);
                        });
                        if (this.IntegralRecord.length == this.count) {
                            this.allLoaded = true; // 数据已全部获取完毕
                        }
                        console.log("res", res);
                        console.log("parameter", parameter);
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
		background: #f2f2f6;
		min-height: 100vh;
	}
	/* score-box */
	.score-box {
		height: 145px;
		padding-top: 15px;
		background: -webkit-linear-gradient(#f2980b, #ffbb05); /* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(#f2980b, #ffbb05); /* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(#f2980b, #ffbb05); /* Firefox 3.6 - 15 */
		background: linear-gradient(#f2980b, #ffbb05); /* 标准的语法 */
		position: relative;
		.score {
			width: 115px;
			height: 115px;
			line-height: 111px;
			text-align: center;
			border: 4px solid #f7c06a;
			@include border-radius(50%);
			margin: 0 auto;
			text-align: center;
			.score-cot {
				line-height: 1;
				display: inline-block;
				vertical-align: middle;
				.num {
					font-size: 18px;
					color: #fff;
				}
				.text {
					font-size: 14px;
					color: #fff;
					margin-top: 5px;
				}
			}
		}
		.newly {
			position: absolute;
			right: 10px;
			bottom: 10px;
			color: #fff;
			font-size: 14px;
		}
	}
	/* score-box end */
	/* score-record */
	.score-record {
		padding: 10px;
		overflow: scroll;
		li {
			background: #fff;
			@include border-radius(5px);
			height: 65px;
			padding: 15px 15px 0;
			margin-top: 10px;
			&:nth-child(1){
				margin-top: 0;
			}
			.text-box {
				float: left;
				.title {
					font-size: 14px;
					line-height: 1;
				}
				.time {
					font-size: 12px;
					line-height: 1;
					margin-top: 10px;
				}
			}
            .data-box {
            float: right;
            text-align: right;

                .change,
                .give {
                    font-size: 14px;
                    color: $red;
                    line-height: 1;
                    float: left;
                    color: $green;
                    margin-left: 5px;
                    margin-bottom: 5px;
                }

                .give {
                    color: $red;
                }

            .state {
                font-size: 12px;
                line-height: 1;
                margin-top: 10px;
            }
        }
			// .data-box {
			// 	float: right;
			// 	text-align: right;
			// 	.change {
			// 		font-size: 14px;
			// 		color: $red;
			// 		line-height: 1;
			// 	}
			// 	.state {
			// 		font-size: 12px;
			// 		line-height: 1;
			// 		margin-top: 10px;
			// 	}
			// }
		}
	}
	/* score-record end */
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
	.excharge {
            position: absolute;
            right: 10px;
            top: 15px;
            color: #fff;
            font-size: 14px;

            .text {
                display: inline-block;
            }

            i {
                font-size: 12px;
            }
        }
</style>