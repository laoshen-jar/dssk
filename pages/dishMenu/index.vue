<template>
	<view class="container" v-if="!DeskUnState || true">

		<uni-search-bar @confirm="OnSearch" placeholder="请输入搜索关键词" v-model="SearchKey" @change="OnSearch"
			@focus="OnSearchFocus" @cancel="OnSearchCancel" bgColor="#f6f6f6" radius="24">
		</uni-search-bar>
		<view class="SearchCard" v-if="SearchState">
			<view class="dishul searchul">
				<view class="dishli" :class="dish.Picture ? 'showpic' : 'nopic'" v-for="(dish, index) in SearchResult"
					:key="index">
					<view class="bg">
						<view class="dish">
							<view class="dishpic" v-lazy:background-image="dish.Picture" v-if="dish.Picture">
							</view>
							<view class="dishinfo">
								<view class="dishname" v-if="!dish.Picture">
									<image class="dishtag" v-for="(tag,indext) in dish.DishTags" :key="indext"
										:src="tag.TagImg" />
									{{ dish.DishName }}
								</view>
								<view class="dishname" v-else>{{ dish.DishName }}</view>
								<view class="priceline">
									<view class="memberprice" v-if="dish.MemberPrice != dish.Price">
										￥{{ dish.MemberPrice }}
										/ {{ dish.Unit }}
									</view>
									<view class="price del" v-if="dish.MemberPrice != dish.Price">￥{{ dish.Price }} /
										{{ dish.Unit }}
									</view>
									<text class="price" v-if="dish.MemberPrice == dish.Price">￥{{ dish.Price }} /
										{{ dish.Unit }}</text>
								</view>
								<image class="dishtag" v-for="(tag,indext) in dish.DishTags" :key="indext"
									:src="tag.TagImg" />
							</view>
						</view>
						<view style="clear:both"></view>
						<view class="remark"
							v-if="dish.BaseNumber != 1 || dish.Describe||dish.IsWeigh==1||dish.ShowSalesVolume==1">
							<text class="weighdish" v-if="dish.IsWeigh==1">[ 称重菜品 ]</text>
							<text v-if="dish.BaseNumber!=1">[{{ dish.BaseNumber}}{{ dish.Unit}}起点]</text>
							<text v-if="dish.ShowSalesVolume==1">[销量：{{dish.BaseSalesVolume}}]</text>
							<view>{{ dish.Describe }}</view>
						</view>
						<!-- Start 加减 -->
						<view class="oreration"
							v-if="dish.SellOut == 0 && ((!dish.DishFlavors||dish.DishFlavors.length==0) && (!dish.DishMakeMethods||dish.DishMakeMethods.length==0))">
							<transition name="move">
								<view class="cart-decrease" v-show="dish.Number > 0"
									@click.stop.prevent="TakeCart(null,5,dish, false)">
									<view class="inner icon-remove_circle_outline jian">
										<iconfont class="iconfont" icon="iconjianhao" />
									</view>
								</view>
							</transition>
							<view class="number" v-show="dish.Number > 0">{{dish.Number == null ? 0 : dish.Number}}
							</view>
							<view class="jia" @click.stop.prevent="TakeCart($event,6,dish, true)"><i
									class="iconfont iconjiajianzujianjiahao"></i></view>
						</view>
						<!-- End 加减 -->
						<!-- Start 多规格 -->
						<view class="oreration"
							v-if="dish.SellOut == 0 && ((dish.DishFlavors&&dish.DishFlavors.length>0) || (dish.DishMakeMethods&&dish.DishMakeMethods.length>0))">
							<view class="doflavor" @click="DoFlavor(dish)"><i
									class="iconfont iconjiajianzujianjiahao"></i> 选规格
								<!-- <span class="number" size="small" >{{dish.Number}}</span> -->
								<text class="number" size="small" v-show="dish.Number > 0">{{dish.Number}}</text>
							</view>

						</view>
						<!-- End 多规格 -->
						<view class="oreration" v-if="dish.SellOut == 1 || dish.SellOutOnLine == 1">
							售罄
						</view>
					</view>
				</view>
			</view>
			<!-- <div v-for="(dish,index) in SearchResult" :key="'result'+index">{{dish.DishName}}

      </div> -->
		</view>

		<view class="dishtype-tab menu" ref="menu">
			<view>
				<view v-for="(item, index) in DishMenu" :key="index" :class="{ active: currenti === index }"
					@click="SelectMenu(index)" v-show="item.Dishs.length > 0">
					<view class="text">{{ item.DishTypeName }}</view>
					<view class="number" size="small" v-show="item.Number > 0">{{item.Number}}</view>
				</view>
			</view>
		</view>
		<view class="storedeskinfo">
			<iconfont class="iconfont  " icon="icon-jiudiancanting-13" />
			{{Store.StoreName}}<br>{{Desk?Desk.DeskName:''}}
		</view>
		<view class="typename typenamefixed" v-if="DishMenu.length>0">
			{{ DishMenu[currenti].DishTypeName }}
		</view>
		<view class="dish-tab" ref="dishs">
			<view>
				<view v-for="(type, index_t) in DishMenu" :key="index_t" class="dish-type-item"
					v-show="type.Dishs.length > 0">
					<view class="typename">{{ type.DishTypeName }}</view>
					<view class="dishul">
						<view class="dishli" :class="dish.Picture ? 'showpic' : 'nopic'"
							v-for="(dish, index_d) in type.Dishs" :key="index_d">
							<view class="bg">
								<view class="dish">
									<view class="dishpic" v-lazy:background-image="dish.Picture" v-if="dish.Picture"
										@click="DoFlavor(dish)">
									</view>
									<view class="dishinfo">
										<view class="dishname" v-if="!dish.Picture">
											<image class="dishtag" v-for="(tag,indext) in dish.DishTags" :key="indext"
												:src="tag.TagImg" />{{ dish.DishName }}
										</view>
										<view class="dishname" v-else>{{ dish.DishName }}</view>
										<view class="priceline">
											<view class="memberprice" v-if="dish.MemberPrice != dish.Price">
												￥{{ dish.MemberPrice }} / {{ dish.Unit }}
											</view>
											<view class="price del" v-if="dish.MemberPrice != dish.Price">
												￥{{ dish.Price }}
												/ {{ dish.Unit }}
											</view>
											<text class="price" v-if="dish.MemberPrice == dish.Price">￥{{ dish.Price }}
												/ {{ dish.Unit }}</text>
										</view>
										<image class="dishtag" v-for="(tag,indext) in dish.DishTags" :key="indext"
											:src="tag.TagImg" />
									</view>
								</view>
								<view style="clear:both"></view>
								<view class="remark"
									v-if="dish.BaseNumber != 1 || dish.Describe||dish.IsWeigh==1||dish.ShowSalesVolume==1">
									<text class="weighdish" v-if="dish.IsWeigh==1">[ 称重菜品 ]</text>
									<text v-if="dish.BaseNumber!=1">[{{ dish.BaseNumber}}{{ dish.Unit}}起点]</text>
									<text v-if="dish.ShowSalesVolume==1">[销量：{{dish.BaseSalesVolume}}]</text>
									<view>{{ dish.Describe }}</view>
								</view>
								<!-- Start 加减 -->
								<view class="oreration"
									v-if="dish.SellOut == 0 && ((!dish.DishFlavors||dish.DishFlavors.length==0) && (!dish.DishMakeMethods||dish.DishMakeMethods.length==0))">
									<transition name="move">
										<view class="cart-decrease" v-show="dish.Number > 0"
											@click.stop.prevent="TakeCart(null,5,dish, false)">
											<view class="inner icon-remove_circle_outline jian">
												<iconfont class="iconfont" icon="iconjianhao" />
											</view>
										</view>
									</transition>
									<view class="number" v-show="dish.Number > 0">
										{{dish.Number == null ? 0 : dish.Number}}
									</view>
									<view class="jia" @click.stop.prevent="TakeCart($event,6,dish, true)">
										<iconfont class="iconfont " icon="iconjiajianzujianjiahao" />
									</view>
								</view>
								<!-- End 加减 -->
								<!-- Start 多规格 -->
								<view class="oreration"
									v-if="dish.SellOut == 0 && ((dish.DishFlavors&&dish.DishFlavors.length>0) || (dish.DishMakeMethods&&dish.DishMakeMethods.length>0))">
									<view class="doflavor" @click="DoFlavor(dish)">
										<iconfont class="iconfont " icon="iconjiajianzujianjiahao" /> 选规格
										<!-- <span class="number" size="small" >{{dish.Number}}</span> -->
										<text class="number" size="small"
											v-show="dish.Number > 0">{{dish.Number}}</text>
									</view>

								</view>
								<!-- End 多规格 -->
								<view class="oreration" v-if="dish.SellOut == 1 || dish.SellOutOnLine == 1">
									售罄
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="height:100px;"></view>

			</view>
		</view>
		<view class="shop-cart " :class="{ active: OpenCart,disabled:OrderDishCount==0 }">
			<transition name="fadeInUp">
				<view class="shop-cart-list" v-show="OpenCart">
					<view class="title-box">
						<view class="title">购物车</view>
						<view class="clear">
							<view class="text" @click="clearpopup = true">清除全部</p>
							</view>
						</view>
						<view class="list" v-if="EditingOrder">
							<view v-for="(dish, index) in EditingOrder.Items" :key="index">
								<view class="dishpic" v-lazy:background-image="dish.Picture" v-if="dish.Picture"></view>
								<view class="dishinfo">
									<view class="title">{{ dish.DishName }}</view>
									<view class="flavorinfo">{{DishFlavorStr(dish)}}</view>
									<text class="memberprice"
										v-if="dish.MemberPrice!=dish.DishPrice">￥{{ dish.MemberPrice }}/{{ dish.Unit }}</text>
									<text class="price del"
										v-if="dish.MemberPrice!=dish.DishPrice">￥{{ dish.DishPrice }}/{{ dish.Unit }}</text>
									<text class="price"
										v-if="dish.MemberPrice==dish.DishPrice">￥{{ dish.MemberPrice }}/{{ dish.Unit }}</text>
								</view>
								<view class="cartcontrol">
									<view class="cart-decrease" @click.stop.prevent="TakeCart(null,7,dish, false)">
										<i class="iconfont " icon="iconjianhao" />
									</view>
									<view class="cart-count">{{ dish.Number }}</view>
									<view class="cart-add icon-add_circle"
										@click.stop.prevent="TakeCart(null,8,dish, true)">
										<iconfont class="iconfont " icon="iconjiajianzujianjiahao" />
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</transition>
			<view class="opera">
				<view class="cart" @click="OpenCart=!OpenCart">
					<text class="iconfont"></text>
					<text class="number" size="small"
						v-show="OrderDishCount > 0 && !HiddenOrderAmount">{{OrderDishCount}}</text>
				</view>
				<view class="total" v-if="OrderDishCount==0">请选择菜品</view>
				<view class="total" v-else-if="HiddenOrderAmount&&FCClickTimes<10" @click="ClickOnFC">
					{{ OrderDishCount }} 份
				</view>
				<view class="total" v-else>{{ OrderDishCount }} 份，￥{{ OrderAmount }}</view>
				<view class="goput" @click="OpenFlavorPopup">去下单</view>
				<transition name="fadeInUp">
					<view class="shop-cart-bg" v-show="OpenCart" @click="OpenCart=false"></view>
				</transition>
			</view>
		</view>
		<!-- 弹窗广告 -->
		<!-- <transition name="fade">
			<view class="diner-num" v-show="aleatPictureShow" @click="aleatPictureShow=false">
				<swiper :interval="4000" :autoplay="true">
					<swiper-item v-for="item in Banner.DishMenuAleatPicture" :key="item">
						<image :src="item" />
					</swiper-item>
				</swiper>
			</view>
		</transition> -->
		<!-- 选择人数 -->
		<uni-transition mode-class="fade" :show="ShowPerson&&!aleatPictureShow">
			<view class="diner-num" v-show="ShowPerson&&!aleatPictureShow">
				<view class="diner-num-cot">
					<view class="title">请选择就餐人数</view>
					<view class="clearfix">

						<view v-for="(item, index) in PersonOptionCount" class="diner-select-people"
							:class="{ active: Person === item }" :key="index" @click="SelectPeopleNumber(item)">
							<view class="cot">{{ item }}</view>
						</view>
						<!-- <li v-if="PersonOptionCount==19" @click="SelectPeopleNumber(20)" :class="{ active: Person === 20 }"><div class="cot">20</div></li> -->
						<view class="diner-select-people">
							<div class="cot" @click="PersonOptionCount=20">更多</div>
						</view>
						</ul>
						<!-- <ul class="clearfix">
            <li
              v-for="(item, index) in dinerNumList"
              :class="{ active: Person === item }"
              :key="index"
              @click="SelectPeopleNumber(item)"
            >
              <div class="cot">{{ item }}</div>
            </li>
            <li><div class="cot">更多</div></li>
          </ul> -->
					</view>
					<button type="button" class="confirm" @click="SavePeopleNumber">
						确认
					</button>
				</view>
			</view>
		</uni-transition>

		<!-- 选择口味 -->
		<transition name="fade">
			<view class="flavorpopup" v-show="flavorpopup">
				<view class="popup-cot">
					<view class="title">请选择口味<text
							v-if="BusinessConfig&&BusinessConfig.OrderConfig&&BusinessConfig.OrderConfig.RemarkCanMultiple==1">
							- 多选</text></view>
					<view class="flavor-list">
						<view class="clearfix">
							<view v-for="(item, index) in flavorlist" :key="index"
								:class="item.selected ? 'active' : ''" @click="selectFlavor(index)">
								<view class="item">{{ item.text }}</view>
							</view>
						</view>
					</view>
					<view class="btn-group">
						<view class="list clearfix">
							<view>
								<view class="btn cancle" @click="flavorPopupOut">跳过</view>
							</view>
							<view>
								<view class="btn confirm" @click="flavorPopupConfirm">确认</view>
							</view>
						</view>
					</view>
				</view>
				<view class="bg"></view>
			</view>
		</transition>

		<!-- 清空购物车 -->
		<transition name="fade">
			<view class="clearpopup" v-show="clearpopup">
				<view class="popup-cot">
					<view class="title">提示<view>
							<view class="text">确认要清空购物车吗？</view>
							<view class="btn-group">
								<view class="list clearfix">
									<view>
										<view class="btn cancle" @click="clearpopup = false">取消</view>
									</view>
									<view>
										<view class="btn confirm" @click="DoClear">确认</view>
									</view>
								</view>
							</view>
						</view>
						<view class="bg"></view>
					</view>
				</view>
			</view>
		</transition>

		<!-- 锁定提醒 -->
		<transition name="fade">
			<view class="lockpopup" v-show="lockVisible">
				<view class="popup-cot">
					<view class="title">提示</view>
					<view class="text">
						<image :src="EditingOrder != null ? EditingOrder.SubMemberPicture : ''"
							v-show="EditingOrder != null" class="headimg" />
						“{{ EditingOrder != null ? EditingOrder.SubMemberName : "" }}”
						刚刚锁定了订单！
						<text>\n</text>
						<text>\n</text>
						点击确定跳转并查看信息
					</view>
					<view class="btn-group">
						<view class="list clearfix">
							<view style="width:100%;margin-top:10px;">
								<view class="btn confirm" @click="pushShoppingCart">确认</view>
								<view>
								</view>
							</view>
						</view>
						<view class="bg"></view>
					</view>
				</view>
			</view>
		</transition>

		<!-- 规格做法 -->
		<transition name="fade">
			<view class="doflavorpopup doflavorbox" v-show="editingDish.DishFlavors||editingDish.DishMakeMethods"
				v-if="editingDish">
				<view class="popup-cot" :style="'margin-top:'+DoflavorPopupMarginTop+'%'">
					<view class="picture" v-lazy:background-image="editingDish.Picture" v-if="editingDish.Picture">
					</view>
					<view class="content">
						<view class="title">{{editingDish.DishName}}</view>
						<view class="contentbox"
							v-if="editingDish.DishMakeMethods&&editingDish.DishMakeMethods.length>0||editingDish.DishFlavors&&editingDish.DishFlavors.length>0">
							<view class="minititle"
								v-if="editingDish.DishMakeMethods&&editingDish.DishMakeMethods.length>0&&editingDish.DishFlavors&&editingDish.DishFlavors.length>0">
								做法：{{editingDish.CanMoreChooseMakeMethod?'多选':''}}</view>
							<view class="infobox"
								v-if="editingDish.DishMakeMethods&&editingDish.DishMakeMethods.length>0">
								<view class="infoitem" :class="{selected:item.selected}"
									v-for="item in editingDish.DishMakeMethods" :key="item.MakeMethodName"
									@click="DoFlavorChoiceMakeMethod(item)">
									{{ item.MakeMethodName }}
								</view>
							</view>
							<view class="minititle"
								v-if="editingDish.DishMakeMethods&&editingDish.DishMakeMethods.length>0&&editingDish.DishFlavors&&editingDish.DishFlavors.length>0">
								口味：{{editingDish.CanMoreChooseDishFlavor?'多选':''}}</view>
							<view class="infobox" v-if="editingDish.DishFlavors&&editingDish.DishFlavors.length>0">
								<view class="infoitem" :class="{selected:item.selected}"
									v-for="item in editingDish.DishFlavors" :key="item.FlavorName"
									@click="DoFlavorChoiceFlavor(item)">
									{{ item.FlavorName }}
								</view>
							</view>
						</view>
						<view class="messagebox"
							v-if="editingDish.DishMakeMethods&&editingDish.DishMakeMethods.length>0||editingDish.DishFlavors&&editingDish.DishFlavors.length>0">
							已选规格：<strong>{{DishFlavorStr(editingDish)}}</strong>
						</view>
						<view class="totalbox">售价<view class="totalprice">
								&nbsp;<i>¥</i>{{editingDish.MemberPrice}} /
								{{ editingDish.Unit }}
							</view>
							<view class="sellout" v-if="editingDish.SellOut==1">售罄</view>
							<view class="pushbtn" v-else-if="editingDish.Number==0"
								@click.stop.prevent="TakeCart($event,3,editingDish, true)">
								<iconfont class="iconfont" icon="iconjiajianzujianjiahao" /> 加入购物车
							</view>
							<view class="editnumberbox" v-else>
								<view class="jian" @click.stop.prevent="TakeCart(null,1,editingDish, false)">
									<iconfont class="iconfont" icon="iconjianhao" />
								</view>
								<view class="number">{{editingDish.Number}}</view>
								<view class="jia" @click.stop.prevent="TakeCart($event,2,editingDish, true)">
									<iconfont class="iconfont" icon="iconjiajianzujianjiahao" />
								</view>
							</view>
						</view>
						<view class="closebtn iconfont iconchahao" @click="editingDish=null"></view>
					</view>
				</view>
				<view class="bg"></view>
			</view>
		</transition>

		<!-- 菜品大图 -->
		<transition>
			<view class="showdialogbox" v-if="ShowDish">
				<view class="box">
					<view class="picture" v-lazy:background-image="ShowDish.Picture" v-if="ShowDish.Picture">
						<view>
							<view class="content">
								<view class="title">{{ShowDish.DishName}}</view>
								<view class="totalbox">售价 <view class="totalprice">
										<text¥< /text>{{ShowDish.MemberPrice}} /
											{{ ShowDish.Unit }}
									</view>
									<view class="pushbtn" v-if="ShowDish.SellOut==1">售罄</view>
									<view class="pushbtn" v-else-if="ShowDish.Number==0"
										@click.stop.prevent="TakeCart($event,3,ShowDish, true)">
										<iconfont class="iconfont" icon="iconjiajianzujianjiahao" /> 加入购物车
									</view>
									<view class="editnumberbox" v-else>
										<view class="jian" @click.stop.prevent="TakeCart(null,1,ShowDish, false)">
											<iconfont class="iconfont" icon="iconjianhao" />
										</view>
										<view class="number">{{ShowDish.Number}}</view>
										<view class="jia" @click.stop.prevent="TakeCart($event,2,ShowDish, true)">
											<iconfont class="iconfont" icon="iconjiajianzujianjiahao" />
										</view>
									</view>
								</view>
								<iconfont class="closebtn iconfont" icon="iconchahao" @click="ShowDish=null" />
							</view>
						</view>
					</view>
				</view>
			</view>
		</transition>

		<view class="barragesBox">
			<view class="barrageitemline" v-for="(bitem) in marqueeMsgs" :key="bitem.id" v-show="bitem.show">
				<view class="barrageitem">
					<image class="head" :src="bitem.avatar" />
					<view class="info">{{bitem.msg}}</view>
				</view>
			</view>
		</view>


		<view class="ball-container">
			<!--小球-->
			<view v-for="(ball, index) in balls" :key="index">
				<transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
					<view class="ball" v-show="ball.show">
						<view class="inneryq inner-hook"></view>
					</view>
				</transition>
				<view>
				</view>
			</view>
		</view>
		<!--购物车小球-->
		<view>
			<button @click="additem" class="shop">按钮</button>
			<view class="cart">{{ rednum }}</view>
			<view class="ball-container">
				<!--小球-->
				<view v-for="(ball, index) in balls" :key="index">
					<transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
						<view class="ball" v-show="ball.show">
							<view class="inner inner-hook"></view>
						</view>
					</transition>
				</view>
			</view>
		</view>
	</view>
