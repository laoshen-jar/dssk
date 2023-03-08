<template>
	<view class="container" ref="wrapper">
		<load-refresh :isRefresh="true" @refresh="loadBottom" ref="loadRefresh">
			<view slot="content-list">
				<!-- location -->
				<!-- <view class="location">
					<view class="location-address">
						<view class="icon">
							<image src="../../static/images/location.png" alt="定位标" />
						</view>
						<view class="text">{{location}}</view>
					</view>
					<view class="location-btn" @cviewck="repeatLocal">
						<text class="iconfont icondingwei"></text>
						<view class="text">重新定位</view>
					</view>
				</view> -->
				<!-- location end -->
				<!-- banner -->
				<view class="banner">
					<swiper :interval="4000" :autoplay="true">
						<swiper-item v-for="item in bannerList" :key="item.id">
							<navigator url="" class="image">
								<image :src="item.src" :alt="item.alt" />
							</navigator>
						</swiper-item>
					</swiper>
				</view>
				<!-- banner end -->
				<!-- nearby -->
				<!-- <view class="nearby">
					<view class="global-title">
						<view class="title">最近门店</view>
					</view>
					<view class="nearby-viewst">
						<view class="viewst">
							<view v-for="item in storeviewst" :key="item.id">
								<view class="item">
									<navigator :to="{name:'store',params:{id:item.id}}">
										<view class="image">
											<image :src="item.src" :alt="item.alt" />
										</view>
										<view class="text-box">
											<view class="title">{{item.name}}</view>
											<view class="data-box">
												<view class="distance">距离{{item.distance}}米</view>
												<view class="pay">人均消费￥{{item.pay}}</view>
											</view>
										</view>
									</navigator>
									<view class="btn-box">
										<navigator
											:url="'https://apis.map.qq.com/uri/v1/geocoder?coord='+item.longitude+','+item.latitude+';referer=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77'"
											class="navigation">
											<text class="iconfont iconjviewi"></text>
											<view class="text">导航</view>
										</navigator>
										<navigator :url="'tel:'+ item.tel" class="tel">
											<text class="iconfont icondianhua1"></text>
											<view class="text">电话</view>
										</navigator>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view> -->
				<!-- nearby end -->
				<view class="viewision"></view>
				<!-- city -->
				<view class="nearby" style="margin-top: 12px;">
					<view class="location" style="padding: initial;margin-bottom: 0;">
						<view class="location-address">
							<iconfont class="iconfont" icon="iconmeiguoyiliao" style="color:#ffbb05"></iconfont>
							<text class="text" style="float: initial;">全部门店</text>
						</view>
					</view>
				</view>
				<!-- city -->
				<view class="city">
					<view class="city-tab">
						<view class="tab-list clearfix">
							<view v-for="area in Areas" :key="area.AreaCode"
								:class="ActiveArea&&area.AreaName==ActiveArea.AreaName ? 'active' : ''"
								@click="ActiveArea=area">{{area.AreaName}} ({{area.Stores.length}}家)</view>
						</view>
					</view>
					<view class="city-list-box" v-if="ActiveArea">
						<view class="city-list">
							<view v-for="store in ActiveArea.Stores" :key="store.StoreCode"
								v-show="store.IsDel==0||store.State==1">
								<view class="item">
									<navigator :to="{name:'DishMenu',query:{StoreCode:store.StoreCode}}">
										<image class="img" v-if="store.ImageUrl" :src="store.ImageUrl">
										</image>
										<view class="img" v-else>
											<view class="error">{{store.StoreName}}</view>
										</view>
										<view class="text-box">
											<view class="title">{{store.StoreName}}</view>
											<view class="data-box">
												<view class="address">地址：{{store.Address?store.Address:"未录入地址信息"}}
												</view>
												<!-- <view class="distance">距离{{item.distance}}米</view> -->
												<!-- <view class="pay"></view> -->
											</view>
											<!-- <view class="data-box">
												<view class="distance">距离{{item.distance}}米</view>
												<view class="pay">人均消费￥{{item.pay}}</view>
											</view> -->
										</view>
									</navigator>
									<view class="btn-box">
										<view @click="openLocaiton(store.Latitude, store.Longitude)"
											class="navigation tel">
											<iconfont class="iconfont" icon="iconjuli" size="12px"></iconfont>
											<view class="text">导航</view>
										</view>
										<view @click="phoneCall(store.Tell)" class="tel">
											<iconfont class="iconfont" icon="icondianhua1" size="12px"></iconfont>
											<view class="text">电话</view>
										</view>
										<!-- <navigator :to="{name:'DishMenu',query:{StoreCode:store.StoreCode}}" class="tel"> 
											<i class="iconfont iconzhongjiefangx"></i>
											<view class="text">菜单</view>
										</navigator> -->
										<view @click="jumpDishMenu(store)" class="tel">
											<iconfont class="iconfont" icon="iconzhongjiefangx" size="12px"></iconfont>
											<view class="text">菜单</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- city end -->
			</view>
		</load-refresh>
		<!-- <view class="support">本服务由越步科技提供技术支持</view> -->
		<web-veiw></web-veiw>
	</view>
