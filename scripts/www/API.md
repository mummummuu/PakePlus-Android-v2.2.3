# 班主任模拟器 API 文档

> 每次添加新功能后请更新此文档

---

## 1. 枚举 (Enums)

### 游戏模式 `GameMode`
| 值 | 数值 | 说明 |
|---|---|---|
| `GameMode.Hard` | 40 | 困难模式，初始积极性45±10 (25-65) |
| `GameMode.Normal` | 60 | 普通模式，初始积极性65±10 (45-85) |
| `GameMode.Easy` | 80 | 简单模式，初始积极性90±8 (75-100)，含竞赛系统 |

### 班级类型 `ClassType`
| 值 | 数值 | 说明 |
|---|---|---|
| `ClassType.Science` | 1 | 理科班（语数英理化生，共6科） |
| `ClassType.Art` | 2 | 文科班（语数英政史地，共6科） |

### 性别 `Gender`
| 值 | 说明 |
|---|---|
| `Gender.Boy` | "male" |
| `Gender.Girl` | "female" |

### 角色 `Character`
| 值 | 说明 |
|---|---|
| `Character.WEI` | "wei" - 魏教授 |
| `Character.WANG` | "wang" - 王老师 |
| `Character.QIN` | "qin" - 秦老师 |

### 科目 `Subject`
| 值 | 数值 | 说明 | 满分(理科) | 满分(文科) |
|---|---|---|---|---|
| `Subject.Chinese` | 1 | 语文 | 150 | 150 |
| `Subject.Maths` | 2 | 数学 | 150 | 150 |
| `Subject.English` | 3 | 英语 | 150 | 150 |
| `Subject.Physics` | 4 | 物理 | 100 | - |
| `Subject.Chemistry` | 5 | 化学 | 100 | - |
| `Subject.Biology` | 6 | 生物 | 100 | - |
| `Subject.Politics` | 7 | 政治 | - | 100 |
| `Subject.History` | 8 | 历史 | - | 100 |
| `Subject.Geography` | 9 | 地理 | - | 100 |

### 学生状态 `Status`
| 值 | 数值 | 说明 |
|---|---|---|
| `Status.Normal` | 1 | 正常在校 |
| `Status.Leave` | 2 | 请假中 |
| `Status.Train` | 3 | 竞赛集训中 |
| `Status.Dead` | 4 | 已劝退/死亡 |

### 学生关系 `Relations`
| 值 | 数值 | 说明 |
|---|---|---|
| `Relations.Normal` | 1 | 普通同学 |
| `Relations.Better` | 2 | 关系较好 |
| `Relations.Friend` | 3 | 朋友 |
| `Relations.Loving` | 4 | 恋人 |
| `Relations.Disliking` | 5 | 不喜欢 |
| `Relations.Hating` | 6 | 讨厌 |
| `Relations.Self` | 7 | 自己 |

### 考试类型 `ContestType`
| 值 | 数值 | 说明 |
|---|---|---|
| `ContestType.Mid` | 1 | 期中考试 |
| `ContestType.End` | 2 | 期末考试 |
| `ContestType.Final` | 3 | 高考 |

### 大学等级 `UniversityTier`
| 值 | 说明 |
|---|---|
| `UniversityTier.TIER_985` | "985 工程" |
| `UniversityTier.TIER_211` | "211 工程" |
| `UniversityTier.TIER_DOUBLE_FIRST` | "双一流" |
| `UniversityTier.TIER_TIER1` | "一本" |
| `UniversityTier.TIER_TIER2` | "二本" |
| `UniversityTier.TIER_TIER3` | "三本/专科" |

### 班会类型 `ClassMeetingType`
| 值 | 说明 | 消耗精力 | 消耗资金 | 效果 |
|---|---|---|---|---|
| `ClassMeetingType.CHICKEN_SOUP` | "鸡汤班会" | 40 | 500 | 全员积极性+5 |
| `ClassMeetingType.THREAT` | "恐吓班会" | 40 | 500 | 全员积极性+8，精力-5 |
| `ClassMeetingType.AWARD` | "表彰班会" | 40 | 500 | 前5名积极性+10 |
| `ClassMeetingType.FREE` | "自由班会" | 40 | 500 | 全员积极性+3，精力+2 |
| `ClassMeetingType.COMPLAINT` | "吐槽大会" | 40 | 500 | 全员积极性+4，精力+1 |
| `ClassMeetingType.SURPRISE` | "惊喜班会" | 40 | 500 | 全员积极性+7 |

### 活动类型 `ActivityType`
| 值 | 说明 | 消耗精力 | 效果 |
|---|---|---|---|
| `ActivityType.SPORTS` | "运动会" | 40 | 精力-10，积极性+3，10%受伤 |
| `ActivityType.MOVIE` | "看电影" | 40 | 精力+1，积极性+2 |
| `ActivityType.FIELD_TRIP` | "春游踏青" | 40 | 精力+2，积极性+2 |
| `ActivityType.TALENT_SHOW` | "才艺展示" | 40 | 前3名积极性+5精力+1，其他+1 |
| `ActivityType.GROUP_STUDY` | "集体自习" | 40 | 积极性-8，30%学习能力+0.5 |
| `ActivityType.PICNIC` | "野餐聚会" | 40 | 精力+2，积极性+3 |
| `ActivityType.GAME_NIGHT` | "游戏之夜" | 40 | 精力+1，积极性+3 |
| `ActivityType.VOLUNTEER` | "志愿服务" | 40 | 精力-5，积极性+2，20%随机科目+0.5 |

### 天赋 `Talent` (共20种)
| 值 | 数值 | 名称 | 效果 |
|---|---|---|---|
| `Talent.FILL_MISSING_EXAM` | 1 | 填缺考标记 | 每次考试各科20%概率得0分 |
| `Talent.FORGET_NAME` | 2 | 忘填名字 | 每次考试每科5%概率得0分 |
| `Talent.SPORTS_STUDENT` | 3 | 体育生 | 精力恢复快×1.8，学习能力增长×0.3 |
| `Talent.LEGENDARY_CAPTAIN` | 4 | 传奇机长 | 考前一星期精力-5，学习能力×3（仅男生） |
| `Talent.BOXER_MEMBER` | 5 | 义和团员 | 英语学习能力保持≤25 |
| `Talent.GOOD_STUDENT` | 6 | 三好学生 | 积极性增长×2，学习能力增长×2 |
| `Talent.CLAIRVOYANT` | 7 | 千里眼 | 考试30%概率+20分，20%概率得0分 |
| `Talent.SCIENCE_GOD` | 8 | 理科战神 | 数理化生能力≥60，语英政史地≤25 |
| `Talent.IRON_MAN` | 9 | 铁人 | 永不请假，不会因精力耗尽而死 |
| `Talent.INDIFFERENT` | 10 | 冷漠 | 与他人关系不变，不与他人交往 |
| `Talent.BURST` | 11 | 爆发 | 成绩降低超10%，积极性+20 |
| `Talent.GALOIS` | 12 | 伽罗瓦 | 数学学习能力保持≥60 |
| `Talent.LITERATURE_STAR` | 13 | 文曲星 | 语文学习能力保持≥60 |
| `Talent.DARK_CRAWLER` | 14 | 阴暗爬行 | 积极性保持≤30 |
| `Talent.VIOLENT` | 15 | 暴力 | 每回合2%概率殴打班主任，扣血3点 |
| `Talent.PARRY` | 16 | 弹反 | 无法被劝退；被劝退时扣班主任7血 |
| `Talent.PLAYBOY` | 17 | 海王 | 恋爱概率×3，恋人变化快 |
| `Talent.ENTHUSIASTIC` | 18 | 热情 | 关系只增不减 |
| `Talent.LIN_DAIYU` | 19 | 林黛玉 | 请假概率60% |
| `Talent.SMOKER` | 20 | 大烟鬼 | 10%概率抽烟，50%恢复50精力，50%被劝退 |

