// ============================================================================
// 班主任模拟器 - 完整游戏逻辑
// ============================================================================

// ============================================================================
// 常量配置
// ============================================================================

// 时间配置
const SEMESTER_LENGTH = 10;  // 每学期10周
const WEEKS_PER_MONTH = 4;
const TOTAL_SEMESTERS = 6;  // 共6学期，总时长60周

// 精力配置
const TEACHER_ENERGY_DEFAULT = 100;
const TEACHER_ENERGY_WARNING = 20;
const TEACHER_ENERGY_RECOVER_WEEKLY = 0;
const STUDENT_ENERGY_DEFAULT = 70;
const STUDENT_ENERGY_MAX = 100;
const STUDENT_ENERGY_MIN = 0;
const STUDENT_ENERGY_RECOVER_NORMAL = 3.0;
const STUDENT_ENERGY_RECOVER_LEAVE = 8.0;
const STUDENT_ENERGY_EXAM_COST = 20;
const STUDENT_ENERGY_ACTIVITY_COST = 1;
const STUDENT_ENERGY_TREAT_SINGLE = 30;
const STUDENT_ENERGY_TREAT_CLASS = 5;

// 积极性配置
const STUDENT_ENTHUSIASM_MAX = 100;
const STUDENT_ENTHUSIASM_MIN = 15;
const STUDENT_ENTHUSIASM_DECAY_BASE = 0.60;
const STUDENT_ENTHUSIASM_DECAY_LEAVE = 2.0;
const STUDENT_ENTHUSIASM_COUNSEL_GAIN = 5;
const STUDENT_ENTHUSIASM_ACTIVITY_GAIN = 3;
const STUDENT_ENTHUSIASM_ACTIVITY_LOSS = 1;

// 成绩计算权重
const SCORE_WEIGHT_CAPACITY = 0.60;
const SCORE_WEIGHT_ENTHUSIASM = 0.25;
const SCORE_WEIGHT_IQ = 0.10;
const SCORE_WEIGHT_ENERGY = 0.05;
const SCORE_FLUCTUATION_STD = 0.02;

// 成绩影响积极性
const SCORE_DIFF_THRESHOLD = 200;
const SCORE_IMPROVEMENT_FACTOR = 0.8;
const SCORE_DECLINE_FACTOR = 1.2;
const SCORE_CHANGE_DECAY = 0.8;

// 班主任配置
const TEACHER_HEALTH_MAX = 10;
const TEACHER_HEALTH_EXAM_COST = 7;
const TEACHER_HEALTH_COUNSEL_FAIL = 1;
const TEACHER_HEALTH_INSTIGATE_LOVING = 4;
const TEACHER_HEALTH_INSTIGATE_BOY = 3;
const TEACHER_MONTHLY_SALARY = 1500;
const TEACHER_MEDICINE_COST = 500;
const TEACHER_MEDICINE_HEAL = 5;
const TEACHER_COUNSEL_ENERGY_COST = 20;
const TEACHER_ACTIVITY_ENERGY_COST = 40;
const TEACHER_TREAT_SINGLE_ENERGY_COST = 30;
const TEACHER_TREAT_CLASS_ENERGY_COST = 40;
const TEACHER_TREAT_SINGLE_COST = 350;
const TEACHER_TREAT_CLASS_COST = 2000;
const TEACHER_CLASS_MEETING_ENERGY_COST = 40;
const TEACHER_CLASS_MEETING_COST = 500;

// 关系配置
const RELATION_IMPROVE_CHAR_DIFF = 0.3;
const RELATION_NORMAL_TO_BETTER = 0.02;
const RELATION_BETTER_TO_FRIEND = 0.015;
const RELATION_RANDOM_HATING = 0.005;
const RELATION_LOVING_DIFFERENT_GENDER = 0.004;
const RELATION_LOVING_SAME_GENDER = 0.0015;
const RELATION_NEIGHBOR_FRIEND = 0.03;
const RELATION_NEIGHBOR_DISLIKE = 0.01;
const RELATION_INSTIGATE_SUCCESS = 0.7;
const RELATION_FRIEND_ENERGY_GAIN = 0.6;
const RELATION_FRIEND_ENTHUSIASM_REDUCTION = 0.3;
const RELATION_FRIEND_HIGH_ENTH_GAIN = 0.2;
const RELATION_HATING_ENERGY_LOSS = 0.4;
const RELATION_HATING_ENTHUSIASM_INCREASE = 0.3;
const RELATION_HATING_HIGH_ENTH_PENALTY = 0.4;
const RELATION_HATING_SEVERE_PENALTY = 0.8;
const RELATION_LOVING_POSITIVE_PROB = 0.6;

// 座位配置
const SEAT_COLUMNS = 9;
const SEAT_ROWS_MAX = 12;

// 请假配置
const LEAVE_REQUEST_PROB = 0.1;
const LEAVE_REQUEST_MAX_STUDENTS = 2;
const LEAVE_DURATION_MIN = 1;
const LEAVE_DURATION_MAX = 5;
const LEAVE_REQUEST_MUST_HANDLE = true;

// 请假理由池
const LEAVE_REASONS_COMMON = [
    "回家玩原神",
    "参加爸爸妈妈的婚礼",
    "steam求生之路2打折要回家买",
    "痔疮发作",
    "感冒",
    "高烧1538摄氏度",
    "拉裤子回家换裤头",
    "继承家产",
    "计算芙宁娜IP价值",
    "往迷你世界充了6块被发现了，回家挨打",
    "网卡断触卡键手抖误触瓶颈期没手感没心态没状态",
    "叛徒特务大军阀，反党分子野心家，走资派投降派修正主义大恶霸回家挨批斗",
    "孙笑川过世，继承日本天皇王位",
    "柚子社发新作了"
];

// 男生专属请假理由
const LEAVE_REASONS_BOY_ONLY = [
    "网购的斐济杯到货了",
    "小区发魅魔",
    "得了唐氏综合征",
    "炉管炸膛",
    "白嫖染梅毒"
];

// 成长配置
const GROWTH_RATE_EASY = 0.0020;  // 简单模式成长率稍高
const GROWTH_RATE_NORMAL = 0.0018;
const GROWTH_RATE_HARD = 0.0015;  // 困难模式成长率最低
const BASE_CAP_EASY = 50;  // 简单模式基础能力值最高
const BASE_CAP_NORMAL = 35;  // 普通模式基础能力值中等
const BASE_CAP_HARD = 25;  // 困难模式基础能力值最低
const LEARN_CAP_STD = 5;
const LEARN_CAP_MIN = 20;
const LEARN_CAP_MAX = 65;  // 全局上限，简单模式实际最大62
const LEARN_INCREASE_NOISE = 0.08;
const LEARN_CAP_DECAY_WEEKLY = 0.03;
const LEARN_CAP_DECAY_LEAVE = 0.5;  // 请假期间学习能力每周衰减

// 天赋系统配置
const TALENT_PROBABILITY = 0.6;  // 学生拥有天赋的概率
const TALENT_MIN_COUNT = 1;  // 最少天赋个数
const TALENT_MAX_COUNT = 2;  // 最多天赋个数
const TALENT_RESET_COST = 300;  // 调教消耗资金
const TALENT_RESET_ENERGY = 30;  // 调教消耗精力
const TALENT_RESET_SUCCESS_RATE = 0.8;  // 调教成功率

// 天赋定义
const Talent = {
    FILL_MISSING_EXAM: 1,        // 填缺考标记
    FORGET_NAME: 2,              // 忘填名字
    SPORTS_STUDENT: 3,           // 体育生
    LEGENDARY_CAPTAIN: 4,        // 传奇机长
    BOXER_MEMBER: 5,             // 义和团员
    GOOD_STUDENT: 6,             // 三好学生
    CLAIRVOYANT: 7,              // 千里眼
    SCIENCE_GOD: 8,              // 理科战神
    IRON_MAN: 9,                 // 铁人
    INDIFFERENT: 10,             // 冷漠
    BURST: 11,                   // 爆发
    GALOIS: 12,                  // 伽罗瓦
    LITERATURE_STAR: 13,         // 文曲星
    DARK_CRAWLER: 14,            // 阴暗爬行
    VIOLENT: 15,                 // 暴力
    PARRY: 16,                   // 弹反
    PLAYBOY: 17,                 // 海王
    ENTHUSIASTIC: 18,            // 热情
    LIN_DAIYU: 19,               // 林黛玉
    SMOKER: 20                   // 大烟鬼
};

// 天赋详细信息
const TALENT_INFO = {
    [Talent.FILL_MISSING_EXAM]: {
        name: '填缺考标记',
        description: '每次考试各科均有20%概率得0分'
    },
    [Talent.FORGET_NAME]: {
        name: '忘填名字',
        description: '每次考试每科均有5%概率得0分'
    },
    [Talent.SPORTS_STUDENT]: {
        name: '体育生',
        description: '精力恢复快，学习能力增长慢'
    },
    [Talent.LEGENDARY_CAPTAIN]: {
        name: '传奇机长',
        description: '每次考前一星期大幅降低精力，大幅增加学习能力（仅限男生）'
    },
    [Talent.BOXER_MEMBER]: {
        name: '义和团员',
        description: '英语学习能力保持较低'
    },
    [Talent.GOOD_STUDENT]: {
        name: '三好学生',
        description: '积极性增长快，学习能力增长快'
    },
    [Talent.CLAIRVOYANT]: {
        name: '千里眼',
        description: '每次考试有一科30%概率多得20分，20%概率得0分'
    },
    [Talent.SCIENCE_GOD]: {
        name: '理科战神',
        description: '数理化生学习能力高，语文英语与政史地能力保持较低'
    },
    [Talent.IRON_MAN]: {
        name: '铁人',
        description: '永不请假，不会因精力耗尽而死'
    },
    [Talent.INDIFFERENT]: {
        name: '冷漠',
        description: '与他人关系不会变化，不与他人交往'
    },
    [Talent.BURST]: {
        name: '爆发',
        description: '考试成绩降低超10%，则积极性增加20'
    },
    [Talent.GALOIS]: {
        name: '伽罗瓦',
        description: '数学学习能力保持较高'
    },
    [Talent.LITERATURE_STAR]: {
        name: '文曲星',
        description: '语文学习能力保持较高'
    },
    [Talent.DARK_CRAWLER]: {
        name: '阴暗爬行',
        description: '积极性保持较低'
    },
    [Talent.VIOLENT]: {
        name: '暴力',
        description: '每回合有2%概率殴打班主任，扣除班主任3血量'
    },
    [Talent.PARRY]: {
        name: '弹反',
        description: '无法被劝退；当被劝退时殴打班主任，扣除班主任7点血量'
    },
    [Talent.PLAYBOY]: {
        name: '海王',
        description: '大概率同时与多人恋爱；恋人迅速变化'
    },
    [Talent.ENTHUSIASTIC]: {
        name: '热情',
        description: '与他人关系只增不减'
    },
    [Talent.LIN_DAIYU]: {
        name: '林黛玉',
        description: '大幅增加请假概率'
    },
    [Talent.SMOKER]: {
        name: '大烟鬼',
        description: '每回合10%概率抽烟，抽烟时50%概率恢复50精力（到100为止），50%概率被直接劝退'
    }
};

// 天赋池（所有天赋）
const TALENT_POOL = Object.values(Talent);

// 其他配置
const IMPOSSIBLE_CHANCE_EASY_COMPETITION = 5;
const ENERGY_NOISE_RANGE = 0.8;
const ENTHUSIASM_NOISE_RANGE = 2.0;
const COUNSEL_SUCCESS_RATE = 0.5;
const ACTIVITY_SUCCESS_RATE = 0.7;
const NAME_DISPLAY_LENGTH = 4;

// 竞赛配置
const COMPETITION_STUDENT_RATIO = 0.2;  // 竞赛生比例（20%）
const COMPETITION_TRAINING_WEEKS = 2;  // 集训周数（2周）
const COMPETITION_LEAGUE_TO_PROVINCIAL_RATE = 0.4;  // 联赛进入省队概率（40%）
const COMPETITION_NATIONAL_GOLD_RATE = 0.05;  // 国赛金牌概率（5%）
const COMPETITION_NATIONAL_SILVER_RATE = 0.1;  // 国赛银牌概率（10%）
const COMPETITION_NATIONAL_BRONZE_RATE = 0.15;  // 国赛铜牌概率（15%）
const COMPETITION_TRAINING_LEARN_CAP_DECAY = 0.8;  // 集训期间学习能力衰减

// ============================================================================
// 竞赛相关枚举
// ============================================================================

const Competition = {
    MO: 1,
    PhO: 2,
    ChO: 3,
    BO: 4,
    OI: 5
};

const CompetitionStage = {
    League: 1,
    National: 2
};

const CompetitionAward = {
    None: 0,
    Bronze: 1,
    Silver: 2,
    Gold: 3
};

// 竞赛时间表（高二）
const COMPETITION_SCHEDULE = {
    // 第3学期
    31: [{ competition: Competition.ChO, stage: CompetitionStage.National }],  // 化学国赛
    31: [{ competition: Competition.MO, stage: CompetitionStage.League }],  // 数学联赛
    32: [{ competition: Competition.PhO, stage: CompetitionStage.League }],  // 物理联赛
    33: [{ competition: Competition.MO, stage: CompetitionStage.National }, { competition: Competition.PhO, stage: CompetitionStage.National }],  // 数学国赛 + 物理国赛
    34: [{ competition: Competition.OI, stage: CompetitionStage.League }],  // 信息学联赛
    // 第4学期
    43: [{ competition: Competition.BO, stage: CompetitionStage.League }],  // 生物联赛
    50: [{ competition: Competition.BO, stage: CompetitionStage.National }, { competition: Competition.OI, stage: CompetitionStage.National }]  // 生物国赛 + 信息学国赛
};

// ============================================================================
// 物品系统
// ============================================================================

// 物品枚举（预留扩展）
const Item = {
    HERO_PEN: 1,                // 希罗的钢笔 - 办公桌上遗留的，你占为己有
    ICE_TEA: 2,                 // 小冰茶 - 食堂的新品，喝了令人积极向上
    YIJIN_JING: 3,              // 易筋经 - 某个同事送给你的秘籍
    ONE_YUAN_ICE_TEA: 4,        // 一元乐享（小冰茶） - 喝小冰茶40%概率获得
    ANGRY: 5,                   // 暴怒 - 使你非常生气！！！
    MP5: 6,                     // mp5 - 可以击毙学生
    CHA_CUI: 7,                 // 茶脆 - 食堂的旧品，中奖概率非常低！！
    ONE_YUAN_CHA_CUI: 8,        // 一元乐享（茶脆） - 喝茶脆1%概率获得
    SIGMA: 9,                   // Σ - 经典永流传
    CHEERS: 10,                 // cheers! - congratulations！：太棒了
    CLAY_FIGURE: 11,             // 泥巴人 - 某同事孩子制作：没用但是很可爱
    MP7: 12                      // mp7 - 德国HK公司设计制造的冲锋枪
};

// 物品信息映射
const ItemInfo = {
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
        icon: "./assets/items/drink1.png",
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
    },
    [Item.ANGRY]: {
        id: 5,
        name: "暴怒",
        icon: "./assets/items/angry.png",
        type: "special",
        usable: false,
        consumable: false,
        description: "",
        effectDescription: "使你非常生气！！！"
    },
    [Item.MP5]: {
        id: 6,
        name: "mp5",
        icon: "./assets/items/mp5.png",
        type: "special",
        usable: true,
        consumable: false,
        description: "德国HK公司设计制造的冲锋枪",
        effectDescription: "可以击毙学生"
    },
    [Item.CHA_CUI]: {
        id: 7,
        name: "茶脆",
        icon: "./assets/items/drink2.png",
        type: "consumable",
        usable: true,
        consumable: true,
        description: "食堂的旧品，中奖概率非常低！！",
        effectDescription: "精力回满"
    },
    [Item.ONE_YUAN_CHA_CUI]: {
        id: 8,
        name: "一元乐享（茶脆）",
        icon: "./assets/items/cap.png",
        type: "consumable",
        usable: true,
        consumable: true,
        description: "喝茶脆1%概率获得",
        effectDescription: "花费一元获得一瓶茶脆"
    },
    [Item.SIGMA]: {
        id: 9,
        name: "Σ",
        icon: "./assets/items/sigma.png",
        type: "consumable",
        usable: true,
        consumable: true,
        description: "经典永流传",
        effectDescription: "使学生的物理学习能力增加40"
    },
    [Item.CHEERS]: {
        id: 10,
        name: "cheers！",
        icon: "./assets/items/cheers.png",
        type: "special",
        usable: false,
        consumable: false,
        description: "congratulations！",
        effectDescription: "太棒了"
    },
    [Item.CLAY_FIGURE]: {
        id: 11,
        name: "泥巴人",
        icon: "./assets/items/figure.png",
        type: "special",
        usable: false,
        consumable: false,
        description: "某同事孩子制作",
        effectDescription: "没用但是很可爱"
    },
    [Item.MP7]: {
        id: 12,
        name: "mp7",
        icon: "./assets/items/mp7.png",
        type: "defense",
        usable: false,
        consumable: false,
        description: "德国HK公司设计制造的冲锋枪",
        effectDescription: "放在背包中自动生效，抵消10点伤害"
    }
};

// 食堂可购买物品配置（按楼层分类）
const CanteenItems = {
    1: { // 一楼
        [Item.ICE_TEA]: {
            price: 600,
            available: true
        },
        [Item.ONE_YUAN_ICE_TEA]: {
            price: 600,
            available: true
        },
        [Item.CHA_CUI]: {
            price: 600,
            available: true
        },
        [Item.ONE_YUAN_CHA_CUI]: {
            price: 600,
            available: true
        },
        [Item.SIGMA]: {
            price: 400,
            available: true
        },
        [Item.CHEERS]: {
            price: 2500,
            available: true
        },
        [Item.CLAY_FIGURE]: {
            price: 3000,
            available: true
        },
        [Item.YIJIN_JING]: {
            price: 3000,
            available: true
        },
        [Item.ANGRY]: {
            price: 2500,
            available: true
        },
        [Item.MP5]: {
            price: 3500,
            available: true
        }
    },
    2: { // 二楼
        [Item.ICE_TEA]: {
            price: 500,
            available: true
        },
        [Item.CHA_CUI]: {
            price: 500,
            available: true
        }
    },
    3: { // 三楼
        [Item.ICE_TEA]: {
            price: 500,
            available: true
        },
        [Item.CHA_CUI]: {
            price: 500,
            available: true
        },
        [Item.MP7]: {
            price: 9000,
            available: true
        }
    }
};

// ============================================================================
// 随机事件系统
// ============================================================================

const RandomEventType = {
    CONFIRM: 'confirm',  // 确认事件（只有一个确认按钮）
    CHOICE: 'choice'     // 选择事件（有多个选项按钮）
};

// 随机事件数据
const RANDOM_EVENTS = [
    // 带选项的事件
    {
        id: 1,
        type: RandomEventType.CHOICE,
        template: '{student}跑路去机房打游戏',
        options: [
            {
                text: '严厉惩罚',
                effect: 'energy:-10, enthusiasm:-5, learnCap:-2'
            },
            {
                text: '耐心劝导',
                effect: 'energy:-5, enthusiasm:+5, learnCap:+1'
            },
            {
                text: '关我吊事',
                effect: 'energy:+2'
            }
        ]
    },
    {
        id: 2,
        type: RandomEventType.CHOICE,
        template: '{student}带手机被发现',
        options: [
            {
                text: '没收手机',
                effect: 'energy:-5, enthusiasm:-3, learnCap:+1'
            },
            {
                text: '批评教育',
                effect: 'energy:-3, enthusiasm:-1'
            },
            {
                text: '睁一只眼闭一只眼',
                effect: 'enthusiasm:+2, energy:-2'
            }
        ]
    },
    {
        id: 3,
        type: RandomEventType.CHOICE,
        template: '{student}偷偷吃屎而不给大家分享！！',
        options: [
            {
                text: '勒令其与全班分享',
                effect: 'enthusiasm:+5, learnCap:+2'
            },
            {
                text: '关我吊事',
                effect: 'energy:+3'
            }
        ]
    },
    {
        id: 4,
        type: RandomEventType.CHOICE,
        template: '{student}晚上开卧谈会，聊到了3点',
        options: [
            {
                text: '严厉批评',
                effect: 'energy:-5, enthusiasm:-3'
            },
            {
                text: '提醒注意休息',
                effect: 'energy:+2, enthusiasm:+3'
            },
            {
                text: '不管',
                effect: 'energy:-3, enthusiasm:-2'
            }
        ]
    },
    {
        id: 5,
        type: RandomEventType.CHOICE,
        template: '{student}上{subject1}课写{subject2}作业',
        options: [
            {
                text: '这是个好事啊',
                effect: 'enthusiasm:+5, learnCap:+3'
            },
            {
                text: '大胆?!',
                effect: 'energy:-3, enthusiasm:-2, learnCap:+1'
            }
        ]
    },
    {
        id: 6,
        type: RandomEventType.CHOICE,
        template: '{subject}老师试图侵占体育课',
        options: [
            {
                text: '坚决阻止',
                effect: 'enthusiasm:+5, energy:-3'
            },
            {
                text: '这是个好事啊',
                effect: 'learnCap:+3, enthusiasm:-3'
            }
        ]
    },
    {
        id: 7,
        type: RandomEventType.CHOICE,
        template: '{student}使用三根笔祭奠你的浮木！！',
        options: [
            {
                text: '大胆?!',
                effect: 'energy:-3, enthusiasm:-5'
            },
            {
                text: '善',
                effect: 'energy:+3, enthusiasm:+5, learnCap:+1'
            }
        ]
    },
    {
        id: 8,
        type: RandomEventType.CHOICE,
        template: '{student}在希沃上通关了魔女的夜宴',
        options: [
            {
                text: '这辈子也就这样了',
                effect: 'energy:-3, enthusiasm:-5'
            },
            {
                text: '能度过一个相对成功的人生',
                effect: 'energy:+3, enthusiasm:+5'
            }
        ]
    },
    {
        id: 9,
        type: RandomEventType.CHOICE,
        template: '{student}在小说里把你写死了',
        options: [
            {
                text: '善',
                effect: 'energy:+2, enthusiasm:+3, learnCap:+1'
            },
            {
                text: '大胆?!',
                effect: 'energy:-5, enthusiasm:-3'
            }
        ]
    },
    {
        id: 10,
        type: RandomEventType.CHOICE,
        template: '{student}在希沃上打开cmd运行了tree，惊呆了所有人！！',
        options: [
            {
                text: '嘉豪一个',
                effect: 'energy:+2, enthusiasm:+3'
            },
            {
                text: '加以鼓励',
                effect: 'energy:+3, enthusiasm:+5, learnCap:+2'
            }
        ]
    },
    {
        id: 11,
        type: RandomEventType.CHOICE,
        template: '{student}携带mp3进班',
        options: [
            {
                text: '没收',
                effect: 'energy:-3, enthusiasm:-2'
            },
            {
                text: '警告',
                effect: 'energy:-1'
            }
        ]
    },
    {
        id: 12,
        type: RandomEventType.CHOICE,
        template: '{student}携带mp4进班',
        options: [
            {
                text: '没收',
                effect: 'energy:-5, enthusiasm:-3'
            },
            {
                text: '警告',
                effect: 'energy:-2'
            }
        ]
    },
    {
        id: 13,
        type: RandomEventType.CHOICE,
        template: '{student}携带mp5进班',
        options: [
            {
                text: '没收并上报',
                effect: 'teacher:kill'
            },
            {
                text: '没收',
                effect: 'teacher:hurt:-5, enthusiasm:-3'
            }
        ]
    },
    {
        id: 14,
        type: RandomEventType.CHOICE,
        template: '{student}在班里吃螺蛳粉',
        options: [
            {
                text: '严厉禁止',
                effect: 'energy:-3, enthusiasm:-2'
            },
            {
                text: '不管',
                effect: 'energy:+2, enthusiasm:+1'
            }
        ]
    },
    {
        id: 15,
        type: RandomEventType.CHOICE,
        template: '{student}把{target}鞋带在桌腿上系死结',
        options: [
            {
                text: '批评教育',
                effect: 'energy:-3, enthusiasm:-2'
            },
            {
                text: '调解',
                effect: 'energy:+2, enthusiasm:+3'
            }
        ]
    },
    
    // 确认事件
    {
        id: 101,
        type: RandomEventType.CONFIRM,
        template: '隔壁厕所爆炸了，班里香气四溢！！',
        buttonText: '大吃一斤',
        effect: 'energy:+5'
    },
    {
        id: 102,
        type: RandomEventType.CONFIRM,
        template: '{student}公然在班里散播反党反国言论！！',
        buttonText: '严肃处理',
        effect: 'energy:-5, student:kill'
    },
    {
        id: 103,
        type: RandomEventType.CONFIRM,
        template: '学生目击了流浪猫交配！！',
        buttonText: '这很正常',
        effect: 'energy:+3, enthusiasm:+2'
    },
    {
        id: 104,
        type: RandomEventType.CONFIRM,
        template: '{student}被发现在地上爬行',
        buttonText: '...',
        effect: 'energy:-2'
    },
    {
        id: 105,
        type: RandomEventType.CONFIRM,
        template: '你被制作成了游戏!',
        buttonText: '玩',
        effect: 'energy:+5, enthusiasm:+3'
    },
    {
        id: 106,
        type: RandomEventType.CONFIRM,
        template: '你的语录被整理起来发到了网上',
        buttonText: '查看',
        effect: 'enthusiasm:+5, energy:+2'
    },
    {
        id: 107,
        type: RandomEventType.CONFIRM,
        template: '{student}买茶粹连中{count}次一元乐享',
        buttonText: '荒谬',
        effect: 'energy:+5, enthusiasm:+5'
    },
    {
        id: 108,
        type: RandomEventType.CONFIRM,
        template: '雷霆乍惊, {student}刚刚放了个屁也',
        buttonText: '...',
        effect: 'energy:-1'
    },
    {
        id: 109,
        type: RandomEventType.CONFIRM,
        template: '希沃上的potplayer关不掉了!',
        buttonText: '重启',
        effect: 'energy:-2'
    },
    {
        id: 110,
        type: RandomEventType.CONFIRM,
        template: '天花板掉下来把{student}砸死了!!',
        buttonText: '...',
        effect: 'student:kill'
    }
];

// 高考配置
const GAOKAO_TOTAL_SCORE = 750;
const GAOKAO_SCORE_RANDOM_RANGE = 30;
const GAOKAO_UNIVERSITY_ASSIGN_RANDOM = 20;

// ============================================================================
// 枚举类型定义
// ============================================================================

const ContestType = {
    Mid: 1,
    End: 2,
    Final: 3
};

const GameMode = {
    Hard: 40,
    Normal: 60,
    Easy: 80
};

const Character = {
    WEI: 'wei',
    WANG: 'wang',
    QIN: 'qin'
};

const ClassType = {
    Science: 1,
    Art: 2
};

const Subject = {
    Chinese: 1,
    Maths: 2,
    English: 3,
    Physics: 4,
    Chemistry: 5,
    Biology: 6,
    Politics: 7,
    History: 8,
    Geography: 9
};

const CharacterData = {
  [Character.WEI]: {
    name: '魏教授',
    subject: Subject.Physics,
    trait: '半步年级长',
    monthlySalary: 1500,
    maxEnergy: 100,
    recoverEnergy: 100,
    noSalaryPenalty: true,
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
        reviveChance: 0.35
    }
};

const Gender = {
    Boy: "male",
    Girl: "female"
};

const Status = {
    Normal: 1,
    Leave: 2,
    Train: 3,
    Dead: 4
};

const Relations = {
    Normal: 1,
    Better: 2,
    Friend: 3,
    Loving: 4,
    Disliking: 5,
    Hating: 6,
    Self: 7
};

const UniversityTier = {
    TIER_985: "985 工程",
    TIER_211: "211 工程",
    TIER_DOUBLE_FIRST: "双一流",
    TIER_TIER1: "一本",
    TIER_TIER2: "二本",
    TIER_TIER3: "三本/专科"
};

const ClassMeetingType = {
    CHICKEN_SOUP: "鸡汤班会",
    THREAT: "恐吓班会",
    AWARD: "表彰班会",
    FREE: "自由班会",
    COMPLAINT: "吐槽大会",
    SURPRISE: "惊喜班会"
};

const ActivityType = {};

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 检测是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
function isMobileDevice() {
    // 方法1: User-Agent 检测
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileKeywords = [
        'Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry',
        'Windows Phone', 'webOS', 'Opera Mini', 'IEMobile',
        'Mobile', 'Tablet'
    ];
    
    const isMobileUA = mobileKeywords.some(keyword => 
        userAgent.indexOf(keyword) > -1
    );
    
    // 方法2: 触摸能力检测
    const hasTouch = 'ontouchstart' in window || 
                     navigator.maxTouchPoints > 0 || 
                     navigator.msMaxTouchPoints > 0;
    
    // 方法3: 屏幕比例检测（移动设备通常更窄）
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const aspectRatio = Math.min(screenWidth, screenHeight) / Math.max(screenWidth, screenHeight);
    
    // 移动设备通常比例小于0.7（竖屏时）
    const isMobileRatio = aspectRatio < 0.7;
    
    // 方法4: 结合窗口大小和设备像素比
    const devicePixelRatio = window.devicePixelRatio || 1;
    const logicalWidth = window.innerWidth;
    
    // 现代移动设备通常有高DPI（2x-3x）
    const isHighDPI = devicePixelRatio >= 2;
    
    // 综合判断：
    // - 如果有明确的移动设备User-Agent，优先判断为移动设备
    // - 如果支持触摸且有典型的移动设备比例，判断为移动设备
    // - 如果逻辑宽度较小且支持触摸，判断为移动设备
    
    if (isMobileUA) {
        return true;
    }
    
    if (hasTouch && isMobileRatio) {
        return true;
    }
    
    if (hasTouch && logicalWidth <= 768 && isHighDPI) {
        return true;
    }
    
    return false;
}

/**
 * 强制横屏显示（移动端）
 */
function forceLandscape() {
    if (!isMobileDevice()) return;
    
    // 检测是否为竖屏
    if (window.innerHeight > window.innerWidth) {
        // 显示横屏提示
        const landscapeHint = document.getElementById('landscape-hint');
        if (!landscapeHint) {
            const hint = document.createElement('div');
            hint.id = 'landscape-hint';
            hint.innerHTML = `
                <div class="landscape-hint-content">
                    <div class="rotate-icon">📱</div>
                    <p>请旋转设备至横屏</p>
                    <p>For better experience, please rotate your device</p>
                </div>
            `;
            document.body.appendChild(hint);
        }
        document.getElementById('landscape-hint').style.display = 'flex';
    } else {
        const landscapeHint = document.getElementById('landscape-hint');
        if (landscapeHint) {
            landscapeHint.style.display = 'none';
        }
    }
}

function isThisImpossible(n) {
    return Math.floor(Math.random() * n) + 1 === 1;
}

function randomGauss(mid, d, lft, rt, maxAttempts = 1000) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const res = Math.round(mid + z0 * d);

    if (lft <= res && res <= rt) {
        return res;
    }

    return Math.floor(Math.random() * (rt - lft + 1)) + lft;
}

function randomCap(gameMode) {
    const mid = gameMode.value;
    if (gameMode === GameMode.Easy) {
        return randomGauss(90, 8, 75, 100);  // 简单模式积极性最高
    } else if (gameMode === GameMode.Normal) {
        return randomGauss(65, 10, 45, 85);  // 普通模式积极性中等
    } else {
        return randomGauss(45, 10, 25, 65);  // 困难模式积极性最低
    }
}

// ============================================================================
// 姓名预设系统
// ============================================================================

// NamePreset类 - 姓名预设
class NamePreset {
    constructor(id, name, description, boyNames = [], girlNames = [], isRandomOnly = false) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.boyNames = boyNames;
        this.girlNames = girlNames;
        this.isRandomOnly = isRandomOnly;
    }
}

// 内置预设：纯随机
const RANDOM_PRESET = new NamePreset(
    'random',
    '🎲 纯随机生成',
    '所有姓名使用随机生成器生成，不保存固定姓名',
    [],
    [],
    true
);

// 内置预设：默认姓名库
const DEFAULT_PRESET = new NamePreset(
    'default',
    '📚 默认姓名库',
    '游戏内置的精选姓名集合',
    [
        "张子恒", "李嘉祥", "张宸玮", "王志鑫", "郭家庆", "娄嘉耕", "徐墨林", "王荣浚",
        "孟文宣", "杨思博", "宋伟豪", "张晨旭", "王英浩", "陈宇鑫", "孟祺烜",
        "王凯博", "卫宇轩", "陈东鹏", "马圣骅", "仝子轩", "段轶燃", "李林鑫",
        "朱为", "王梦成", "陈皓轩", "连峰逵", "马政泽", "吕睿臣",
        "张峻彬", "郇东洋", "陈柏霖", "智若镜", "莫思宇"
    ],
    [
        "于尚熙", "李丽亚", "卢祺欣", "张语嫣", "张雅琪", "李沐霏",
        "黄婧雅", "张熙雯", "左晨希", "胡芳瑜", "乔一甜", "王家琪", "张馨艺", "曹梓菲",
        "伊若萱", "赖奕璇", "郭果", "宋若溪", "董紫涵", "凌皙悦", "郑雨荷", "雷玉清",
        "顾梦烜", "冯家琦", "张昀晞", "贾洪叶", "王雅儒"
    ],
    false
);

// 内置预设：化名预设
const ALIAS_PRESET = new NamePreset(
    'alias',
    '🎭 化名预设',
    '修改后的姓名集合',
    [
        "张父恒", "李减祥", "张宸经", "王春鑫", "郭国庆", "娄减耕", "徐墨森", "王凝浚",
        "孟武宣", "杨五博", "宋伟坏", "张晚旭", "王美浩", "陈宇旧", "孟书烜",
        "王关博", "卫宇轩", "陈西鹏", "羊圣骅", "仝父轩", "段轶灭", "桃林鑫",
        "狗为", "王醒成", "陈坏轩", "连谷逵", "牛政泽", "品睿臣",
        "张峻火", "郇西洋", "陈千霖", "若智镜", "要思宇"
    ],
    [
        "于下熙", "李丽欧", "卢祺旧", "张数嫣", "张雅琴", "李金霏",
        "蓝婧雅", "张东雯", "右晨希", "胡芳云", "乔二甜", "王国琪", "张馨二", "曹父菲",
        "二若萱", "赖二璇", "郭因", "宋若东", "董红涵", "一皙悦", "郑云荷", "雷玉氦",
        "顾醒烜", "马家琦", "张雨晞", "贾黄叶", "王雅道"
    ],
    false
);

// 姓氏池（250个：200单姓 + 50复姓）
const SURNAMES = [
    // 常见大姓（前50）
    "王", "李", "张", "刘", "陈", "杨", "黄", "赵", "吴", "周",
    "徐", "孙", "马", "朱", "胡", "郭", "何", "林", "高", "罗",
    "郑", "梁", "谢", "宋", "唐", "许", "韩", "冯", "邓", "曹",
    "彭", "曾", "萧", "田", "董", "袁", "潘", "于", "蒋", "蔡",
    "余", "杜", "叶", "程", "苏", "魏", "吕", "丁", "任", "沈",
    // 次常见姓氏（51-100）
    "姚", "卢", "姜", "崔", "钟", "谭", "汪", "范", "金", "石",
    "廖", "贾", "夏", "韦", "付", "方", "白", "邹", "孟", "熊",
    "秦", "邱", "江", "尹", "薛", "闫", "段", "雷", "侯", "龙",
    "史", "陶", "黎", "贺", "顾", "毛", "邵", "万", "钱", "严",
    "赖", "覃", "洪", "武", "莫", "孔", "汤", "向", "常", "温",
    // 较少见但好听的姓氏（101-150）
    "康", "文", "施", "牛", "樊", "葛", "邢", "安", "颜", "庄",
    "章", "鲁", "倪", "庞", "俞", "任", "柳", "鲍", "盛", "柯",
    "阮", "岳", "高", "娄", "祝", "梁", "穆", "姜", "邱", "江",
    "童", "白", "项", "邱", "梅", "莫", "庄", "辛", "管", "祝",
    "左", "涂", "谷", "祁", "时", "舒", "耿", "牟", "路", "简",
    // 稀有但好听的姓氏（151-200）
    "权", "练", "盖", "逄", "后", "有", "琴", "商", "牟", "佘",
    "佴", "伯", "赏", "墨", "哈", "谯", "笪", "年", "爱", "阳",
    "佟", "商", "牟", "佘", "佴", "伯", "赏", "墨", "哈", "谯",
    "笪", "年", "爱", "阳", "佟", "第五", "言", "福", "百", "姓",
    "归", "海", "帅", "同", "仇", "宿", "农", "宝", "官", "国",
    // 复姓（201-250）
    "欧阳", "太史", "端木", "上官", "司马", "东方", "独孤", "南宫", "万俟", "闻人",
    "夏侯", "诸葛", "尉迟", "公羊", "赫连", "澹台", "皇甫", "宗政", "濮阳", "公淳",
    "单于", "太叔", "申屠", "公孙", "仲孙", "轩辕", "令狐", "钟离", "宇文", "长孙",
    "慕容", "鲜于", "闾丘", "司徒", "司空", "亓官", "司寇", "子车", "颛孙", "端木",
    "巫马", "公西", "漆雕", "乐正", "壤驷", "公良", "拓跋", "夹谷", "宰父", "谷梁"
];

// 男生单字名（100个）
const BOY_GIVEN_NAMES_SINGLE = [
    // 传统常用字
    "伟", "强", "磊", "洋", "勇", "军", "杰", "涛", "超", "明",
    "刚", "平", "辉", "鹏", "华", "飞", "鑫", "波", "斌", "宇",
    "浩", "凯", "健", "俊", "晨", "旭", "林", "帆", "宇", "浩",
    // 现代流行字
    "轩", "睿", "泽", "辰", "博", "文", "昊", "然", "嘉", "毅",
    "峻", "熙", "铭", "朗", "霖", "皓", "宇", "恒", "毅", "睿",
    "辰", "博", "文", "昊", "然", "嘉", "毅", "峻", "熙", "铭",
    // 文雅字
    "谦", "逊", "恭", "敬", "诚", "信", "忠", "孝", "仁", "义",
    "礼", "智", "勇", "德", "贤", "良", "正", "直", "廉", "洁",
    "清", "白", "明", "达", "通", "晓", "知", "识", "学", "问",
    // 气势字
    "龙", "虎", "豹", "彪", "威", "武", "勇", "猛", "刚", "强",
    "毅", "坚", "韧", "恒", "毅", "志", "远", "大", "宏", "伟",
    "博", "远", "高", "深", "广", "阔", "宽", "厚", "重", "稳",
    // 自然字
    "山", "川", "河", "海", "湖", "江", "溪", "泉", "源", "流",
    "云", "风", "雨", "雪", "霜", "露", "雾", "霞", "虹", "霓",
    "日", "月", "星", "辰", "光", "辉", "明", "亮", "照", "耀",
    // 植物字
    "松", "柏", "竹", "梅", "兰", "菊", "莲", "荷", "桂", "槐",
    "柳", "杨", "桃", "李", "杏", "梨", "枣", "栗", "楠", "樟",
    // 其他好字
    "安", "宁", "平", "和", "顺", "康", "健", "乐", "欢", "喜",
    "福", "禄", "寿", "喜", "财", "富", "贵", "荣", "华", "昌",
    "盛", "兴", "旺", "发", "达", "成", "功", "立", "业", "建"
];

