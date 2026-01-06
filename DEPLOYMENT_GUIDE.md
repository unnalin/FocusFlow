# FocusFlow 生产环境部署指南

这个文档将指导你完成 FocusFlow 项目的完整部署流程。

## 架构概述

- **前端**: React + TypeScript + Vite
- **后端**: FastAPI + Python
- **数据库**: PostgreSQL (生产) / SQLite (开发)

## 快速开始

### 1. 后端部署

推荐平台: Railway, Render, Heroku, Fly.io

#### 环境变量配置

在部署平台设置以下环境变量:

```bash
# 必需
DATABASE_URL=postgresql+asyncpg://user:password@host:port/dbname
ALLOWED_ORIGINS=https://your-frontend-domain.com
ENVIRONMENT=production

# 可选
PROJECT_NAME=FocusFlow
API_V1_PREFIX=/api/v1
```

#### Railway 部署步骤

1. 连接 GitHub 仓库
2. 选择 `backend` 目录作为根目录
3. 添加 PostgreSQL 插件
4. 设置环境变量:
   - `ALLOWED_ORIGINS`: 前端域名
   - `ENVIRONMENT`: production
   - `DATABASE_URL`: 会自动提供
5. 部署完成后记录后端 URL

#### Render 部署步骤

1. 创建新的 Web Service
2. 连接仓库,设置根目录为 `backend`
3. 配置:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
4. 添加 PostgreSQL 数据库
5. 设置环境变量
6. 部署

### 2. 前端部署

推荐平台: Vercel, Netlify, Cloudflare Pages

#### 环境变量配置

```bash
# 必需 - 指向后端 API
VITE_API_URL=https://your-backend.railway.app

# 可选
VITE_ENABLE_DEBUG=false
```

#### Vercel 部署步骤

1. 连接 GitHub 仓库
2. 设置根目录为 `frontend`
3. 构���配置:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. 添加环境变量 `VITE_API_URL`
5. 部署完成后,将前端域名添加到后端的 `ALLOWED_ORIGINS`

#### Netlify 部署步骤

1. 连接仓库,选择 `frontend` 目录
2. 构建配置:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. 设置环境变量
4. 部署

## 环境变量完整说明

### 后端环境变量

| 变量 | 必需 | 说明 | 示例 |
|------|------|------|------|
| `DATABASE_URL` | ✅ | PostgreSQL 连接字符串 | `postgresql+asyncpg://user:pass@host:5432/db` |
| `ALLOWED_ORIGINS` | ✅ | 前端域名列表(逗号分隔) | `https://app.example.com,https://www.example.com` |
| `ENVIRONMENT` | ✅ | 环境标识 | `production` |
| `PROJECT_NAME` | ❌ | 项目名称 | `FocusFlow` |
| `API_V1_PREFIX` | ❌ | API 路径前缀 | `/api/v1` |

### 前端环境变量

| 变量 | 必需 | 说明 | 示例 |
|------|------|------|------|
| `VITE_API_URL` | ✅ | 后端 API 地址 | `https://api.example.com` |
| `VITE_ENABLE_DEBUG` | ❌ | 是否启用调试 | `false` |

## 常见部署组合

### 组合 1: Vercel (前端) + Railway (后端)

**Backend (Railway)**:
```bash
DATABASE_URL=postgresql+asyncpg://...  # 自动生成
ALLOWED_ORIGINS=https://your-app.vercel.app
ENVIRONMENT=production
```

**Frontend (Vercel)**:
```bash
VITE_API_URL=https://your-backend.up.railway.app
```

### 组合 2: Netlify (前端) + Render (后端)

**Backend (Render)**:
```bash
DATABASE_URL=postgresql+asyncpg://...
ALLOWED_ORIGINS=https://your-app.netlify.app
ENVIRONMENT=production
```

**Frontend (Netlify)**:
```bash
VITE_API_URL=https://your-backend.onrender.com
```

### 组合 3: Cloudflare Pages (前端) + Fly.io (后端)

**Backend (Fly.io)**:
```bash
DATABASE_URL=postgresql+asyncpg://...
ALLOWED_ORIGINS=https://your-app.pages.dev
ENVIRONMENT=production
```

**Frontend (Cloudflare Pages)**:
```bash
VITE_API_URL=https://your-backend.fly.dev
```

## 部署检查清单

### 部署前