### 物品 `Item` (共4种)
| 值 | 数值 | 名称 | 图标 | 类型 | 是否消耗 | 描述 |
|---|---|---|---|---|---|---|
| `Item.HERO_PEN` | 1 | 希罗的钢笔 | ./assets/items/pen.png | 特殊物品 | 否 | 办公桌上遗留的，你占为己有 |
| `Item.ICE_TEA` | 2 | 小冰茶 | ./assets/items/medicine.png | 消耗品 | 是 | 食堂的新品，喝了令人积极向上 |
| `Item.YIJIN_JING` | 3 | 易筋经 | ./assets/items/classic.png | 消耗品 | 是 | 某个同事送给你的秘籍 |
| `Item.ONE_YUAN_ICE_TEA` | 4 | 一元乐享（小冰茶） | ./assets/items/cap.png | 消耗品 | 是 | 喝小冰茶40%概率获得 |

### 食堂系统
**可购买物品配置 `CanteenItems`**
按楼层分类的物品配置，每个楼层可以售卖不同的物品。

| 楼层 | 物品ID | 价格 | 是否可购买 |
|---|---|---|---|
| 1 | `Item.ICE_TEA` | 500 | 是 |
| 1 | `Item.ONE_YUAN_ICE_TEA` | 500 | 是 |
| 2 | `Item.ICE_TEA` | 500 | 是 |
| 3 | `Item.ICE_TEA` | 500 | 是 |

**全局变量**
- `currentCanteenFloor` - 当前楼层（1-3），默认为1

**函数**
- `showCanteenModal()` - 显示食堂弹窗
- `closeCanteenModal()` - 关闭食堂弹窗
- `renderCanteenItems()` - 渲染当前楼层的物品列表
- `buyItem(itemId)` - 购买物品

### Toast通知系统
**全局变量**
- `currentToast` - 当前显示的Toast元素
- `toastTimeout` - Toast自动消失的定时器

**函数**
- `showToast(type, title, message, duration = 3000)` - 显示Toast消息
  - `type`: 消息类型（'success', 'error', 'warning', 'info'）
  - `title`: 消息标题
  - `message`: 消息内容
  - `duration`: 持续时间（毫秒），默认3000ms
- `removeToast(animate = true)` - 移除Toast消息
  - `animate`: 是否使用动画效果，默认为true

**消息类型**
- `success` - 成功消息（绿色）
- `error` - 错误消息（红色）
- `warning` - 警告消息（黄色）
- `info` - 信息消息（蓝色）

### 随机事件类型 `RandomEventType`
| 值 | 说明 |
|---|---|
| `RandomEventType.CONFIRM` | "confirm" - 确认事件（只有一个确认按钮） |
| `RandomEventType.CHOICE` | "choice" - 选择事件（有多个选项按钮） |

### 竞赛相关
**竞赛科目 `Competition`**
| 值 | 数值 | 说明 |
|---|---|---|
| `Competition.MO` | 1 | 数学奥林匹克 |
| `Competition.PhO` | 2 | 物理奥林匹克 |
| `Competition.ChO` | 3 | 化学奥林匹克 |
| `Competition.BO` | 4 | 生物奥林匹克 |
| `Competition.OI` | 5 | 信息学奥林匹克 |

**竞赛阶段 `CompetitionStage`**
| 值 | 数值 | 说明 |
|---|---|---|
| `CompetitionStage.League` | 1 | 联赛（40%晋级省队） |
| `CompetitionStage.National` | 2 | 国赛/省队 |

**竞赛奖项 `CompetitionAward`**
| 值 | 数值 | 说明 | 提前录取 |
|---|---|---|---|
| `CompetitionAward.None` | 0 | 无 | - |
| `CompetitionAward.Bronze` | 1 | 铜牌 | 211/双一流 |
| `CompetitionAward.Silver` | 2 | 银牌 | 其他985 |
| `CompetitionAward.Gold` | 3 | 金牌 | 清华北大 |

### 运动会 (sports_day.js)
**活动类型 `SportsEventType`**
| 值 | 说明 |
|---|---|
| `SportsEventType.SHINE_HUMAN_TEEN` | 闪耀！类人少年（卡牌对战） |
| `SportsEventType.JAVELIN_RELAY` | 标枪接力 |

**卡牌类型 `CardType`**
| 值 | 说明 |
|---|---|
| `CardType.BOOST` | 加速 |
| `CardType.SLOW` | 减速 |
| `CardType.SHIELD` | 护盾 |
| `CardType.ATTACK` | 攻击 |
| `CardType.SWAP` | 交换位置 |
| `CardType.EMPTY` | 空白卡（直接跳過） |
| `CardType.SPECIAL` | 特殊效果 |

**身位 `POSITION`**
| 值 | 说明 | 数值 |
|---|---|---|
| `POSITION.LAST` | 最后 | 0 |
| `POSITION.BACK` | 后方 | 1 |
| `POSITION.MIDDLE` | 中间（起点） | 2 |
| `POSITION.FRONT` | 前方 | 3 |
| `POSITION.FIRST` | 最前 | 4 |

---

## 2. 类 (Classes)

### NamePreset 姓名预设
```js
new NamePreset(id, name, description, boyNames = [], girlNames = [], isRandomOnly = false)

属性:
  id: string              // 预设ID
  name: string            // 预设名称
  description: string     // 预设描述
  boyNames: string[]      // 男生姓名数组
  girlNames: string[]    // 女生姓名数组
  isRandomOnly: boolean   // 是否纯随机模式

内置预设:
  RANDOM_PRESET           // 纯随机生成
  DEFAULT_PRESET          // 默认姓名库
  ALIAS_PRESET            // 化名预设
```

### University 大学
```js
new University(name, tier, scienceScore, artScore, location = "未知", category = "综合")

属性:
  name: string           // 大学名称
  tier: UniversityTier   // 大学等级
  scienceScore: number   // 理科分数线
  artScore: number       // 文科分数线
  location: string       // 所在地
  category: string       // 类别（综合/理工/师范等）

方法:
  getScoreRequirement(classType) → number
    // 获取该大学对应班型的分数线
    // 参数: classType - ClassType.Science 或 ClassType.Art
    // 返回: 分数线数字
```

