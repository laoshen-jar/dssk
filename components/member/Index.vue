<template>
	<div class="container">
		<!-- member-card -->
		<div class="member-card-box" v-if="Member">
			<div class="member-card" v-if="BusinessConfig.MemberConfig&&BusinessConfig.MemberConfig.MemberCardPicture"
				:style="'background: url('+BusinessConfig.MemberConfig.MemberCardPicture+') no-repeat;background-size: 100%;'">
				<p class="member-id" v-cloak :style="'color:'+BusinessConfig.MemberConfig.MemberCardFontColor">
					{{ Member.NickName }}</br>
					NO. {{ Member.MemberNumber }}
				</p>
				<div class="data-box" hidden>
					<ul class="data-list clearfix">
						<li>
							<router-link to="/member/Integral/IntegralDetail">
								<p class="num" v-cloak
									:style="'color:'+BusinessConfig.MemberConfig.MemberCardFontColor">
									{{ Member.IntegralBalance }}</p>
								<p class="text" :style="'color:'+BusinessConfig.MemberConfig.MemberCardFontColor">积分</p>
							</router-link>
						</li>
						<li>
							<router-link to="/member/stored-detail">
								<p class="num" v-cloak
									:style="'color:'+BusinessConfig.MemberConfig.MemberCardFontColor">
									￥{{ Member.StoredBalance }}</p>
								<p class="text" :style="'color:'+BusinessConfig.MemberConfig.MemberCardFontColor">储值</p>
							</router-link>
						</li>
						<li>
							<router-link to="/member/card-list">
								<p class="num" v-cloak
									:style="'color:'+BusinessConfig.MemberConfig.MemberCardFontColor">
									{{ Member.MemberCardCount }}张</p>
								<p class="text" :style="'color:'+BusinessConfig.MemberConfig.MemberCardFontColor">优惠券
								</p>
							</router-link>
						</li>
					</ul>
				</div>
			</div>
			<div class="member-card" v-else>
				<p class="member-id" v-cloak>{{ Member.NickName }}</br>NO. {{ Member.MemberNumber }}</p>
				<div class="code-box">
					<i class="iconfont iconerweima1" @click="showCodePopup"></i>
					<div class="img">
						<img :src="staticUrl + 'images/myself-2.png'" alt="bg" />
					</div>
				</div>
				<div class="img-box">
					<div class="img">
						<img :src="staticUrl + 'images/myself-1.png'" alt="vip" />
					</div>
					<p class="text">尊贵特权 会员专享</p>
					<p class="tag" v-if="ShowTags.length>0"><span v-for="(item,index) in ShowTags"
							:key="index">{{item.TagName}}<span v-if='index<ShowTags.length-1'> | </span></span></p>
				</div>
				<div class="data-box" hidden>
					<ul class="data-list clearfix">
						<li>
							<router-link to="/member/Integral/IntegralDetail">
								<p class="num" v-cloak>{{ Member.IntegralBalance }}</p>
								<p class="text">积分</p>
							</router-link>
						</li>
						<li>
							<router-link to="/member/stored-detail">
								<p class="num" v-cloak>￥{{ Member.StoredBalance }}</p>
								<p class="text">储值</p>
							</router-link>
						</li>
						<li>
							<router-link to="/member/card-list">
								<p class="num" v-cloak>{{ Member.MemberCardCount }}张</p>
								<p class="text">优惠券</p>
							</router-link>
						</li>
					</ul>
				</div>
			</div>




			<!-- <div class="member-card" v-if="Member&&Member.BusinessCode=='e34afed9763a4e4aa5988ab0aad937da'" 
      style=" background: url(http://open.yubustep.cn/FileRoot/jinseMemberCard.png) no-repeat;background-size: 100%;">
        <p class="member-id" v-cloak style="color:#333">NO. {{ Member.MemberNumber }}</p>
        <div class="data-box">
          <ul class="data-list clearfix">
            <li>
              <router-link to="/member/Integral/IntegralDetail">
                <p class="num" v-cloak style="color:#333">{{ Member.IntegralBalance }}</p>
                <p class="text" style="color:#333">积分</p>
              </router-link>
            </li>
            <li>
              <router-link to="/member/stored-detail">
                <p class="num" v-cloak style="color:#333">￥{{ Member.StoredBalance }}</p>
                <p class="text" style="color:#333">储值</p>
              </router-link>
            </li>
            <li>
              <router-link to="/member/card-list">
                <p class="num" v-cloak style="color:#333">{{ Member.MemberCardCount }}张</p>
                <p class="text" style="color:#333">优惠券</p>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="member-card" v-else-if="Member&&Member.BusinessCode=='b6849b3e0402437ca806468b7d66cff3'" 
      style=" background: url(http://open.yubustep.cn/FileRoot/MemberCard_xiangyekechuan.png) no-repeat;background-size: 100%;">
        <p class="member-id" v-cloak style="color:#fff">NO. {{ Member.MemberNumber }}</p>
        <div class="data-box">
          <ul class="data-list clearfix">
            <li>
              <router-link to="/member/Integral/IntegralDetail">
                <p class="num" v-cloak style="color:#fff">{{ Member.IntegralBalance }}</p>
                <p class="text" style="color:#fff">积分</p>
              </router-link>
            </li>
            <li>
              <router-link to="/member/stored-detail">
                <p class="num" v-cloak style="color:#fff">￥{{ Member.StoredBalance }}</p>
                <p class="text" style="color:#fff">储值</p>
              </router-link>
            </li>
            <li>
              <router-link to="/member/card-list">
                <p class="num" v-cloak style="color:#fff">{{ Member.MemberCardCount }}张</p>
                <p class="text" style="color:#fff">优惠券</p>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="member-card" v-else-if="Member&&Member.BusinessCode=='c5e6baa9861e452dbd420bc16721e474'" 
      style=" background: url(http://open.dsskvip.com/FileRoot/dsskMemberCard.jpg) no-repeat;background-size: 100%; height:210px; ">
        <p class="member-id" v-cloak style="color:#333;text-align: right;font-weight: 500;position: absolute;
    right: 20px;
    bottom: 20px;    font-size: 18px;">NO. {{ Member.MemberNumber }}</p>
        <div class="data-box" style="width: 200px;right: 10px;left: inherit;" hidden>
          <ul class="data-list clearfix">
            <li>
              <router-link to="/member/Integral/IntegralDetail">
                <p class="num" v-cloak style="color:#333;font-size: 14px;font-weight: 500;">{{ Member.IntegralBalance }}</p>
                <p class="text" style="color:#333; font-size: 14px;">积分</p>
              </router-link>
            </li>
            <li>
              <router-link to="/member/stored-detail">
                <p class="num" v-cloak style="color:#333;font-size: 14px;font-weight: 500;">￥{{ Member.StoredBalance }}</p>
                <p class="text" style="color:#333; font-size: 14px;">储值</p>
              </router-link>
            </li>
            <li>
              <router-link to="/member/card-list">
                <p class="num" v-cloak style="color:#333;font-size: 14px;font-weight: 500;">{{ Member.MemberCardCount }}张</p>
                <p class="text" style="color:#333; font-size: 14px;">优惠券</p>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="member-card" v-else>
        <p class="member-id" v-cloak>NO. {{ Member.MemberNumber }}</p>
        <div class="code-box">
          <i class="iconfont iconerweima1" @click="showCodePopup"></i>
          <div class="img">
            <img src="../../../../static/images/myself-2.png" alt="bg" />
          </div>
        </div>
        <div class="img-box">
          <div class="img">
            <img src="../../../../static/images/myself-1.png" alt="vip" />
          </div>
          <p class="text">尊贵特权 会员专享</p>
          <p class="tag" v-if="ShowTags.length>0"><span v-for="(item,index) in ShowTags" :key="index">{{item.TagName}}<span v-if='index<ShowTags.length-1'> | </span></span></p>
        </div>
        <div class="data-box">
          <ul class="data-list clearfix">
            <li>
              <router-link to="/member/Integral/IntegralDetail">
                <p class="num" v-cloak>{{ Member.IntegralBalance }}</p>
                <p class="text">积分</p>
              </router-link>
            </li>
            <li>
              <router-link to="/member/stored-detail">
                <p class="num" v-cloak>￥{{ Member.StoredBalance }}</p>
                <p class="text">储值</p>
              </router-link>
            </li>
            <li>
              <router-link to="/member/card-list">
                <p class="num" v-cloak>{{ Member.MemberCardCount }}张</p>
                <p class="text">优惠券</p>
              </router-link>
            </li>
          </ul>
        </div>
      </div> -->
		</div>
		<!-- member-card end -->
		<!-- bar-code -->
		<uni-transition mode-class="fade" :show="true">
			<div class="bar-code" v-if="barcodeshow">
				<div class="bar-code-cot">
					<h6 class="title">会员号</h6>
					<div class="bar">
						<img :src="
                'http://open.yubustep.cn/GetBarImg?BarCode=' +
                  Member.MemberNumber
              " alt="条形码" />
					</div>
					<!-- <p class="text" v-cloak>{{Member.MemberNumber}}</p> -->
				</div>
				<div class="bg" @click="hideCodePopup"></div>
			</div>
		</uni-transition>
		<!-- bar-code end -->
		<div class="division" v-if="false"></div>
		<!-- member-level -->
		<div class="member-level" v-if="rankList && rankList.length > 1&&false">
			<div class="level-box">
				<ul class="level-list clearfix">
					<li v-for="(item, index) in rankList" :key="index" :class="{ active: item.active }"
						:style="{ width: levelwidth + '%' }">
						<div class="item">
							<div class="icon">
								<img class="iconfont" :src="item.Icon" alt="vip" />
							</div>
							<p class="text">{{ item.Name }}</p>
						</div>
					</li>
				</ul>
				<div class="level-data" v-if="nextLevel">
					<div class="brand">升级</div>
					<p class="text">
						还需
						<span class="num" v-cloak>
							{{
              nextLevel.UpgradePoint - Member.IntegralCumulativeBalance
              }}
						</span>积分即可升至
						<span class="num" v-cloak>{{ nextLevel.Name }}</span>
					</p>
				</div>
				<div class="level-data" v-if="!nextLevel">
					<div class="brand">满级</div>
					<p class="text">恭喜成为最高级会员</p>
				</div>
			</div>
			<div class="level-equity" v-if="PrivilegeRank">
				<ul class="equity-list clearfix">
					<li v-for="(item, index) in PrivilegeRank" :key="index" :class="{ active: item.active }">
						<div class="abb" @click="showEquityPopup(index)">
							<div class="img">
								<img :src="item.ImageUnEffective" alt="icon" />
								<img :src="item.ImageEffective" alt="icon" />
							</div>
							<p class="text" v-cloak>{{ item.Name }}</p>
						</div>
						<uni-transition mode-class="fade" :show="item.popupshow">
							<div class="equity-popup" v-show="item.popupshow">
								<div class="equity-popup-cot">
									<div class="cot">
										<div class="img">
											<img :src="item.Picture" :alt="item.title" />
										</div>
										<h6 class="title" v-cloak>{{ item.Name }}</h6>
										<p class="int" v-cloak>{{ item.Remark }}</p>
									</div>
									<div class="close" @click="hideEquityPopup(index)">
										<img :src="staticUrl + 'images/close.png'" alt />
									</div>
								</div>
							</div>
						</uni-transition>
					</li>
				</ul>
			</div>
		</div>
		<!-- member-level end -->
		<div class="cellbox">
			<div class="cellline" hidden>
				<div class="head" :style="'background: url('+Member.HeadImgUrl+') no-repeat;background-size: 80%;' ">
				</div>
				<div class="info">{{Member.MemberName?Member.MemberName:Member.NickName}}</div>
				<div class="iconfont iconjiantou3-copy"></div>
			</div>
			<div class="cellline">
				<router-link to="/member/stored-detail">
					<div class="title">储值记录</div>
					<div class="info">￥{{ Member.StoredBalance }}</div>
					<div class="iconfont iconjiantou3-copy"></div>
				</router-link>
			</div>
			<div class="cellline">
				<router-link to="/member/Integral/IntegralDetail">
					<div class="title">我的积分</div>
					<div class="info">{{ Member.IntegralBalance }}</div>
					<div class="iconfont iconjiantou3-copy"></div>
				</router-link>
			</div>
			<div class="cellline" v-if="BusinessConfig&&BusinessConfig.EntryConfig.GoodsShopEntrySwitch">
				<router-link :to="{path:'/member/Integral/GoodsShop'}">
					<div class="title">积分商城</div>
					<div class="info"></div>
					<div class="iconfont iconjiantou3-copy"></div>
				</router-link>
			</div>
			<div class="cellline">
				<router-link to="/member/card-list">
					<div class="title">优惠券</div>
					<div class="info">{{ Member.MemberCardCount }}张</div>
					<div class="iconfont iconjiantou3-copy"></div>
				</router-link>
			</div>
		</div>
		<!-- dining-record -->
		<div class="dining-record" v-if="false">
			<router-link to="/member/bill-list">用餐记录</router-link>
		</div>
		<!-- activicity -->
		<div class="activicity">
			<!-- <div class="title-box">
        <div class="title-cot">
          <h5 class="title">活动</h5>
        </div>
      </div> -->
			<!-- <div class="img" v-if="Member&&Member.BusinessCode=='e34afed9763a4e4aa5988ab0aad937da'">
        <img src="http://open.yubustep.cn/FileRoot/Snipaste_2020-12-07_16-48-29.png" alt />
      </div>
      <div class="img" v-if="Member&&Member.BusinessCode=='c5e6baa9861e452dbd420bc16721e474'">
        <img :src="'http://open.dsskvip.com/FileRoot/dsskHuoDong.jpg?var='+Ver" alt />
        <div>全省56家直营店面，全面开业（当阳店装修升级，开业另行通知）</div>
      </div> -->
			<!-- banner -->
			<div class="banner" v-if="bannerList.length>1" style="width: 100%;min-height: 100px;">
				<mt-swipe :auto="4000">
					<mt-swipe-item v-for="item in bannerList" :key="item">
						<div :style="'background-image:url('+item+');'" class=" bannerimgitem"></div>
					</mt-swipe-item>
				</mt-swipe>
			</div>
			<div class="img banner" v-else-if="bannerList.length==1" style="width: 100%;min-height: 100px;">
				<!-- <img :src="bannerList[0]" alt /> -->
				<div :style="'background-image:url('+bannerList[0]+');'" class=" bannerimgitem"></div>
			</div>
			<div class="img" v-else hidden>
				<img :src="staticUrl + 'images/activicity.jpg'" alt />
			</div>
			<!-- banner end -->


		</div>
		<!-- activicity end -->
		<!-- dining-record end -->
		<div class="division" v-if="!OnActivity"></div>
		<!-- hot-exchange -->
		<div class="hot-exchange" v-if="!OnActivity">
			<div class="title-box">
				<h5 class="title">
					<i class="iconfont iconhuo"></i>
					用餐记录
				</h5>
				<router-link to="/member/bill-list">
					更多
					<i class="iconfont iconjiantou3-copy"></i>
				</router-link>
			</div>
			<div class="diningrecord">
				<ul class="list" v-if="billList&&billList.length>0">
					<li v-for="(item, index) in billList" :key="index" @click="handleDetail(item)">
						<div class="item">
							<div class="text-box">
								<p class="title">
									{{ item.StoreName }}
									<span class="table">(台位：{{ item.DeskName }})</span>
								</p>
								<p class="time" v-if="item.BillState == 2">结账时间：{{ item.BillCashierTime }}</p>
								<p class="time" v-else>结账时间：未结账</p>
								<p class="price">消费金额：{{ item.Amount }}元</p>
							</div>
							<div class="arrow">
								<i class="iconfont iconjiantou-b-copy-l"></i>
							</div>
							<div class="state commented" v-if="moment(item.BillCashierTime).add(2,'days')<moment()">完成
							</div>
							<div class="state eating" v-else-if="item.BillState == 1">就餐中</div>
							<div class="state commented" v-else-if="item.CommentState == 1">已评价</div>
							<div class="state gocomment" v-else-if="item.BillState == 2 && item.CommentState == 0">去评价
							</div>
						</div>
						<!-- <router-link class="state gocomment" v-if="item.BillState == 2 && item.CommentState == 0">去评价</router-link> -->
					</li>
				</ul>
				<div v-else style="color: #666666;text-align: center;line-height: 150px;font-size: 14px;">暂无任何消费记录</div>
			</div>
		</div>
		<!-- hot-exchange end -->
		<div class="manageBtnBox" v-if="Employee">
			<div class="manageBtn" @click="ToManage">管理后台 - {{Employee.RoleName}}</div>
		</div>
		<!-- <div class="division"></div> -->

		<!-- <div class="support" v-if="Member&&Member.BusinessCode=='c5e6baa9861e452dbd420bc16721e474'">服务电话：<a href="tel:15671043558">15671043558</a></div> -->
		<!-- <div style="padding:0 20px;">
        <a class="line" style="text-align:center;font-size: 24px; line-height:40px; color:#f2be85;font-weight:bold;background-color: red;"
        href="https://mp.weixin.qq.com/s/OkdnNxopEl8uNNaP4J7n2w">
          查看春节期间营业门店
        </a>
    </div> -->
		<!-- <img :src="MediaService+'/FileRoot/492b38c5ff88152770c65e038dfe570.jpg'" alt=""> -->

		<!-- <div class="line" style="text-align:left;font-size: 14px;padding:10px 20px;color:red;font-weight:bold">通知：过年期间由于市场原因，部分菜品有所上浮，正月初八以后恢复原价。</div> -->
		<!-- <div class="line"></div> -->
		<div style="padding: 25px 0; width: 100%;display: block;" v-if="OnActivity"></div>
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
	</div>