// 男生双字名（150个）
const BOY_GIVEN_NAMES_DOUBLE = [
    // 传统组合
    "子豪", "俊杰", "博文", "天宇", "浩宇", "子轩", "梓豪", "俊杰", "博文", "天宇",
    "志强", "建国", "建华", "建军", "建平", "建伟", "建明", "建文", "建武", "建国",
    "文博", "文杰", "文强", "文涛", "文超", "文辉", "文鹏", "文华", "文飞", "文鑫",
    // 现代流行组合
    "浩然", "博文", "宇轩", "子轩", "浩宇", "博文", "宇轩", "子轩", "浩宇", "博文",
    "睿泽", "辰博", "昊然", "嘉毅", "峻熙", "铭朗", "霖皓", "宇恒", "毅睿", "辰博",
    "昊然", "嘉毅", "峻熙", "铭朗", "霖皓", "宇恒", "毅睿", "辰博", "昊然", "嘉毅",
    // 文雅组合
    "谦逊", "恭敬", "诚信", "忠孝", "仁义", "礼智", "勇德", "贤良", "正直", "廉洁",
    "清明", "白达", "通晓", "知识", "学问", "博远", "高深", "广阔", "宽阔", "厚重",
    "稳重", "安和", "康健", "欢乐", "福禄", "寿喜", "富贵", "荣华", "昌盛", "兴旺",
    // 气势组合
    "龙虎", "豹彪", "威武", "勇猛", "刚强", "坚韧", "恒毅", "志远", "大宏", "伟博",
    "远高", "深广", "阔宽", "厚稳", "重安", "宁平", "和顺", "康健", "乐欢", "喜福",
    // 自然组合
    "山河", "川海", "江湖", "溪泉", "源流", "云风", "雨雪", "霜露", "雾霞", "虹霓",
    "日月", "星辰", "光辉", "明亮", "照耀", "松柏", "竹梅", "兰菊", "莲荷", "桂槐",
    // 现代感组合
    "梓轩", "子涵", "浩然", "博文", "宇轩", "子轩", "浩宇", "博文", "宇轩", "子轩",
    "睿泽", "辰博", "昊然", "嘉毅", "峻熙", "铭朗", "霖皓", "宇恒", "毅睿", "辰博",
    "昊然", "嘉毅", "峻熙", "铭朗", "霖皓", "宇恒", "毅睿", "辰博", "昊然", "嘉毅",
    // 其他好组合
    "安邦", "定国", "平天下", "和为贵", "康庄", "健步", "乐天", "欢欣", "福泽", "禄位",
    "寿山", "喜乐", "财源", "富贵", "荣光", "华章", "昌明", "盛世", "兴旺", "发达",
    "成功", "立业", "建功", "立业", "建树", "成就", "功勋", "伟业", "宏图", "大志"
];

// 女生单字名（100个）
const GIRL_GIVEN_NAMES_SINGLE = [
    // 传统常用字
    "静", "婷", "燕", "芳", "娜", "敏", "霞", "丽", "娟", "娟",
    "萍", "红", "梅", "玲", "琳", "霞", "燕", "芳", "婷", "娜",
    "雪", "慧", "雯", "颖", "悦", "瑶", "琪", "欣", "怡", "雅",
    // 现代流行字
    "萱", "涵", "诺", "怡", "欣", "悦", "雅", "琪", "瑶", "颖",
    "雯", "慧", "雪", "婷", "静", "琳", "玲", "梅", "萍", "芳",
    "娜", "敏", "霞", "燕", "娟", "红", "丽", "怡", "欣", "悦",
    // 文雅字
    "婉", "娴", "淑", "贤", "良", "德", "慧", "智", "才", "艺",
    "文", "诗", "书", "画", "琴", "棋", "乐", "舞", "歌", "曲",
    "花", "草", "树", "木", "林", "森", "竹", "兰", "菊", "梅",
    // 美丽字
    "美", "丽", "艳", "娇", "媚", "妍", "姣", "姝", "娉", "婷",
    "婵", "娟", "娥", "姬", "妃", "嫔", "媛", "嫣", "姹", "嫣",
    "姣", "姝", "娉", "婷", "婵", "娟", "娥", "姬", "妃", "嫔",
    // 自然字
    "云", "雨", "雪", "霜", "露", "雾", "霞", "虹", "霓", "月",
    "星", "辰", "光", "辉", "明", "亮", "照", "耀", "日", "阳",
    "春", "夏", "秋", "冬", "花", "草", "树", "木", "林", "森",
    // 温柔字
    "柔", "和", "顺", "温", "暖", "慈", "善", "爱", "仁", "义",
    "礼", "智", "信", "忠", "孝", "廉", "洁", "清", "白", "明",
    // 其他好字
    "安", "宁", "平", "和", "顺", "康", "健", "乐", "欢", "喜",
    "福", "禄", "寿", "喜", "财", "富", "贵", "荣", "华", "昌"
];

// 女生双字名（150个）
const GIRL_GIVEN_NAMES_DOUBLE = [
    // 传统组合
    "雨婷", "欣怡", "子涵", "雨萱", "佳琪", "诗涵", "欣怡", "子涵", "雨萱", "佳琪",
    "思雨", "思琪", "思涵", "思萱", "思怡", "思婷", "思敏", "思慧", "思颖", "思悦",
    "雨欣", "雨琪", "雨涵", "雨萱", "雨怡", "雨婷", "雨敏", "雨慧", "雨颖", "雨悦",
    // 现代流行组合
    "梓萱", "子涵", "雨萱", "欣怡", "佳琪", "诗涵", "雨婷", "思雨", "思琪", "思涵",
    "思萱", "思怡", "思婷", "思敏", "思慧", "思颖", "思悦", "雨欣", "雨琪", "雨涵",
    "雨萱", "雨怡", "雨婷", "雨敏", "雨慧", "雨颖", "雨悦", "梓萱", "子涵", "雨萱",
    // 文雅组合
    "婉娴", "淑贤", "良德", "慧智", "才艺", "文诗", "书画", "琴棋", "乐舞", "歌曲",
    "花草", "树木", "林木", "森竹", "兰菊", "梅花", "萍芳", "娜敏", "霞燕", "娟红",
    "丽怡", "欣悦", "雅琪", "瑶颖", "雯慧", "雪婷", "静琳", "玲梅", "芳娜", "敏霞",
    // 美丽组合
    "美丽", "艳娇", "媚妍", "姣姝", "娉婷", "婵娟", "娥姬", "妃嫔", "媛嫣", "姹嫣",
    "姣姝", "娉婷", "婵娟", "娥姬", "妃嫔", "媛嫣", "姹嫣", "姣姝", "娉婷", "婵娟",
    // 自然组合
    "云雨", "雪霜", "露雾", "霞虹", "霓月", "星辰", "光辉", "明亮", "照耀", "日阳",
    "春夏", "秋冬", "花草", "树木", "林木", "森竹", "兰菊", "梅花", "萍芳", "娜敏",
    // 温柔组合
    "柔和", "顺温", "暖慈", "善爱", "仁义", "礼智", "信忠", "孝廉", "洁清", "白明",
    "安宁", "平和", "顺康", "健乐", "欢喜", "福禄", "寿喜", "财富", "贵荣", "华昌",
    // 现代感组合
    "梓萱", "子涵", "雨萱", "欣怡", "佳琪", "诗涵", "雨婷", "思雨", "思琪", "思涵",
    "思萱", "思怡", "思婷", "思敏", "思慧", "思颖", "思悦", "雨欣", "雨琪", "雨涵",
    "雨萱", "雨怡", "雨婷", "雨敏", "雨慧", "雨颖", "雨悦", "梓萱", "子涵", "雨萱",
    // 其他好组合
    "安邦", "定国", "平天下", "和为贵", "康庄", "健步", "乐天", "欢欣", "福泽", "禄位",
    "寿山", "喜乐", "财源", "富贵", "荣光", "华章", "昌明", "盛世", "兴旺", "发达",
    "成功", "立业", "建功", "立业", "建树", "成就", "功勋", "伟业", "宏图", "大志"
];

// 姓名系统全局变量
let namePresets = [];              // 所有预设数组
let currentNamePreset = null;      // 当前选中的预设
let usedNames = new Set();         // 已使用的姓名（避免重复）

// ============================================================================
// 姓名生成（旧版，保留兼容性）
// ============================================================================

// 自定义男生名字池（旧版，保留兼容性）
let customBoyNamesPool = [
    "张子恒", "李嘉祥", "张宸玮", "王志鑫", "郭家庆", "娄嘉耕", "徐墨林", "王荣浚",
    "孟文宣", "杨思博", "宋伟豪", "张晨旭", "王英浩", "陈宇鑫", "孟祺烜",
    "王凯博", "卫宇轩", "陈东鹏", "马圣骅", "王雅儒", "仝子轩", "段轶燃", "李林鑫",
    "朱为", "王梦成", "陈皓轩", "连峰逵", "马政泽", "吕睿臣",
    "张峻彬", "郇东洋", "陈柏霖", "智若镜", "莫思宇"
];

// 自定义女生名字池（旧版，保留兼容性）
let customGirlNamesPool = [
    "于尚熙", "李丽亚", "卢祺欣", "张语嫣", "张雅琪", "李沐霏",
    "黄婧雅", "张熙雯", "左晨希", "胡芳瑜", "乔一甜", "王家琪", "张馨艺", "曹梓菲",
    "伊若萱", "赖奕璇", "郭果", "宋若溪", "董紫涵", "凌皙悦", "郑雨荷", "雷玉清",
    "顾梦烜", "冯家琦", "张昀晞", "贾洪叶"
];

let boyNamesPool = [
    "伟", "强", "磊", "洋", "勇", "军", "杰", "涛", "超", "明",
    "刚", "平", "辉", "鹏", "华", "飞", "鑫", "波", "斌", "宇",
    "浩", "凯", "健", "俊", "晨", "旭", "林", "帆", "宇", "浩",
    "子豪", "俊杰", "博文", "天宇", "浩宇", "子轩", "梓豪", "俊杰", "博文", "天宇"
];

let girlNamesPool = [
    "静", "婷", "燕", "芳", "娜", "敏", "霞", "丽", "娟", "娟",
    "萍", "红", "梅", "玲", "琳", "霞", "燕", "芳", "婷", "娜",
    "雪", "慧", "雯", "颖", "悦", "瑶", "琪", "欣", "怡", "雅",
    "雨婷", "欣怡", "子涵", "雨萱", "佳琪", "诗涵", "欣怡", "子涵", "雨萱", "佳琪"
];

let boySurnamesPool = [
    "王", "李", "张", "刘", "陈", "杨", "赵", "黄", "周", "吴",
    "徐", "孙", "胡", "朱", "高", "林", "何", "郭", "马", "罗",
    "梁", "宋", "郑", "谢", "韩", "唐", "冯", "于", "董", "萧",
    "程", "曹", "袁", "邓", "许", "傅", "沈", "曾", "彭", "吕"
];

let girlSurnamesPool = [
    "李", "王", "张", "刘", "陈", "杨", "赵", "黄", "周", "吴",
    "徐", "孙", "胡", "朱", "高", "林", "何", "郭", "马", "罗",
    "梁", "宋", "郑", "谢", "韩", "唐", "冯", "于", "董", "萧",
    "程", "曹", "袁", "邓", "许", "傅", "沈", "曾", "彭", "吕"
];

// ============================================================================
// 姓名预设系统核心函数
// ============================================================================

// 初始化预设系统
function initializeNamePresets() {
    console.log('initializeNamePresets - 开始初始化');
    console.log('ALIAS_PRESET:', ALIAS_PRESET);
    
    // 强制清除localStorage中的所有预设数据
    localStorage.removeItem('customNamePresets');
    console.log('已强制清除localStorage中的所有预设数据');
    
    // 从localStorage加载自定义预设
    const customPresets = loadCustomPresetsFromStorage();
    console.log('加载的自定义预设:', customPresets);
    
    // 初始化预设数组
    namePresets = [RANDOM_PRESET, DEFAULT_PRESET, ALIAS_PRESET, ...customPresets];
    console.log('初始化后的namePresets:', namePresets.map(p => ({id: p.id, name: p.name})));
    
    // 默认选择默认预设
    currentNamePreset = DEFAULT_PRESET;
    console.log('当前预设:', currentNamePreset);
}

// 从localStorage加载自定义预设
function loadCustomPresetsFromStorage() {
    const stored = localStorage.getItem('customNamePresets');
    if (!stored) return [];
    
    try {
        const data = JSON.parse(stored);
        // 过滤掉内置预设，只保留自定义预设
        return data.filter(preset => 
            preset.id !== 'random' && 
            preset.id !== 'default' && 
            preset.id !== 'alias'
        ).map(preset => new NamePreset(
            preset.id,
            preset.name,
            preset.description,
            preset.boyNames,
            preset.girlNames,
            preset.isRandomOnly
        ));
    } catch (e) {
        console.error('加载自定义预设失败:', e);
        return [];
    }
}

// 保存自定义预设到localStorage
function saveCustomPresetsToStorage() {
    const customPresets = namePresets.filter(p => 
        p.id !== 'random' && p.id !== 'default' && p.id !== 'alias'
    );
    localStorage.setItem('customNamePresets', JSON.stringify(customPresets));
}

// 加载指定预设
function loadNamePreset(presetId) {
    const preset = namePresets.find(p => p.id === presetId);
    if (preset) {
        currentNamePreset = preset;
        usedNames.clear(); // 清空已使用姓名
    }
}

// 导入自定义预设
function importCustomPreset(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // 验证格式
                if (!data.name || !Array.isArray(data.boyNames) || !Array.isArray(data.girlNames)) {
                    reject(new Error('预设格式不正确'));
                    return;
                }
                
                // 生成唯一ID
                const id = 'custom_' + Date.now();
                
                // 创建新预设
                const newPreset = new NamePreset(
                    id,
                    data.name,
                    data.description || '用户自定义预设',
                    data.boyNames,
                    data.girlNames,
                    data.isRandomOnly || false
                );
                
                // 添加到预设列表
                namePresets.push(newPreset);
                
                // 保存到localStorage
                saveCustomPresetsToStorage();
                
                resolve(newPreset);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsText(file);
    });
}

// 生成随机姓名
function generateRandomName(gender) {
    // 1. 选择姓氏（80%单姓，20%复姓）
    const useCompoundSurname = Math.random() < 0.2;
    let surname;
    
    if (useCompoundSurname) {
        // 复姓（从最后50个中选择）
        const compoundSurnames = SURNAMES.slice(-50);
        surname = compoundSurnames[Math.floor(Math.random() * compoundSurnames.length)];
    } else {
        // 单姓（从前200个中选择）
        const singleSurnames = SURNAMES.slice(0, 200);
        surname = singleSurnames[Math.floor(Math.random() * singleSurnames.length)];
    }
    
    // 2. 选择名字长度（60%单字，40%双字）
    const useDoubleName = Math.random() < 0.4;
    
    let givenName;
    if (gender === Gender.Boy) {
        const pool = useDoubleName ? BOY_GIVEN_NAMES_DOUBLE : BOY_GIVEN_NAMES_SINGLE;
        givenName = pool[Math.floor(Math.random() * pool.length)];
    } else {
        const pool = useDoubleName ? GIRL_GIVEN_NAMES_DOUBLE : GIRL_GIVEN_NAMES_SINGLE;
        givenName = pool[Math.floor(Math.random() * pool.length)];
    }
    
    return surname + givenName;
}

// 生成唯一姓名（改进版）
function generateUniqueName(gender) {
    // 如果预设系统未初始化，使用旧版逻辑
    if (!currentNamePreset) {
        return generateUniqueNameOld(gender);
    }
    
    let maxAttempts = 100; // 最多尝试100次
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        let name;
        
        // 1. 如果是纯随机模式，直接使用随机生成器
        if (currentNamePreset.isRandomOnly) {
            name = generateRandomName(gender);
        } else {
            // 2. 从预设中选择
            const namePool = gender === Gender.Boy ? 
                currentNamePreset.boyNames : currentNamePreset.girlNames;
            
            // 3. 过滤已使用的姓名
            const availableNames = namePool.filter(name => !usedNames.has(name));
            
            // 4. 如果有可用姓名，随机选择
            if (availableNames.length > 0) {
                name = availableNames[Math.floor(Math.random() * availableNames.length)];
            } else {
                // 5. 如果预设用完，使用随机生成器
                name = generateRandomName(gender);
            }
        }
        
        // 6. 检查是否已使用
        if (!usedNames.has(name)) {
            usedNames.add(name);
            return name;
        }
        
        attempts++;
    }
    
    // 如果100次都重复，强制生成一个（虽然可能重复）
    return generateRandomName(gender);
}

// 旧版姓名生成函数（保留兼容性）
function generateUniqueNameOld(gender) {
    // 优先从自定义名字池中选择不重复的名字
    if (gender === Gender.Boy) {
        if (customBoyNamesPool.length > 0) {
            const randomIndex = Math.floor(Math.random() * customBoyNamesPool.length);
            const name = customBoyNamesPool.splice(randomIndex, 1)[0];
            return name;
        }
        // 如果自定义名字池用完了，使用原来的生成方式
        const surname = boySurnamesPool[Math.floor(Math.random() * boySurnamesPool.length)];
        const givenName = boyNamesPool[Math.floor(Math.random() * boyNamesPool.length)];
        return surname + givenName;
    } else {
        if (customGirlNamesPool.length > 0) {
            const randomIndex = Math.floor(Math.random() * customGirlNamesPool.length);
            const name = customGirlNamesPool.splice(randomIndex, 1)[0];
            return name;
        }
        // 如果自定义名字池用完了，使用原来的生成方式
        const surname = girlSurnamesPool[Math.floor(Math.random() * girlSurnamesPool.length)];
        const givenName = girlNamesPool[Math.floor(Math.random() * girlNamesPool.length)];
        return surname + givenName;
    }
}

// 重置名字池（改进版）
function resetNamePool() {
    usedNames.clear();
    // 不再需要重置customBoyNamesPool等，因为使用预设系统
}

// ============================================================================
// 大学类
// ============================================================================

class University {
    constructor(name, tier, scienceScore, artScore, location = "未知", category = "综合") {
        this.name = name;
        this.tier = tier;
        this.scienceScore = scienceScore;
        this.artScore = artScore;
        this.location = location;
        this.category = category;
    }

    getScoreRequirement(classType) {
        if (classType === ClassType.Science) {
            return this.scienceScore;
        } else {
            return this.artScore;
        }
    }
}

function getUniversityDatabase() {
    return [
        new University("清华大学", UniversityTier.TIER_985, 695, 680, "北京", "综合"),
        new University("北京大学", UniversityTier.TIER_985, 690, 675, "北京", "综合"),
        new University("复旦大学", UniversityTier.TIER_985, 680, 665, "上海", "综合"),
        new University("上海交通大学", UniversityTier.TIER_985, 678, 660, "上海", "综合"),
        new University("浙江大学", UniversityTier.TIER_985, 675, 658, "杭州", "综合"),
        new University("中国科学技术大学", UniversityTier.TIER_985, 670, 650, "合肥", "理工"),
        new University("南京大学", UniversityTier.TIER_985, 668, 655, "南京", "综合"),
        new University("武汉大学", UniversityTier.TIER_985, 655, 640, "武汉", "综合"),
        new University("华中科技大学", UniversityTier.TIER_985, 650, 635, "武汉", "理工"),
        new University("中山大学", UniversityTier.TIER_985, 645, 630, "广州", "综合"),
        new University("西安交通大学", UniversityTier.TIER_985, 640, 625, "西安", "综合"),
        new University("哈尔滨工业大学", UniversityTier.TIER_985, 638, 620, "哈尔滨", "理工"),
        new University("北京航空航天大学", UniversityTier.TIER_985, 665, 650, "北京", "理工"),
        new University("同济大学", UniversityTier.TIER_985, 660, 645, "上海", "理工"),
        new University("南开大学", UniversityTier.TIER_985, 650, 638, "天津", "综合"),
        new University("厦门大学", UniversityTier.TIER_985, 645, 635, "厦门", "综合"),
        new University("四川大学", UniversityTier.TIER_985, 640, 630, "成都", "综合"),
        new University("山东大学", UniversityTier.TIER_985, 635, 625, "济南", "综合"),
        new University("上海财经大学", UniversityTier.TIER_211, 655, 645, "上海", "财经"),
        new University("中央财经大学", UniversityTier.TIER_211, 650, 640, "北京", "财经"),
        new University("对外经济贸易大学", UniversityTier.TIER_211, 645, 635, "北京", "财经"),
        new University("北京邮电大学", UniversityTier.TIER_211, 640, 625, "北京", "理工"),
        new University("西安电子科技大学", UniversityTier.TIER_211, 630, 615, "西安", "理工"),
        new University("南京航空航天大学", UniversityTier.TIER_211, 625, 610, "南京", "理工"),
        new University("武汉理工大学", UniversityTier.TIER_211, 615, 600, "武汉", "理工"),
        new University("西南交通大学", UniversityTier.TIER_211, 610, 595, "成都", "理工"),
        new University("北京交通大学", UniversityTier.TIER_211, 620, 605, "北京", "理工"),
        new University("华东理工大学", UniversityTier.TIER_211, 625, 610, "上海", "理工"),
        new University("郑州大学", UniversityTier.TIER_211, 605, 590, "郑州", "综合"),
        new University("河南大学", UniversityTier.TIER_DOUBLE_FIRST, 595, 580, "开封", "综合"),
        new University("北京科技大学", UniversityTier.TIER_DOUBLE_FIRST, 615, 600, "北京", "理工"),
        new University("北京化工大学", UniversityTier.TIER_DOUBLE_FIRST, 605, 590, "北京", "理工"),
        new University("南京理工大学", UniversityTier.TIER_DOUBLE_FIRST, 620, 605, "南京", "理工"),
        new University("苏州大学", UniversityTier.TIER_DOUBLE_FIRST, 625, 610, "苏州", "综合"),
        new University("上海大学", UniversityTier.TIER_DOUBLE_FIRST, 620, 605, "上海", "综合"),
        new University("暨南大学", UniversityTier.TIER_DOUBLE_FIRST, 615, 600, "广州", "综合"),
        new University("福州大学", UniversityTier.TIER_DOUBLE_FIRST, 605, 590, "福州", "理工"),
        new University("南昌大学", UniversityTier.TIER_DOUBLE_FIRST, 600, 585, "南昌", "综合"),
        new University("河南工业大学", UniversityTier.TIER_TIER1, 570, 555, "郑州", "理工"),
        new University("河南理工大学", UniversityTier.TIER_TIER1, 560, 545, "焦作", "理工"),
        new University("河南农业大学", UniversityTier.TIER_TIER1, 555, 540, "郑州", "农林"),
        new University("河南师范大学", UniversityTier.TIER_TIER1, 565, 550, "新乡", "师范"),
        new University("河南科技大学", UniversityTier.TIER_TIER1, 560, 545, "洛阳", "理工"),
        new University("华北水利水电大学", UniversityTier.TIER_TIER1, 565, 550, "郑州", "理工"),
        new University("河南财经政法大学", UniversityTier.TIER_TIER1, 575, 560, "郑州", "财经"),
        new University("新乡医学院", UniversityTier.TIER_TIER1, 580, 565, "新乡", "医药"),
        new University("郑州轻工业大学", UniversityTier.TIER_TIER1, 555, 540, "郑州", "理工"),
        new University("中原工学院", UniversityTier.TIER_TIER1, 550, 535, "郑州", "理工"),
        new University("河南工程学院", UniversityTier.TIER_TIER2, 520, 505, "郑州", "理工"),
        new University("河南科技学院", UniversityTier.TIER_TIER2, 510, 495, "新乡", "农林"),
        new University("洛阳师范学院", UniversityTier.TIER_TIER2, 515, 500, "洛阳", "师范"),
        new University("安阳师范学院", UniversityTier.TIER_TIER2, 510, 495, "安阳", "师范"),
        new University("南阳师范学院", UniversityTier.TIER_TIER2, 505, 490, "南阳", "师范"),
        new University("商丘师范学院", UniversityTier.TIER_TIER2, 500, 485, "商丘", "师范"),
        new University("郑州科技学院", UniversityTier.TIER_TIER3, 450, 435, "郑州", "理工"),
        new University("黄河科技学院", UniversityTier.TIER_TIER3, 440, 425, "郑州", "综合"),
        new University("郑州工商学院", UniversityTier.TIER_TIER3, 430, 415, "郑州", "财经")
    ];
}

// ============================================================================
// 数据模型
// ============================================================================

class Student {
    constructor(index, belongClass, mode = GameMode.Normal, classType = ClassType.Science) {
        this.belongClass = belongClass;
        this.index = index;
        this.gender = Math.random() < 0.5 ? Gender.Boy : Gender.Girl;
        this.name = generateUniqueName(this.gender);
        this.gameMode = mode;
        this.status = Status.Normal;
        this.energy = STUDENT_ENERGY_DEFAULT;
        this.enthusiasm = randomCap(this.gameMode);
        this.character = [Math.random(), Math.random()];
        this.IQ = randomCap(this.gameMode) + 20;
        this.seatCol = 0;
        this.seatRow = 0;
        this.relation = {};
        for (let i = 1; i <= belongClass.studentNum; i++) {
            this.relation[i] = Relations.Normal;
        }
        this.relation[this.index] = Relations.Self;
        
        // 竞赛相关属性（仅简单模式）
        this.competition = null;
        this.competitionStage = null;
        this.competitionAward = CompetitionAward.None;
        this.inTraining = false;
        this.trainingEndWeek = null;
        this.admittedEarly = null;  // 通过竞赛提前录取
        
        // 死亡标记
        this.hasBeenDead = false;
        this.deathReason = null; // 记录消失原因：'energy' | 'killed' | 'expelled' | 'sold' | 'event'
        
        // 天赋系统
        this.talents = [];
        this._generateTalents();
        
        // 天赋影响的历史记录（用于爆发天赋）
        this.lastExamScoreChange = 0;
        
        if (this.gameMode === GameMode.Easy && isThisImpossible(IMPOSSIBLE_CHANCE_EASY_COMPETITION)) {
            const competitions = Object.values(Competition);
            this.competition = competitions[Math.floor(Math.random() * competitions.length)];
        }
        if (classType === ClassType.Science) {
            this.validSubjects = [Subject.Chinese, Subject.Maths, Subject.English,
                                  Subject.Physics, Subject.Chemistry, Subject.Biology];
        } else {
            this.validSubjects = [Subject.Chinese, Subject.Maths, Subject.English,
                                  Subject.Politics, Subject.History, Subject.Geography];
        }
        let baseCap;
        let maxCap;
        if (this.gameMode === GameMode.Easy) {
            this.growthRate = GROWTH_RATE_EASY;
            baseCap = BASE_CAP_EASY;
            maxCap = 62;  // 简单模式最大能力值最高
        } else if (this.gameMode === GameMode.Normal) {
            this.growthRate = GROWTH_RATE_NORMAL;
            baseCap = BASE_CAP_NORMAL;
            maxCap = 48;  // 普通模式最大能力值中等
        } else {
            this.growthRate = GROWTH_RATE_HARD;
            baseCap = BASE_CAP_HARD;
            maxCap = 38;  // 困难模式最大能力值最低
        }
        
        this.learnCap = {};
        for (let subject of this.validSubjects) {
            this.learnCap[subject] = randomGauss(baseCap, LEARN_CAP_STD, LEARN_CAP_MIN, maxCap);
        }
        this.previousScore = null;
        this.firstExamScore = null;
        this.scoreChangeFactor = 0.0;
        this.lastExamRank = null;
        this.leaveStartWeek = null;
        this.leaveEndWeek = null;
        this.gaokaoScore = null;
        this.gaokaoScores = null;
        this.admittedUniversity = null;
    }

    getNeighbors() {
        const neighbors = [];
        if (!this.seatCol || !this.seatRow) {
            return neighbors;
        }
        const seats = this.belongClass.seats;
        const c = this.seatCol - 1;
        const r = this.seatRow - 1;
        if (c > 0 && r < seats[c - 1].length && seats[c - 1][r] !== null) {
            neighbors.push(seats[c - 1][r]);
        }
        if (c < SEAT_COLUMNS - 1 && r < seats[c + 1].length && seats[c + 1][r] !== null) {
            neighbors.push(seats[c + 1][r]);
        }
        if (r > 0 && seats[c][r - 1] !== null) {
            neighbors.push(seats[c][r - 1]);
        }
        if (r + 1 < seats[c].length && seats[c][r + 1] !== null) {
            neighbors.push(seats[c][r + 1]);
        }
        return neighbors;
    }

    updateWeekly() {
        let energyRecover = STUDENT_ENERGY_RECOVER_NORMAL;
        if (this.status === Status.Leave) {
            energyRecover = STUDENT_ENERGY_RECOVER_LEAVE;
        }
        
        // 天赋影响：体育生精力恢复快
        if (this.talents.includes(Talent.SPORTS_STUDENT)) {
            energyRecover *= 1.8;
        }
        
        // 天赋影响：传奇机长考前一星期大幅降低精力
        if (this.talents.includes(Talent.LEGENDARY_CAPTAIN)) {
            const examWeeks = this.belongClass.contests[ContestType.Mid].concat(
                this.belongClass.contests[ContestType.End],
                this.belongClass.contests[ContestType.Final]
            );
            if (examWeeks.includes(this.belongClass.week + 1)) {
                energyRecover -= 5.0;
            }
        }
        
        // 天赋影响：阴暗爬行积极性保持较低
        if (this.talents.includes(Talent.DARK_CRAWLER)) {
            this.enthusiasm = Math.max(STUDENT_ENTHUSIASM_MIN, Math.min(30, this.enthusiasm));
        }
        
        // 天赋影响：三好学生积极性增长快
        let enthusiasmGrowthMultiplier = 1.0;
        if (this.talents.includes(Talent.GOOD_STUDENT)) {
            enthusiasmGrowthMultiplier = 2.0;
        }
        
        let enthusiasmDecay = STUDENT_ENTHUSIASM_DECAY_BASE;
        enthusiasmDecay += this.scoreChangeFactor;
        this.scoreChangeFactor *= SCORE_CHANGE_DECAY;
        // 天赋影响：冷漠 - 不与他人交往
        if (this.talents.includes(Talent.INDIFFERENT)) {
            // 跳过关系处理
        } else {
            const neighbors = this.getNeighbors();
            let hatingNeighborPenalty = 0.0;
            for (let neighbor of neighbors) {
                if (neighbor === null || neighbor.status === Status.Dead) {
                    continue;
                }
                const rel = this.relation[neighbor.index] || Relations.Normal;
                
                // 天赋影响：热情 - 与他人关系只增不减
                if (this.talents.includes(Talent.ENTHUSIASTIC)) {
                    if (rel === Relations.Hating || rel === Relations.Disliking) {
                        // 热情天赋会将不良关系改善为普通
                        this.relation[neighbor.index] = Relations.Normal;
                    }
                }
                
                if (rel === Relations.Friend || rel === Relations.Better) {
                    energyRecover += RELATION_FRIEND_ENERGY_GAIN;
                    enthusiasmDecay -= RELATION_FRIEND_ENTHUSIASM_REDUCTION * enthusiasmGrowthMultiplier;
                    if (neighbor.enthusiasm > 80) {
                        energyRecover += RELATION_FRIEND_HIGH_ENTH_GAIN;
                        enthusiasmDecay -= 0.2;
                    }
                } else if (rel === Relations.Hating || rel === Relations.Disliking) {
                    energyRecover -= RELATION_HATING_ENERGY_LOSS;
                    enthusiasmDecay += RELATION_HATING_ENTHUSIASM_INCREASE;
                    if (rel === Relations.Hating) {
                        hatingNeighborPenalty += RELATION_HATING_SEVERE_PENALTY;
                    }
                } else if (rel === Relations.Loving) {
                    energyRecover += 1.2;
                    enthusiasmDecay += 0.8;
                }
            }
            energyRecover -= hatingNeighborPenalty;
        }
        const energyNoise = (Math.random() * 2 - 1) * ENERGY_NOISE_RANGE;
        const enthusiasmNoise = (Math.random() * 2 - 1) * ENTHUSIASM_NOISE_RANGE;
        this.energy = Math.max(STUDENT_ENERGY_MIN,
            Math.min(STUDENT_ENERGY_MAX, this.energy + energyRecover + energyNoise));
        this.enthusiasm = Math.max(STUDENT_ENTHUSIASM_MIN,
            Math.min(STUDENT_ENTHUSIASM_MAX, this.enthusiasm - enthusiasmDecay + enthusiasmNoise));
        const efficiency = (this.energy / STUDENT_ENERGY_MAX) * (this.enthusiasm / STUDENT_ENTHUSIASM_MAX);
        const iqFactor = this.IQ / 100.0;
        
        // 天赋影响：学习能力增长
        let growthMultiplier = 1.0;
        if (this.talents.includes(Talent.SPORTS_STUDENT)) {
            growthMultiplier *= 0.3;  // 体育生学习能力增长很慢
        }
        if (this.talents.includes(Talent.GOOD_STUDENT)) {
            growthMultiplier *= 2.0;  // 三好学生学习能力增长更快
        }
        if (this.talents.includes(Talent.LEGENDARY_CAPTAIN)) {
            // 传奇机长考前一星期大幅增加学习能力
            const examWeeks = this.belongClass.contests[ContestType.Mid].concat(
                this.belongClass.contests[ContestType.End],
                this.belongClass.contests[ContestType.Final]
            );
            if (examWeeks.includes(this.belongClass.week + 1)) {
                growthMultiplier *= 3.0;  // 学习能力大幅增加
            }
        }
        
        for (let subject of this.validSubjects) {
            const currentCap = this.learnCap[subject];
            let increase = (LEARN_CAP_MAX - currentCap) * this.growthRate * efficiency * iqFactor * growthMultiplier;
            increase += (Math.random() * 2 - 1) * LEARN_INCREASE_NOISE;
            const decay = LEARN_CAP_DECAY_WEEKLY * (1.0 - efficiency);
            let newCap = currentCap + increase - decay;
            
            // 天赋影响：特定科目能力保持较高或较低
            if (this.talents.includes(Talent.GALOIS) && subject === Subject.Maths) {
                newCap = Math.max(60, newCap);  // 伽罗瓦：数学学习能力保持很高
            }
            if (this.talents.includes(Talent.LITERATURE_STAR) && subject === Subject.Chinese) {
                newCap = Math.max(60, newCap);  // 文曲星：语文学习能力保持很高
            }
            if (this.talents.includes(Talent.BOXER_MEMBER) && subject === Subject.English) {
                newCap = Math.min(25, newCap);  // 义和团员：英语学习能力保持很低
            }
            if (this.talents.includes(Talent.SCIENCE_GOD)) {
                // 理科战神：数理化生学习能力很高，语文英语与政史地能力保持很低
                const scienceSubjects = [Subject.Maths, Subject.Physics, Subject.Chemistry, Subject.Biology];
                const humanitiesSubjects = [Subject.Chinese, Subject.English, Subject.Politics, Subject.History, Subject.Geography];
                if (scienceSubjects.includes(subject)) {
                    newCap = Math.max(60, newCap);  // 理科科目学习能力更高
                } else if (humanitiesSubjects.includes(subject)) {
                    newCap = Math.min(25, newCap);  // 文科科目学习能力更低
                }
            }
            
            this.learnCap[subject] = Math.max(LEARN_CAP_MIN, Math.min(LEARN_CAP_MAX, newCap));
        }
        
        // 集训期间学习能力衰减
        if (this.inTraining) {
            for (let subject of this.validSubjects) {
                this.learnCap[subject] = Math.max(LEARN_CAP_MIN,
                    this.learnCap[subject] - COMPETITION_TRAINING_LEARN_CAP_DECAY);
            }
        }

        // 请假期间学习能力衰减（时间越久下降越多）
        if (this.status === Status.Leave) {
            for (let subject of this.validSubjects) {
                const currentCap = this.learnCap[subject];
                // 衰减量 = 基础衰减 * (1 + 请假周数的0.1倍)
                const weeksOnLeave = this.belongClass.week - this.leaveStartWeek;
                const decayMultiplier = 1 + weeksOnLeave * 0.1;
                const leaveDecay = LEARN_CAP_DECAY_LEAVE * decayMultiplier;
                this.learnCap[subject] = Math.max(LEARN_CAP_MIN, currentCap - leaveDecay);
            }
        }

        // 天赋效果：暴力 - 每回合有2%概率殴打班主任
        if (this.talents.includes(Talent.VIOLENT) && Math.random() < 0.02) {
            this.belongClass.teacher.health = Math.max(0, this.belongClass.teacher.health - 3);
            this.belongClass.log(`👊 学生 ${this.name} 殴打了班主任！班主任血量-3`, 'danger');
            
            // 添加弹窗提示
            if (typeof showNotification === 'function') {
                showNotification('danger', '警告！', `学生 ${this.name} 殴打了班主任！血量-3`);
            }
            
            checkTeacherDeath(this.belongClass);
        }
        
        // 天赋效果：大烟鬼 - 每回合10%概率抽烟
        if (this.talents.includes(Talent.SMOKER) && Math.random() < 0.1 && this.status !== Status.Dead) {
            if (Math.random() < 0.5) {
                // 50%概率恢复50精力
                this.energy = Math.min(STUDENT_ENERGY_MAX, this.energy + 50);
                this.belongClass.log(`🚬 学生 ${this.name} 抽烟恢复了50精力`, 'highlight');
            } else {
                // 50%概率被直接劝退
                this.status = Status.Dead;
                this.deathReason = 'smoking';
                this.belongClass.studentAliveNum--;
                this.belongClass.log(`🚬 学生 ${this.name} 抽烟被劝退！`, 'danger');
                
                // 添加弹窗提示
                if (typeof showNotification === 'function') {
                    showNotification('danger', '学生被劝退！', `学生 ${this.name} 抽烟被发现，已被劝退！`);
                }
            }
        }

        // 检查精力是否归零
        if (this.energy <= 0) {
            // 天赋影响：铁人 - 不会因精力耗尽而死
            if (this.talents.includes(Talent.IRON_MAN)) {
                this.energy = 0;
                this.belongClass.log(`🛡️ 学生 ${this.name} 因铁人天赋，精力耗尽但未死亡！`, 'highlight');
                console.log(`[IRON_MAN] Student ${this.name} energy drained but survived due to Iron Man talent.`);
            } else {
                this.energy = 0;
                this.status = Status.Dead;
                this.deathReason = 'energy';
                this.belongClass.studentAliveNum--;
                this.belongClass.log(`💀 学生 ${this.name} 因精力耗尽而死亡！`, 'danger');
                console.log(`[DEATH] Student ${this.name} died. studentAliveNum: ${this.belongClass.studentAliveNum}`);
                
                // 直接显示死亡通知弹窗
                if (typeof showStudentDeathModal === 'function') {
                    console.log(`[DEATH] Calling showStudentDeathModal for ${this.name}`);
                    showStudentDeathModal(this.name);
                } else {
                    console.error(`[DEATH] ERROR: showStudentDeathModal function not found!`);
                }
            }
        }
    }