</template>
<style scoped>
	.bannerimgitem {
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center
	}

	.barragesBox {
		position: fixed;
		left: 60px;
		bottom: 70px;
		max-height: 160px;
		min-height: 100px;
		background-color: #00000020;
	}

	/* .barragesBox{border: 1px solid red;} */
	.barragesBox .barrageitemline {
		margin-bottom: 5px;
		animation: barragelineanimation 5s;
		height: 26px;
	}

	.barragesBox .barrageitem {
		border-radius: 13px;
		background-color: #000000dd;
		padding-right: 12px;
		height: 26px;
		display: inline-block;
		vertical-align: -webkit-baseline-middle;
		position: relative;
		animation: barrageanimation 5s;
	}

	.barragesBox .barrageitem .info {
		display: inline-block;
		margin-left: 28px;
		color: #fff;
		font-size: 12px;
		line-height: 26px;
		height: 26px;
	}

	.barragesBox .barrageitem .head {
		display: inline-block;
		vertical-align: bottom;
		border-radius: 50%;
		background: url(http://thirdwx.qlogo.cn/mmopen/CLl4mibwkPX4vc4JoBbicJib0xicG95gD408FVLcL4BOzZruRyrGgk8ujHgEXUhw4aJrwoerOJCgMbWEy4YkCR2vloBsvZev1IhP/132) no-repeat center;
		background-size: contain;
		width: 20px;
		height: 20px;
		position: absolute;
		left: 3px;
		top: 3px;
	}

	@keyframes barragelineanimation {
		0% {
			opacity: 0;
			margin-top: -31px;
			margin-left: 0px;
		}

		5%,
		50% {
			opacity: 1;
			margin-top: 0px;
			margin-left: 0px;
		}

		60%,
		65% {
			opacity: 0;
		}

		75%,
		100% {
			opacity: 0;
			margin-top: -31px;
		}
	}

	@keyframes barrageanimation {

		0%,
		50% {
			opacity: 1;
			margin-top: 0px;
			margin-left: 0px;
		}

		60%,
		100% {
			opacity: 0;
			margin-top: 0px;
			margin-left: -50px;
		}
	}
</style>

<script>
	import Vue from "vue";
	import moment from "moment";
	import {
		mapActions,
		mapGetters
	} from "vuex";
	import BScroll from "better-scroll"; // 导入滚动类库
	import {
		LoadDishMenu,
		GetEditingOrder,
		GetBill,
		CreateOrder,
		AddDish,
		BackDish,
		ChangePeopleNumber,
		ChangeRemark,
		GeteTidings,
		ClearDish,
		ChangeDesk
	} from "@/api/tsorder";

	// Vue.use(vueBaberrage);
	export default {
		name: "DishMenu",
		data() {
			return {
				DeskID: '',

				Banner: {
					// DishMenuAleatPicture: [
					// 	"http://localhost:8000/api//FileRoot/AdsensePic/2021/4/11c76689-833d-4858-937d-b18f01c644f2.jpg",
					// 	"http://localhost:8000/api//FileRoot/AdsensePic/2021/4/828761e6-d264-453d-8f57-b25c5862ab59.jpg"
					// ]
				}, //广告
				aleatPictureShow: false,
				BillID: "",
				StoreCode: null,
				AddDish: false, // 加菜模式标记
				EditingOrder: null,
				EditingBill: null,
				editingDish: null,
				RemarkTextarea: "",
				DishMenu: [],
				shopcart: {
					total: 0,
					totalnum: 0,
					show: false,
					dishs: []
				}, // 购物车
				clearpopup: false, // 清空购物车弹窗
				ShowPerson: false, // 是否显示选择用餐人数
				PersonOptionCount: 11,
				dinerNumList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // 就餐人数数组
				Person: 0, // 就餐人数结果
				flavorpopup: false, // 是否显示口味弹窗
				flavorlist: [], // 口味列表
				scrollY: 0, // 当期滚动的高度
				listHeight: [], // 用来存放右侧每一个分类/li的商品高度
				Tidings: [], // 订单消息
				AllDishs: [],
				lockVisible: false, //订单锁定弹窗
				puted: false, //订单锁定状态
				loadTidingOverTime: null, //拼单侦听结束时间，避免无休止侦听
				doflavorVisible: false, // 选择规格弹窗

				marqueeMsgs: [],

				ListeningObj: null,

				LoadingNumber: 0,

				FCClickTimes: 0,
				SearchKey: '',
				SearchState: false,

				ShowDish: null,

				OpenCart: false, // 购物车展示


				// 点击数量
				rednum: 0,
				balls: [
					//小球 设为3个 使用balls存放小球，这些小球的默认状态都是不显示的
					{
						show: false
					},
				],
				dropBalls: [], // 用dropBalls来存放掉落的小球
				queryDom: null, // 存放小程序获取某个dom节点对象
			};
		},
		computed: {
			...mapGetters(["Member", "MemberCode", "Store", "BusinessConfig", "Desk"]),
			// 滚动左侧选中
			currenti() {
				var index = 0;
				for (let i = 0; i < this.listHeight.length; i++) {
					if (this.scrollY + 34 >= this.listHeight[i]) {
						index = i;
					} else {
						return index;
					}
				}
				return index;
			},
			HiddenOrderAmount() {
				if (this.BusinessConfig && this.BusinessConfig.OrderConfig && this.BusinessConfig.OrderConfig
					.HiddenOrderAmount) {
					return true;
				}
				return false;
			},
			SearchResult() {
				var Dishs = [];
				this.DishMenu.forEach(type => {
					Dishs = Dishs.concat(type.Dishs.filter(a => a.DishName.indexOf(this.SearchKey) >= 0));
				});
				return Dishs;
			},
			DoflavorPopupMarginTop() {
				var top = -50;
				if (this.editingDish) {
					if (this.editingDish.Picture) {
						top -= 20;
					}
					if (this.editingDish.DishMakeMethods && this.editingDish.DishMakeMethods.length > 0) {
						top -= 10;
					}
					if (this.editingDish.DishFlavors && this.editingDish.DishFlavors.length > 0) {
						top -= 10;
					}
				}
				return top;
			},
			// 订单菜品数量
			OrderDishCount() {
				var DishCount = 0;
				if (this.EditingOrder) {
					this.EditingOrder.Items.forEach(item => {
						DishCount += item.Number;
					});
				};
				return parseInt(DishCount * 100) / 100;
			},
			// 订单金额
			OrderAmount() {
				var Amount = 0;
				if (this.EditingOrder) {
					this.EditingOrder.Items.forEach(item => {
						Amount += item.Number * item.MemberPrice;
					});
				};
				return parseInt(Amount * 100) / 100;
			},
			DeskUnState() {
				return this.DeskID && !this.Desk;
			},
		},
		mounted() {
			this.LoadingNumber++;
			this.StoreCode = this.$store.getters.StoreCode;
			// this.AddDish = this.$route.query.AddDish;
			// this.Person = this.$route.query.Person;
			this.DeskID = this.$getStorage("DeskID")?.value;
			console.log("DeskID", this.DeskID, this.$getStorage("DeskID"));
			if (this.$getUrlQuery().options.StoreCode && this.$getUrlQuery().options.StoreCode != this.StoreCode) {
				this.StoreCode = this.$getUrlQuery().options.StoreCode;
				this.$setStorage("StoreCode", this.StoreCode);
				this.$removeStorage("DeskID");
				this.$store.commit('set_Desk', null);
			}

			// if (this.MemberCode == null) {
			//   this.PushErrorPage({ state: 405, msg: "访问超时，请关闭页面后重新进入！001" });
			// }
			this.LoadingNumber++;
			this.NeedMember(this).then(res => {
					console.log('this.StoreCode', this.StoreCode);
					// if (!this.StoreCode) {
					// 	uni.navigateTo({
					// 		url: '/pages/index/index'
					// 	})
					// 	return;
					// }
					this.LoadingNumber++;
					this.NeedStore(this).then(res => {
							console.log('--------------------------------');
							console.log(res)
							const Store = res.data;
							console.log(Store.BusinessCode, this.Member.BusinessCode);
							// if (Store.BusinessCode != this.Member.BusinessCode) {
							// 	this.$removeStorage("StoreCode");
							// 	uni.navigateTo({
							// 		url: '/pages/index/index'
							// 	})
							// 	return;
							// }
							this.LoadingNumber++;
							GetEditingOrder({
									MemberCode: this.MemberCode,
									StoreCode: this.StoreCode,
									DeskID: this.DeskID
								}).then(res => {
									console.log(res)
									if (res.state != 200) {
										uni.showToast({
											title: "网络错误，请稍后再试",
											icon: 'none',
											duration: 3000
										});
										return;
									}
									this.EditingOrder = res.data;
									// 已有进行中的订单
									if (this.EditingOrder && this.EditingOrder.Items.length > 0) {
										console.info("正在点餐，继续点餐");
										this.OrderStart();
									}
									// 是否执行加菜
									else if (this.AddDish) {
										console.info("加菜，创建订单");
										this.OrderStart();
									} else {
										// 判断是否正在消费
										this.LoadingNumber++;
										GetBill({
												MemberCode: this.MemberCode,
												DeskID: this.DeskID
											}).then(res => {
												if (res.state != 200) {
													uni.showToast({
														title: "网络错误，请稍后再试",
														icon: 'none',
														duration: 3000
													});
													return;
												}
												this.EditingBill = res.data;
												if (this.EditingBill != null) {
													this.$router.push({
														name: "OrderInfo",
														params: {
															EditingBill: this.EditingBill
														},
														query: {
															Ver: moment().format("MMDDHHmmSS")
														}
													});
												} else {
													console.info("初次点餐，创建订单");
													this.OrderStart();
												}
											})
											.catch(res => {
												res.state = 497;
												console.error("GetBill.catch", res);
												uni.showToast({
													title: "网络错误，请稍后再试",
													icon: 'none',
													duration: 3000
												});
												return;
											})
											.finally(res => {
												this.LoadingNumber--;
											});
									}
								})
								.catch(res => {
									res.state = 498;
									console.log("GetEditingOrder.catch", res);
									uni.showToast({
										title: "网络错误，请稍后再试",
										icon: 'none',
										duration: 3000
									});
									return;
								})
								.finally(res => {
									this.LoadingNumber--;
								});
						})
						.finally(res => {
							this.LoadingNumber--;
						});
				})
				.finally(res => {
					this.InitFlavorList();
					this.LoadingNumber--;
				});
			this.LoadingNumber--;
			// 弹窗广告
			// if (this.BusinessConfig.AdsenseConfig && this.BusinessConfig.AdsenseConfig.DishMenuAleatPicture.length > 0) {
			// 	this.Banner.DishMenuAleatPicture = this.BusinessConfig.AdsenseConfig.DishMenuAleatPicture;
			// 	this.aleatPictureShow = true;
			// }
		},
		beforeDestroy() {
			// clearInterval(this.ListeningObj);
		},
		// mounted () {
		//   console.info('Member',this.Member);
		// },
		methods: {
			...mapActions(["NeedStore", "NeedMember", "NeedDesk"]),
			OrderStart() {
				if (!this.EditingOrder) {
					this.OrderCreate();
				} else {
					// 更新台码，人数
					if (this.DeskID != this.EditingOrder.DeskID) {
						this.LoadingNumber++;
						ChangeDesk({
							OrderCode: this.EditingOrder.OrderCode,
							DeskID: this.DeskID,
							DeskName: this.Desk.DeskName
						}).then(res => {
							this.EditingOrder.DeskID = this.DeskID;
							this.EditingOrder.DeskName = this.Desk.DeskName;
							this.EditingOrder.DeskCode = this.Desk.DeskCode;
						}).finally(res => {
							this.LoadingNumber--;
						});
					}
					if (this.Person && this.EditingOrder.Person != this.Person) {
						this.SavePeopleNumber();
					} else if (this.EditingOrder.Person == 0) {
						this.ShowPerson = true;
					}
					this.InitView();
				}
			},
			OrderCreate() {
				this.LoadingNumber++;
				this.NeedStore().then(res => {
					var Store = res.data;
					var parameter = {};
					parameter.StoreCode = Store.StoreCode;
					parameter.CreateMemberCode = this.MemberCode;
					parameter.DeskID = this.DeskID;
					parameter.Person = this.Person;
					parameter.Remark = "";
					this.LoadingNumber++;
					CreateOrder(parameter).then(res => {
							if (res.state == 200) {
								this.EditingOrder = res.data;
								if (!this.Person || this.Person == 0) {
									this.ShowPerson = true;
								}
								this.InitView();
							} else {
								uni.showToast({
									title: "网络错误，请稍后再试",
									icon: 'none',
									duration: 3000
								});
								return;
							}
						})
						.catch(res => {
							uni.showToast({
								title: "网络错误，请稍后再试",
								icon: 'none',
								duration: 3000
							});
							return;
						})
						.finally(res => {
							this.LoadingNumber--;
						});

				}).finally(res => {
					this.LoadingNumber--;
				});
			},
			// 初始化点餐单
			InitView() {
				this.LoadDishMenu();
			},
			// 初始化滚动
			InitScroll() {
				this.queryDom = uni.createSelectorQuery().in(this)
				console.log(this.queryDom.select('.menu.dishtype-tab'))
				this.queryDom.select('.menu.dishtype-tab').context(res => {
					console.log(res);
				}).exec()
				this.menuScroll = new BScroll(this.queryDom.select('.menu.dishtype-tab'), {
					click: true // 一开始的点击事件被bscroll阻止了，设置这个才能点击
				});
				this.dishsScroll = new BScroll(this.queryDom.select('.dishs'), {
					click: true, // 一开始的点击事件被bscroll阻止了，设置这个才能点击
					probeType: 3 // 获取实时滚动的位置，详见bscroll API
				});
				this.dishsScroll.on("scroll", pos => {
					this.scrollY = Math.abs(Math.round(pos.y)); // 四舍五入得到的y值
				});
			},
			// 计算高度
			CalculateHeight() {
				// 获取右侧一个商品的整个li，一个li里面包含了该分类下的所有商品
				let foodList = this.$refs.dishs.getElementsByClassName("dish-type-item");
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < foodList.length; i++) {
					let item = foodList[i];
					height += item.clientHeight; // 获取每一个li的可视区域的高度
					this.listHeight.push(height); // 这样就得到了每一个商品分类下的所有商品对应的高度
				}
			},
			// 加载菜单
			LoadDishMenu() {
				this.LoadingNumber++;
				this.NeedStore().then(res => {
					var Store = res.data;
					var parameter = {};
					parameter.StoreCode = Store.StoreCode;
					parameter.MemberCode = this.MemberCode;
					this.LoadingNumber++;
					LoadDishMenu(parameter).then(res => {
							if (res.state == 200) {
								if (!res.data) {
									res.data = [];
								}
								res.data.forEach((type, DishTypeIndex) => {
									type.index = DishTypeIndex;
									type.Dishs.forEach((dish, DishIndex) => {
										dish.DishTypeIndex = DishTypeIndex;
										dish.DishIndex = DishIndex;
										dish.Describe = dish.Remark;
										dish.Remark = "";
										if (!dish.DishMakeMethods) {
											dish.DishMakeMethods = []
										}
										if (!dish.DishFlavors) {
											dish.DishFlavors = []
										}
										this.AllDishs.push(dish);
									});
								});
								this.DishMenu = res.data;

								if (this.EditingOrder != null) {
									this.EditingOrder.Items.forEach(orderdish => {
										var type = this.DishMenu.find(type => type.DishTypeID ==
											orderdish.DishTypeID);
										if (type) {
											var dish = type.Dishs.find(dish => dish.DishID == orderdish
												.DishID);
											if (dish) {
												dish.Number = dish.Number + orderdish.Number;
												orderdish.Picture = dish.Picture;
												orderdish.DishMakeMethods = JSON.parse(JSON.stringify(
													dish.DishMakeMethods));
												orderdish.DishMakeMethods.forEach(item => {
													item.selected = orderdish.MakeMethods
														.indexOf(item.MakeMethodName) != -1;
												});
												orderdish.DishFlavors = JSON.parse(JSON.stringify(dish
													.DishFlavors));
												orderdish.DishFlavors.forEach(item => {
													item.selected = orderdish.Flavors.indexOf(
														item.FlavorName) != -1;
												});
												orderdish.DishSource = dish;
											}
										}
									});
								}
								this.$nextTick(() => {
									// 初始化滚动
									this.InitScroll();
									// 计算高度，用于识别页面滚动状态识别选择菜类
									this.CalculateHeight();
									// 初始化购物车
									this.InitDishTypeTakeCount();
								});
							} else {
								console.error("LoadDishMenu.res", res);
							}
						})
						.catch(res => {
							console.error("LoadDishMenu.catch", res);
						}).finally(res => {
							this.LoadingNumber--;
						});
				}).finally(res => {
					this.LoadingNumber--;
				});
			},
			// 口味
			InitFlavorList() {
				if (this.BusinessConfig && this.BusinessConfig.OrderConfig && this.BusinessConfig.OrderConfig
					.RemarkItems) {
					this.flavorlist = [];
					this.BusinessConfig.OrderConfig.RemarkItems.forEach((item, index) => {
						this.flavorlist.push({
							text: item,
							selected: index == 0
						});
					});
				};
			},
			// 初始化菜类菜品数量
			InitDishTypeTakeCount() {
				for (let i = 0; i < this.DishMenu.length; i++) {
					this.TakeDishTypeTakeCount(i);
				}
			},
			// 计算菜类选择菜品数量
			TakeDishTypeTakeCount(ti) {
				let Count = 0;
				this.DishMenu[ti].Dishs.forEach(dish => {
					Count += dish.Number * 100;
				});
				this.DishMenu[ti].Number = parseInt(Count) / 100;
			},
			// 点击选择分类
			SelectMenu(index) {
				let foodList = this.queryDom.select(".dish-type-item");
				let el = foodList[index]; // 滚动到响应的元素
				this.dishsScroll.scrollToElement(el, 300);
			},
			// 选择规格
			DoFlavor(dish) {
				if (dish.DishMakeMethods.length > 0 || dish.DishFlavors.length > 0) {
					dish.DishFlavors.forEach((flavor, index) => {
						flavor.selected = index == 0 ? true : false;
					});
					dish.DishMakeMethods.forEach((method, index) => {
						method.selected = index == 0 ? true : false;
					});
					this.editingDish = JSON.parse(JSON.stringify(dish));
					this.editingDish.DishSource = dish;
					this.editingDish.Number = 0;
					console.log(3333)
				} else {
					console.log(4444)
					this.editingDish = dish;
				}
			},
			// 选择口味
			DoFlavorChoiceFlavor(flavor) {
				var DishSource = this.editingDish.DishSource;
				this.editingDish = JSON.parse(JSON.stringify(this.editingDish));
				this.editingDish.DishSource = DishSource;
				if (this.editingDish.CanMoreChooseDishFlavor == 0) {
					this.editingDish.DishFlavors.forEach(item => {
						item.selected = false;
					});
					this.editingDish.DishFlavors.filter(a => a.FlavorName == flavor.FlavorName).forEach(item => {
						item.selected = true;
					});
				} else {
					this.editingDish.DishFlavors.filter(a => a.FlavorName == flavor.FlavorName).forEach(item => {
						item.selected = !item.selected;
					});
				}
				this.editingDish.Number = 0;
			},
			// 选择做法
			DoFlavorChoiceMakeMethod(method) {
				var DishSource = this.editingDish.DishSource;
				this.editingDish = JSON.parse(JSON.stringify(this.editingDish));
				this.editingDish.DishSource = DishSource;
				if (this.editingDish.CanMoreChooseMakeMethod == 0) {
					this.editingDish.DishMakeMethods.forEach(item => {
						item.selected = false;
					});
					this.editingDish.DishMakeMethods.filter(a => a.MakeMethodName == method.MakeMethodName).forEach(
						item => {
							item.selected = true;
						});
				} else {
					this.editingDish.DishMakeMethods.filter(a => a.MakeMethodName == method.MakeMethodName).forEach(
						item => {
							item.selected = !item.selected;
						});
				}
				this.editingDish.Number = 0;
			},
			// 已选规格
			DishFlavorStr(dish) {
				var FlavorState = "";
				if (dish.DishMakeMethods) {
					dish.DishMakeMethods.filter(a => a.selected).forEach(item => {
						FlavorState = FlavorState + (FlavorState.length > 0 ? '、' : '') + item.MakeMethodName;
					});
				}
				if (dish.DishFlavors) {
					dish.DishFlavors.filter(a => a.selected).forEach(item => {
						FlavorState = FlavorState + (FlavorState.length > 0 ? '、' : '') + item.FlavorName;
					});
				}
				return FlavorState;
			},
			// 加减菜品
			TakeCart(dom, tag, dish, IsAdd, number = 0, commit = true) {
				console.log('TakeCart', dom, tag, dish, IsAdd, number, commit);
				if (dom) {
					this.additem(dom.target);
				}
				// 已有选择菜品项
				var DItem = null;
				var TakeNumber = 0;
				if (IsAdd) {
					if (dish.Number == 0) {
						TakeNumber = dish.BaseNumber;
					} else {
						TakeNumber = dish.AppendNumber;
					}
				} else {
					if (dish.Number - dish.AppendNumber < dish.BaseNumber) {
						TakeNumber = 0 - dish.Number;
					} else {
						TakeNumber = 0 - dish.AppendNumber;
					}
				}

				// 多规格模式菜品
				if (dish.DishMakeMethods && dish.DishMakeMethods.length > 0 || dish.DishFlavors && dish.DishFlavors
					.length > 0) {
					dish.MakeMethods = "";
					dish.Flavors = "";
					dish.SelectedMakeMethods = dish.DishMakeMethods.filter(a => a.selected)
					dish.SelectedDishFlavors = dish.DishFlavors.filter(a => a.selected)
					dish.SelectedMakeMethods.forEach(item => {
						dish.MakeMethods = dish.MakeMethods + (dish.MakeMethods.length > 0 ? '、' : '') + item
							.MakeMethodName;
					});
					dish.SelectedDishFlavors.forEach(item => {
						dish.Flavors = dish.Flavors + (dish.Flavors.length > 0 ? '、' : '') + item.FlavorName;
					});
					DItem = this.EditingOrder.Items.find(d => d.DishID == dish.DishID && d.MakeMethods == dish
						.MakeMethods && d.Flavors == dish.Flavors);
					console.log('DItem', DItem)
					if (!DItem) {
						DItem = JSON.parse(JSON.stringify(dish));
						DItem.DishSource = dish.DishSource;
						this.EditingOrder.Items.push(DItem);
					} else {

					}
					dish.Number += TakeNumber;

				} else {
					DItem = this.EditingOrder.Items.find(d => d.DishID == dish.DishID);
				}
				// 非购物车加减菜品
				if (!DItem) {
					console.log(111111);
					DItem = JSON.parse(JSON.stringify(dish));
					if (dish.DishMakeMethods && dish.DishMakeMethods.length > 0 || dish.DishFlavors && dish.DishFlavors
						.length > 0) {
						DItem.DishSource = dish.DishSource;
					} else {
						DItem.DishSource = dish;
					}
					this.EditingOrder.Items.push(DItem);
				}
				console.log(2222222);
				DItem.Number += TakeNumber;
				DItem.DishSource.Number += TakeNumber;

				this.EditingOrder.Items = this.EditingOrder.Items.filter(a => a.Number -= 0);
				if (this.EditingOrder.Items.length == 0) {
					this.OpenCart = false;
				}
				// 更新分类计算
				this.TakeDishTypeTakeCount(DItem.DishSource.DishTypeIndex);

				if (commit) {
					this.$nextTick(() => {
						// 同步到服务器
						var parameter = {};
						parameter.OrderCode = this.EditingOrder.OrderCode;
						parameter.MemberCode = this.MemberCode;
						parameter.DishCode = DItem.DishCode;
						parameter.DishID = DItem.DishID;
						parameter.DishTypeID = DItem.DishTypeID;
						parameter.MakeMethods = DItem.MakeMethods;
						parameter.Flavors = DItem.Flavors;
						parameter.ToNumber = DItem.DishSource.Number;
						parameter.Unit = DItem.Unit;
						parameter.DishName = DItem.DishName;
						parameter.DishPrice = DItem.DishPrice;
						parameter.MemberPrice = DItem.MemberPrice;
						parameter.BaseNumber = DItem.BaseNumber;
						parameter.AppendNumber = DItem.AppendNumber;
						parameter.DishCode = DItem.DishCode;
						parameter.DishTypeName = DItem.DishTypeName;
						if (IsAdd) {
							parameter.AddNumber = TakeNumber;
							AddDish(parameter)
								.then(res => {
									if (res.state == 200) {} else {
										console.log("AddDish.error----------", res);
									}
								})
								.catch(res => {
									console.log("AddDish.catch", res);
								});
						} else {
							parameter.BackNumber = 0 - TakeNumber;
							BackDish(parameter)
								.then(res => {
									if (res.state == 200) {
										console.log("BackDish.ok", res);
									} else {
										console.log("BackDish.error----------", res);
									}
								})
								.catch(res => {
									console.log("BackDish.catch", res);
								});
						}
					});
				}
			},

			DoClear() {
				var parameter = {};
				parameter.OrderCode = this.EditingOrder.OrderCode;
				parameter.MemberCode = this.MemberCode;
				ClearDish(parameter)
					.then(res => {
						if (res.state == 200) {
							this.ClearShopcart();
						} else {
							console.error("ClearDish.error", res);
						}
					})
					.catch(res => {
						console.error("ClearDish.catch", res);
					});
			},
			// 清理购物车缓存
			ClearShopcart() {
				this.EditingOrder.Items.forEach(item => {
					item.DishSource.Number = 0;
				});
				this.EditingOrder.Items = [];
				this.DishMenu.forEach((DType, i) => {
					this.TakeDishTypeTakeCount(i);
				});
				this.OpenCart = false;
				this.clearpopup = false;
			},
			// 选择用餐人数
			SelectPeopleNumber(value) {
				this.Person = value;
			},
			// 确认用餐人数
			SavePeopleNumber() {
				if (!this.Person || this.Person == 0) {
					uni.showToast({
						title: "您还没有选择人数呦！😀",
						icon: 'none',
						duration: 3000
					});
					return;
				}
				ChangePeopleNumber({
						OrderCode: this.EditingOrder.OrderCode,
						Person: Number(this.Person) ? this.Person : 0
					})
					.then(res => {
						if (res.state == 200) {
							this.EditingOrder.Person = Number(this.Person) ? this.Person : 0;
							Vue.ls.set('Person', Number(this.Person) ? this.Person : 0, 60 * 60 * 1000);
						} else {
							console.error("ChangePeopleNumber.error", res);
						}
					})
					.catch(res => {
						console.error("ChangePeopleNumber.catch", res);
					});
				this.ShowPerson = false;
			},
			// 选择口味
			OpenFlavorPopup() {
				if (this.EditingOrder.Items.length == 0) {
					uni.showToast({
						title: "您还没有选择菜品，不可以下单呦！😀",
						icon: 'none',
						duration: 3000
					});
					return;
				} else {
					// 没有口味选项时跳过
					if (!this.flavorlist || this.flavorlist.length == 0) {
						this.flavorPopupOut();
						return;
					} else {
						if (this.EditingOrder.Remark != "" && this.EditingOrder.Remark != null) {
							let remark = this.EditingOrder.Remark + '';
							if (remark) {
								this.flavorlist.forEach(item => {
									item.selected = remark.indexOf(item.text) >= 0;
									if (item.selected) {
										remark = remark.replace(item.text + '，', '').replace(item.text, '')
									}
								});
								this.RemarkTextarea = remark;
							}
						}
						this.flavorpopup = true;
					}

				}
			},
			// 跳过选择口味
			flavorPopupOut() {
				this.flavorpopup = false;
				this.pushShoppingCart();
			},
			// 跳转到购物车
			pushShoppingCart() {
				this.EditingOrder.DishCount = this.OrderDishCount;
				this.EditingOrder.Amount = this.OrderAmount;
				Vue.ls.set("EditingOrder", this.EditingOrder, 10 * 1000); //10秒
				console.log('this.EditingOrder', this.EditingOrder, this.shopcart)
				this.$router.push({
					name: "ShoppingCart",
					query: {
						AddDish: this.AddDish
					},
					params: {
						EditingOrder: this.EditingOrder
					}
				});
			},
			// 选择口味
			selectFlavor(index) {
				if (this.BusinessConfig.OrderConfig.RemarkCanMultiple == 0) {
					this.flavorlist.forEach((item, index2) => {
						if (index == index2) {
							this.flavorlist[index].selected = !this.flavorlist[index].selected;
						} else {
							item.selected = false;
						}
					});
				} else {
					this.flavorlist[index].selected = !this.flavorlist[index].selected;
				}
			},
			// 确认选择口味
			flavorPopupConfirm() {
				let selected = 0;
				var remark = "";
				for (let i = 0; i < this.flavorlist.length; i++) {
					if (this.flavorlist[i].selected) {
						selected++;
						remark = remark == "" ? "[" + this.flavorlist[i].text + "]" : remark + "，[" + this.flavorlist[i]
							.text + "]";
						console.log(remark, this.flavorlist[i].text);
					}
				}
				console.log(remark);
				if (selected == 0) {
					uni.showToast({
						title: "请选择口味偏好！",
						icon: 'none',
						duration: 3000
					});
				} else {
					// 提交订单数据
					var parameter = {};
					parameter.OrderCode = this.EditingOrder.OrderCode;
					parameter.Remark = remark + (remark.length > 0 && this.RemarkTextarea.length > 0 ? "，" : "") + this
						.RemarkTextarea;;
					ChangeRemark(parameter)
						.then(res => {
							if (res.state == 200) {
								this.EditingOrder.Remark = remark;
								console.log("ChangeRemark.ok");
								this.flavorPopupOut();
							} else {
								console.log("ChangeRemark.errpr", res);
							}
						})
						.catch(res => {
							console.log("ChangeRemark.catch", res);
						});
				}
			},
			// 加载多人点餐信息
			loadTidings() {
				GeteTidings({
						OrderCode: this.EditingOrder.OrderCode,
						MemberCode: this.MemberCode
					})
					.then(res => {
						console.log("获取多人点餐信息", res);
						if (res.state == 200) {
							res.data.forEach(item => {
								var has = this.Tidings.filter(a => a.OrderTidingCode == item.OrderTidingCode);
								var dishs = null;
								if (has.length == 0) {
									this.Tidings.push(item);
									if (item.DishID == "Clear") {
										this.ClearShopcart(); // 清空购物车
									} else if (item.DishID == "Put") {
										this.$router.push({
											name: "PutOK",
											query: {
												OrderCode: this.EditingOrder.OrderCode
											},
											params: {
												EditingOrder: this.EditingOrder
											}
										});
									} else {
										var dishs = this.AllDishs.filter(a => a.DishID == item.DishID);
										if (dishs.length > 0) {
											this.TakeCart(null, 4, dishs[0], item.TakeNumber > 0, Math.abs(item
												.TakeNumber), false);
										}
									}
									// 执行动画
									var msg = {
										id: this.marqueeMsgs.length,
										show: true,
										msg: item.Content,
										avatar: item.TakeMemberPicture
									};
									this.marqueeMsgs.unshift(msg);
									setTimeout(() => {
										msg.show = false;
									}, 5 * 1000);
								}
							});
						}
					})
					.catch(err => {
						console.error("获取多人点餐信息", err);
					});
				// if(this.barrageHiddenTime<new Date()){
				//     if(document.getElementsByClassName('baberrage-item').length==0){
				//         this.barrageIsShow=false;
				//     }
				// }
			},
			PushErrorPage(res) {
				this.$router.push({
					name: "invalid",
					query: {
						Msg: res.state + "-" + res.msg,
						From: window.location.href
					},
					params: res
				});
			},
			ClickOnFC() {
				this.FCClickTimes++;
			},
			OnSearchFocus(res) {
				console.log('OnSearchFocus', res)
				this.SearchState = true;
			},
			OnSearchCancel(res) {
				console.log('OnSearchCancel', res)
				this.SearchState = false;
			},
			OnSearch(res) {
				console.log('OnSearch', res)
				if (this.SearchState) {
					this.SearchState = false;
				} else {
					this.SearchState = true;
				}
			},

			additem(target) {
				this.drop(target);
				this.rednum++;
			},
			drop(el) {
				//抛物
				for (let i = 0; i < this.balls.length; i++) {
					let ball = this.balls[i];
					if (!ball.show) {
						//当小球显示状态为隐藏时
						ball.show = true; //将这个小球的显示状态设置为true
						ball.el = el; // 将cartControl传过来的对象挂载到ball的el属性上
						this.dropBalls.push(ball); // 将这个小球放入到dropBalls数组中
						return;
					}
				}
			},
			beforeDrop(el) {
				/* 购物车小球动画实现 */
				let rednum = this.balls.length;
				while (rednum--) {
					let ball = this.balls[rednum];
					if (ball.show) {
						let rect = ball.el.getBoundingClientRect(); //元素相对于视口的位置
						let x = rect.left - 32; //x初始值  // 小球x方向位移= 小球距离屏幕左侧的距离-外层盒子距离水平的距离
						let y = -(window.innerHeight - rect.top - 22); //获取y
						el.style.display = "";
						el.style.webkitTransform = "translateY(" + y + "px)"; //translateY  // 设置外层盒子，即小球垂直方向的位移
						el.style.transform = "translateY(" + y + "px)";
						let inner = el.getElementsByClassName("inner-hook")[0];
						inner.style.webkitTransform = "translateX(" + x + "px)"; // 设置内层盒子，即小球水平方向的距离
						inner.style.transform = "translateX(" + x + "px)";
					}
				}
			},
			dropping(el, done) {
				/*重置小球数量 样式重置*/
				el.offsetHeight;
				el.style.webkitTransform = "translate3d(0,0,0)"; // 设置小球掉落后最终的位置
				el.style.transform = "translate3d(0,0,0)";
				let inner = el.getElementsByClassName("inner-hook")[0];
				inner.style.webkitTransform = "translate3d(0,0,0)";
				inner.style.transform = "translate3d(0,0,0)";
				el.addEventListener("transitionend", done); // Vue为了知道过渡的完成，必须设置相应的事件监听器。它可以是transitionend或 animationend
			},
			afterDrop(el) {
				/*初始化小球*/
				let ball = this.dropBalls.shift(); // 完成一次动画就删除一个dropBalls的小球
				if (ball) {
					ball.show = false;
					el.style.display = "none"; //完成一次之后就让小球隐藏
				}
			},
		},
		watch: {
			LoadingNumber(newValue, oldValue) {
				if (newValue == 1 && oldValue == 0) {
					uni.showLoading({
						title: '加载中',
						mask: true
					})
				}
				if (newValue == 0 && oldValue != 0) {
					uni.hideLoading()
				}
			},
			SearchState(newValue, oldValue) {
				if (!newValue) {
					this.SearchKey = "";
				}
			},

		},
	};