### Student 学生
```js
new Student(index, belongClass, mode = GameMode.Normal, classType = ClassType.Science)

属性:
  index: number              // 学生编号（1-50）
  belongClass: Class         // 所属班级
  gender: Gender             // 性别 "male" | "female"
  name: string               // 姓名
  gameMode: GameMode         // 游戏难度
  status: Status             // 当前状态
  energy: number             // 精力值 (0-100)
  enthusiasm: number         // 积极性 (15-100)
  character: number[]        // 性格特征 [0-1, 0-1]
  IQ: number                 // 智商 (约65-100+)
  seatCol: number            // 座位列 (1-9)
  seatRow: number            // 座位行 (1-12)
  relation: object           // 与其他学生的关系 {1: Relations.Normal, ...}
  talents: Talent[]          // 天赋数组
  learnCap: object           // 各科学习能力 {Subject值: 数值}
  validSubjects: Subject[]   // 应考科目数组
  competition: Competition|null    // 竞赛科目（仅简单模式）
  competitionStage: CompetitionStage|null // 竞赛阶段
  competitionAward: CompetitionAward      // 竞赛奖项
  inTraining: boolean        // 是否在集训
  trainingEndWeek: number|null // 集训结束周
  admittedEarly: University|null // 竞赛提前录取的大学
  previousScore: number|null // 上次考试总分
  firstExamScore: number|null  // 第一次考试总分
  scoreChangeFactor: number    // 成绩变化因子
  lastExamRank: number|null    // 上次考试排名
  leaveStartWeek: number|null  // 请假开始周
  leaveEndWeek: number|null    // 请假结束周
  gaokaoScore: number|null     // 高考总分
  gaokaoScores: object|null    // 高考各科成绩
  admittedUniversity: University|null // 录取大学
  hasBeenDead: boolean         // 是否曾经死亡过

方法:
  getNeighbors() → Student[]
    // 获取相邻座位的学生
    // 返回: 相邻学生组成的数组

  updateWeekly()
    // 每周更新：精力恢复、积极性变化、学习能力增长
    // 内部处理：天赋效果、关系影响、随机事件

  resetTalents(forceHaveTalent = false) → void
    // 重置学生天赋
    // 参数: forceHaveTalent - 是否强制有天赋（默认false按概率）

  toString() → string
    // 返回学生姓名
```

### Teacher 班主任
```js
new Teacher(characterType = null)

属性:
  characterType: Character|null  // 角色类型
  salary: number                 // 当前工资
  health: number                 // 生命值 (0-10)
  energy: number                 // 精力值
  maxEnergy: number              // 最大精力
  monthlySalary: number          // 月薪
  noSalaryPenalty: boolean       // 是否不受学生死亡扣工资影响
  reviveChance: number           // 复活概率（秦老师0.35）
  subject: Subject|null          // 任教科目
  lastSalaryWeek: number         // 上次发工资周数
  inventory: Inventory          // 物品栏

方法:
  recoverEnergy()
    // 恢复精力到默认值
```

### Inventory 物品栏
```js
new Inventory()

属性:
  items: object              // 物品集合 {itemId: count}，例如: {1: 3, 2: 1}
  maxSlots: number           // 最大格子数（9）
  maxItemStack: number       // 每种物品最大数量（8）

方法:
  addItem(itemId) → object
    // 添加物品
    // 参数: itemId - 物品ID（Item枚举值）
    // 返回: {success: boolean, message: string}

  removeItem(itemId, count = 1) → object
    // 移除物品
    // 参数: itemId - 物品ID，count - 移除数量（默认1）
    // 返回: {success: boolean, message: string}

  useItem(itemId) → object
    // 使用物品
    // 参数: itemId - 物品ID
    // 返回: {success: boolean, message: string}

  hasItem(itemId) → boolean
    // 检查是否有物品
    // 参数: itemId - 物品ID
    // 返回: 是否拥有该物品

  getItemCount(itemId) → number
    // 获取物品数量
    // 参数: itemId - 物品ID
    // 返回: 物品数量

  getAllItems() → object[]
    // 获取所有物品列表
    // 返回: [{itemId: number, count: number}, ...]

  getDisplaySlots() → (object|null)[]
    // 获取物品栏显示数据（9个格子）
    // 返回: [{itemId: number, count: number}, ...] 或 null
```

### LeaveRequest 请假申请
```js
new LeaveRequest(student, duration, reason)

属性:
  student: Student      // 请假学生
  duration: number      // 请假时长（周）
  reason: string        // 请假理由
  requestedWeek: number|null  // 申请提交的周数
  approved: boolean|null      // 是否批准
  processed: boolean          // 是否已处理

方法:
  generateReason(student) → string
    // 生成随机请假理由
    // 参数: student - 对应学生（用于判断性别）
    // 返回: 随机生成的请假理由字符串
```

### Class 班级（核心类）
```js
new Class(mode = GameMode.Normal, classType = ClassType.Science, studentNum = 50, characterType = null)

属性:
  mode: GameMode              // 游戏难度
  classType: ClassType        // 班级类型
  studentNum: number          // 学生数量
  characterType: Character    // 班主任角色
  ended: boolean              // 游戏是否结束
  failReason: string|null     // 失败原因
  students: Student[]         // 学生数组
  seats: Student[][]          // 座位表 [列][行]
  contests: object            // 考试安排 {Mid:[5,15,25,35,45,55], End:[10,20,30,40,50], Final:[60]}
  contestsHistory: array      // 考试历史
  week: number                // 当前周数 (1-60)
  studentAliveNum: number     // 存活学生数
  teacher: Teacher            // 班主任
  pendingLeaveRequests: LeaveRequest[] // 待处理请假
  activeLeaves: object        // 正在请假的学生 {学生索引: 结束周}
  universityDatabase: University[] // 大学数据库
  gaokaoResults: array        // 高考结果
  firstExamAverage: number|null // 第一次考试平均分
  logCallback: function|null     // 日志回调

方法:

  setLogCallback(callback: function) → void
    // 设置日志回调函数
    // 参数: callback - 签名 (message: string, type: string) => void

  log(message: string, type?: string) → void
    // 输出日志
    // 参数: message - 日志内容, type - 日志类型('normal'|'highlight'|'danger'|'warning'|'info')

  nextWeek() → boolean
    // 进入下一周
    // 处理：请假检查、工资发放、精力恢复、学生状态更新、关系更新、随机事件、考试
    // 返回: 是否成功进入下一周

  contest(type: ContestType) → void
    // 进行考试
    // 参数: type - ContestType.Mid | End | Final
    // 内部：计算各科成绩、处理天赋效果、排名、显示结果弹窗

  lastDitch() → void
    // 高考结算
    // 内部：计算高考成绩、志愿填报、显示结算画面

  approveLeaveRequest(requestIndex: number, approved: boolean) → boolean
    // 处理请假申请
    // 参数: requestIndex - 请假申请索引, approved - 是否批准
    // 返回: 是否处理成功

  counselStudent(studentIndex: number) → {success: boolean, message: string}
    // 约谈学生
    // 消耗: 20精力
    // 成功率: 50%
    // 成功: 积极性+5
    // 失败: 班主任血量-1

  reformStudent(studentIndex: number) → {success: boolean, message: string}
    // 调教学生（重置天赋）
    // 消耗: 300元 + 30精力
    // 成功率: 80%

  organizeActivity(activityType = null) → {success: boolean, message: string}
    // 组织班级活动
    // 参数: activityType - 活动类型（可选，不填则随机）
    // 消耗: 40精力

  holdClassMeeting(meetingType = null) → {success: boolean, message: string}
    // 召开班会
    // 参数: meetingType - 班会类型（可选，不填则随机）
    // 消耗: 40精力 + 500元

  expelStudent(studentIndex: number) → {success: boolean, message: string}
    // 劝退学生
    // 50%概率学生拒绝并殴打老师（血量-2）
    // 有弹反天赋：扣老师7血且失败

  sellStudent(studentIndex: number) → {success: boolean, message: string}
    // 贩卖学生
    // 消耗: 40精力
    // 60%成功获得1500元（传奇机长只给200）
    // 40%失败学生殴打老师（血量-7）

  swapSeats(pos1Col: number, pos1Row: number, pos2Col: number, pos2Row: number) → {success: boolean, message: string}
    // 交换两个座位
    // 参数: pos1Col,pos1Row - 座位1行列, pos2Col,pos2Row - 座位2行列

  randomizeSeats() → {success: boolean, message: string}
    // 随机重排座位

  treatStudent(studentIndex: number) → {success: boolean, message: string}
    // 请单个学生吃饭
    // 消耗: 350元 + 30精力
    // 效果: 学生精力+30，积极性+5

  treatAllStudents() → {success: boolean, message: string}
    // 请全班吃饭
    // 消耗: 2000元 + 40精力
    // 效果: 全班精力+5，积极性+3

  instigate(student1Index: number, student2Index: number) → {success: boolean, message: string}
    // 挑拨两个学生关系
    // 成功率: 70%
    // 成功: 两人变为讨厌关系
    // 失败: 学生殴打老师

  buyMedicine() → {success: boolean, message: string}
    // 购买药品
    // 消耗: 500元
    // 效果: 血量+5

  triggerRandomEvent() → void
    // 触发随机事件（每4周，避开考试周）
    // 随机2-3个事件

  triggerSpecificEvent(eventId: number) → void
    // 触发指定事件（调试用）
    // 参数: eventId - 事件ID

  handleRandomEventChoice(eventId: number, optionIndex: number, studentIndex1: number, studentIndex2: number) → void
    // 处理随机事件选择
    // 参数: eventId - 事件ID, optionIndex - 选项索引（-1表示确认事件）, studentIndex1/2 - 相关学生索引

  getWeekInfo() → string
    // 获取当前周信息
    // 返回: "第1学期 第1周 (总第1周) - 第1个月第1周"

  getNextExamWeek() → number|string
    // 获取距离下次考试的周数
    // 返回: 数字或"-"

  // 内部方法（公开供外部调用）:
  _getStudentByIndex(index: number) → Student|null
  _getCompetitionName(competition: Competition) → string
  _getSubjectName(subject: Subject) → string
```

