<template>
  <div class="container">
    <!-- paymsg -->
    <div class="paymsg">
      <h5 class="title">消费信息</h5>
      <div class="paymsg-list">
        <ul class="msg-list">
          <li class="msg-item">
            <p class="text">账单编号</p>
            <p class="cot">{{BillInfo.BillCode}}</p>
          </li>
          <li class="msg-item" v-if="BillInfo.StoreName">
            <p class="text">用餐门店</p>
            <p class="cot">{{BillInfo.StoreName}}</p>
          </li>
          <li class="msg-item">
            <p class="text">用餐台位</p>
            <p class="cot">{{BillInfo.DeskName}}</p>
          </li>
          <li class="msg-item">
            <p class="text">消费金额</p>
            <p class="cot">￥{{BillInfo.Amount}}</p>
          </li>
          <li class="msg-item">
            <p class="text">结账时间</p>
            <p class="cot" v-if="BillInfo.BillState==2">{{ dateFormart(BillInfo.BillCashierTime,'YYYY-MM-DD HH:mm:ss') }}</p>
            <p class="cot" v-if="BillInfo.BillState==1">
              <span class="tag">未结账</span>
            </p>
          </li>
          <!-- <li class="msg-item">

<p class="text">结账方式:</p>

<p class="cot">{{item.cot}}</p>
          </li>-->
        </ul>
      </div>
    </div>
    <!-- paymsg end -->
    <div class="division"></div>
    <!-- food-list -->
    <div class="foodlist">
      <div class="title-box">
        <h5 class="title">菜品信息</h5>
        <div class="fold-btn" :class="{'active':fold == 1}" @click="changefold">
          <p class="text">{{fold == 0?"展开":"收起"}}</p>
          <i class="iconfont iconjiantou3-copy-copy"></i>
        </div>
      </div>
      <div class="foodlist-cot">
        <ul class="list" :style="{height:listheight}">
          <li v-for="(item,index) in BillDishItem" :key="index">
            <div class="text-box">
              <h6 class="title">{{item.DishName}}&nbsp;（￥{{item.SellingPrice}}&nbsp;/&nbsp;份）<span class="num" style="float:initial">&nbsp;x&nbsp;{{item.Number}}份</span><span v-if="item.BackNumber>0" style="color:red">（退{{item.BackNumber}}份）</span></h6>
              
            </div>
            <p class="total">￥{{item.DishPrice*(item.Number-item.BackNumber)}}</p>
          </li>
        </ul>
        <p class="food-total">
          总额：
          <span class="num">￥{{BillInfo.Amount}}</span>
        </p>
        <p class="food-coupon" v-if="BillInfo.DiscountAmount!=0">
          优惠：
          <span class="num">-￥{{BillInfo.DiscountAmount}}</span>
        </p>
        <p class="food-real" v-if="BillInfo.BillState==2">
          实付：
          <span class="num">￥{{BillInfo.paymentAmount}}</span>
        </p>
      </div>
    </div>
    <!-- food-list end -->
    <div class="division"></div>
    <!-- staff-list -->
    <div class="stafflist">
      <h5 class="title">用餐人员</h5>
      <div class="stafflist-list">
        <ul class="list clearfix">
          <li v-for="(item,index) in BillMemberItems" :key="index">
            <div class="icon">
              <img :src="item.HeadImgUrl" alt="头像" />
            </div>
            <p class="text">{{item.Name}}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- staff-list end -->
    <div class="division" v-if="comment.Items&&comment.Items.length>0"></div>
    <!-- meal-comment -->
    <div class="meal-comment" v-if="comment.Items&&comment.Items.length>0">
      <h5 class="title">用餐评价</h5>
      <div class="star-box">
        <div class="star-item" v-for="(item,index) in comment.Items" :key="index">
          <p class="text">{{item.Title}}</p>
          <div class="star-list">
            <i class="iconfont iconwujiaoxingquanxing" :class="{'active':item.ScoreNumber > 0}"></i>
            <i class="iconfont iconwujiaoxingquanxing" :class="{'active':item.ScoreNumber > 1}"></i>
            <i class="iconfont iconwujiaoxingquanxing" :class="{'active':item.ScoreNumber > 2}"></i>
            <i class="iconfont iconwujiaoxingquanxing" :class="{'active':item.ScoreNumber > 3}"></i>
            <i class="iconfont iconwujiaoxingquanxing" :class="{'active':item.ScoreNumber > 4}"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- meal-comment end -->
    <div class="division" v-if="comment.Items&&comment.Items.length>0"></div>
    <!-- food-comment -->
    <div class="food-comment" v-if="comment.DishItems&&comment.DishItems.length>0">
      <h5 class="title">菜品评价</h5>
      <div class="star-box">
        <div class="star-item" v-for="(item,index) in comment.DishItems" :key="index">
          <p class="text">{{item.DishName}}</p>
          <div class="help-list">
            <div class="good" :class="{'active':item.Value == 'Good'}">
              <i class="iconfont icongood_active"></i>
              <p class="text">赞</p>
            </div>
            <div class="bad" :class="{'active':item.Value == 'Bad'}">
              <i class="iconfont icongood_active-copy"></i>
              <p class="text">踩</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- food-comment end -->
    <div class="division" v-if="comment.Info!=null&&comment.Info!=''"></div>
    <!-- comment-cot -->
    <div class="comment-cot" v-if="comment.Info!=null&&comment.Info!=''">
      <h5 class="title">其他评价</h5>
      <div class="cot-box">
        <p class="text">{{comment.Info}}</p>
      </div>
    </div>
    <!-- comment-cot end -->
  </div>
