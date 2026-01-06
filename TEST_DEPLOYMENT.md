# 部署配置测试指南

本文档将指导你测试所有的部署配置修改,确保一切正常工作。

## 前置条件

确保已安装:
- Python 3.8+ (后端)
- Node.js 16+ (前端)
- Git

## 测试步骤

### 第一步: 测试后端本地开发环境

#### 1. 安装后端依赖

```bash
cd backend

# 创建虚拟环境 (如果还没有)
python -m venv .venv

# 激活虚拟环境
# Windows:
.venv\Scripts\activate
# Mac/Linux:
# source .venv/bin/activate

# 安装依赖 (包括新的 asyncpg)
pip install -r requirements.txt
```

#### 2. 配置环境变量

确保 `backend/.env` 文件存在并包含:
```bash
DATABASE_URL=sqlite+aiosqlite:///./focusflow.db
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ENVIRONMENT=development
```

#### 3. 启动后端服务

```bash
# 在 backend 目录下
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**预期结果**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

#### 4. 测试后端 API

打开新的终端窗口,测试健康检查端点:

```bash
# Windows PowerShell:
curl http://localhost:8000/api/v1/health

# 或使用浏览器访问:
# http://localhost:8000/api/v1/health
```

**预期响应**:
```json
{
  "status": "healthy",
  "service": "FocusFlow API",
  "version": "0.1.0"
}
```

#### 5. 检查数据库配置

查看后端日志,应该看到:
- ✅ SQLite 数据库连接成功
- ✅ WAL 模式启用
- ✅ 表创建成功

#### 6. 测试 API 文档

访问: http://localhost:8000/docs

**预期结果**: 看到 Swagger UI 交互式 API 文档

---

### 第二步: 测试前端本地开发环境

保持后端运行,打开新的终端窗口。

#### 1. 安装前端依赖

```bash
cd frontend

# 安装依赖
npm install
```

#### 2. 配置环境变量

确保 `frontend/.env` 文件存在并包含:
```bash
VITE_API_URL=http://localhost:8000
VITE_ENABLE_DEBUG=false
```

#### 3. 启动前端开发服务器

```bash
# 在 frontend 目录下
npm run dev
```

**预期结果**:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

#### 4. 测试前端应用

1. 在浏览器打开: http://localhost:5173/
2. 打开浏览器开发者工具 (F12)
3. 查看 Console 标签

**预期在控制台看到**:
```
API Base URL: http://localhost:8000/api/v1
```

#### 5. 测试功能集成

在前端应用中测试:
- ✅ 页面正常加载
- ✅ 可以创建任务
- ✅ 可以启动计时器
- ✅ 设置可以保存
- ✅ Network 标签显示 API 请求成功

**检查 Network 标签**:
- 请求 URL 应该是: `http://localhost:8000/api/v1/...`
- 状态码应该是: 200 或 201
- 响应时间正常

---

### 第三步: 测试 PostgreSQL 配置 (可选)

如果你想测试 PostgreSQL 配置:

#### 1. 启动 PostgreSQL (使用 Docker)

```bash
# 在项目根目录
docker run -d \
  --name focusflow-postgres \
  -e POSTGRES_USER=focusflow \
  -e POSTGRES_PASSWORD=focusflow123 \
  -e POSTGRES_DB=focusflow \
  -p 5432:5432 \
  postgres:15
```

#### 2. 修改后端环境变量

编辑 `backend/.env`:
```bash
DATABASE_URL=postgresql+asyncpg://focusflow:focusflow123@localhost:5432/focusflow
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ENVIRONMENT=development
```

#### 3. 重启后端服务

```bash
# Ctrl+C 停止后端
# 然后重新启动
cd backend
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

#### 4. 验证 PostgreSQL 连接

查看后端日志:
- ✅ 应该看到 PostgreSQL 连接成功
- ✅ 连接池配置应用 (pool_size=20)
- ✅ 表创建成功

#### 5. 测试数据持久化

1. 在前端创建一些任务
2. 停止后端服务
3. 重新启动后端
4. 刷新前端页面
5. ✅ 任务应该还在

#### 6. 清理 (测试完成后)

```bash
# 停止并删除 PostgreSQL 容器
docker stop focusflow-postgres
docker rm focusflow-postgres

