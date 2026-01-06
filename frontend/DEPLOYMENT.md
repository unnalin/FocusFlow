# 前端部署指南

## 环境变量配置

### 本地开发

默认配置会自动连接到本地后端:

```bash
VITE_API_URL=http://localhost:8000
```

### 生产环境

部署到生产环境时,需要设置 `VITE_API_URL` 指向后端 API 地址:

```bash
# 方式 1: 只设置基础 URL (推荐)
VITE_API_URL=https://api.yourdomain.com

# 方式 2: 设置完整路径
VITE_API_URL=https://your-backend.railway.app/api/v1
```

**注意**:
- 如果只设置基础 URL,代码会自动添加 `/api/v1` 后缀
- 如果 URL 已包含 `/api/v1`,则不会重复添加

## 常见部署平台配置

### Vercel

1. 在项目设置中添加环境变量:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.railway.app`

2. 构建配置:
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. 重新部署项目

### Netlify

1. 在 Site settings > Environment variables 中添加:
   ```
   VITE_API_URL=https://your-backend.render.com
   ```

2. 构建配置 (netlify.toml):
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### GitHub Pages

1. 创建 `.env.production` 文件:
   ```bash
   VITE_API_URL=https://your-backend.com
   ```

2. 使用 GitHub Actions 部署时,在 workflow 中设置环境变量:
   ```yaml
   - name: Build
     env:
       VITE_API_URL: ${{ secrets.VITE_API_URL }}
     run: npm run build
   ```

### Cloudflare Pages

在项目设置中添加环境变量:
```
VITE_API_URL=https://your-backend.com
```

## 构建步骤

### 本地构建

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 生产构建

```bash
# 设置环境变量并构建
VITE_API_URL=https://your-backend.com npm run build
```

构建产物会生成在 `dist` 目录中。

## 环境变量说明

### VITE_API_URL (推荐)

指向后端 API 的 URL:

```bash
# 开发环境
VITE_API_URL=http://localhost:8000

# 生产环境
VITE_API_URL=https://api.yourdomain.com
```

### VITE_API_BASE_URL (向后兼容)

旧版本的变量名,仍然支持:

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

优先级: `VITE_API_URL` > `VITE_API_BASE_URL` > 默认值

### VITE_ENABLE_DEBUG

启用调试模式:

```bash
VITE_ENABLE_DEBUG=true  # 开发环境
VITE_ENABLE_DEBUG=false # 生产环境
```

## 自动化配置

### 环境检测

前端会自动:
- 在开发模式下连接 `localhost:8000`
- 在生产模式下使用 `VITE_API_URL` 环境变量
- 在控制台显示当前使用的 API URL (仅开发模式)

### URL 处理

代码会智能处理 URL:
- 自动添加 `/api/v1` 后缀(如果需要)
- 支持带端口号的 URL
- 支持完整路径的 URL

## 故障排查

### API 请求失败

1. 检查 `VITE_API_URL` 是否正确设置
2. 打开浏览器控制台,查看 "API Base URL" 日志
3. 确认后端 CORS 已配置前端域名
4. 检查网络请求是否到达正确的 URL

### 环境变量不生效

1. **重要**: Vite 环境变量必须以 `VITE_` 开头
2. 修改 `.env` 文件后需要重启开发服务器
3. 构建时确保环境变量已正确设置
4. 检查是否有多个 `.env` 文件冲突

### CORS 错误

如果看到 CORS 错误:
1. 确认后端 `ALLOWED_ORIGINS` 包含前端域名
2. 检查前端域名是否包含协议 (http:// 或 https://)
3. 确认后端服务正在运行

## 完整部署示例

### Railway (Backend) + Vercel (Frontend)

**Backend (Railway)**:
```bash
DATABASE_URL=postgresql+asyncpg://...
ALLOWED_ORIGINS=https://yourapp.vercel.app
ENVIRONMENT=production
```

**Frontend (Vercel)**:
```bash
VITE_API_URL=https://your-backend.railway.app
```

### Render (Backend) + Netlify (Frontend)

**Backend (Render)**:
```bash
DATABASE_URL=postgresql+asyncpg://...
ALLOWED_ORIGINS=https://yourapp.netlify.app
ENVIRONMENT=production
```

**Frontend (Netlify)**:
```bash
VITE_API_URL=https://your-backend.onrender.com
```

## 安全建议

1. 不要在前端代码中硬编码 API URL
2. 使用环境变量管理所有配置
3. 在生产环境使用 HTTPS
4. 定期更新依赖包
5. 启用 CSP (Content Security Policy) 头部

## 性能优化

1. 启用 Vite 的代码分割
2. 使用 CDN 加速静态资源
3. 启用 Gzip/Brotli 压缩
4. 配置缓存策略
5. 使用懒加载优化首屏加载

## 监控和日志

在生产环境中,考虑集成:
- Sentry (错误追踪)
- Google Analytics (用户分析)
- LogRocket (会话重放)
- Datadog (性能监控)