    // 生成天赋
    _generateTalents(forceHaveTalent = false) {
        // forceHaveTalent为true时必定有天赋，否则按概率
        if (forceHaveTalent || Math.random() < TALENT_PROBABILITY) {
            const count = Math.floor(Math.random() * (TALENT_MAX_COUNT - TALENT_MIN_COUNT + 1)) + TALENT_MIN_COUNT;
            
            // 随机选择天赋（不重复）
            const availableTalents = [...TALENT_POOL];
            let addedCount = 0;
            
            while (addedCount < count && availableTalents.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableTalents.length);
                const talent = availableTalents.splice(randomIndex, 1)[0];
                
                // 检查天赋限制
                if (this._canHaveTalent(talent)) {
                    this.talents.push(talent);
                    addedCount++;
                }
            }
        }
    }

    // 检查是否可以拥有某个天赋
    _canHaveTalent(talent) {
        // 传奇机长仅限男生
        if (talent === Talent.LEGENDARY_CAPTAIN && this.gender !== Gender.Boy) {
            return false;
        }
        
        // 弹反天赋优先级高，如果有弹反，就不需要检查其他天赋
        if (this.talents.includes(Talent.PARRY)) {
            return false;
        }
        
        // 暴力和弹反不能同时存在
        if (talent === Talent.VIOLENT && this.talents.includes(Talent.PARRY)) {
            return false;
        }
        
        // 冷漠和热情不能同时存在
        if (talent === Talent.INDIFFERENT && this.talents.includes(Talent.ENTHUSIASTIC)) {
            return false;
        }
        
        if (talent === Talent.ENTHUSIASTIC && this.talents.includes(Talent.INDIFFERENT)) {
            return false;
        }
        
        // 阴暗爬行和三好学生不能同时存在
        if (talent === Talent.DARK_CRAWLER && this.talents.includes(Talent.GOOD_STUDENT)) {
            return false;
        }
        
        if (talent === Talent.GOOD_STUDENT && this.talents.includes(Talent.DARK_CRAWLER)) {
            return false;
        }
        
        // 铁人和林黛玉不能同时存在
        if (talent === Talent.IRON_MAN && this.talents.includes(Talent.LIN_DAIYU)) {
            return false;
        }
        
        if (talent === Talent.LIN_DAIYU && this.talents.includes(Talent.IRON_MAN)) {
            return false;
        }
        
        return true;
    }

    // 重置天赋
    resetTalents(forceHaveTalent = false) {
        this.talents = [];
        this._generateTalents(forceHaveTalent);
        this.lastExamScoreChange = 0;
    }

    toString() {
        return this.name;
    }
}

class Teacher {
    constructor(characterType = null) {
        this.characterType = characterType;
        this.salary = 0;
        this.health = TEACHER_HEALTH_MAX;
        
        // 应用角色特质
        if (characterType && CharacterData[characterType]) {
            const charData = CharacterData[characterType];
            this.energy = charData.maxEnergy;
            this.maxEnergy = charData.maxEnergy;
            this.monthlySalary = charData.monthlySalary;
            this.noSalaryPenalty = charData.noSalaryPenalty;
            this.reviveChance = charData.reviveChance;
            this.subject = charData.subject;
        } else {
            this.energy = TEACHER_ENERGY_DEFAULT;
            this.maxEnergy = TEACHER_ENERGY_DEFAULT;
            this.monthlySalary = TEACHER_MONTHLY_SALARY;
            this.noSalaryPenalty = false;
            this.reviveChance = 0;
            this.subject = null;
        }
        
this.lastSalaryWeek = 0;
    this.inventory = new Inventory(); // 物品栏

    // 开局自动获得希罗的钢笔
    this.inventory.addItem(Item.HERO_PEN);
  }

    recoverEnergy() {
        this.energy = this.maxEnergy;
    }

    takeDamage(amount) {
        if (amount <= 0) return 0;
        const hasMP7 = this.inventory && this.inventory.hasItem(Item.MP7);
        let actual = amount;
        if (hasMP7) {
            const blocked = Math.min(amount, 10);
            actual = amount - blocked;
            if (blocked > 0) {
                addLogEntry(`🛡️ mp7 抵消了 ${blocked} 点伤害！`, 'highlight');
            }
        }
        this.health -= actual;
        return actual;
    }
}

class LeaveRequest {
    constructor(student, duration, reason) {
        this.student = student;
        this.duration = duration;
        this.reason = reason || this.generateReason(student);
        this.requestedWeek = null;
        this.approved = null;
        this.processed = false;
    }

    generateReason(student) {
        // 男生可以从通用池和男生专属池中选择
        if (student.gender === Gender.Boy) {
            const allReasons = [...LEAVE_REASONS_COMMON, ...LEAVE_REASONS_BOY_ONLY];
            return allReasons[Math.floor(Math.random() * allReasons.length)];
        } else {
            // 女生只能从通用池中选择
            return LEAVE_REASONS_COMMON[Math.floor(Math.random() * LEAVE_REASONS_COMMON.length)];
        }
    }
}

// ============================================================================
// 物品栏系统
// ============================================================================

class Inventory {
    constructor() {
        this.slots = Array(40).fill(null);  // 40个槽位，每个槽位格式：{itemId: number, count: number} 或 null
        this.maxSlots = 40;  // 总共40个槽位
        this.maxItemStack = 64;  // 每格最多64件
    }

    // 获取物品栏槽位（0-9）
    getBarSlots() {
        return this.slots.slice(0, 10).filter(slot => slot !== null);
    }

    // 获取背包槽位（10-39）
    getBackpackSlots() {
        return this.slots.slice(10, 40).filter(slot => slot !== null);
    }

    // 将背包槽位物品移至物品栏槽位
    moveToBar(backpackSlotIndex, barSlotIndex) {
        // 验证槽位索引
        if (backpackSlotIndex < 10 || backpackSlotIndex >= 40) {
            return { success: false, message: '背包槽位索引无效' };
        }
        if (barSlotIndex < 0 || barSlotIndex >= 10) {
            return { success: false, message: '物品栏槽位索引无效' };
        }

        const backpackSlot = this.slots[backpackSlotIndex];
        if (!backpackSlot) {
            return { success: false, message: '背包槽位为空' };
        }

        const barSlot = this.slots[barSlotIndex];

        // 如果目标槽位为空，直接移动
        if (!barSlot) {
            this.slots[barSlotIndex] = backpackSlot;
            this.slots[backpackSlotIndex] = null;
            return { success: true, message: '物品已移至物品栏' };
        }

        // 如果目标槽位有相同物品，尝试堆叠
        if (barSlot.itemId === backpackSlot.itemId) {
            const total = barSlot.count + backpackSlot.count;
            if (total <= this.maxItemStack) {
                barSlot.count = total;
                this.slots[backpackSlotIndex] = null;
                return { success: true, message: '物品已堆叠' };
            } else {
                return { success: false, message: '目标槽位已满' };
            }
        }

        // 如果目标槽位有不同物品，交换
        this.slots[barSlotIndex] = backpackSlot;
        this.slots[backpackSlotIndex] = barSlot;
        return { success: true, message: '物品已交换' };
    }

    // 交换两个槽位的物品
    swapSlots(indexA, indexB) {
        // 验证槽位索引
        if (indexA < 0 || indexA >= 40 || indexB < 0 || indexB >= 40) {
            return { success: false, message: '槽位索引无效' };
        }

        const temp = this.slots[indexA];
        this.slots[indexA] = this.slots[indexB];
        this.slots[indexB] = temp;

        return { success: true, message: '槽位已交换' };
    }

    // 添加物品（优先填充物品栏0-9，再填充背包10-39）
    addItem(itemId) {
        // 先尝试在物品栏（0-9）中找到相同物品并堆叠
        for (let i = 0; i < 10; i++) {
            const slot = this.slots[i];
            if (slot && slot.itemId === itemId && slot.count < this.maxItemStack) {
                slot.count++;
                return { success: true, message: '物品已添加' };
            }
        }

        // 再尝试在背包（10-39）中找到相同物品并堆叠
        for (let i = 10; i < 40; i++) {
            const slot = this.slots[i];
            if (slot && slot.itemId === itemId && slot.count < this.maxItemStack) {
                slot.count++;
                return { success: true, message: '物品已添加' };
            }
        }

        // 在物品栏（0-9）中找空槽位
        for (let i = 0; i < 10; i++) {
            if (!this.slots[i]) {
                this.slots[i] = { itemId: itemId, count: 1 };
                return { success: true, message: '物品已添加' };
            }
        }

        // 在背包（10-39）中找空槽位
        for (let i = 10; i < 40; i++) {
            if (!this.slots[i]) {
                this.slots[i] = { itemId: itemId, count: 1 };
                return { success: true, message: '物品已添加' };
            }
        }

        return { success: false, message: '物品栏已满' };
    }

    // 移除物品（从所有槽位中移除）
    removeItem(itemId, count = 1) {
        let remaining = count;

        // 先从物品栏（0-9）中移除
        for (let i = 0; i < 10 && remaining > 0; i++) {
            const slot = this.slots[i];
            if (slot && slot.itemId === itemId) {
                if (slot.count <= remaining) {
                    remaining -= slot.count;
                    this.slots[i] = null;
                } else {
                    slot.count -= remaining;
                    remaining = 0;
                }
            }
        }

        // 再从背包（10-39）中移除
        for (let i = 10; i < 40 && remaining > 0; i++) {
            const slot = this.slots[i];
            if (slot && slot.itemId === itemId) {
                if (slot.count <= remaining) {
                    remaining -= slot.count;
                    this.slots[i] = null;
                } else {
                    slot.count -= remaining;
                    remaining = 0;
                }
            }
        }

        if (remaining === count) {
            return { success: false, message: '没有该物品' };
        }

        return { success: true, message: `已移除${count - remaining}件物品` };
    }

    // 使用物品
    useItem(itemId) {
        // 检查是否有该物品
        if (!this.hasItem(itemId)) {
            return { success: false, message: '没有该物品' };
        }

        const itemInfo = ItemInfo[itemId];
        if (!itemInfo) {
            return { success: false, message: '物品信息不存在' };
        }

        // 执行物品效果
        const result = this._applyItemEffect(itemId, itemInfo);

        if (result.success) {
            // 消耗品使用后减少数量
            if (itemInfo.consumable === true) {
                this.removeItem(itemId, 1);

                // 小冰茶使用后40%概率获得一元乐享
                if (itemId === Item.ICE_TEA && Math.random() < 0.4) {
                    const addResult = this.addItem(Item.ONE_YUAN_ICE_TEA);
                    if (addResult.success) {
                        result.message += `\n🎉 幸运！获得了一元乐享（小冰茶）！`;
                    }
                }
            }
        }

        return result;
    }

    // 检查是否有物品（检查所有槽位）
    hasItem(itemId) {
        for (let i = 0; i < 40; i++) {
            const slot = this.slots[i];
            if (slot && slot.itemId === itemId && slot.count > 0) {
                return true;
            }
        }
        return false;
    }

    // 获取物品数量（统计所有槽位）
    getItemCount(itemId) {
        let total = 0;
        for (let i = 0; i < 40; i++) {
            const slot = this.slots[i];
            if (slot && slot.itemId === itemId) {
                total += slot.count;
            }
        }
        return total;
    }

    // 获取所有物品列表
    getAllItems() {
        const items = [];
        for (let i = 0; i < 40; i++) {
            const slot = this.slots[i];
            if (slot) {
                items.push({
                    itemId: slot.itemId,
                    count: slot.count,
                    slotIndex: i
                });
            }
        }
        return items;
    }

    // 获取物品栏显示数据（10个格子）
    getDisplaySlots() {
        return this.slots.slice(0, 10);
    }

    // 获取最大槽位数
    getMaxSlots() {
        return this.maxSlots;
    }

    // 应用物品效果
    _applyItemEffect(itemId, itemInfo) {
        // 根据物品类型执行不同效果
        switch (itemId) {
            case Item.ICE_TEA:
                // 小冰茶：增加5点血量
                if (gameClass && gameClass.teacher) {
                    gameClass.teacher.health = Math.min(TEACHER_HEALTH_MAX, gameClass.teacher.health + 5);
                    return { success: true, message: `使用了${itemInfo.name}，血量+5` };
                }
                return { success: false, message: '游戏未初始化' };
            case Item.YIJIN_JING:
                // 易筋经：将精力上限增加至120
                if (gameClass && gameClass.teacher) {
                    gameClass.teacher.maxEnergy = 120;
                    gameClass.teacher.energy = Math.min(gameClass.teacher.energy + 40, 120);
                    return { success: true, message: `使用了${itemInfo.name}，精力上限提升至120` };
                }
                return { success: false, message: '游戏未初始化' };
            case Item.ONE_YUAN_ICE_TEA:
                // 一元乐享（小冰茶）：花费一元获得一瓶小冰茶
                if (gameClass && gameClass.teacher) {
                    if (gameClass.teacher.salary < 1) {
                        return { success: false, message: '工资不足！需要1元' };
                    }
                    gameClass.teacher.salary -= 1;
                    const addResult = gameClass.teacher.inventory.addItem(Item.ICE_TEA);
                    if (addResult.success) {
                        return { success: true, message: `使用了${itemInfo.name}，花费1元，获得一瓶小冰茶！` };
                    } else {
                        return { success: false, message: `物品栏已满，无法获得小冰茶` };
                    }
                }
                return { success: false, message: '游戏未初始化' };
            case Item.CHA_CUI:
                // 茶脆：精力回满，1%概率获得一元乐享（茶脆）
                if (gameClass && gameClass.teacher) {
                    const teacher = gameClass.teacher;
                    const lostEnergy = teacher.maxEnergy - teacher.energy;
                    teacher.energy = teacher.maxEnergy;
                    let msg = `使用了${itemInfo.name}，精力回满（+${lostEnergy}）`;
                    if (Math.random() < 0.01) {
                        const addResult = teacher.inventory.addItem(Item.ONE_YUAN_CHA_CUI);
                        if (addResult.success) {
                            msg += '！惊喜！获得了一瓶一元乐享（茶脆）！';
                        }
                    }
                    return { success: true, message: msg };
                }
                return { success: false, message: '游戏未初始化' };
            case Item.ONE_YUAN_CHA_CUI:
                // 一元乐享（茶脆）：花费一元获得一瓶茶脆
                if (gameClass && gameClass.teacher) {
                    if (gameClass.teacher.salary < 1) {
                        return { success: false, message: '工资不足！需要1元' };
                    }
                    gameClass.teacher.salary -= 1;
                    const addResult = gameClass.teacher.inventory.addItem(Item.CHA_CUI);
                    if (addResult.success) {
                        return { success: true, message: `使用了${itemInfo.name}，花费1元，获得一瓶茶脆！` };
                    } else {
                        return { success: false, message: `物品栏已满，无法获得茶脆` };
                    }
                }
                return { success: false, message: '游戏未初始化' };
            case Item.SIGMA:
                // Σ：使选中的学生物理学习能力+40，上限100
                if (gameClass) {
                    if (selectedStudentIndex === null) {
                        return { success: false, message: '请先选择一个学生' };
                    }
                    const student = gameClass._getStudentByIndex(selectedStudentIndex);
                    if (student && student.learnCap[Subject.Physics] !== undefined) {
                        const oldCap = student.learnCap[Subject.Physics];
                        student.learnCap[Subject.Physics] = Math.min(100, Math.floor(oldCap) + 40);
                        const actualGain = Math.floor(student.learnCap[Subject.Physics]) - Math.floor(oldCap);
                        return { success: true, message: `使用了${itemInfo.name}，${student.name}的物理学习能力+${actualGain}（${Math.floor(oldCap)}→${Math.floor(student.learnCap[Subject.Physics])}）` };
                    }
                    return { success: false, message: '该学生没有物理科目' };
                }
                return { success: false, message: '游戏未初始化' };
            case Item.MP5:
                // mp5：击毙选中的学生
                if (gameClass) {
                    if (selectedStudentIndex === null) {
                        return { success: false, message: '请先选择一个学生' };
                    }
                    const student = gameClass._getStudentByIndex(selectedStudentIndex);
                    if (student) {
                        student.status = Status.Dead;
                        student.deathReason = 'killed';
                        gameClass.studentAliveNum--;
                        gameClass.log(`💀 学生 ${student.name} 被击毙！`, 'danger');
                        selectedStudentIndex = null;
                        if (typeof renderAll === 'function') renderAll();
                        return { success: true, message: `使用了${itemInfo.name}，${student.name}被击毙！` };
                    }
                    return { success: false, message: '学生不存在' };
                }
                return { success: false, message: '游戏未初始化' };
            default:
                // 其他物品暂时返回成功，后续实现具体效果
                return { success: true, message: `使用了${itemInfo.name}` };
        }
    }
}

// ============================================================================
// 全局Tooltip系统
// ============================================================================

function initGlobalTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'global-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        z-index: 99999;
        background: rgba(0, 0, 0, 0.95);
        color: #f0ede8;
        padding: 10px 14px;
        border-radius: 6px;
        font-size: 0.75em;
        white-space: pre-wrap;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        min-width: 150px;
    max-width: 400px;
        text-align: left;
        line-height: 1.5;
        word-wrap: break-word;
        word-break: break-word;
    `;
    document.body.appendChild(tooltip);

    const arrow = document.createElement('div');
    arrow.id = 'global-tooltip-arrow';
    arrow.style.cssText = `
        position: fixed;
        z-index: 99999;
        border: 6px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.95);
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.2s;
    `;
    document.body.appendChild(arrow);

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (target) {
            const text = target.getAttribute('data-tooltip');
            showGlobalTooltip(target, text);
        }
    }, true);

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (target) {
            hideGlobalTooltip();
        }
    }, true);

    document.addEventListener('mousemove', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (target && tooltip.style.visibility === 'visible') {
            updateTooltipPosition(target);
        }
    }, true);

    // 移动端：点击其他地方隐藏tooltip
    document.addEventListener('touchstart', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (!target) {
            hideGlobalTooltip();
        }
    }, true);
}

// 全局tooltip自动消失定时器
let tooltipAutoHideTimer = null;

function showGlobalTooltip(element, text) {
    // 检查物品选项弹窗是否打开，如果打开则不显示tooltip
    const itemOptionPopup = document.getElementById('itemOptionPopup');
    if (itemOptionPopup && itemOptionPopup.classList.contains('show')) {
        return;
    }
    
    // 清除之前的自动消失定时器
    if (tooltipAutoHideTimer) {
        clearTimeout(tooltipAutoHideTimer);
        tooltipAutoHideTimer = null;
    }
    
    const tooltip = document.getElementById('global-tooltip');
    const arrow = document.getElementById('global-tooltip-arrow');

    tooltip.textContent = text;
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';
    arrow.style.visibility = 'visible';
    arrow.style.opacity = '1';

    updateTooltipPosition(element);

    // 移动端自动消失：2秒后隐藏
    if (document.body.classList.contains('mobile-device')) {
        tooltipAutoHideTimer = setTimeout(() => {
            hideGlobalTooltip();
            tooltipAutoHideTimer = null;
        }, 2000);
    }
}

function hideGlobalTooltip() {
    // 清除自动消失定时器
    if (tooltipAutoHideTimer) {
        clearTimeout(tooltipAutoHideTimer);
        tooltipAutoHideTimer = null;
    }

    const tooltip = document.getElementById('global-tooltip');
    const arrow = document.getElementById('global-tooltip-arrow');

    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
    arrow.style.opacity = '0';
    arrow.style.visibility = 'hidden';
}

function updateTooltipPosition(element) {
    const tooltip = document.getElementById('global-tooltip');
    const arrow = document.getElementById('global-tooltip-arrow');

    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top = rect.top - tooltipRect.height - 12;
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

    if (top < 10) {
        top = rect.bottom + 12;
    }

    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }

    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';

    arrow.style.left = (rect.left + rect.width / 2) + 'px';
}

/**
 * 显示关系模式下的悬停信息
 * @param {HTMLElement} element - 悬停的学生单元格元素
 * @param {Student} student - 悬停的学生对象
 */
function showRelationTooltip(element, student) {
    if (selectedStudentIndex === null) {
        showGlobalTooltip(element, `${student.name}\n请先选择一个学生查看关系`);
        return;
    }

    const selectedStudent = gameClass._getStudentByIndex(selectedStudentIndex);
    if (!selectedStudent) {
        return;
    }

    // 获取关系
    const relation = student.relation[selectedStudentIndex] || Relations.Normal;
    const relationName = getRelationName(relation);

    // 获取选中的学生对悬停学生的关系
    const reverseRelation = selectedStudent.relation[student.index] || Relations.Normal;
    const reverseRelationName = getRelationName(reverseRelation);

    // 构建tooltip文本
    let tooltipText = `${student.name}\n`;
    tooltipText += `对 ${selectedStudent.name} 的关系：${relationName}\n`;
    tooltipText += `${selectedStudent.name} 对 ${student.name} 的关系：${reverseRelationName}`;

    showGlobalTooltip(element, tooltipText);
}

/**
 * 显示状态模式下的悬停信息
 * @param {HTMLElement} element - 悬停的学生单元格元素
 * @param {Student} student - 悬停的学生对象
 */
function showStatusTooltip(element, student) {
    const statusName = getStatusName(student.status);
    
    let tooltipText = `${student.name}\n`;
    tooltipText += `状态：${statusName}\n`;
    tooltipText += `精力：${student.energy.toFixed(1)}/${STUDENT_ENERGY_MAX}\n`;
    tooltipText += `积极性：${student.enthusiasm.toFixed(1)}/${STUDENT_ENTHUSIASM_MAX}`;

    showGlobalTooltip(element, tooltipText);
}

/**
 * 显示竞赛模式下的悬停信息
 * @param {HTMLElement} element - 悬停的学生单元格元素
 * @param {Student} student - 悬停的学生对象
 */
function showCompetitionTooltip(element, student) {
    let tooltipText = `${student.name}\n`;
    
    if (student.competition !== null) {
        const compName = gameClass._getCompetitionName(student.competition);
        let stageInfo = '';
        if (student.competitionStage) {
            stageInfo = student.competitionStage === CompetitionStage.League ? '（联赛）' : '（省队）';
        }
        
        let awardInfo = '';
        if (student.competitionAward !== CompetitionAward.None) {
            const awardName = student.competitionAward === CompetitionAward.Gold ? '🥇金牌' : 
                            student.competitionAward === CompetitionAward.Silver ? '🥈银牌' : '🥉铜牌';
            awardInfo = ` - ${awardName}`;
        }
        
        tooltipText += `竞赛科目：${compName}${stageInfo}${awardInfo}`;
        
        if (student.inTraining) {
            const weeksLeft = student.trainingEndWeek - gameClass.week;
            tooltipText += `\n集训中（剩余${weeksLeft}周）`;
        }
        
        if (student.admittedEarly) {
            tooltipText += `\n已提前录取：${student.admittedEarly.name}`;
        }
    } else {
        tooltipText += `非竞赛生`;
    }

    showGlobalTooltip(element, tooltipText);
}

// ============================================================================
// UI 相关函数
// ============================================================================

function renderAll() {
    if (!gameClass) return;

    updateStatusBar();
    renderSeatingGrid();
    renderExamHistory();
    updateButtonStates();
    updateInfoPanel();
    renderInventory();
}

function updateStatusBar() {
    if (!gameClass) return;

    const updateWithEffect = (element, newValue, effectClass) => {
        const oldValue = parseInt(element.textContent) || 0;
        element.textContent = newValue;
        
        // 如果数值发生了变化，添加特效
        if (oldValue !== newValue) {
            // 移除旧的动画类
            element.classList.remove('value-increase', 'value-decrease');
            
            // 强制重排，让浏览器识别class的移除
            void element.offsetWidth;
            
            // 根据数值变化方向添加不同的动画类
            if (newValue > oldValue) {
                element.classList.add('value-increase');
            } else if (newValue < oldValue) {
                element.classList.add('value-decrease');
            }
            
            // 1.5秒后移除动画类
            setTimeout(() => {
                element.classList.remove('value-increase', 'value-decrease');
            }, 1500);
        }
    };

    weekDisplay.textContent = `${gameClass.week}/60`;
    
    // 显示角色信息
    if (gameClass.characterType && CharacterData[gameClass.characterType]) {
        characterDisplay.textContent = CharacterData[gameClass.characterType].name;
    } else {
        characterDisplay.textContent = '-';
    }
    
    nextExamDisplay.textContent = gameClass.getNextExamWeek();
    updateWithEffect(energyDisplay, Math.round(gameClass.teacher.energy));
    updateWithEffect(salaryDisplay, gameClass.teacher.salary);
    updateWithEffect(healthDisplay, gameClass.teacher.health);
    
    // 更新工资tooltip
    updateSalaryTooltip();
}

function updateSalaryTooltip() {
    if (!gameClass || !gameClass.teacher) return;
    
    const deadStudents = gameClass.students.filter(s => s.status === Status.Dead).length;
    const penalty = deadStudents * 250;
    const baseSalary = gameClass.teacher.monthlySalary;
    const actualSalary = gameClass.teacher.noSalaryPenalty ? baseSalary : Math.max(300, baseSalary - penalty);
    
    let tooltipText = `当前每月（4周）+${actualSalary}元`;
    
    if (!gameClass.teacher.noSalaryPenalty && deadStudents > 0) {
        tooltipText += `（死亡学生${deadStudents}人，扣${penalty}元）`;
    } else if (gameClass.teacher.noSalaryPenalty && deadStudents > 0) {
        tooltipText += `（魏教授特质：死亡学生不扣工资）`;
    }
    
    tooltipText += `\n🏅 全勤奖：每周无学生减少 +150 元`;
    
    salaryDisplay.setAttribute('data-tooltip', tooltipText);
}

function renderSeatingGrid() {
    if (!gameClass) return;

    seatingGrid.innerHTML = '';

    // 移动端动态计算座位格子大小
    const isMobile = document.body.classList.contains('mobile-device');
    if (isMobile) {
        const areaRect = seatingArea.getBoundingClientRect();
        const controlsEl = seatingArea.querySelector('.seating-controls');
        const controlsHeight = controlsEl ? controlsEl.offsetHeight : 0;
        const availableHeight = areaRect.height - controlsHeight;
        const availableWidth = areaRect.width - 12;

        const rows = gameClass.seats[0].length;
        const cols = SEAT_COLUMNS;

        const seatGap = 4;
        const seatPadding = 12;
        const seatAspect = 80 / 100;

        const cellHeightFromH = (availableHeight - seatPadding * 2 - seatGap * (rows - 1)) / rows;
        const cellWidthFromW = (availableWidth - seatPadding * 2 - seatGap * (cols - 1)) / cols;

        let cellH = Math.min(cellHeightFromH, cellWidthFromW / seatAspect);
        let cellW = cellH * seatAspect;

        cellH = Math.max(cellH, 30);
        cellW = Math.max(cellW, 24);

        document.documentElement.style.setProperty('--seat-size', cellW + 'px');
        document.documentElement.style.setProperty('--seat-height', cellH + 'px');
        document.documentElement.style.setProperty('--seat-gap', seatGap + 'px');
        document.documentElement.style.setProperty('--seat-padding', (seatPadding / 2) + 'px');

        seatingGrid.style.gridTemplateColumns = `repeat(${cols}, ${cellW}px)`;
        seatingGrid.style.justifyContent = 'center';
    }

    for (let col = 0; col < SEAT_COLUMNS; col++) {
        for (let row = 0; row < gameClass.seats[col].length; row++) {
            const student = gameClass.seats[col][row];

            const cell = document.createElement('div');
            cell.className = 'student-cell';

            // 跳过死亡的学生，视为空座位
            if (student === null) {
                cell.classList.add('empty');
            } else if (student.status === Status.Dead) {
                cell.classList.add('empty', 'dead');
            } else {
                cell.classList.add(`mode-${viewMode}`);

                if (viewMode === 'normal') {
                    cell.classList.add(student.gender === Gender.Boy ? 'male' : 'female');
                } else if (viewMode === 'relation') {
                    if (selectedStudentIndex !== null) {
                        const rel = student.relation[selectedStudentIndex] || Relations.Normal;
                        cell.classList.add(`relation-${getRelationClass(rel)}`);
                    } else {
                        cell.classList.add('relation-normal');
                    }
                } else if (viewMode === 'status') {
                    cell.classList.add(`status-${getStatusClass(student.status)}`);
                } else if (viewMode === 'competition') {
                    // 竞赛模式：根据竞赛科目显示不同颜色
                    if (student.competition !== null) {
                        const competitionClass = getCompetitionClass(student.competition);
                        cell.classList.add(`competition-${competitionClass}`);
                    } else {
                        cell.classList.add('competition-none');
                    }
                }

                if (student.index === selectedStudentIndex) {
                    cell.classList.add('selected');
                }

                if (swapMode) {
                    if (student.index === swapFirstStudent) {
                        cell.classList.add('swap-source');
                    } else {
                        cell.classList.add('swap-target');
                        cell.style.cursor = 'pointer';
                    }
                }

                if (instigateMode) {
                    cell.classList.add('instigate-target');
                    cell.style.cursor = 'pointer';
                    if (student.index === selectedStudentIndex) {
                        cell.classList.add('instigate-source');
                    }
                }

                // 性别图标
                const genderIcon = document.createElement('div');
                genderIcon.className = `gender-icon ${student.gender === Gender.Boy ? 'male' : 'female'}`;
                genderIcon.textContent = student.gender === Gender.Boy ? '♂' : '♀';
                cell.appendChild(genderIcon);

                // 竞赛生标记已删除，现在通过竞赛模式显示

                // 天赋标签
                if (student.talents.length > 0) {
                    const talentsContainer = document.createElement('div');
                    talentsContainer.className = 'talents-container';
                    
                    for (let talent of student.talents) {
                        const talentInfo = TALENT_INFO[talent];
                        if (talentInfo) {
                            const talentTag = document.createElement('div');
                            talentTag.className = 'talent-tag';
                            talentTag.textContent = talentInfo.name;
                            talentTag.setAttribute('data-tooltip', talentInfo.description);
                            talentsContainer.appendChild(talentTag);
                        }
                    }
                    
                    cell.appendChild(talentsContainer);
                }

                const nameDiv = document.createElement('div');
                nameDiv.className = 'student-name';
                nameDiv.textContent = student.name;
                cell.appendChild(nameDiv);

                if (student.lastExamRank !== null) {
                    const rankBadge = document.createElement('div');
                    rankBadge.className = 'rank-badge';
                    const rankColor = student.lastExamRank <= 3 ? 'rank-gold' :
                                     student.lastExamRank <= 10 ? 'rank-silver' : 'rank-bronze';
                    rankBadge.classList.add(rankColor);
                    rankBadge.textContent = `#${student.lastExamRank}`;
                    cell.appendChild(rankBadge);
                }

                const totalAbility = Object.values(student.learnCap).reduce((a, b) => a + b, 0);
                const maxAbility = Object.keys(student.learnCap).length * LEARN_CAP_MAX;
                const abilityPercent = (totalAbility / maxAbility) * 100;

                // 能力值进度条和精力值进度条容器
                const barsContainer = document.createElement('div');
                barsContainer.className = 'bars-container';

                // 能力值进度条
                const abilityBarContainer = document.createElement('div');
                abilityBarContainer.className = 'bar-container';

                const abilityBar = document.createElement('div');
                abilityBar.className = 'bar ability-bar';
                abilityBar.style.width = `${abilityPercent}%`;
                abilityBarContainer.appendChild(abilityBar);

                barsContainer.appendChild(abilityBarContainer);

                // 精力值进度条
                const energyPercent = (student.energy / STUDENT_ENERGY_MAX) * 100;
                const energyBarContainer = document.createElement('div');
                energyBarContainer.className = 'bar-container';

                const energyBar = document.createElement('div');
                energyBar.className = 'bar energy-bar';
                energyBar.style.width = `${energyPercent}%`;
                energyBarContainer.appendChild(energyBar);

                barsContainer.appendChild(energyBarContainer);

                cell.appendChild(barsContainer);
            }

            // 设置点击事件（无论是否为空位置都可点击）
            cell.onclick = () => {
                const studentAtSeat = student || null;
                handleSeatClick(col + 1, row + 1, studentAtSeat);
            };

            // 设置鼠标悬停事件
            if (student) {
                cell.onmouseover = () => {
                    if (viewMode === 'relation') {
                        showRelationTooltip(cell, student);
                    } else if (viewMode === 'status') {
                        showStatusTooltip(cell, student);
                    } else if (viewMode === 'competition') {
                        showCompetitionTooltip(cell, student);
                    }
                };

                cell.onmouseout = () => {
                    hideGlobalTooltip();
                };
            }

            seatingGrid.appendChild(cell);
        }
    }
}

function updateInfoPanel() {
    if (!gameClass || selectedStudentIndex === null) {
        infoPanel.style.display = 'none';
        return;
    }

    const student = gameClass._getStudentByIndex(selectedStudentIndex);
    if (!student) {
        infoPanel.style.display = 'none';
        return;
    }

    // 死亡学生不显示信息
    if (student.status === Status.Dead) {
        infoPanel.style.display = 'none';
        return;
    }

    infoPanel.style.display = 'block';
    infoPanel.innerHTML = '';

    infoPanel.innerHTML += `
        <div class="student-info">
            <div class="info-row"><strong>姓名：</strong>${student.name}</div>
            <div class="info-row"><strong>性别：</strong>${student.gender === Gender.Boy ? '男' : '女'}</div>
            <div class="info-row"><strong>状态：</strong>${getStatusName(student.status)}</div>
            ${student.status === Status.Dead && student.deathReason ? `<div class="info-row"><strong>死亡原因：</strong>${getDeathReasonText(student.deathReason)}</div>` : ''}
            <div class="info-row"><strong>精力：</strong>${student.energy.toFixed(1)}/${STUDENT_ENERGY_MAX}</div>
            <div class="info-row"><strong>积极性：</strong>${student.enthusiasm.toFixed(1)}/${STUDENT_ENTHUSIASM_MAX}</div>
            <div class="info-row"><strong>智商：</strong>${student.IQ}</div>
        </div>
    `;

    // 竞赛生信息（仅简单模式）
    if (gameClass.mode === GameMode.Easy && student.competition) {
        infoPanel.innerHTML += `<div class="student-info" style="margin-top: 10px;"><strong>竞赛信息：</strong></div>`;
        const compName = gameClass._getCompetitionName(student.competition);
        
        let stageInfo = '';
        if (student.competitionStage) {
            stageInfo = student.competitionStage === CompetitionStage.League ? '（联赛）' : '（省队）';
        }
        
        let awardInfo = '';
        if (student.competitionAward !== CompetitionAward.None) {
            const awardName = student.competitionAward === CompetitionAward.Gold ? '🥇金牌' : 
                            student.competitionAward === CompetitionAward.Silver ? '🥈银牌' : '🥉铜牌';
            awardInfo = ` - ${awardName}`;
        }
        
        let admittedInfo = '';
        if (student.admittedEarly) {
            admittedInfo = ` → ${student.admittedEarly.name}`;
        }
        
        infoPanel.innerHTML += `
            <div class="info-row" style="margin-left: 10px;">
                ${compName}竞赛生${stageInfo}${awardInfo}${admittedInfo}
            </div>
        `;
        
        if (student.inTraining) {
            const weeksLeft = student.trainingEndWeek - gameClass.week;
            infoPanel.innerHTML += `
                <div class="info-row" style="margin-left: 10px; color: #f39c12;">
                    🏋️ 集训中（剩余${weeksLeft}周）
                </div>
            `;
        }
    }

    // 天赋信息
    if (student.talents.length > 0) {
        infoPanel.innerHTML += `<div class="student-info" style="margin-top: 10px;"><strong>天赋：</strong></div>`;
        for (let talent of student.talents) {
            const talentInfo = TALENT_INFO[talent];
            if (talentInfo) {
                infoPanel.innerHTML += `
                    <div class="info-row" style="margin-left: 10px;">
                        <span class="talent-tag" data-talent="${talent}">${talentInfo.name}</span>
                    </div>
                `;
            }
        }
    }

    infoPanel.innerHTML += `<div class="student-info" style="margin-top: 10px;"><strong>学习能力：</strong></div>`;
    for (let [subject, cap] of Object.entries(student.learnCap)) {
        const subjectName = getSubjectName(parseInt(subject));
        infoPanel.innerHTML += `
            <div class="info-row" style="margin-left: 10px;">
                ${subjectName}: ${cap.toFixed(1)}
            </div>
        `;
    }

    infoPanel.innerHTML += `<div class="student-info" style="margin-top: 10px;"><strong>关系：</strong></div>`;
    const relations = [];
    for (let [otherIdx, rel] of Object.entries(student.relation)) {
        if (parseInt(otherIdx) !== student.index && rel !== Relations.Normal) {
            const otherStudent = gameClass._getStudentByIndex(parseInt(otherIdx));
            if (otherStudent && otherStudent.status !== Status.Dead) {
                relations.push({
                    name: otherStudent.name,
                    relation: rel
                });
            }
        }
    }

    if (relations.length === 0) {
        infoPanel.innerHTML += `<div class="info-row" style="margin-left: 10px;">无特殊关系</div>`;
    } else {
        for (let relInfo of relations) {
            infoPanel.innerHTML += `
                <div class="info-row" style="margin-left: 10px;">
                    ${relInfo.name}: ${getRelationName(relInfo.relation)}
                </div>
            `;
        }
    }
}

// ============================================================================
// 物品栏UI函数
// ============================================================================

// 渲染物品栏（修改版）
function renderInventory() {
    if (!gameClass || !gameClass.teacher) return;
    
    const inventory = gameClass.teacher.inventory;
    const inventoryBar = document.getElementById('inventoryBar');
    
    if (!inventoryBar) return;
    
    // 清空现有内容
    inventoryBar.innerHTML = '';
    
    // 获取显示数据
    const displaySlots = inventory.getDisplaySlots();
    
    // 渲染10个格子
    for (let i = 0; i < 10; i++) {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        slot.dataset.slot = i;
        
        const slotData = displaySlots[i];
        if (slotData !== null) {
            const itemInfo = ItemInfo[slotData.itemId];
            if (itemInfo) {
                slot.classList.add('has-item');
                
                // 添加tooltip（仅显示名称）
                slot.dataset.tooltip = itemInfo.name;
                
                // 物品图标（支持emoji和图片）
                if (itemInfo.icon.startsWith('./')) {
                    // 图片图标
                    const iconImg = document.createElement('img');
                    iconImg.className = 'item-icon';
                    iconImg.src = itemInfo.icon;
                    iconImg.alt = itemInfo.name;
                    slot.appendChild(iconImg);
                } else {
                    // emoji图标
                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'item-icon';
                    iconSpan.textContent = itemInfo.icon;
                    slot.appendChild(iconSpan);
                }
                
                // 物品数量（右下角显示）
                const countSpan = document.createElement('span');
                countSpan.className = 'item-count';
                countSpan.textContent = `x${slotData.count}`;
                slot.appendChild(countSpan);
                
                // 添加点击事件
                slot.addEventListener('click', (e) => {
                    e.stopPropagation();  // 阻止事件冒泡
                    handleInventorySlotClick(slotData.itemId, slot, e);
                });
            }
        }
        
        inventoryBar.appendChild(slot);
    }
}

// 处理物品栏格子点击（修改版）
function handleInventorySlotClick(itemId, slotElement, event) {
    const itemInfo = ItemInfo[itemId];
    if (!itemInfo) return;

    const inventory = gameClass.teacher.inventory;
    const count = inventory.getItemCount(itemId);

    // 显示小弹窗
    showItemOptionPopup(itemId, count, slotElement, event);
}

