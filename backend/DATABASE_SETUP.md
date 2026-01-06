# 数据库和部署配置说明

## 概述

本项目支持两种数据库:
- **SQLite**: 用于本地开发,无需额外配置
- **PostgreSQL**: 用于生产环境,提供更好的性能和并发支持

## 环境变量配置

### 必需的环境变量

生产环境必须设置以下环境变量:

```bash
# 数据库连接
DATABASE_URL=postgresql+asyncpg://username:password@host:port/database_name

# 前端域名 (CORS)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 环境标识
ENVIRONMENT=production
```

### 可选的环境变量

```bash
# API 配置
API_V1_PREFIX=/api/v1
PROJECT_NAME=FocusFlow
```

## 本地开发 (SQLite)

使用默认配置即可,数据库文件会自动创建在项目根目录:

```bash
# .env 文件
DATABASE_URL=sqlite+aiosqlite:///./focusflow.db
```

## 生产环境 (PostgreSQL)

### 1. 安装依赖

确保已安装 PostgreSQL 驱动:

```bash
pip install asyncpg
```

### 2. 配置环境变量

在生产环境设置 `DATABASE_URL` 环境变量:

```bash
DATABASE_URL=postgresql+asyncpg://username:password@host:port/database_name
```

**示例:**
```bash
# 本地 PostgreSQL
DATABASE_URL=postgresql+asyncpg://myuser:mypassword@localhost:5432/focusflow

# 云服务 (例如 Railway, Render, Supabase)
DATABASE_URL=postgresql+asyncpg://user:pass@db.example.com:5432/dbname
```

### 3. 数据库配置

代码会根据 `DATABASE_URL` 自动选择合适的配置:

**SQLite 配置:**
- 使用 NullPool (无连接池)
- 启用 WAL 模式提高并发
- 64MB 缓存

**PostgreSQL 配置:**
- 连接池大小: 20
- 最大溢出连接: 10
- 连接预检查: 启用
- 连接回收时间: 1小时

### 4. 初始化数据库

应用启动时会自动创建所有表:

```python
from src.database import init_db

await init_db()
```

## 常见云平台配置

### Railway
1. 添加 PostgreSQL 插件
2. Railway 会自动提供 `DATABASE_URL` 环境变量
3. 注意: Railway 提供的 URL 可能是 `postgresql://` 开头,需要改为 `postgresql+asyncpg://`

### Render
1. 创建 PostgreSQL 数据库
2. 复制 Internal Database URL
3. 将 `postgresql://` 替换为 `postgresql+asyncpg://`

### Supabase
1. 在项目设置中获取连接字符串
2. 选择 "Session" 模式的连接字符串
3. 将 URL 格式改为 `postgresql+asyncpg://`

### Heroku
```bash
# Heroku 会提供 DATABASE_URL,但需要转换格式
# 在 Procfile 或启动脚本中:
DATABASE_URL=$(echo $DATABASE_URL | sed 's/postgres:\/\//postgresql+asyncpg:\/\//')
```

## CORS 配置

### 本地开发

使用默认配置即可:

```bash
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 生产环境

**重要**: 生产环境必须明确设置 `ALLOWED_ORIGINS`,否则应用启动时会报错。

```bash
# 单个域名
ALLOWED_ORIGINS=https://yourdomain.com

# 多个域名 (用逗号分隔)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 包含子域名
ALLOWED_ORIGINS=https://app.yourdomain.com,https://yourdomain.com
```

### 安全建议

1. **不要使用通配符** `*` 在生产环境中
2. **只添加信任的域名** 到 ALLOWED_ORIGINS
3. **使用 HTTPS** 协议在生产环境
4. **包含所有前端部署的域名** (包括 www 和非 www 版本)

### 常见部署平台示例

**Vercel + Railway**:

```bash
# Railway (Backend)
DATABASE_URL=postgresql+asyncpg://...
ALLOWED_ORIGINS=https://yourapp.vercel.app
ENVIRONMENT=production
```

**Netlify + Render**:

```bash
# Render (Backend)
DATABASE_URL=postgresql+asyncpg://...
ALLOWED_ORIGINS=https://yourapp.netlify.app,https://www.yourapp.com
ENVIRONMENT=production
```

## 迁移数据库

如果需要使用 Alembic 进行数据库迁移:

```bash
# 生成迁移文件
alembic revision --autogenerate -m "描述"

# 应用迁移
alembic upgrade head
```

## 故障排查

### CORS 错误

如果前端无法访问 API,检查:

1. `ALLOWED_ORIGINS` 是否包含前端域名
2. 域名是否包含协议 (http:// 或 https://)
3. 域名是否包含端口号 (如果不是默认端口)
4. 是否有多余的空格或拼写错误

### 数据库连接失败

检查:
1. DATABASE_URL 格式是否正确
2. 数据库服务是否运行
3. 网络连接是否正常
4. 用户名密码是否正确

### 性能问题

对于高并发场景,可以调整连接池参数 (在 [database.py](src/database.py) 中):
- `pool_size`: 基础连接池大小
- `max_overflow`: 额外连接数量
- `pool_recycle`: 连接回收时间

## 安全建议

1. 不要在代码中硬编码数据库凭据
2. 使用环境变量管理敏感信息
3. 在生产环境使用强密码
4. 限制数据库访问 IP 白名单
5. 定期备份数据库
