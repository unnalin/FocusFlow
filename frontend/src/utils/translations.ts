export const translations = {
  en: {
    // Session types
    focusTime: '🎯 Focus Time',
    breakTime: '☕ Break Time',

    // Stats
    completedToday: 'Completed today',
    sessions: 'sessions',

    // Task
    workingOn: 'Working on',
    selectOrCreateTask: 'Select or Create a Task',
    deleteTask: 'Delete task',
    focusingOn: 'What are you focusing on?',
    addTask: 'Add',

    // Timer Controls
    start: 'Start',
    pause: 'Pause',
    stop: 'Stop',

    // Date format
    dateFormat: {
      year: 'numeric' as const,
      month: 'long' as const,
      day: 'numeric' as const,
      weekday: 'long' as const,
    },
    locale: 'en-US',

    // Settings
    settings: 'Settings',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    colorScheme: 'Color Scheme',
    default: 'Default (Blue)',
    forest: 'Forest (Green)',
    oceanBlue: 'Ocean Blue',
    forestGreen: 'Forest Green',
    immersiveMode: 'Immersive Mode',
    breakBgm: 'Break Background Music',
    focusDuration: 'Focus Duration',
    breakDuration: 'Break Duration',
    minutes: 'minutes',
    language: 'Language',
    english: 'English',
    chinese: '中文',
  },
  zh: {
    // Session types
    focusTime: '🎯 专注中',
    breakTime: '☕ 休息中',

    // Stats
    completedToday: '今天完成了',
    sessions: '个番茄钟',

    // Task
    workingOn: '当前任务',
    selectOrCreateTask: '选择或新建任务',
    deleteTask: '删除',
    focusingOn: '今天做什么？',
    addTask: '添加',

    // Timer Controls
    start: '开始',
    pause: '暂停',
    stop: '停止',

    // Date format
    dateFormat: {
      year: 'numeric' as const,
      month: 'long' as const,
      day: 'numeric' as const,
      weekday: 'long' as const,
    },
    locale: 'zh-CN',

    // Settings
    settings: '设置',
    theme: '主题',
    light: '浅色',
    dark: '深色',
    colorScheme: '配色',
    default: '默认（蓝色）',
    forest: '森林（绿色）',
    oceanBlue: '海洋蓝',
    forestGreen: '森林绿',
    immersiveMode: '沉浸模式',
    breakBgm: '休息音乐',
    focusDuration: '专注时长',
    breakDuration: '休息时长',
    minutes: '分钟',
    language: '语言',
    english: 'English',
    chinese: '中文',
  },
}

export type Language = keyof typeof translations
export type TranslationKeys = keyof typeof translations.en