// 背包交换状态
let backpackSwapState = {
    active: false,        // 是否在交换模式
    backpackSlotIndex: -1 // 待交换的背包槽位索引
};

// 渲染背包（物品栏10格 + 背包30格）
function renderBackpack() {
    if (!gameClass || !gameClass.teacher) return;

    const inventory = gameClass.teacher.inventory;
    const barGrid = document.getElementById('backpackBarGrid');
    const backpackGrid = document.getElementById('backpackGrid');
    const swapHint = document.getElementById('backpackSwapHint');

    if (!barGrid || !backpackGrid) return;

    // 清空现有内容
    barGrid.innerHTML = '';
    backpackGrid.innerHTML = '';

    // 渲染物品栏（10格，槽位0-9）
    for (let i = 0; i < 10; i++) {
        const slotIndex = i;
        const slot = document.createElement('div');
        slot.className = 'backpack-slot';
        slot.dataset.slot = slotIndex;

        const slotData = inventory.slots[slotIndex];
        if (slotData !== null) {
            const itemInfo = ItemInfo[slotData.itemId];
            if (itemInfo) {
                slot.classList.add('has-item');
                slot.dataset.tooltip = itemInfo.name;

                if (itemInfo.icon.startsWith('./')) {
                    const iconImg = document.createElement('img');
                    iconImg.className = 'item-icon';
                    iconImg.src = itemInfo.icon;
                    iconImg.alt = itemInfo.name;
                    slot.appendChild(iconImg);
                } else {
                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'item-icon';
                    iconSpan.textContent = itemInfo.icon;
                    slot.appendChild(iconSpan);
                }

                const countSpan = document.createElement('span');
                countSpan.className = 'item-count';
                countSpan.textContent = `x${slotData.count}`;
                slot.appendChild(countSpan);

                // 交换模式下点击物品栏格子
                if (backpackSwapState.active) {
                    slot.classList.add('swap-target');
                    slot.addEventListener('click', (e) => {
                        e.stopPropagation();
                        handleBackpackBarSlotClickForSwap(slotIndex);
                    });
                } else {
                    // 正常模式下点击物品栏物品
                    slot.addEventListener('click', (e) => {
                        e.stopPropagation();
                        handleBackpackSlotClick(slotData.itemId, slot, e);
                    });
                }
            }
        } else if (backpackSwapState.active) {
            // 空位也可点击（移至空位）
            slot.classList.add('swap-target');
            slot.addEventListener('click', (e) => {
                e.stopPropagation();
                handleBackpackBarSlotClickForSwap(slotIndex);
            });
        }

        barGrid.appendChild(slot);
    }

    // 渲染背包（30格，槽位10-39）
    for (let i = 0; i < 30; i++) {
        const slotIndex = 10 + i;
        const slot = document.createElement('div');
        slot.className = 'backpack-slot';
        slot.dataset.slot = slotIndex;

        const slotData = inventory.slots[slotIndex];
        if (slotData !== null) {
            const itemInfo = ItemInfo[slotData.itemId];
            if (itemInfo) {
                slot.classList.add('has-item');
                slot.dataset.tooltip = itemInfo.name;

                if (itemInfo.icon.startsWith('./')) {
                    const iconImg = document.createElement('img');
                    iconImg.className = 'item-icon';
                    iconImg.src = itemInfo.icon;
                    iconImg.alt = itemInfo.name;
                    slot.appendChild(iconImg);
                } else {
                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'item-icon';
                    iconSpan.textContent = itemInfo.icon;
                    slot.appendChild(iconSpan);
                }

                const countSpan = document.createElement('span');
                countSpan.className = 'item-count';
                countSpan.textContent = `x${slotData.count}`;
                slot.appendChild(countSpan);

                // 交换模式下高亮源物品
                if (backpackSwapState.active && slotIndex === backpackSwapState.backpackSlotIndex) {
                    slot.classList.add('swap-source');
                }

                // 点击事件
                slot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (backpackSwapState.active) {
                        // 交换模式下点击其他物品，切换源物品
                        if (slotIndex !== backpackSwapState.backpackSlotIndex) {
                            backpackSwapState.backpackSlotIndex = slotIndex;
                            renderBackpack(); // 重新渲染高亮
                        }
                    } else {
                        handleBackpackSlotClick(slotData.itemId, slot, e);
                    }
                });
            }
        }

        backpackGrid.appendChild(slot);
    }

    // 更新交换提示
    if (swapHint) {
        if (backpackSwapState.active) {
            swapHint.textContent = '请点击物品栏中的格子进行交换，或点击其他地方取消';
            swapHint.classList.add('show');
        } else {
            swapHint.classList.remove('show');
        }
    }
}

// 处理背包格子点击
function handleBackpackSlotClick(itemId, slotElement, event) {
    const itemInfo = ItemInfo[itemId];
    if (!itemInfo) return;

    const inventory = gameClass.teacher.inventory;
    const count = inventory.getItemCount(itemId);

    // 显示小弹窗
    showItemOptionPopup(itemId, count, slotElement, event);
}

// 打开背包弹窗
function openBackpack() {
    const modal = document.getElementById('backpackModal');
    if (!modal) return;

    // 重置交换状态
    exitBackpackSwapMode();

    // 渲染背包内容
    renderBackpack();

    // 显示弹窗
    modal.classList.add('open');

    // 添加点击外部关闭的事件监听
    modal.onclick = (e) => {
        if (e.target === modal) {
            // 如果在交换模式，先退出交换模式
            if (backpackSwapState.active) {
                exitBackpackSwapMode();
            } else {
                closeBackpack();
            }
        }
    };
}

// 关闭背包弹窗
function closeBackpack() {
    const modal = document.getElementById('backpackModal');
    if (!modal) return;

    // 重置交换状态
    exitBackpackSwapMode();

    // 隐藏弹窗
    modal.classList.remove('open');
    modal.onclick = null;
}

// 显示物品选项小弹窗
function showItemOptionPopup(itemId, count, slotElement, event) {
    const popup = document.getElementById('itemOptionPopup');
    const itemInfo = ItemInfo[itemId];
    
    if (!popup || !itemInfo) return;
    
    // 设置弹窗内容
    const iconElement = document.getElementById('popupItemIcon');
    if (itemInfo.icon.startsWith('./')) {
        // 图片图标
        iconElement.innerHTML = `<img src="${itemInfo.icon}" alt="${itemInfo.name}" class="popup-item-icon-img">`;
    } else {
        // emoji图标
        iconElement.textContent = itemInfo.icon;
    }
    document.getElementById('popupItemName').textContent = itemInfo.name;
    document.getElementById('popupItemDescription').textContent = itemInfo.description;
    
    // 设置效果介绍
    const effectElement = document.getElementById('popupItemEffect');
    if (itemInfo.effectDescription) {
        effectElement.textContent = `效果：${itemInfo.effectDescription}`;
        effectElement.style.display = 'block';
    } else {
        effectElement.style.display = 'none';
    }
    
    // 定位弹窗（在物品格正下方）
    const rect = slotElement.getBoundingClientRect();
    const popupWidth = 200;  // 预估弹窗宽度
    const popupHeight = 150; // 预估弹窗高度
    
    let left = rect.left;
    let top = rect.bottom + 10;
    
    // 检查是否超出右边界
    if (left + popupWidth > window.innerWidth) {
        left = window.innerWidth - popupWidth - 10;
    }
    
    // 检查是否超出下边界
    if (top + popupHeight > window.innerHeight) {
        top = rect.top - popupHeight - 10;
    }
    
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    
    // 显示弹窗
    popup.classList.add('show');
    
    // 隐藏全局tooltip，避免遮挡弹窗
    hideGlobalTooltip();
    
    // 保存当前物品ID和触发弹窗的物品格元素
    popup.dataset.itemId = itemId;
    popup.dataset.triggerSlot = slotElement.dataset.slot;
    
    // 绑定按钮事件
    const useBtn = document.getElementById('useItemBtn');
    const moveToItemBarBtn = document.getElementById('moveToItemBarBtn');
    const discardAllBtn = document.getElementById('discardAllBtn');
    const closePopupBtn = document.getElementById('closePopupBtn');

    // 根据usable属性显示/隐藏使用按钮
    if (itemInfo.usable === false) {
        useBtn.style.display = 'none';
    } else {
        useBtn.style.display = 'block';
    }

    // 根据槽位索引显示/隐藏"移至物品栏"按钮（仅背包槽位显示）
    const slotIndex = parseInt(slotElement.dataset.slot);
    if (slotIndex >= 10) {
        moveToItemBarBtn.style.display = 'block';
    } else {
        moveToItemBarBtn.style.display = 'none';
    }

    // 移除旧的事件监听器
    useBtn.onclick = null;
    moveToItemBarBtn.onclick = null;
    discardAllBtn.onclick = null;
    closePopupBtn.onclick = null;

    // 添加新的事件监听器
    useBtn.onclick = () => {
        useItemFromPopup(itemId);
        hideItemOptionPopup();
    };

    moveToItemBarBtn.onclick = () => {
        moveToItemBar(slotIndex);
        hideItemOptionPopup();
    };

    discardAllBtn.onclick = () => {
        discardAllItems(itemId);
        hideItemOptionPopup();
    };

    closePopupBtn.onclick = () => {
        hideItemOptionPopup();
    };
}

// 隐藏物品选项小弹窗
function hideItemOptionPopup() {
    const popup = document.getElementById('itemOptionPopup');
    if (popup) {
        // 保存触发弹窗的物品格索引
        const triggerSlot = popup.dataset.triggerSlot;
        popup.classList.remove('show');

        // 如果鼠标还在物品格上，重新显示tooltip
        if (triggerSlot) {
            const slotElement = document.querySelector(`.inventory-slot[data-slot="${triggerSlot}"]`);
            if (slotElement && slotElement.matches(':hover')) {
                const tooltip = slotElement.dataset.tooltip;
                if (tooltip) {
                    showGlobalTooltip(slotElement, tooltip);
                }
            }
        }
    }
}

// 移动物品到物品栏
function moveToItemBar(slotIndex) {
    if (!gameClass || !gameClass.teacher) {
        showToast('error', '操作失败', '游戏未初始化');
        return;
    }

    const inventory = gameClass.teacher.inventory;

    // 检查物品栏是否有空位
    let emptySlotIndex = -1;
    for (let i = 0; i < 10; i++) {
        if (inventory.slots[i] === null) {
            emptySlotIndex = i;
            break;
        }
    }

    if (emptySlotIndex !== -1) {
        // 有空位，直接移动
        const result = inventory.moveToBar(slotIndex, emptySlotIndex);
        if (result.success) {
            showToast('success', '移动成功', result.message);
            renderInventory();
            renderBackpack();
        } else {
            showToast('error', '移动失败', result.message);
        }
    } else {
        // 物品栏已满，进入交换模式（在背包界面内高亮物品栏）
        backpackSwapState.active = true;
        backpackSwapState.backpackSlotIndex = slotIndex;
        hideItemOptionPopup();
        renderBackpack();
    }
}

// 交换模式下点击物品栏格子
function handleBackpackBarSlotClickForSwap(barSlotIndex) {
    if (!gameClass || !gameClass.teacher) {
        showToast('error', '操作失败', '游戏未初始化');
        exitBackpackSwapMode();
        return;
    }

    const inventory = gameClass.teacher.inventory;

    // 交换槽位
    const result = inventory.swapSlots(barSlotIndex, backpackSwapState.backpackSlotIndex);

    if (result.success) {
        showToast('success', '交换成功', result.message);
        renderInventory();
        renderBackpack();
    } else {
        showToast('error', '交换失败', result.message);
    }

    exitBackpackSwapMode();
}

// 退出交换模式
function exitBackpackSwapMode() {
    backpackSwapState.active = false;
    backpackSwapState.backpackSlotIndex = -1;
    renderBackpack();
}

// 显示物品栏选择提示
function showItemBarSelectionPrompt(backpackSlotIndex) {
    const prompt = document.getElementById('itemBarSelectionPrompt');
    if (!prompt) return;

    const inventory = gameClass.teacher.inventory;
    const grid = document.getElementById('selectionPromptGrid');
    if (!grid) return;

    // 清空现有内容
    grid.innerHTML = '';

    // 保存背包槽位索引
    prompt.dataset.backpackSlotIndex = backpackSlotIndex;

    // 渲染10个物品栏槽位
    for (let i = 0; i < 10; i++) {
        const slot = document.createElement('div');
        slot.className = 'selection-prompt-slot';
        slot.dataset.slot = i;

        const slotData = inventory.slots[i];
        if (slotData !== null) {
            const itemInfo = ItemInfo[slotData.itemId];
            if (itemInfo) {
                slot.classList.add('has-item');

                // 物品图标
                if (itemInfo.icon.startsWith('./')) {
                    const iconImg = document.createElement('img');
                    iconImg.className = 'item-icon';
                    iconImg.src = itemInfo.icon;
                    iconImg.alt = itemInfo.name;
                    slot.appendChild(iconImg);
                } else {
                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'item-icon';
                    iconSpan.textContent = itemInfo.icon;
                    slot.appendChild(iconSpan);
                }

                // 物品数量
                const countSpan = document.createElement('span');
                countSpan.className = 'item-count';
                countSpan.textContent = `x${slotData.count}`;
                slot.appendChild(countSpan);
            }
        }

        // 添加点击事件
        slot.addEventListener('click', () => {
            handleItemBarSelectionClick(i, backpackSlotIndex);
        });

        grid.appendChild(slot);
    }

    // 显示提示
    prompt.style.display = 'flex';
}

// 处理物品栏槽位点击
function handleItemBarSelectionClick(barSlotIndex, backpackSlotIndex) {
    if (!gameClass || !gameClass.teacher) {
        showToast('error', '操作失败', '游戏未初始化');
        hideItemBarSelectionPrompt();
        return;
    }

    const inventory = gameClass.teacher.inventory;

    // 交换槽位
    const result = inventory.swapSlots(barSlotIndex, backpackSlotIndex);

    if (result.success) {
        showToast('success', '交换成功', result.message);
        renderInventory();
        renderBackpack();
    } else {
        showToast('error', '交换失败', result.message);
    }

    hideItemBarSelectionPrompt();
}

// 隐藏物品栏选择提示
function hideItemBarSelectionPrompt() {
    const prompt = document.getElementById('itemBarSelectionPrompt');
    if (prompt) {
        prompt.style.display = 'none';
    }
}

// 从弹窗使用物品
function useItemFromPopup(itemId) {
    if (!gameClass || !gameClass.teacher) {
        showNotification('error', '使用失败', '游戏未初始化');
        return;
    }
    
    const inventory = gameClass.teacher.inventory;
    const result = inventory.useItem(itemId);
    
    if (result.success) {
        showToast('success', '使用成功', result.message);
        renderAll();
        renderBackpack();
    } else {
        showToast('error', '使用失败', result.message);
    }
}

// 从弹窗丢弃所有物品
function discardAllItems(itemId) {
    const inventory = gameClass.teacher.inventory;
    const count = inventory.getItemCount(itemId);
    
    if (count > 0) {
        const result = inventory.removeItem(itemId, count);
        
        if (result.success) {
            showToast('success', '丢弃成功', `已丢弃${count}件物品`);
            renderInventory();
            renderBackpack();
        } else {
            showToast('error', '丢弃失败', result.message);
        }
    }
}

// 显示Toast消息
function showToast(type, title, message, duration = 3000) {
    // 如果已有Toast消息，先移除
    if (currentToast) {
        removeToast(false);
    }
    
    // 创建Toast元素
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // 设置图标
    let icon;
    switch (type) {
        case 'success':
            icon = '✓';
            break;
        case 'error':
            icon = '✗';
            break;
        case 'warning':
            icon = '⚠';
            break;
        default:
            icon = 'ℹ';
    }
    
    // 设置内容
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    // 添加到容器
    const container = document.getElementById('toastContainer');
    if (!container) {
        // 如果容器不存在，创建容器
        const newContainer = document.createElement('div');
        newContainer.id = 'toastContainer';
        newContainer.className = 'toast-container';
        document.body.appendChild(newContainer);
    }
    
    document.getElementById('toastContainer').appendChild(toast);
    
    // 点击Toast直接关闭
    toast.addEventListener('click', () => {
        removeToast(true);
    });
    
    // 保存当前Toast引用
    currentToast = toast;
    
    // 设置自动消失定时器
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    
    toastTimeout = setTimeout(() => {
        removeToast(true);
    }, duration);
}

// 移除Toast消息
function removeToast(animate = true) {
    if (!currentToast) return;
    
    if (animate) {
        // 添加淡出动画
        currentToast.classList.add('fade-out');
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (currentToast && currentToast.parentNode) {
                currentToast.parentNode.removeChild(currentToast);
            }
            currentToast = null;
        }, 300);
    } else {
        // 立即移除
        if (currentToast && currentToast.parentNode) {
            currentToast.parentNode.removeChild(currentToast);
        }
        currentToast = null;
    }
    
    // 清除定时器
    if (toastTimeout) {
        clearTimeout(toastTimeout);
        toastTimeout = null;
    }
}

// 显示食堂弹窗
function showCanteenModal() {
    const modal = document.getElementById('canteenModal');
    modal.style.display = 'flex';
    renderCanteenItems();
}

// 关闭食堂弹窗
function closeCanteenModal() {
    const modal = document.getElementById('canteenModal');
    modal.style.display = 'none';
}

// 渲染食堂物品列表
function renderCanteenItems() {
    const container = document.getElementById('canteenItems');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 更新工资显示
    const salaryElement = document.getElementById('canteenSalary');
    if (salaryElement && gameClass && gameClass.teacher) {
        salaryElement.textContent = `当前工资：${gameClass.teacher.salary}元`;
    }
    
// 获取当前楼层的物品
    const floorItems = CanteenItems[currentCanteenFloor];
    if (!floorItems) return;

    // 自定义显示顺序
    const displayOrder = [Item.ICE_TEA, Item.ONE_YUAN_ICE_TEA, Item.CHA_CUI, Item.ONE_YUAN_CHA_CUI, Item.SIGMA, Item.YIJIN_JING, Item.ANGRY, Item.CHEERS, Item.CLAY_FIGURE, Item.MP5, Item.MP7];
    const sortedEntries = Object.entries(floorItems).sort((a, b) => {
        const orderA = displayOrder.indexOf(parseInt(a[0]));
        const orderB = displayOrder.indexOf(parseInt(b[0]));
        return orderA - orderB;
    });

    for (const [itemId, config] of sortedEntries) {
        if (!config.available) continue;
        
        const itemInfo = ItemInfo[parseInt(itemId)];
        if (!itemInfo) continue;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'canteen-item';
        
        // 检查资金是否足够
        const canAfford = gameClass && gameClass.teacher && gameClass.teacher.salary >= config.price;
        
        // 物品图标
        let iconHtml;
        if (itemInfo.icon.startsWith('./')) {
            iconHtml = `<img src="${itemInfo.icon}" alt="${itemInfo.name}">`;
        } else {
            iconHtml = itemInfo.icon;
        }
        
        itemElement.innerHTML = `
            <div class="canteen-item-icon">${iconHtml}</div>
            <div class="canteen-item-info">
                <div class="canteen-item-name">${itemInfo.name}</div>
                <div class="canteen-item-description">${itemInfo.description}</div>
                ${itemInfo.effectDescription ? `<div class="canteen-item-effect">效果：${itemInfo.effectDescription}</div>` : ''}
                <div class="canteen-item-price">${config.price}元</div>
            </div>
            <button class="canteen-item-buy-btn" ${!canAfford ? 'disabled' : ''}>购买</button>
        `;
        
        // 绑定购买按钮事件
        const buyBtn = itemElement.querySelector('.canteen-item-buy-btn');
        buyBtn.onclick = () => {
            buyItem(parseInt(itemId));
        };
        
        container.appendChild(itemElement);
    }
}

// 购买物品
function buyItem(itemId) {
    if (!gameClass || !gameClass.teacher) {
        showToast('error', '购买失败', '游戏未初始化');
        return;
    }
    
    // 获取当前楼层的物品配置
    const floorItems = CanteenItems[currentCanteenFloor];
    if (!floorItems) {
        showToast('error', '购买失败', '楼层配置不存在');
        return;
    }
    
    const config = floorItems[itemId];
    if (!config || !config.available) {
        showToast('error', '购买失败', '该物品不可购买');
        return;
    }
    
    // 检查资金
    if (gameClass.teacher.salary < config.price) {
        showToast('error', '购买失败', `资金不足！需要${config.price}元，当前工资：${gameClass.teacher.salary}元`);
        return;
    }
    
    // 检查互斥物品
    const inventory = gameClass.teacher.inventory;
    if (itemId === Item.CHEERS && inventory.hasItem(Item.ANGRY)) {
        showToast('error', '购买失败', '与暴怒互斥，无法同时持有！');
        return;
    }
    if (itemId === Item.ANGRY && inventory.hasItem(Item.CHEERS)) {
        showToast('error', '购买失败', '与cheers！互斥，无法同时持有！');
        return;
    }
    
    // 检查物品栏是否已满
    const addResult = inventory.addItem(itemId);
    if (!addResult.success) {
        showToast('error', '购买失败', addResult.message);
        return;
    }
    
    // 扣除资金
    gameClass.teacher.salary -= config.price;
    
    // 记录日志
    const itemInfo = ItemInfo[itemId];
    gameClass.log(`🛒 在食堂${currentCanteenFloor}楼购买了${itemInfo.name}！资金-${config.price}元`, 'highlight');
    
    // 显示Toast通知
    showToast('success', '购买成功', `购买了${itemInfo.name}！资金-${config.price}元`);
    
    // 刷新界面
    renderAll();
    
    // 刷新食堂物品列表（更新按钮状态）
    renderCanteenItems();
}

function getStatusName(status) {
    switch (status) {
        case Status.Normal:
            return '正常';
        case Status.Leave:
            return '请假';
        case Status.Train:
            return '集训';
        case Status.Dead:
            return '已劝退';
        default:
            return '未知';
    }
}

function getDeathReasonText(reason) {
const reasonText = {
    'energy': '因精力耗尽而不幸离世',
    'killed': '被你击毙',
    'expelled': '被劝退',
    'sold': '积极参与三角贸易',
    'event': '被天花板掉下来砸死',
    'smoking': '在政教处门口抽烟',
    'speech': '吃子弹了'
};
    return reasonText[reason] || '不幸离世';
}

function getSubjectName(subject) {
    // subject可能是枚举键名（字符串，如"Chinese"）或枚举值（数字，如1）
    if (typeof subject === 'string') {
        // 如果是字符串，检查是否是Subject枚举的键
        switch (subject) {
            case 'Chinese':
                return '语文';
            case 'Maths':
                return '数学';
            case 'English':
                return '英语';
            case 'Physics':
                return '物理';
            case 'Chemistry':
                return '化学';
            case 'Biology':
                return '生物';
            case 'Politics':
                return '政治';
            case 'History':
                return '历史';
            case 'Geography':
                return '地理';
            default:
                console.warn('Unknown subject key:', subject);
                return '未知';
        }
    } else {
        // 如果是数字，使用枚举值
        const subjectValue = parseInt(subject);
        switch (subjectValue) {
            case Subject.Chinese:
                return '语文';
            case Subject.Maths:
                return '数学';
            case Subject.English:
                return '英语';
            case Subject.Physics:
                return '物理';
            case Subject.Chemistry:
                return '化学';
            case Subject.Biology:
                return '生物';
            case Subject.Politics:
                return '政治';
            case Subject.History:
                return '历史';
            case Subject.Geography:
                return '地理';
            default:
                console.warn('Unknown subject value:', subject, 'Type:', typeof subject);
                return '未知';
        }
    }
}

function getRelationName(rel) {
    switch (rel) {
        case Relations.Normal:
            return '普通';
        case Relations.Better:
            return '较好';
        case Relations.Friend:
            return '朋友';
        case Relations.Loving:
            return '恋人';
        case Relations.Disliking:
            return '不喜欢';
        case Relations.Hating:
            return '讨厌';
        case Relations.Self:
            return '自己';
        default:
            return '未知';
    }
}

function getRelationClass(rel) {
    switch (rel) {
        case Relations.Normal:
            return 'normal';
        case Relations.Better:
            return 'better';
        case Relations.Friend:
            return 'friend';
        case Relations.Loving:
            return 'loving';
        case Relations.Disliking:
            return 'disliking';
        case Relations.Hating:
            return 'hating';
        case Relations.Self:
            return 'self';
        default:
            return 'normal';
    }
}

function getStatusClass(status) {
    switch (status) {
        case Status.Normal:
            return 'normal';
        case Status.Leave:
            return 'leave';
        case Status.Train:
            return 'train';
        case Status.Dead:
            return 'dead';
        default:
            return 'normal';
    }
}

function getCompetitionClass(competition) {
    switch (competition) {
        case Competition.MO:
            return 'math';
        case Competition.PhO:
            return 'physics';
        case Competition.ChO:
            return 'chemistry';
        case Competition.BO:
            return 'biology';
        case Competition.OI:
            return 'informatics';
        default:
            return 'none';
    }
}

function updateButtonStates() {
    if (!gameClass) return;

    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (btn.disabled !== undefined) {
            btn.disabled = false;
        }
    });

    // 更新需要选中学生的按钮状态
    const hasSelectedStudent = selectedStudentIndex !== null;
    expelBtn.disabled = !hasSelectedStudent;
            counselBtn.disabled = !hasSelectedStudent;
            treatSingleBtn.disabled = !hasSelectedStudent;
            reformBtn.disabled = !hasSelectedStudent;
            sellBtn.disabled = !hasSelectedStudent;
            swapSeatsBtn.disabled = !hasSelectedStudent;    instigateBtn.disabled = !hasSelectedStudent;
}

// ============================================================================
// 班主任死亡检测函数
// ============================================================================

/**
 * 检查班主任血量，如果归零则结束游戏并显示结算画面
 * @param {Class} gameClass - 班级实例
 */
function checkTeacherDeath(gameClass) {
    if (gameClass.teacher.health <= 0) {
        gameClass.log("\n💀 班主任血量归零！游戏结束！", 'danger');
        gameClass.ended = true;
        gameClass.failReason = '班主任血量归零';
        // 显示结算画面
        setTimeout(() => {
            showEndGameScreen();
        }, 2000);
        return true;
    }
    return false;
}

// ============================================================================
// 班级类 - 核心游戏逻辑
// ============================================================================

class Class {
    constructor(mode = GameMode.Normal, classType = ClassType.Science, studentNum = 50, characterType = null) {
        this.mode = mode;
        this.classType = classType;
        this.studentNum = studentNum;
        this.characterType = characterType;
        this.ended = false;
        this.failReason = null;

        this.students = [];
        for (let i = 1; i <= studentNum; i++) {
            this.students.push(new Student(i, this, this.mode, this.classType));
        }

        // 为简单模式分配竞赛生（仅高二）
        if (this.mode === GameMode.Easy) {
            this._assignCompetitionStudents();
        }

        for (let s1 of this.students) {
            for (let s2 of this.students) {
                if (s1.index !== s2.index) {
                    s1.relation[s2.index] = Relations.Normal;
                    s2.relation[s1.index] = Relations.Normal;
                }
            }
        }

        // 应用角色特质：略微提升所有学生在角色所教科目的成绩
        if (characterType && CharacterData[characterType]) {
            const characterSubject = CharacterData[characterType].subject;
            const subjectName = this._getSubjectName(characterSubject);
            
            for (let student of this.students) {
                if (characterSubject in student.learnCap) {
                    // 略微提升角色所教科目的学习能力（提升10%）
                    student.learnCap[characterSubject] = Math.min(LEARN_CAP_MAX, student.learnCap[characterSubject] * 1.1);
                }
            }
        }

        this._initializeSeats();

        this.contests = {
            [ContestType.Mid]: [],
            [ContestType.End]: [],
            [ContestType.Final]: [TOTAL_SEMESTERS * SEMESTER_LENGTH]
        };

        for (let i = 0; i < TOTAL_SEMESTERS; i++) {
            this.contests[ContestType.Mid].push(i * SEMESTER_LENGTH + SEMESTER_LENGTH / 2);
            if (i < TOTAL_SEMESTERS - 1) {
                this.contests[ContestType.End].push((i + 1) * SEMESTER_LENGTH);
            }
        }

        this.contestsHistory = [];
        this.week = 0;
        this.studentAliveNum = this.studentNum;
        this._attendanceLastDeadCount = 0;
        this.loan = { amount: 0, totalOwed: 0, weekBorrowed: 0, dueWeek: 0, weeklyRate: 0, duration: 0 };

        this.teacher = new Teacher(characterType);

        this.pendingLeaveRequests = [];
        this.activeLeaves = {};

        this.universityDatabase = getUniversityDatabase();
        this.gaokaoResults = [];

        this.firstExamAverage = null;

        this.logCallback = null;
    }

    setLogCallback(callback) {
        this.logCallback = callback;
    }

    log(message, type = 'normal') {
        if (this.logCallback) {
            this.logCallback(message, type);
        }
    }