</template>

<script>
	import loadRefresh from '@/components/load-refresh/load-refresh.vue'
	import {
		initInfo
	} from '../../utils/initBaseInfo.js'
	import {
		mapActions,
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		GetStoreList,
		GetStore,
		GetAreaList
	} from '@/api/store.js'
	export default {
		name: 'Home',
		components: {
			loadRefresh
		},
		computed: {
			...mapGetters(['Member', 'StoreCode', 'DeskID', "BusinessConfig", 'MediaService']),
		},
		data() {
			return {
				location: '定位中...', // 定位信息
				Stores: [],
				bannerList: [{
					"id": 0,
					"src": "../../static/images/hp-banner.jpg",
					"alt": "banner"
				}, {
					"id": 1,
					"src": "../../static/images/hp-banner.jpg",
					"alt": "banner"
				}], // banner
				storeList: [], // 附近门店
				citytabList: [], // 城市列表
				citystoreList: [], // 城市门店列表
				Areas: [{
					AreaName: '武汉',
					Stores: []
				}, {
					AreaName: '宜昌',
					Stores: []
				}, {
					AreaName: '荆州',
					Stores: []
				}, {
					AreaName: '荆门',
					Stores: []
				}, {
					AreaName: '其他',
					Stores: []
				}],
				ActiveArea: null,
			}
		},

		watch: {
			Member: {
				handler(n) {
					if (n?.BusinessCode)
						this.loadData();
				},
				deep: true,
				immediate: true
			}
		},

		created() {
			initInfo(this)
		},
		mounted() {

		},
		methods: {

			...mapActions(['InitMember', 'NeedMember', 'NeedBusinessConfig', 'NeedBusiness', 'NeedStore']),
			// 重新定位
			repeatLocal() {
				this.location = '北京';
			},

			// 切换城市
			changeCity(e) {
				var index = e.target.dataset.index;
				for (let text = 0; text < this.citytabList.length; text++) {
					this.citytabList[text].active = false;
				}
				this.citytabList[index].active = true;
				// 请求数据
				//  ***
			},

			// 触底加载
			loadData() {
				this.$showLoading();
				GetStoreList({
					// BusinessCode: this.Member.BusinessCode,
					BusinessCode: 'c5e6baa9861e452dbd420bc16721e474',
					pageSize: 9999,
					pageNo: 1
				}).then(res => {
					if (res.state != 200) {
						return
					}
					// const arr=[]
					const result = res.data.reduce((a, b) => {
						if (a[b.AreaCode]) {
							a[b.AreaName].push(b);
						} else {
							a[b.AreaName] = [b]
						}
						return a
					}, []);
					const arr = [];
					res.data.forEach(item => {
						const parent = arr.find(cur => cur.AreaCode === item.AreaCode)
						if (parent) {
							parent.Stores.push(item)
							parent.AreaName = item.AreaName
							parent.AreaCode = item.AreaCode
						} else {
							const obj = {
								AreaName: item.AreaName,
								AreaCode: item.AreaCode,
								Stores: [item]
							}
							arr.push(obj)
						}
					})
					this.Stores = res.data;
					this.Areas = arr;
					if (this.Areas.length > 0) {
						this.ActiveArea = this.Areas[0];
					}
					this.$refs.loadRefresh.completed()
					this.$hideLoading();
				}).catch(res => {
					this.$refs.loadRefresh.completed()
					this.$hideLoading();
					console.error('GetStoreList.catch', res);
				})
			},

			// 跳转菜单页
			jumpDishMenu(store) {
				uni.navigateTo({
					url: '/pages/dishMenu/index?&StoreCode=3c673cd25e8f4c2f8e76cb5fa09899a6'
				})
			},

			// 打电话
			phoneCall(tel) {
				uni.makePhoneCall({
					phoneNumber: tel
				});
			},

			// 导航
			openLocaiton(lat, long) {
				uni.openLocation({
					latitude: Number(lat),
					longitude: Number(long),
					scale: 15,
					fail(res) {
						console.log('导航错误', res)
						uni.showToast({
							title: '请稍后再试',
							duration: 3000,
							icon: 'error'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	$main: #ffbb05;
	$red: #ff423e;
	$border: #e6e6ea;
	$grey: #777;

	@mixin border-radius($size) {
		-webkit-border-radius: $size;
		-moz-border-radius: $size;
		border-radius: $size;
	}

	.container {
		overflow: scroll;
	}

	/* location */

	.location {
		padding: 15px 10px;
		margin-bottom: 0;

		.location-address {
			margin-bottom: 0;

			.icon {
				height: 16px;
				float: left;

				image {
					height: 100%;
					display: block;
				}
			}

			.text {
				font-size: 14px;
				line-height: 16px;
				float: left;
				margin-left: 5px;
				font-weight: bold;
			}
		}

		.location-btn {
			height: 16px;
			line-height: 16px;
			float: right;

			.iconfont {
				font-size: 14px;
				color: $main;
				float: left;
				display: block;
			}

			.text {
				font-size: 14px;
				float: left;
				color: $main;
				margin-left: 5px;
			}
		}
	}

	/* location end */
	/* banner */

	.banner {
		height: 40vw;
		margin: 10px;

		.swiper {
			width: 100%;
			height: 100%;
		}

		.image {
			width: 100%;
			height: 40vw;
			overflow: hidden;
			display: block;
			@include border-radius(5px);

			image {
				width: 100%;
				display: block;
			}
		}
	}

	/* banner end */
	/* nearby */

	.nearby,
	.city-list {
		padding: 0 10px;

		// margin-top: 15px;
		view {
			// padding: 0 0 10px;
			margin-bottom: 15px;
			border-radius: 5px;

			// border-bottom: 1px solid $border;
			&:last-child {
				border-bottom: none;
			}
		}

		.item {
			height: 120px;
			position: relative;
			border-radius: 5px;
			background-color: #fff;
			padding: 10px;
			-webkit-box-shadow: 1px 2px 5px #afafaf;
			box-shadow: 1px 2px 5px #afafaf;
		}

		.image {
			width: 100px;
			height: 100px;
			@include border-radius(5px);
			overflow: hidden;
			float: left;
			display: block;
			background: no-repeat center;
			background-size: cover;

			image {
				width: 100%;
				display: block;
				font-size: 12px;
				width: 100px;
				height: 100px;
				line-height: 100px;
				text-align: center;
			}

			.error {
				display: block;
				font-size: 12px;
				color: #fff;
				text-align: center;
				background-color: #000;
				width: 100px;
				height: 100px;
				line-height: 100px;
			}
		}

		.text-box {
			margin-left: 110px;
			height: 100%;

			.title {
				font-size: 18px;
				font-weight: bold;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.data-box {
				margin-top: 5px;

				.address {
					color: $grey;
					line-height: 18px;
					font-size: 14px;
					float: left;
				}

				.distance {
					color: $red;
					line-height: 1;
					font-size: 14px;
					float: left;
				}

				.pay {
					color: $grey;
					line-height: 1;
					font-size: 12px;
					float: left;
					margin-left: 20px;
				}
			}
		}

		.btn-box {
			position: absolute;
			bottom: -22px;
			right: 0;
			// left: 150px;
			width: 100%;

			a:first-child {
				margin-right: 0;
			}

			.navigation,
			.tel {
				width: 60px;
				height: 26px;
				line-height: 26px;
				text-align: center;
				font-size: 10px;
				float: right;
				color: #333;
				background: $main;
				margin-right: 10px;
				display: block;
				@include border-radius(12px);

				.iconfont {
					font-size: 12px;
					display: inline-block;
				}

				.text {
					font-size: 12px;
					display: inline-block;
					margin: 0;
					margin-left: 4px;
				}
			}
		}
	}

	/* nearby end */
	/* city */

	.city {
		padding: 10px 0 5px;
		clear: both;

		.city-list {

			// margin-top: 5px;
			// overflow: hidden; 
			image {
				width: 100px;
				height: 100px;
				border-radius: 5px;
				overflow: hidden;
				float: left;
				display: block;
				background: no-repeat 50%;
				background-size: cover;
			}
		}

		.city-tab::-webkit-scrollbar {
			width: 0;
		}

		.city-tab {
			padding: 0 10px;
			white-space: nowrap;
			overflow-x: scroll;

			// height: 31px;
			.tab-list {
				view {
					text-align: center;
					font-size: 14px;
					display: inline-block;
					border: 3px solid $main;
					line-height: 25px;
					margin: 0 6px 0 0;
					padding: 0 7px;
					background: #fff;
					border-radius: 5px;
					font-size: 12px;
				}

				view:last-child {
					margin-right: 10px;
				}

				.active {
					background: $main;
					// color: #fff;
				}
			}
		}

		/*.city-list-box {
			height: 332px;
			margin-top: 5px;
			overflow: scroll;
		}*/
	}

	/* city end */
</style>