</script>

<style scoped>
	.doflavorpopup .title {
		text-align: left !important;
	}

	.doflavorpopup .contentbox {
		padding: 10px 0;
		overflow-y: scroll;
	}

	.doflavorpopup .contentbox .minititle {
		padding-top: 5px;
	}

	.doflavorpopup .contentbox .infobox {
		padding: 6px 0 10px
	}

	.doflavorpopup .contentbox .infobox .infoitem {
		display: inline-block;
		padding: 5px;
		min-width: 80px;
		text-align: center;
		color: #333;
		border: 1px solid #ebeef5;
		border-radius: 5px;
		margin: 5px 10px 5px 0;
	}

	.doflavorpopup .contentbox .infobox .infoitem.selected {
		border-color: #ea454c;
		background-color: #ea454c10;
		color: #ea454c;
	}

	.doflavorpopup .messagebox {
		border-top: 1px solid #ebeef5;
		border-bottom: 1px solid #ebeef5;
		background-color: #ebeef530;
		margin: 0 -15px;
		padding: 8px 15px;
	}

	.doflavorpopup .totalbox {
		color: #333;
		position: relative;
		font-weight: bold;
		padding: 18px 0 0;
	}

	.doflavorpopup .totalbox .totalprice {
		color: #ea454c;
		font-size: 18px;
		display: inline-block;
	}

	.doflavorpopup .totalbox .totalprice i {
		font-size: 10px;
		font-style: normal;
	}

	.doflavorpopup .totalbox .sellout {
		line-height: 30px;
		color: #333;
		position: absolute;
		right: 0;
		top: 15px;
	}

	.doflavorpopup .totalbox .pushbtn {
		line-height: 30px;
		color: #fff;
		background-color: #ea454c;
		border-radius: 15px;
		padding: 0 10px;
		position: absolute;
		right: 0;
		top: 15px;
	}

	.doflavorpopup .totalbox .editnumberbox {
		position: absolute;
		right: 0;
		top: 18px;
		width: 90px;
	}

	.doflavorpopup .totalbox .editnumberbox .jian {
		display: inline-block;
		float: initial;
		position: relative;
	}

	.doflavorpopup .totalbox .editnumberbox .jian i {
		color: #777;
		top: -1px;
		right: -1px;
	}

	.doflavorpopup .totalbox .editnumberbox .number {
		display: inline-block;
		float: initial;
		min-width: 30px;
		text-align: center;
		line-height: 26px;
		vertical-align: top;
	}

	.doflavorpopup .totalbox .editnumberbox .jia {
		display: inline-block;
		float: initial;
		position: relative;
	}

	.doflavorpopup .popup-cot {
		padding: 0 !important;
	}

	.popup-cot .closebtn {
		position: absolute;
		bottom: -60px;
		left: 50%;
		margin-left: -20px;
		color: #fff;
		text-align: center;
		font-size: 38px;
	}

	.doflavorpopup .popup-cot .content {
		padding: 20px 15px;
	}

	.doflavorpopup .popup-cot .picture {
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		width: 100%;
		height: 220px;
		border-top-right-radius: 10px;
		border-top-left-radius: 10px;
	}

	.doflavorpopup .bg {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
	}

	.mint-swipe-indicators>>>.is-active {
		width: 12px;
		background: #ea454c;
	}