    _initializeSeats() {
        // 根据学生人数计算需要的行列数
        const totalSeats = this.studentNum;
        const cols = SEAT_COLUMNS;
        const rows = Math.ceil(totalSeats / cols);

        this.seats = [];
        for (let i = 0; i < cols; i++) {
            this.seats.push(new Array(rows).fill(null));
        }

        // 随机安排活的学生
        const aliveStudents = this.students.filter(s => s.status !== Status.Dead);
        const shuffled = [...aliveStudents].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < shuffled.length; i++) {
            const colIdx = i % cols;
            const rowIdx = Math.floor(i / cols);
            
            if (rowIdx < rows) {
                shuffled[i].seatCol = colIdx + 1;
                shuffled[i].seatRow = rowIdx + 1;
                this.seats[colIdx][rowIdx] = shuffled[i];
            }
        }
    }

    _recalculateSeats() {
        // 清空座位表
        for (let col = 0; col < this.seats.length; col++) {
            for (let row = 0; row < this.seats[col].length; row++) {
                this.seats[col][row] = null;
            }
        }

        // 根据所有学生的seatCol和seatRow重新构建座位表
        for (let student of this.students) {
            // 跳过死亡的学生
            if (student.status === Status.Dead) {
                continue;
            }

            // 检查座位是否在有效范围内
            const col = student.seatCol - 1;  // 转换为0-based索引
            const row = student.seatRow - 1;

            if (col >= 0 && col < this.seats.length && 
                row >= 0 && row < this.seats[col].length) {
                this.seats[col][row] = student;
            }
        }
    }

    _assignCompetitionStudents() {
        // 计算竞赛生数量（20%）
        const competitionStudentCount = Math.floor(this.studentNum * COMPETITION_STUDENT_RATIO);
        
        // 按IQ从高到低排序学生
        const sortedByIQ = [...this.students].sort((a, b) => b.IQ - a.IQ);
        
        // 选择前N名学生作为竞赛生
        const competitionStudents = sortedByIQ.slice(0, competitionStudentCount);
        
        // 为每个竞赛生分配竞赛科目（五科平均分配）
        const competitions = Object.values(Competition);
        const studentsPerCompetition = Math.floor(competitionStudentCount / competitions.length);
        
        let currentCompetitionIndex = 0;
        for (let student of competitionStudents) {
            student.competition = competitions[currentCompetitionIndex];
            currentCompetitionIndex = (currentCompetitionIndex + 1) % competitions.length;
        }
        
        this.log(`🏆 已分配 ${competitionStudentCount} 名竞赛生，分布在${competitions.length}个科目`, 'highlight');
    }

    _getStudentByIndex(index) {
        if (index >= 1 && index <= this.studentNum) {
            return this.students[index - 1];
        }
        return null;
    }

    _hasLover(student) {
        if (!student.relation) return false;
        for (let relation of Object.values(student.relation)) {
            if (relation === Relations.Loving) {
                return true;
            }
        }
        return false;
    }

    _hasBeenDeadBefore(student) {
        return student.hasBeenDead === true;
    }
    
    _checkTraining() {
        if (this.mode !== GameMode.Easy) return;
        
        for (let student of this.students) {
            // 检查集训是否结束
            if (student.inTraining && this.week >= student.trainingEndWeek) {
                student.inTraining = false;
                student.trainingEndWeek = null;
                student.status = Status.Normal;
                this.log(`🏋️ 学生 ${student.name} 集训结束，恢复正常状态！`, 'highlight');
            }
        }
    }
    
    _processCompetition() {
        if (this.mode !== GameMode.Easy) return;
        
        const weekCompetitions = COMPETITION_SCHEDULE[this.week];
        if (!weekCompetitions || weekCompetitions.length === 0) return;
        
        this.log(`\n🏆 第${this.week}周竞赛日！`, 'highlight');
        
        for (let compInfo of weekCompetitions) {
            const competition = compInfo.competition;
            const stage = compInfo.stage;
            
            // 找到参加该科目竞赛的学生
            const competitionStudents = this.students.filter(s => 
                s.competition === competition && s.status !== Status.Dead && 
                !(s.index in this.activeLeaves) && !s.admittedEarly
            );
            
            if (competitionStudents.length === 0) continue;
            
            const compName = this._getCompetitionName(competition);
            const stageName = stage === CompetitionStage.League ? '联赛' : '国赛';
            
            this.log(`   ${compName} ${stageName} - ${competitionStudents.length}人参赛`);
            
            for (let student of competitionStudents) {
                if (stage === CompetitionStage.League) {
                    // 联赛：40%进入省队（准备国赛）
                    if (Math.random() < COMPETITION_LEAGUE_TO_PROVINCIAL_RATE) {
                        this.log(`      ✨ ${student.name} 晋升省队！`, 'highlight');
                        student.competitionStage = CompetitionStage.National;
                    } else {
                        this.log(`      ${student.name} 未进入省队`);
                    }
                } else {
                    // 国赛：颁奖
                    const rand = Math.random();
                    if (rand < COMPETITION_NATIONAL_GOLD_RATE) {
                        student.competitionAward = CompetitionAward.Gold;
                        this._grantEarlyAdmission(student, CompetitionAward.Gold);
                        this.log(`      🥇 ${student.name} 获得${compName}国赛金牌！`, 'highlight');
                    } else if (rand < COMPETITION_NATIONAL_GOLD_RATE + COMPETITION_NATIONAL_SILVER_RATE) {
                        student.competitionAward = CompetitionAward.Silver;
                        this._grantEarlyAdmission(student, CompetitionAward.Silver);
                        this.log(`      🥈 ${student.name} 获得${compName}国赛银牌！`, 'highlight');
                    } else if (rand < COMPETITION_NATIONAL_GOLD_RATE + COMPETITION_NATIONAL_SILVER_RATE + COMPETITION_NATIONAL_BRONZE_RATE) {
                        student.competitionAward = CompetitionAward.Bronze;
                        this._grantEarlyAdmission(student, CompetitionAward.Bronze);
                        this.log(`      🥉 ${student.name} 获得${compName}国赛铜牌！`, 'highlight');
                    } else {
                        this.log(`      ${student.name} 未获奖`);
                    }
                }
            }
        }

        // 显示竞赛结果弹窗
        let resultMessage = '';
        let hasAnyResult = false;

        weekCompetitions.forEach(compInfo => {
            const competition = compInfo.competition;
            const stage = compInfo.stage;
            const competitionStudents = this.students.filter(s =>
                s.competition === competition && s.status !== Status.Dead &&
                !(s.index in this.activeLeaves) && !s.admittedEarly
            );

            if (competitionStudents.length > 0) {
                const compName = this._getCompetitionName(competition);
                const stageName = stage === CompetitionStage.League ? '联赛' : '国赛';

                if (stage === CompetitionStage.League) {
                    // 联赛：显示晋级的学生
                    const advancedStudents = competitionStudents.filter(s => s.competitionStage === CompetitionStage.National);
                    if (advancedStudents.length > 0) {
                        hasAnyResult = true;
                        const names = advancedStudents.map(s => s.name).join('、');
                        resultMessage += `${compName}${stageName}：${names} 晋级省队\n`;
                    }
                } else {
                    // 国赛：显示获奖的学生
                    const goldStudents = competitionStudents.filter(s => s.competitionAward === CompetitionAward.Gold);
                    const silverStudents = competitionStudents.filter(s => s.competitionAward === CompetitionAward.Silver);
                    const bronzeStudents = competitionStudents.filter(s => s.competitionAward === CompetitionAward.Bronze);

                    if (goldStudents.length > 0 || silverStudents.length > 0 || bronzeStudents.length > 0) {
                        hasAnyResult = true;
                        resultMessage += `${compName}${stageName}：\n`;
                        if (goldStudents.length > 0) {
                            resultMessage += `  🥇 ${goldStudents.map(s => s.name).join('、')}\n`;
                        }
                        if (silverStudents.length > 0) {
                            resultMessage += `  🥈 ${silverStudents.map(s => s.name).join('、')}\n`;
                        }
                        if (bronzeStudents.length > 0) {
                            resultMessage += `  🥉 ${bronzeStudents.map(s => s.name).join('、')}\n`;
                        }
                    }
                }
            }
        });

        // 只有当有人晋级或获奖时才显示弹窗
        if (hasAnyResult) {
            showExamResultModal('warning', `第${this.week}周竞赛结束`, resultMessage.trim());
        }
    }
    
    _getCompetitionName(competition) {
        switch (competition) {
            case Competition.MO: return '数学';
            case Competition.PhO: return '物理';
            case Competition.ChO: return '化学';
            case Competition.BO: return '生物';
            case Competition.OI: return '信息学';
            default: return '未知';
        }
    }

    _getSubjectName(subject) {
        switch (subject) {
            case Subject.Chinese: return '语文';
            case Subject.Maths: return '数学';
            case Subject.English: return '英语';
            case Subject.Physics: return '物理';
            case Subject.Chemistry: return '化学';
            case Subject.Biology: return '生物';
            case Subject.Politics: return '政治';
            case Subject.History: return '历史';
            case Subject.Geography: return '地理';
            default: return '未知';
        }
    }
    
    _grantEarlyAdmission(student, award) {
        let university;
        
        if (award === CompetitionAward.Gold) {
            // 金牌：清华北大
            const topUniversities = this.universityDatabase.filter(u => 
                u.tier === UniversityTier.TIER_985 && 
                (u.name.includes('清华') || u.name.includes('北大'))
            );
            if (topUniversities.length > 0) {
                university = topUniversities[Math.floor(Math.random() * topUniversities.length)];
            }
        } else if (award === CompetitionAward.Silver) {
            // 银牌：其他985
            const universities = this.universityDatabase.filter(u => 
                u.tier === UniversityTier.TIER_985 && 
                !(u.name.includes('清华') || u.name.includes('北大'))
            );
            if (universities.length > 0) {
                university = universities[Math.floor(Math.random() * universities.length)];
            }
        } else if (award === CompetitionAward.Bronze) {
            // 铜牌：211或双一流
            const universities = this.universityDatabase.filter(u => 
                u.tier === UniversityTier.TIER_211 || u.tier === UniversityTier.TIER_DOUBLE_FIRST
            );
            if (universities.length > 0) {
                university = universities[Math.floor(Math.random() * universities.length)];
            }
        }
        
        if (university) {
            student.admittedEarly = university;
            this.log(`      🎓 ${student.name} 被 ${university.name} 提前录取！`, 'highlight');
        }
    }
    
    _arrangeTraining() {
        if (this.mode !== GameMode.Easy) return;
        
        // 检查未来2周是否有竞赛
        const futureWeek = this.week + COMPETITION_TRAINING_WEEKS;
        const futureCompetitions = COMPETITION_SCHEDULE[futureWeek];
        
        if (!futureCompetitions || futureCompetitions.length === 0) return;
        
        for (let compInfo of futureCompetitions) {
            const competition = compInfo.competition;
            const stage = compInfo.stage;
            
            // 只为国赛安排集训
            if (stage !== CompetitionStage.National) continue;
            
            // 找到参加该科目竞赛且在省队的学生
            const competitionStudents = this.students.filter(s => 
                s.competition === competition && 
                s.competitionStage === CompetitionStage.National &&
                s.status === Status.Normal &&
                !s.inTraining &&
                !s.admittedEarly
            );
            
            for (let student of competitionStudents) {
                student.inTraining = true;
                student.trainingEndWeek = futureWeek;
                student.status = Status.Train;
                this.log(`🏋️ ${student.name} 从下周开始集训（${COMPETITION_TRAINING_WEEKS}周）`, 'warning');
            }
        }
    }

    _getSubjectScores() {
        if (this.classType === ClassType.Science) {
            return {
                [Subject.Chinese]: 150,
                [Subject.Maths]: 150,
                [Subject.English]: 150,
                [Subject.Physics]: 100,
                [Subject.Chemistry]: 100,
                [Subject.Biology]: 100
            };
        } else {
            return {
                [Subject.Chinese]: 150,
                [Subject.Maths]: 150,
                [Subject.English]: 150,
                [Subject.Politics]: 100,
                [Subject.History]: 100,
                [Subject.Geography]: 100
            };
        }
    }

    _calculateExamScore(student, subject, baseScore) {
        if (!(subject in student.learnCap)) {
            return 0.0;
        }

        // 天赋影响：填缺考标记 - 每次考试各科均有20%概率得0分
        if (student.talents.includes(Talent.FILL_MISSING_EXAM) && Math.random() < 0.2) {
            return 0.0;
        }

        // 天赋影响：忘填名字 - 每次考试每科均有5%概率得0分
        if (student.talents.includes(Talent.FORGET_NAME) && Math.random() < 0.05) {
            return 0.0;
        }

        const basePart = student.learnCap[subject] * baseScore / 100.0;

        const enthusiasmBonus = baseScore * SCORE_WEIGHT_ENTHUSIASM * (student.enthusiasm / STUDENT_ENTHUSIASM_MAX);

        const iqBonus = baseScore * SCORE_WEIGHT_IQ * (student.IQ / 100.0);

        const energyAdj = baseScore * SCORE_WEIGHT_ENERGY * ((student.energy - 50) / 50.0);

        const fluctuation = this._gaussRandom(0, baseScore * SCORE_FLUCTUATION_STD);

        let subjectScore = basePart + enthusiasmBonus + iqBonus + energyAdj + fluctuation;
        subjectScore = Math.max(0, Math.min(baseScore, subjectScore));
        
        // 天赋影响：千里眼 - 每次考试有一科30%概率多得20分，20%概率得0分
        // 这个效果在考试后单独处理，这里只是标记
        
        return subjectScore;
    }

    _gaussRandom(mean, stdDev) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * stdDev + mean;
    }

    _processExamResults(student, totalScore, studentScores, examResults, classTotalSum, aliveCount, isFirstExam = false) {
        const prevScore = student.previousScore;
        if (prevScore !== null) {
            const scoreDiff = totalScore - prevScore;
            const scoreDiffPercent = Math.abs(scoreDiff / prevScore * 100);
            
            if (scoreDiff > 0) {
                const improvementFactor = Math.min(1.0, scoreDiff / SCORE_DIFF_THRESHOLD);
                student.scoreChangeFactor = -Math.abs(improvementFactor * SCORE_IMPROVEMENT_FACTOR);
            } else {
                const declineFactor = Math.abs(scoreDiff) / SCORE_DIFF_THRESHOLD;
                student.scoreChangeFactor = declineFactor * SCORE_DECLINE_FACTOR;
                
                // 天赋影响：爆发 - 成绩降低超10%，则积极性增加20
                if (student.talents.includes(Talent.BURST) && scoreDiffPercent > 10) {
                    student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 20);
                    this.log(`💥 学生 ${student.name} 爆发！积极性+20`, 'highlight');
                }
            }
        }

        student.previousScore = totalScore;

        if (isFirstExam && student.firstExamScore === null) {
            student.firstExamScore = totalScore;
        }

        examResults.push({
            studentIndex: student.index,
            name: student.name,
            totalScore: totalScore,
            iq: student.IQ,
            enthusiasm: student.enthusiasm,
            energy: student.energy,
            scores: this._subjectScoresToObject(studentScores)
        });

        classTotalSum += totalScore;
        aliveCount++;

        student.energy = Math.max(STUDENT_ENERGY_MIN, student.energy - STUDENT_ENERGY_EXAM_COST);

        return { classTotalSum, aliveCount };
    }

    _subjectScoresToObject(scores) {
        const result = {};
        for (let [subject, score] of Object.entries(scores)) {
            const subjectName = Object.keys(Subject).find(key => Subject[key] === parseInt(subject));
            if (subjectName) {
                result[subjectName] = Math.round(score);
            }
        }
        return result;
    }

    updateRelations() {
        for (let student1 of this.students) {
            if (student1.status === Status.Dead || student1.index in this.activeLeaves) {
                continue;
            }

            // 天赋影响：冷漠 - 与他人关系不会变化
            if (student1.talents.includes(Talent.INDIFFERENT)) {
                continue;
            }

            for (let student2 of this.students) {
                if (student1.index === student2.index) {
                    continue;
                }
                if (student2.status === Status.Dead || student2.index in this.activeLeaves) {
                    continue;
                }

                // 天赋影响：冷漠 - 不与他人交往
                if (student2.talents.includes(Talent.INDIFFERENT)) {
                    continue;
                }

                const currentRel = student1.relation[student2.index] || Relations.Normal;

                if (currentRel === Relations.Self) {
                    continue;
                }

                const charDiff = Math.abs(student1.character[0] - student2.character[0]) +
                                Math.abs(student1.character[1] - student2.character[1]);

                // 天赋影响：海王 - 大概率同时与多人恋爱
                let lovingProbDifferent = RELATION_LOVING_DIFFERENT_GENDER;
                let lovingProbSame = RELATION_LOVING_SAME_GENDER;
                
                if (student1.talents.includes(Talent.PLAYBOY) || student2.talents.includes(Talent.PLAYBOY)) {
                    lovingProbDifferent = 0.03;  // 大幅增加恋爱概率
                    lovingProbSame = 0.01;
                }

                if (charDiff < RELATION_IMPROVE_CHAR_DIFF) {
                    if (currentRel === Relations.Normal && Math.random() < RELATION_NORMAL_TO_BETTER) {
                        student1.relation[student2.index] = Relations.Better;
                        student2.relation[student1.index] = Relations.Better;
                    } else if (currentRel === Relations.Better && Math.random() < RELATION_BETTER_TO_FRIEND) {
                        student1.relation[student2.index] = Relations.Friend;
                        student2.relation[student1.index] = Relations.Friend;
                    }
                }

                // 天赋影响：热情 - 不会产生仇恨关系
                if (!(student1.talents.includes(Talent.ENTHUSIASTIC) || student2.talents.includes(Talent.ENTHUSIASTIC))) {
                    if (Math.random() < RELATION_RANDOM_HATING) {
                        student1.relation[student2.index] = Relations.Hating;
                        student2.relation[student1.index] = Relations.Hating;
                    }
                }

                // 检查两个学生是否都还没有恋人关系
                const hasLover1 = this._hasLover(student1);
                const hasLover2 = this._hasLover(student2);

                // 天赋影响：海王 - 恋人迅速变化
                if (student1.talents.includes(Talent.PLAYBOY) || student2.talents.includes(Talent.PLAYBOY)) {
                    if (currentRel === Relations.Loving && Math.random() < 0.1) {
                        // 恋人关系有10%概率变为普通
                        student1.relation[student2.index] = Relations.Normal;
                        student2.relation[student1.index] = Relations.Normal;
                    }
                }

                if (!hasLover1 && !hasLover2) {
                    if (student1.gender !== student2.gender && Math.random() < lovingProbDifferent) {
                        student1.relation[student2.index] = Relations.Loving;
                        student2.relation[student1.index] = Relations.Loving;
                    }

                    if (student1.gender === student2.gender && Math.random() < lovingProbSame) {
                        student1.relation[student2.index] = Relations.Loving;
                        student2.relation[student1.index] = Relations.Loving;
                    }
                }

                const neighbors = student1.getNeighbors();
                if (neighbors.includes(student2)) {
                    if (currentRel === Relations.Normal && Math.random() < RELATION_NEIGHBOR_FRIEND) {
                        const newRel = Math.random() < 0.5 ? Relations.Better : Relations.Friend;
                        student1.relation[student2.index] = newRel;
                        student2.relation[student1.index] = newRel;
                    } else if (currentRel === Relations.Normal && Math.random() < RELATION_NEIGHBOR_DISLIKE) {
                        // 天赋影响：热情 - 不会产生不满关系
                        if (!(student1.talents.includes(Talent.ENTHUSIASTIC) || student2.talents.includes(Talent.ENTHUSIASTIC))) {
                            student1.relation[student2.index] = Relations.Disliking;
                            student2.relation[student1.index] = Relations.Disliking;
                        }
                    }
                }
            }
        }
    }

    nextWeek() {
        // 检查是否有未处理请假
        if (this.pendingLeaveRequests.length > 0) {
            // 如果设置了自动处理，就自动处理
            if (leaveAutoHandle === 'approve') {
                // 自动同意所有请假
                const count = this.pendingLeaveRequests.length;
                for (let i = count - 1; i >= 0; i--) {
                    this.approveLeaveRequest(i, true);
                }
                this.log(`✅ 自动批准了 ${count} 个请假申请！`, 'highlight');
            } else if (leaveAutoHandle === 'reject') {
                // 自动拒绝所有请假
                const count = this.pendingLeaveRequests.length;
                for (let i = count - 1; i >= 0; i--) {
                    this.approveLeaveRequest(i, false);
                }
                this.log(`❌ 自动拒绝了 ${count} 个请假申请！`, 'warning');
            } else {
                // 手动处理模式，弹出处理界面
                this.log(`⛔ 无法进入下一周！有 ${this.pendingLeaveRequests.length} 个请假申请待处理！`, 'warning');
                return false;
            }
        }

        if (this.ended) {
            throw new Error("game is ended");
        }

        if (this.studentAliveNum === 0) {
            this.fail();
            return true;
        }

        this.week++;

        const weeksSinceLastSalary = this.week - this.teacher.lastSalaryWeek;
        if (weeksSinceLastSalary >= WEEKS_PER_MONTH) {
            let actualSalary = this.teacher.monthlySalary;
            
            // 只有魏教授（半步年级长）才不会因为学生死亡扣工资
            if (!this.teacher.noSalaryPenalty) {
                const deadStudents = this.students.filter(s => s.status === Status.Dead).length;
                const salaryPenalty = deadStudents * 250;  // 每死一个学生扣250
                actualSalary = Math.max(300, this.teacher.monthlySalary - salaryPenalty);  // 最低工资300
                
                if (salaryPenalty > 0) {
                    this.log(`💰 班主任获得月薪 ${actualSalary} RMB（因${deadStudents}名学生死亡，工资减少${salaryPenalty} RMB）`, 'warning');
                } else {
                    this.log(`💰 班主任获得月薪 ${this.teacher.monthlySalary} RMB！`, 'highlight');
                }
            } else {
                // 魏教授：学生死亡不扣工资
                const deadStudents = this.students.filter(s => s.status === Status.Dead).length;
                this.log(`💰 班主任获得月薪 ${actualSalary} RMB（魏教授特质：${deadStudents}名学生死亡未扣工资）`, 'highlight');
            }
            
            this.teacher.salary += actualSalary;
            this.teacher.lastSalaryWeek = this.week;
        }

        // 全勤奖：本周无学生减少 => 150元
        const currentDead = this.students.filter(s => s.status === Status.Dead).length;
        if (currentDead === this._attendanceLastDeadCount) {
            this.teacher.salary += 150;
            this.log('🏅 本周无学生减少，获得全勤奖 150 元！', 'highlight');
        }
        this._attendanceLastDeadCount = currentDead;

        // 贷款利息和逾期处理
        if (this.loan.amount > 0) {
            this.loan.totalOwed = Math.round(this.loan.totalOwed * (1 + this.loan.weeklyRate));
            this.log(`🏦 贷款利息 ${Math.round(this.loan.weeklyRate * 100)}%，当前欠款 ${this.loan.totalOwed} 元（截止第 ${this.loan.dueWeek} 周）`, 'warning');
            if (this.week >= this.loan.dueWeek) {
                this.log(`💀 贷款逾期！学校派人来算账了...`, 'danger');
                this.ended = true;
                this.failReason = '贷款逾期未还';
                setTimeout(() => showEndGameScreen(), 2000);
                return true;
            }
        }

        this.log(`\n📅 第${this.week}周开始`);
        this.log(`👨‍🏫 班主任工资：${this.teacher.salary}元 | 血量：${this.teacher.health} | 精力：${this.teacher.energy}`);
        this.log(`📝 待处理请假：${this.pendingLeaveRequests.length} | 正在请假：${Object.keys(this.activeLeaves).length}`);

        if (this.teacher.energy < TEACHER_ENERGY_WARNING) {
            this.teacher.health -= TEACHER_HEALTH_EXAM_COST;
            this.log(`⚠️ 班主任精力不足${TEACHER_ENERGY_WARNING}，血量-${TEACHER_HEALTH_EXAM_COST}！当前血量：${this.teacher.health}`, 'warning');
        }

        if (this.teacher.health <= 0) {
            this.log(`\n💀 班主任血量归零！游戏结束！`, 'danger');
            this.ended = true;
            this.failReason = '班主任血量归零';
            // 显示结算画面
            setTimeout(() => {
                showEndGameScreen();
            }, 2000);
            return true;
        }

        // 检查学生死亡率是否超过35%
        const deadRate = (this.students.filter(s => s.status === Status.Dead).length / this.students.length);
        if (deadRate > 0.35) {
            this.log(`\n💀 学生死亡率超过35%！游戏结束！`, 'danger');
            this.ended = true;
            this.failReason = '学生死亡率超过35%';
            // 显示结算画面
            setTimeout(() => {
                showEndGameScreen();
            }, 2000);
            return true;
        }

        this.teacher.recoverEnergy();
        this.log(`🔄 班主任精力恢复至 ${TEACHER_ENERGY_DEFAULT}`);

        // 检查是否有林黛玉天赋的学生，如果有则增加请假触发概率
        // 获取所有正常状态的学生
        const normalStudents = this.students.filter(s =>
            s.status === Status.Normal && !(s.index in this.activeLeaves));

        if (normalStudents.length > 0) {
            // ===== 处理林黛玉天赋学生的请假（独立逻辑，不影响其他学生） =====
            const linDaiyuStudents = normalStudents.filter(s => 
                s.talents.includes(Talent.LIN_DAIYU) && 
                !s.talents.includes(Talent.IRON_MAN)
            );
            
            // 林黛玉天赋的学生有60%的概率申请请假
            for (let linDaiyuStudent of linDaiyuStudents) {
                if (Math.random() < 0.6) {
                    const duration = Math.floor(Math.random() * (LEAVE_DURATION_MAX - LEAVE_DURATION_MIN + 1)) + LEAVE_DURATION_MIN;
                    const req = new LeaveRequest(linDaiyuStudent, duration);
                    req.requestedWeek = this.week;
                    this.pendingLeaveRequests.push(req);
                    this.log(`📝 学生 ${linDaiyuStudent.name} [林黛玉天赋] 申请请假 ${duration} 周！理由：${req.reason}（需本周处理）`, 'warning');
                }
            }
            
            // ===== 处理普通学生的请假（独立逻辑，不受林黛玉影响） =====
            const normalStudentsWithoutLinDaiyu = normalStudents.filter(s => 
                !s.talents.includes(Talent.LIN_DAIYU) && 
                !s.talents.includes(Talent.IRON_MAN)
            );
            
            if (normalStudentsWithoutLinDaiyu.length > 0 && Math.random() < LEAVE_REQUEST_PROB) {
                const numApplicants = Math.min(
                    LEAVE_REQUEST_MAX_STUDENTS,
                    normalStudentsWithoutLinDaiyu.length);

                const applicants = normalStudentsWithoutLinDaiyu
                    .sort(() => Math.random() - 0.5)
                    .slice(0, numApplicants);

                for (let student of applicants) {
                    const duration = Math.floor(Math.random() * (LEAVE_DURATION_MAX - LEAVE_DURATION_MIN + 1)) + LEAVE_DURATION_MIN;
                    const req = new LeaveRequest(student, duration);
                    req.requestedWeek = this.week;
                    this.pendingLeaveRequests.push(req);
                    this.log(`📝 学生 ${student.name} 申请请假 ${duration} 周！理由：${req.reason}（需本周处理）`, 'warning');
                }
            }
        }

        const expiredLeaves = [];
        for (let [idx, endWeek] of Object.entries(this.activeLeaves)) {
            if (this.week >= endWeek) {
                const student = this._getStudentByIndex(parseInt(idx));
                if (student && student.status === Status.Leave) {
                    student.status = Status.Normal;
                    student.leaveStartWeek = null;
                    student.leaveEndWeek = null;
                    expiredLeaves.push(parseInt(idx));
                    this.log(`✅ 学生 ${student.name} 请假结束，恢复正常状态！`, 'highlight');
                }
            }
        }

        for (let idx of expiredLeaves) {
            delete this.activeLeaves[idx];
        }

        for (let student of this.students) {
            if (student.status === Status.Dead) {
                continue;
            }

            if (student.index in this.activeLeaves) {
                student.enthusiasm = Math.max(STUDENT_ENTHUSIASM_MIN,
                    student.enthusiasm - STUDENT_ENTHUSIASM_DECAY_LEAVE);
            } else {
                student.updateWeekly();
            }
        }

        this.updateRelations();

        // 秦老师特质：每回合30%概率复活一个精力归0的学生
        if (this.teacher.reviveChance > 0 && Math.random() < this.teacher.reviveChance) {
            // 找到所有精力归零的学生
            const deadByEnergy = this.students.filter(s => s.status === Status.Dead && s.energy <= 0);
            
            if (deadByEnergy.length > 0) {
                // 随机选择一个学生复活
                const revivedStudent = deadByEnergy[Math.floor(Math.random() * deadByEnergy.length)];
                revivedStudent.status = Status.Normal;
                revivedStudent.energy = 70;
                this.studentAliveNum++;
                
                this.log(`✨ 秦老师使用【装糖阴他们一手】！学生 ${revivedStudent.name} 被复活，精力恢复至70！`, 'highlight');
                
                // 添加弹窗提示
                if (typeof showNotification === 'function') {
                    showNotification('success', '奇迹复活！', `秦老师使用【装糖阴他们一手】！学生 ${revivedStudent.name} 被复活，精力恢复至70！`);
                }
                
                // 重新计算座位表
                this._recalculateSeats();
            }
        }

        // 检查是否有学生因精力归零而死亡，如果有则重新计算座位表
        const currentAliveNum = this.students.filter(s => s.status !== Status.Dead).length;
        if (currentAliveNum !== this.studentAliveNum) {
            this.studentAliveNum = currentAliveNum;
            this._recalculateSeats();
        }

        // 检查集训状态
        this._checkTraining();
        
        // 安排集训（为未来2周的竞赛）
        this._arrangeTraining();
        
        // 处理竞赛
        this._processCompetition();

        // 触发随机事件（每5周2-3个）
        this.triggerRandomEvent();

        if (this.contests[ContestType.Mid].includes(this.week)) {
            this.contest(ContestType.Mid);
        } else if (this.contests[ContestType.End].includes(this.week)) {
            this.contest(ContestType.End);
        } else if (this.contests[ContestType.Final].includes(this.week)) {
            this.lastDitch();
        }

        if (this.week % SEMESTER_LENGTH === 1) {
            this.semesterStart();
        } else if (this.week % SEMESTER_LENGTH === 0) {
            this.semesterEnd();
        }

        return true;
    }

    contest(type) {
        this.log(`\n📝 第${this.week}周 - ${type === ContestType.Mid ? '期中' : type === ContestType.End ? '期末' : '最终'} 考试`);

        const SUBJECT_SCORES = this._getSubjectScores();
        const examResults = [];
        let classTotalSum = 0;
        let aliveStudentCount = 0;

        const isFirstExam = (this.contestsHistory.length === 0);

        for (let student of this.students) {
            if (student.status === Status.Dead || student.index in this.activeLeaves) {
                continue;
            }

            const studentScores = {};
            let totalScore = 0;

            for (let [subject, baseScore] of Object.entries(SUBJECT_SCORES)) {
                const subjectScore = this._calculateExamScore(student, parseInt(subject), baseScore);
                studentScores[subject] = subjectScore;
                totalScore += subjectScore;
            }

            // 天赋影响：千里眼 - 每次考试有一科30%概率多得20分，20%概率得0分
            if (student.talents.includes(Talent.CLAIRVOYANT) && Object.keys(studentScores).length > 0) {
                const subjects = Object.keys(studentScores);
                const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
                const randomChance = Math.random();
                
                if (randomChance < 0.3) {
                    // 30%概率多得20分
                    const oldScore = studentScores[randomSubject];
                    const newScore = Math.min(SUBJECT_SCORES[randomSubject], oldScore + 20);
                    studentScores[randomSubject] = newScore;
                    totalScore += (newScore - oldScore);
                } else if (randomChance < 0.5) {
                    // 20%概率得0分
                    const oldScore = studentScores[randomSubject];
                    studentScores[randomSubject] = 0;
                    totalScore -= oldScore;
                }
            }

            const result = this._processExamResults(
                student, totalScore, studentScores, examResults,
                classTotalSum, aliveStudentCount, isFirstExam);
            classTotalSum = result.classTotalSum;
            aliveStudentCount = result.aliveCount;
        }

        const avgScore = aliveStudentCount > 0 ? classTotalSum / aliveStudentCount : 0;

        if (isFirstExam && this.firstExamAverage === null) {
            this.firstExamAverage = avgScore;
            this.log(`\n📊 第一次考试平均分：${avgScore.toFixed(1)} (将作为结算基准)`, 'highlight');
        }

        examResults.sort((a, b) => b.totalScore - a.totalScore);

        examResults.forEach((result, index) => {
            const student = this._getStudentByIndex(result.studentIndex);
            if (student) {
                student.lastExamRank = index + 1;
            }
        });

        this.log(`📊 平均分：${avgScore.toFixed(1)} | 参与人数：${aliveStudentCount}`);

        this.contestsHistory.push({
            week: this.week,
            type: type,
            average: avgScore,
            details: examResults
        });

        // 显示考试结果弹窗（详细成绩）
        const examTypeName = type === ContestType.Mid ? '期中考试' : 
                            type === ContestType.End ? '期末考试' : '最终考试';
        
        // 生成详细成绩信息
        let detailMessage = `平均分：${avgScore.toFixed(1)} | 参与人数：${aliveStudentCount}\n\n`;
        
        // 显示前10名（或所有学生，如果少于10人）
        const displayCount = Math.min(10, examResults.length);
        for (let i = 0; i < displayCount; i++) {
            const result = examResults[i];
            const rank = i + 1;
            const rankBadge = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '  ';
            
            // 格式化各科成绩
            const subjectScores = [];
            for (let [subject, score] of Object.entries(result.scores)) {
                // subject是枚举键名（如"Chinese", "Maths"），不是值
                const subjectName = getSubjectName(subject);
                subjectScores.push(`${subjectName}:${Math.round(score)}`);
            }
            
            // 格式化排名和姓名（固定宽度）
            const rankStr = rank < 10 ? `#${rank} ` : `#${rank}`;
            const nameStr = result.name.padEnd(4, ' ');
            const totalStr = result.totalScore.toFixed(1).padStart(6, ' ');
            
            detailMessage += `${rankBadge} ${rankStr} ${nameStr} 总分:${totalStr}\n`;
            detailMessage += `      ${subjectScores.join(' ')}\n\n`;
        }
        
        if (examResults.length > 10) {
            detailMessage += `...（共${examResults.length}名学生）`;
        }
        
        showExamResultModal('success', `${examTypeName}结束`, detailMessage.trim());
    }

    semesterStart() {
        this.log(`📚 第${this.week}周 新学期开始`);
    }

    semesterEnd() {
        this.log(`📚 第${this.week}周 学期结束`);
    }

    fail() {
        this.log("💀 所有学生都死亡了！游戏结束。", 'danger');
        this.ended = true;
    }

    approveLeaveRequest(requestIndex, approved) {
        if (requestIndex < 0 || requestIndex >= this.pendingLeaveRequests.length) {
            return false;
        }

        const req = this.pendingLeaveRequests[requestIndex];
        const student = req.student;

        if (approved) {
            student.status = Status.Leave;
            const startWeek = this.week;
            const endWeek = startWeek + req.duration;
            this.activeLeaves[student.index] = endWeek;
            student.leaveStartWeek = startWeek;
            student.leaveEndWeek = endWeek;
            this.log(`✅ 批准学生 ${student.name} 请假 ${req.duration} 周！（至第 ${endWeek} 周）`, 'highlight');
        } else {
            student.energy = Math.max(STUDENT_ENERGY_MIN, student.energy - 15);
            this.log(`❌ 拒绝学生 ${student.name} 请假申请！学生精力 -15，当前精力：${student.energy.toFixed(1)}`, 'warning');
        }

        req.approved = approved;
        req.processed = true;
        this.pendingLeaveRequests.splice(requestIndex, 1);

        return true;
    }

    counselStudent(studentIndex) {
        const student = this._getStudentByIndex(studentIndex);
        if (!student || student.status === Status.Dead || student.index in this.activeLeaves) {
            return { success: false, message: "学生已死亡或正在请假，无法约谈！" };
        }

        if (this.teacher.energy < TEACHER_COUNSEL_ENERGY_COST) {
            return { success: false, message: "班主任精力不足 20，无法进行约谈！" };
        }

        this.teacher.energy -= TEACHER_COUNSEL_ENERGY_COST;
        this.log(`班主任精力-${TEACHER_COUNSEL_ENERGY_COST}，当前精力：${this.teacher.energy}`);

        const success = Math.random() < COUNSEL_SUCCESS_RATE;

        if (success) {
            student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + STUDENT_ENTHUSIASM_COUNSEL_GAIN);
            this.log(`✅ 约谈成功！${student.name} 积极性+${STUDENT_ENTHUSIASM_COUNSEL_GAIN}，当前积极性：${student.enthusiasm.toFixed(1)}`, 'highlight');
            return {
                success: true,
                message: `约谈成功！${student.name} 积极性提升！\n精力-${TEACHER_COUNSEL_ENERGY_COST}，积极性+${STUDENT_ENTHUSIASM_COUNSEL_GAIN}`
            };
        } else {
            this.teacher.takeDamage(TEACHER_HEALTH_COUNSEL_FAIL);
            this.log(`❌ 约谈失败！${student.name} 不听劝告，还殴打了老师！班主任血量-${TEACHER_HEALTH_COUNSEL_FAIL}，当前血量：${this.teacher.health}`, 'danger');
            checkTeacherDeath(this);
            return {
                success: false,
                message: `约谈失败！${student.name} 殴打了老师！\n精力-${TEACHER_COUNSEL_ENERGY_COST}，血量-${TEACHER_HEALTH_COUNSEL_FAIL}`
            };
        }
    }

    reformStudent(studentIndex) {
        const student = this._getStudentByIndex(studentIndex);
        if (!student || student.status === Status.Dead) {
            return { success: false, message: "学生已死亡或不存在！" };
        }

        if (this.teacher.salary < TALENT_RESET_COST) {
            return { success: false, message: `资金不足！需要${TALENT_RESET_COST}元，当前工资：${this.teacher.salary}元` };
        }

        if (this.teacher.energy < TALENT_RESET_ENERGY) {
            return { success: false, message: `班主任精力不足！需要${TALENT_RESET_ENERGY}精力，当前精力：${this.teacher.energy}` };
        }

        this.teacher.salary -= TALENT_RESET_COST;
        this.teacher.energy -= TALENT_RESET_ENERGY;

        // 60%概率重置天赋成功
        if (Math.random() < TALENT_RESET_SUCCESS_RATE) {
            const oldTalents = student.talents.map(t => TALENT_INFO[t].name).join('、');
            student.resetTalents(true);  // 调教成功后必定有天赋
            const newTalents = student.talents.map(t => TALENT_INFO[t].name).join('、');
            
            this.log(`🎭 班主任调教 ${student.name} 成功！`, 'highlight');
            this.log(`  资金-${TALENT_RESET_COST}，精力-${TALENT_RESET_ENERGY}`, 'info');
            this.log(`  天赋重置成功！`, 'highlight');
            this.log(`  原天赋：${oldTalents || '无'}`, 'info');
            this.log(`  新天赋：${newTalents}`, 'info');
            
            return {
                success: true,
                message: `调教成功！\n资金-${TALENT_RESET_COST}元，精力-${TALENT_RESET_ENERGY}\n天赋已重置：${newTalents}`
            };
        } else {
            this.log(`🎭 班主任调教 ${student.name} 失败！`, 'danger');
            this.log(`  资金-${TALENT_RESET_COST}，精力-${TALENT_RESET_ENERGY}`, 'info');
            this.log(`  调教失败，天赋未改变`, 'warning');
            
            return {
                success: false,
                message: `调教失败！\n资金-${TALENT_RESET_COST}元，精力-${TALENT_RESET_ENERGY}\n天赋未改变`
            };
        }
    }

    organizeActivity(feePerStudent) {
        if (this.teacher.energy < TEACHER_ACTIVITY_ENERGY_COST) {
            return { success: false, message: '班主任精力不足 40，无法组织活动！' };
        }

        this.teacher.energy -= TEACHER_ACTIVITY_ENERGY_COST;

        const aliveStudents = this.students.filter(s =>
            s.status !== Status.Dead && !(s.index in this.activeLeaves));
        const count = aliveStudents.length;

        if (count === 0) {
            this.teacher.energy += TEACHER_ACTIVITY_ENERGY_COST;
            return { success: false, message: '没有学生可以参加活动！' };
        }

        const netIncome = (feePerStudent - 100) * count;
        this.teacher.salary += netIncome;

        this.log(`\n🎪 组织活动（每人班费 ${feePerStudent} 元，${count} 人参加）`, 'highlight');
        this.log(`💰 班主任收支：${netIncome >= 0 ? '+' : ''}${netIncome} 元`);

        if (feePerStudent < 100) {
            const positivity = Math.round((100 - feePerStudent) / 100 * 15);
            const energy = Math.round((100 - feePerStudent) / 100 * 15);
            for (let s of aliveStudents) {
                s.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, s.enthusiasm + positivity);
                s.energy = Math.min(STUDENT_ENERGY_MAX, s.energy + energy);
            }
            this.log(`✅ 学生很满意！积极性+${positivity}，精力+${energy}`);
            return {
                success: true,
                message: `活动圆满结束！\n积极性+${positivity}，精力+${energy}\n班主任收支：${netIncome >= 0 ? '+' : ''}${netIncome} 元`
            };
        }

        const positivityChange = -Math.round((feePerStudent - 100) / 100 * 10);
        const rebellionProb = Math.min((feePerStudent - 100) / 150, 1);
        const damage = Math.min(2 + Math.floor((feePerStudent - 80) / 40), 12);

        for (let s of aliveStudents) {
            s.enthusiasm = Math.max(0, s.enthusiasm + positivityChange);
        }
        this.log(`📉 学生积极性${positivityChange}`);

        let rebelled = false;
        if (Math.random() < rebellionProb) {
            const actualDmg = this.teacher.takeDamage(damage);
            rebelled = true;
            this.log(`😡 学生因班费过高而反抗！班主任被殴打，血量-${actualDmg}！`, 'danger');
        }

        if (this.teacher.health <= 0) {
            this.ended = true;
            this.failReason = '被学生殴打致死';
            setTimeout(() => showEndGameScreen(), 2000);
            return {
                success: true,
                message: `学生反抗过于激烈，班主任伤重不治…\n游戏结束。`
            };
        }

        const msg = rebelled
            ? `活动结束。\n积极性${positivityChange}\n💥 学生反抗！血量-${damage}\n班主任收支：+${netIncome} 元`
            : `活动结束。\n积极性${positivityChange}\n✅ 无人反抗\n班主任收支：+${netIncome} 元`;
        return { success: true, message: msg };
    }

    holdClassMeeting(meetingType = null) {
        if (this.teacher.energy < TEACHER_CLASS_MEETING_ENERGY_COST) {
            return { success: false, message: "班主任精力不足40，无法召开班会！" };
        }

        if (this.teacher.salary < TEACHER_CLASS_MEETING_COST) {
            return { success: false, message: `资金不足！需要${TEACHER_CLASS_MEETING_COST}元，当前工资：${this.teacher.salary}元` };
        }

        this.teacher.energy -= TEACHER_CLASS_MEETING_ENERGY_COST;
        this.teacher.salary -= TEACHER_CLASS_MEETING_COST;

        if (!meetingType) {
            const meetingTypes = Object.values(ClassMeetingType);
            meetingType = meetingTypes[Math.floor(Math.random() * meetingTypes.length)];
        }

        this.log(`\n📢 召开班会：${meetingType}`, 'highlight');

        const aliveStudents = this.students.filter(s =>
            s.status !== Status.Dead && !(s.index in this.activeLeaves));

        if (meetingType === ClassMeetingType.CHICKEN_SOUP) {
            this.log("🍲 班主任端出一碗热气腾腾的鸡汤...");
            for (let student of aliveStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 5);
            }
            this.log("效果：全员积极性+5");
            return {
                success: true,
                message: `鸡汤班会召开成功！\n精力-${TEACHER_CLASS_MEETING_ENERGY_COST}，资金-${TEACHER_CLASS_MEETING_COST}元\n全员积极性+5`
            };

        } else if (meetingType === ClassMeetingType.THREAT) {
            this.log("😠 班主任严厉地威胁学生...");
            for (let student of aliveStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 8);
                student.energy = Math.max(STUDENT_ENERGY_MIN, student.energy - 5);
            }
            this.log("效果：全员积极性+8，精力-5");
            return {
                success: true,
                message: `恐吓班会召开成功！\n精力-${TEACHER_CLASS_MEETING_ENERGY_COST}，资金-${TEACHER_CLASS_MEETING_COST}元\n全员积极性+8，精力-5`
            };

        } else if (meetingType === ClassMeetingType.AWARD) {
            this.log("🏆 班主任表彰优秀学生...");
            const topStudents = [...aliveStudents]
                .sort((a, b) => (b.previousScore || 0) - (a.previousScore || 0))
                .slice(0, 5);
            for (let student of topStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 10);
                this.log(`  🎖️ ${student.name} 积极性+10`, 'highlight');
            }
            this.log("效果：前5名学生积极性+10");
            return { success: true, message: "表彰班会召开成功！" };

        } else if (meetingType === ClassMeetingType.FREE) {
            this.log("🎲 班主任让学生自由讨论...");
            for (let student of aliveStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 3);
                student.energy = Math.min(STUDENT_ENERGY_MAX, student.energy + 2);
            }
            this.log("效果：全员积极性+3，精力+2");
            return { success: true, message: "自由班会召开成功！" };

        } else if (meetingType === ClassMeetingType.COMPLAINT) {
            this.log("💬 班主任组织吐槽大会...");
            for (let student of aliveStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 4);
                student.energy = Math.min(STUDENT_ENERGY_MAX, student.energy + 1);
            }
            this.log("效果：全员积极性+4，精力+1");
            return { success: true, message: "吐槽大会召开成功！" };

        } else if (meetingType === ClassMeetingType.SURPRISE) {
            this.log("🎁 班主任准备了一个惊喜班会...");
            for (let student of aliveStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 7);
            }
            this.log("效果：全员积极性+7");
            return { success: true, message: "惊喜班会召开成功！" };

        } else {
            this.log("✅ 班会召开成功！", 'highlight');
            for (let student of aliveStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 5);
            }
            this.log("效果：全员积极性+5");
            return { success: true, message: "班会召开成功！" };
        }
    }

    expelStudent(studentIndex) {
        const student = this._getStudentByIndex(studentIndex);
        if (!student || student.status === Status.Dead) {
            return { success: false, message: "学生不存在或已劝退！" };
        }

        // 天赋影响：弹反 - 无法被劝退；当被劝退时殴打班主任，扣除班主任7点血量
        if (student.talents.includes(Talent.PARRY)) {
            this.teacher.health = Math.max(0, this.teacher.health - 7);
            this.log(`🛡️ 学生 ${student.name} 发动弹反！殴打班主任！`, 'danger');
            this.log(`班主任血量 -7，当前血量：${this.teacher.health}`, 'warning');

            if (checkTeacherDeath(this)) {
                return { success: false, message: "劝退失败，学生弹反导致班主任死亡！" };
            }

            return { success: false, message: `劝退失败！${student.name} 发动弹反殴打了老师！\n班主任血量-7` };
        }

        // 50%概率学生拒绝被劝退
        if (Math.random() < 0.5) {
            this.teacher.takeDamage(2);
            this.log(`💢 学生 ${student.name} 拒绝被劝退，反而殴打了班主任！`, 'danger');
            this.log(`班主任血量 -2，当前血量：${this.teacher.health}`, 'warning');

            if (checkTeacherDeath(this)) {
                return { success: false, message: "劝退失败，班主任被殴打致死！" };
            }

            return { success: false, message: `劝退失败！${student.name} 拒绝被劝退并殴打了老师！\n班主任血量-2` };
        }

        // 学生接受劝退
        student.status = Status.Dead;
        student.deathReason = 'expelled';
        this.studentAliveNum--;

        this._recalculateSeats();

        if (student.index in this.activeLeaves) {
            delete this.activeLeaves[student.index];
        }

        this.log(`🚫 学生 ${student.name} 被成功劝退！`, 'highlight');
        return { success: true, message: `学生 ${student.name} 被成功劝退！` };
    }

    sellStudent(studentIndex) {
        const student = this._getStudentByIndex(studentIndex);
        if (!student || student.status === Status.Dead) {
            return { success: false, message: "学生不存在或已死亡！" };
        }

        if (this.teacher.energy < 40) {
            return { success: false, message: "班主任精力不足40，无法进行贩卖！" };
        }

        this.teacher.energy -= 40;

        // 60%概率贩卖成功
        if (Math.random() < 0.6) {
            // 计算获得的金钱
            let moneyEarned = 1500;
            
            // 如果学生有传奇机长天赋，总共只获得200元
            if (student.talents.includes(Talent.LEGENDARY_CAPTAIN)) {
                moneyEarned = 200;
            }

            this.teacher.salary += moneyEarned;
            
            // 学生死亡
            student.status = Status.Dead;
            student.deathReason = 'sold';
            this.studentAliveNum--;

            this._recalculateSeats();

            if (student.index in this.activeLeaves) {
                delete this.activeLeaves[student.index];
            }

            this.log(`💰 学生 ${student.name} 已变成內阁，卖出了${moneyEarned}金钱！`, 'highlight');
            this.log(`班主任精力-40，工资+${moneyEarned}`, 'info');
            
            return {
                success: true,
                message: `贩卖成功！\n学生 ${student.name} 已变成內阁\n精力-40，工资+${moneyEarned}`
            };
        } else {
            // 40%概率贩卖失败，学生殴打班主任
            this.teacher.takeDamage(7);
            this.log(`💢 贩卖失败！学生 ${student.name} 殴打了班主任！班主任血量-7，当前血量：${this.teacher.health}`, 'danger');

            if (checkTeacherDeath(this)) {
                return { success: false, message: "贩卖失败，班主任被殴打致死！" };
            }

            return {
                success: false,
                message: `贩卖失败！学生 ${student.name} 殴打了老师！\n精力-40，血量-7`
            };
        }
    }

    swapSeats(pos1Col, pos1Row, pos2Col, pos2Row) {
        // 检查坐标是否有效
        if (pos1Col < 1 || pos1Col > SEAT_COLUMNS ||
            pos1Row < 1 || pos1Row > this.seats[pos1Col - 1].length ||
            pos2Col < 1 || pos2Col > SEAT_COLUMNS ||
            pos2Row < 1 || pos2Row > this.seats[pos2Col - 1].length) {
            return { success: false, message: "座位坐标无效！" };
        }

        const s1 = this.seats[pos1Col - 1][pos1Row - 1];
        const s2 = this.seats[pos2Col - 1][pos2Row - 1];

        // 交换座位
        this.seats[pos1Col - 1][pos1Row - 1] = s2;
        this.seats[pos2Col - 1][pos2Row - 1] = s1;

        // 更新学生的座位信息
        if (s1) {
            s1.seatCol = pos2Col;
            s1.seatRow = pos2Row;
        }
        if (s2) {
            s2.seatCol = pos1Col;
            s2.seatRow = pos1Row;
        }

        // 生成日志消息
        if (s1 && s2) {
            this.log(`🔄 学生 ${s1.name} 和 ${s2.name} 交换座位！`, 'highlight');
            return { success: true, message: `学生 ${s1.name} 和 ${s2.name} 交换座位成功！` };
        } else if (s1) {
            this.log(`🔄 学生 ${s1.name} 移动到座位 (${pos2Col},${pos2Row})`, 'highlight');
            return { success: true, message: `学生 ${s1.name} 移动成功！` };
        } else if (s2) {
            this.log(`🔄 学生 ${s2.name} 移动到座位 (${pos1Col},${pos1Row})`, 'highlight');
            return { success: true, message: `学生 ${s2.name} 移动成功！` };
        } else {
            return { success: true, message: "空座位交换成功！" };
        }
    }

    randomizeSeats() {
        const aliveStudents = this.students.filter(s => s.status !== Status.Dead);
        const shuffled = [...aliveStudents].sort(() => Math.random() - 0.5);

        for (let i = 0; i < shuffled.length; i++) {
            const colIdx = i % SEAT_COLUMNS;
            const rowIdx = Math.floor(i / SEAT_COLUMNS);

            shuffled[i].seatCol = colIdx + 1;
            shuffled[i].seatRow = rowIdx + 1;
        }

        this._recalculateSeats();
        this.log(`🎲 座位随机重排！`, 'highlight');
        return { success: true, message: "座位随机重排成功！" };
    }

    treatStudent(studentIndex) {
        const student = this._getStudentByIndex(studentIndex);
        if (!student || student.status === Status.Dead || student.index in this.activeLeaves) {
            return { success: false, message: "学生已死亡或正在请假，无法请吃饭！" };
        }

        if (this.teacher.salary < TEACHER_TREAT_SINGLE_COST) {
            return { success: false, message: `资金不足！需要${TEACHER_TREAT_SINGLE_COST}元，当前工资：${this.teacher.salary}元` };
        }

        if (this.teacher.energy < TEACHER_TREAT_SINGLE_ENERGY_COST) {
            return { success: false, message: "班主任精力不足30，无法请学生吃饭！" };
        }

        this.teacher.salary -= TEACHER_TREAT_SINGLE_COST;
        this.teacher.energy -= TEACHER_TREAT_SINGLE_ENERGY_COST;

        student.energy = Math.min(STUDENT_ENERGY_MAX, student.energy + STUDENT_ENERGY_TREAT_SINGLE);
        student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 5);

        this.log(`🍽️ 班主任请 ${student.name} 吃饭！资金-${TEACHER_TREAT_SINGLE_COST}，精力-${TEACHER_TREAT_SINGLE_ENERGY_COST}`, 'highlight');
        this.log(`学生 ${student.name} 精力+${STUDENT_ENERGY_TREAT_SINGLE}，积极性+5`, 'highlight');

        return {
            success: true,
            message: `请 ${student.name} 吃饭成功！\n资金-${TEACHER_TREAT_SINGLE_COST}元，精力-${TEACHER_TREAT_SINGLE_ENERGY_COST}\n学生精力+${STUDENT_ENERGY_TREAT_SINGLE}，积极性+5`
        };
    }

    treatAllStudents() {
        if (this.teacher.salary < TEACHER_TREAT_CLASS_COST) {
            return { success: false, message: `资金不足！需要${TEACHER_TREAT_CLASS_COST}元，当前工资：${this.teacher.salary}元` };
        }

        if (this.teacher.energy < TEACHER_TREAT_CLASS_ENERGY_COST) {
            return { success: false, message: "班主任精力不足40，无法请全班吃饭！" };
        }

        const aliveStudents = this.students.filter(s => s.status !== Status.Dead && !(s.index in this.activeLeaves));

        this.teacher.salary -= TEACHER_TREAT_CLASS_COST;
        this.teacher.energy -= TEACHER_TREAT_CLASS_ENERGY_COST;

        for (let student of aliveStudents) {
            student.energy = Math.min(STUDENT_ENERGY_MAX, student.energy + STUDENT_ENERGY_TREAT_CLASS);
            student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 3);
        }

        this.log(`🍽️ 班主任请全班吃饭！资金-${TEACHER_TREAT_CLASS_COST}，精力-${TEACHER_TREAT_CLASS_ENERGY_COST}`, 'highlight');
        this.log(`全班学生精力+${STUDENT_ENERGY_TREAT_CLASS}，积极性+3`, 'highlight');

        return {
            success: true,
            message: `请全班吃饭成功！${aliveStudents.length}名学生受益。\n资金-${TEACHER_TREAT_CLASS_COST}元，精力-${TEACHER_TREAT_CLASS_ENERGY_COST}\n学生精力+${STUDENT_ENERGY_TREAT_CLASS}，积极性+3`
        };
    }

    instigate(student1Index, student2Index) {
        const s1 = this._getStudentByIndex(student1Index);
        const s2 = this._getStudentByIndex(student2Index);

        if (!s1 || !s2) {
            return { success: false, message: "学生编号无效！" };
        }

        if (s1.status === Status.Dead || s2.status === Status.Dead) {
            return { success: false, message: "不能与已劝退的学生进行挑拨！" };
        }

        const currentRel = s1.relation[s2.index] || Relations.Normal;

        const success = Math.random() < RELATION_INSTIGATE_SUCCESS;

        if (success) {
            s1.relation[s2.index] = Relations.Hating;
            s2.relation[s1.index] = Relations.Hating;

            // 如果是恋人关系被挑拨，被发现的概率更高
            if (currentRel === Relations.Loving) {
                this.log(`💔 ${s1.name} 和 ${s2.name} 的恋人关系被挑拨成功！`, 'highlight');
                // 恋人关系挑拨失败，被殴打的概率增加到80%
                if (Math.random() < 0.8) {
                    const damage = s1.gender === Gender.Boy ? TEACHER_HEALTH_INSTIGATE_BOY : TEACHER_HEALTH_INSTIGATE_LOVING;
                    const actualDmg = this.teacher.takeDamage(damage);
                    this.log(`💢 挑拨恋人关系被发现！班主任被愤怒的恋人殴打了，血量-${actualDmg}，当前血量：${this.teacher.health}`, 'danger');

                    if (checkTeacherDeath(this)) {
                        return { success: false, message: "挑拨恋人关系失败，班主任被殴打致死！" };
                    }
                }
            } else {
                // 普通关系挑拨失败，被殴打的概率是50%
                if (Math.random() < 0.5) {
                    const damage = s1.gender === Gender.Boy ? TEACHER_HEALTH_INSTIGATE_BOY : TEACHER_HEALTH_INSTIGATE_LOVING;
                    const actualDmg = this.teacher.takeDamage(damage);
                    this.log(`💢 挑拨被发现！班主任被殴打了，血量-${actualDmg}，当前血量：${this.teacher.health}`, 'danger');

                    if (checkTeacherDeath(this)) {
                        return { success: false, message: "挑拨失败，班主任被殴打致死！" };
                    }
                }
            }

            this.log(`💢 成功挑拨 ${s1.name} 和 ${s2.name} 的关系！`, 'highlight');
            return { success: true, message: `成功挑拨 ${s1.name} 和 ${s2.name} 的关系！` };
        } else {
            const damage = s1.gender === Gender.Boy ? TEACHER_HEALTH_INSTIGATE_BOY : TEACHER_HEALTH_INSTIGATE_LOVING;
            const actualDmg = this.teacher.takeDamage(damage);
            
            if (currentRel === Relations.Loving) {
                this.log(`💢 挑拨恋人关系失败！班主任被愤怒的恋人殴打了，血量-${damage}，当前血量：${this.teacher.health}`, 'danger');
            } else {
                this.log(`💢 挑拨失败！班主任被殴打了，血量-${damage}，当前血量：${this.teacher.health}`, 'danger');
            }

            if (checkTeacherDeath(this)) {
                return { success: false, message: "挑拨失败，班主任被殴打致死！" };
            }

            return { success: false, message: "挑拨失败！" };
        }
}

