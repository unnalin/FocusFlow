# 🚀 Render 部署快速修复指南

## ✅ 已修复的问题

### 1. ModuleNotFoundError: No module named 'psycopg2'
**原因**: SQLAlchemy 需要 psycopg2 作为 PostgreSQL 驱动

**修复**:
- ✅ 在 `requirements.txt` 添加了 `psycopg2-binary==2.9.9`
- ✅ 保留了 `asyncpg==0.29.0` (主要驱动)

### 2. 导入路径问题
**原因**: Render 部署时 PYTHONPATH 不包含 backend 目录

**修复**:
- ✅ 在 `main.py` 添加了自动路径设置
- ✅ 创建了 `start.sh` 启动脚本
- ✅ 创建了 `backend/__init__.py`

## 📦 新增文件

1. **backend/requirements.txt** (已更新)
   - 添加 `psycopg2-binary==2.9.9`

2. **backend/start.sh** (新建)
   - 设置 PYTHONPATH
   - 启动 uvicorn

3. **backend/build.sh** (新建)
   - 安装依赖的构建脚本

4. **backend/render.yaml** (新建)
   - Render 配置文件

5. **backend/RENDER_DEPLOY.md** (新建)
   - 详细部署文档

6. **backend/__init__.py** (新建)
   - Python 包标识

7. **backend/src/main.py** (已更新)
   - 添加自动 PYTHONPATH 设置

## 🔧 Render 配置步骤

### 第一步: 提交代码

```bash
cd e:\MyAiDemo

# 添加所有修改
git add .

# 提交
git commit -m "fix: add psycopg2-binary and fix import paths for Render

- Add psycopg2-binary to requirements.txt
- Create start.sh with PYTHONPATH configuration
- Add auto path setup in main.py
- Create Render deployment documentation"

# 推送
git push origin main
```

### 第二步: 在 Render 重新部署

1. 登录 Render Dashboard
2. 找到你的 `focusflow-backend` 服务
3. 点击 "Manual Deploy" → "Clear build cache & deploy"

**或者**

删除旧服务,创建新服务:

1. **Build Command**: `./build.sh` 或 `pip install -r requirements.txt`
2. **Start Command**: `./start.sh`
3. **Root Directory**: `backend`

### 第三步: 设置环境变量

在 Render Dashboard 设置:

```bash
# 必需
DATABASE_URL=postgresql+asyncpg://[从 Render PostgreSQL 复制]
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
ENVIRONMENT=production

# 可选
PROJECT_NAME=FocusFlow
```

**重要**:
- DATABASE_URL 必须是 `postgresql+asyncpg://` 开头
- ALLOWED_ORIGINS 必须是你的前端完整 URL

### 第四步: 等待部署完成

查看日志,确认:
```
✅ pip install 成功
✅ 没有 ModuleNotFoundError
✅ Uvicorn 启动成功
✅ Application startup complete
```

### 第五步: 测试

```bash
curl https://your-app.onrender.com/api/v1/health
```

期望响应:
```json
{
  "status": "healthy",
  "service": "FocusFlow API",
  "version": "0.1.0"
}
```

## 🐛 如果还是失败

### 检查清单

- [ ] DATABASE_URL 是 `postgresql+asyncpg://` 格式
- [ ] `psycopg2-binary` 在 requirements.txt 中
- [ ] `asyncpg` 在 requirements.txt 中
- [ ] Start Command 是 `./start.sh` 或 `bash start.sh`
- [ ] 文件 `start.sh` 存在于 backend 目录
- [ ] ALLOWED_ORIGINS 已设置
- [ ] ENVIRONMENT=production

### 查看日志

在 Render Dashboard:
1. 点击你的服务
2. 点击 "Logs"
3. 查找错误信息

### 常见错误

**错误 1**: `Permission denied: ./start.sh`
```bash
# 在本地运行
cd backend
chmod +x start.sh
git add start.sh
git commit -m "fix: make start.sh executable"
git push
```

**错误 2**: 仍然报 `ModuleNotFoundError`
- 检查 requirements.txt 是否正确推送
- 在 Render 点击 "Clear build cache & deploy"

**错误 3**: `src module not found`
- 确认 start.sh 设置了 PYTHONPATH
- 或在 Render 环境变量添加:
  ```
  PYTHONPATH=/opt/render/project/src/backend
  ```

## ✨ 部署成功的标志

在 Render 日志中看到:

```
INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:10000
```

访问 Health Check 返回 200:
```bash
$ curl https://your-app.onrender.com/api/v1/health
{"status":"healthy","service":"FocusFlow API","version":"0.1.0"}
```

## 📚 相关文档

- [backend/RENDER_DEPLOY.md](backend/RENDER_DEPLOY.md) - 详细部署指南
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - 完整部署文档
- [backend/DATABASE_SETUP.md](backend/DATABASE_SETUP.md) - 数据库配置

## 🎯 下一步

部署成功后:

1. **记录后端 URL**: `https://your-app.onrender.com`
2. **配置前端**: 设置 `VITE_API_URL` 环境变量
3. **部署前端**: Vercel/Netlify
4. **更新 CORS**: 将前端 URL 添加到 `ALLOWED_ORIGINS`
5. **测试**: 完整的前后端集成

## 需要帮助?

如果遇到问题:
1. 查看 Render 日志
2. 检查环境变量
3. 确认 DATABASE_URL 格式
4. 查看 [RENDER_DEPLOY.md](backend/RENDER_DEPLOY.md)
