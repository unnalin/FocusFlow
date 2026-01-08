# FocusFlow

一个现代化的番茄钟应用，帮助你专注工作，高效休息。

## 功能特性

### 核心功能
- **自定义时长**: 自由设置专注时长（1-60分钟）和休息时长（1-30分钟）
- **任务管理**: 创建和管理任务，与番茄钟会话关联，完成后自动删除
- **会话追踪**: 记录所有番茄钟会话，统计每日完成数

### 音频体验
- **完成提示音**: 使用 Web Audio API 生成的温和提示音
- **休息背景音乐**: 休息期间自动播放舒缓音乐
- **智能淡出**: 倒计时最后 5 秒自动淡出音乐

### 界面与主题
- **主题切换**: 支持明暗主题
- **配色方案**: 默认配色 + 森林配色
- **沉浸模式**: 专注时自动隐藏干扰元素
- **响应式设计**: 适配各种屏幕尺寸

### 数据持久化
- **本地存储**: 用户设置和计时器状态自动保存
- **数据库存储**: 任务和会话数据持久化到数据库
- **跨会话恢复**: 刷新页面后状态保持

## 技术栈

### 前端

- **React 18 + TypeScript**: 类型安全的现代前端框架
- **Vite**: 快速的构建工具和开发服务器
- **Zustand**: 轻量级状态管理，支持持久化
- **Web Audio API**: 原生音频生成和播放
- **Tailwind CSS**: 实用优先的 CSS 框架
- **React Router**: 路由管理

### 后端

- **FastAPI**: 高性能异步 Python Web 框架
- **SQLAlchemy 2.0**: 现代化 ORM，完整异步支持
- **PostgreSQL**: 生产环境数据库
- **SQLite**: 开发环境数据库
- **Alembic**: 数据库迁移工具
- **Pydantic**: 数据验证和序列化

## 本地开发

### 前置要求

- Node.js 18+ 和 npm
- Python 3.9+
- PostgreSQL 14+ (可选，开发环境可使用 SQLite)

### 后端设置

1. 进入后端目录并创建虚拟环境:

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

2. 安装依赖:

```bash
pip install -r requirements.txt
```

3. 配置数据库（可选）:

```bash
# 使用 PostgreSQL
export DATABASE_URL=postgresql+asyncpg://user:password@localhost/focusflow

# 或使用默认的 SQLite（无需配置）
```

4. 运行数据库迁移:

```bash
alembic upgrade head
```

5. 启动开发服务器:

```bash
uvicorn src.main:app --reload
```

后端将运行在 `http://localhost:8000`，API 文档可在 `http://localhost:8000/docs` 查看。

### 前端设置

1. 进入前端目录:

```bash
cd frontend
```

2. 安装依赖:

```bash
npm install
```

3. 启动开发服务器:

```bash
npm run dev
```

前端将运行在 `http://localhost:5173`

### 项目结构

```
focusflow/
├── backend/
│   ├── src/
│   │   ├── models/          # 数据库模型
│   │   ├── schemas/         # Pydantic 模式
│   │   ├── routers/         # API 路由
│   │   ├── services/        # 业务逻辑
│   │   └── main.py          # 应用入口
│   ├── alembic/             # 数据库迁移
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React 组件
│   │   ├── pages/           # 页面组件
│   │   ├── hooks/           # 自定义 Hooks
│   │   ├── store/           # Zustand 状态管理
│   │   ├── services/        # API 服务
│   │   └── utils/           # 工具函数
│   └── public/
│       └── sounds/          # 音频文件
└── README.md
```

## 部署

项目配置了 Render 自动部署：

- **后端**: FastAPI 服务，连接 PostgreSQL 数据库
- **前端**: 静态站点，自动构建和部署
- **CI/CD**: 推送到主分支自动触发部署

### 环境变量配置

后端需要的环境变量：

```bash
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
CORS_ORIGINS=https://your-frontend-domain.com
```

## 使用说明

1. **开始专注**:
   - 选择或创建一个任务
   - 点击开始按钮开始倒计时
   - 进入沉浸模式专注工作

2. **自定义设置**:
   - 点击右上角设置按钮 (或按 `Ctrl/Cmd + ,`)
   - 调整专注/休息时长
   - 切换主题和配色
   - 开启/关闭休息背景音乐

3. **任务管理**:
   - 在专注前选择任务
   - 任务完成后会自动删除
   - 可随时创建新任务

4. **查看进度**:
   - 页面顶部显示今日完成的番茄钟数量
   - 所有会话数据保存在数据库中

## 下一步改进方向

### 🔐 安全性和多用户支持 (优先级: 高)

- **用户认证系统**: 实现注册/登录功能，数据隔离
- **会话管理**: JWT 或基于 Cookie 的身份验证
- **权限控制**: 确保用户只能访问自己的数据
- **API 限流**: 防止滥用和 DDoS 攻击
- **HTTPS 强制**: 生产环境强制使用 HTTPS

### 📊 功能增强

#### 统计与分析
- 周/月统计图表 (使用 Chart.js 或 Recharts)
- 任务完成趋势和效率分析
- 专注时长热力图
- 导出统计数据 (CSV/PDF)

#### 通知系统
- 浏览器桌面通知 (Notification API)
- 可选的邮件提醒
- 移动端推送通知 (PWA)

#### 任务管理增强
- 任务优先级和分类标签
- 任务子任务支持
- 任务时间预估
- 历史任务归档和搜索

#### 番茄钟功能
- 长短休息自动切换 (4 个番茄钟后长休息)
- 自定义番茄钟周期
- 休息期间的活动建议

#### 协作功能
- 团队共享任务板
- 协同专注会话
- 团队统计和排行榜

### 🎨 用户体验优化

- **移动端优化**: 改进响应式设计，优化触摸交互
- **PWA 支持**: 支持离线使用和添加到主屏幕
- **快捷键扩展**: 添加更多键盘快捷键 (开始/暂停/停止等)
- **主题扩展**:
  - 更多预设配色方案
  - 自定义主题色选择器
  - 背景图片支持
- **音频定制**:
  - 允许用户上传自定义提示音
  - 多种背景音乐选择
  - 音量独立控制
- **动画优化**: 更流畅的过渡动画
- **历史记录**: 查看和导出历史会话详情

### 🛠️ 技术优化

- **测试覆盖**:
  - 前端单元测试 (Vitest)
  - 后端单元测试 (pytest)
  - E2E 测试 (Playwright)
- **性能优化**:
  - 前端代码分割和懒加载
  - 图片和资源优化
  - API 响应缓存
- **监控和日志**:
  - 前端错误追踪 (Sentry)
  - 后端性能监控 (APM)
  - 用户行为分析
- **数据库优化**:
  - 添加必要的索引
  - 查询性能优化
  - Redis 缓存热点数据
- **CI/CD 改进**:
  - 自动化测试流程
  - 代码质量检查
  - 自动化部署回滚

### 🌍 国际化

- 多语言支持 (i18n)
- 时区处理优化
- 本地化日期/时间格式

## 贡献

欢迎贡献代码和提出建议！

## 许可证

MIT
