<template>
<div>
    <nut-navbar :leftShow="false" :rightShow="false">会员信息</nut-navbar>
    <nut-cell title="会员卡号" :desc="'No.'+bindInfo.MemberNumber" :show-icon="false" id="Number">
    </nut-cell>
    <nut-cell title="绑定时间" :desc="moment(bindInfo.BindTime).format('YYYY-MM-DD HH:mm:ss')" :show-icon="false" id="BindTime">
    </nut-cell>
    <div class="division-line"></div>
    <nut-cell title="会员姓名" :desc="bindInfo.MemberName?bindInfo.MemberName:'未填写'" :show-icon="false" id="Name">
    </nut-cell>
    <nut-cell title="可用积分" :desc="bindInfo.IntegralBalance+'积分'" :show-icon="false" id="Integral">
    </nut-cell>
    <nut-cell title="储值余额" :desc="bindInfo.StoredBalance+'元'" :show-icon="false" id="Stored">
    </nut-cell>
    <div class="content">
        <span>*</span>说明：每个微信号只能绑定一个账号，如绑定其它会员，请解绑后再进行绑定操作！
    </div>
    <div class="bottom-group">
        <nut-button class="max" shape="circle" @click="submit">解绑会员</nut-button>
    </div>

</div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { GetBindInfo,RemoveBind } from '@/api/bind'
import moment from 'moment'
import { Toast } from 'mint-ui'
// import { Toast } from "@nutui/nutui";
export default {
    name: 'login',
    components: {},
    data() {
        return {
            moment,
            memberInfo: {
                phone: '',
                code: ''
            },
            bindInfo:{}
        }
    },
    created() {
        console.log('this.Member',this.Member)
        var params={}
        params.MemberCode=this.$route.query.MemberCode
        GetBindInfo(params).then(res=>{
            if(res.state==200){
                if(res.data){
                    this.bindInfo=res.data
                    console.log('this.bindInfo',this.bindInfo)
                }else{
                Toast({
                    message: '会员未绑定，请绑定会员！',
                    position: 'middle',
                    duration: 2000
                });
                }
            }else{
                console.log('res.data',res)
            }
        })
    }, 
    computed: {
        ...mapGetters(['Member','StoreCode', 'BusinessCode']),
        },
    methods: { 
        submit() {
                var that=this;
                this.$dialog({
                    cancelBtnTxt: '取消',
                    title: "解除微信绑定",
                    content: "即将解绑微信会员,确认继续？",
                    onOkBtn(event) {
                        var params = {}
                        params.MemberCode =that.$route.query.MemberCode
                        this.close()
                        RemoveBind(params).then(res => {
                            if (res.state == 200) {
                                Toast({
                                    message: '解绑成功！',
                                    position: 'middle',
                                    duration: 2000
                                });
                                setTimeout(() => {
                                        var me=that
                                        that.$router.push({
                                        path: '/member',
                                        query:{ MemberCode:me.$route.query.MemberCode}
                                        })}, 1000)
                            }else{
                                Toast({
                                    message: '解绑失败，请稍后重试！',
                                    position: 'middle',
                                    duration: 2000
                                });
                            }
                        })
                    }
                });
        },
        reloadPayg(msg) {
            this.$dialog({
                noCancelBtn: true,
                okBtnTxt: '好的',
                title: msg,
                onOkBtn(event) {
                    window.location.reload();
                },
            });
        }
    }
}
</script>

<style scoped>
.content {
    color: gray;
    font-size: 12px;
    margin: 10px 10px;
}

.content span {
    color: red;
    font-size: 12px;
}

.bottom-group {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 10px;
}

.bottom-group .nut-button.max {
    width: 100%;
}

.inputlable {
    width: 90px;
    display: block;
    float: left;
    line-height: 40px;
}

.mast {
    color: red;
    margin-right: 5px;
    line-height: 100%;
    vertical-align: text-bottom;
}

.cell_error.inputCell {
    border: none;
}

.cell_error.inputCell input {
    border: red 1px dashed;
}

.cell_error {
    border: red 1px dashed;
}
</style>
