<template>
  <div class="container">
    <div class="thanks">感谢您光临本店 请对本次用餐进行评价</div>
    <div class="division"></div>
    <!-- paymsg -->
    <div class="paymsg">
      <h5 class="title">消费信息</h5>
      <div class="paymsg-list">
        <ul class="msg-list">
          <li class="msg-item">
            <p class="text">账单编号</p>
            <p class="cot">{{BillInfo.BillCode}}</p>
          </li>
          <li class="msg-item">
            <p class="text">用餐门店</p>
            <p class="cot">{{BillInfo.StoreName}}</p>
          </li>
          <li class="msg-item">
            <p class="text">消费金额</p>
            <p class="cot">￥{{BillInfo.Amount/1}}</p>
          </li>
          <li class="msg-item">
            <p class="text">结账时间</p>
            <p class="cot">{{ dateFormart(BillInfo.BillCashierTime,'YYYY-MM-DD HH:mm:ss') }}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- paymsg end -->
    <div class="division"></div>
    <!-- meal-comment -->
    <div class="meal-comment">
      <h5 class="title">用餐评价</h5>
      <div class="star-box">
        <div class="star-item" v-for="(item,index) in mealstarlist" :key="index">
          <p class="text">{{item.Title}}</p>
          <div class="star-list">
            <i
              class="iconfont iconwujiaoxingquanxing"
              :class="{'active':item.ScoreNumber > 0}"
              data-index="0"
              @click="meal(index,1)"
            ></i>
            <i
              class="iconfont iconwujiaoxingquanxing"
              :class="{'active':item.ScoreNumber > 1}"
              data-index="1"
              @click="meal(index,2)"
            ></i>
            <i
              class="iconfont iconwujiaoxingquanxing"
              :class="{'active':item.ScoreNumber > 2}"
              data-index="2"
              @click="meal(index,3)"
            ></i>
            <i
              class="iconfont iconwujiaoxingquanxing"
              :class="{'active':item.ScoreNumber > 3}"
              data-index="3"
              @click="meal(index,4)"
            ></i>
            <i
              class="iconfont iconwujiaoxingquanxing"
              :class="{'active':item.ScoreNumber > 4}"
              data-index="4"
              @click="meal(index,5)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <!-- meal-comment end -->
    <div class="division"></div>
    <!-- food-comment -->
    <div class="food-comment">
      <h5 class="title">菜品评价</h5>
      <div class="star-box">
        <div class="star-item" v-for="(item,index) in foodstarlist" :key="index">
          <p class="text">{{item.DishName}}</p>
          <div class="help-list">
            <div class="good" :class="{'active':item.Value == 'Good'}" @click="good(index)">
              <i class="iconfont icongood_active"></i>
              <p class="text">赞</p>
            </div>
            <div class="bad" :class="{'active':item.Value =='Bad'}" @click="bad(index)">
              <i class="iconfont icongood_active-copy"></i>
              <p class="text">踩</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- food-comment end -->
    <div class="division"></div>
    <!-- comment-cot -->
    <form action method class="comment-form" id="comment-form" @submit.prevent="submit">
      <div class="comment-cot">
        <h5 class="title">菜品评价</h5>
        <div class="cot-box">
          <textarea name="cot" placeholder="您的评价有助于我们提供更好的服务" v-model="Info"></textarea>
        </div>
      </div>
      <div class="submit-box">
        <input type="submit" value="提交评价" class="submit" />
      </div>
    </form>
    <!-- comment-cot end -->
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "mint-ui";
import { GetCommentRules, SubmitComment } from "@/api/bill";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "comment",
  data() {
    return {
      BillID: "", //账单ID
      BillInfo: {}, //账单详情
      msglist: [], // 消费信息
      mealstarlist: [], // 用餐评价
      foodstarlist: [], // 菜品评价
      Info: "" // 评论内容
    };
  },
  computed: {
    ...mapGetters(["MemberCode", "StoreCode", "DeskID", "Member"])
  },
  created() {
    // 请求数据
    this.$axios
      .get("../static/js/data.json")
      .then(res => {
        this.msglist = res.data.getPayMsg;
      })
      .catch(err => console.log);
    this.BillID = this.$route.query.BillID;
    var parameter = {};
    parameter.BillID = this.BillID;
    parameter.MemberCode = this.MemberCode;
    GetCommentRules(parameter).then(res => {
      console.log("res", res);
      if (res.state == 200) {
        if (res.data == "已存在评价记录") {
          this.$router.push({
            name: "BillDetail",
            query: {
              BillID: this.BillID
            }
          });
        } else {
          this.BillInfo = res.data;
          res.data.ComItems.forEach(item => {
            item.ScoreNumber = item.DefaultScore;
          });
          this.mealstarlist = JSON.parse(JSON.stringify(res.data.ComItems));
          res.data.ComDishs.forEach(item => {
            item.Value = null;
          });
          this.foodstarlist = JSON.parse(JSON.stringify(res.data.ComDishs));
          console.log("mealstarlist", this.mealstarlist);
          console.log("foodstarlist", this.foodstarlist);
        }
      }
    });
  },
  methods: {
    //时间转化函数
    dateFormart(time, formart) {
      return moment(time).format(formart);
    },
    // 用餐评价
    meal(index, num) {
      console.log(this.mealstarlist, index, num);
      this.mealstarlist[index].ScoreNumber = num;
      //Vue.set(this.mealstarlist, index, this.mealstarlist[index]);
    },
    submit() {
      var parameter = {};
      parameter.ComItems = [];
      this.mealstarlist.forEach(item => {
        parameter.ComItems.push({
          CommentItemCode: item.CommentItemCode,
          Title: item.Title,
          ScoreNumber: item.ScoreNumber
        });
      });
      parameter.ComDishs = [];
      this.foodstarlist.forEach(dish => {
        if (dish.Value != null) {
          parameter.ComDishs.push({
            DishID: dish.DishID,
            DishName: dish.DishName,
            Value: dish.Value
          });
        }
      });
      parameter.BillID = this.BillID;
      parameter.MemberCode = this.MemberCode;
      parameter.Info = this.Info;
      SubmitComment(parameter).then(res => {
        console.log("res", res);
        if (res.state == 200) {
          Toast({
            message: "提交成功，感谢您的评价！",
            position: "middle",
            duration: 1000
          });
          let w=this;
          setTimeout(function() {
            w.$router.push({
              name: "BillDetail",
              query: {
                BillID: w.BillID
              }
            });
          }, 1000);
        } else {
          Toast({
            message: "提交失败，请稍后重试！",
            position: "middle",
            duration: 2000
          });
        }
      });
    },
    good(index) {
      this.foodstarlist[index].Value = "Good";
    },
    bad(index) {
      this.foodstarlist[index].Value = "Bad";
    }
  }
};
</script>

<style lang="scss" scoped>
$main: #ffbb05;
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

.thanks {
  height: 45px;
  line-height: 45px;
  text-align: center;
  font-size: 14px;
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
      // color: $grey;
      line-height: 1;
      font-size: 12px;
    }
  }
}

/* paymsg end */
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
      font-size: 14px;
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
          // color: #888;
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

  textarea {
    width: 100%;
    height: 75px;
    display: block;
    border: 1px solid #e6e6ea;
    @include border-radius(5px);
    padding: 10px;
    font-size: 12px;
    color: $grey;
    margin-top: 15px;
  }
}

.submit-box {
  padding: 10px 15px;
  background: #f2f2f6;

  .submit {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: $main;
    text-align: center;
    @include border-radius(25px);
    border: none;
    font-size: 14px;
  }
}

/* comment-cot end */
</style>
