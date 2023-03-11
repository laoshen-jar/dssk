<template>
  <div class="container" v-if="loadding==0">
    <!-- int -->
    <div class="int">
      <div class="img" :style="'background-image: url('+GoodsInfo.Picture+');'">
        <!-- <img :src="GoodsInfo.Picture" :alt="GoodsInfo.GoodsName" /> -->
      </div>
    </div>
    
    <div class="box">
      <div class="manay">
        <span class="spend">
          <span v-if="1-GoodsInfo.IntegralMaxRatio>0"><span style="font-size:12px">￥</span>{{ GoodsInfo.Price * parseInt((1-GoodsInfo.IntegralMaxRatio)*100)/100}}</span>
          <span v-if="GoodsInfo.IntegralMaxRatio<1&&GoodsInfo.IntegralMaxRatio>0"> + </span>
          <span v-if="GoodsInfo.IntegralMaxRatio>0">{{ parseInt(GoodsInfo.Price *GoodsInfo.IntegralMaxRatio* IntegralExchange*100)/100 }}积分</span>
        </span>
        <span class="Amount" v-if="GoodsInfo.SellingPrice!=GoodsInfo.Price">￥{{ GoodsInfo.SellingPrice }}</span>
      </div>
      <h1 class="title">{{ GoodsInfo.GoodsName }}</h1>
      <div class="data">
        <!-- <span class="spend"><span v-if="1-GoodsInfo.IntegralMaxRatio>0">￥{{ GoodsInfo.Price * parseInt((1-GoodsInfo.IntegralMaxRatio)*100)/100}}</span><span v-if="GoodsInfo.IntegralMaxRatio<1&&GoodsInfo.IntegralMaxRatio>0"> + </span><span v-if="GoodsInfo.IntegralMaxRatio>0">{{ parseInt(GoodsInfo.Price *GoodsInfo.IntegralMaxRatio* IntegralExchange*100)/100 }}积分</span></span> -->
        <!-- <span class="Amount">市场价：￥{{ GoodsInfo.Price }}</span> -->
        <span class="tag" v-if="GoodsInfo.LimitNumber!=0">限购{{GoodsInfo.LimitNumber}}份</span>
        <span class="num" v-if="GoodsInfo.OrderCount!=0">已售 {{GoodsInfo.SalesVolume}}</span>
        <span class="num">
          库存 {{(GoodsInfo.EffectiveStock > GoodsInfo.Stock? GoodsInfo.Stock: GoodsInfo.EffectiveStock)>500?'充足':(GoodsInfo.EffectiveStock > GoodsInfo.Stock? GoodsInfo.Stock: GoodsInfo.EffectiveStock)}}
        </span>
      </div>
    </div>
    <!-- <div  class="division" v-if="GoodsInfo.GoodsCards && GoodsInfo.GoodsCards.length > 0"></div> -->
    <div class="box">
      <h5 class="title">商品卡券</h5>
      <div class="text">
        <div v-for="(card, index) in GoodsInfo.GoodsCards" :key="'usableCards' + index" class="cardlist">
          <p style="background:#fff;float:right" class="text">{{ card.GiveNumber }}张</p>
          <h6 class="cardtitle">{{ card.CardName }}</h6>
        </div>
        <div class="notuse" v-if="false">
          <ul class="list">
            <li
              v-for="(card, index) in GoodsInfo.GoodsCards"
              :key="'usableCards' + index"
            >
              <div class="item">
                <div class="msg">
                  <div class="text-box">
                    <h6 class="cardtitle">{{ card.CardName }}</h6>
                    <p class="condition">
                      使用条件：消费满{{ card.SatisfyAmount }}元可用
                    </p>
                  </div>
                </div>
                <div class="select-box">
                  <p style="background:#fff" class="text">{{ card.GiveNumber }}张</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- <p class="text">{{GoodsInfo.Content}}</p> -->
    </div>
    <!-- int end -->
    <!-- detail -->
    <div
      class="detail"
      v-if="GoodsInfo.PictureMove && GoodsInfo.PictureMove.length > 0"
    >
      <div
        class="img"
        v-for="(item, index) in GoodsInfo.PictureMove"
        :key="index"
      >
        <img :src="item" />
      </div>
      <!-- <p class="text">{{GoodsInfo.Content}}</p> -->
    </div>
    <div class="box" style="font-size:14px">
      <!-- <h5 class="title">商品详情</h5> -->
      <div v-html="GoodsInfo.Content" class="cardcontent"></div>
      <!-- {{ GoodsInfo.Content.replace("<","&lt;").replace(">","&gt;") }} -->
    </div>
      <!-- <div class="text"> -->
        <!-- <p style="line-height: 150%;padding:6px;white-space: pre-line;">{{ GoodsInfo.Content }}</p> -->
      <!-- </div> -->
    <!-- detail end -->
    <div class="btn-box">
      <div class="btn_disable" v-if="expire">商品已失效</div>
      <div class="btn_disable" v-else-if="GoodsInfo.EffectiveStock == 0">商品已售罄</div>
      <div class="btn_disable" v-else-if="GoodsInfo.LimitNumber==GoodsInfo.OrderCount && GoodsInfo.LimitNumber != 0">已达到限兑数量</div>
      <router-link v-else class="btn" :to="{ name: 'GoodsPay', query: { GoodsCode: GoodsInfo.GoodsCode }}">立即购买</router-link>
      <!-- <div class="btn_disable" v-if="Member.IntegralBalance < (GoodsInfo.Price *IntegralExchange*parseInt(GoodsInfo.IntegralMaxRatio*100)/100)">
        积分不足
      </div> -->
    </div>
  </div>