// 随机事件系统
    triggerRandomEvent() {
        // 获取考试周列表
        const examWeeks = [
            ...this.contests[ContestType.Mid],
            ...this.contests[ContestType.End]
        ];
        
        // 每4周出现2-3个随机事件（改为4周，避免与考试周冲突）
        if (this.week % 4 !== 0) return;
        if (examWeeks.includes(this.week)) return;  // 跳过考试周
        
        // 检查是否有存活的学生
        const aliveStudents = this.students.filter(s => s.status !== Status.Dead);
        if (aliveStudents.length === 0) return;
        
        // 随机选择2-3个事件
        const eventCount = Math.floor(Math.random() * 2) + 2;  // 2-3个事件
        const availableEvents = [...RANDOM_EVENTS];
        const selectedEvents = [];
        
        for (let i = 0; i < eventCount && availableEvents.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableEvents.length);
            selectedEvents.push(availableEvents.splice(randomIndex, 1)[0]);
        }
        
        // 触发选中的事件
        for (let event of selectedEvents) {
            this._processEvent(event);
        }
    }
    
    // 在控制台触发特定事件（用于测试）
    triggerSpecificEvent(eventId) {
        const event = RANDOM_EVENTS.find(e => e.id === eventId);
        if (event) {
            this.log(`🧪 [调试] 触发事件 #${eventId}: ${event.template}`, 'info');
            this._processEvent(event);
        } else {
            console.error(`事件ID ${eventId} 不存在`);
        }
    }
    
    _processEvent(event) {
        // 替换模板中的占位符并获取选中的学生索引
        const result = this._replaceEventPlaceholders(event);
        
        if (event.type === RandomEventType.CONFIRM) {
            // 确认事件：显示一个确认按钮
            this._showConfirmEvent(event, result.message, result.studentIndex1, result.studentIndex2, result.subject1, result.subject2);
        } else if (event.type === RandomEventType.CHOICE) {
            // 选择事件：显示多个选项按钮
            this._showChoiceEvent(event, result.message, result.studentIndex1, result.studentIndex2, result.subject1, result.subject2);
        }
    }
    
    _replaceEventPlaceholders(event) {
        let message = event.template;
        let studentIndex1 = null;
        let studentIndex2 = null;
        let subject1 = null;
        let subject2 = null;
        
        // 替换 {student}
        if (message.includes('{student}')) {
            const aliveStudents = this.students.filter(s => s.status !== Status.Dead);
            if (aliveStudents.length > 0) {
                const randomStudent = aliveStudents[Math.floor(Math.random() * aliveStudents.length)];
                studentIndex1 = randomStudent.index;
                message = message.replace(/{student}/g, randomStudent.name);
            }
        }
        
        // 替换 {target}（另一个学生）
        if (message.includes('{target}')) {
            const aliveStudents = this.students.filter(s => s.status !== Status.Dead);
            if (aliveStudents.length > 0) {
                const targetStudent = aliveStudents[Math.floor(Math.random() * aliveStudents.length)];
                studentIndex2 = targetStudent.index;
                message = message.replace(/{target}/g, targetStudent.name);
            }
        }
        
        // 替换 {subject} 或 {subject1} 或 {subject2}
        const allSubjects = Object.values(Subject);
        const subjectNameMap = {
            Chinese: '语文',
            Maths: '数学',
            English: '英语',
            Physics: '物理',
            Chemistry: '化学',
            Biology: '生物',
            Politics: '政治',
            History: '历史',
            Geography: '地理'
        };
        
        if (message.includes('{subject}')) {
            const subjectValue = allSubjects[Math.floor(Math.random() * allSubjects.length)];
            const subjectKey = Object.keys(Subject).find(key => Subject[key] === subjectValue) || subjectValue;
            subject1 = subjectNameMap[subjectKey] || subjectKey;
            message = message.replace(/{subject}/g, subject1);
        }
        if (message.includes('{subject1}')) {
            const subjectValue = allSubjects[Math.floor(Math.random() * allSubjects.length)];
            const subjectKey = Object.keys(Subject).find(key => Subject[key] === subjectValue) || subjectValue;
            subject1 = subjectNameMap[subjectKey] || subjectKey;
            message = message.replace(/{subject1}/g, subject1);
        }
        if (message.includes('{subject2}')) {
            const subjectValue = allSubjects[Math.floor(Math.random() * allSubjects.length)];
            const subjectKey = Object.keys(Subject).find(key => Subject[key] === subjectValue) || subjectValue;
            subject2 = subjectNameMap[subjectKey] || subjectKey;
            message = message.replace(/{subject2}/g, subject2);
        }
        
        // 替换 {count}
        if (message.includes('{count}')) {
            const count = Math.floor(Math.random() * 5) + 6;  // 6-10
            message = message.replace(/{count}/g, count.toString());
        }
        
        return { message, studentIndex1, studentIndex2, subject1, subject2 };
    }
    
    _showConfirmEvent(event, message, studentIndex1 = null, studentIndex2 = null, subject1 = null, subject2 = null) {
        // 构建弹窗数据
        const eventData = {
            id: event.id,
            type: RandomEventType.CONFIRM,
            title: '突发事件',
            message: message,  // 使用已经替换的message
            icon: '📢',
            effect: event.effect || '',
            buttonText: event.buttonText || '知道了'
        };
        
        // 显示弹窗
        if (typeof showRandomEventModal === 'function') {
            showRandomEventModal(eventData, studentIndex1, studentIndex2, subject1, subject2);
        } else {
            // 如果弹窗函数不可用，只记录日志
            this.log(`📢 ${message}`, 'info');
            this._applyEventEffect(event, event.effect, studentIndex1, studentIndex2);
        }
    }
    
    _showChoiceEvent(event, message, studentIndex1 = null, studentIndex2 = null, subject1 = null, subject2 = null) {
        // 构建弹窗数据
        const eventData = {
            id: event.id,
            type: RandomEventType.CHOICE,
            title: '突发事件',
            message: message,  // 使用已经替换的message
            icon: '📢',
            options: event.options.map(opt => ({
                label: opt.text,
                effect: opt.effect
            }))
        };
        
        // 显示弹窗
        if (typeof showRandomEventModal === 'function') {
            showRandomEventModal(eventData, studentIndex1, studentIndex2, subject1, subject2);
        } else {
            // 如果弹窗函数不可用，只记录日志
            this.log(`📢 ${message}`, 'info');
            const randomOption = event.options[Math.floor(Math.random() * event.options.length)];
            this.log(`  选项：${randomOption.text}`, 'info');
            this._applyEventEffect(event, randomOption.effect, studentIndex1, studentIndex2);
        }
    }
    
_applyEventEffect(event, effect, studentIndex1 = null, studentIndex2 = null, specialDeathReason = null) {
    // 解析效果字符串
    const parts = effect.split(', ');

    // 查找受影响的学生（优先使用传入的索引）
    let targetStudent = null;

    if (studentIndex1 !== null) {
        targetStudent = this._getStudentByIndex(studentIndex1);
    }
        
        // 如果没有传入学生索引，随机选择一个
        if (!targetStudent) {
            const aliveStudents = this.students.filter(s => s.status !== Status.Dead);
            if (aliveStudents.length > 0) {
                targetStudent = aliveStudents[Math.floor(Math.random() * aliveStudents.length)];
            }
        }
        
        for (let part of parts) {
            if (part.startsWith('energy:')) {
                const value = parseFloat(part.split(':')[1]);
                if (value < 0) {
                    this.teacher.energy = Math.max(0, this.teacher.energy + value);
                } else {
                    this.teacher.energy = Math.min(this.teacher.maxEnergy, this.teacher.energy + value);
                }
                this.log(`  班主任精力${value >= 0 ? '+' : ''}${value}`, value >= 0 ? 'info' : 'warning');
            }
            
            if (part.startsWith('enthusiasm:')) {
                if (targetStudent) {
                    const value = parseFloat(part.split(':')[1]);
                    if (value < 0) {
                        targetStudent.enthusiasm = Math.max(STUDENT_ENTHUSIASM_MIN, targetStudent.enthusiasm + value);
                    } else {
                        targetStudent.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, targetStudent.enthusiasm + value);
                    }
                    this.log(`  ${targetStudent.name} 积极性${value >= 0 ? '+' : ''}${value}`, value >= 0 ? 'info' : 'warning');
                }
            }
            
            if (part.startsWith('learnCap:')) {
                if (targetStudent) {
                    const value = parseFloat(part.split(':')[1]);
                    const subjects = Object.keys(targetStudent.learnCap);
                    if (subjects.length > 0) {
                        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
                        targetStudent.learnCap[randomSubject] = Math.min(LEARN_CAP_MAX, targetStudent.learnCap[randomSubject] + value);
                        this.log(`  ${targetStudent.name} ${randomSubject}能力+${value}`, 'info');
                    }
                }
            }
            
            if (part.startsWith('student:kill')) {
                if (targetStudent) {
                    targetStudent.status = Status.Dead;
                    targetStudent.deathReason = specialDeathReason || 'event';
                    this.studentAliveNum--;
                    this._recalculateSeats();
                    this.log(`  ${targetStudent.name} 死亡了！`, 'danger');
                }
            }
            
            if (part.startsWith('teacher:hurt')) {
                const value = parseFloat(part.split(':')[2]);
                this.teacher.health = Math.max(0, this.teacher.health + value);
                this.log(`  班主任血量${value >= 0 ? '+' : ''}${value}`, value >= 0 ? 'info' : 'warning');
                
                // 检查班主任是否死亡
                if (this.teacher.health <= 0) {
                    this.log(`\n💀 班主任血量归零！游戏结束！`, 'danger');
                    this.ended = true;
                    this.failReason = '班主任血量归零';
                    setTimeout(() => {
                        showEndGameScreen();
                    }, 2000);
                }
            }
            
            if (part.startsWith('teacher:kill')) {
                this.teacher.health = 0;
                this.log(`  班主任死亡！`, 'danger');
                this.ended = true;
                this.failReason = '班主任被杀害';
                setTimeout(() => {
                    showEndGameScreen();
                }, 2000);
            }
        }
    }
    
handleRandomEventChoice(eventId, optionIndex, studentIndex1, studentIndex2) {
        // 查找事件
        const event = RANDOM_EVENTS.find(e => e.id === eventId);
        if (!event) return;

        let effect = '';
        let isMP5Attack = false; // 标记是否是MP5攻击
        let specialDeathReason = null; // 特殊死亡原因

        // 判断是确认事件还是选择事件
        if (optionIndex === -1) {
            // 确认事件：使用事件本身的effect
            effect = event.effect || '';
            this.log(`📢 确认事件`, 'info');

            // 检查是否是"散播反党反国言论"事件
            if (eventId === 102) {
                specialDeathReason = 'speech';
            }
        } else {
            // 选择事件：使用选项的effect
            const option = event.options[optionIndex];
            if (!option) return;

            effect = option.effect;
            const student1 = studentIndex1 !== null ? this._getStudentByIndex(studentIndex1) : null;
            const student2 = studentIndex2 !== null ? this._getStudentByIndex(studentIndex2) : null;

            this.log(`📢 选择了：${option.text}`, 'info');

            // 检查是否是MP5攻击事件
            if (eventId === 13 && (effect.includes('teacher:kill') || effect.includes('teacher:hurt'))) {
                isMP5Attack = true;
            }
        }

        // 应用效果（传入学生索引和特殊死亡原因）
        this._applyEventEffect(event, effect, studentIndex1, studentIndex2, specialDeathReason);
        
        // 如果是MP5攻击，显示弹窗提示
        if (isMP5Attack) {
            const student1 = studentIndex1 !== null ? this._getStudentByIndex(studentIndex1) : null;
            if (student1) {
                showNotification('danger', '⚠️ 警告', `${student1.name}使用mp5扫射了你！`);
            }
        }
    }

    lastDitch() {
        this.log("\n🎓 高考时间到！", 'highlight');
        this.log(`🎉 祝同学们金榜题名！`, 'highlight');

        const SUBJECT_SCORES = this._getSubjectScores();
        const examResults = [];

        for (let student of this.students) {
            if (student.status === Status.Dead || student.index in this.activeLeaves) {
                continue;
            }

            const studentScores = {};
            let totalScore = 0;

            for (let [subject, baseScore] of Object.entries(SUBJECT_SCORES)) {
                const subjectScore = this._calculateExamScore(student, parseInt(subject), baseScore);
                studentScores[subject] = subjectScore;
                totalScore += subjectScore;
            }

            examResults.push({
                studentIndex: student.index,
                name: student.name,
                totalScore: totalScore,
                scores: this._subjectScoresToObject(studentScores)
            });
        }

        examResults.sort((a, b) => b.totalScore - a.totalScore);

        for (let result of examResults) {
            const student = this._getStudentByIndex(result.studentIndex);
            let admittedUniversity = null;

            const randomVariation = Math.floor((Math.random() * 2 - 1) * GAOKAO_SCORE_RANDOM_RANGE);
            const finalScore = result.totalScore + randomVariation;
            student.gaokaoScore = finalScore;

            // 将randomVariation分配到各科成绩
            const adjustedScores = {};
            let remainingVariation = randomVariation;
            const subjectKeys = Object.keys(result.scores);

            // 按科目分数比例分配randomVariation
            for (let i = 0; i < subjectKeys.length; i++) {
                const subject = subjectKeys[i];
                const originalScore = result.scores[subject];
                const proportion = originalScore / result.totalScore;

                let variationForSubject;
                if (i === subjectKeys.length - 1) {
                    // 最后一个科目承担剩余的variation
                    variationForSubject = remainingVariation;
                } else {
                    variationForSubject = Math.round(randomVariation * proportion);
                    remainingVariation -= variationForSubject;
                }

                adjustedScores[subject] = Math.max(0, originalScore + variationForSubject);
            }

            student.gaokaoScores = adjustedScores;

            // 更新examResults中的scores和totalScore
            result.scores = adjustedScores;
            result.totalScore = finalScore;

            const universities = this.universityDatabase.sort((a, b) => b.getScoreRequirement(this.classType) - a.getScoreRequirement(this.classType));

            for (let uni of universities) {
                if (finalScore >= uni.getScoreRequirement(this.classType)) {
                    if (Math.random() < 0.2 && universities.indexOf(uni) < universities.length - 1) {
                        admittedUniversity = universities[universities.indexOf(uni) + 1];
                    } else {
                        admittedUniversity = uni;
                    }
                    break;
                }
            }

            if (admittedUniversity) {
                student.admittedUniversity = admittedUniversity;
                this.log(`🎉 ${student.name} 高考成绩：${finalScore}，被 ${admittedUniversity.name} 录取！`, 'highlight');
            } else {
                this.log(`😢 ${student.name} 高考成绩：${finalScore}，落榜了！`, 'warning');
            }

            this.gaokaoResults.push({
                student: student,
                gaokaoScore: finalScore,
                admittedUniversity: admittedUniversity
            });
        }

        // 计算高考平均分
        const avgScore = examResults.length > 0 ? examResults.reduce((sum, r) => sum + r.totalScore, 0) / examResults.length : 0;
        
        // 记录高考到考试历史
        this.contestsHistory.push({
            week: this.week,
            type: ContestType.Final,
            average: avgScore,
            details: examResults
        });

        this.log(`📊 高考平均分：${avgScore.toFixed(1)} | 参与人数：${examResults.length}`);

        this.ended = true;
        
        // 显示结算画面
        setTimeout(() => {
            showEndGameScreen();
        }, 2000);
    }

    getWeekInfo() {
        const semester = Math.floor((this.week - 1) / SEMESTER_LENGTH) + 1;
        const weekInSemester = ((this.week - 1) % SEMESTER_LENGTH) + 1;
        const monthsPassed = Math.floor(this.week / WEEKS_PER_MONTH);
        const weeksSinceMonthStart = this.week % WEEKS_PER_MONTH;
        return `第${semester}学期 第${weekInSemester}周 (总第${this.week}周) - 第${monthsPassed}个月第${weeksSinceMonthStart}周`;
    }

    getNextExamWeek() {
        const allExamWeeks = [
            ...this.contests[ContestType.Mid],
            ...this.contests[ContestType.End],
            ...this.contests[ContestType.Final]
        ].filter(w => w > this.week);

        if (allExamWeeks.length === 0) {
            return "-";
        }

        const nextExam = Math.min(...allExamWeeks);
        return nextExam - this.week;
    }
}

// ============================================================================
// 游戏主程序
// ============================================================================

let gameClass = null;
let selectedStudentIndex = null;
let viewMode = 'normal';
let instigateMode = false;
let swapMode = false;
let swapFirstStudent = null;
let leaveAutoHandle = 'manual';  // 请假自动处理设置：manual/manual/approve/reject

// DOM 元素
const menuScreen = document.getElementById('menuScreen');
const gameScreen = document.getElementById('gameScreen');
const endGameScreen = document.getElementById('endGameScreen');
const logPanel = document.getElementById('logPanel');
const seatingGrid = document.getElementById('seatingGrid');
const seatingArea = document.getElementById('seatingArea');
const infoPanel = document.getElementById('infoPanel');
const examHistory = document.getElementById('examHistory');

// 状态栏元素
const weekDisplay = document.getElementById('weekDisplay');
const characterDisplay = document.getElementById('characterDisplay');
const nextExamDisplay = document.getElementById('nextExamDisplay');
const energyDisplay = document.getElementById('energyDisplay');
const salaryDisplay = document.getElementById('salaryDisplay');
const healthDisplay = document.getElementById('healthDisplay');

// 按钮
const nextWeekBtn = document.getElementById('nextWeekBtn');
const expelBtn = document.getElementById('expelBtn');
const counselBtn = document.getElementById('counselBtn');
const treatSingleBtn = document.getElementById('treatSingleBtn');
const treatClassBtn = document.getElementById('treatClassBtn');
const reformBtn = document.getElementById('reformBtn');
const sellBtn = document.getElementById('sellBtn');
const swapSeatsBtn = document.getElementById('swapSeatsBtn');
const randomizeSeatsBtn = document.getElementById('randomizeSeatsBtn');
const organizeActivityBtn = document.getElementById('organizeActivityBtn');
const holdMeetingBtn = document.getElementById('holdMeetingBtn');
const instigateBtn = document.getElementById('instigateBtn');
const showLeavesBtn = document.getElementById('showLeavesBtn');
const returnMenuBtn = document.getElementById('returnMenuBtn');

// 弹窗
const leaveModal = document.getElementById('leaveModal');
const instigateModal = document.getElementById('instigateModal');
const swapModal = document.getElementById('swapModal');
const examDetailModal = document.getElementById('examDetailModal');

// 初始化

// 食堂楼层系统
let currentCanteenFloor = 1; // 当前楼层，默认一楼

// 通知队列系统
let notificationQueue = [];
let isShowingNotification = false;

// Toast通知系统
let currentToast = null;
let toastTimeout = null;

// 替换弹窗按钮文本（cheers!效果）
function replaceModalButtonText(buttonId) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    
    // 保存原始文本（首次调用时）
    if (!btn.dataset.originalText) {
        btn.dataset.originalText = btn.textContent;
    }
    
    const inventory = gameClass && gameClass.teacher && gameClass.teacher.inventory;
    if (inventory && inventory.hasItem(Item.CHEERS)) {
        const CHEERS_BTN_TEXTS = [
            'Congratulations！',
            'Cheers for you！',
            'Wonderful！',
            '太棒了！',
            '为你点赞！',
            'Claps for you！',
            '很棒！',
            '该挨打了'
        ];
        btn.textContent = CHEERS_BTN_TEXTS[Math.floor(Math.random() * CHEERS_BTN_TEXTS.length)];
    } else {
        // 没有cheers!物品时，恢复原始文本
        btn.textContent = btn.dataset.originalText;
    }
}

// 显示通知弹窗
function showNotification(type, title, message) {
    // 将通知加入队列
    notificationQueue.push({ type, title, message });
    
    // 如果当前没有正在显示的通知，立即显示队列中的第一个
    if (!isShowingNotification) {
        showNextNotification();
    }
}

// 显示队列中的下一个通知
function showNextNotification() {
    if (notificationQueue.length === 0) {
        isShowingNotification = false;
        return;
    }
    
    isShowingNotification = true;
    const notification = notificationQueue[0];
    
    const modal = document.getElementById('notificationModal');
    const icon = document.getElementById('notificationIcon');
    const titleEl = document.getElementById('notificationTitle');
    const messageEl = document.getElementById('notificationMessage');
    const queueInfo = document.getElementById('notificationQueueInfo');
    const queueCount = document.getElementById('notificationQueueCount');
    const confirmAllBtn = document.getElementById('confirmAllNotificationsBtn');

    // 设置样式
    modal.querySelector('.modal-content').className = 'modal-content notification ' + notification.type;

    // 设置图标
    switch (notification.type) {
        case 'success':
            icon.textContent = '✓';
            break;
        case 'error':
            icon.textContent = '✗';
            break;
        case 'warning':
            icon.textContent = '⚠';
            break;
        case 'danger':
            icon.textContent = '⚠';
            break;
        default:
            icon.textContent = 'ℹ';
    }

    // 设置内容
    titleEl.textContent = notification.title;
    messageEl.textContent = notification.message;

    // 更新剩余通知数量
    const remainingCount = notificationQueue.length - 1;
    if (remainingCount > 0) {
        queueInfo.style.display = 'block';
        queueCount.textContent = remainingCount;
        confirmAllBtn.style.display = 'inline-block';
    } else {
        queueInfo.style.display = 'none';
        confirmAllBtn.style.display = 'none';
    }

    // 替换按钮文本
    replaceModalButtonText('closeNotificationBtn');
    replaceModalButtonText('confirmAllNotificationsBtn');

    // 显示弹窗
    modal.style.display = 'flex';
}

// 关闭当前通知并显示下一个
function closeCurrentNotification() {
    if (notificationQueue.length > 0) {
        notificationQueue.shift(); // 移除已显示的通知
    }
    
    showNextNotification();
    
    // 如果队列为空，隐藏弹窗
    if (notificationQueue.length === 0) {
        const modal = document.getElementById('notificationModal');
        modal.style.display = 'none';
    }
}

// 确认全部通知
function confirmAllNotifications() {
    notificationQueue = []; // 清空队列
    const modal = document.getElementById('notificationModal');
    modal.style.display = 'none';
    isShowingNotification = false;
}

// 显示随机事件弹窗
function showRandomEventModal(eventData, studentIndex1, studentIndex2, subject1, subject2) {
    const modal = document.getElementById('randomEventModal');
    const icon = document.getElementById('randomEventIcon');
    const titleEl = document.getElementById('randomEventTitle');
    const messageEl = document.getElementById('randomEventMessage');
    const buttonsContainer = document.getElementById('randomEventButtons');

    // 设置图标
    icon.textContent = eventData.icon || '📢';

    // 设置标题
    titleEl.textContent = eventData.title || '突发事件';

    // 设置消息（message已经在调用前被替换过）
    messageEl.textContent = eventData.message;

// 清空并重建按钮
    buttonsContainer.innerHTML = '';

    // 检查是否有特殊物品
    const inventory = gameClass && gameClass.teacher && gameClass.teacher.inventory;
    const hasAngryItem = inventory && inventory.hasItem(Item.ANGRY);
    const hasCheersItem = inventory && inventory.hasItem(Item.CHEERS);
    const angryBtnText = '气死我了！！！';
    const CHEERS_BTN_TEXTS = [
        'Congratulations！',
        'Cheers for you！',
        'Wonderful！',
        '太棒了！',
        '为你点赞！',
        'Claps for you！',
        '很棒！',
        '该挨打了'
    ];
    const effectCancelled = hasAngryItem || hasCheersItem;

    if (eventData.type === RandomEventType.CHOICE) {
        // 选择事件：显示多个选项按钮
        for (let i = 0; i < eventData.options.length; i++) {
            const option = eventData.options[i];
            const btn = document.createElement('button');
            btn.className = 'btn';

            // 创建按钮内容容器
            const btnContent = document.createElement('div');
            const labelSpan = document.createElement('span');
            if (hasAngryItem) {
                labelSpan.textContent = angryBtnText;
            } else if (hasCheersItem) {
                labelSpan.textContent = CHEERS_BTN_TEXTS[Math.floor(Math.random() * CHEERS_BTN_TEXTS.length)];
            } else {
                labelSpan.textContent = option.label;
            }
            labelSpan.style.display = 'block';
            labelSpan.style.marginBottom = '4px';
            btnContent.appendChild(labelSpan);

            // 显示效果提示（转换为中文）- 暴怒/cheers状态下不显示
            if (!effectCancelled && option.effect) {
                const effectSpan = document.createElement('span');
                effectSpan.style.fontSize = '0.85em';
                effectSpan.style.color = 'rgba(232,199,106,0.7)';
                effectSpan.textContent = _formatEffectText(option.effect);
                btnContent.appendChild(effectSpan);
            }

            btn.appendChild(btnContent);

            btn.onclick = () => {
                if (!effectCancelled) {
                    gameClass.handleRandomEventChoice(eventData.id, i, studentIndex1, studentIndex2);
                }
                modal.style.display = 'none';
                if (typeof renderAll === 'function') {
                    renderAll();
                }
            };

            buttonsContainer.appendChild(btn);
        }
    } else {
        // 确认事件：显示确认按钮
        const btn = document.createElement('button');
        btn.className = 'btn';

        // 创建按钮内容容器
        const btnContent = document.createElement('div');
        const labelSpan = document.createElement('span');
        if (hasAngryItem) {
            labelSpan.textContent = angryBtnText;
        } else if (hasCheersItem) {
            labelSpan.textContent = CHEERS_BTN_TEXTS[Math.floor(Math.random() * CHEERS_BTN_TEXTS.length)];
        } else {
            labelSpan.textContent = eventData.buttonText || '知道了';
        }
        labelSpan.style.display = 'block';
        labelSpan.style.marginBottom = '4px';
        btnContent.appendChild(labelSpan);

        // 添加效果提示（转换为中文）- 暴怒/cheers状态下不显示
        if (!effectCancelled && eventData.effect) {
            const effectSpan = document.createElement('span');
            effectSpan.style.fontSize = '0.85em';
            effectSpan.style.color = 'rgba(232,199,106,0.7)';
            effectSpan.textContent = _formatEffectText(eventData.effect);
            btnContent.appendChild(effectSpan);
        }

        btn.appendChild(btnContent);

        btn.onclick = () => {
            if (!effectCancelled && gameClass && typeof gameClass.handleRandomEventChoice === 'function') {
                gameClass.handleRandomEventChoice(eventData.id, -1, studentIndex1, studentIndex2);
            }
            modal.style.display = 'none';
            if (typeof renderAll === 'function') {
                renderAll();
            }
        };
        buttonsContainer.appendChild(btn);
    }

    // 显示弹窗
    hideGlobalTooltip();  // 隐藏tooltip避免遮挡
    modal.style.display = 'flex';
}

// 将效果字符串转换为中文描述
function _formatEffectText(effect) {
    if (!effect) return '';
    
    const parts = effect.split(', ');
    const descriptions = [];
    
    for (let part of parts) {
        if (part.startsWith('energy:')) {
            const value = parseFloat(part.split(':')[1]);
            if (value > 0) {
                descriptions.push('班主任精力+' + value);
            } else if (value < 0) {
                descriptions.push('班主任精力' + value);
            }
        } else if (part.startsWith('enthusiasm:')) {
            const value = parseFloat(part.split(':')[1]);
            if (value > 0) {
                descriptions.push('积极性+' + value);
            } else if (value < 0) {
                descriptions.push('积极性' + value);
            }
        } else if (part.startsWith('learnCap:')) {
            const value = parseFloat(part.split(':')[1]);
            if (value > 0) {
                descriptions.push('学习能力+' + value);
            } else if (value < 0) {
                descriptions.push('学习能力' + value);
            }
        } else if (part.startsWith('student:kill')) {
            descriptions.push('学生死亡');
        }
    }
    
    return descriptions.join('，');
}

// 显示考试/竞赛结果弹窗
function showExamResultModal(type, title, message) {
    const modal = document.getElementById('examResultModal');
    const icon = document.getElementById('examResultIcon');
    const titleEl = document.getElementById('examResultTitle');
    const messageEl = document.getElementById('examResultMessage');

    // 设置样式
    modal.querySelector('.modal-content').className = 'modal-content notification ' + type;

    // 设置图标
    switch (type) {
        case 'success':
            icon.textContent = '📊';
            break;
        case 'warning':
            icon.textContent = '🏆';
            break;
        default:
            icon.textContent = '📝';
    }

    // 设置内容
    titleEl.textContent = title;
    messageEl.textContent = message;

    replaceModalButtonText('closeExamResultBtn');

    // 显示弹窗
    modal.style.display = 'flex';
}

function showStudentDeathModal(studentName = null, names = null) {
    console.log(`[showStudentDeathModal] Called with studentName=${studentName}, names=${names}`);
    
    const modal = document.getElementById('studentDeathModal');
    
    if (!modal) {
        console.error(`[showStudentDeathModal] ERROR: #studentDeathModal element not found!`);
        return;
    }
    
    const message = document.getElementById('deathMessage');

    if (studentName) {
        message.textContent = `学生 ${studentName} 因精力耗尽而不幸离世！`;
    } else if (names) {
        message.textContent = `学生 ${names} 因精力耗尽而不幸离世！`;
    } else {
        message.textContent = `学生因精力耗尽而不幸离世！`;
    }

    console.log(`[showStudentDeathModal] Showing modal`);
    replaceModalButtonText('closeDeathBtn');
    modal.style.display = 'flex';
}

