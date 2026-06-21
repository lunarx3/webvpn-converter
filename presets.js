/**
 * presets.js - 校园 WebVPN 配置数据库
 * 
 * 欢迎补充你所在学校的配置！
 * 只需要在下方的 WEBVPN_PRESETS 数组中追加一个对象即可。
 * 
 * 格式说明:
 * {
 *     name: "学校名称 (简称)",
 *     host: "该校 WebVPN 的主域名",
 *     key: "网瑞达系统加密密钥 (默认为 wrdvpnisthebest!)"
 * }
 */

const WEBVPN_PRESETS = [
    {
        name: "电子科技大学 (UESTC)",
        host: "webvpn.uestc.edu.cn",
        key: "wrdvpnisthebest!"
    }
    // 欢迎在下方追加你的学校配置：
    /*
    {
        name: "演示大学 (Demo)",
        host: "webvpn.demo.edu.cn",
        key: "wrdvpnisthebest!"
    }
    */
];
