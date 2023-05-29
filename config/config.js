// 金石
// const BaseUrl = 'http://open.jinshi.yubustep.cn';
// const BaseUrl1 = 'http://open.jinshi.yubustep.cn';
// const WeiXinUrl = 'http://weixin.jinshi.yubustep.cn';
// 测试
const BaseUrl = 'http://fengchen180.imwork.net:33215';
const BaseUrl1 = 'http://fengchen180.imwork.net:33215';
const WeiXinUrl = 'http://fengchen180.imwork.net';

// 生产
// const BaseUrl = 'https://mini.dsskvip.com';
// const BaseUrl1 = 'https://mini.dsskvip.com';
// const WeiXinUrl = 'https://mini.dsskvip.com/WeiXin';
const config = {
 BaseUrl,
 WeiXinUrl,
 StaticUrl: BaseUrl1 + "/MobileStatic/",
 Timeout: 60 * 1000,
}

export default config