### ShineHumanTeenActivity 运动会卡牌游戏
```js
new ShineHumanTeenActivity(gameClass)

属性:
  gameClass: Class                      // 游戏班级实例
  active: boolean                       // 是否进行中
  round: number                         // 当前回合 (1-10)
  maxRounds: number                     // 最大回合数 (10)
  selectedStudents: number[]            // 选中的8个学生索引
  pairs: array                          // 4对组合 [{carrier, rider}, ...]
  playerBet: number|null                // 玩家下注的组合索引 (0-3)
  betAmount: number                     // 赌注金额
  opponentBet: number|null              // 对手下注的组合索引
  opponentName: string                  // 对手老师名字
  pairStates: array                     // 各组合状态
  animationFrame: number                // 动画帧数
  playerCards: array                    // 玩家手牌
  opponentCards: array                  // 对手手牌
  opponentCard: object|null             // 对手打出的牌
  currentRoundCard: number|null         // 当前选中的卡牌索引
  currentRoundTargetPair: number|null   // 当前回合玩家选中的目标组合
  opponentCardIndex: number|null        // 对手选中的卡牌索引
  opponentTargetPair: number|null       // 对手选中的目标组合
  drawExtraNextRound: boolean           // 下一回合多抽一张牌
  skipNextDraw: boolean                 // 跳过下一回合抽牌
  freezeAllPairs: boolean               // 冻结所有组合不移动
  selectedPairInCanvas: number|null     // Canvas中选中的组合索引 (0-3)
  canvas: HTMLCanvasElement|null        // Canvas元素
  ctx: CanvasRenderingContext2D|null     // Canvas上下文
  animationId: number|null              // 动画ID
  roadOffset: number                    // 跑道偏移量
  finishLineX: number                   // 终点线位置
  isFinished: boolean                   // 是否完成
  winnerIndex: number                   // 获胜组合索引
  resizeListener: function|null        // Resize监听器
  positionAnimationProgress: number     // 位置动画进度 (0-1)
  isNewRound: boolean                   // 是否新回合
  autoTriggerInfoCard: boolean          // 是否自动触发信息卡牌

方法:
  showActivitySelection() → void
    // 显示活动选择界面

  showDetail() → void
    // 显示游戏规则详情弹窗

  hideDetail() → void
    // 隐藏详情弹窗

  showStudentSelection() → void
    // 显示学生选择界面（选8人：4赛人+4骑手）

  confirmStudentSelection() → void
    // 确认学生选择并进入下注界面

  showBettingInterface() → void
    // 显示下注界面

  startRace() → void
    // 开始比赛
    // 验证赌注、初始化游戏、显示游戏界面

  _createActivityModal() → void
    // 创建活动模态框

  _renderStudentGrid() → void
    // 渲染学生选择网格

  clearSelection() → void
    // 清空学生选择

  _determineOpponent() → void
    // 确定对手

  _renderPairList() → void
    // 渲染组合列表

  _initializeGame() → void
    // 初始化游戏

  _generatePlayerCards() → void
    // 生成玩家手牌

  _generateOpponentCards() → void
    // 生成对手手牌

  _drawRandomCard(character, isOpponent = false, excludeInfo = false) → object
    // 抽取随机卡牌

  _getCardById(cardId) → object|null
    // 根据ID获取卡牌

  _showGameInterface() → void
    // 显示游戏界面

  _playGameStartEffect() → void
    // 播放比赛开始的特效

  _resizeCanvas() → void
    // 调整Canvas尺寸

  _renderPlayerCards() → void
    // 渲染玩家手牌

  _startAnimationLoop() → void
    // 开始动画循环

  _renderGame() → void
    // 渲染游戏画面

  _drawTracks(ctx, canvas) → void
    // 绘制赛道

  _drawPairs(ctx, canvas) → void
    // 绘制组合

  _drawBindingLines(ctx, canvas, totalHeight, trackGap, trackHeight, startY, centerX) → void
    // 绘制绑定线

  _easeInOut(t) → number
    // 缓动函数

  _handleCanvasClick(e) → void
    // 处理Canvas点击

  _hitTestPair(clickX, clickY) → number|null
    // 检测点击的组合

  _drawPiggybackPair(ctx, x, y, carrierScale, riderScale, frame, carrierColor, riderColor, frozen = false) → void
    // 绘制背负组合

  _drawSimplePerson(ctx, x, y, scale, frame, color, frozen = false) → void
    // 绘制简单人物

  _drawFinishLine(ctx, canvas) → void
    // 绘制终点线

  _nextRound() → void
    // 进入下一回合

  _autoPlayInfoCardAnimation() → void
    // 自动播放信息卡牌动画

  _playInfoCardAnimation() → void
    // 播放信息卡牌动画

  _showRoundTransition() → void
    // 显示回合过渡

  _playCardRefreshEffect() → void
    // 播放卡牌刷新特效

  _processCardEffectsByPriority() → void
    // 按优先级处理卡牌效果

  _checkCounterEffects() → void
    // 检查反制效果

  _applyCardEffect(card, isPlayer) → void
    // 应用卡牌效果

  _processBindingEffect() → void
    // 处理绑定效果

  _showOpponentCards() → void
    // 显示对手卡牌

  _showNextRoundCards() → void
    // 显示下一回合卡牌

  _getOpponentCharacter() → string
    // 获取对手角色

  _opponentSelectCard() → void
    // 对手选择卡牌

  _isPositiveCard(card) → boolean
    // 判断是否为正面卡牌

  _opponentPlayCard() → void
    // 对手出牌

  _endGame() → void
    // 结束游戏

  _showResult() → void
    // 显示结果

  exitGame() → void
    // 退出游戏
```

