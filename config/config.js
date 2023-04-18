// 测试
const BaseUrl = 'http://fengchen180.imwork.net:33215';
const BaseUrl1 = 'http://fengchen180.imwork.net:33215';
const WeiXinUrl = 'http://fengchen180.imwork.net';

// 生产
// const BaseUrl = 'https://fengchen180.imwork.net:33215';
// const BaseUrl1 = 'https://fengchen180.imwork.net:33215';
// const WeiXinUrl = 'https://fengchen180.imwork.net';
const config = {
 BaseUrl,
 WeiXinUrl,
 StaticUrl: BaseUrl1 + "/MobileStatic/",
 Timeout: 60 * 1000,
}

export default config