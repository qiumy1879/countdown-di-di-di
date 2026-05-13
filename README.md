# 智能倒计时应用

一个简洁美观的倒计时管理应用，帮助你管理重要事件，到期时自动播放音频提醒。

## 功能特性

- ✅ **添加倒计时** - 支持自定义时间或指定日期时间
- 🔔 **音频提醒** - 倒计时到期时自动播放提醒音
- 📋 **任务管理** - 标记完成、重新开始、删除倒计时
- 🔍 **搜索筛选** - 按标题搜索和按时间范围筛选
- 💾 **本地存储** - 数据自动保存到浏览器本地存储
- 🎨 **美观界面** - 响应式设计，支持移动端和桌面端

## 技术栈

- **React 18** - 前端框架
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **shadcn/ui** - UI 组件库
- **Lucide React** - 图标库

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:8080 查看应用。

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 预览生产版本

```bash
npm run preview
# 或
yarn preview
```

## 项目结构

```
.
├── public/
│   └── notification.mp3    # 音频提醒文件
├── src/
│   ├── components/
│   │   ├── ui/            # UI 组件库
│   │   ├── CountdownForm.jsx    # 添加倒计时表单
│   │   └── CountdownItem.jsx    # 倒计时项目组件
│   ├── hooks/
│   │   ├── useCountdowns.js     # 倒计时状态管理
│   │   └── useLocalStorage.js   # 本地存储 Hook
│   ├── lib/
│   │   ├── audio.js        # 音频播放工具
│   │   └── utils.js        # 工具函数
│   ├── pages/
│   │   └── Index.jsx       # 主页面
│   ├── App.jsx             # 应用入口
│   ├── main.jsx            # React 渲染入口
│   └── index.css           # 全局样式
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 使用说明

### 添加倒计时

1. 输入事件标题
2. 选择倒计时方式：
   - **自定义时间**：输入数值，选择单位（秒/分钟/小时/天/周/年）
   - **指定日期**：选择具体的日期和时间
3. 点击"添加倒计时"

### 管理倒计时

- **标记完成**：勾选复选框
- **重新开始**：过期的倒计时可点击重置按钮重新开始
- **删除**：点击删除按钮

### 搜索和筛选

- 使用搜索框按标题搜索
- 使用下拉菜单按时间范围筛选：
  - 全部
  - 一天内
  - 一周内
  - 一个月内
  - 一个月以外

## 开发说明

### 音频提醒机制

倒计时过期时会自动播放音频提醒，使用双重保障机制：

1. 首先尝试播放本地音频文件 `notification.mp3`
2. 如果失败，使用 Web Audio API 生成备用提示音

### 本地存储

应用使用 localStorage 持久化存储：
- `countdowns` - 所有倒计时数据
- `notifiedCountdowns` - 已提醒的倒计时 ID 列表

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
