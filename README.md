# 校园内网 WebVPN 智能转换器 (WebVPN Smart Link Converter)

[English](#english) | [中文说明](#中文说明)

---

## 中文说明

这是一个**纯前端运行、零服务器传输、保护隐私**的校园网 WebVPN 链接转换工具。主要用于帮助高校学生与科研人员在校外快速生成并跳转访问内网 IP 或域名，省去手动登录 WebVPN 门户再逐次寻找链接的繁琐过程。

### 🌟 项目特性

- **100% 本地运算 (Client-Side Only)**：所有 AES-128-CFB 加密逻辑和链接生成过程全部在浏览器端（用户本地设备）完成。没有任何网络请求会被发送至任何后端服务器，数据不会离开用户设备，保障数据及内网学术资源的绝对安全与隐私。
- **免安装、即开即用**：无需配置 Python、Node.js 等后端运行环境，直接双击网页文件或部署至任意静态托管空间（如 Nginx、GitHub Pages、OSS）即可使用。
- **极简多校适配**：支持针对不同高校的 WebVPN 网关进行自定义配置（自定义 Host 和加密 Key）。
- **离线运行与本地历史**：支持将转换历史保存在浏览器的 `localStorage` 中，支持离线环境运行。

---

### 📂 项目结构

```text
webvpn-converter/
├── index.html        # 主网页结构 (加载 Web UI)
├── style.css         # 现代暗黑风与玻璃拟态 UI 样式
├── script.js         # 前端交互与 AES 加密核心逻辑
├── presets.js        # 💡 各校 WebVPN 预设配置文件（支持协同补充）
└── README.md         # 说明文档
```

---

### 🚀 如何部署

由于该项目是**纯静态项目**，无需任何后端配置，你可以选用以下任意一种方式进行部署：

#### 1. 本地直接使用
直接下载该文件夹，双击 `index.html`，即可在本地浏览器中正常运行全部功能（甚至在断网情况下也可进行链接转换）。

#### 2. 使用 Nginx / Apache 部署
将整个文件夹上传到你云服务器的静态资源目录中，并为 Nginx 添加静态站配置：
```nginx
server {
    listen 80;
    server_name your-domain.com; # 替换为你的服务器域名

    location / {
        root /path/to/webvpn-converter; # 替换为你的文件上传路径
        index index.html;
    }
}
```

---

### 🤝 如何补充你所在学校的配置？

本项目鼓励开源协同，你可以非常方便地在配置文件中增加你所在学校的 WebVPN 预设，从而方便同校师生使用：

1. 打开 [presets.js](presets.js) 文件。
2. 仿照已有格式，在 `WEBVPN_PRESETS` 数组中追加一个你学校的配置对象：
   ```javascript
   const WEBVPN_PRESETS = [
       {
           name: "电子科技大学 (UESTC)",
           host: "webvpn.uestc.edu.cn",
           key: "wrdvpnisthebest!"
       },
       // 在这里追加你的学校配置：
       {
           name: "你学校的名字 (简称)",
           host: "你的学校WebVPN主域名 (如 webvpn.xxxx.edu.cn)",
           key: "你们学校的WebVPN解密密钥 (默认为 wrdvpnisthebest!)"
       }
   ];
   ```
3. 提交一个 Pull Request，合并入主分支！

---

<span id="english"></span>

## English

A **pure client-side, zero-server-transmission, privacy-first** WebVPN link converter for university intranets. It helps students and researchers off-campus quickly generate and jump to intranet resources (IPs or domains) through WebVPN.

### 🌟 Key Features

- **100% Local Cryptography**: All AES-128-CFB encryption operations are executed locally in the user's browser context via CryptoJS. No user inputs or decrypted URLs are sent to any remote server or cloud backend.
- **Zero-Installation**: No server-side components (Python/Node/PHP) are needed. Just double-click the HTML file or host it as a static folder.
- **Fully Customizable presets**: Easy to extend for different institutions by specifying the WebVPN host and crypt key.
- **Offline & Storage Support**: Conversion histories are kept strictly inside the browser's `localStorage` sandbox. Fully operational offline.

### 🤝 Contributing: How to Add Your School?

We welcome pull requests to add presets for more universities:

1. Open [presets.js](presets.js).
2. Append your university configuration object into the `WEBVPN_PRESETS` array:
   ```javascript
   const WEBVPN_PRESETS = [
       {
           name: "University Name (Abbr)",
           host: "webvpn.your-uni.edu.cn",
           key: "wrdvpnisthebest!" // Standard Wangruida default key
       }
   ];
   ```
3. Open a Pull Request!