</template>

<script>
import { GetGoodsInfo } from "@/api/GoodsShop";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { Toast, Indicator } from "mint-ui";

export default {
  name: "GoodsInfo",
  computed: {
    ...mapGetters([
      "MemberCode",
      "MediaService",
      "StoreCode",
      "Member",
      "DeskID",
      "BusinessConfig"
    ]),
    expire() {
      return moment(this.GoodsInfo.EndTime) < moment();
    }
  },
  data() {
    return {
      moment,
      shop: {}, // 商品详情
      GoodsCode: "",
      GoodsInfo: {}, //商品详情
      IntegralExchange: 10, //1元人民币兑换多少积分
      loadding: 0
    };
  },
  created() {
    // 请求数据
    Indicator.open("加载中...");
    this.loadding = this.loadding + 1;
    this.NeedMember().then(res => {
      this.loadding = this.loadding + 1;
      this.NeedBusinessConfig().then(res2 => {
        this.IntegralExchange = this.$store.getters.BusinessConfig.IntegralExchange;
        this.loadding = this.loadding - 1;
      });
      this.GoodsCode = this.$route.query.GoodsCode;
      var params = {};
      params.GoodsCode = this.GoodsCode;
      params.MemberCode=this.Member.MemberCode;
      params.OnlyNotExpired = 1;
      params.OnlyOnShelves = 1;
      GetGoodsInfo(params)
        .then(res => {
          if (res.state == 200) {
            var pics = [];
            res.data.PictureMove = JSON.parse(res.data.PictureMove);
            res.data.PictureMove.forEach(item => {
              item = this.MediaService + item;
              pics.push(item);
            });
            res.data.PictureMove = pics;
            this.GoodsInfo = res.data;
          } else {
            Toast({
              message: res.state + "-" + res.msg,
              position: "top",
              duration: 2000
            });
          }
        })
        .finally(res => {
          this.loadding = this.loadding - 1;
        });
    });
  },
  methods: {
    ...mapActions(["NeedMember", "NeedBusinessConfig"]),
    DayFormart(time) {
      return time
        .replace("/", "-")
        .replace("/", "-")
        .replace(" 0:00:00", "");
    }
  },
  watch: {
    loadding(newValue, oldValue) {
      if (newValue == 0) {
        Indicator.close();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$main: #ffbb05;
$red: #e2704c;
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
.box{margin: 16px;background: #fff;padding: 16px;border-radius: 10px;}
.cardlist{font-size:14px;padding:10px 0}
.container {
  padding-bottom: 70px;
}
.manay {
  .spend {
    color: $red;
    line-height: 1;
    font-size: 24px;
    display: inline-block;
  }

  .num {
    font-size: 12px;
    color: $grey;
    display: inline-block;
    margin-right: 20px;
  }
  .discription {
    font-size: 12px;
    color: $grey;
    display: inline-block;
  }
}
.Amount {
  display: inline-block;
  margin-left: 5px;
  color: $grey;
  font-size: 12px;
  text-decoration: line-through;
  text-align: -webkit-center;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/* int */
.int {
  // padding: 0px 0px 12px;

  .img {
    width: 100%;
    height: 260px;
    overflow: hidden;
    // @include border-radius(5px);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    img {
      width: 100%;
      display: block;
    }
  }
}

  .title {
    font-size: 18px;
    overflow: hidden;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 30px;
  }

  .data {
    .spend {
      color: $red;
      line-height: 1;
      font-size: 22px;
      display: inline-block;
    }
    .tag{
      font-size: 10px;
      background-color: #feede3;
      color: #bc652d;
      border-radius: 3px;
      padding: 5px;
      font-weight: 500;
    }
    .num {
      font-size: 12px;
      color: $grey;
      display: inline-block;
      margin-left: 5px;
      padding: 5px;
      float: right;
    }
    .discription {
      font-size: 12px;
      color: $grey;
      display: inline-block;
    }
  }

/* int end */
.notuse {
  // padding: 12px 10px;
  max-height: 170px;
  overflow-y: auto;
  li {
    margin-top: 10px;
    &:first-child {
      margin-top: 0;
    }
  }

  .item {
    height: 60px;
    padding-right: 60px;
    position: relative;
    display: block;

    .msg {
      width: 100%;
      height: 60px;
      background: #fff;
      padding: 10px;
      @include border-radius(10px);
      -webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);
      -moz-box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);

      // .img {
      //     width: 90px;
      //     height: 90px;
      //     float: left;
      //     overflow: hidden;
      //     @include border-radius(5px);

      //     img {
      //         width: 100%;
      //         display: block;
      //     }
      // }

      .text-box {
        margin-left: 5px;
        padding-top: 5px;

        .cardtitle {
          font-size: 14px;
          line-height: 1;
          margin-bottom: 10px;
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

        .tip {
          font-size: 12px;
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
      -webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);
      -moz-box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);

      .text {
        width: 60px;
        height: 100%;
        line-height: 60px;
        text-align: center;
        font-size: 12px;
        color: $grey;
        letter-spacing: 1px;
        margin-top: 0;
        margin-left: 0;
        border-radius: 10px;
      }
    }
  }
}
/* detail */
.detail {
  padding: 12px 10px;

  .title {
    padding-left: 10px;
    font-size: 14px;
    line-height: 1;
    position: relative;
    margin-bottom: 15px;

    &:before {
      content: "";
      width: 3px;
      height: 14px;
      margin-top: -7px;
      position: absolute;
      top: 50%;
      left: 0;
      background: $main;
      @include border-radius(2px);
    }
  }

  .img {
    width: 100%;
    overflow: hidden;
    // @include border-radius(5px);
    // margin-top: 15px;

    img {
      width: 100%;
      display: block;
    }
  }

  .text {
    font-size: 14px;
    line-height: 20px;
    color: $grey;
    // margin-top: 10px;
    // margin-left: 12px;
    margin:10px 0 5px 0px;
  }
}

/* detail end */
.btn-box {
  height: 60px;
  padding: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;

  .btn {
    width: 100%;
    height: 40px;
    background: $main;
    line-height: 40px;
    text-align: center;
    @include border-radius(25px);
    font-size: 14px;
    display: block;
    color: white;
  }
  .btn_disable {
    width: 100%;
    height: 40px;
    background: #9e9d9d;
    line-height: 40px;
    text-align: center;
    color: #fff;
    @include border-radius(25px);
    font-size: 14px;
    display: block;
  }
}

</style>

<style >
.cardcontent h3{font-size: 18px; font-weight: 700; line-height: 30px;}
.cardcontent div{margin-bottom: 16px;white-space: pre-line;line-height: 24px;font-size: 14px;}
</style>