</template>

<script>
import { GetBillDetail,GetBillComment } from "@/api/bill";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "comment",
  data() {
    return {
      msglist: [], // 消费信息
      foodmsg: {}, // 菜品信息
      stafflist: [], // 用餐人员
      comment: {}, // 评论信息

      BillInfo: {
        bill:{}
      }, //账单信息（全部数据）
      BillMemberItems: [], //用餐人员
      BillDishItem: [], //菜品明细
      BillCashiersItem: [], //支付详情
      BillCardItem: [], //优惠券

      fold: 0, // 折叠按钮状态
      listheight: "60px", // 列表高度


      CanotBack:false,// 
    };
  },
  computed: {
    ...mapGetters(["MemberCode", "StoreCode", "DeskID", "Member"])
  },
  onLoad(option) {
    if(option.CanotBack){
      this.CanotBack=true;
    }
    // 请求数据
    var parameter = {};
    parameter.BillID = option.BillID;
    GetBillDetail(parameter).then(res => {
      console.log("res1111", res);
      res.data.paymentAmount=res.data.Amount-res.data.DiscountAmount
      console.log('res'.res)
      this.BillInfo = res.data;
      this.BillCashiersItem=res.data.Cashiers
      this.BillMemberItems = res.data.Members;
      // res.data.RetreatItems.forEach(Retreat => {
      //   res.data.Items.forEach(dish=>{
      //     if(dish.DishCode.trim()==Retreat.DishCode.trim()){
      //       dish.BackNumber=Retreat.BackNumber;
      //     }else{
      //       dish.BackNumber=0
      //     }
      //   })
      // });
      this.BillDishItem=res.data.Items

      console.log("BillDishItem", this.BillDishItem);
      console.log("BillCashiersItem", this.BillCashiersItem);
    });
    GetBillComment(parameter).then(res=>{
      if(res.state==200){
        if(res.data&&res.data.length>0){
        this.comment=res.data[0];
        }
      }else{
        this.$showToast("消费评价加载失败，请稍后再试！");
      }
    })
  },
  mounted(){
      if (window.history && window.history.pushState&&this.CanotBack) {
          history.pushState(null, null, document.URL);
          window.addEventListener('popstate', this.goBack, false);
      }
  },
  destroyed(){
      console.log('destroyed');
      if(this.CanotBack){
        window.removeEventListener('popstate', this.goBack, false);
      }
  },
  methods: {
    goBack(){
        console.log('goBack');
        // this.$router.replace({name: 'BillDetail',query: {BillID: w.BillID}});
		uni.redirectTo({
			url: `/pages/billDetail/index?BillID=${this.BillID}`
		})
        //replace替换原路由，作用是避免回退死循环
    },
	  //时间转化函数
    dateFormart(time, formart) {
      return moment(time).format(formart);
    },
    changefold() {
      if (this.fold == 0) {
        this.fold = 1;
        this.listheight = "auto";
      } else {
        this.fold = 0;
        this.listheight = "60px";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$main: #ea454c;
$red: #ff423e;
$border: #e6e6ea;
$grey: #777;
$glod: #b6986a;

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

.container {
}

/* paymsg */

.paymsg {
  padding: 15px;

  .title {
    font-size: 14px;
    line-height: 1;
  }

  .msg-list {
    li {
      height: 12px;
      margin-top: 15px;
    }

    .text {
      font-size: 12px;
      line-height: 1;
      float: left;
      color: #555;
    }

    .cot {
      float: right;
      text-align: right;
      //olor: $grey;
      // line-height: 1;
      font-size: 12px;
    }
  }
}

/* paymsg end */
/* foodlist */
.foodlist {
  padding: 20px 10px;

  .title-box {
    height: 14px;
    position: relative;
    margin-bottom: 10px;

    .title {
      font-size: 14px;
      line-height: 1;
    }

    .fold-btn {
      height: 12px;
      position: absolute;
      bottom: 0;
      right: 0;

      .text {
        float: left;
        font-size: 12px;
        // color: #777;
        line-height: 1;
      }

      i {
        font-size: 10px;
        float: left;
        color: #777;
        line-height: 12px;
        margin-left: 5px;
        display: block;
        @include transition;
      }
    }

    .fold-btn.active {
      i {
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        transform: rotate(180deg);
      }
    }
  }

  .foodlist-cot {
    .list {
      overflow: hidden;
      @include transition;

      li {
        height: 30px;
        line-height: 30px;
      }

      .title {
        font-size: 12px;
        float: left;
		color: #555;
      }

      .num {
        font-size: 12px;
        color: $grey;
        float: left;
      }

      .total {
        float: right;
        // color: $red;
		font-weight: 500;
        font-size: 12px;
      }
    }

    .food-total {
      margin-top: 10px;
      border-top: 1px solid #e6e6ea;
      padding-top: 20px;
      line-height: 1;
      font-size: 14px;
      color: #333;
      text-align: right;

      .num {
        // color: $grey;
        font-size: 14px;
      }
    }

    .food-discount,
    .food-coupon {
      margin-top: 15px;
      line-height: 1;
      line-height: 1;
      font-size: 14px;
      color: #333;
      text-align: right;

      .num {
        color: $grey;
        font-size: 14px;
      }
    }

    .food-real {
      margin-top: 15px;
      line-height: 1;
      line-height: 1;
      font-size: 14px;
      color: #333;
      text-align: right;

      .num {
        color: $red;
        font-size: 14px;
      }
    }
  }
}

/* foodlist end */
/* stafflist */
.stafflist {
  padding: 15px;

  .title {
    font-size: 14px;
    line-height: 1;
  }

  .stafflist-list {
    width: 100%;

    li {
      width: 25%;
      float: left;
      text-align: center;
      margin-top: 15px;
    }

    .icon {
      width: 45px;
      height: 45px;
      overflow: hidden;
      margin: 0 auto;
      @include border-radius(50%);

      img {
        width: 100%;
        display: block;
      }
    }

    .text {
      font-size: 12px;
      line-height: 1;
      margin-top: 10px;
    }
  }
}

/* stafflist end */
/* meal-comment */

.meal-comment,
.food-comment {
  padding: 20px 15px;

  .title {
    font-size: 14px;
    line-height: 1;
  }

  .star-item {
    height: 16px;
    line-height: 16px;
    margin-top: 15px;

    > .text {
      float: left;
      font-size: 12px;
      color: #555;
    }

    .star-list {
      float: right;

      i {
        display: inline-block;
        text-align: right;
        color: #e6e6ea;
        font-size: 16px;
        margin-left: 10px;
      }

      .active {
        color: $main;
      }
    }

    .help-list {
      float: right;

      .good,
      .bad {
        float: left;
        margin-left: 40px;

        i {
          display: inline-block;
          font-size: 16px;
          color: #e6e6ea;
        }

        .text {
          display: inline-block;
        //   color: #888;
          font-size: 12px;
        }
      }

      .good.active {
        i {
          color: $main;
        }

        .text {
          color: #333;
        }
      }

      .bad.active {
        i {
          color: #8b9fb8;
        }

        .text {
          color: #333;
        }
      }
    }
  }
}

/* meal-comment end */
/* mcomment-cot */

.comment-cot {
  padding: 15px;

  .title {
    font-size: 14px;
    line-height: 1;
  }

  .text {
    font-size: 12px;
    line-height: 20px;
    color: $grey;
    margin-top: 15px;
    word-wrap:break-word;
  }
}

/* comment-cot end */

.tag {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
  display: inline-block;
  height: 22px;
  padding: 0 7px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  opacity: 1;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

  color: #f5222d !important;
  background: #fff1f0;
  border-color: #ffa39e;
}
</style>