- [ ] 确认所有依赖都在 `requirements.txt` (后端) 和 `package.json` (前端)
- [ ] 测试本地构建: `npm run build` (前端) 和 `pip install -r requirements.txt` (后端)
- [ ] 确认环境变量配置正确
- [ ] 更新 `.env.example` 文件

### 后端部署后

- [ ] 检查数据库连接是否成功
- [ ] 访问 `/api/v1/health` 端点验证 API 可用
- [ ] 确认 CORS 配置正确
- [ ] 检查日志确认无错误

### 前端部署后

- [ ] 访问前端 URL 确认页面加载
- [ ] 打开浏览器控制台,确认 API URL 正确
- [ ] 测试关键功能(任务、计时器等)
- [ ] 检查网络请求是否正常

### 集成测试

- [ ] 前端能否正常调用后端 API
- [ ] 数据能否正常保存和读取
- [ ] 所有功能模块正常工作
- [ ] 移动端适配正常
- [ ] 不同浏览器兼容性

## 故障排查

### CORS 错误

**问题**: 前端无法访问后端 API

**解决**:
1. 确认后端 `ALLOWED_ORIGINS` 包含前端完整域名
2. 域名必须包含协议 (https://)
3. 检查是否有多余空格
4. 重启后端服务使配置生效

### 数据库连接失败

**问题**: 后端无法连接数据库

**解决**:
1. 验证 `DATABASE_URL` 格式正确
2. 确认使用 `postgresql+asyncpg://` 协议
3. 检查数据库服务是否运行
4. 验证网络连接和防火墙设置

### 环境变量不生效

**问题**: 配置的环境变量没有被应用

**解决**:
1. 前端变量必须以 `VITE_` 开头
2. 重新构建和部署应用
3. 清除构建缓存
4. 检查部署平台的环境变量设置界面

### API 请求超时

**问题**: 前端请求后端超时

**解决**:
1. 检查后端服务是否在运行
2. 验证 `VITE_API_URL` 地址正确
3. 检查网络连接
4. 增加请求超时时间 (在 `api.ts` 中)

## 更新和维护

### 更新后端

```bash
# 1. 推送代码到 GitHub
git push origin main

# 2. 部署平台会自动检测并重新部署
# 或手动触发部署

# 3. 运行数据库迁移(如果需要)
alembic upgrade head
```

### 更新前端

```bash
# 1. 推送代码到 GitHub
git push origin main

# 2. Vercel/Netlify 会自动部署
# 或手动触发部署
```

## 性能优化

### 后端优化

- 配置适当的数据库连接池大小
- 启用 Gzip 压缩
- 使用 CDN 加速 API 响应
- 配置缓存策略
- 监控 API 性能

### 前端优化

- 启用代码分割
- 使用懒加载
- 压缩静态资源
- 使用 CDN
- 配置浏览器缓存

## 安全建议

1. **使用 HTTPS** - 生产环境必须使用 HTTPS
2. **环境变量保密** - 不要提交敏感信息到代码仓库
3. **定期更新依赖** - 修复安全漏洞
4. **限制 CORS 来源** - 只允许信任的域名
5. **数据库安全** - 使用强密码,限制访问 IP
6. **API 限流** - 防止滥用
7. **日志监控** - 及时发现异常

## 监控和日志

### 推荐工具

- **Sentry**: 错误追踪和性能监控
- **LogRocket**: 会话重放
- **DataDog**: 全栈监控
- **Google Analytics**: 用户分析

### 配置示例

```typescript
// Sentry 配置 (前端)
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
})
```

## 备份策略

1. **数据库备份** - 每日自动备份
2. **代码备份** - 使用 Git 版本控制
3. **配置备份** - 记录所有环境变量
4. **灾难恢复计划** - 制定恢复流程

## 支持和文档

- 后端配置: [backend/DATABASE_SETUP.md](../backend/DATABASE_SETUP.md)
- 前端配置: [frontend/DEPLOYMENT.md](DEPLOYMENT.md)
- API 文档: `https://your-backend.com/docs`
- 项目主页: [README.md](../README.md)

## 成本估算

### 免费方案

- **Railway**: 500 小时/月 免费
- **Render**: 750 小时/月 免费
- **Vercel**: 无限免费(个人项目)
- **Netlify**: 100GB 带宽/月 免费

### 付费方案

根据流量和使用量,每月约 $10-50

## 扩展建议

当应用增长时,考虑:
- 使用 Redis 缓存
- 配置 CDN
- 数据库读写分离
- 负载均衡
- 容器化部署 (Docker/Kubernetes)