# 恢复 .env 到 SQLite 配置
# DATABASE_URL=sqlite+aiosqlite:///./focusflow.db
```

---

### 第四步: 测试生产环境配置验证

#### 1. 测试 CORS 验证

编辑 `backend/.env`:
```bash
DATABASE_URL=sqlite+aiosqlite:///./focusflow.db
# 注释掉 ALLOWED_ORIGINS
# ALLOWED_ORIGINS=http://localhost:5173
ENVIRONMENT=production
```

重启后端:
```bash
cd backend
python -m uvicorn src.main:app --reload
```

**预期结果**:
```
ValueError: ALLOWED_ORIGINS must be explicitly set in production environment.
```

✅ 这证明生产环境强制验证正常工作!

恢复配置:
```bash
DATABASE_URL=sqlite+aiosqlite:///./focusflow.db
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ENVIRONMENT=development
```

#### 2. 测试前端 API URL 配置

编辑 `frontend/.env`:
```bash
# 测试完整路径
VITE_API_URL=http://localhost:8000/api/v1
```

重启前端 (Ctrl+C 然后 `npm run dev`)

查看控制台:
```
API Base URL: http://localhost:8000/api/v1
```

✅ URL 没有重复 `/api/v1`

再测试基础 URL:
```bash
VITE_API_URL=http://localhost:8000
```

重启前端,查看控制台:
```
API Base URL: http://localhost:8000/api/v1
```

✅ 自动添加了 `/api/v1`

---

### 第五步: 测试构建

#### 1. 构建前端

```bash
cd frontend

# 构建生产版本
npm run build
```

**预期结果**:
```
vite v5.x.x building for production...
✓ xxx modules transformed.
dist/index.html                  x.xx kB
dist/assets/index-xxx.js         xx.xx kB
✓ built in xxxms
```

#### 2. 预览构建结果

```bash
npm run preview
```

访问显示的 URL (通常是 http://localhost:4173)

**测试**:
- ✅ 页面正常加载
- ✅ 功能正常工作
- ✅ API 调用成功

---

## 测试检查清单

### 后端测试

- [ ] ✅ 依赖安装成功 (包括 asyncpg)
- [ ] ✅ SQLite 模式正常工作
- [ ] ✅ PostgreSQL 模式正常工作 (可选)
- [ ] ✅ CORS 配置正确
- [ ] ✅ 生产环境验证工作正常
- [ ] ✅ API 端点响应正常
- [ ] ✅ 健康检查可访问
- [ ] ✅ API 文档可访问

### 前端测试

- [ ] ✅ 依赖安装成功
- [ ] ✅ 开发服务器启动成功
- [ ] ✅ API URL 自动配置正确
- [ ] ✅ 控制台显示 API URL
- [ ] ✅ API 请求成功
- [ ] ✅ 所有功能正常工作
- [ ] ✅ 生产构建成功
- [ ] ✅ 预览版本工作正常

### 集成测试

- [ ] ✅ 前后端通信正常
- [ ] ✅ CORS 无错误
- [ ] ✅ 数据持久化正常
- [ ] ✅ 错误处理正常
- [ ] ✅ 网络请求超时设置合理

---

## 常见问题排查

### 后端问题

#### 问题: ModuleNotFoundError: No module named 'asyncpg'

**解决**:
```bash
cd backend
pip install asyncpg
# 或
pip install -r requirements.txt
```

#### 问题: CORS 错误

**解决**: 检查 `backend/.env` 中的 `ALLOWED_ORIGINS` 包含前端地址

#### 问题: 数据库连接失败

**解决**:
- SQLite: 检查目录权限
- PostgreSQL: 确认服务运行且 DATABASE_URL 正确

### 前端问题

#### 问题: API 请求失败 (404)

**解决**:
1. 确认后端正在运行
2. 检查 `VITE_API_URL` 配置
3. 查看控制台的 "API Base URL" 日志

#### 问题: 环境变量不生效

**解决**:
1. 确认变量名以 `VITE_` 开头
2. 重启开发服务器 (修改 .env 后必须重启)
3. 清除缓存: `npm run dev -- --force`

#### 问题: Network Error

**解决**:
1. 确认后端在 8000 端口运行
2. 检查防火墙设置
3. 查看后端日志是否有错误

---

## 测试成功标准

当你完成所有测试后,应该能够:

✅ 后端在 SQLite 模式下正常运行
✅ 前端能成功调用后端 API
✅ 所有功能模块正常工作
✅ 控制台无错误
✅ 生产构建成功
✅ 生产环境验证工作正常

## 下一步

测试通过后,你可以:

1. **提交代码**:
   ```bash
   git add .
   git commit -m "feat: add production deployment configuration

   - Support PostgreSQL for production
   - Add CORS configuration with validation
   - Update frontend API configuration
   - Add deployment documentation"
   git push origin feat/database-config-for-production
   ```

2. **合并到主分支** (如果测试通过):
   ```bash
   git checkout main
   git merge feat/database-config-for-production
   git push origin main
   ```

3. **部署到生产环境** - 参考 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 需要帮助?

如果测试过程中遇到问题:

1. 查看详细的错误日志
2. 检查环境变量配置
3. 确认依赖已正确安装
4. 参考相关文档:
   - [backend/DATABASE_SETUP.md](backend/DATABASE_SETUP.md)
   - [frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md)
   - [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
