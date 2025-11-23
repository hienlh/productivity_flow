import { Translations } from './vi';

export const en: Translations = {
  common: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    poweredBy: 'Powered by',
  },

  header: {
    title: 'ProductivityFlow',
    settings: 'Settings',
    apiKey: 'API Key',
    history: 'History',
  },

  welcome: {
    title: 'Welcome to ProductivityFlow',
    subtitle: 'AI assistant that helps you optimize your time and productivity every day',
    
    feature1Title: 'Smart Planning',
    feature1Desc: 'AI analyzes priorities, duration, and deadlines to organize your tasks optimally',
    
    feature2Title: 'Auto Timeline',
    feature2Desc: 'Create detailed schedules from morning to evening with specific times for each task',
    
    feature3Title: 'Real-time Tracking',
    feature3Desc: 'Highlight current task, time countdown, and quick actions right in the app',
    
    setupTitle: 'API Key Setup Required',
    setupDesc: 'ProductivityFlow uses Google Gemini AI to create smart schedules. You need your own API key (completely free).',
    
    whyApiKey: 'Why do I need an API key?',
    reason1: 'Better security: Your key, your control',
    reason2: '100% Free: Google provides Free Tier (15 requests/min)',
    reason3: 'No credit card: No payment required',
    reason4: 'Easy: Takes only 2 minutes to get',
    
    securityNote: 'Stored safely in your browser (localStorage)',
    
    laterButton: 'Later',
    startButton: 'Get Started',
  },

  apiKey: {
    title: 'Gemini API Key',
    subtitle: 'Configure to use AI',
    
    instructions: 'How to get API key:',
    step1: 'Visit Google AI Studio',
    step2: 'Sign in with Google account',
    step3: 'Click "Create API key"',
    step4: 'Copy API key and paste below',
    
    inputLabel: 'API Key',
    inputPlaceholder: 'AIza...',
    
    securityTitle: 'Security & Privacy:',
    security1: 'API key is only stored in your browser (localStorage)',
    security2: 'No one else can access your key',
    security3: 'Key is not sent to any server (only to Google AI)',
    security4: 'You can delete the key anytime',
    
    freeTierTitle: 'Free Tier:',
    freeTier1: 'Gemini API is free with 15 requests/min quota',
    freeTier2: 'Enough to create ~900 schedules per hour',
    freeTier3: 'No credit card required',
    freeTier4: 'Check quota at: AI Studio',
    
    removeButton: 'Remove API key',
    saveButton: 'Save API Key',
    securityNote: 'Key will be stored safely in your browser',
    
    errors: {
      empty: 'Please enter API key',
      invalid: 'Invalid API key. Key must start with "AIza"',
      tooShort: 'API key is too short. Please check again',
    },
    
    confirmDelete: 'Are you sure you want to remove API key? The app won\'t be able to generate schedules without a key.',
  },

  taskForm: {
    title: 'Add New Task',
    taskName: 'Task Name',
    taskNameShort: 'Name',
    duration: 'Duration (minutes)',
    durationShort: 'Min',
    priority: 'Priority',
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
    deadline: 'Deadline',
    fixedTime: 'Fixed Time',
    fixedTimeLabel: 'Time',
    addButton: 'Add Task',
  },

  taskList: {
    title: 'Task Queue',
    copyText: 'Copy text',
    copied: 'Copied!',
    clearAll: 'Clear All',
    confirmClear: 'Are you sure you want to clear all tasks?',
    emptyState: 'No tasks yet. Add a task above to get started.',
    minutes: 'min',
  },

  planOverview: {
    title: 'Plan Your Day',
    subtitle: 'Enter your to-do list, AI will help you optimize your time.',
    tasks: 'Tasks',
    totalMinutes: 'min total',
  },

  planDisplay: {
    emptyTitle: 'Ready to Plan',
    emptyDesc: 'Add your tasks on the left and click "Generate Schedule". AI will arrange the optimal timeline for you.',
    
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    
    editButton: 'Edit Schedule',
    editButtonShort: 'Edit',
    saveButton: 'Save',
    cancelButton: 'Cancel',
    
    currentTask: 'Go to Current Task',
    
    moveUp: 'Up',
    moveDown: 'Down',
    deleteTask: 'Delete',
  },

  dashboard: {
    title: 'Dashboard',
    timeline: 'Timeline',
    
    today: 'Today',
    currentTask: 'CURRENT',
    remaining: 'Left',
    minutes: 'min',
    
    nextUp: 'Next Up',
    
    todaySummary: 'Today\'s Summary',
    totalTasks: 'Total Tasks',
    totalTime: 'Total Time',
    completed: 'Completed',
    progress: 'Progress',
    
    aiTips: 'AI Tips',
    showAll: 'Show All',
    showLess: 'Show Less',
  },

  fab: {
    doing: 'Current',
    remaining: 'Left',
    minutes: 'min',
    startTime: 'Started',
    progress: 'Progress',
    doneButton: 'Done',
    skipButton: 'Skip',
  },

  bulkImport: {
    title: 'Bulk Import from Text',
    subtitle: 'Paste your task list',
    
    placeholder: 'Enter your task list...\n\nExample:\nCode review - 60min - high\nEmail - 15 minutes\nMeeting at 14:00 - 1h - medium',
    
    exampleTitle: 'Format examples:',
    useExample: 'Use Example',
    
    preview: 'Preview',
    tasksFound: 'task(s) found',
    
    importButton: 'Import {{count}} task(s)',
    cancelButton: 'Cancel',
  },

  history: {
    title: 'Schedule History',
    
    totalTokens: 'Total Tokens',
    totalCost: 'Total Cost',
    
    taskCount: '{{count}} task(s)',
    model: 'Model',
    inputTokens: 'Input',
    outputTokens: 'Output',
    tokens: 'tokens',
    cost: 'Cost',
    
    tasks: 'Task List',
    copyTasks: 'Copy tasks',
    
    clearHistory: 'Clear History',
    confirmClear: 'Are you sure you want to clear all history?',
    
    emptyState: 'No history yet',
    emptyDesc: 'Create your first schedule to see history here',
  },

  generate: {
    button: 'Generate Schedule',
    buttonShort: 'Generate',
    loading: 'Generating plan...',
    importing: 'Importing...',
    importButton: 'Bulk Import from Text',
    
    errors: {
      noTasks: 'Please add at least one task',
      noApiKey: 'Please add Gemini API key to use this feature.',
      invalidApiKey: 'Invalid API Key or quota exceeded. Please check again.',
      generic: 'Unable to generate schedule. Please try again later.',
    },
  },

  priority: {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  },

  aiPrompt: {
    intro: 'I am a personal productivity assistant. Please help me create a work schedule based on the following task list.',
    currentTime: 'Current time is',
    timeNote: 'If current time is afternoon or evening, schedule for tomorrow or the remaining part of today appropriately.',
    fixedTasksTitle: '⚠️ IMPORTANT - FIXED TIME TASKS (MANDATORY):',
    fixedTasksNote: 'These tasks MUST be scheduled at the exact "fixedTime" specified. For example: If "fixedTime": "15:00" and "duration": 60, it must be scheduled from 15:00-16:00. DO NOT change this time!',
    flexibleTasksTitle: 'Flexible tasks (can be rearranged):',
    requirementsTitle: 'Requirements:',
    req1: '**MANDATORY**: Tasks with "fixedTime" MUST be scheduled at the specified time.',
    req2: 'Arrange flexible tasks around fixed-time tasks.',
    req3: 'Arrange flexible tasks based on Priority (High first) and Deadline.',
    req4: 'Automatically insert reasonable break times (e.g., work 60-90 min, break 10-15 min), but avoid placing breaks right before/after fixed time tasks.',
    req5: 'Add buffer time if necessary to avoid overload and for transitions between tasks.',
    req6: 'Group similar tasks together when possible.',
    req7: 'Provide optimization tips specific to this task list.',
    req8: 'Response language: English.',
    req9: 'Include time for daily routines: breakfast, lunch, dinner, shower, sleep, etc.',
    req10: 'Design based on pomodoro technique. Add ~5 minute breaks between work sessions.',
  },
};