</style>
<style scoped>
	.showdialogbox {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
		position: fixed;
		z-index: 99;
		top: 0;
		left: 0;
	}

	.showdialogbox .box {
		padding: 0;
		width: 300px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -60%;
		margin-left: -150px;
		background: #fff;
		border-radius: 10px;
	}

	.showdialogbox .picture {
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		width: 100%;
		height: 300px;
		border-top-right-radius: 10px;
		border-top-left-radius: 10px;
	}

	.showdialogbox .content {
		padding: 20px 15px;
	}

	.showdialogbox .content .title {
		font-size: 14px;
		font-weight: 700;
		line-height: 1;
	}

	.showdialogbox .content .totalbox {
		color: #333;
		position: relative;
		font-weight: bold;
		padding: 18px 0 0;
	}

	.showdialogbox .content .totalbox .totalprice {
		color: #ea454c;
		font-size: 18px;
		display: inline-block;
	}

	.showdialogbox .content .totalbox .totalprice i {
		font-size: 10px;
		font-style: normal;
	}

	.showdialogbox .content .totalbox .pushbtn {
		line-height: 30px;
		color: #fff;
		background-color: #ea454c;
		border-radius: 15px;
		padding: 0 10px;
		position: absolute;
		right: 0;
		top: 15px;
	}

	.showdialogbox .content .totalbox .editnumberbox {
		position: absolute;
		right: 0;
		top: 18px;
		width: 90px;
	}

	.showdialogbox .content .totalbox .editnumberbox .jian {
		display: inline-block;
		float: initial;
		position: relative;
	}

	.showdialogbox .content .totalbox .editnumberbox .jian i {
		color: #777;
		top: -1px;
		right: -1px;
	}

	.showdialogbox .content .totalbox .editnumberbox .number {
		display: inline-block;
		float: initial;
		min-width: 30px;
		text-align: center;
		line-height: 26px;
		vertical-align: top;
	}

	.showdialogbox .content .totalbox .editnumberbox .jia {
		display: inline-block;
		float: initial;
		position: relative;
	}

	.showdialogbox .closebtn {
		position: absolute;
		bottom: -60px;
		left: 50%;
		margin-left: -20px;
		color: #fff;
		text-align: center;
		font-size: 38px;
	}