---

## 3. 常量

### 时间相关
| 常量 | 值 | 说明 |
|---|---|---|
| `SEMESTER_LENGTH` | 10 | 每学期周数 |
| `WEEKS_PER_MONTH` | 4 | 每月周数 |
| `TOTAL_SEMESTERS` | 6 | 总学期数（60周） |

### 成绩计算权重
| 常量 | 值 | 说明 |
|---|---|---|
| `SCORE_WEIGHT_CAPACITY` | 0.60 | 学习能力权重 |
| `SCORE_WEIGHT_ENTHUSIASM` | 0.25 | 积极性权重 |
| `SCORE_WEIGHT_IQ` | 0.10 | 智商权重 |
| `SCORE_WEIGHT_ENERGY` | 0.05 | 精力权重 |
| `SCORE_FLUCTUATION_STD` | 0.02 | 成绩波动标准差 |

### 成绩影响积极性
| 常量 | 值 | 说明 |
|---|---|---|
| `SCORE_DIFF_THRESHOLD` | 200 | 成绩变化阈值 |
| `SCORE_IMPROVEMENT_FACTOR` | 0.8 | 成绩提升积极性因子 |
| `SCORE_DECLINE_FACTOR` | 1.2 | 成绩下降积极性因子 |
| `SCORE_CHANGE_DECAY` | 0.8 | 成绩变化衰减 |

### 班主任属性
| 常量 | 值 | 说明 |
|---|---|---|
| `TEACHER_ENERGY_DEFAULT` | 100 | 班主任初始精力 |
| `TEACHER_ENERGY_WARNING` | 20 | 精力警告阈值 |
| `TEACHER_HEALTH_MAX` | 10 | 班主任血量上限 |
| `TEACHER_HEALTH_EXAM_COST` | 5 | 精力不足血量消耗 |
| `TEACHER_HEALTH_COUNSEL_FAIL` | 1 | 约谈失败血量消耗 |
| `TEACHER_HEALTH_INSTIGATE_LOVING` | 4 | 挑拨恋人血量消耗 |
| `TEACHER_HEALTH_INSTIGATE_BOY` | 3 | 挑拨男生血量消耗 |
| `TEACHER_MONTHLY_SALARY` | 1500 | 月薪 |
| `TEACHER_MEDICINE_COST` | 500 | 药品价格 |
| `TEACHER_MEDICINE_HEAL` | 5 | 药品回血量 |
| `TEACHER_COUNSEL_ENERGY_COST` | 20 | 约谈精力消耗 |
| `TEACHER_ACTIVITY_ENERGY_COST` | 40 | 组织活动精力消耗 |
| `TEACHER_TREAT_SINGLE_ENERGY_COST` | 30 | 请单个学生吃饭精力消耗 |
| `TEACHER_TREAT_CLASS_ENERGY_COST` | 40 | 请全班吃饭精力消耗 |
| `TEACHER_TREAT_SINGLE_COST` | 350 | 请单个学生吃饭费用 |
| `TEACHER_TREAT_CLASS_COST` | 2000 | 请全班吃饭费用 |
| `TEACHER_CLASS_MEETING_ENERGY_COST` | 40 | 班会精力消耗 |
| `TEACHER_CLASS_MEETING_COST` | 500 | 班会费用 |

### 学生属性
| 常量 | 值 | 说明 |
|---|---|---|
| `STUDENT_ENERGY_DEFAULT` | 70 | 学生初始精力 |
| `STUDENT_ENERGY_MAX` | 100 | 学生精力上限 |
| `STUDENT_ENERGY_MIN` | 0 | 学生精力下限 |
| `STUDENT_ENERGY_RECOVER_NORMAL` | 3.0 | 正常状态精力恢复 |
| `STUDENT_ENERGY_RECOVER_LEAVE` | 8.0 | 请假状态精力恢复 |
| `STUDENT_ENERGY_EXAM_COST` | 20 | 考试精力消耗 |
| `STUDENT_ENERGY_ACTIVITY_COST` | 1 | 活动精力消耗 |
| `STUDENT_ENERGY_TREAT_SINGLE` | 30 | 请单个学生吃饭精力恢复 |
| `STUDENT_ENERGY_TREAT_CLASS` | 5 | 请全班吃饭精力恢复 |
| `STUDENT_ENTHUSIASM_MAX` | 100 | 积极性上限 |
| `STUDENT_ENTHUSIASM_MIN` | 15 | 积极性下限 |
| `STUDENT_ENTHUSIASM_DECAY_BASE` | 0.60 | 积极性基础衰减 |
| `STUDENT_ENTHUSIASM_DECAY_LEAVE` | 2.0 | 请假状态积极性衰减 |
| `STUDENT_ENTHUSIASM_COUNSEL_GAIN` | 5 | 约谈积极性提升 |
| `STUDENT_ENTHUSIASM_ACTIVITY_GAIN` | 3 | 活动积极性提升 |
| `STUDENT_ENTHUSIASM_ACTIVITY_LOSS` | 1 | 活动积极性损失 |

### 关系配置
| 常量 | 值 | 说明 |
|---|---|---|
| `RELATION_IMPROVE_CHAR_DIFF` | 0.3 | 性格差异改善关系 |
| `RELATION_NORMAL_TO_BETTER` | 0.02 | 普通到较好概率 |
| `RELATION_BETTER_TO_FRIEND` | 0.015 | 较好到朋友概率 |
| `RELATION_RANDOM_HATING` | 0.005 | 随机讨厌概率 |
| `RELATION_LOVING_DIFFERENT_GENDER` | 0.008 | 异性恋爱概率 |
| `RELATION_LOVING_SAME_GENDER` | 0.003 | 同性恋爱概率 |
| `RELATION_NEIGHBOR_FRIEND` | 0.03 | 邻座变朋友概率 |
| `RELATION_NEIGHBOR_DISLIKE` | 0.01 | 邻座变不喜欢概率 |
| `RELATION_INSTIGATE_SUCCESS` | 0.7 | 挑拨成功率 |
| `RELATION_FRIEND_ENERGY_GAIN` | 0.6 | 朋友精力恢复 |
| `RELATION_FRIEND_ENTHUSIASM_REDUCTION` | 0.3 | 朋友积极性衰减 |
| `RELATION_FRIEND_HIGH_ENTH_GAIN` | 0.2 | 朋友高积极性提升 |
| `RELATION_HATING_ENERGY_LOSS` | 0.4 | 讨厌精力损失 |
| `RELATION_HATING_ENTHUSIASM_INCREASE` | 0.3 | 讨厌积极性提升 |
| `RELATION_HATING_HIGH_ENTH_PENALTY` | 0.4 | 讨厌高积极性惩罚 |
| `RELATION_HATING_SEVERE_PENALTY` | 0.8 | 讨厌严重惩罚 |
| `RELATION_LOVING_POSITIVE_PROB` | 0.6 | 恋人正面影响概率 |

