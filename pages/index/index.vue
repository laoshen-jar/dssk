<template>
	<view class="container" ref="wrapper">
		<load-refresh :isRefresh="true" @refresh="loadBottom" ref="loadRefresh">
			<view slot="content-list">
				<!-- location -->
				<view class="location">
					<view class="location-address">
						<view class="icon">
							<image src="../../static/images/location.png" alt="定位标" />
						</view>
						<view class="text">{{location}}</view>
					</view>
					<view class="location-btn" @click="repeatLocal">
						<i class="iconfont icondingwei"></i>
						<view class="text">重新定位</view>
					</view>
				</view>
				<!-- location end -->
				<!-- banner -->
				<view class="banner">
					<swiper :auto="4000">
						<swiper-item v-for="item in bannerList" :key="item.id">
							<navigator to="/myself" class="image">
								<image :src="item.src" :alt="item.alt" />
							</navigator>
						</swiper-item>
					</swiper>
				</view>
				<!-- banner end -->
				<!-- nearby -->
				<view class="nearby">
					<view class="global-title">
						<view class="title">最近门店</view>
					</view>
					<view class="nearby-list">
						<view class="list">
							<view v-for="item in storelist" :key="item.id">
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
											<i class="iconfont iconjuli"></i>
											<view class="text">导航</view>
										</navigator>
										<navigator :url="'tel:'+ item.tel" class="tel">
											<i class="iconfont icondianhua1"></i>
											<view class="text">电话</view>
										</navigator>
									</view>
								</view>
								</li>
								</ul>
							</view>
						</view>
						<!-- nearby end -->
						<view class="viewision"></view>
						<!-- city -->
						<view class="city">
							<view class="city-tab">
								<ul class="tab-list clearfix">
									<li v-for="item in citytablist" :key="item.id" :data-index="item.id"
										:class="item.active ? 'active' : ''" @click="changeCity">
										{{item.text}}
									</li>
								</ul>
							</view>
							<view class="city-list-box">
								<ul class="city-list">
									<li v-for="item in citystorelist" :key="item.id">
										<view class="item">
											<navigator :to="{name:'store',params:{id:item.id}}">
												<view class="image">
													<image :src="item.src" :alt="item.alt" />
												</view>
												<view class="text-box">
													<h6 class="title">{{item.name}}</h6>
													<view class="data-box">
														<view class="distance">距离{{item.distance}}米</view>
														<view class="pay">人均消费￥{{item.pay}}</view>
													</view>
												</view>
											</navigator>
											<view class="btn-box">
												<navigator
													:href="'https://apis.map.qq.com/uri/v1/geocoder?coord='+item.longitude+','+item.latitude+';referer=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77'"
													class="navigation">
													<i class="iconfont iconjuli"></i>
													<view class="text">导航</view>
												</navigator>
												<navigator :href="'tel:'+ item.tel" class="tel">
													<i class="iconfont icondianhua1"></i>
													<view class="text">电话</view>
												</navigator>
											</view>
										</view>
									</li>
								</ul>
							</view>
						</view>
						<!-- city end -->
					</view>
				</view>
			</view>
		</load-refresh>
		<view class="support">本服务由越步科技提供技术支持</view>
	</view>
</template>

<script>
	import loadRefresh from '@/components/load-refresh/load-refresh.vue'
	export default {
		name: 'Home',
		components: {
			loadRefresh
		},
		data() {
			return {
				location: '定位中...', // 定位信息
				bannerList: [], // banner
				storelist: [], // 附近门店
				citytablist: [], // 城市列表
				citystorelist: [], // 城市门店列表
				wrapperHeight: 0, // 页面高度
			}
		},
		created() {
			this.$api({
					url: '../../static/js/data.json',
					method: 'get'
				})
				.then((res) => {
					this.bannerList = res.data.getBannerList;
					this.storelist = res.data.getNearbyList;
					this.citytablist = res.data.getCity;
					this.citystorelist = res.data.getCityList;
				})
				.catch(err => console.log)
		},
		mounted() {
			// console.log(this.$refs);
			// 父控件要加上高度，否则会出现上拉不动的情况
			this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.clientTop;
		},
		methods: {
			// 重新定位
			repeatLocal() {
				this.location = '北京';
			},

			// 切换城市
			changeCity(e) {
				var index = e.target.dataset.index;
				for (let i = 0; i < this.citytablist.length; i++) {
					this.citytablist[i].active = false;
				}
				this.citytablist[index].active = true;
				// 请求数据
				//  ***
			},

			// 触底加载
			loadBottom() {
				this.status = 'loading';
				this.$api({
						url: 'getCityList',
						method: 'get'
					})
					.then((res) => {
						console.log(res);
						if (res) {
							this.citystorelist = this.citystorelist.concat(res.data);
						}
						this.$refs.loadRefresh.completed()
					})
					.catch(err => {
						console.log(err);
						this.$refs.loadRefresh.completed()
					});
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

	.mint-loadmore-content {}

	.mint-loadmore-bottom {}

	/* location */

	.location {
		padding: 15px 10px;

		.location-address {
			float: left;

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
			}
		}

		.location-btn {
			height: 16px;
			line-height: 16px;
			float: right;

			i {
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
		padding: 0 10px;
		margin-top: 15px;

		.mint-swipe {
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
		margin-top: 15px;

		li {
			padding: 10px 0;
			border-bottom: 1px solid $border;

			&:last-child {
				border-bottom: none;
			}
		}

		.item {
			height: 90px;
			position: relative;
		}

		.image {
			width: 135px;
			height: 90px;
			@include border-radius(5px);
			overflow: hidden;
			float: left;

			image {
				width: 100%;
				display: block;
			}
		}

		.text-box {
			margin-left: 150px;
			padding-top: 2px;
			height: 100%;

			.title {
				font-size: 14px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.data-box {
				margin-top: 15px;

				.distance {
					color: $red;
					line-height: 1;
					font-size: 12px;
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
			bottom: 0;
			left: 145px;

			.navigation,
			.tel {
				width: 60px;
				height: 22px;
				line-height: 22px;
				text-align: center;
				font-size: 10px;
				float: left;
				color: #333;
				background: $main;
				margin-right: 10px;
				display: block;
				@include border-radius(11px);

				i {
					font-size: 10px;
					display: inline-block;
				}

				.text {
					font-size: 10px;
					display: inline-block;
				}
			}
		}
	}

	/* nearby end */
	/* city */

	.city {
		padding: 15px 0 5px;

		.city-tab {
			padding: 0 10px;

			li {
				line-height: 25px;
				margin-right: 10px;
				float: left;
				padding: 0 15px;
				height: 25px;
				display: block;
				background: #f2f2f6;
				@include border-radius(5px);
				font-size: 12px;
			}

			.active {
				background: $main;
				color: #fff;
			}
		}

		/*.city-list-box {
			height: 332px;
			margin-top: 5px;
			overflow: scroll;
		}*/
		.city-list {
			margin-top: 5px;
		}
	}

	/* city end */
</style>