</style>

<style lang="scss" scoped>
	$main: #ea454c;
	$red: #ff423e;
	$border: #e6e6ea;
	$grey: #777;
	$box: #f2f2f6;

	@mixin border-radius($size) {
		-webkit-border-radius: $size;
		-moz-border-radius: $size;
		border-radius: $size;
	}

	// .mint-swipe-indicators {
	//   /deep/ .mint-swipe-indicator.is-active {
	// 	width: 12px;
	// 	background: #ea454c;
	// }
	// }
	.barrageBox {
		z-index: 999;
		position: fixed;
		width: 100%;
	}

	.barrageBox .barrageitem {
		width: 200%;
		margin-left: -100%;
	}

	.barrageBox .barrage {
		padding: 3px 20px 3px 3px;
		margin-top: 3px;
		line-height: 30px;
		font-weight: 400;
		font-size: 14px;
		z-index: 999;
		border-radius: 18px;
		background-color: rgba(234, 69, 76, 0.8);
		color: white;
		display: inline-block;
		width: fit-content;
	}

	.barrageBox .barrage .head {
		width: 30px;
		height: 30px;
		border-radius: 15px;
		vertical-align: bottom;
		margin-right: 5px;
	}

	.container {
		font-size: 12px;
	}

	.storedeskinfo {
		width: 85px;
		position: fixed;
		// top: 49px;
		left: 0px;
		bottom: 70px;
		padding: 10px 10px 10px 12px;
		background-color: white;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.storedeskinfo .iconfont {
		font-size: 20px;
		color: #ea454c;
		font-weight: bold;
	}

	.dishtype-tab {
		width: 85px;
		position: fixed;
		top: 49px;
		left: 0px;
		bottom: 150px;
		overflow: hidden;
		background-color: white;
		// border-right: 5px solid #f2f2f6;    
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.dishtype-tab>view {
		width: 80px;
		padding-top: 20px;
	}

	.dishtype-tab>view>view {
		width: 100%;
		// line-height: 45px;
		// height: 45px;
		font-size: 14px;
		// text-indent: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		position: relative;
		color: #626262;
		padding: 15px 10px 15px 12px;

		.number {
			text-indent: 0;
			height: 16px;
			line-height: 14px;
			position: absolute;
			right: 5px;
			top: 3px;
			background: #ff423e;
			vertical-align: middle;
			font-size: 10px;
			padding: 1px 5px;
			border-radius: 8px;
			color: #fff;
			text-align: center;
			display: inline-block;
		}
	}

	.dishtype-tab>view>view.active {
		color: #333;
		background-color: $box;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;

		font-weight: bold;

		&:before {
			content: "";
			width: 3px;
			height: 20px;
			position: absolute;
			top: 50%;
			left: 0;
			margin-top: -10px;
			background: $main;
			border-radius: 2px;
		}
	}

	.shop-cart {
		position: fixed;
		left: 10px;
		right: 10px;
		bottom: 10px;
		z-index: 3;
	}

	.shop-cart.disabled .opera {
		background: #cccccc;
		color: white !important;
	}

	.shop-cart.disabled .total {
		color: white !important;
	}

	.shop-cart.disabled .goput,
	.shop-cart.disabled .cart {
		background: #999999;
	}

	.shop-cart .opera {
		height: 50px;
		border-radius: 25px;
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
		background: #2f2e2c;
	}

	.shop-cart .cart {
		width: 50px;
		height: 50px;
		line-height: 50px;
		text-align: center;
		background: #222222;
		float: left;
		position: absolute;
		left: 0;
		top: 0;
		font-size: 20px;
		border-radius: 50%;
		-webkit-transition: all 0.3s;
		transition: all 0.3s;
	}

	.shop-cart .cart .iconfont {
		font-size: 20px;
	}

	.shop-cart .cart i::before {
		content: "\e61f";
	}

	.shop-cart .cart .number {
		text-indent: 0;
		height: 16px;
		line-height: 16px;
		position: absolute;
		right: 0px;
		top: -6px;
		background: #ff423e;
		vertical-align: middle;
		font-size: 10px;
		padding: 1px 5px;
		border-radius: 8px;
		color: #fff;
		text-align: center;
		display: inline-block;
	}

	.shop-cart .total {
		margin-left: 65px;
		font-size: 14px;
		line-height: 50px;
		color: white;
		-webkit-transition: all 0.3s;
		transition: all 0.3s;
	}

	.shop-cart .goput {
		width: 130px;
		height: 50px;
		line-height: 50px;
		text-align: center;
		background: #ea454c;
		position: absolute;
		right: 0;
		bottom: 0;
		border-radius: 0 25px 25px 0;
		font-size: 14px;
		-webkit-transition: all 0.3s;
		transition: all 0.3s;
		color: white;
	}

	.shop-cart.active {
		.opera {
			-webkit-border-radius: 0 0 10px 10px;
			-moz-border-radius: 0 0 10px 10px;
			border-radius: 0 0 10px 10px;
			overflow: hidden;

			.cart {
				position: absolute;
				top: -60px;
				left: 15px;
			}

			.total {
				margin-left: 10px;
			}

			.goput {
				-webkit-border-radius: 0 0 10px 0;
				-moz-border-radius: 0 0 10px 0;
				border-radius: 0 0 10px 0;
			}
		}
	}

	.shop-cart-list {
		background: #fff;
		-webkit-border-radius: 10px 10px 0 0;
		-moz-border-radius: 10px 10px 0 0;
		border-radius: 10px 10px 0 0;
		position: relative;

		&:after {
			content: "";
			border-bottom: 5px solid #f2f2f6;
			border-top: 5px solid transparent;
			border-left: 5px solid transparent;
			border-right: 5px solid transparent;
			position: absolute;
			left: 35px;
			top: -10px;
		}

		.title-box {
			height: 50px;
			padding: 0 10px;
			background: #f2f2f6;
			-webkit-border-radius: 10px 10px 0 0;
			-moz-border-radius: 10px 10px 0 0;
			border-radius: 10px 10px 0 0;
			overflow: hidden;

			.title {
				font-size: 14px;
				line-height: 50px;
				float: left;
			}

			.clear {
				float: right;
				height: 50px;
				line-height: 50px;

				.img {
					height: 14px;
					float: left;

					img {
						height: 100%;
					}
				}

				.text {
					float: left;
					font-size: 14px;
					line-height: 50px;
					margin-left: 5px;
				}
			}
		}

		.list {
			max-height: 450px;
			overflow: auto;
			padding: 0 10px;

			li {
				// height: 60px;
				padding: 10px 0;
				border-bottom: 1px solid $border;
				position: relative;
				clear: both;
			}

			.dishpic {
				width: 90px;
				height: 70px;
				border-radius: 5px;
				overflow: hidden;
				display: inline-block;
				background-repeat: no-repeat;
				background-size: cover;
				background-position: center;
				vertical-align: top;
			}

			.dishinfo {
				display: inline-block;
				margin-left: 5px;
			}

			.flavorinfo {
				font-size: 10px;
				color: #777;
				min-height: 30px;
			}

			.title {
				width: 120px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 14px;
				font-weight: bold;
			}

			.price {
				display: inline-block;
				color: initial;
				font-size: 14px;
			}

			.cartcontrol {
				position: absolute;
				right: 0;
				bottom: 10px;

				.cart-decrease {
					width: 26px;
					height: 26px;
					// width: 24px;
					// height: 24px;
					text-align: center;
					color: #333;
					@include border-radius(50%);
					border: 1px solid $grey;
					font-weight: 700;
					float: left;

					i {
						position: absolute;
						top: -1px;
						left: -1px;
						width: 26px;
						height: 26px;
						color: $grey;
						font-size: 12px;
						line-height: 26px;
					}
				}

				.cart-count {
					height: 26px;
					line-height: 26px;
					width: 15px;
					display: inline-block;
					text-align: center;
					font-size: 14px;
					color: $grey;
					margin: 0 10px;
					float: left;
				}

				.cart-add {
					width: 26px;
					height: 26px;
					// width: 24px;
					// height: 24px;
					text-align: center;
					background: $main;
					color: #333;
					// padding-top: 8px;
					@include border-radius(50%);
					font-weight: 700;
					float: left;

					i {
						font-size: 12px;
						display: block;
						line-height: 26px;
						height: 26px;
					}
				}
			}
		}
	}

	.shop-cart-bg {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: -1;
	}

	.typename.typenamefixed {
		position: fixed;
		left: 85px;
		top: 49px;
		z-index: 2;
		right: 0px;
	}

	.dish-tab {
		position: fixed;
		top: 49px;
		bottom: 0px;
		left: 85px;
		right: 0px;
		overflow: hidden;
		background: #f2f2f6;
	}

	.dishul {
		padding: 0 5px;
		min-height: 60px;
	}

	.dishli {
		clear: both;
		position: relative;
		margin: 10px 0;
		// -moz-box-shadow: 1px 2px 5px #afafaf;
		// box-shadow: 1px 2px 5px #afafaf;
		// padding: 5px;
		padding-top: 3px;
	}

	.dishli .bg {
		width: 100%;
		height: 100%;
		display: block;
		background: white;
		-moz-box-shadow: 1px 2px 5px #afafaf;
		box-shadow: 1px 2px 5px #afafaf;
		padding: 5px;
		;
		border-radius: 5px;

	}

	.dishli:last-child {
		border-bottom: 0;
	}

	.dishul.searchul {
		column-count: 2;
		column-gap: 10px;
		margin-bottom: 30px;
		padding: 0 10px;
	}

	.dishul.searchul .dishli {
		margin: 0 0 10px;
		break-inside: avoid;
		-webkit-column-break-inside: avoid;
	}

	// .dishul.searchul .dishli{width: 46%;margin: 0 2% 10px; display: inline-block;}

	.typename {
		position: relative;
		// line-height: 30px;
		text-indent: 20px;
		font-size: 16px;
		// border-bottom: 1px solid #e6e6ea;
		// border-top: 1px solid #e6e6ea;
		font-weight: bold;
		line-height: 34px;
		background: white;
		border-radius: 5px;
		margin: 0 5px;
		-moz-box-shadow: 1px 2px 5px #bbbbbb;
		box-shadow: 1px 2px 5px #bbbbbb;
	}

	// .dish-tab .dish-type-item .typename:before {
	//   content: "";
	//   width: 3px;
	//   height: 20px;
	//   position: absolute;
	//   top: 50%;
	//   left: 10px;
	//   margin-top: -10px;
	//   background: #ea454c;
	//   border-radius: 2px;
	// }
	.dishli img {
		width: 80px;
		height: 60px;
		border-radius: 5px;
		overflow: hidden;
		float: left;
	}

	.dishli .showpic .dish {
		min-height: 110px;
	}

	.dishli .nopic .dishname {
		line-height: 36px;
	}

	.dishli .dishpic {
		width: 150px;
		height: 110px;
		border-radius: 5px;
		overflow: hidden;
		float: left;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}

	.dishul.searchul .dishli .dishpic {
		width: 100%;
		height: 120px;
		border-radius: 5px;
		overflow: hidden;
		float: left;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}

	.dishli .dishtag {
		width: 36px;
		height: 36px;
		display: inline-block;
		background: no-repeat top left;
		background-size: contain;
		vertical-align: middle;
		margin: 2px 3px 0 2px
	}

	.dishli .dishinfo {
		line-height: 24px;
	}

	.dishli .dishinfo .priceline {
		margin-top: 5px;
	}

	.dishli.showpic .dishinfo {
		margin-left: 150px;
		padding: 5px 10px;
	}

	.dishul.searchul .dishli.showpic .dishinfo {
		margin-left: initial;
		padding: initial;
	}

	.dishli .dishname {
		font-size: 14px;
		font-weight: bold;
	}

	.memberprice {
		color: #ff423e;
		margin-right: 10px;
		font-size: 14px;
	}

	.price {
		color: initial;
		font-size: 14px;
	}

	.price.del {
		text-decoration: line-through;
		color: #777;
		font-size: 12px;
	}

	.dishli .remark {
		color: #777;
		clear: both;
		margin-bottom: -6px;
		font-size: 14px;
		margin-right: 100px;
		padding: 9px 0;
	}

	.searchul .remark {
		margin-right: initial;
		margin-bottom: 30px;
	}

	.dishli .remark span {
		margin-right: 5px;
	}

	.dishli .oreration {
		position: absolute;
		height: 24px;
		bottom: 10px;
		right: 5px;
		line-height: 20px;
	}

	.doflavor {
		width: 80px;
		height: 26px;
		text-align: center;
		background: #ea454c;
		color: #fff;
		border-radius: 13px;
		float: left;
		line-height: 26px;
		position: relative;
	}

	.dishli .doflavor .number {
		position: absolute;
		top: 0;
		right: 0;
		margin-top: -8px;
		width: initial;
		height: 16px;
		line-height: 14px;
		font-size: 10px;
		padding: 1px 5px;
		border-radius: 8px;
		background-color: #2f2e2c;
	}

	.jia {
		// width: 24px;
		// height: 24px;
		width: 26px;
		height: 26px;
		// padding-top: 7px;
		text-align: center;
		background: #ea454c;
		color: #333;
		border-radius: 50%;
		float: left;

	}

	.jian {
		// width: 24px;
		// height: 24px;
		width: 26px;
		height: 26px;
		// padding-top: 7px;
		text-align: center;
		background: white;
		color: #333;
		border-radius: 50%;
		float: left;
		color: #777;
		background: none;
		border: 1px solid #777;
	}

	.jia i,
	.jian i {
		font-size: 12px;
		line-height: 26px;
		// line-height: 25px;
		font-weight: 300;
		position: absolute;
		width: 26px;
		height: 26px;
		// width: 24px;
		// height: 24px;
		right: 0;
		top: 0;
	}

	.dishli .number {
		width: 30px;
		display: inline-block;
		text-align: center;
		float: left;
		font-size: 14px;
		line-height: 26px;
		// line-height: 24px;
	}

	.cart-decrease {
		// width: 24px;
		// height: 24px;
		width: 26px;
		height: 26px;
		display: block;
		opacity: 1;
		float: left;
		transition: all 0.2s linear;
		transform: translate(0, 0);

		.inner {
			width: 100%;
			height: 100%;
			text-align: center;
			color: $grey;
			display: block;
			border: 1px solid $grey;
			@include border-radius(50%);
			transition: all 0.4s linear;
			transform: rotate(0);

			i {
				font-size: 12px;
				// line-height: 25px;
				line-height: 26px;
				font-weight: 300;
				position: absolute;
				// width: 24px;
				// height: 24px;
				width: 26px;
				height: 26px;
				left: -1px;
				top: -1px;
				color: $grey;
			}
		}

		&.move-enter,
		&.move-leave-to {
			opacity: 0;
			transform: translate(20px, 0);

			.inner {
				transform: rotate(180deg);
			}
		}
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 12px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: white;
	}

	.fadeInUp-enter-active {
		-webkit-transition: all 0.3s;
		-moz-transition: all 0.3s;
		-ms-transition: all 0.3s;
		-o-transition: all 0.3s;
		transition: all 0.3s;
	}

	.fadeInUp-enter,
	.fadeInUp-leave-to {
		opacity: 0;
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}

	.clearpopup,
	.flavorpopup,
	.orderpopup,
	.lockpopup,
	.doflavorpopup {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;
		-webkit-transition: all 0.3s;
		-moz-transition: all 0.3s;
		-ms-transition: all 0.3s;
		-o-transition: all 0.3s;
		transition: all 0.3s;

		.popup-cot {
			width: 300px;
			position: absolute;
			top: 50%;
			left: 50%;
			margin-left: -150px;
			background: #fff;
			@include border-radius(10px);
			margin-top: -60%;
			padding: 20px 15px;

			.title {
				font-size: 14px;
				font-weight: 700;
				line-height: 1;
				text-align: center;
			}

			.text {
				padding: 15px 0;
				text-align: center;
				font-size: 14px;
				line-height: 24px;
				color: $grey;
			}

			.btn-group {
				width: 100%;

				li {
					width: 50%;
					float: left;
				}

				.btn {
					width: 120px;
					height: 40px;
					line-height: 40px;
					text-align: center;
					font-size: 12px;
					@include border-radius(20px);
					font-size: 14px;
					margin: 0 auto;
				}

				.cancle {
					background: #d8d8d8;
				}

				.confirm {
					background: $main;
					color: white;
				}
			}
		}

		.flavor-list {
			padding: 15px 0;

			li {
				height: 30px;
				line-height: 29px;
				padding: 0 20px;
				float: left;
				margin: 10px 5px 5px 0;
				font-size: 14px;
				border: 1px solid $border;
				min-width: 85px;
				text-align: center;
				@include border-radius(15px);
			}

			.active {
				background: $main;
				border-color: $main;
				color: white;
			}
		}

		.bg {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.3);
		}
	}

	.flavorpopup {
		.popup-cot {
			margin-top: -60%;
		}
	}

	.diner-num {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 99;
		transition: all 0.3s linear;

		.diner-num-cot {
			width: 70%;
			padding: 25px 20px;
			background: #fff;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			@include border-radius(10px);

			.title {
				font-size: 14px;
				line-height: 1;
				text-align: center;
				margin-bottom: 10px;
			}

			.diner-select-people {
				width: 25%;
				margin: 15px 0;
				float: left;
			}

			.cot {
				width: 35px;
				height: 35px;
				line-height: 34px;
				text-align: center;
				border: 1px solid #d8d8d8;
				font-size: 12px;
				margin: 0 auto;
				@include border-radius(50%);
			}

			.active {
				.cot {
					border-color: $main;
					background: $main;
					color: white;

				}
			}

			.confirm {
				width: 160px;
				height: 40px;
				line-height: 40px;
				text-align: center;
				background: $main;
				margin: 10px auto 0;
				display: block;
				border: none;
				padding: 0;
				font-size: 14px;
				color: white;
				@include border-radius(20px);
			}
		}
	}

	/* clearpopup end */
	/* clearpopup end */
	.search-btn {
		width: 45px;
		height: 45px;
		position: fixed;
		bottom: 135px;
		left: 20px;

		.btn {
			width: 100%;
			height: 100%;
			border: 2px solid #888;
			display: block;
			text-align: center;
			padding-top: 5px;
			@include border-radius(50%);

			i {
				height: 16px;
				font-size: 16px;
				color: $main;
				line-height: 1;
				display: block;
				margin: 0 auto;
			}

			.text {
				height: 10px;
				font-size: 10px;
				color: $main;
				text-align: center;
				line-height: 1;
				margin-top: 5px;
			}
		}
	}

	.blue {
		border-radius: 100px;
		background: #e6ff75;
		color: #fff;
	}

	.green {
		border-radius: 100px;
		background: rgba(117, 255, 205, 0.4);
		color: #fff;
	}

	.red {
		border-radius: 100px;
		background: #e68fba;
		color: #fff;
	}

	.yellow {
		border-radius: 100px;
		background: #dfc795;
		color: #fff;
	}

	.baberrage-stage {
		position: absolute;
		width: 100%;
		height: 36px !important;
		overflow: hidden;
		top: 0;
		margin-top: 5px;
	}

	.baberrage-item {
		margin-top: 5px;
		padding: 3px 15px 3px 35px !important;
	}

	.baberrage-item .baberrage-avatar {
		position: absolute;
		width: 30px;
		height: 30px;
		left: 6px !important;
		top: 3px !important;
		border-radius: 50px;
		overflow: hidden;
	}

	.headimg {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		vertical-align: middle;
		margin-right: 5px;
	}
</style>

<style lang="scss" scoped>
	.nut-searchbar {
		background: white;
		font-size: 14px;
		padding: 5px 10px;
		z-index: 997;
	}

	.SearchCard {
		position: fixed;
		top: 44px;
		left: 0;
		right: 0px;
		bottom: 0px;
		overflow: hidden;
		background: white;
		z-index: 4;
		padding: 5px 0px 0px;
		overflow: scroll;
	}
</style>
<style>
	.uni-searchbar {
		padding: 5px 10px !important;
		font-size: 14px;
		background: #fff;
	}

	.uni-searchbar__box {
		height: 34px;
		line-height: 36px;
	}
</style>

<style scoped>
	.shop {
		position: fixed;
		top: 300px;
		left: 400px;
	}

	.ball {
		position: fixed;
		left: 32px;
		bottom: 22px;
		z-index: 200;
		/* transition: all 2s cubic-bezier(0.49, -0.29, 0.75, 0.41); 贝塞尔曲线 */
		transition: all 0.5s cubic-bezier(.22, -0.3, .81, .75);
		/*贝塞尔曲线*/
	}

	.inneryq {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: #ea454c;
		transition: all 0.5s linear;
	}

	.cart {
		position: fixed;
		bottom: 22px;
		left: 32px;
		width: 30px;
		height: 30px;
		background-color: #ea454c;
		color: rgb(255, 255, 255);
	}

	.ball-container {
		position: fixed;
		bottom: 30px;
		left: 30px;
		width: 50px;
		height: 50px;
		z-index: 200;
		;
	}
</style>
