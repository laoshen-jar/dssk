<template>
	<view class="container">
		<view class="content">
			<view class="member-info">
				<view class="info-content">
					<view class="info">
						<view class="info-avatar"></view>
						<text>法外狂徒</text>
					</view>
				</view>
				<view class="tabbar">
					<uni-navigator class="tabbar-item" v-for="(value, index) in tabbarList" :key="index" :url="value.url">
						<iconfont class="iconfont" icon="icongood_active-copy"/>
						<view>{{value.text}}</view>
					</uni-navigator>
				</view>
			</view>
			<view class="tabbar">
				<uni-navigator class="tabbar-item" v-for="(value, index) in tabbarList" :key="index" :url="value.url">
					<iconfont class="iconfont" icon="icongood_active-copy"/>
					<view>{{value.text}}</view>
				</uni-navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabbarList: [
					{
						icons: 'home-filled',
						text: '首页',
						url: '/pages/index/index'
					},
					{
						icons: 'shop-filled',
						text: '门店列表',
						url: '/pages/storeList/index'
					},
					{
						icons: 'shop',
						text: '会员商店',
						url: '/pages/goodsInfo/index'
					},
					{
						icons: 'person-filled',
						text: '我的',
						url: '/pages/member/index'
					}
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="less">
.container {
	width: 100%;
	height: 100vh;
	background: #000;
	.content {
		width: 100%;
		padding: 0 32rpx;
		position: fixed;
		bottom: 40px;
		box-sizing: border-box;
		.member-info {
			width: 100%;
			height: 300px;
			border-radius: 30rpx;
			padding: 18px 20rpx;
			background: #fff;
			box-sizing: border-box;
			margin-bottom: 30px;
			.info-content{
				width: 100%;
				height: 60px;
				.info {
					width: 300rpx;
					display: flex;
					.info-avatar {
						width: 100rpx;
						height: 50px;
						background: red;
						margin-right: 20rpx;
					}
					text {
						line-height: 50px;
					}
				}
				&:after{
					content: "";
					display: block;
					width: 100%;
					height: 1px;
					background: red;
					margin-top: 10px;
				}
			}
			.tabbar {
				background: transparent;
			}
		}
		.tabbar {
			width: 100%;
			height: 60px;
			border-radius: 60rpx;
			background: #fff;
			box-sizing: border-box;
			padding: 18px 20rpx;
			display: flex;
			justify-content: center;
			.tabbar-item {
				width: 80px;
				text-align: center;
				view {
					font-size: 14px;
				}
			}
		}
	}
}
</style>