### 座位配置
| 常量 | 值 | 说明 |
|---|---|---|
| `SEAT_COLUMNS` | 9 | 座位列数 |
| `SEAT_ROWS_MAX` | 12 | 座位行数 |

### 请假配置
| 常量 | 值 | 说明 |
|---|---|---|
| `LEAVE_REQUEST_PROB` | 0.1 | 每周请假概率 |
| `LEAVE_REQUEST_MAX_STUDENTS` | 2 | 每周最大请假人数 |
| `LEAVE_DURATION_MIN` | 1 | 最短请假周数 |
| `LEAVE_DURATION_MAX` | 5 | 最长请假周数 |
| `LEAVE_REQUEST_MUST_HANDLE` | true | 请假必须处理 |

### 学习能力
| 常量 | 值 | 说明 |
|---|---|---|
| `GROWTH_RATE_EASY` | 0.0020 | 简单模式成长率 |
| `GROWTH_RATE_NORMAL` | 0.0018 | 普通模式成长率 |
| `GROWTH_RATE_HARD` | 0.0015 | 困难模式成长率 |
| `BASE_CAP_EASY` | 50 | 简单模式基础能力 |
| `BASE_CAP_NORMAL` | 35 | 普通模式基础能力 |
| `BASE_CAP_HARD` | 25 | 困难模式基础能力 |
| `LEARN_CAP_STD` | 5 | 学习能力标准差 |
| `LEARN_CAP_MIN` | 20 | 学习能力下限 |
| `LEARN_CAP_MAX` | 65 | 学习能力上限 |
| `LEARN_INCREASE_NOISE` | 0.08 | 学习能力增长噪声 |
| `LEARN_CAP_DECAY_WEEKLY` | 0.03 | 学习能力每周衰减 |
| `LEARN_CAP_DECAY_LEAVE` | 0.5 | 请假期间学习能力衰减 |

### 天赋相关
| 常量 | 值 | 说明 |
|---|---|---|
| `TALENT_PROBABILITY` | 0.6 | 学生拥有天赋概率 |
| `TALENT_MIN_COUNT` | 1 | 最少天赋数量 |
| `TALENT_MAX_COUNT` | 2 | 最多天赋数量 |
| `TALENT_RESET_COST` | 300 | 调教费用 |
| `TALENT_RESET_ENERGY` | 30 | 调教精力消耗 |
| `TALENT_RESET_SUCCESS_RATE` | 0.8 | 调教成功率 |

### 其他常量
| 常量 | 值 | 说明 |
|---|---|---|
| `COUNSEL_SUCCESS_RATE` | 0.5 | 约谈成功率 |
| `ACTIVITY_SUCCESS_RATE` | 0.7 | 活动成功率 |
| `NAME_DISPLAY_LENGTH` | 4 | 姓名显示长度 |
| `IMPOSSIBLE_CHANCE_EASY_COMPETITION` | 5 | 简单模式竞赛概率 |
| `ENERGY_NOISE_RANGE` | 0.8 | 精力噪声范围 |
| `ENTHUSIASM_NOISE_RANGE` | 2.0 | 积极性噪声范围 |
| `COMPETITION_STUDENT_RATIO` | 0.2 | 竞赛生比例（20%） |
| `COMPETITION_TRAINING_WEEKS` | 2 | 集训周数（2周） |
| `COMPETITION_LEAGUE_TO_PROVINCIAL_RATE` | 0.4 | 联赛进入省队概率（40%） |
| `COMPETITION_NATIONAL_GOLD_RATE` | 0.05 | 国赛金牌概率（5%） |
| `COMPETITION_NATIONAL_SILVER_RATE` | 0.1 | 国赛银牌概率（10%） |
| `COMPETITION_NATIONAL_BRONZE_RATE` | 0.15 | 国赛铜牌概率（15%） |
| `COMPETITION_TRAINING_LEARN_CAP_DECAY` | 0.8 | 集训期间学习能力衰减 |

### 物品系统
| 常量 | 值 | 说明 |
|---|---|---|
| `INVENTORY_MAX_SLOTS` | 9 | 物品栏最大格子数 |
| `INVENTORY_MAX_ITEM_STACK` | 8 | 每种物品最大数量 |

**ItemInfo 物品信息**
```js
ItemInfo = {
  [Item.HERO_PEN]: {
    id: 1,
    name: "希罗的钢笔",
    icon: "./assets/items/pen.png",
    type: "special",
    usable: false,
    consumable: false,
    description: "办公桌上遗留的，你占为己有"
  },
  [Item.ICE_TEA]: {
    id: 2,
    name: "小冰茶",
    icon: "./assets/items/medicine.png",
    type: "consumable",
    usable: true,
    consumable: true,
    description: "食堂的新品，喝了令人积极向上",
    effectDescription: "增加5点血量"
  },
  [Item.YIJIN_JING]: {
    id: 3,
    name: "易筋经",
    icon: "./assets/items/classic.png",
    type: "consumable",
    usable: true,
    consumable: true,
    description: "某个同事的秘籍",
    effectDescription: "将精力上限增加至120"
  },
  [Item.ONE_YUAN_ICE_TEA]: {
    id: 4,
    name: "一元乐享（小冰茶）",
    icon: "./assets/items/cap.png",
    type: "consumable",
    usable: true,
    consumable: true,
    description: "喝小冰茶40%概率获得",
    effectDescription: "花费一元获得一瓶小冰茶"
  }
}
```

### 姓名系统
| 常量 | 值 | 说明 |
|---|---|---|
| `SURNAMES` | array | 姓氏池（250个：200单姓 + 50复姓） |
| `BOY_GIVEN_NAMES_SINGLE` | array | 男生单字名池（100个） |
| `BOY_GIVEN_NAMES_DOUBLE` | array | 男生双字名池（150个） |
| `GIRL_GIVEN_NAMES_SINGLE` | array | 女生单字名池（100个） |
| `GIRL_GIVEN_NAMES_DOUBLE` | array | 女生双字名池（150个） |
| `RANDOM_PRESET` | NamePreset | 纯随机生成预设 |
| `DEFAULT_PRESET` | NamePreset | 默认姓名库预设 |
| `ALIAS_PRESET` | NamePreset | 化名预设 |

---

## 4. 全局变量

