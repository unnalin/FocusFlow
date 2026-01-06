# 任务删除功能说明

## 新增功能

### 1. 自动删除完成的任务 ✅

当你完成一个 Focus Session (番茄钟) 时,关联的任务会**自动删除**。

**工作流程**:
1. 选择一个任务
2. 开始 Focus Session (25分钟)
3. 完成后 → 任务自动从列表中删除

**好处**:
- 保持任务列表清爽
- 专注于未完成的任务
- 自动清理已完成项目

### 2. 手动删除任务 🗑️

如果你不想做某个任务了,可以手动删除。

**如何使用**:
1. 鼠标悬停在任务上
2. 右侧会出现一个**垃圾桶图标**
3. 点击即可删除

**特性**:
- 悬停显示 (hover to show)
- 平滑动画效果
- 红色高亮提示
- 防止误操作 (需要明确点击)

## 技术实现

### 自动删除
```typescript
// Focus Session 完成时
if (sessionType === 'focus') {
  incrementCompleted()

  // 自动删除已完成的任务
  if (selectedTask) {
    deleteTask(selectedTask)
    setSelectedTask(null)
    setCurrentTask(null)
  }
}
```

### 手动删除
```typescript
const handleTaskDelete = (taskId: number, event: React.MouseEvent) => {
  event.stopPropagation() // 防止选中任务
  if (selectedTask === taskId) {
    setSelectedTask(null)
    setCurrentTask(null)
  }
  deleteTask(taskId)
}
```

## UI 设计

### 删除按钮样式
- **默认**: 不可见 (opacity: 0)
- **悬停**: 渐显 (opacity: 100)
- **图标**: 垃圾桶
- **颜色**: 灰色 → 悬停时红色
- **位置**: 任务项右侧
- **动画**: 200ms 平滑过渡

### 响应式设计
- 桌面端: 悬停显示
- 触摸设备: 始终显示 (可通过 CSS 调整)

## 测试场景

### 测试 1: 自动删除
1. 创建任务 "完成报告"
2. 选择该任务
3. 开始并完成一个 Focus Session (25分钟)
4. ✅ 任务应该自动消失

### 测试 2: 手动删除
1. 创建任务 "学习 React"
2. 不启动计时器
3. 鼠标悬停在任务上
4. 点击垃圾桶图标
5. ✅ 任务应该立即删除

### 测试 3: 删除选中的任务
1. 创建并选择任务 "写代码"
2. 不启动计时器
3. 手动删除该任务
4. ✅ 选中状态应该清除
5. ✅ "Working on" 显示应该消失

### 测试 4: 删除期间保护
1. 选择一个任务
2. 启动 Focus Session
3. ❌ 删除按钮不应显示 (因为计时器运行中)
4. 保护正在进行的任务不被误删

## 未来改进建议

### 可选功能
1. **删除确认对话框** - 防止误删重要任务
2. **保留已完成任务** - 添加"已完成"列表查看历史
3. **撤销删除** - 短时间内可以恢复
4. **批量删除** - 一次删除多个任务
5. **归档功能** - 隐藏而不是删除

### 配置选项
可以在设置中添加:
- [ ] 完成后自动删除任务 (开/关)
- [ ] 删除前显示确认 (开/关)
- [ ] 保留已完成任务 X 天

## 兼容性

- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ 移动端浏览器

## 已知问题

无

## 修改的文件

- `frontend/src/pages/FocusPage.tsx` - 主要逻辑和 UI
- `frontend/src/hooks/useTasks.ts` - 已有 deleteTask 功能
- `frontend/src/services/taskService.ts` - 已有 delete API 调用

## 相关 API

后端已支持任务删除:
```
DELETE /api/v1/tasks/{task_id}
```

返回: 204 No Content