</template>

<script>
	import {
		GetMemberRankList,
		GetMemberRankDetail,
		GetPrivilegeList,
		GetEmployee
	} from "@/api/member";
	import {
		GetBillList
	} from "@/api/bill";
	import {
		Toast
	} from "mint-ui";
	import {
		mapActions,
		mapGetters
	} from "vuex";
	import {
		commonMixin
	} from '../../mixins/index.js'
	import moment from "moment";
	export default {
		name: "myself",
		mixins: [commonMixin],
		data() {
			return {
				moment,
				nextLevel: null, // 下一等级信息
				levelwidth: null, ///等级宽度
				rankList: [], //等级列表
				PrivilegeRank: [], //等级特权
				hotlist: [], // 热门兑换列表
				barcodeshow: false, // 是否显示条形码弹窗
				billList: [],
				Employee: null,
				bannerList: [],
				Ver: 3
			};
		},
		computed: {
			...mapGetters(["MemberCode", "StoreCode", "DeskID", "Member", 'Business', "BusinessConfig", 'MediaService',
				'Branch', 'OnActivity'
			]),
			ShowTags() {
				return this.Member && this.Member.MemberTags ? this.Member.MemberTags.filter(a => a.ShowTag == 1) : [];
			},
			UnLoadBillDataSwitch() {
				return moment() < moment("2022-05-21 12:00") && this.Branch == 'DSSK';
			},
		},
		created() {
			this.Ver = moment().format('MMDDHHmmss');
			this.NeedMember().then(res => {
				if (!this.OnActivity) {
					GetBillList({
						MemberCode: this.MemberCode,
						pageNo: this.pageNo,
						pageSize: 3
					}).then(res => {
						this.billList = res.data //.slice(0, 3);
					}).catch(err => console.log(err));
				}
			})
		},
		mounted() {
			this.NeedBusinessConfig().then(res => {
				res.data.AdsenseConfig.MemberCenterBanners.forEach(pic => {
					this.bannerList.push(pic)
				})
				// console.log('this.Business',JSON.stringify(this.Business));
				// console.log('this.BusinessConfig',JSON.stringify(this.BusinessConfig));
			})
		},
		methods: {
			...mapActions(["NeedMember", "NeedBusinessConfig"]),
			ToManage() {
				console.log('Business', this.Business, 'http://' + this.Business.DomainName + '/user/login?state=' + this
					.Employee.EmployeeCode + 'dttd' + moment(new Date()).valueOf());
				window.location.href = 'http://' + this.Business.DomainName + '/user/login?state=' + this.Employee
					.EmployeeCode + 'dttd' + moment(new Date()).valueOf();
			},
			handleDetail(item) {
				if (item.BillState == 2 && item.CommentState == 0 && moment(item.BillCashierTime).add(2, 'days') >
				moment()) {
					this.$router.push({
						name: "comment",
						query: {
							BillID: item.BillID,
							BillCode: item.BillCode,
							StoreCode: item.StoreCode
						}
					});
				} else if (item.BillState == 1 || item.CommentState == 1) {
					this.$router.push({
						name: "BillDetail",
						query: {
							BillID: item.BillID,
							BillCode: item.BillCode,
							StoreCode: item.StoreCode
						}
					});
				}
			},
			//时间转化函数
			dateFormart(time, formart) {
				return moment(time).format(formart);
			},
			// 弹出条形码
			showCodePopup() {
				this.barcodeshow = true;
			},
			// 关闭条形码
			hideCodePopup() {
				this.barcodeshow = false;
			},
			// 显示权益弹窗
			showEquityPopup(index) {
				this.PrivilegeRank[index].popupshow = true;
			},
			// 关闭权益弹窗
			hideEquityPopup(index) {
				this.PrivilegeRank[index].popupshow = false;
			}
		}
	};