function init() {
    // 移动端检测
    if (isMobileDevice()) {
        document.body.classList.add('mobile-device');
        forceLandscape();
        
        // 监听屏幕旋转事件
        window.addEventListener('resize', forceLandscape);
        window.addEventListener('orientationchange', forceLandscape);
    }
    
    // 初始化预设系统
    initializeNamePresets();
    
    initGlobalTooltip();
    setupEventListeners();
    initMenuBackground();
    initSplashBackground();
    initCharacterSelectBackground();
    updateViewModeButtons();
    
    // 渲染预设选择框
    renderPresetSelect();
    
    // 渲染物品栏
    renderInventory();
    
    // 添加全局点击处理器，关闭物品选项小弹窗
    document.addEventListener('click', (e) => {
        const popup = document.getElementById('itemOptionPopup');
        if (popup && popup.classList.contains('show')) {
            // 检查点击是否在弹窗、物品栏格子或背包格子内
            const isClickInPopup = popup.contains(e.target);
            const isClickInSlot = e.target.closest('.inventory-slot');
            const isClickInBackpackSlot = e.target.closest('.backpack-slot');

            if (!isClickInPopup && !isClickInSlot && !isClickInBackpackSlot) {
                hideItemOptionPopup();
            }
        }
    });
}

function initCharacterSelectBackground() {
    const canvas = document.getElementById('characterBg');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.4 + 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0d1117');
        gradient.addColorStop(1, '#161b22');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(232, 199, 106, ${p.opacity})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

function initMenuBackground() {
    const canvas = document.getElementById('menuBg');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0d1117');
        gradient.addColorStop(1, '#161b22');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// 启动画面背景粒子动画（与主菜单相同）
function initSplashBackground() {
    const canvas = document.getElementById('splashBg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0d1117');
        gradient.addColorStop(1, '#161b22');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

function setupEventListeners() {
    // 启动画面点击进入主菜单（带过渡动画）
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        splashScreen.addEventListener('click', () => {
            const splashContent = document.getElementById('splashContent');
            if (splashContent) {
                splashContent.classList.add('fade-out');
            }
            // 等待淡出动画结束
            setTimeout(() => {
                splashScreen.style.display = 'none';
                const menuScreen = document.getElementById('menuScreen');
                menuScreen.style.display = 'flex';
                // 触发 reflow 后添加 show 类启动淡入
                void menuScreen.offsetWidth;
                menuScreen.classList.add('show');
            }, 300);
        });
    }

    // 角色选择界面事件监听
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', () => {
            const characterType = card.dataset.character;
            startGameWithCharacter(characterType);
        });
    });

    document.getElementById('gameSetupForm').addEventListener('submit', startGame);

    nextWeekBtn.addEventListener('click', () => {
        // 检查是否有待处理的请假请求
        if (gameClass && gameClass.pendingLeaveRequests.length > 0) {
            // 如果设置了自动处理，直接进入下一周（nextWeek会自动处理）
            if (leaveAutoHandle !== 'manual') {
                const success = gameClass.nextWeek();
                if (success) {
                    renderAll();
                }
                return;
            }
            // 手动处理模式，弹出处理界面
            showLeaveRequests();
            addLogEntry(`⚠️ 有 ${gameClass.pendingLeaveRequests.length} 个请假申请待处理！`, 'warning');
            return;
        }
        
        const success = gameClass.nextWeek();
        if (success) {
            renderAll();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && gameScreen.style.display === 'flex') {
            // 按z-index从高到低的顺序检查弹窗（考试弹窗优先）
            const modalsWithPriority = [
                { id: 'examResultModal', z: 700, handler: () => document.getElementById('closeExamResultBtn').click() },
                { id: 'randomEventModal', z: 650, handler: () => { /* 随机事件弹窗不能通过空格关闭，需要玩家选择 */ } },
                { id: 'notificationModal', z: 600, handler: () => document.getElementById('closeNotificationBtn').click() },
                { id: 'studentDeathModal', z: 600, handler: () => document.getElementById('closeDeathBtn').click() },
                { id: 'expelConfirmModal', z: 600, handler: () => document.getElementById('confirmExpelBtn').click() },
                { id: 'rulesModal', z: 500, handler: () => document.getElementById('rulesCloseBtn').click() },
                { id: 'leaveModal', z: 300, handler: () => document.getElementById('closeLeaveBtn').click() },
                { id: 'instigateModal', z: 300, handler: () => document.getElementById('cancelInstigateBtn').click() },
                { id: 'swapModal', z: 300, handler: () => document.getElementById('cancelSwapBtn').click() },
                { id: 'examDetailModal', z: 300, handler: () => document.getElementById('closeExamDetailBtn').click() }
            ];
            
            // 按z-index从高到低排序
            modalsWithPriority.sort((a, b) => b.z - a.z);
            
            // 检查是否有弹窗打开
            let modalOpen = false;
            for (let modal of modalsWithPriority) {
                const modalElement = document.getElementById(modal.id);
                if (modalElement && modalElement.style.display === 'flex') {
                    modalOpen = true;
                    e.preventDefault();
                    modal.handler();
                    break;
                }
            }

            // 如果没有弹窗打开，则进入下一周
            if (!modalOpen) {
                e.preventDefault();
                hideGlobalTooltip();  // 隐藏tooltip避免遮挡
                nextWeekBtn.click();
            }
        }
    });

    document.getElementById('normalModeBtn').addEventListener('click', () => toggleViewMode('normal'));
    document.getElementById('relationModeBtn').addEventListener('click', () => toggleViewMode('relation'));
    document.getElementById('statusModeBtn').addEventListener('click', () => toggleViewMode('status'));
    document.getElementById('competitionModeBtn').addEventListener('click', () => toggleViewMode('competition'));

    document.getElementById('cancelModeBtn').addEventListener('click', cancelMode);

    expelBtn.addEventListener('click', expelSelectedStudent);
    counselBtn.addEventListener('click', counselSelectedStudent);
    treatSingleBtn.addEventListener('click', treatSelectedStudent);
    treatClassBtn.addEventListener('click', treatAllStudents);
    reformBtn.addEventListener('click', reformSelectedStudent);
    sellBtn.addEventListener('click', sellSelectedStudent);
    swapSeatsBtn.addEventListener('click', startSwapMode);
    randomizeSeatsBtn.addEventListener('click', () => {
        const result = gameClass.randomizeSeats();
        renderSeatingGrid();
        if (result.success) {
            showNotification('success', '重排成功', result.message);
        } else {
            showNotification('error', '重排失败', result.message);
        }
    });

    organizeActivityBtn.addEventListener('click', showActivityModal);
    holdMeetingBtn.addEventListener('click', holdClassMeeting);
    
    document.getElementById('meetingTypeSelect').addEventListener('change', updateMeetingTooltip);
    
instigateBtn.addEventListener('click', startInstigateMode);
    showLeavesBtn.addEventListener('click', showLeaveRequests);
    
    // 食堂按钮
    document.getElementById('canteenBtn').addEventListener('click', showCanteenModal);
    document.getElementById('closeCanteenModalBtn').addEventListener('click', closeCanteenModal);

    // 背包按钮
    document.getElementById('backpackBtn').addEventListener('click', openBackpack);
    document.getElementById('closeBackpackModalBtn').addEventListener('click', closeBackpack);

    // 物品栏选择提示
    document.getElementById('closeSelectionPromptBtn').addEventListener('click', hideItemBarSelectionPrompt);

    // 活动弹窗
    document.getElementById('closeActivityModalBtn').addEventListener('click', closeActivityModal);
    document.getElementById('cancelActivityBtn').addEventListener('click', closeActivityModal);
    document.getElementById('confirmActivityBtn').addEventListener('click', organizeActivity);
    document.getElementById('activityFeeInput').addEventListener('input', updateActivityPreview);
    
    // 贷款弹窗
    document.getElementById('loanBtn').addEventListener('click', showLoanModal);
    document.getElementById('closeLoanModalBtn').addEventListener('click', closeLoanModal);
    document.getElementById('cancelLoanBtn').addEventListener('click', closeLoanModal);
    document.getElementById('confirmLoanBtn').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('loanAmountInput').value) || 0;
        const duration = parseInt(document.getElementById('loanDurationInput').value) || 1;
        const result = borrowLoan(amount, duration);
        if (result.success) {
            closeLoanModal();
            renderAll();
            showNotification('success', '借款成功', result.message);
        } else {
            showToast('error', '借款失败', result.message);
        }
    });
    document.getElementById('repayLoanBtn').addEventListener('click', () => {
        const result = repayLoan();
        if (result.success) {
            closeLoanModal();
            renderAll();
            showNotification('success', '还款成功', result.message);
        } else {
            showNotification('error', '还款失败', result.message);
        }
    });
    document.getElementById('loanAmountInput').addEventListener('input', updateLoanPreview);
    document.getElementById('loanDurationInput').addEventListener('input', updateLoanPreview);
    
    // 食堂楼层切换
    document.querySelectorAll('.canteen-floor-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有active类
            document.querySelectorAll('.canteen-floor-tab').forEach(t => t.classList.remove('active'));
            // 添加active类到当前点击的tab
            tab.classList.add('active');
            // 更新当前楼层
            currentCanteenFloor = parseInt(tab.dataset.floor);
            // 重新渲染物品列表
            renderCanteenItems();
        });
    });

    document.getElementById('saveGameBtn').addEventListener('click', showSaveModal);

    // 返回主菜单按钮（游戏界面）
    document.getElementById('exitGameBtn').addEventListener('click', () => {
        showConfirmDialog(
            '返回主菜单',
            '确定要返回主菜单吗？未保存的游戏进度将会丢失！',
            () => {
                returnToMenu();
            }
        );
    });

    // 主菜单按钮
    document.getElementById('newGameBtn').addEventListener('click', () => {
        menuScreen.style.display = 'none';
        document.getElementById('newGameSetupScreen').style.display = 'flex';
        initNewGameBackground();
    });
    
    document.getElementById('loadGameBtn').addEventListener('click', showLoadModal);
    
    document.getElementById('backToMenuBtn').addEventListener('click', () => {
        document.getElementById('newGameSetupScreen').style.display = 'none';
        menuScreen.style.display = 'flex';
        requestAnimationFrame(() => {
            menuScreen.classList.add('show');
        });
    });
    
    // 载入弹窗
    document.getElementById('closeLoadModalBtn').addEventListener('click', closeLoadModal);
    
    document.getElementById('loadGameFileBtn').addEventListener('click', () => {
        document.getElementById('loadGameInput').click();
    });
    
    document.getElementById('loadGameInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const gameData = JSON.parse(event.target.result);
                    const result = loadGameFromData(gameData);
                    if (result.success) {
                        closeLoadModal();
                    } else {
                        showNotification('error', '加载失败', result.message);
                    }
                } catch (e) {
                    showNotification('error', '加载失败', '存档文件格式错误');
                }
            };
            reader.readAsText(file);
        }
        e.target.value = '';
    });
    
    // 载入弹窗选项卡切换
    document.querySelectorAll('#loadGameModal .modal-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            
            document.querySelectorAll('#loadGameModal .modal-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            document.querySelectorAll('#loadGameModal .modal-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`${tabName}Panel`).classList.add('active');
        });
    });
    
    // 保存弹窗
    document.getElementById('closeSaveModalBtn').addEventListener('click', closeSaveModal);
    
    document.getElementById('exportGameBtn').addEventListener('click', () => {
        saveGame();
        closeSaveModal();
    });
    
    // 保存弹窗选项卡切换
    document.querySelectorAll('#saveGameModal .modal-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            
            document.querySelectorAll('#saveGameModal .modal-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            document.querySelectorAll('#saveGameModal .modal-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`save${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Panel`).classList.add('active');
        });
    });
    
    // 覆盖确认
    document.getElementById('confirmOverwriteBtn').addEventListener('click', () => {
        const modal = document.getElementById('overwriteConfirmModal');
        const slotIndex = parseInt(modal.dataset.slot);
        const result = saveToLocalStorage(slotIndex);
        if (result.success) {
            showNotification('success', '保存成功', result.message);
            renderSaveSlots('saveBrowserPanel', false);
            closeSaveModal();
        } else {
            showNotification('error', '保存失败', result.message);
        }
        closeOverwriteConfirm();
    });
    
    document.getElementById('cancelOverwriteBtn').addEventListener('click', closeOverwriteConfirm);
    
    // 删除确认
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        const modal = document.getElementById('deleteConfirmModal');
        const slotIndex = parseInt(modal.dataset.slot);
        const result = deleteLocalStorageSave(slotIndex);
        if (result.success) {
            showNotification('success', '删除成功', result.message);
            renderSaveSlots('browserPanel', true);
            renderSaveSlots('saveBrowserPanel', false);
        } else {
            showNotification('error', '删除失败', result.message);
        }
        closeDeleteConfirm();
    });
    
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteConfirm);
    
    // 点击弹窗外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    returnMenuBtn.addEventListener('click', returnToMenu);

    document.getElementById('rulesCloseBtn').addEventListener('click', () => {
        document.getElementById('rulesModal').style.display = 'none';
    });

    document.getElementById('closeLeaveBtn').addEventListener('click', () => {
        document.getElementById('leaveModal').style.display = 'none';
    });

    // 添加请假自动处理设置的事件监听
    document.querySelectorAll('input[name="leaveAutoHandle"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            leaveAutoHandle = e.target.value;
            
            // 提示用户设置已更改
            const settingText = {
                'manual': '手动处理：每次都需要手动处理请假申请',
                'approve': '自动同意：所有请假申请将自动批准',
                'reject': '自动拒绝：所有请假申请将自动拒绝'
            };
            
            addLogEntry(`⚙️ 请假设置已更改：${settingText[leaveAutoHandle]}`, 'info');
        });
    });

    document.getElementById('cancelInstigateBtn').addEventListener('click', cancelMode);

    document.getElementById('cancelSwapBtn').addEventListener('click', cancelMode);

    document.getElementById('closeExamDetailBtn').addEventListener('click', () => {
        examDetailModal.style.display = 'none';
    });

    document.getElementById('returnMenuBtn').addEventListener('click', returnToMenu);

    // 关闭通知弹窗
    document.getElementById('closeNotificationBtn').addEventListener('click', () => {
        closeCurrentNotification();
    });
    
    // 确认全部通知
    document.getElementById('confirmAllNotificationsBtn').addEventListener('click', () => {
        confirmAllNotifications();
    });

    // 关闭考试结果弹窗
    document.getElementById('closeExamResultBtn').addEventListener('click', () => {
        document.getElementById('examResultModal').style.display = 'none';
    });

    // 关闭学生死亡通知弹窗
    document.getElementById('closeDeathBtn').addEventListener('click', () => {
        document.getElementById('studentDeathModal').style.display = 'none';
    });
    
    // 姓名预设系统事件监听
    document.getElementById('namePreset').addEventListener('change', handlePresetChange);
    document.getElementById('importPresetBtn').addEventListener('click', handleImportPreset);
    document.getElementById('importPresetInput').addEventListener('change', handleFileSelect);
}

function setupTooltips() {
    // 动态tooltip的更新（HTML中已静态设置）
    updateMeetingTooltip();
}

// ============================================================================
// 姓名预设系统UI交互函数
// ============================================================================

// 渲染预设选择框
function renderPresetSelect() {
    const select = document.getElementById('namePreset');
    if (!select) {
        console.error('renderPresetSelect - 找不到namePreset元素！');
        return;
    }
    
    console.log('renderPresetSelect - namePresets:', namePresets.map(p => ({id: p.id, name: p.name})));
    
    select.innerHTML = '';
    
    namePresets.forEach(preset => {
        const option = document.createElement('option');
        option.value = preset.id;
        option.textContent = preset.name;
        if (preset.id === currentNamePreset.id) {
            option.selected = true;
        }
        select.appendChild(option);
        console.log('添加option:', preset.id, preset.name);
    });
    
    console.log('renderPresetSelect - 渲染完成，option数量:', select.options.length);
    
    // 更新预设信息
    updatePresetInfo();
}

// 处理预设变化
function handlePresetChange(e) {
    const presetId = e.target.value;
    loadNamePreset(presetId);
    updatePresetInfo();
}

// 更新预设信息显示
function updatePresetInfo() {
    const infoDiv = document.getElementById('presetInfo');
    if (!infoDiv) return;
    
    const preset = currentNamePreset;
    
    if (preset.isRandomOnly) {
        infoDiv.textContent = '纯随机模式：所有姓名将随机生成';
    } else {
        const boyCount = preset.boyNames.length;
        const girlCount = preset.girlNames.length;
        infoDiv.textContent = `男生姓名：${boyCount}个 | 女生姓名：${girlCount}个`;
    }
}

// 处理导入按钮点击
function handleImportPreset() {
    document.getElementById('importPresetInput').click();
}

// 处理文件选择
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    importCustomPreset(file)
        .then(preset => {
            showNotification('success', '导入成功', `已导入预设：${preset.name}`);
            renderPresetSelect();
            // 自动选中新导入的预设
            document.getElementById('namePreset').value = preset.id;
            handlePresetChange({ target: { value: preset.id } });
        })
        .catch(err => {
            showNotification('error', '导入失败', err.message);
        });
    
    // 清空文件输入
    e.target.value = '';
}

function updateMeetingTooltip() {
    const meetingType = document.getElementById('meetingTypeSelect').value;
    const tooltipText = getMeetingTooltip(meetingType);
    document.getElementById('holdMeetingBtn').setAttribute('data-tooltip', tooltipText);
}

function getMeetingTooltip(meetingType) {
    switch (meetingType) {
        case 'CHICKEN_SOUP':
            return '消耗40精力，500元。全员积极性+5。班主任的鸡汤激励全班士气。';
        case 'THREAT':
            return '消耗40精力，500元。全员积极性+8，精力-5。严厉警告提升紧迫感，但消耗学生精力。';
        case 'AWARD':
            return '消耗40精力，500元。前5名学生积极性+10。表彰优秀学生激励竞争。';
        case 'FREE':
            return '消耗40精力，500元。全员积极性+3，精力+2。自由交流改善班级氛围。';
        case 'COMPLAINT':
            return '消耗40精力，500元。全员积极性+4，精力+1。发泄不满情绪，恢复学习状态。';
        case 'SURPRISE':
            return '消耗40精力，500元。全员积极性+7。惊喜活动大幅提升班级氛围。';
        default:
            return '召开班会，提升班级状态。';
    }
}

function startGame(e) {
    e.preventDefault();

    // 保存游戏设置到全局变量
    window.gameSettings = {
        difficulty: document.getElementById('difficulty').value,
        classTypeStr: document.getElementById('classType').value,
        studentCount: parseInt(document.getElementById('studentCount').value),
        namePresetId: document.getElementById('namePreset').value  // 新增：保存预设ID
    };

    // 隐藏新游戏设置界面，显示角色选择界面
    document.getElementById('newGameSetupScreen').style.display = 'none';
    document.getElementById('characterSelectScreen').style.display = 'flex';
    
    // 初始化角色选择界面背景
    initCharacterSelectBackground();
}

function startGameWithCharacter(characterType) {
    const settings = window.gameSettings;
    if (!settings) {
        console.error('游戏设置未找到！');
        return;
    }

    let mode;
    switch (settings.difficulty) {
        case 'Easy':
            mode = GameMode.Easy;
            break;
        case 'Normal':
            mode = GameMode.Normal;
            break;
        case 'Hard':
            mode = GameMode.Hard;
            break;
    }

    let type;
    switch (settings.classTypeStr) {
        case 'Science':
            type = ClassType.Science;
            break;
        case 'Art':
            type = ClassType.Art;
            break;
    }

    // 加载预设
    if (settings.namePresetId) {
        loadNamePreset(settings.namePresetId);
    }

    resetNamePool();

    gameClass = new Class(mode, type, settings.studentCount, characterType);

    gameClass.setLogCallback(addLogEntry);

    document.getElementById('characterSelectScreen').style.display = 'none';
    gameScreen.style.display = 'flex';

    renderAll();

    setupTooltips();

    addLogEntry('🎮 游戏开始！', 'highlight');
    
    // 显示角色信息
    if (characterType && CharacterData[characterType]) {
        const charData = CharacterData[characterType];
        const subjectName = gameClass._getSubjectName(charData.subject);
        addLogEntry(`👤 角色：${charData.name}（${subjectName}老师）`, 'highlight');
        addLogEntry(`✨ 特质：${charData.trait}`, 'info');
    }
    
    // 显示难度中文名称
    const difficultyName = settings.difficulty === 'Easy' ? '简单' : 
                          settings.difficulty === 'Normal' ? '普通' : '困难';
    
    addLogEntry(`📚 班型：${type === ClassType.Science ? '理科班' : '文科班'} | 难度：${difficultyName} | 学生人数：${settings.studentCount}`);

    // 窗口resize时重新计算座位大小（移动端自适应）
    window.addEventListener('resize', () => {
        renderSeatingGrid();
    });
}

// ============================================================================
// localStorage存档系统
// ============================================================================

const SAVE_SLOT_PREFIX = '班主任模拟器_save_';
const SAVE_SLOT_COUNT = 5;

// 获取存档槽位信息
function getLocalStorageSaveInfo(slotIndex) {
    const key = `${SAVE_SLOT_PREFIX}${slotIndex}`;
    const data = localStorage.getItem(key);
    
    if (!data) {
        return null;
    }
    
    try {
        const saveData = JSON.parse(data);
        return {
            timestamp: saveData.timestamp,
            week: saveData.week,
            mode: saveData.mode,
            classType: saveData.classType,
            studentNum: saveData.studentNum,
            character: saveData.teacher.characterType,
            studentAliveNum: saveData.studentAliveNum
        };
    } catch (e) {
        console.error('解析存档信息失败:', e);
        return null;
    }
}

// 保存到localStorage
function saveToLocalStorage(slotIndex) {
    if (!gameClass) {
        showNotification('warning', '提示', '没有正在进行的游戏！');
        return { success: false, message: '没有正在进行的游戏' };
    }
    
    const gameData = {
        timestamp: new Date().toISOString(),
        week: gameClass.week,
        ended: gameClass.ended,
        studentAliveNum: gameClass.studentAliveNum,
        failReason: gameClass.failReason,
        mode: gameClass.mode,
        classType: gameClass.classType,
        studentNum: gameClass.studentNum,
        teacher: {
            health: gameClass.teacher.health,
            energy: gameClass.teacher.energy,
            maxEnergy: gameClass.teacher.maxEnergy,
            salary: gameClass.teacher.salary,
            last_salary_week: gameClass.teacher.last_salary_week,
            characterType: gameClass.teacher.characterType,
            monthlySalary: gameClass.teacher.monthlySalary,
            noSalaryPenalty: gameClass.teacher.noSalaryPenalty,
            reviveChance: gameClass.teacher.reviveChance,
            subject: gameClass.teacher.subject,
            inventory: gameClass.teacher.inventory.slots
        },
        contestsHistory: gameClass.contestsHistory,
        pendingLeaveRequests: gameClass.pendingLeaveRequests.map(req => ({
            student_index: req.student.index,
            duration: req.duration,
            reason: req.reason,
            requested_week: req.requested_week,
            approved: req.approved,
            processed: req.processed
        })),
        activeLeaves: gameClass.activeLeaves,
        firstExamAverage: gameClass.firstExamAverage,
        gaokaoResults: gameClass.gaokaoResults.map(result => ({
            student_index: result.student.index,
            gaokao_score: result.gaokao_score,
            university: result.admitted_university ? result.admitted_university.name : null
        })),
        students: gameClass.students.map(student => ({
            index: student.index,
            gender: student.gender,
            name: student.name,
            status: student.status,
            energy: student.energy,
            enthusiasm: student.enthusiasm,
            character: student.character,
            IQ: student.IQ,
            relation: student.relation,
            competition: student.competition,
            competitionStage: student.competitionStage,
            competitionAward: student.competitionAward,
            inTraining: student.inTraining,
            trainingEndWeek: student.trainingEndWeek,
            admittedEarly: student.admittedEarly,
            learnCap: student.learnCap,
            validSubjects: student.validSubjects,
            previous_score: student.previousScore,
            first_exam_score: student.firstExamScore,
            score_change_factor: student.scoreChangeFactor,
            leave_start_week: student.leaveStartWeek,
            leave_end_week: student.leaveEndWeek,
            seat_col: student.seatCol,
            seat_row: student.seatRow,
            lastExamRank: student.lastExamRank,
            gaokao_score: student.gaokaoScore,
            gaokao_scores: student.gaokaoScores,
            admitted_university: student.admittedUniversity ? student.admittedUniversity.name : null,
            talents: student.talents
        })),
        _attendanceLastDeadCount: gameClass._attendanceLastDeadCount,
        loan: gameClass.loan
    };
    
    const key = `${SAVE_SLOT_PREFIX}${slotIndex}`;
    try {
        localStorage.setItem(key, JSON.stringify(gameData));
        return { success: true, message: '存档保存成功' };
    } catch (e) {
        console.error('保存存档失败:', e);
        return { success: false, message: '保存存档失败：' + e.message };
    }
}

// 从localStorage加载
function loadFromLocalStorage(slotIndex) {
    const key = `${SAVE_SLOT_PREFIX}${slotIndex}`;
    const data = localStorage.getItem(key);
    
    if (!data) {
        return { success: false, message: '存档不存在' };
    }
    
    try {
        const gameData = JSON.parse(data);
        return loadGameFromData(gameData);
    } catch (e) {
        console.error('加载存档失败:', e);
        return { success: false, message: '加载存档失败：' + e.message };
    }
}

// 删除localStorage存档
function deleteLocalStorageSave(slotIndex) {
    const key = `${SAVE_SLOT_PREFIX}${slotIndex}`;
    try {
        localStorage.removeItem(key);
        return { success: true, message: '存档删除成功' };
    } catch (e) {
        console.error('删除存档失败:', e);
        return { success: false, message: '删除存档失败：' + e.message };
    }
}

// 从游戏数据加载（重构loadGame函数）
function loadGameFromData(gameData) {
    const saveVersion = gameData.saveVersion || '3.1';
    
    if (!gameData.mode || !gameData.classType || !gameData.students) {
        return { success: false, message: '存档格式不正确' };
    }
    
    const mode = Object.values(GameMode).find(m => m === gameData.mode) || GameMode.Normal;
    const classType = Object.values(ClassType).find(c => c === gameData.classType) || ClassType.Science;
    const characterType = gameData.teacher.characterType || null;
    
    gameClass = new Class(mode, classType, gameData.studentNum, characterType);
    
    gameClass.setLogCallback(addLogEntry);
    
    gameClass.week = gameData.week;
    gameClass.ended = gameData.ended;
    gameClass.studentAliveNum = gameClass.studentAliveNum;
    gameClass.failReason = gameData.failReason || null;
    gameClass.firstExamAverage = gameData.first_exam_average || gameData.firstExamAverage || null;
    
    gameClass.teacher.health = gameData.teacher.health;
    gameClass.teacher.energy = gameData.teacher.energy;
    gameClass.teacher.maxEnergy = gameData.teacher.maxEnergy || TEACHER_ENERGY_DEFAULT;
    gameClass.teacher.salary = gameData.teacher.salary;
    gameClass.teacher.last_salary_week = gameData.teacher.last_salary_week;
    gameClass.teacher.characterType = characterType;
    gameClass.teacher.monthlySalary = gameData.teacher.monthlySalary || TEACHER_MONTHLY_SALARY;
    gameClass.teacher.noSalaryPenalty = gameData.teacher.noSalaryPenalty || false;
    gameClass.teacher.reviveChance = gameData.teacher.reviveChance || 0;
    gameClass.teacher.subject = gameData.teacher.subject || null;
    
    // 加载物品栏
    if (gameData.teacher.inventory) {
        // 新格式：slots数组
        if (Array.isArray(gameData.teacher.inventory)) {
            gameClass.teacher.inventory.slots = gameData.teacher.inventory;
        }
        // 旧格式：items字典（向后兼容）
        else if (typeof gameData.teacher.inventory === 'object') {
            // 将旧的items字典转换为新的slots数组
            const items = gameData.teacher.inventory;
            
            // 将items转换为数组并按order排序
            const itemsArray = [];
            for (let itemId in items) {
                itemsArray.push({
                    itemId: parseInt(itemId),
                    count: items[itemId].count,
                    order: items[itemId].order || 0
                });
            }
            
            // 按order从小到大排序
            itemsArray.sort((a, b) => a.order - b.order);
            
            // 填充slots数组（按order排序后的顺序）
            let slotIndex = 0;
            for (let item of itemsArray) {
                if (slotIndex < 40) {
                    gameClass.teacher.inventory.slots[slotIndex] = {
                        itemId: item.itemId,
                        count: item.count
                    };
                    slotIndex++;
                }
            }
        }
    }
    
    gameClass.contestsHistory = gameData.contestsHistory || gameData.contests_history || [];
    
    const pendingLeaveData = gameData.pendingLeaveRequests || gameData.pending_leave_requests || [];
    gameClass.pendingLeaveRequests = pendingLeaveData.map(req => {
        const student = gameClass._getStudentByIndex(req.student_index);
        const leaveReq = new LeaveRequest(student, req.duration, req.reason || LEAVE_REASONS[Math.floor(Math.random() * LEAVE_REASONS.length)]);
        leaveReq.requestedWeek = req.requested_week;
        leaveReq.approved = req.approved;
        leaveReq.processed = req.processed;
        return leaveReq;
    });
    
    gameClass.activeLeaves = gameData.activeLeaves || gameData.active_leaves || {};
    
    const studentsData = gameData.students || gameData.students_data || [];
    gameClass.students = studentsData.map(studentData => {
        const student = gameClass.students[studentData.index - 1] || new Student(studentData.index, gameClass, mode, classType);
        student.gender = studentData.gender;
        student.name = studentData.name;
        student.status = studentData.status;
        student.energy = studentData.energy;
        student.enthusiasm = studentData.enthusiasm;
        student.character = studentData.character;
        student.IQ = studentData.IQ;
        student.relation = studentData.relation;
        student.competition = studentData.competition || null;
        student.competitionStage = studentData.competitionStage || null;
        student.competitionAward = studentData.competitionAward || CompetitionAward.None;
        student.inTraining = studentData.inTraining || false;
        student.trainingEndWeek = studentData.trainingEndWeek || null;
        student.admittedEarly = studentData.admittedEarly || null;
        student.learnCap = studentData.learnCap;
        student.validSubjects = studentData.validSubjects;
        student.previousScore = studentData.previous_score;
        student.firstExamScore = studentData.first_exam_score;
        student.scoreChangeFactor = studentData.score_change_factor;
        student.leaveStartWeek = studentData.leave_start_week;
        student.leaveEndWeek = studentData.leave_end_week;
        student.seatCol = studentData.seat_col;
        student.seatRow = studentData.seat_row;
        student.lastExamRank = studentData.lastExamRank || null;
        student.gaokaoScore = studentData.gaokao_score || null;
        student.gaokaoScores = studentData.gaokao_scores || null;
        
        if (studentData.talents && Array.isArray(studentData.talents)) {
            student.talents = studentData.talents;
        }
        
        if (studentData.admitted_university) {
            for (let uni of gameClass.universityDatabase) {
                if (uni.name === studentData.admitted_university) {
                    student.admittedUniversity = uni;
                    break;
                }
            }
        }
        
        return student;
    });
    
    const gaokaoResultsData = gameData.gaokaoResults || gameData.gaokao_results || [];
    gameClass.gaokaoResults = gaokaoResultsData.map(result => {
        const student = gameClass._getStudentByIndex(result.student_index);
        const university = result.university ? gameClass.universityDatabase.find(u => u.name === result.university) : null;
        return {
            student: student,
            gaokao_score: result.gaokao_score,
            admitted_university: university
        };
    });

    // 恢复贷款数据
    if (gameData.loan) {
        gameClass.loan = gameData.loan;
    }
    if (typeof gameData._attendanceLastDeadCount === 'number') {
        gameClass._attendanceLastDeadCount = gameData._attendanceLastDeadCount;
    }

    gameClass._initializeSeats();
    gameClass._recalculateSeats();
    
    menuScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    
    renderAll();
    
    addLogEntry(`📂 存档已加载：第${gameClass.week}周`, 'highlight');
    addLogEntry(`📚 班型：${classType === ClassType.Science ? '理科班' : '文科班'} | 难度：${mode === GameMode.Easy ? '简单' : mode === GameMode.Normal ? '普通' : '困难'} | 学生人数：${gameClass.studentNum}`);
    
    setupTooltips();
    
    showNotification('success', '加载成功', '存档加载成功！');
    
    return { success: true, message: '存档加载成功' };
}

// 渲染存档槽位
function renderSaveSlots(containerId, isLoadMode = true) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 1; i <= SAVE_SLOT_COUNT; i++) {
        const saveInfo = getLocalStorageSaveInfo(i);
        const slot = document.createElement('div');
        slot.className = 'save-slot';
        slot.dataset.slot = i;
        
        if (saveInfo) {
            slot.classList.add('has-save');
            
            const timestamp = new Date(saveInfo.timestamp);
            const timeStr = timestamp.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const modeName = saveInfo.mode === GameMode.Easy ? '简单' : 
                           saveInfo.mode === GameMode.Normal ? '普通' : '困难';
            const typeName = saveInfo.classType === ClassType.Science ? '理科班' : '文科班';
            const charName = saveInfo.character ? CharacterData[saveInfo.character]?.name : '无';
            
            slot.innerHTML = `
                <div class="slot-info">
                    <div class="slot-header">
                        <span class="slot-number">存档 ${i}</span>
                        <button class="slot-delete" data-slot="${i}">删除</button>
                    </div>
                    <div class="slot-detail">
                        <span class="slot-detail-label">时间</span>
                        <span class="slot-detail-value">${timeStr}</span>
                    </div>
                    <div class="slot-detail">
                        <span class="slot-detail-label">周数</span>
                        <span class="slot-detail-value">${saveInfo.week}周</span>
                    </div>
                    <div class="slot-detail">
                        <span class="slot-detail-label">班型</span>
                        <span class="slot-detail-value">${typeName}</span>
                    </div>
                    <div class="slot-detail">
                        <span class="slot-detail-label">难度</span>
                        <span class="slot-detail-value">${modeName}</span>
                    </div>
                    <div class="slot-detail">
                        <span class="slot-detail-label">角色</span>
                        <span class="slot-detail-value">${charName}</span>
                    </div>
                    <div class="slot-detail">
                        <span class="slot-detail-label">学生</span>
                        <span class="slot-detail-value">${saveInfo.studentNum}人</span>
                    </div>
                    <div class="slot-detail">
                        <span class="slot-detail-label">存活</span>
                        <span class="slot-detail-value">${saveInfo.studentAliveNum}人</span>
                    </div>
                </div>
            `;
        } else {
            slot.innerHTML = `<div class="slot-empty">空存档</div>`;
        }
        
        container.appendChild(slot);
    }
    
    // 添加点击事件
    container.querySelectorAll('.save-slot').forEach(slot => {
        slot.addEventListener('click', (e) => {
            if (e.target.classList.contains('slot-delete')) {
                e.stopPropagation();
                const slotIndex = parseInt(e.target.dataset.slot);
                showDeleteConfirm(slotIndex);
            } else {
                const slotIndex = parseInt(slot.dataset.slot);
                if (isLoadMode) {
                    const saveInfo = getLocalStorageSaveInfo(slotIndex);
                    if (saveInfo) {
                        loadFromLocalStorage(slotIndex);
                        closeLoadModal();
                    }
                } else {
                    const saveInfo = getLocalStorageSaveInfo(slotIndex);
                    if (saveInfo) {
                        showOverwriteConfirm(slotIndex);
                    } else {
                        const result = saveToLocalStorage(slotIndex);
                        if (result.success) {
                            showNotification('success', '保存成功', result.message);
                            renderSaveSlots('saveBrowserPanel', false);
                            closeSaveModal();
                        } else {
                            showNotification('error', '保存失败', result.message);
                        }
                    }
                }
            }
        });
    });
}

// 显示载入弹窗
function showLoadModal() {
    const modal = document.getElementById('loadGameModal');
    modal.style.display = 'flex';
    renderSaveSlots('browserPanel', true);
}

// 关闭载入弹窗
function closeLoadModal() {
    const modal = document.getElementById('loadGameModal');
    modal.style.display = 'none';
}

// 显示保存弹窗
function showSaveModal() {
    const modal = document.getElementById('saveGameModal');
    modal.style.display = 'flex';
    renderSaveSlots('saveBrowserPanel', false);
}

// 关闭保存弹窗
function closeSaveModal() {
    const modal = document.getElementById('saveGameModal');
    modal.style.display = 'none';
}

// 显示覆盖确认
function showOverwriteConfirm(slotIndex) {
    const modal = document.getElementById('overwriteConfirmModal');
    modal.dataset.slot = slotIndex;
    replaceModalButtonText('confirmOverwriteBtn');
    modal.style.display = 'flex';
}

// 关闭覆盖确认
function closeOverwriteConfirm() {
    const modal = document.getElementById('overwriteConfirmModal');
    modal.style.display = 'none';
}

// 显示删除确认
function showDeleteConfirm(slotIndex) {
    const modal = document.getElementById('deleteConfirmModal');
    modal.dataset.slot = slotIndex;
    replaceModalButtonText('confirmDeleteBtn');
    modal.style.display = 'flex';
}

// 关闭删除确认
function closeDeleteConfirm() {
    const modal = document.getElementById('deleteConfirmModal');
    modal.style.display = 'none';
}

// 初始化新游戏设置界面背景
function initNewGameBackground() {
    const canvas = document.getElementById('newGameBg');
    if (!canvas) return;
    
    // 复用现有的背景动画逻辑
    initMenuBackground(canvas);
}

