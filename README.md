# btch-downloader Workers

Cloudflare Workers 包装器，用于 btch-downloader 库，支持从各大社交平台下载媒体内容。

## 快速开始

### 安装依赖
```bash
npm install
```

### 本地开发
```bash
npm run dev
```

### 部署到 Cloudflare
```bash
npm run deploy
```

## API 端点

访问 `/api/docs` 查看完整的 API 文档。

### Instagram 下载
```bash
curl "https://your-worker.workers.dev/api/instagram?url=https://www.instagram.com/reel/DKPtUL_S9Nh/"
```

### TikTok 下载
```bash
curl "https://your-worker.workers.dev/api/tiktok?url=https://www.tiktok.com/@user/video/123"
```

### YouTube 下载
```bash
curl "https://your-worker.workers.dev/api/youtube?url=https://youtu.be/C8mJ8943X80"
```

### 小红书下载
```bash
curl "https://your-worker.workers.dev/api/xiaohongshu?url=http://xhslink.com/o/21DKXV988zp"
```

### YouTube 搜索
```bash
curl "https://your-worker.workers.dev/api/yts?q=Somewhere%20Only%20We%20Know"
```

## 缓存功能

默认启用缓存。禁用缓存：
```bash
curl "https://your-worker.workers.dev/api/instagram?url=...&cache=false"
```

## 环境变量

编辑 `wrangler.toml` 配置：
- `BACKEND_URL`: 后端 API 地址（默认：https://backend1.tioo.eu.org）
- `LOG_LEVEL`: 日志级别（info/debug/warn/error）

## 支持的平台

- Instagram (Reels, Posts, TV, Stories)
- TikTok
- YouTube
- Facebook
- Twitter / X
- CapCut
- Google Drive
- Pinterest
- Douyin
- Xiaohongshu (小红书)
- SnackVideo
- Cocofun
- Spotify
- SoundCloud
- Threads
- Kuaishou
- YouTube Search

## 许可证

MIT
