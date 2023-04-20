// 测试
const BaseUrl = 'http://fengchen180.imwork.net:33215';
const BaseUrl1 = 'http://fengchen180.imwork.net:33215';
const WeiXinUrl = 'http://fengchen180.imwork.net';

// 生产
// const BaseUrl = 'http://open.dsskvip.com/API/';
// const BaseUrl1 = 'http://open.dsskvip.com/API/';
// const WeiXinUrl = 'http://open.dsskvip.com/API/';
const config = {
 BaseUrl,
 WeiXinUrl,
 StaticUrl: BaseUrl1 + "/MobileStatic/",
 Timeout: 60 * 1000,
}

export default config