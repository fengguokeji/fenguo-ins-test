# 部署指南

## 前置要求

- Node.js 20+
- npm 或 yarn
- Cloudflare 账户
- Wrangler CLI

## 安装步骤

### 1. 安装 Wrangler

```bash
npm install -g @cloudflare/wrangler
```

### 2. 克隆或下载项目

```bash
git clone <your-repo-url>
cd btch-workers
```

### 3. 安装依赖

```bash
npm install
```

### 4. 认证 Cloudflare

```bash
wrangler login
```

这会打开浏览器进行授权。

### 5. 创建 KV 命名空间（可选但推荐）

用于缓存媒体下载结果：

```bash
# 创建生产环境 KV
wrangler kv:namespace create CACHE_STORE

# 创建预览环境 KV
wrangler kv:namespace create CACHE_STORE --preview
```

记下输出的 ID，更新 `wrangler.toml` 中的 KV ID：

```toml
[[kv_namespaces]]
binding = "CACHE_STORE"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"
```

### 6. 本地测试

```bash
npm run dev
```

在 `http://localhost:8787` 测试 API：

```bash
# 测试 Instagram
curl "http://localhost:8787/api/instagram?url=https://www.instagram.com/reel/DKPtUL_S9Nh/"

# 测试健康检查
curl http://localhost:8787/health

# 查看 API 文档
curl http://localhost:8787/api/docs
```

### 7. 部署到 Cloudflare

```bash
npm run deploy
```

部署完成后，您将获得一个 Worker URL，格式为：
```
https://btch-workers.<your-account>.workers.dev
```

## 环境配置

### 生产环境变量

在 `wrangler.toml` 中配置：

```toml
[env.production]
vars = {
  BACKEND_URL = "https://backend1.tioo.eu.org",
  LOG_LEVEL = "info"
}
```

### 开发环境变量

```toml
[env.development]
vars = {
  BACKEND_URL = "https://backend1.tioo.eu.org",
  LOG_LEVEL = "debug"
}
```

## 使用示例

### 获取 Instagram 内容

```bash
curl -X GET "https://your-worker.workers.dev/api/instagram" \
  -G --data-urlencode "url=https://www.instagram.com/reel/DKPtUL_S9Nh/"
```

响应示例：
```json
{
  "status": true,
  "developer": "@prm2.0",
  "result": [
    {
      "thumbnail": "https://...",
      "url": "https://..."
    }
  ]
}
```

### 获取 TikTok 内容

```bash
curl -X GET "https://your-worker.workers.dev/api/tiktok" \
  -G --data-urlencode "url=https://www.tiktok.com/@user/video/123"
```

### 使用缓存

默认启用缓存（3600秒）。禁用缓存：

```bash
curl "https://your-worker.workers.dev/api/instagram?url=...&cache=false"
```

## 监控和日志

### 查看实时日志

```bash
wrangler tail
```

### 查看部署历史

```bash
wrangler deployments list
```

## 故障排除

### 问题 1: 部署失败

**症状**: `npm run deploy` 失败

**解决**:
```bash
# 清空缓存
rm -rf node_modules dist
npm install
npm run build
wrangler deploy
```

### 问题 2: 后端不可用

**症状**: API 返回 500 错误

**检查**:
```bash
curl https://backend1.tioo.eu.org/health
```

如果后端不可用，考虑配置备用后端。

### 问题 3: 缓存问题

**症状**: 同一 URL 多次请求返回相同结果

**解决**: 添加 `&cache=false` 参数绕过缓存

## 成本估算

Cloudflare Workers 定价（2024）：
- **免费套餐**: 10万请求/天，30ms CPU
- **Pro 套餐**: $5/月，无请求限制，30s CPU

## 性能优化

1. **启用缓存**: 默认缓存 1 小时，减少后端调用
2. **使用 Cloudflare CDN**: 自动缓存 HTTP 响应
3. **监控性能**: 使用 Wrangler 分析指标

## 更新和维护

### 更新依赖

```bash
npm update
npm run build
wrangler deploy
```

### 回滚部署

```bash
wrangler rollback
```

## 支持

遇到问题？
1. 查看 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
2. 查看 [btch-downloader 文档](https://btch.foo.ng/)
3. 提交 [GitHub Issue](https://github.com/hostinger-bot/btch-downloader/issues)
