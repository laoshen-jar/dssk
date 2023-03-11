<template>
<div>
    <nut-navbar :leftShow="false" :rightShow="false">会员信息</nut-navbar>
    <nut-cell title="会员卡号" :desc="'No.'+bindInfo.MemberNumber" :show-icon="false" id="Number">
    </nut-cell>
    <nut-cell title="会员姓名" :desc="bindInfo.MemberName?bindInfo.MemberName:'未填写'" :show-icon="false" id="Name">
    </nut-cell>
    <nut-cell title="储值余额" :desc="bindInfo.StoredBalance+'元'" :show-icon="false" id="Stored">
    </nut-cell>
    <nut-cell title="可用积分" :desc="bindInfo.IntegralBalance+'积分'" :show-icon="false" id="Integral">
    </nut-cell>
    <div class="content">
        <span>*</span>说明：实体卡绑定成功后，其余额和积分将自动转入微信会员账户！
    </div>
    <div class="bottom-group">
        <nut-button class="max" :disabled="disabled" shape="circle" @click="submit">绑定会员</nut-button>
    </div>

</div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { GetMember } from '@/api/member'
import { GetImportMember,BindMember,AddStored, AddIntegral} from '@/api/bind'
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
            bindInfo:{},
            disabled:false,
        }
    },
    created() {
        console.log('this.Member',this.Member)
        let params={}
        params.BusinessCode=this.Member.BusinessCode
        params.Phone=this.$route.query.Phone
        GetImportMember(params).then(res=>{
            if(res.state==200){
                this.bindInfo=res.data
            }else{
                console.log('this.bindInfo',res)
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
                    title: "绑定实体卡会员",
                    content: "即将绑定实体卡会员,绑定成功后实体卡会员将失效，确认继续？",
                    onOkBtn(event) {
                        this.close()
                        let params={}
                        params.MemberCode=that.Member.MemberCode
                        params.ImportMemberCode=that.bindInfo.ImportMemberCode
                        BindMember(params).then(a=>{
                            if(a.state==200){
                                Toast({
                                    message: '会员绑定成功！',
                                    position: 'middle',
                                    duration: 2000
                                });
                                GetMember({MemberCodeOrOpenID:that.Member.MemberCode}).then(res=>{
                                    if(res.state==200){
                                        that.$store.commit('set_Member', res.data);
                                        setTimeout(() => {that.$router.push({path: '/member',})}, 1000)
                                    }else{
                                        Toast({
                                            message: '更新会员失败！',
                                            position: 'middle',
                                            duration: 2000
                                        });
                                    }
                                })
                            }else{
                                Toast({
                                    message: '会员绑定失败！',
                                    position: 'middle',
                                    duration: 2000
                                });
                            }
                        }).catch(err=>{
                            Toast({
                                    message: err,
                                    position: 'middle',
                                    duration: 2000
                                });})
                        }
                });
        },
        rechargeStored(val){
            var params
            AddStored
        },
        rechargeIntegral(val){},
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