```js
gameClass              // Class - 当前班级实例
selectedStudentIndex   // number|null - 当前选中的学生索引
viewMode               // string - 视图模式: 'normal' | 'relation' | 'status' | 'competition'
instigateMode          // boolean - 挑拨模式是否开启
swapMode               // boolean - 换座位模式是否开启
swapFirstStudent       // number|null - 换座位时第一个学生的索引
leaveAutoHandle        // string - 请假自动处理: 'manual' | 'approve' | 'reject'
namePresets            // NamePreset[] - 所有预设数组（包含：RANDOM_PRESET, DEFAULT_PRESET, ALIAS_PRESET, 自定义预设）
currentNamePreset      // NamePreset|null - 当前选中的预设
usedNames              // Set<string> - 已使用的姓名集合
```

---

## 5. 工具函数

### 检测与工具
```js
isMobileDevice() → boolean
  // 检测是否为移动设备
  // 综合判断：User-Agent、触摸能力、屏幕比例、DPI

forceLandscape() → void
  // 移动端强制横屏显示，显示提示层

isThisImpossible(n: number) → boolean
  // 检测1/n的概率是否发生
  // 返回: Math.floor(Math.random() * n) + 1 === 1

randomGauss(mid: number, d: number, lft: number, rt: number, maxAttempts?: number) → number
  // 生成正态分布随机数
  // 参数: mid-均值, d-标准差, lft-下限, rt-上限
  // 返回: 范围内的整数

randomCap(gameMode: GameMode) → number
  // 根据游戏难度生成随机能力值
  // Easy: 90±8 (75-100), Normal: 65±10 (45-85), Hard: 45±10 (25-65)

generateUniqueName(gender: Gender) → string
  // 生成不重复的随机姓名
  // 参数: gender - Gender.Boy 或 Gender.Girl
  // 返回: 生成的姓名

resetNamePool() → void
  // 重置名字池（游戏开始时调用）

getUniversityDatabase() → University[]
  // 获取大学数据库
  // 返回: 约57所大学的数组
```

### 姓名系统
```js
initializeNamePresets() → void
  // 初始化预设系统
  // 从localStorage加载自定义预设，初始化预设数组
  // 内置预设：RANDOM_PRESET, DEFAULT_PRESET, ALIAS_PRESET

loadNamePreset(presetId: string) → void
  // 加载指定预设
  // 参数: presetId - 预设ID（random/default/alias/custom_xxx）

generateUniqueName(gender: Gender) → string
  // 生成唯一姓名
  // 参数: gender - 性别
  // 返回: 生成的姓名
  // 逻辑: 优先从预设选择，不足时使用随机生成器

generateRandomName(gender: Gender) → string
  // 生成随机姓名
  // 参数: gender - 性别
  // 返回: 随机生成的姓名
  // 逻辑: 姓氏+名字组合，支持单姓和复姓

importCustomPreset(file: File) → Promise<NamePreset>
  // 导入自定义预设
  // 参数: file - JSON文件
  // 返回: Promise，成功时返回NamePreset对象

resetNamePool() → void
  // 重置名字池
  // 清空已使用姓名集合
```

### UI渲染
```js
renderAll() → void
  // 渲染所有UI：状态栏、座位网格、考试历史、按钮状态、信息面板

updateStatusBar() → void
  // 更新顶部状态栏：周数、角色、下周考试、精力、工资、血量

renderSeatingGrid() → void
  // 渲染座位网格
  // 根据viewMode显示不同颜色：normal(性别)/relation(关系)/status(状态)/competition(竞赛)

updateInfoPanel() → void
  // 更新选中学生的详细信息面板
  // 显示：姓名、性别、状态、精力、积极性、智商、竞赛信息、天赋、学习能力、关系

updateButtonStates() → void
  // 更新按钮启用/禁用状态
  // 需要选中学生才能操作的按钮：expelBtn, counselBtn, treatSingleBtn, reformBtn, sellBtn等

renderExamHistory() → void
  // 渲染考试历史列表（从新到旧）

showExamDetail(exam: object) → void
  // 显示考试详情弹窗
  // 参数: exam - 考试历史中的条目
  // 显示：统计信息、各学生成绩排名

addLogEntry(message: string, type?: string) → void
  // 添加日志条目
  // 参数: message - 日志内容, type - 样式类名
```

### Tooltip系统
```js
initGlobalTooltip() → void
  // 初始化全局tooltip（创建DOM元素，绑定事件）

showGlobalTooltip(element: HTMLElement, text: string) → void
  // 显示tooltip
  // 参数: element - 触发元素, text - 显示文本

hideGlobalTooltip() → void
  // 隐藏tooltip

updateTooltipPosition(element: HTMLElement) → void
  // 更新tooltip位置（跟随鼠标）

showRelationTooltip(element: HTMLElement, student: Student) → void
  // 关系模式：显示两个学生间的关系

showStatusTooltip(element: HTMLElement, student: Student) → void
  // 状态模式：显示学生状态、精力、积极性

showCompetitionTooltip(element: HTMLElement, student: Student) → void
  // 竞赛模式：显示竞赛科目、阶段、奖项、集训状态
```

### 弹窗
```js
showNotification(type: string, title: string, message: string) → void
  // 显示通知弹窗（带队列）
  // type: 'success' | 'error' | 'warning' | 'danger'

showRandomEventModal(eventData: object, studentIndex1?, studentIndex2?, subject1?, subject2?) → void
  // 显示随机事件弹窗
  // 参数: eventData - 事件数据, studentIndex1/2 - 相关学生索引, subject1/2 - 相关科目

showExamResultModal(type: string, title: string, message: string) → void
  // 显示考试/竞赛结果弹窗

showStudentDeathModal(studentName?: string, names?: string) → void
  // 显示学生死亡通知弹窗

showEndGameScreen() → void
  // 显示游戏结束/结算画面
```

### 游戏控制
```js
startGame(e: Event) → void
  // 开始游戏（表单提交）
  // 隐藏菜单，显示角色选择界面

startGameWithCharacter(characterType: string) → void
  // 选择角色后开始游戏
  // 参数: characterType - 'wei' | 'wang' | 'qin'
  // 初始化Class实例，设置日志回调，显示游戏界面

saveGame() → void
  // 保存游戏到JSON文件
  // 文件名格式: 班主任模拟器_YYYYMMDDHHMMSS.json

loadGame(event: Event) → void
  // 从文件加载游戏
  // 参数: change事件

// localStorage存档系统
getLocalStorageSaveInfo(slotIndex: number) → object|null
  // 获取存档槽位信息
  // 参数: slotIndex - 存档槽位索引（1-5）
  // 返回: {timestamp, week, mode, classType, studentNum, character, studentAliveNum} 或 null

saveToLocalStorage(slotIndex: number) → {success: boolean, message: string}
  // 保存到localStorage
  // 参数: slotIndex - 存档槽位索引（1-5）
  // 返回: 操作结果

loadFromLocalStorage(slotIndex: number) → {success: boolean, message: string}
  // 从localStorage加载
  // 参数: slotIndex - 存档槽位索引（1-5）
  // 返回: 操作结果

deleteLocalStorageSave(slotIndex: number) → {success: boolean, message: string}
  // 删除localStorage存档
  // 参数: slotIndex - 存档槽位索引（1-5）
  // 返回: 操作结果

loadGameFromData(gameData: object) → {success: boolean, message: string}
  // 从游戏数据加载
  // 参数: gameData - 游戏数据对象
  // 返回: 操作结果

renderSaveSlots(containerId: string, isLoadMode: boolean) → void
  // 渲染存档槽位
  // 参数: containerId - 容器ID, isLoadMode - 是否为加载模式

showLoadModal() → void
  // 显示载入弹窗

closeLoadModal() → void
  // 关闭载入弹窗

showSaveModal() → void
  // 显示保存弹窗

closeSaveModal() → void
  // 关闭保存弹窗

showOverwriteConfirm(slotIndex: number) → void
  // 显示覆盖确认
  // 参数: slotIndex - 存档槽位索引

closeOverwriteConfirm() → void
  // 关闭覆盖确认

showDeleteConfirm(slotIndex: number) → void
  // 显示删除确认
  // 参数: slotIndex - 存档槽位索引

closeDeleteConfirm() → void
  // 关闭删除确认

initNewGameBackground() → void
  // 初始化新游戏设置界面背景

returnToMenu() → void
  // 返回主菜单
  // 重置所有全局状态
```

