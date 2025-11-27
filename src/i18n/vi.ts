export const vi = {
  common: {
    add: 'Thêm',
    edit: 'Sửa',
    delete: 'Xóa',
    save: 'Lưu',
    cancel: 'Hủy',
    close: 'Đóng',
    confirm: 'Xác nhận',
    loading: 'Đang tải...',
    error: 'Lỗi',
    success: 'Thành công',
    poweredBy: 'Powered by',
  },

  header: {
    title: 'PlanningMind',
    settings: 'Settings',
    apiKey: 'API Key',
    history: 'Lịch sử',
  },

  welcome: {
    title: 'Chào mừng đến với PlanningMind',
    subtitle: 'Trợ lý AI giúp bạn tối ưu hóa thời gian và năng suất mỗi ngày',
    
    feature1Title: 'Lập kế hoạch thông minh',
    feature1Desc: 'AI phân tích ưu tiên, thời lượng và deadline để sắp xếp công việc tối ưu nhất cho bạn',
    
    feature2Title: 'Timeline tự động',
    feature2Desc: 'Tạo lịch trình chi tiết từ sáng đến tối, có thời gian cụ thể cho mỗi công việc',
    
    feature3Title: 'Theo dõi real-time',
    feature3Desc: 'Highlight công việc hiện tại, countdown thời gian và quick actions ngay trên app',
    
    setupTitle: 'Cần thiết lập API Key',
    setupDesc: 'PlanningMind sử dụng Google Gemini AI để tạo lịch trình thông minh. Bạn cần API key riêng để sử dụng (hoàn toàn miễn phí).',
    
    whyApiKey: 'Tại sao cần API key?',
    reason1: 'Bảo mật tốt hơn: Key của bạn, chỉ bạn quản lý',
    reason2: 'Miễn phí 100%: Google cung cấp Free Tier (15 requests/phút)',
    reason3: 'Không cần thẻ: Không yêu cầu credit card',
    reason4: 'Dễ dàng: Chỉ mất 2 phút để lấy key',
    
    securityNote: 'Lưu trữ an toàn trên trình duyệt của bạn (localStorage)',
    
    laterButton: 'Để sau',
    startButton: 'Bắt đầu thiết lập',
  },

  apiKey: {
    title: 'Gemini API Key',
    subtitle: 'Cấu hình để sử dụng AI',
    
    instructions: 'Hướng dẫn lấy API key:',
    step1: 'Truy cập Google AI Studio',
    step2: 'Đăng nhập với Google account',
    step3: 'Click "Create API key"',
    step4: 'Copy API key và paste vào ô bên dưới',
    
    inputLabel: 'API Key',
    inputPlaceholder: 'AIza...',
    
    securityTitle: 'Bảo mật & Quyền riêng tư:',
    security1: 'API key chỉ được lưu trên trình duyệt của bạn (localStorage)',
    security2: 'Không ai khác có thể truy cập key của bạn',
    security3: 'Key không được gửi đến server nào (chỉ gửi đến Google AI)',
    security4: 'Bạn có thể xóa key bất cứ lúc nào',
    
    freeTierTitle: 'Free Tier:',
    freeTier1: 'Gemini API miễn phí với quota 15 requests/phút',
    freeTier2: 'Đủ để tạo ~900 lịch trình mỗi giờ',
    freeTier3: 'Không cần credit card',
    freeTier4: 'Xem quota tại: AI Studio',
    
    removeButton: 'Xóa API key',
    saveButton: 'Lưu API Key',
    securityNote: 'Key sẽ được lưu an toàn trên trình duyệt',
    
    errors: {
      empty: 'Vui lòng nhập API key',
      invalid: 'API key không hợp lệ. Key phải bắt đầu bằng "AIza"',
      tooShort: 'API key quá ngắn. Vui lòng kiểm tra lại',
    },
    
    confirmDelete: 'Bạn có chắc muốn xóa API key? App sẽ không thể tạo lịch trình nếu không có key.',
  },

  taskForm: {
    title: 'Thêm công việc mới',
    taskName: 'Tên công việc',
    taskNameShort: 'Tên',
    duration: 'Thời lượng (phút)',
    durationShort: 'Phút',
    priority: 'Ưu tiên',
    priorityHigh: 'Cao',
    priorityMedium: 'Trung bình',
    priorityLow: 'Thấp',
    deadline: 'Deadline',
    fixedTime: 'Có thời gian cố định',
    fixedTimeLabel: 'Thời gian',
    addButton: 'Thêm công việc',
  },

  taskList: {
    title: 'Danh sách chờ',
    copyText: 'Copy text',
    copied: 'Đã copy!',
    clearAll: 'Xóa tất cả',
    confirmClear: 'Bạn có chắc muốn xóa tất cả công việc?',
    emptyState: 'Chưa có công việc nào. Thêm công việc ở trên để bắt đầu.',
    minutes: 'phút',
  },

  planOverview: {
    title: 'Lập kế hoạch',
    subtitle: 'Nhập danh sách việc cần làm, AI sẽ giúp bạn tối ưu hóa thời gian trong ngày.',
    tasks: 'Tasks',
    totalMinutes: 'phút tổng cộng',
  },

  planDisplay: {
    emptyTitle: 'Sẵn sàng lên kế hoạch',
    emptyDesc: 'Thêm các công việc của bạn ở bên trái và nhấn "Tạo Lịch Trình". AI sẽ sắp xếp thời gian biểu tối ưu nhất cho bạn.',
    
    morning: 'Buổi sáng',
    afternoon: 'Buổi chiều',
    evening: 'Buổi tối',
    
    editButton: 'Chỉnh sửa lịch trình',
    editButtonShort: 'Chỉnh sửa',
    saveButton: 'Lưu',
    cancelButton: 'Hủy',
    
    currentTask: 'Tới task hiện tại',
    
    moveUp: 'Lên',
    moveDown: 'Xuống',
    deleteTask: 'Xóa',
  },

  dashboard: {
    title: 'Dashboard',
    timeline: 'Timeline',
    
    today: 'Hôm nay',
    currentTask: 'ĐANG LÀM',
    remaining: 'Còn',
    minutes: 'phút',
    
    nextUp: 'Sắp tới',
    
    todaySummary: 'Tổng quan hôm nay',
    totalTasks: 'Tổng tasks',
    totalTime: 'Tổng thời gian',
    completed: 'Đã hoàn thành',
    progress: 'Tiến độ',
    
    aiTips: 'Mẹo từ AI',
    showAll: 'Xem tất cả',
    showLess: 'Thu gọn',
  },

  fab: {
    doing: 'Đang làm',
    remaining: 'Còn',
    minutes: 'phút',
    startTime: 'Bắt đầu',
    progress: 'Tiến độ',
    doneButton: 'Xong',
    skipButton: 'Bỏ qua',
  },

  bulkImport: {
    title: 'Import hàng loạt từ văn bản',
    subtitle: 'Dán danh sách công việc của bạn',
    
    placeholder: 'Nhập danh sách công việc...\n\nVí dụ:\nCode review - 60p - cao\nEmail - 15 phút\nMeeting lúc 14:00 - 1h - trung bình',
    
    exampleTitle: 'Ví dụ định dạng:',
    useExample: 'Dùng ví dụ',
    
    preview: 'Xem trước',
    tasksFound: 'task(s) tìm thấy',
    
    importButton: 'Import {{count}} task(s)',
    cancelButton: 'Hủy',
  },

  history: {
    title: 'Lịch sử tạo lịch trình',
    
    totalTokens: 'Tổng tokens',
    totalCost: 'Tổng chi phí',
    
    taskCount: '{{count}} task(s)',
    model: 'Model',
    inputTokens: 'Input',
    outputTokens: 'Output',
    tokens: 'tokens',
    cost: 'Chi phí',
    
    tasks: 'Danh sách tasks',
    copyTasks: 'Copy tasks',
    
    clearHistory: 'Xóa lịch sử',
    confirmClear: 'Bạn có chắc muốn xóa toàn bộ lịch sử?',
    
    emptyState: 'Chưa có lịch sử nào',
    emptyDesc: 'Tạo lịch trình đầu tiên để xem lịch sử tại đây',
  },

  generate: {
    button: 'Tạo Lịch Trình',
    buttonShort: 'Tạo',
    loading: 'Đang tạo kế hoạch...',
    importing: 'Đang import...',
    importButton: 'Import hàng loạt từ văn bản',
    
    errors: {
      noTasks: 'Vui lòng thêm ít nhất một công việc',
      noApiKey: 'Vui lòng thêm Gemini API key để sử dụng tính năng này.',
      invalidApiKey: 'API Key không hợp lệ hoặc đã hết quota. Vui lòng kiểm tra lại.',
      generic: 'Không thể tạo lịch trình lúc này. Vui lòng thử lại sau.',
    },
    
    timeWarning: {
      title: '⚠️ Cảnh báo: Không đủ thời gian!',
      needed: 'Cần',
      available: 'Còn lại',
      hours: 'giờ',
      minutes: 'phút',
      message: 'Tổng thời gian công việc vượt quá thời gian còn lại trong ngày.',
      suggestions: 'Gợi ý:',
      suggestion1: 'Giảm thời lượng một số công việc',
      suggestion2: 'Xóa các công việc ưu tiên thấp',
      suggestion3: 'Chia công việc ra nhiều ngày',
      suggestion4: 'Lên lịch cho ngày mai thay vì hôm nay',
    },
  },

  priority: {
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp',
  },

  auth: {
    signIn: 'Đăng nhập để đồng bộ',
    signInShort: 'Đăng nhập',
    synced: 'Đã đồng bộ',
    syncError: 'Lỗi đồng bộ',
    offlineMode: 'Chế độ offline',
  },

  aiPrompt: {
    intro: 'Tôi là một trợ lý năng suất cá nhân. Hãy giúp tôi lập kế hoạch làm việc dựa trên danh sách công việc sau đây.',
    currentTime: 'Thời gian hiện tại là',
    timeNote: 'Nếu thời gian hiện tại là buổi chiều hoặc tối, hãy lên lịch cho ngày mai hoặc phần còn lại của ngày hôm nay một cách hợp lý.',
    fixedTasksTitle: '⚠️ QUAN TRỌNG - CÁC CÔNG VIỆC CÓ THỜI GIAN CỐ ĐỊNH (BẮT BUỘC):',
    fixedTasksNote: 'Những công việc này PHẢI được sắp xếp đúng thời gian "fixedTime" được chỉ định. Ví dụ: Nếu có "fixedTime": "15:00" và "duration": 60, thì phải sắp xếp từ 15:00-16:00. KHÔNG ĐƯỢC thay đổi thời gian này!',
    flexibleTasksTitle: 'Các công việc linh hoạt (có thể sắp xếp):',
    requirementsTitle: 'Yêu cầu:',
    req1: '**BẮT BUỘC**: Các công việc có "fixedTime" PHẢI được sắp xếp đúng thời gian đã chỉ định.',
    req2: 'Sắp xếp các công việc linh hoạt xung quanh các công việc có thời gian cố định.',
    req3: 'Sắp xếp công việc linh hoạt dựa trên Mức độ ưu tiên (Cao làm trước) và Thời hạn (Deadline).',
    req4: 'Tự động chèn thời gian nghỉ (break) hợp lý (ví dụ: làm 60-90 phút nghỉ 10-15 phút), nhưng tránh đặt break ngay trước/sau fixed time tasks.',
    req5: 'Thêm thời gian đệm (buffer) nếu cần thiết để tránh quá tải và để di chuyển giữa các công việc.',
    req6: 'Gom nhóm các công việc tương tự nhau nếu có thể.',
    req7: 'Xuất ra các mẹo tối ưu hóa cụ thể cho danh sách này.',
    req8: 'Ngôn ngữ phản hồi: Tiếng Việt.',
    req9: 'Có thời gian cho các việc hằng ngày như: ăn sáng, ăn trưa, ăn tối, tắm, ngủ, ...',
    req10: 'Giữa các lần làm việc nên có break time tầm 5 phút.',
    req11: `Bắt đầu làm việc tại thời điểm hiện tại ${new Date().getHours()}:${new Date().getMinutes()}`,
    req12: 'Có thể sửa lại tên công việc nếu sai chính tả, hoặc khác ngôn ngữ',
  },
  footer: {
    poweredBy: 'Được hỗ trợ bởi',
    gemini: 'Google Gemini AI',
    copyright: '© 2025 PlanningMind. Tất cả quyền được bảo lưu.',
    madeWith: 'Được tạo với',
    love: '❤️',
  },
};

export type Translations = typeof vi;

