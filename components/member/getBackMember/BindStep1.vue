<template>
<div>
    <nut-navbar :leftShow="false" :rightShow="false">找回余额</nut-navbar>
    <nut-cell :show-icon="false" id="phone">
        <span slot="title">
            <nut-textinput placeholder="请输入手机号" :has-border="false" v-model="memberInfo.phone" class="inputCell" :clearBtn="true" @change="onChange('phone')" />
        </span>
    </nut-cell>
    <nut-cell :show-icon="false" id="code">
        <span slot="title">
            <nut-textinput type="text" :has-border="false" placeholder="请再次输入手机号" v-model="memberInfo.code" :clearBtn="true" :disabled="false" class="inputCell" @change="onChange('code')" />
        </span>
    </nut-cell>
    <div class="content">
        <span>*</span>说明：实体卡绑定成功后，其余额和积分将自动转入微信会员账户！
    </div>
    <div class="bottom-group">
        <nut-button class="max" shape="circle" @click="submit">下一步</nut-button>
    </div>

</div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { GetImportMember,BindMember,AddStored, AddIntegral,GetBindInfo} from '@/api/bind'
import { Toast } from 'mint-ui'
export default {
    name: 'login',
    components: {},
    data() {
        return {
            showCount:false,
            count:60,
            memberInfo: {
                phone: '',
                code: ''
            },
            importMember:{},
        }
    },
    created() {
            var params={}
            params.MemberCode=this.$route.query.MemberCode
            GetBindInfo(params).then(res=>{
                if(res.state==200){
                    if(res.data){
                        this.$router.push({
                            name: 'bindDetail',
                            query: {
                                MemberCode: this.$route.query.MemberCode
                            }
                        })
                    }
                }else{ 
                    Toast({
                        message: '获取会员绑定信息出错！',
                        position: 'middle',
                        duration: 2000
                    });
                }
            })
    }, 
    computed: {
        ...mapGetters(['Member','StoreCode', 'BusinessCode']),
        },
    methods: { 
        send(){
            this.showCount=true
            var interval=setInterval(() => {this.count=this.count-1;if(this.count==0){clearInterval(interval);this.showCount=false;this.count=60}}, 1000)
        },
        submit() {
            if (!this.memberInfo.phone) {
                this.$dialog({
                    noOkBtn: true,
                    cancelBtnTxt: '好的',
                    title: "请补充完善信息",
                    content: '手机号必填！'
                });
                this.setCellError("phone", true);
                return;
            }
            if (this.memberInfo.code!=this.memberInfo.phone) {
                this.$dialog({
                    noOkBtn: true,
                    cancelBtnTxt: '好的',
                    title: "请补充完善信息",
                    content: '两次手机号输入不一致，请重新输入！'
                });
                this.setCellError("code", true);
                return;
            } else {
                var paramsInfo={}
                paramsInfo.BusinessCode=this.Member.BusinessCode
                paramsInfo.Phone=this.memberInfo.phone
                GetImportMember(paramsInfo).then(res=>{
                    if(res.state==200){
                        if(res.data&&!res.data.BindMemberCode){
                            this.$router.push({
                                path: '/BindStep2',
                                query: {
                                    MemberCode: this.$route.query.MemberCode,
                                    Phone: this.memberInfo.phone
                                }
                            })
                                }else{
                                    Toast({
                                        message: '该实体卡数据不存在或已绑定！',
                                        position: 'middle',
                                        duration: 2000
                                    });
                                }
                    }
                })
                
                
            }
        },
        onChange(key) {
            if (key == 'phone' && this.memberInfo.phone != '') {
                this.setCellError("phone", false);
            }
            if (key == 'code' && this.memberInfo.code != '') {
                this.setCellError("code", false);
            }
        },
        setCellError(domID, add) {
            if (add) {
                document.getElementById(domID).classList.add("cell_error")
            } else {
                document.getElementById(domID).classList.remove("cell_error")
            }
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