### 学生操作
```js
selectStudent(index: number|null) → void
  // 选中/取消选中学生
  // 参数: index - 学生索引，null表示取消

handleSeatClick(col: number, row: number, student: Student|null) → void
  // 处理座位点击
  // 根据当前模式（swapMode/instigateMode）执行不同操作

toggleViewMode(mode: string) → void
  // 切换视图模式
  // 参数: 'normal' | 'relation' | 'status' | 'competition'

cancelMode() → void
  // 取消当前模式（挑拨/换座）

expelSelectedStudent() → void
  // 劝退选中的学生（弹出确认框）

counselSelectedStudent() → void
  // 约谈选中的学生

treatSelectedStudent() → void
  // 请选中的学生吃饭

treatAllStudents() → void
  // 请全班吃饭

reformSelectedStudent() → void
  // 调教选中的学生（重置天赋）

sellSelectedStudent() → void
  // 贩卖选中的学生

startSwapMode() → void
  // 开始换座位模式（需先选中一个学生）

handleSwapClick(col: number, row: number, student: Student|null) → void
  // 处理换座位点击

startInstigateMode() → void
  // 开始挑拨模式（需先选中一个学生）

handleInstigateClick(col: number, row: number, student: Student|null) → void
  // 处理挑拨点击

organizeActivity() → void
  // 组织班级活动（读取select值）

holdClassMeeting() → void
  // 召开班会（读取select值）

buyMedicine() → void
  // 购买药品

showLeaveRequests() → void
  // 显示请假申请处理界面

handleSingleLeaveRequest(index: number, approved: boolean) → void
  // 处理单个请假申请
  // 参数: index - 申请索引, approved - 是否批准
```

### 运动会
```js
window.openSportsDayEvent() → void
  // 控制台调用：打开运动会选择界面
  // 等效于调用 openSportsDay()
```

---

## 6. 数据结构

### 姓名预设 `NamePreset`
```js
{
  id: "random",                    // 预设ID
  name: "🎲 纯随机生成",           // 预设名称
  description: "所有姓名使用随机生成器生成，不保存固定姓名",  // 预设描述
  boyNames: [],                    // 男生姓名数组
  girlNames: [],                   // 女生姓名数组
  isRandomOnly: true               // 是否纯随机模式
}
```

**内置预设：**
- `RANDOM_PRESET` - 纯随机生成
- `DEFAULT_PRESET` - 默认姓名库
- `ALIAS_PRESET` - 化名预设

### 自定义预设文件格式
```json
{
  "name": "我的预设",
  "description": "自定义姓名预设",
  "boyNames": ["张三", "李四", "王五"],
  "girlNames": ["小红", "小芳", "小丽"],
  "isRandomOnly": false
}
```

### 学生关系 `relation`
```js
{
  1: Relations.Normal,  // 该学生对1号学生的关系
  2: Relations.Friend,  // 对2号学生是朋友关系
  // ...每个学生对自己都是Relations.Self
}
```

### 座位表 `seats`
```js
[  // 9列
  [Student, Student, Student, ...],  // 第1列，从前到后
  [Student, null, Student, ...],     // 第2列，null表示空座位
  ...
]
```

### 学习能力 `learnCap`
```js
{
  1: 45.5,   // 语文能力 (Subject.Chinese)
  2: 52.3,   // 数学能力 (Subject.Maths)
  3: 38.7,   // 英语能力 (Subject.English)
  4: 60.0,   // 物理能力（理科班）(Subject.Physics)
  // ... key为Subject的数值
}
```

### 考试历史 `contestsHistory`
```js
[{
  week: 5,
  type: ContestType.Mid,
  average: 456.7,
  details: [{
    studentIndex: 1,
    name: "张三",
    totalScore: 520.5,
    iq: 85,
    enthusiasm: 75,
    energy: 80,
    scores: { 1: 85, 2: 90, 3: 78, ... }  // key为Subject的数值
  }, ...]
}]
```

### 高考结果 `gaokaoResults`
```js
[{
  student: Student,
  gaokaoScore: 580,
  admittedUniversity: University
}]
```

### 随机事件数据
```js
// 选择型事件
{
  id: 1,
  type: 'choice',
  template: '{student}跑路去机房打游戏',
  options: [
    { text: '严厉惩罚', effect: 'energy:-10, enthusiasm:-5, learnCap:-2' },
    { text: '耐心劝导', effect: 'energy:-5, enthusiasm:+5, learnCap:+1' },
    { text: '关我吊事', effect: 'energy:+2' }
  ]
}

// 确认型事件
{
  id: 101,
  type: 'confirm',
  template: '隔壁厕所爆炸了，班里香气四溢！！',
  buttonText: '大开眼界',
  effect: 'energy:+5'
}
```

---

## 7. 角色数据

```js
CharacterData = {
  [Character.WEI]: {
    name: '魏教授',
    subject: Subject.Physics,
    trait: '半步年级长',
    monthlySalary: 1700,
    maxEnergy: 100,
    recoverEnergy: 100,
    noSalaryPenalty: true,    // 学生死亡不扣工资
    reviveChance: 0
  },
  [Character.WANG]: {
    name: '王老师',
    subject: Subject.Chemistry,
    trait: '劳模体质',
    monthlySalary: 1500,
    maxEnergy: 140,
    recoverEnergy: 140,
    noSalaryPenalty: false,
    reviveChance: 0
  },
  [Character.QIN]: {
    name: '秦老师',
    subject: Subject.Maths,
    trait: '装糖阴他们一手',
    monthlySalary: 1500,
    maxEnergy: 100,
    recoverEnergy: 100,
    noSalaryPenalty: false,
    reviveChance: 0.35       // 35%概率复活学生
  }
}
```

---

## 8. 游戏流程

1. **主菜单** → 选择难度、班型、学生数量
2. **角色选择** → 选择班主任角色（魏/王/秦）
3. **游戏进行** (60周循环):
   - 处理请假 → 进入下一周
   - 学生状态更新 → 关系变化
   - 随机事件（每4周）
   - 考试（期5/10/15.../60）
   - 高考（第60周）
4. **结算画面** → 显示存活率、录取情况、评价

---

> 文档版本: 3.7
> 最后更新: 2025年4月29日