function saveGame() {
    if (!gameClass) {
        showNotification('warning', '提示', '没有正在进行的游戏！');
        return;
    }

    const gameData = {
        saveVersion: '3.1',
        mode: gameClass.mode,
        classType: gameClass.classType,
        studentNum: gameClass.studentNum,
        week: gameClass.week,
        ended: gameClass.ended,
        studentAliveNum: gameClass.studentAliveNum,
        failReason: gameClass.failReason,
        teacher: {
            health: gameClass.teacher.health,
            energy: gameClass.teacher.energy,
            maxEnergy: gameClass.teacher.maxEnergy,
            salary: gameClass.teacher.salary,
            last_salary_week: gameClass.teacher.last_salary_week,
            characterType: gameClass.teacher.characterType,
            monthlySalary: gameClass.teacher.monthlySalary,
            noSalaryPenalty: gameClass.teacher.noSalaryPenalty,
            reviveChance: gameClass.teacher.reviveChance,
            subject: gameClass.teacher.subject,
            inventory: gameClass.teacher.inventory.slots
        },
        contestsHistory: gameClass.contestsHistory,
        pendingLeaveRequests: gameClass.pendingLeaveRequests.map(req => ({
            student_index: req.student.index,
            duration: req.duration,
            reason: req.reason,
            requested_week: req.requested_week,
            approved: req.approved,
            processed: req.processed
        })),
        activeLeaves: gameClass.activeLeaves,
        firstExamAverage: gameClass.firstExamAverage,
        gaokaoResults: gameClass.gaokaoResults.map(result => ({
            student_index: result.student.index,
            gaokao_score: result.gaokao_score,
            university: result.admitted_university ? result.admitted_university.name : null
        })),
        pending_leave_requests: gameClass.pendingLeaveRequests.map(req => ({
            student_index: req.student.index,
            duration: req.duration,
            reason: req.reason,
            requested_week: req.requested_week,
            approved: req.approved,
            processed: req.processed
        })),
        active_leaves: gameClass.activeLeaves,
        first_exam_average: gameClass.firstExamAverage,
        gaokao_results: gameClass.gaokaoResults.map(result => ({
            student_index: result.student.index,
            gaokao_score: result.gaokao_score,
            university: result.admitted_university ? result.admitted_university.name : null
        })),
        students: gameClass.students.map(student => ({
            index: student.index,
            gender: student.gender,
            name: student.name,
            status: student.status,
            energy: student.energy,
            enthusiasm: student.enthusiasm,
            character: student.character,
            IQ: student.IQ,
            relation: student.relation,
            competition: student.competition,
            competitionStage: student.competitionStage,
            competitionAward: student.competitionAward,
            inTraining: student.inTraining,
            trainingEndWeek: student.trainingEndWeek,
            admittedEarly: student.admittedEarly,
            learnCap: student.learnCap,
            validSubjects: student.validSubjects,
            previous_score: student.previousScore,
            first_exam_score: student.firstExamScore,
            score_change_factor: student.scoreChangeFactor,
            leave_start_week: student.leaveStartWeek,
            leave_end_week: student.leaveEndWeek,
            seat_col: student.seatCol,
            seat_row: student.seatRow,
            lastExamRank: student.lastExamRank,
            gaokao_score: student.gaokaoScore,
            gaokao_scores: student.gaokaoScores,
            admitted_university: student.admittedUniversity ? student.admittedUniversity.name : null,
            talents: student.talents
        })),
        students_data: gameClass.students.map(student => ({
            index: student.index,
            gender: student.gender,
            name: student.name,
            status: student.status,
            energy: student.energy,
            enthusiasm: student.enthusiasm,
            character: student.character,
            IQ: student.IQ,
            relation: student.relation,
            competition: student.competition,
            competitionStage: student.competitionStage,
            competitionAward: student.competitionAward,
            inTraining: student.inTraining,
            trainingEndWeek: student.trainingEndWeek,
            admittedEarly: student.admittedEarly,
            learnCap: student.learnCap,
            validSubjects: student.validSubjects,
            previous_score: student.previousScore,
            first_exam_score: student.firstExamScore,
            score_change_factor: student.scoreChangeFactor,
            leave_start_week: student.leaveStartWeek,
            leave_end_week: student.leaveEndWeek,
            seat_col: student.seatCol,
            seat_row: student.seatRow,
            lastExamRank: student.lastExamRank,
            gaokao_score: student.gaokaoScore,
            gaokao_scores: student.gaokaoScores,
            admitted_university: student.admittedUniversity ? student.admittedUniversity.name : null,
            talents: student.talents
        })),
        _attendanceLastDeadCount: gameClass._attendanceLastDeadCount,
        loan: gameClass.loan
    };

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const filename = `班主任模拟器_${timestamp}.json`;

    const blob = new Blob([JSON.stringify(gameData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addLogEntry(`💾 存档已保存：${filename}`, 'highlight');
}

function loadGame(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const gameData = JSON.parse(e.target.result);

            const saveVersion = gameData.saveVersion || '1.0';

            if (!gameData.mode || !gameData.classType || !gameData.students) {
                throw new Error('存档格式不正确');
            }

            const mode = Object.values(GameMode).find(m => m === gameData.mode) || GameMode.Normal;
            const classType = Object.values(ClassType).find(c => c === gameData.classType) || ClassType.Science;

            gameClass = new Class(mode, classType, gameData.studentNum);

            gameClass.setLogCallback(addLogEntry);

            gameClass.week = gameData.week;
            gameClass.ended = gameData.ended;
            gameClass.studentAliveNum = gameData.studentAliveNum;
            gameClass.failReason = gameData.failReason || null;
            gameClass.firstExamAverage = gameData.firstExam_average || gameData.firstExamAverage || null;

            gameClass.teacher.health = gameData.teacher.health;
            gameClass.teacher.energy = gameData.teacher.energy;
            gameClass.teacher.maxEnergy = gameData.teacher.maxEnergy || TEACHER_ENERGY_DEFAULT;
            gameClass.teacher.salary = gameData.teacher.salary;
            gameClass.teacher.last_salary_week = gameData.teacher.last_salary_week;
            gameClass.teacher.characterType = gameData.teacher.characterType || null;
            gameClass.teacher.monthlySalary = gameData.teacher.monthlySalary || TEACHER_MONTHLY_SALARY;
            gameClass.teacher.noSalaryPenalty = gameData.teacher.noSalaryPenalty || false;
            gameClass.teacher.reviveChance = gameData.teacher.reviveChance || 0;
            gameClass.teacher.subject = gameData.teacher.subject || null;
            
            // 加载物品栏（v3.1及以上版本）
            if (gameData.teacher.inventory && typeof gameData.teacher.inventory === 'object') {
                gameClass.teacher.inventory.items = gameData.teacher.inventory;
                // 重新计算nextOrder
                let maxOrder = 0;
                for (let itemId in gameClass.teacher.inventory.items) {
                    if (gameClass.teacher.inventory.items[itemId].order > maxOrder) {
                        maxOrder = gameClass.teacher.inventory.items[itemId].order;
                    }
                }
                gameClass.teacher.inventory.nextOrder = maxOrder + 1;
            }

            gameClass.contestsHistory = gameData.contestsHistory || gameData.contests_history || [];

            const pendingLeaveData = gameData.pendingLeaveRequests || gameData.pending_leave_requests || [];
            gameClass.pendingLeaveRequests = pendingLeaveData.map(req => {
                const student = gameClass._getStudentByIndex(req.student_index);
                const leaveReq = new LeaveRequest(student, req.duration, req.reason || LEAVE_REASONS[Math.floor(Math.random() * LEAVE_REASONS.length)]);
                leaveReq.requestedWeek = req.requested_week;
                leaveReq.approved = req.approved;
                leaveReq.processed = req.processed;
                return leaveReq;
            });

            gameClass.activeLeaves = gameData.activeLeaves || gameData.active_leaves || {};

            const studentsData = gameData.students || gameData.students_data || [];
            gameClass.students = studentsData.map(studentData => {
                const student = gameClass.students[studentData.index - 1] || new Student(studentData.index, gameClass, mode, classType);
                student.gender = studentData.gender;
                student.name = studentData.name;
                student.status = studentData.status;
                student.energy = studentData.energy;
                student.enthusiasm = studentData.enthusiasm;
                student.character = studentData.character;
                student.IQ = studentData.IQ;
                student.relation = studentData.relation;
                                student.competition = studentData.competition || null;
                                student.competitionStage = studentData.competitionStage || null;
                                student.competitionAward = studentData.competitionAward || CompetitionAward.None;
                                student.inTraining = studentData.inTraining || false;
                                student.trainingEndWeek = studentData.trainingEndWeek || null;
                                student.admittedEarly = studentData.admittedEarly || null;
                                student.learnCap = studentData.learnCap;                student.validSubjects = studentData.validSubjects;
                student.previousScore = studentData.previous_score;
                student.firstExamScore = studentData.first_exam_score;
                student.scoreChangeFactor = studentData.score_change_factor;
                student.leaveStartWeek = studentData.leave_start_week;
                student.leaveEndWeek = studentData.leave_end_week;
                student.seatCol = studentData.seat_col;
                student.seatRow = studentData.seat_row;
                student.lastExamRank = studentData.lastExamRank || null;
                student.gaokaoScore = studentData.gaokao_score || null;
                student.gaokaoScores = studentData.gaokao_scores || null;

                // 加载天赋（v2.2及以上版本）
                if (studentData.talents && Array.isArray(studentData.talents)) {
                    student.talents = studentData.talents;
                }

                if (studentData.admitted_university) {
                    for (let uni of gameClass.universityDatabase) {
                        if (uni.name === studentData.admitted_university) {
                            student.admittedUniversity = uni;
                            break;
                        }
                    }
                }

                return student;
            });

            const gaokaoResultsData = gameData.gaokaoResults || gameData.gaokao_results || [];
            gameClass.gaokaoResults = gaokaoResultsData.map(result => {
                const student = gameClass._getStudentByIndex(result.student_index);
                const university = result.university ? gameClass.universityDatabase.find(u => u.name === result.university) : null;
                return {
                    student: student,
                    gaokao_score: result.gaokao_score,
                    admitted_university: university
                };
            });

            // 恢复贷款数据
            if (gameData.loan) {
                gameClass.loan = gameData.loan;
            }
            if (typeof gameData._attendanceLastDeadCount === 'number') {
                gameClass._attendanceLastDeadCount = gameData._attendanceLastDeadCount;
            }

            gameClass._initializeSeats();
            gameClass._recalculateSeats();

            menuScreen.style.display = 'none';
            gameScreen.style.display = 'flex';

            renderAll();

            addLogEntry(`📂 存档已加载：第${gameClass.week}周`, 'highlight');
            addLogEntry(`📚 班型：${classType === ClassType.Science ? '理科班' : '文科班'} | 难度：${mode === GameMode.Easy ? '简单' : mode === GameMode.Normal ? '普通' : '困难'} | 学生人数：${gameClass.studentNum}`);

            setupTooltips();

            showNotification('success', '加载成功', '存档加载成功！');

        } catch (error) {
            console.error('加载存档失败:', error);
            showNotification('error', '加载失败', '加载存档失败：' + error.message);
        }
    };
    reader.readAsText(file);

    event.target.value = '';
}

function returnToMenu() {
    endGameScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    document.getElementById('characterSelectScreen').style.display = 'none';
    document.getElementById('newGameSetupScreen').style.display = 'none';
    menuScreen.style.display = 'flex';
    requestAnimationFrame(() => {
        menuScreen.classList.add('show');
    });

    gameClass = null;
    selectedStudentIndex = null;
    viewMode = 'normal';
    instigateMode = false;
    swapMode = false;
    swapFirstStudent = null;

    logPanel.innerHTML = '';
    examHistory.innerHTML = '';
    infoPanel.style.display = 'none';
    
    // 渲染物品栏（清空状态）
    renderInventory();
}

function selectStudent(index) {
    if (index === null) {
        selectedStudentIndex = null;
    } else {
        selectedStudentIndex = index;
    }
    renderSeatingGrid();
    updateInfoPanel();
    updateButtonStates();
}

function handleSeatClick(col, row, student) {
    if (swapMode) {
        handleSwapClick(col, row, student);
        return;
    }

    if (instigateMode) {
        handleInstigateClick(col, row, student);
        return;
    }

    if (student && student.status !== Status.Dead) {
        selectStudent(student.index);
    } else {
        // 点击空座位或死亡学生，取消选择
        selectStudent(null);
    }
}

function toggleViewMode(mode) {
    viewMode = mode;
    renderSeatingGrid();
    updateViewModeButtons();
}

function updateViewModeButtons() {
    const buttons = document.querySelectorAll('.view-mode-btn');
    buttons.forEach(btn => {
        if (btn.dataset.mode === viewMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function cancelMode() {
    instigateMode = false;
    swapMode = false;
    swapFirstStudent = null;
    document.getElementById('cancelModeBtn').style.display = 'none';
    renderSeatingGrid();
}

function expelSelectedStudent() {
    if (!gameClass || selectedStudentIndex === null) return;

    const student = gameClass._getStudentByIndex(selectedStudentIndex);
    if (!student) return;

    // 显示劝退确认弹窗
    const modal = document.getElementById('expelConfirmModal');
    const icon = document.getElementById('expelConfirmIcon');
    const titleEl = document.getElementById('expelConfirmTitle');
    const messageEl = document.getElementById('expelConfirmMessage');

    icon.textContent = '⚠';
    modal.querySelector('.modal-content').className = 'modal-content notification warning';
    titleEl.textContent = '确认劝退';
    messageEl.textContent = `确定要劝退学生 ${student.name} 吗？`;

    replaceModalButtonText('confirmExpelBtn');
    modal.style.display = 'flex';

    // 设置确认按钮的事件
    const confirmBtn = document.getElementById('confirmExpelBtn');
    const cancelBtn = document.getElementById('cancelExpelBtn');

    // 移除之前的事件监听器
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // 确认按钮
    newConfirmBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        const result = gameClass.expelStudent(selectedStudentIndex);
        if (result.success) {
            selectedStudentIndex = null;
            renderAll();
            showNotification('success', '劝退成功', result.message);
        } else {
            renderAll();
            showNotification('error', '劝退失败', result.message);
        }
    });

    // 取消按钮
    newCancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// 通用确认弹窗
let genericConfirmCallback = null;

function showConfirmDialog(title, message, onConfirm) {
    const modal = document.getElementById('genericConfirmModal');
    const titleEl = document.getElementById('genericConfirmTitle');
    const messageEl = document.getElementById('genericConfirmMessage');
    const confirmBtn = document.getElementById('genericConfirmBtn');
    const cancelBtn = document.getElementById('genericCancelBtn');

    titleEl.textContent = title;
    messageEl.textContent = message;
    genericConfirmCallback = onConfirm;

    // 移除旧的事件监听器
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // 确认按钮
    newConfirmBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        if (genericConfirmCallback) {
            genericConfirmCallback();
            genericConfirmCallback = null;
        }
    });

    // 取消按钮
    newCancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        genericConfirmCallback = null;
    });

    replaceModalButtonText('genericConfirmBtn');
    modal.style.display = 'flex';
}

function counselSelectedStudent() {
    if (!gameClass || selectedStudentIndex === null) return;

    const result = gameClass.counselStudent(selectedStudentIndex);
    renderAll();
    if (result.success) {
        showNotification('success', '约谈成功', result.message);
    } else {
        showNotification('error', '约谈失败', result.message);
    }
}

function treatSelectedStudent() {
    if (!gameClass || selectedStudentIndex === null) return;

    const result = gameClass.treatStudent(selectedStudentIndex);
    renderAll();
    if (result.success) {
        showNotification('success', '请客成功', result.message);
    } else {
        showNotification('error', '请客失败', result.message);
    }
}

function treatAllStudents() {
    if (!gameClass) return;

    const result = gameClass.treatAllStudents();
    if (result.success) {
        renderAll();
        showNotification('success', '请客成功', result.message);
    } else {
        showNotification('error', '请客失败', result.message);
    }
}

function reformSelectedStudent() {
    if (!gameClass || selectedStudentIndex === null) return;

    const result = gameClass.reformStudent(selectedStudentIndex);
    renderAll();
    if (result.success) {
        showNotification('success', '调教成功', result.message);
    } else {
        showNotification('error', '调教失败', result.message);
    }
}

function sellSelectedStudent() {
    if (!gameClass || selectedStudentIndex === null) return;

    const result = gameClass.sellStudent(selectedStudentIndex);
    renderAll();
    if (result.success) {
        showNotification('success', '贩卖成功', result.message);
    } else {
        showNotification('error', '贩卖失败', result.message);
    }
}

function startSwapMode() {
    if (!gameClass || selectedStudentIndex === null) {
        showNotification('warning', '提示', '请先选择一个学生！');
        return;
    }

    swapMode = true;
    swapFirstStudent = selectedStudentIndex;
    document.getElementById('cancelModeBtn').style.display = 'inline-block';
    
    // 在日志中添加提示
    if (gameClass && gameClass.logCallback) {
        gameClass.log('💡 请点击目标位置进行交换', 'highlight');
    }
    
    renderSeatingGrid();
}

function handleSwapClick(col, row, student) {
    if (!gameClass) return;

    if (swapFirstStudent === null) {
        // 第一次点击，选择一个学生
        if (student) {
            swapFirstStudent = student.index;
            showNotification('info', '选择完成', '请点击目标位置进行交换');
            renderSeatingGrid();
        }
        return;
    }

    // 第二次点击，执行交换
    const firstStudent = gameClass._getStudentByIndex(swapFirstStudent);
    if (!firstStudent) {
        cancelMode();
        return;
    }

    const pos1Col = firstStudent.seatCol;
    const pos1Row = firstStudent.seatRow;

    const result = gameClass.swapSeats(pos1Col, pos1Row, col, row);
    if (result.success) {
        cancelMode();
        renderAll();
        showNotification('success', '交换成功', result.message);
    } else {
        showNotification('error', '交换失败', result.message);
    }
}

function updateActivityPreview() {
    if (!gameClass) return;
    const fee = parseInt(document.getElementById('activityFeeInput').value) || 0;
    const aliveStudents = gameClass.students.filter(s =>
        s.status !== Status.Dead && !(s.index in gameClass.activeLeaves));
    const count = aliveStudents.length;

    document.getElementById('previewCount').textContent = count + ' 人';
    document.getElementById('previewCost').textContent = (count * 100) + ' 元';
    document.getElementById('previewIncome').textContent = (fee * count) + ' 元';

    const net = (fee - 100) * count;
    const netEl = document.getElementById('previewNet');
    netEl.textContent = (net >= 0 ? '+' : '') + net + ' 元';
    netEl.style.color = net >= 0 ? '#2ecc71' : '#e74c3c';

    if (fee < 100) {
        const pos = Math.round((100 - fee) / 100 * 15);
        const ene = Math.round((100 - fee) / 100 * 15);
        document.getElementById('previewEnthusiasm').textContent = '+' + pos;
        document.getElementById('previewEnthusiasm').style.color = '#2ecc71';
        document.getElementById('previewEnergy').textContent = '+' + ene;
        document.getElementById('previewEnergy').style.color = '#2ecc71';
    } else {
        const pos = -Math.round((fee - 100) / 100 * 10);
        document.getElementById('previewEnthusiasm').textContent = pos;
        document.getElementById('previewEnthusiasm').style.color = '#e74c3c';
        document.getElementById('previewEnergy').textContent = '0';
        document.getElementById('previewEnergy').style.color = 'rgba(255,255,255,0.6)';
    }
}

function showActivityModal() {
    if (!gameClass) return;
    const modal = document.getElementById('activityModal');
    modal.style.display = 'flex';
    updateActivityPreview();
    document.getElementById('activityFeeInput').value = 0;
}

function closeActivityModal() {
    document.getElementById('activityModal').style.display = 'none';
}

function organizeActivity() {
    if (!gameClass) return;

    const fee = parseInt(document.getElementById('activityFeeInput').value) || 0;
    const result = gameClass.organizeActivity(fee);
    closeActivityModal();
    renderAll();
    showNotification(result.success ? 'success' : 'error', '组织活动', result.message);
}

// ============================================================================
// 贷款系统
// ============================================================================

function calcLoanRate(duration) {
    // 期限1~20周，利率20%~60%，线性增长
    return 0.2 + (duration - 1) * (0.6 - 0.2) / 19;
}

function borrowLoan(amount, duration) {
    if (!gameClass) return { success: false, message: '游戏未开始' };
    if (gameClass.loan.amount > 0) {
        return { success: false, message: '已有未还清的贷款！' };
    }
    if (amount < 100 || amount > 5000) {
        return { success: false, message: '贷款金额需在 100~5000 元之间！' };
    }
    if (duration < 1 || duration > 20) {
        return { success: false, message: '还款期限需在 1~20 周之间！' };
    }
    const totalWeeks = TOTAL_SEMESTERS * SEMESTER_LENGTH;
    if (gameClass.week + duration > totalWeeks) {
        return { success: false, message: '还款期限超出游戏剩余时间！' };
    }

    const rate = calcLoanRate(duration);
    gameClass.loan.amount = amount;
    gameClass.loan.totalOwed = amount;
    gameClass.loan.weekBorrowed = gameClass.week;
    gameClass.loan.dueWeek = gameClass.week + duration;
    gameClass.loan.weeklyRate = rate;
    gameClass.loan.duration = duration;
    gameClass.teacher.salary += amount;
    addLogEntry(`🏦 借款 ${amount} 元，${duration} 周后到期，利率 ${Math.round(rate * 100)}%/周`, 'highlight');
    return { success: true, message: `借款成功！\n到账：${amount} 元\n利率：${Math.round(rate * 100)}%/周\n期限：${duration} 周（第 ${gameClass.loan.dueWeek} 周到期）` };
}

function repayLoan() {
    if (!gameClass) return { success: false, message: '游戏未开始' };
    if (gameClass.loan.amount === 0) {
        return { success: false, message: '没有未还清的贷款！' };
    }
    const totalOwed = gameClass.loan.totalOwed;
    if (gameClass.teacher.salary < totalOwed) {
        return { success: false, message: `资金不足！需要 ${totalOwed} 元，当前工资：${gameClass.teacher.salary} 元` };
    }
    gameClass.teacher.salary -= totalOwed;
    gameClass.loan.amount = 0;
    gameClass.loan.totalOwed = 0;
    gameClass.loan.weekBorrowed = 0;
    gameClass.loan.dueWeek = 0;
    gameClass.loan.weeklyRate = 0;
    gameClass.loan.duration = 0;
    addLogEntry(`✅ 贷款已还清，共支付 ${totalOwed} 元`, 'highlight');
    return { success: true, message: `贷款已还清！\n共支付：${totalOwed} 元` };
}

function showLoanModal() {
    if (!gameClass) return;
    const modal = document.getElementById('loanModal');
    modal.style.display = 'flex';
    document.getElementById('loanAmountInput').value = 500;
    document.getElementById('loanDurationInput').value = 5;
    updateLoanModal();
    updateLoanPreview();
}

function closeLoanModal() {
    document.getElementById('loanModal').style.display = 'none';
}

function updateLoanModal() {
    const loan = gameClass.loan;
    const statusEl = document.getElementById('loanStatus');
    const actionsEl = document.getElementById('loanActions');
    const repayEl = document.getElementById('loanRepayActions');

    if (loan.amount > 0) {
        actionsEl.style.display = 'none';
        repayEl.style.display = 'flex';
        const repayBtn = document.getElementById('repayLoanBtn');
        const canRepay = gameClass.teacher.salary >= loan.totalOwed;
        repayBtn.disabled = !canRepay;
        repayBtn.textContent = canRepay ? `立即还款（${loan.totalOwed} 元）` : `资金不足（需 ${loan.totalOwed} 元）`;
        statusEl.innerHTML = `
            <div class="loan-card">
                <div class="loan-card-row"><span>借款金额</span><span>${loan.amount} 元</span></div>
                <div class="loan-card-row"><span>当前欠款</span><span style="color:#e74c3c;font-weight:700;">${loan.totalOwed} 元</span></div>
                <div class="loan-card-row"><span>利率</span><span>${Math.round(loan.weeklyRate * 100)}%/周</span></div>
                <div class="loan-card-row"><span>借款周</span><span>第 ${loan.weekBorrowed} 周</span></div>
                <div class="loan-card-row"><span>截止周</span><span>第 ${loan.dueWeek} 周</span></div>
                <div class="loan-card-row"><span>剩余时间</span><span>${Math.max(0, loan.dueWeek - gameClass.week)} 周</span></div>
            </div>
        `;
    } else {
        actionsEl.style.display = 'block';
        repayEl.style.display = 'none';
        statusEl.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.5);padding:10px 0;">当前无贷款</p>';
    }
}

function updateLoanPreview() {
    const amount = parseInt(document.getElementById('loanAmountInput').value) || 0;
    const duration = parseInt(document.getElementById('loanDurationInput').value) || 1;
    const d = Math.max(1, Math.min(20, duration));
    const rate = calcLoanRate(d);
    const ratePct = Math.round(rate * 100);

    document.getElementById('loanRateDisplay').textContent = ratePct;
    document.getElementById('previewRate').textContent = ratePct + '%';
    document.getElementById('previewWeek1').textContent = Math.round(amount * (1 + rate)) + ' 元';

    const week5 = Math.round(amount * Math.pow(1 + rate, 5));
    document.getElementById('previewWeek5').textContent = (d >= 5 ? week5 + ' 元' : '—');

    const due = Math.round(amount * Math.pow(1 + rate, d));
    document.getElementById('previewDue').textContent = (amount > 0 ? due + ' 元' : '—');
}

function holdClassMeeting() {
    if (!gameClass) return;

    const meetingType = document.getElementById('meetingTypeSelect').value;
    const result = gameClass.holdClassMeeting(ClassMeetingType[meetingType]);
    renderAll();
    if (result.success) {
        showNotification('success', '班会召开成功', result.message);
    } else {
        showNotification('error', '班会召开失败', result.message);
    }
}

function startInstigateMode() {
    if (!gameClass || selectedStudentIndex === null) {
        showNotification('warning', '提示', '请先选择一个学生！');
        return;
    }

    instigateMode = true;
    document.getElementById('cancelModeBtn').style.display = 'inline-block';
    
    // 在日志中添加提示
    if (gameClass && gameClass.logCallback) {
        gameClass.log('💡 请点击另一个学生的座位进行挑拨', 'highlight');
    }
    
    renderSeatingGrid();
}

function handleInstigateClick(col, row, student) {
    if (!gameClass || selectedStudentIndex === null) return;

    if (!student) {
        showNotification('warning', '提示', '请点击另一个学生的座位进行挑拨！');
        return;
    }

    if (student.index === selectedStudentIndex) {
        showNotification('warning', '提示', '不能挑拨自己！');
        return;
    }

    const result = gameClass.instigate(selectedStudentIndex, student.index);
    if (result.success) {
        cancelMode();
        renderAll();
        showNotification('success', '挑拨成功', result.message);
    } else {
        showNotification('error', '挑拨失败', result.message);
        cancelMode();
        renderAll();
    }
}

function buyMedicine() {
    if (!gameClass) return;

    const result = gameClass.buyMedicine();
    if (result.success) {
        renderAll();
        showNotification('success', '购买成功', result.message);
    } else {
        showNotification('error', '购买失败', result.message);
    }
}

function showLeaveRequests() {
    if (!gameClass) return;

    const container = document.getElementById('leaveModal');
    const listElement = document.getElementById('leaveRequestsList');

    // 同步设置单选框的值
    document.querySelectorAll('input[name="leaveAutoHandle"]').forEach(radio => {
        radio.checked = (radio.value === leaveAutoHandle);
    });

    if (gameClass.pendingLeaveRequests.length === 0) {
        listElement.innerHTML = '<p style="color: rgba(255,255,255,0.65);">没有待处理的请假申请。</p>';
    } else {
        listElement.innerHTML = '';
        gameClass.pendingLeaveRequests.forEach((req, index) => {
            const reqElement = document.createElement('div');
            reqElement.className = 'leave-request-item';
            reqElement.innerHTML = `
                <div class="leave-request-info">
                    <strong>学生 ${req.student.name}</strong>
                    <span>申请请假 ${req.duration} 周</span>
                    <div class="leave-request-reason">理由：${req.reason}</div>
                </div>
                <div class="leave-request-actions">
                    <button class="btn btn-success btn-sm" onclick="handleSingleLeaveRequest(${index}, true)">批准</button>
                    <button class="btn btn-danger btn-sm" onclick="handleSingleLeaveRequest(${index}, false)">拒绝</button>
                </div>
            `;
            listElement.appendChild(reqElement);
        });
    }

    container.style.display = 'flex';
}

function handleSingleLeaveRequest(index, approved) {
    if (!gameClass) return;
    
    const success = gameClass.approveLeaveRequest(index, approved);
    if (success) {
        renderAll();
        // 如果还有其他待处理的请假请求，刷新列表
        if (gameClass.pendingLeaveRequests.length > 0) {
            showLeaveRequests();
        } else {
            document.getElementById('leaveModal').style.display = 'none';
        }
    } else {
        showNotification('error', '处理失败', '处理失败！');
    }
}

function showLeaveRequestModal() {
    showLeaveRequests();
}

// 全局函数，用于处理单个请假请求
window.handleSingleLeaveRequest = handleSingleLeaveRequest;

// 全局函数，用于处理单个请假请求
window.handleSingleLeaveRequest = handleSingleLeaveRequest;

function addLogEntry(message, type = 'normal') {
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = message;
    logPanel.appendChild(entry);
    logPanel.scrollTop = logPanel.scrollHeight;
}

function renderExamHistory() {
    if (!gameClass) return;

    examHistory.innerHTML = '';

    if (gameClass.contestsHistory.length === 0) {
        examHistory.innerHTML = '<div style="color: rgba(255,255,255,0.4); font-size: 0.85em; text-align: center; padding: 20px;">暂无考试记录</div>';
        return;
    }

    // 从后往前遍历，让最新的考试记录在最上面
    for (let i = gameClass.contestsHistory.length - 1; i >= 0; i--) {
        const exam = gameClass.contestsHistory[i];
        const examItem = document.createElement('div');
        examItem.className = 'exam-item';
        examItem.onclick = () => showExamDetail(exam);

        const weekInfo = exam.week <= 60 ? `第${exam.week}周` : '高考';
        const examType = exam.type === ContestType.Mid ? '期中' :
                        exam.type === ContestType.End ? '期末' :
                        exam.type === ContestType.Final ? '高考' : '考试';

        examItem.innerHTML = `
            <div class="exam-header">
                <span class="exam-week">${weekInfo}</span>
                <span class="exam-type" data-type="${examType}">${examType}</span>
            </div>
            <div class="exam-average">
                班级平均分：<span class="exam-average-value">${exam.average.toFixed(1)}</span>
            </div>
        `;

        examHistory.appendChild(examItem);
    }
}

function showExamDetail(exam) {
    if (!exam) return;

    document.getElementById('examDetailTitle').textContent =
        `第${exam.week}周 ${exam.type === ContestType.Mid ? '期中' : exam.type === ContestType.End ? '期末' : '高考'}考试详情`;

    const content = document.getElementById('examDetailContent');
    content.innerHTML = '';

    // 添加考试统计信息
    const statsDiv = document.createElement('div');
    statsDiv.className = 'exam-stats';
    
    const sortedDetails = [...exam.details].sort((a, b) => b.totalScore - a.totalScore);
    const maxScore = sortedDetails[0].totalScore;
    const minScore = sortedDetails[sortedDetails.length - 1].totalScore;
    const scoreRange = maxScore - minScore;
    
    statsDiv.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">参与人数：</span>
            <span class="stat-value">${exam.details.length}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">平均分：</span>
            <span class="stat-value">${exam.average.toFixed(1)}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">最高分：</span>
            <span class="stat-value">${maxScore.toFixed(1)}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">最低分：</span>
            <span class="stat-value">${minScore.toFixed(1)}</span>
        </div>
    `;
    content.appendChild(statsDiv);

    // 分隔线
    const divider = document.createElement('div');
    divider.className = 'exam-divider';
    divider.innerHTML = '<div class="divider-line"></div>';
    content.appendChild(divider);

    // 学生成绩列表
    for (let i = 0; i < sortedDetails.length; i++) {
        const result = sortedDetails[i];
        const item = document.createElement('div');
        item.className = 'exam-detail-item';

        const scoresHtml = Object.entries(result.scores).map(([subject, score]) => {
            return `<span>${getSubjectName(Subject[subject])}: ${score}</span>`;
        }).join(' | ');

        item.innerHTML = `
            <div class="detail-name">
                <span class="detail-rank">#${i + 1}</span>
                ${result.name}
            </div>
            <div class="detail-score">总分：<span class="detail-score-value">${result.totalScore.toFixed(1)}</span></div>
            <div class="detail-scores">${scoresHtml}</div>
        `;

        content.appendChild(item);
    }

    examDetailModal.style.display = 'flex';
}

function getSubjectEnum(name) {
    switch (name) {
        case 'Chinese': return Subject.Chinese;
        case 'Maths': return Subject.Maths;
        case 'English': return Subject.English;
        case 'Physics': return Subject.Physics;
        case 'Chemistry': return Subject.Chemistry;
        case 'Biology': return Subject.Biology;
        case 'Politics': return Subject.Politics;
        case 'History': return Subject.History;
        case 'Geography': return Subject.Geography;
        default: return null;
    }
}

function showEndGameScreen() {
    if (!gameClass) return;

    const aliveStudents = gameClass.students.filter(s => s.status !== Status.Dead);
    const totalStudents = gameClass.studentNum;
    const aliveRate = (aliveStudents.length / totalStudents * 100).toFixed(1);

    const admissions = aliveStudents.filter(s => s.admittedUniversity);
    const keyAdmissions = admissions.filter(s =>
        s.admittedUniversity.tier === UniversityTier.TIER_985 ||
        s.admittedUniversity.tier === UniversityTier.TIER_211 ||
        s.admittedUniversity.tier === UniversityTier.TIER_DOUBLE_FIRST
    );
    const keyRate = (keyAdmissions.length / aliveStudents.length * 100).toFixed(1);

    document.getElementById('endAlive').textContent = `${aliveStudents.length}/${totalStudents}`;
    document.getElementById('endAliveRate').textContent = `存活率 ${aliveRate}%`;
    document.getElementById('endKeyRate').textContent = `${keyRate}%`;
    document.getElementById('endSalary').textContent = gameClass.teacher.salary;
    document.getElementById('endHealth').textContent = `剩余血量: ${gameClass.teacher.health}`;

    // 显示失败原因
    if (gameClass.failReason) {
        document.getElementById('endReasonBadge').textContent = '游戏失败';
        document.getElementById('endTitle').textContent = gameClass.failReason;
    } else {
        document.getElementById('endReasonBadge').textContent = '游戏结束';
        document.getElementById('endTitle').textContent = '游戏结束';
    }

    let evalText, medal;
    // 死亡率超过20%（存活率低于80%）
    if (aliveRate < 80) {
        evalText = '沟槽班主任';
        medal = '💀';
    } else if (keyRate >= 80) {
        evalText = '特级教师';
        medal = '🏆';
    } else if (keyRate >= 60) {
        evalText = '优秀班主任';
        medal = '🎖️';
    } else if (keyRate >= 40) {
        evalText = '合格班主任';
        medal = '📜';
    } else {
        evalText = '需改进';
        medal = '📝';
    }

    document.getElementById('endEvalTitle').textContent = evalText;
    document.getElementById('endMedal').textContent = medal;

    const tierBars = document.getElementById('endTierBars');
    tierBars.innerHTML = '';

    const tiers = [
        { name: '985 工程', tier: UniversityTier.TIER_985, color: '#f39c12' },
        { name: '211 工程', tier: UniversityTier.TIER_211, color: '#e74c3c' },
        { name: '双一流', tier: UniversityTier.TIER_DOUBLE_FIRST, color: '#9b59b6' },
        { name: '一本', tier: UniversityTier.TIER_TIER1, color: '#3498db' },
        { name: '二本', tier: UniversityTier.TIER_TIER2, color: '#2ecc71' },
        { name: '三本/专科', tier: UniversityTier.TIER_TIER3, color: '#95a5a6' }
    ];

    for (let tierInfo of tiers) {
        const count = admissions.filter(s => s.admittedUniversity.tier === tierInfo.tier).length;
        if (count > 0) {
            const percentage = (count / aliveStudents.length * 100).toFixed(1);
            const bar = document.createElement('div');
            bar.className = 'tier-bar';
            bar.innerHTML = `
                <div class="tier-name">${tierInfo.name}</div>
                <div class="tier-bar-fill" style="width: ${percentage}%; background: ${tierInfo.color};"></div>
                <div class="tier-count">${count}人 (${percentage}%)</div>
            `;
            tierBars.appendChild(bar);
        }
    }

    // 生成缅怀区（死亡学生名单）
    const deadStudents = gameClass.students.filter(s => s.status === Status.Dead);
    const memorialSection = document.getElementById('endMemorialSection');
    const memorialList = document.getElementById('endMemorialList');

    if (deadStudents.length > 0) {
        memorialSection.style.display = 'block';
        memorialList.innerHTML = '';

        const reasonText = {
            'energy': '因精力耗尽而不幸离世',
            'killed': '被你击毙',
            'expelled': '被劝退',
            'sold': '积极参与三角贸易',
            'event': '被天花板掉下来砸死',
            'smoking': '在政教处门口抽烟',
            'speech': '吃子弹了'
        };

        deadStudents.forEach(student => {
            const memorialCard = document.createElement('div');
            memorialCard.className = 'memorial-card';
            memorialCard.innerHTML = `
                <div class="memorial-icon">🕯️</div>
                <div class="memorial-name">${student.name}</div>
                <div class="memorial-reason">${reasonText[student.deathReason] || '不幸离世'}</div>
            `;
            memorialList.appendChild(memorialCard);
        });
    } else {
        memorialSection.style.display = 'none';
    }

    // 生成学生录取名单
    const studentsList = document.getElementById('endStudentsList');
    studentsList.innerHTML = '';

    // 按高考成绩从高到低排序
    const sortedStudents = aliveStudents.sort((a, b) => (b.gaokaoScore || 0) - (a.gaokaoScore || 0));

    for (let i = 0; i < sortedStudents.length; i++) {
        const student = sortedStudents[i];
        const rank = i + 1;
        const score = student.gaokaoScore || 0;
        const university = student.admittedUniversity;

        // 获取排名徽章样式
        let rankBadgeClass = 'rank-bronze';
        let rankIcon = `#${rank}`;
        if (rank === 1) {
            rankBadgeClass = 'rank-gold';
            rankIcon = '🥇';
        } else if (rank === 2) {
            rankBadgeClass = 'rank-silver';
            rankIcon = '🥈';
        } else if (rank === 3) {
            rankBadgeClass = 'rank-silver';
            rankIcon = '🥉';
        }

        // 获取各科成绩
        let scoresHtml = '';
        if (student.gaokaoScores && Object.keys(student.gaokaoScores).length > 0) {
            scoresHtml = Object.entries(student.gaokaoScores).map(([subject, score]) => {
                const subjectName = getSubjectName(Subject[subject]);
                return `<span class="subject-score">${subjectName}: ${score}</span>`;
            }).join(' | ');
        } else {
            // 如果没有各科成绩，则显示总成绩
            scoresHtml = `<span class="subject-score">总成绩: ${score.toFixed(1)}</span>`;
        }

        const studentCard = document.createElement('div');
        studentCard.className = 'student-result-card';

        studentCard.innerHTML = `
            <div class="student-result-header">
                <div class="student-result-rank ${rankBadgeClass}">${rankIcon} 第${rank}名</div>
                <div class="student-result-name">${student.name}</div>
                <div class="student-result-score">${score.toFixed(1)}分</div>
            </div>
            <div class="student-result-scores">${scoresHtml}</div>
            <div class="student-result-university">
                ${university ? 
                    `<span class="university-badge" style="background: ${getTierColor(university.tier)}">${university.name}</span>` : 
                    '<span class="university-badge" style="background: #95a5a6;">落榜</span>'}
            </div>
        `;

        studentsList.appendChild(studentCard);
    }

    endGameScreen.style.display = 'flex';
}

// 辅助函数：获取大学等级颜色
function getTierColor(tier) {
    switch (tier) {
        case UniversityTier.TIER_985:
            return '#f39c12';
        case UniversityTier.TIER_211:
            return '#e74c3c';
        case UniversityTier.TIER_DOUBLE_FIRST:
            return '#9b59b6';
        case UniversityTier.TIER_TIER1:
            return '#3498db';
        case UniversityTier.TIER_TIER2:
            return '#2ecc71';
        case UniversityTier.TIER_TIER3:
            return '#95a5a6';
        default:
            return '#95a5a6';
    }
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', init);

// ============================================================================
// 控制台调试函数 - 运动会系统
// ============================================================================

/**
 * 打开运动会活动选择界面
 * 在浏览器控制台中输入: openSportsDayEvent()
 */
window.openSportsDayEvent = function() {
    if (typeof openSportsDay === 'function') {
        openSportsDay();
    } else {
        console.error('❌ 运动会系统未加载，请确保 sports_day.js 已正确加载');
    }
};

console.log('🏆 运动会系统已就绪');
console.log('📝 使用 openSportsDayEvent() 打开运动会活动选择界面');