</script>
<style lang="scss" scoped>
	.cellbox {
		padding: 0 20px;
	}

	.cellline {
		background: #fff;
		border-radius: 5px;
		-webkit-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
		margin: 10px auto;
		padding: 0 15px 0 20px;
		position: relative;
	}

	.cellline .title {
		line-height: 50px;
		height: 50px;
	}

	.cellline .head {
		height: 80px;
		line-height: 80px;
		border-radius: 50%;
		width: 80px;
		;
	}

	.cellline .info {
		position: absolute;
		right: 25px;
		height: 50px;
		line-height: 50px;
		top: 0;
		color: #ffbb05;
	}

	.cellline .iconfont {
		position: absolute;
		right: 10px;
		top: 0px;
		height: 50px;
		line-height: 50px;
		color: rgba(0, 0, 0, 0.3);
		font-size: 14px;
	}

	.fontyellow {
		color: #ffbb05;
	}

	.line {
		width: 100%;
		min-height: 30px;
		line-height: 30px;
		display: block;
	}
</style>
<style lang="scss" scoped>
	[v-cloak] {
		display: none !important;
	}

	.manageBtnBox {
		padding: 15px 15px 0;
		background: #f2f2f6;
	}

	.manageBtn {
		width: 100%;
		height: 44px;
		line-height: 44px;
		border-radius: 20px;
		text-align: center;
		color: #fff;
		font-size: 14px;
		background: #ff423e;
		box-shadow: 0px 0px 9.9px 0.1px rgba(255, 66, 62, 0.5);
	}

	$main: #ffbb05;
	$red: #ff423e;
	$border: #e6e6ea;
	$grey: #777;
	$glod: #b6986a;
	$green: #09bb07;

	@mixin border-radius($size) {
		-webkit-border-radius: $size;
		-moz-border-radius: $size;
		border-radius: $size;
	}

	@mixin transition {
		-webkit-transition: all 0.3s;
		-moz-transition: all 0.3s;
		-ms-transition: all 0.3s;
		-o-transition: all 0.3s;
		transition: all 0.3s;
	}

	.tag {
		font-size: 12px;
		color: #fff;
		display: inline-block;
		position: absolute;
		top: 100px;
		right: 20px;
	}

	/* diningrecord */
	.diningrecord {
		padding: 10px 10px 0;
		overflow: scroll;
		width: 100%;

		li {
			height: 85px;
			background: #fff;
			@include border-radius(5px);
			-webkit-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
			-moz-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
			box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
			margin-bottom: 10px;
			padding: 12px 15px 0 20px;
			position: relative;
		}

		.title {
			font-size: 14px;
			line-height: 1;

			.table {
				font-size: 12px;
				color: $grey;
				margin-left: 10px;
			}
		}

		.time {
			font-size: 12px;
			line-height: 1;
			color: $grey;
			margin-top: 12px;
		}

		.price {
			font-size: 12px;
			line-height: 1;
			color: $grey;
			margin-top: 10px;
		}

		.arrow {
			position: absolute;
			top: 12px;
			right: 15px;

			i {
				font-size: 12px;
				color: white;
			}
		}

		.eating,
		.gocomment,
		.commented {
			width: 75px;
			height: 25px;
			background: #ff423e;
			line-height: 25px;
			text-align: center;
			@include border-radius(13px);
			color: #fff;
			font-size: 12px;
			position: absolute;
			bottom: 30px;
			right: 15px;
			box-shadow: 0px 0px 9.9px 0.1px rgba(255, 66, 62, 0.5);
			display: block;
		}

		.gocomment {
			background: #ffbb05;
			box-shadow: 0px 0px 9.9px 0.1px rgba(255, 187, 5, 0.5);
		}

		.commented {
			background: #c9c9c9;
			box-shadow: none;
		}
	}

	/* diningrecord end */
	/* banner */

	.banner {
		height: 120px;
		margin-top: 15px;

		.mint-swipe {
			width: 100%;
			height: 100%;
		}

		.img {
			width: 100%;
			height: 120px;
			overflow: hidden;
			display: block;
			@include border-radius(5px);

			img {
				width: 100%;
				display: block;
			}
		}

		.bannerimgitem {
			width: 100%;
			height: 100%;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center
		}

	}

	/* banner end */
	/* member-card-box */

	.member-card-box {
		padding: 10px;

		.member-card {
			width: 100%;
			height: 200px;
			padding: 15px 20px;
			background: #1e1f1f;
			position: relative;
			overflow: hidden;
			background-size: 100%;
			@include border-radius(10px);

			.member-id {
				font-size: 18px;
				color: $glod;
				position: absolute;
				right: 20px;
				bottom: 25px;
				font-weight: bold;
				text-align: right;
			}

			.img-box {
				margin-top: 30px;

				.img {
					width: 120px;

					img {
						width: 100%;
						display: block;
					}
				}

				.text {
					font-size: 10px;
					color: $glod;
					margin-top: 15px;
					letter-spacing: 3px;
				}
			}

			.code-box {
				position: absolute;
				right: 0;
				top: 0;

				.img {
					width: 120px;

					img {
						width: 100%;
					}
				}

				i {
					font-size: 36px;
					color: #4b4d4d;
					position: absolute;
					right: 15px;
					top: 20px;
				}
			}

			.data-box {
				position: absolute;
				bottom: 15px;
				left: 20px;
				right: 20px;

				li {
					width: 29.33%;
					float: left;
					text-align: center;
					line-height: 20px;
					text-align: center;

					&:nth-child(1) {
						text-align: left;
						padding-left: 10px;
					}

					&:nth-child(3) {
						text-align: right;
						padding-right: 10px;
					}
				}

				a {
					display: inline-block;
					text-align: center;
				}

				.num {
					font-size: 12px;
					color: #fff;
				}

				.text {
					font-size: 12px;
					color: #fff;
				}
			}
		}
	}

	/* member-card-box end */
	/* member-level */

	.member-level {
		.level-box {
			padding: 20px 10px 15px;
			position: relative;
			z-index: 2;
			border-bottom: 1px solid $border;

			.level-list {
				//margin: 0 20px;

				li {
					width: 20%;
					float: left;
					text-align: center;
					position: relative;

					&::after {
						content: "";
						position: absolute;
						height: 3px;
						width: 100%;
						background: #a3a3a3;
						top: 19px;
						left: -50%;
						z-index: -1;
					}

					&:first-child::after {
						display: none;
					}
				}

				.item {
					display: inline-block;
				}

				.icon {
					width: 40px;
					height: 40px;
					padding: 8px;
					text-align: center;
					background: #a3a3a3;
					@include border-radius(50%);

					img {
						color: #fff;
					}
				}

				.text {
					font-size: 12px;
					text-align: center;
					line-height: 1;
					margin-top: 10px;
				}

				.active {
					.icon {
						background: $main;
					}

					&::after {
						background: $main;
					}
				}
			}

			.progress {
				height: 4px;
				position: absolute;
				left: 50px;
				right: 50px;
				top: 38px;
				background: #a3a3a3;
				z-index: -1;

				.bar {
					height: 100%;
					position: absolute;
					left: 0;
					top: 0;
					background: $main;
					-webkit-border-radius: 0 2px 2px 0;
					-moz-border-radius: 0 2px 2px 0;
					border-radius: 0 2px 2px 0;
				}
			}

			.level-data {
				text-align: center;
				font-size: 12px;
				line-height: 1;
				margin-top: 15px;

				.brand {
					height: 16px;
					line-height: 16px;
					font-size: 10px;
					padding: 0 5px;
					background: $main;
					color: #fff;
					display: inline-block;
					@include border-radius(2px);
				}

				.text {
					display: inline-block;
					font-size: 12px;

					.num {
						color: $main;
					}
				}
			}
		}
	}

	/* member-level end */
	/* level-equity */
	.level-equity {
		padding: 0 10px;

		li {
			width: 20%;
			height: 60px;
			float: left;
			padding-top: 10px;
			text-align: center;
		}

		.img {
			img {
				width: 16px;
				display: inline-block;

				&:nth-child(2) {
					display: none;
				}
			}
		}

		.text {
			font-size: 10px;
			line-height: 1;
			margin-top: 5px;
		}

		.active {
			.img {
				img {
					&:nth-child(1) {
						display: none;
					}

					&:nth-child(2) {
						display: inline-block;
					}
				}
			}

			.text {
				color: $main;
			}
		}

		.equity-popup {
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 99;
			background: rgba(0, 0, 0, 0.5);

			.equity-popup-cot {
				width: 300px;
				padding: 30px 10px;
				position: absolute;
				top: 50%;
				left: 50%;
				margin-left: -150px;
				margin-top: -150px;
				background: #fff;
				@include border-radius(10px);
				position: relative;

				.img {
					width: 100%;

					img {
						width: 100%;
						display: block;
					}
				}

				.title {
					font-size: 14px;
					line-height: 1;
					padding-left: 10px;
					margin: 10px 0;
					text-align: left;
					position: relative;

					&:before {
						content: "";
						width: 3px;
						height: 14px;
						background: $main;
						position: absolute;
						left: 0;
						top: 50%;
						margin-top: -7px;
						@include border-radius(2px);
					}
				}

				.int {
					text-align: left;
					font-size: 12px;
					line-height: 18px;
					color: $grey;
				}

				.close {
					width: 20px;
					height: 20px;
					position: absolute;
					top: 5px;
					right: 10px;

					img {
						width: 100%;
					}
				}
			}
		}
	}

	/* level-equity end */
	/* dining-record */
	.dining-record {
		padding: 10px;
		background: #f2f2f6;

		a {
			width: 100%;
			height: 45px;
			line-height: 45px;
			text-align: center;
			background: $main;
			display: block;
			font-size: 14px;
			@include border-radius(23px);
		}
	}

	/* dining-record end */
	/* hot-exchange */
	.hot-exchange {
		padding: 20px 10px 15px;

		.title-box {
			height: 20px;

			.title {
				line-height: 1;
				font-size: 14px;
				float: left;

				i {
					color: #d81e06;
					font-size: 14px;
				}
			}

			a {
				display: block;
				float: right;
				font-size: 14px;
				color: $main;

				i {
					display: inline-block;
					font-size: 12px;
					color: $main;
				}
			}
		}

		.hot-exchange-cot {
			margin-top: 15px;

			.hot-exchange-list {
				li {
					margin-top: 10px;
				}

				a {
					padding: 8px;
					height: 106px;
					@include border-radius(5px);
					-webkit-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
					-moz-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
					box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
					display: block;
					position: relative;
					overflow: hidden;
				}

				.img {
					width: 90px;
					height: 90px;
					overflow: hidden;
					@include border-radius(5px);
					float: left;
				}

				.text-box {
					margin-left: 100px;
					padding-top: 10px;

					.title {
						font-size: 14px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.num {
						font-size: 12px;
						line-height: 1;
						color: $grey;
						margin-top: 10px;
					}

					.spend {
						font-size: 12px;
						color: $red;
						line-height: 1;
						margin-top: 10px;
					}
				}

				.btn {
					width: 50px;
					height: 100%;
					position: absolute;
					right: 0;
					top: 0;
					background: $main;

					.text {
						width: 50px;
						height: 100%;
						line-height: 50px;
						font-size: 12px;
						text-align: center;
						color: #fff;
						-webkit-writing-mode: vertical-rl;
						-ms-writing-mode: bt-rl;
						writing-mode: vertical-rl;
					}
				}
			}
		}
	}

	/* hot-exchange end */
	/* activicity */
	.activicity {
		padding: 0px 10px;
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
					content: "";
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
			// margin-top: 15px;
			@include border-radius(5px);

			img {
				width: 100%;
				display: block;
			}
		}

		.support {
			height: 35px;
			line-height: 35px;
			text-align: center;
			font-size: 14px;
			text-align: center;
			color: $grey;
		}
	}

	/* activicity end */
	/* bar-code */
	.bar-code {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;
		@include transition;

		.bar-code-cot {
			width: 300px;
			padding: 15px 30px;
			position: absolute;
			top: 50%;
			left: 50%;
			background: #fff;
			@include border-radius(10px);
			margin-left: -150px;
			margin-top: -80px;
			z-index: 1;

			.title {
				font-size: 14px;
				text-align: center;
				line-height: 1;
			}

			.bar {
				width: 100%;
				margin: 15px 0;

				img {
					display: block;
				}
			}

			.text {
				text-align: center;
				line-height: 1;
				font-size: 12px;
			}
		}

		.bg {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.5);
		}
	}

	/* bar-code end */
	/*fade*/
	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}

	/*fade*/
</style>
