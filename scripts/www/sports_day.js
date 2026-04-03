// ============================================================================
// 运动会系统
// ============================================================================

// 运动会活动类型
const SportsEventType = {
    SHINE_HUMAN_TEEN: 'shine_human_teen',  // 闪耀！类人少年
    JAVELIN_RELAY: 'javelin_relay'          // 标枪接力
};

// 运动会活动信息
const SPORTS_EVENTS = [
    {
        id: SportsEventType.SHINE_HUMAN_TEEN,
        name: '闪耀！类人少年',
        day: 1,
        description: '选择8名学生组成4个赛马组合，使用卡牌对战',
        icon: '✨'
    },
    {
        id: SportsEventType.JAVELIN_RELAY,
        name: '标枪接力',
        day: 2,
        description: '选择5名学生依次投掷标枪进行接力',
        icon: '🏃‍♂️'
    }
];

// 卡牌类型
const CardType = {
    BOOST: 'boost',           // 加速
    SLOW: 'slow',             // 减速
    SHIELD: 'shield',         // 护盾
    ATTACK: 'attack',         // 攻击
    SWAP: 'swap',             // 交换位置
    EMPTY: 'empty',           // 空白卡牌（临时）
    SPECIAL: 'special'        // 特殊效果
};

// 游戏角色类型
const CharacterType = {
    WEI: 'wei',      // 魏教授
    WANG: 'wang',    // 王老师
    QIN: 'qin'       // 秦老师
};

// 角色数据
const SportsCharacterData = {
    wei: {
        name: '魏教授',
        title: '物理老师'
    },
    wang: {
        name: '王老师',
        title: '化学老师'
    },
    qin: {
        name: '秦老师',
        title: '生物老师'
    }
};

// 所有卡牌定义
const ALL_CARDS = {
    // 魏教授专属牌
    wei_meaningless: {
        id: 'wei_meaningless',
        name: '何意味',
        subtitle: '大家都打过羽毛球吧',
        effect: '使用意味不明的奇妙比喻使骑手眩晕，在这个回合保持不动',
        character: CharacterType.WEI,
        type: CardType.SPECIAL,
        target: 'selected',
        execute: (pairState) => {
            // 不移动
        }
    },
    wei_reference: {
        id: 'wei_reference',
        name: '变换参考系',
        subtitle: '对了或者错了',
        effect: '使骑手在这个回合，前进或后退2次',
        character: CharacterType.WEI,
        type: CardType.SPECIAL,
        target: 'selected',
        execute: (pairState) => {
            const direction = Math.random() < 0.5 ? 1 : -1;
            pairState.targetPosition = Math.max(0, Math.min(4, pairState.targetPosition + direction * 2));
        }
    },
    wei_paper: {
        id: 'wei_paper',
        name: '拿张A4纸',
        subtitle: '这才是理科好的学生',
        effect: '使骑手沉迷计算，在这个回合70%概率倒退1次',
        character: CharacterType.WEI,
        type: CardType.SPECIAL,
        target: 'selected',
        execute: (pairState) => {
            if (Math.random() < 0.7) {
                pairState.targetPosition = Math.max(0, pairState.targetPosition - 1);
            }
        }
    },
    wei_rejuvenate: {
        id: 'wei_rejuvenate',
        name: '返老还童',
        subtitle: '大家看我不像四十多岁吧',
        effect: '使骑手70%概率前进一次',
        character: CharacterType.WEI,
        type: CardType.SPECIAL,
        target: 'selected',
        execute: (pairState) => {
            if (Math.random() < 0.7) {
                pairState.targetPosition = Math.min(4, pairState.targetPosition + 1);
            }
        }
    },
    wei_solved: {
        id: 'wei_solved',
        name: '这不解完了吗',
        subtitle: '',
        effect: '所有骑手在这一回合不移动',
        character: CharacterType.WEI,
        type: CardType.SPECIAL,
        target: 'all',
        execute: (allStates) => {
            // 所有骑手不移动，在回合处理时会特殊处理
            return 'freeze_all';
        }
    },

    // 王老师专属牌
    wang_chromium: {
        id: 'wang_chromium',
        name: '重铬酸根',
        subtitle: '橙了',
        effect: '将骑手和其上方赛道的骑手绑定在一起',
        character: CharacterType.WANG,
        type: CardType.SPECIAL,
        target: 'selected',
        execute: (pairState, pairIndex, allStates) => {
            if (pairIndex > 0) {
                // 检查自己和上方赛道是否被冻结
                if (pairState.frozen || allStates[pairIndex - 1].frozen) {
                    // 如果任一被冻结，不绑定
                    console.log(`重铬酸根：目标或上方赛道被冻结，绑定失败`);
                    return;
                }
                // 绑定到上方赛道
                pairState.bindTo = pairIndex - 1;
            }
        }
    },
    wang_info: {
        id: 'wang_info',
        name: '信息',
        subtitle: '爸爸！',
        effect: '可以看到对手抽到的牌',
        character: CharacterType.WANG,
        type: CardType.SPECIAL,
        target: 'none',
        execute: () => {
            // "信息"卡牌在抽到时已触发，打出时无效果
            return null;
        }
    },
    wang_chromium3: {
        id: 'wang_chromium3',
        name: '三价铬',
        subtitle: '绿灯！',
        effect: '使骑手前进一次',
        character: CharacterType.WANG,
        type: CardType.BOOST,
        target: 'selected',
        execute: (pairState) => {
            pairState.targetPosition = Math.min(4, pairState.targetPosition + 1);
        }
    },
    wang_no_volume: {
        id: 'wang_no_volume',
        name: '不给体积',
        subtitle: '这不耍流氓吗',
        effect: '所有骑手退到最后',
        character: CharacterType.WANG,
        type: CardType.SPECIAL,
        target: 'all',
        execute: (allStates) => {
            allStates.forEach(state => {
                state.targetPosition = POSITION.LAST;
            });
        }
    },
    wang_time: {
        id: 'wang_time',
        name: '14:10',
        subtitle: '快点！',
        effect: '所有骑手70%概率前进一次',
        character: CharacterType.WANG,
        type: CardType.SPECIAL,
        target: 'all',
        execute: (allStates) => {
            allStates.forEach(state => {
                if (Math.random() < 0.7) {
                    state.targetPosition = Math.min(4, state.targetPosition + 1);
                }
            });
        }
    },

    // 秦老师专属牌
    qin_skylark: {
        id: 'qin_skylark',
        name: '百灵鸟',
        subtitle: '',
        effect: '使前面的前进，后面的后退',
        character: CharacterType.QIN,
        type: CardType.SPECIAL,
        target: 'all',
        execute: (allStates) => {
            allStates.forEach(state => {
                // 根据规则：第2身位前进，第4身位后退，其他不动
                if (state.targetPosition === POSITION.BACK) {  // 第2身位
                    state.targetPosition = Math.min(4, state.targetPosition + 1);
                } else if (state.targetPosition === POSITION.FRONT) {  // 第4身位
                    state.targetPosition = Math.max(0, state.targetPosition - 1);
                }
                // 第1身位(LAST)、第3身位(MIDDLE)、第5身位(FIRST)保持不变
            });
        }
    },
    qin_genius: {
        id: 'qin_genius',
        name: '小天才',
        subtitle: '一次全印完就好了',
        effect: '下一回合可以多抽1张牌',
        character: CharacterType.QIN,
        type: CardType.SPECIAL,
        target: 'none',
        execute: () => {
            return 'draw_extra';
        }
    },
    qin_what: {
        id: 'qin_what',
        name: '你在干什么',
        subtitle: '',
        effect: '随机打乱所有选手位置',
        character: CharacterType.QIN,
        type: CardType.SPECIAL,
        target: 'all',
        execute: (allStates) => {
            const positions = [0, 1, 2, 3, 4];
            // 随机打乱位置
            for (let i = positions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [positions[i], positions[j]] = [positions[j], positions[i]];
            }
            allStates.forEach((state, index) => {
                state.targetPosition = positions[index];
            });
        }
    },
    qin_kill: {
        id: 'qin_kill',
        name: '直接毙了',
        subtitle: '',
        effect: '使骑手不动，直到比赛结束',
        character: CharacterType.QIN,
        type: CardType.SPECIAL,
        target: 'selected',
        execute: (pairState) => {
            pairState.frozen = true;
        }
    },

    // 公共牌
    common_empty: {
        id: 'common_empty',
        name: '空白卡牌',
        subtitle: '',
        effect: '直接进入下一回合',
        character: 'common',
        type: CardType.EMPTY,
        target: 'none',
        execute: () => {
            // 无效果
        }
    },
    common_bio: {
        id: 'common_bio',
        name: '做生物',
        subtitle: '忘掉王东方',
        effect: '如果对手是王老师，使其所出的牌无效',
        character: 'common',
        type: CardType.SPECIAL,
        target: 'opponent',
        execute: () => {
            return 'counter_wang';
        }
    },
    common_xuda: {
        id: 'common_xuda',
        name: '徐达逸',
        subtitle: '秦老师我想你了',
        effect: '如果对手是秦老师，使其所出的牌无效',
        character: 'common',
        type: CardType.SPECIAL,
        target: 'opponent',
        execute: () => {
            return 'counter_qin';
        }
    },
    common_boost: {
        id: 'common_boost',
        name: '加速',
        subtitle: '',
        effect: '使骑手60%概率前进一次',
        character: 'common',
        type: CardType.BOOST,
        target: 'selected',
        execute: (pairState) => {
            if (Math.random() < 0.6) {
                pairState.targetPosition = Math.min(4, pairState.targetPosition + 1);
            }
        }
    },
    common_slow: {
        id: 'common_slow',
        name: '减速',
        subtitle: '',
        effect: '使骑手60%概率后退一次',
        character: 'common',
        type: CardType.SLOW,
        target: 'selected',
        execute: (pairState) => {
            if (Math.random() < 0.6) {
                pairState.targetPosition = Math.max(0, pairState.targetPosition - 1);
            }
        }
    },
    common_random: {
        id: 'common_random',
        name: '乱跑',
        subtitle: '',
        effect: '使骑手移到随机位置',
        character: 'common',
        type: CardType.SPECIAL,
        target: 'selected',
        execute: (pairState) => {
            const randomPos = Math.floor(Math.random() * 5);
            pairState.targetPosition = randomPos;
        }
    },
    common_steady: {
        id: 'common_steady',
        name: '稳中求胜',
        subtitle: '',
        effect: '前进1次，但下回合无法抽取新卡牌',
        character: 'common',
        type: CardType.BOOST,
        target: 'selected',
        execute: (pairState) => {
            pairState.targetPosition = Math.min(4, pairState.targetPosition + 1);
            return 'skip_next_draw';
        }
    },
    common_surpass: {
        id: 'common_surpass',
        name: '超越',
        subtitle: '',
        effect: '如果骑手在后面，使其前进到中间',
        character: 'common',
        type: CardType.BOOST,
        target: 'selected',
        execute: (pairState) => {
            if (pairState.targetPosition <= POSITION.BACK) {
                pairState.targetPosition = POSITION.MIDDLE;
            }
        }
    },
    common_double: {
        id: 'common_double',
        name: '连击',
        subtitle: '',
        effect: '使骑手连续执行两次移动判定',
        character: 'common',
        type: CardType.SPECIAL,
        target: 'selected',
        execute: (pairState) => {
            // 第一次移动
            const dir1 = Math.random() < 0.5 ? 1 : -1;
            pairState.targetPosition = Math.max(0, Math.min(4, pairState.targetPosition + dir1));
            // 第二次移动
            const dir2 = Math.random() < 0.5 ? 1 : -1;
            pairState.targetPosition = Math.max(0, Math.min(4, pairState.targetPosition + dir2));
        }
    },
    common_suppress: {
        id: 'common_suppress',
        name: '压制',
        subtitle: '',
        effect: '如果骑手在最前，使所有其他骑手后退1次',
        character: 'common',
        type: CardType.SPECIAL,
        target: 'selected',
        execute: (pairState, pairIndex, allStates) => {
            if (pairState.targetPosition === POSITION.FIRST) {
                allStates.forEach((state, index) => {
                    if (index !== pairIndex) {
                        state.targetPosition = Math.max(0, state.targetPosition - 1);
                    }
                });
            }
        }
    },
    common_sprint: {
        id: 'common_sprint',
        name: '冲刺！',
        subtitle: '',
        effect: '强制前进2次，消耗赛人40精力，骑手20精力',
        character: 'common',
        type: CardType.SPECIAL,
        target: 'selected',
        execute: (pairState, pairIndex, allStates, gameClass) => {
            // 强制前进2次
            pairState.targetPosition = Math.min(4, pairState.targetPosition + 2);
            // 消耗精力（需要在applyCardEffect中处理）
            return { type: 'sprint', pairIndex };
        }
    },
    common_last_chance: {
        id: 'common_last_chance',
        name: '最后一搏！',
        subtitle: '',
        effect: '强制前进3次，赛人赛后直接死亡',
        character: 'common',
        type: CardType.SPECIAL,
        target: 'selected',
        execute: (pairState, pairIndex, allStates, gameClass) => {
            // 强制前进3次
            pairState.targetPosition = Math.min(4, pairState.targetPosition + 3);
            // 标记赛人赛后死亡
            pairState.willDieAfterRace = true;
            return { type: 'last_chance', pairIndex };
        }
    },
    common_whip: {
        id: 'common_whip',
        name: '鞭策：小皮鞭抽打！',
        subtitle: '',
        effect: '强制前进一次，消耗赛人10精力',
        character: 'common',
        type: CardType.SPECIAL,
        target: 'selected',
        execute: (pairState, pairIndex, allStates, gameClass) => {
            // 强制前进1次
            pairState.targetPosition = Math.min(4, pairState.targetPosition + 1);
            // 消耗精力（需要在applyCardEffect中处理）
            return { type: 'whip', pairIndex };
        }
    }
};

// 身位（5个）
const POSITION = {
    LAST: 0,      // 最后
    BACK: 1,      // 后方
    MIDDLE: 2,    // 中间（初始位置）
    FRONT: 3,     // 前方
    FIRST: 4      // 最前
};

// ============================================================================
// 闪耀！类人少年 - 活动类
// ============================================================================

class ShineHumanTeenActivity {
    constructor(gameClass) {
        this.gameClass = gameClass;
        this.active = false;
        this.round = 0;
        this.maxRounds = 10;

        // 选中的学生
        this.selectedStudents = [];  // 8个学生索引
        this.pairs = [];  // 4对组合 [{carrier: index, rider: index}]

        // 赌注
        this.playerBet = null;  // 玩家下注的组合索引 (0-3)
        this.betAmount = 0;     // 赌注金额
        this.opponentBet = null;  // 对手下注的组合索引
        this.opponentName = '';   // 对手老师名字

        // 游戏状态
        this.pairStates = [];  // 每个组合的状态 [{position: 2, speed: 0, ...}]
        this.animationFrame = 0;

        // 卡牌
        this.playerCards = [];      // 玩家手牌
        this.opponentCards = [];    // 对手手牌
        this.opponentCard = null;   // 对手打出的牌
        this.currentRoundCard = null;  // 当前回合玩家选中的牌
        this.currentRoundTargetPair = null;  // 当前回合玩家选中的目标组合

        // 对手相关
        this.opponentCards = [];  // 对手手牌
        this.opponentCardIndex = null;  // 对手选中的卡牌索引
        this.opponentTargetPair = null;  // 对手选中的目标组合

        // 卡牌特殊效果
        this.drawExtraNextRound = false;  // 下一回合多抽一张牌
        this.skipNextDraw = false;        // 跳过下一回合抽牌
        this.freezeAllPairs = false;      // 冻结所有组合不移动

        // Canvas中选中的组合（与playerBet独立，用于显示详情或其他功能）
        this.selectedPairInCanvas = null;  // 选中的组合索引 (0-3)

        // 动画
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.roadOffset = 0;  // 跑道偏移量
        this.finishLineX = 0;  // 终点线位置
        this.isFinished = false;
        this.winnerIndex = -1;  // 获胜组合索引
        
        // Resize 监听器
        this.resizeListener = null;
    }

    // 显示活动选择界面
    showActivitySelection() {
        const modal = document.getElementById('sportsDayModal');
        if (!modal) {
            this._createActivityModal();
        } else {
            modal.style.display = 'flex';
        }
    }

    // 显示详情弹窗
    showDetail() {
        const detailModal = document.getElementById('detailModal');
        if (detailModal) {
            detailModal.style.display = 'flex';
        }
    }

    // 隐藏详情弹窗
    hideDetail() {
        const detailModal = document.getElementById('detailModal');
        if (detailModal) {
            detailModal.style.display = 'none';
        }
    }

    // 创建活动模态框
    _createActivityModal() {
        const modal = document.createElement('div');
        modal.id = 'sportsDayModal';
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            z-index: 800;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(4px);
            padding: 0;
        `;

        modal.innerHTML = `
            <div class="modal-content sports-day-selection" style="width: 100vw; height: 100vh; max-width: none; max-height: none; overflow: hidden; display: flex; flex-direction: column; padding: 0; margin: 0;">
                <div class="modal-header" style="flex-shrink: 0;">
                    <h2>🏆 校运会活动</h2>
                </div>
                <div class="modal-body" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px;">
                    <div class="activity-card">
                        <div class="activity-icon">✨</div>
                        <div class="activity-title">闪耀！类人少年</div>
                        <div class="activity-desc">
                            <button class="btn detail-btn" onclick="shineHumanTeen.showDetail()">查看详情</button>
                            <br><br>
                            <span class="activity-reward">🎁 奖励：根据下注获得工资</span>
                        </div>
                        <button class="btn start-activity-btn" onclick="shineHumanTeen.showStudentSelection()">开始活动</button>
                    </div>
                </div>
            </div>
            
            <!-- 详情弹窗 -->
            <div id="detailModal" class="detail-modal" style="display: none;">
                <div class="detail-content">
                    <div class="detail-header">
                        <h3>✨ 闪耀！类人少年 - 详情</h3>
                        <button class="detail-close" onclick="shineHumanTeen.hideDetail()">✕</button>
                    </div>
                    <div class="detail-body">
                        <div class="detail-text">
                            校长喜欢听哈基米。<br><br>
                            那是很多年前的事了，那时十二中的运动会还有着标枪项目，那时的十二中还没有人被天花板砸死。可是这一切都被那次校运会改变了。<br><br>
                            校长刚刚下达了指令，枪毙了几个在开幕式上扮演秦始皇骑北极熊的学生。校长感觉非常惆怅，去年高考，所有班级死亡率都达到了20%以上，没有一个班主任拿到合格等级，校长嚎啕大哭。<br><br>
                            校长不哭了，Ta听到了振聋发聩的"哈基米哦南北路多"。"this is ture music"，ta想着。<br><br>
                            校长冲进广播站，使用mp5逼迫刚刚点了这首歌的学生，交出歌名。<br><br>
                            可是对方拥有更强力的mp7，他们在广播室里互相扫射。<br><br>
                            终于，校长知道了，那首歌叫《蓝莲哈》。<br><br>
                            校长在互联网上搜索到了更多的哈基米音乐，校长停止了嚎啕大哭，ta高兴地满地打滚。<br><br>
                            校长想深入地了解哈基米音乐，ta找到了这样一个链接：https://mzh.moegirl.org.cn/%E8%B5%9B%E9%A9%AC%E5%A8%98_Pretty_Derby<br><br>
                            哇，好燃啊，学生应该把青春挥洒在赛场上，而不是拿着mp5与老师对决<br><br>
                            但是现实中显然不存在赛马娘。福瑞倒是存在，可是赛马娘只有两个马耳，不算福瑞<br><br>
                            这可难不住校长，ta很快想出了一个运动会的新项目，就叫：闪耀！类人少年<br><br>
                            在这个项目里，你需要在自己的班级选择4+4=8（应该是）个学生，四个作为赛人，四个作为骑手，两两组合，赛人在地上光明地爬行，骑手骑在赛人背上，形成四个组合，在赛道上赛跑<br><br>
                            为了增加趣味性，你与隔壁班老师拿工资进行赌博。<br><br>
                            你和隔壁老师各下注一个组合，并且不告诉对方自己的组合。<br><br>
                            由于十二中松弛的校风，你可以使用技能随意干扰比赛选手<br><br>
                            一定要赢啊
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .sports-day-selection {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                max-width: 600px;
            }

            .modal-header h2 {
                color: #e8c76a;
                text-align: center;
                margin: 0;
            }

            .activity-card {
                background: rgba(232, 199, 106, 0.1);
                border: 2px solid #e8c76a;
                border-radius: 12px;
                padding: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin: 10px;
            }

            .activity-card:hover {
                background: rgba(232, 199, 106, 0.2);
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(232, 199, 106, 0.3);
            }

            .activity-icon {
                font-size: 48px;
                text-align: center;
                margin-bottom: 15px;
            }

            .activity-title {
                font-size: 24px;
                font-weight: bold;
                color: #e8c76a;
                text-align: center;
                margin-bottom: 15px;
            }

            .activity-desc {
                color: rgba(255, 255, 255, 0.8);
                text-align: center;
                line-height: 1.6;
            }

            .activity-reward {
                display: inline-block;
                background: rgba(232, 199, 106, 0.2);
                padding: 8px 16px;
                border-radius: 6px;
                margin-top: 10px;
                font-weight: bold;
            }

            .detail-btn {
                background: linear-gradient(135deg, #e8c76a 0%, #c9952a 100%);
                color: #0d1117;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 1em;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(232, 199, 106, 0.3);
            }

            .detail-btn:hover {
                background: linear-gradient(135deg, #ffd700 0%, #e8c76a 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(232, 199, 106, 0.5);
            }

            .start-activity-btn {
                background: rgba(232, 199, 106, 0.2);
                color: #e8c76a;
                border: 2px solid #e8c76a;
                padding: 12px 30px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 1em;
                transition: all 0.3s ease;
                margin-top: 15px;
            }

            .start-activity-btn:hover {
                background: rgba(232, 199, 106, 0.3);
                transform: translateY(-2px);
            }

            /* 详情弹窗样式 */
            .detail-modal {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
                z-index: 900;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .detail-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #e8c76a;
                border-radius: 16px;
                max-width: 700px;
                max-height: 80vh;
                width: 90%;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(232, 199, 106, 0.3);
                animation: slideUp 0.3s ease;
            }

            .detail-header {
                background: rgba(232, 199, 106, 0.15);
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid rgba(232, 199, 106, 0.3);
            }

            .detail-header h3 {
                color: #e8c76a;
                margin: 0;
                font-size: 1.4em;
            }

            .detail-close {
                background: rgba(239, 68, 68, 0.2);
                border: 2px solid #ef4444;
                color: #ef4444;
                width: 40px;
                height: 40px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1.2em;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .detail-close:hover {
                background: rgba(239, 68, 68, 0.4);
                transform: scale(1.1);
            }

            .detail-body {
                padding: 25px;
                overflow-y: auto;
                max-height: calc(80vh - 100px);
            }

            .detail-text {
                color: rgba(255, 255, 255, 0.9);
                line-height: 1.8;
                font-size: 1em;
            }

            .detail-text a {
                color: #e8c76a;
                text-decoration: none;
                border-bottom: 1px dashed #e8c76a;
                transition: all 0.3s ease;
            }

            .detail-text a:hover {
                color: #ffd700;
                border-bottom-color: #ffd700;
            }

            /* 滚动条样式 */
            .detail-body::-webkit-scrollbar {
                width: 8px;
            }

            .detail-body::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }

            .detail-body::-webkit-scrollbar-thumb {
                background: rgba(232, 199, 106, 0.5);
                border-radius: 4px;
            }

            .detail-body::-webkit-scrollbar-thumb:hover {
                background: rgba(232, 199, 106, 0.7);
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;

        document.head.appendChild(style);
    }

    // 显示学生选择界面
    showStudentSelection() {
        const modal = document.getElementById('sportsDayModal');
        
        // 修改modal为全屏显示
        modal.style.justifyContent = 'flex-start';
        modal.style.alignItems = 'flex-start';
        modal.style.padding = '0';
        
        modal.innerHTML = `
            <div class="modal-content" style="width: 100vw; height: 100vh; max-width: none; max-height: none; overflow: hidden; display: flex; flex-direction: column; padding: 0; margin: 0;">
                <div class="modal-header">
                    <h2>✨ 闪耀！类人少年 - 选择学生</h2>
                </div>
                <div class="modal-body" style="flex: 1; overflow: hidden; display: flex; flex-direction: column; padding: 0;">
                    <div class="selection-info">
                        <p>请按顺序选择8名学生：赛人1 → 骑手1 → 赛人2 → 骑手2 → 赛人3 → 骑手3 → 赛人4 → 骑手4</p>
                        <p>已选择: <span id="selectedCount">0</span>/8</p>
                        <div id="selectionProgress" class="selection-progress"></div>
                    </div>
                    <div class="student-grid-container">
                        <div class="student-grid" id="studentGrid"></div>
                    </div>
                    <div class="selection-buttons">
                        <button class="btn" id="confirmSelectionBtn" onclick="shineHumanTeen.confirmStudentSelection()" disabled>确认选择</button>
                        <button class="btn" onclick="shineHumanTeen.clearSelection()">清空选择</button>
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .selection-info {
                background: rgba(232, 199, 106, 0.1);
                padding: 20px;
                border-bottom: 2px solid rgba(232, 199, 106, 0.3);
                margin-bottom: 10px;
                text-align: center;
                flex-shrink: 0;
            }

            .selection-info p {
                margin: 5px 0;
                color: rgba(255, 255, 255, 0.9);
                font-size: 1.2em;
            }

            .selection-progress {
                display: flex;
                gap: 8px;
                justify-content: center;
                margin-top: 10px;
            }

            .progress-slot {
                width: 35px;
                height: 35px;
                border: 2px dashed rgba(232, 199, 106, 0.5);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75em;
                color: rgba(255, 255, 255, 0.5);
                flex-shrink: 0;
            }

            .progress-slot.filled {
                background: rgba(232, 199, 106, 0.3);
                border-color: #e8c76a;
                color: #e8c76a;
                font-weight: bold;
            }

            .progress-slot.carrier {
                background: rgba(52, 152, 219, 0.3);
                border-color: #3498db;
            }

            .progress-slot.rider {
                background: rgba(243, 156, 18, 0.3);
                border-color: #f39c12;
            }

            .student-grid-container {
                flex: 1;
                overflow-y: auto;
                padding: 30px;
                background: rgba(255, 255, 255, 0.02);
                margin-bottom: 0;
            }

            .student-grid {
                            display: grid;
                            grid-template-columns: repeat(9, 1fr);
                            gap: 20px;
                        }
            
                        .student-select-item {
                            background: rgba(255, 255, 255, 0.05);
                            border: 2px solid rgba(232, 199, 106, 0.3);
                            border-radius: 12px;
                            padding: 20px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            text-align: center;
                            position: relative;
                            min-height: 110px;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        }
            
                        .student-select-item:hover {
                            background: rgba(232, 199, 106, 0.1);
                            transform: translateY(-2px);
                            box-shadow: 0 4px 12px rgba(232, 199, 106, 0.4);
                        }
            
                        .student-select-item.selected {
                            background: rgba(232, 199, 106, 0.2);
                            border-color: #e8c76a;
                            box-shadow: 0 0 15px rgba(232, 199, 106, 0.6);
                        }
            
                        .student-select-item .selection-number {
                            position: absolute;
                            top: -10px;
                            right: -10px;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            background: #e8c76a;
                            color: #0d1117;
                            font-weight: bold;
                            font-size: 1em;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                        }
            
                        .student-select-item .name {
                            color: #fff;
                            font-weight: bold;
                            margin-bottom: 8px;
                            font-size: 0.95em;
                        }
            
                        .student-select-item .role {
                            color: rgba(255, 255, 255, 0.6);
                            font-size: 0.85em;
                        }
            .selection-buttons {
                display: flex;
                gap: 20px;
                justify-content: center;
                flex-shrink: 0;
                padding: 20px;
                background: rgba(0, 0, 0, 0.3);
            }

            .selection-buttons button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* 滚动条样式 */
            .student-grid-container::-webkit-scrollbar {
                width: 8px;
            }

            .student-grid-container::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }

            .student-grid-container::-webkit-scrollbar-thumb {
                background: rgba(232, 199, 106, 0.5);
                border-radius: 4px;
            }

            .student-grid-container::-webkit-scrollbar-thumb:hover {
                background: rgba(232, 199, 106, 0.7);
            }

            .selection-buttons button {
                background: #e8c76a;
                color: #0d1117;
                border: none;
                padding: 18px 50px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
                font-size: 1.2em;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(232, 199, 106, 0.3);
            }

            .selection-buttons button:hover {
                background: #ffd700;
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(232, 199, 106, 0.5);
            }

            .selection-buttons button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
        `;

        document.head.appendChild(style);

        // 渲染学生列表
        this._renderStudentGrid();
    }

    // 渲染学生选择网格
    _renderStudentGrid() {
        const grid = document.getElementById('studentGrid');
        if (!grid) return;

        grid.innerHTML = '';

        // 更新选择进度
        const progressDiv = document.getElementById('selectionProgress');
        if (progressDiv) {
            progressDiv.innerHTML = '';
            const roles = ['赛人1', '骑手1', '赛人2', '骑手2', '赛人3', '骑手3', '赛人4', '骑手4'];
            for (let i = 0; i < 8; i++) {
                const slot = document.createElement('div');
                slot.className = 'progress-slot';
                if (i < this.selectedStudents.length) {
                    slot.classList.add('filled');
                    slot.classList.add(i % 2 === 0 ? 'carrier' : 'rider');
                    slot.textContent = i + 1;
                } else {
                    slot.textContent = roles[i];
                }
                progressDiv.appendChild(slot);
            }
        }

        const aliveStudents = this.gameClass.students.filter(s => s.status !== Status.Dead);

        aliveStudents.forEach(student => {
            const selectedIndex = this.selectedStudents.indexOf(student.index);
            const item = document.createElement('div');
            item.className = 'student-select-item';
            if (selectedIndex !== -1) {
                item.classList.add('selected');
            }

            let content = `
                <div class="name">${student.name}</div>
                <div class="role">${student.gender === Gender.Boy ? '男' : '女'}</div>
            `;

            // 如果已选择，显示选择号码和角色
            if (selectedIndex !== -1) {
                const role = selectedIndex % 2 === 0 ? '赛人' : '骑手';
                content = `
                    <div class="selection-number">${selectedIndex + 1}</div>
                    <div class="name">${student.name}</div>
                    <div class="role" style="color: ${selectedIndex % 2 === 0 ? '#3498db' : '#f39c12'}">${role}</div>
                `;
            }

            item.innerHTML = content;

            item.onclick = () => {
                if (this.selectedStudents.includes(student.index)) {
                    this.selectedStudents = this.selectedStudents.filter(i => i !== student.index);
                } else if (this.selectedStudents.length < 8) {
                    this.selectedStudents.push(student.index);
                }

                this._renderStudentGrid();
                document.getElementById('selectedCount').textContent = this.selectedStudents.length;
                document.getElementById('confirmSelectionBtn').disabled = this.selectedStudents.length !== 8;
            };

            grid.appendChild(item);
        });
    }

    // 清空选择
    clearSelection() {
        this.selectedStudents = [];
        this._renderStudentGrid();
        document.getElementById('selectedCount').textContent = '0';
        document.getElementById('confirmSelectionBtn').disabled = true;
    }

    // 确认学生选择
    confirmStudentSelection() {
        if (this.selectedStudents.length !== 8) return;

        // 按顺序配对：赛人1+骑手1，赛人2+骑手2，赛人3+骑手3，赛人4+骑手4
        this.pairs = [];
        for (let i = 0; i < 4; i++) {
            this.pairs.push({
                carrier: this.selectedStudents[i * 2],      // 偶数位：赛人
                rider: this.selectedStudents[i * 2 + 1]     // 奇数位：骑手
            });
        }

        // 显示下注界面
        this.showBettingInterface();
    }

    // 显示下注界面
    showBettingInterface() {
        const modal = document.getElementById('sportsDayModal');

        // 修改modal为全屏显示
        modal.style.justifyContent = 'flex-start';
        modal.style.alignItems = 'flex-start';
        modal.style.padding = '0';

        modal.innerHTML = `
            <div class="modal-content" style="width: 100vw; height: 100vh; max-width: none; max-height: none; overflow: hidden; display: flex; flex-direction: column; padding: 0; margin: 0;">
                <div class="modal-header" style="flex-shrink: 0;">
                    <h2>💰 选择下注组合</h2>
                </div>
                <div class="modal-body" style="flex: 1; overflow: hidden; display: flex; flex-direction: column; padding: 0;">
                    <div class="betting-info" style="flex-shrink: 0;">
                        <p>你的工资: ${this.gameClass.teacher.salary}元</p>
                        <p>对手: ${this.opponentName}</p>
                    </div>
                    <div class="betting-instruction" style="flex-shrink: 0;">
                        <p>👇 请点击下方选择一个组合进行下注</p>
                    </div>
                    <div class="pair-list" id="pairList" style="flex: 1; overflow: auto; padding: 20px;"></div>
                    <div class="betting-controls" style="flex-shrink: 0;">
                        <div class="bet-amount-input">
                            <label>赌注金额:</label>
                            <input type="number" id="betAmountInput" min="0" max="${this.gameClass.teacher.salary}" value="500" step="100">
                        </div>
                        <div class="selected-pair-info">
                            <span>已选择组合: </span>
                            <span id="selectedPairName">未选择</span>
                        </div>
                        <button class="btn" id="startRaceBtn" onclick="shineHumanTeen.startRace()" disabled>开始比赛</button>
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .betting-info {
                background: rgba(232, 199, 106, 0.1);
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 15px;
                text-align: center;
            }

            .betting-info p {
                margin: 5px 0;
                color: rgba(255, 255, 255, 0.9);
                font-size: 1.1em;
            }

            .betting-instruction {
                background: rgba(52, 152, 219, 0.1);
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 20px;
                text-align: center;
                border: 2px dashed #3498db;
            }

            .betting-instruction p {
                margin: 0;
                color: #3498db;
                font-size: 1.1em;
                font-weight: bold;
            }

            .pair-list {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin-bottom: 20px;
                min-height: 200px;
            }

            .pair-item {
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(232, 199, 106, 0.3);
                border-radius: 8px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .pair-item:hover {
                background: rgba(232, 199, 106, 0.1);
            }

            .pair-item.selected {
                background: rgba(232, 199, 106, 0.2);
                border-color: #e8c76a;
            }

            .pair-item .pair-header {
                font-size: 18px;
                font-weight: bold;
                color: #e8c76a;
                margin-bottom: 10px;
            }

            .pair-item .pair-members {
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.9em;
            }

            .pair-item .pair-hint {
                color: rgba(232, 199, 106, 0.6);
                font-size: 0.8em;
                margin-top: 10px;
                text-align: center;
                font-style: italic;
            }

            .betting-controls {
                display: flex;
                flex-direction: column;
                gap: 15px;
                align-items: center;
            }

            .bet-amount-input {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .bet-amount-input label {
                color: rgba(255, 255, 255, 0.9);
            }

            .bet-amount-input input {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid #e8c76a;
                border-radius: 6px;
                padding: 8px 12px;
                color: #fff;
                font-size: 16px;
                width: 150px;
            }

            .selected-pair-info {
                color: rgba(255, 255, 255, 0.8);
            }

            .selected-pair-info span:last-child {
                color: #e8c76a;
                font-weight: bold;
            }

            .betting-controls button {
                min-width: 200px;
            }
        `;

        document.head.appendChild(style);

        // 确定对手
        this._determineOpponent();

        // 渲染组合列表
        this._renderPairList();
    }

    // 确定对手
    _determineOpponent() {
        const playerCharacter = this.gameClass.teacher.characterType;
        const availableCharacters = ['wei', 'wang', 'qin'].filter(c => c !== playerCharacter);
        const opponentChar = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
        this.opponentName = SportsCharacterData[opponentChar].name;

        // 对手下注的组合在玩家选择下注后确定
        this.opponentBet = null;
    }

    // 渲染组合列表
    _renderPairList() {
        const list = document.getElementById('pairList');
        if (!list) return;

        list.innerHTML = '';

        this.pairs.forEach((pair, index) => {
            const carrier = this.gameClass._getStudentByIndex(pair.carrier);
            const rider = this.gameClass._getStudentByIndex(pair.rider);

            const item = document.createElement('div');
            item.className = 'pair-item';
            item.style.cssText = `
                cursor: pointer;
                user-select: none;
            `;
            if (this.playerBet === index) {
                item.classList.add('selected');
            }

            item.innerHTML = `
                <div class="pair-header">组合 ${index + 1}</div>
                <div class="pair-members">
                    🏃 赛人: ${carrier.name}<br>
                    🤺 骑手: ${rider.name}
                </div>
                <div class="pair-hint">点击下注</div>
            `;

            item.onclick = () => {
                this.playerBet = index;
                this._renderPairList();

                const carrierName = this.gameClass._getStudentByIndex(this.pairs[index].carrier).name;
                const riderName = this.gameClass._getStudentByIndex(this.pairs[index].rider).name;
                document.getElementById('selectedPairName').textContent = `组合${index + 1} (${carrierName}+${riderName})`;
                document.getElementById('startRaceBtn').disabled = false;
            };

            list.appendChild(item);
        });
    }

    // 开始比赛
    startRace() {
        // 验证赌注
        const betAmount = parseInt(document.getElementById('betAmountInput').value);
        if (isNaN(betAmount) || betAmount < 0 || betAmount > this.gameClass.teacher.salary) {
            alert('请输入有效的赌注金额！');
            return;
        }

        this.betAmount = betAmount;
        this.gameClass.teacher.salary -= betAmount;

        // 对手选择一个与玩家不同的组合
        const availableBets = [0, 1, 2, 3].filter(i => i !== this.playerBet);
        this.opponentBet = availableBets[Math.floor(Math.random() * availableBets.length)];

        // 隐藏选择界面
        document.getElementById('sportsDayModal').style.display = 'none';

        // 记录日志：比赛开始
        this.gameClass.log(`\n🏃‍♂️ 闪耀！类人少年项目开始！与${this.opponentName}对决`, 'highlight');
        this.gameClass.log(`💰 下注金额：${this.betAmount}元 | 赌注组合：${this.playerBet + 1}`, 'info');

        // 初始化游戏
        this._initializeGame();

        // 显示游戏界面
        this._showGameInterface();
    }

    // 初始化游戏
    _initializeGame() {
        this.active = true;
        this.round = 1;
        this.roadOffset = 0;
        this.finishLineX = 0;
        this.isFinished = false;
        this.winnerIndex = -1;
        this.animationFrame = 0;
        this.positionAnimationProgress = 1; // 位置动画进度 (0-1)
        this.isNewRound = true;  // 标记这是新回合（第一回合）

        // 初始化每个组合的状态
        this.pairStates = this.pairs.map(pair => {
            const carrier = this.gameClass._getStudentByIndex(pair.carrier);
            const rider = this.gameClass._getStudentByIndex(pair.rider);
            return {
                position: POSITION.MIDDLE,  // 初始在中间位置
                targetPosition: POSITION.MIDDLE,  // 目标位置
                speed: 0,
                stamina: 100,
                effects: [],  // 效果列表
                frozen: false,  // 是否被冻结（直接毙了）
                bindTo: undefined,  // 绑定到哪个赛道（重铬酸根）
                willDieAfterRace: false,  // 赛后是否死亡（最后一搏）
                energyUsed: 0,  // 消耗的精力（冲刺/鞭策）
                riderEnergyUsed: 0,  // 骑手消耗的精力（冲刺）
                carrierInitialEnergy: carrier ? carrier.energy : 100,  // 赛人初始精力
                riderInitialEnergy: rider ? rider.energy : 100  // 骑手初始精力
            };
        });

        // 初始化手牌（包括玩家和对手）
        this._generatePlayerCards();
        this._generateOpponentCards();  // 在游戏初始化时就生成对手的手牌
    }

    // 生成玩家手牌
    _generatePlayerCards() {
        // 清空手牌
        this.playerCards = [];

        // 每回合固定抽一张空牌
        this.playerCards.push(this._getCardById('common_empty'));

        // 确定随机抽牌数量
        let drawCount = 2;  // 默认抽2张

        // 如果上一回合使用了"小天才"，多抽1张
        if (this.drawExtraNextRound) {
            drawCount = 3;
            this.drawExtraNextRound = false;  // 重置标记
        }

        // 如果需要跳过抽牌（稳中求胜效果），只给一张空牌
        if (this.skipNextDraw) {
            this.skipNextDraw = false;  // 重置标记
            return;
        }

        // 获取玩家角色
        const playerCharacter = this.gameClass.teacher.characterType;

        // 根据角色抽取随机牌（不包含"信息"）
        for (let i = 0; i < drawCount; i++) {
            const card = this._drawRandomCard(playerCharacter, false, true);  // 最后一个参数排除"信息"
            this.playerCards.push(card);
        }

        // "信息"卡牌是独立抽取的，不在正常抽牌中
        // 如果是王老师且没有跳过抽牌，有20%概率额外抽到"信息"
        if (playerCharacter === CharacterType.WANG && !this.skipNextDraw && Math.random() < 0.2) {
            // 标记需要自动触发"信息"卡牌效果
            this.autoTriggerInfoCard = true;
        }
    }

    // 生成对手手牌
    _generateOpponentCards() {
        // 清空对手手牌
        this.opponentCards = [];

        // 每回合固定抽一张空牌
        this.opponentCards.push(this._getCardById('common_empty'));

        // 获取对手角色
        const opponentCharacter = this._getOpponentCharacter();

        // 抽取2张随机牌
        for (let i = 0; i < 2; i++) {
            const card = this._drawRandomCard(opponentCharacter, true);
            this.opponentCards.push(card);
        }
    }

    // 抽取随机卡牌
    _drawRandomCard(character, isOpponent = false, excludeInfo = false) {
        // 获取该角色的专属牌和所有公共牌
        let exclusiveCards = Object.values(ALL_CARDS).filter(card => card.character === character);
        let commonCards = Object.values(ALL_CARDS).filter(card => card.character === 'common');

        // 如果是对手，排除"信息"卡牌（对人机玩家没有用）
        if (isOpponent) {
            exclusiveCards = exclusiveCards.filter(card => card.id !== 'wang_info');
        }

        // 如果需要排除"信息"卡牌（用于正常抽牌）
        if (excludeInfo) {
            exclusiveCards = exclusiveCards.filter(card => card.id !== 'wang_info');
        }

        // 60%概率抽专属牌，40%概率抽公共牌
        if (exclusiveCards.length > 0 && Math.random() < 0.6) {
            const randomCard = exclusiveCards[Math.floor(Math.random() * exclusiveCards.length)];
            return this._getCardById(randomCard.id);
        } else {
            const randomCard = commonCards[Math.floor(Math.random() * commonCards.length)];
            return this._getCardById(randomCard.id);
        }
    }

    // 根据ID获取卡牌（返回副本）
    _getCardById(cardId) {
        const card = ALL_CARDS[cardId];
        if (!card) return null;
        // 返回卡牌的副本，避免修改原始数据
        return { ...card };
    }

    // 显示游戏界面
    _showGameInterface() {
        // 删除旧的modal（如果存在）
        const oldModal = document.getElementById('shineHumanTeenModal');
        if (oldModal) {
            oldModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'shineHumanTeenModal';
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 850;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(4px);
        `;

        modal.innerHTML = `
            <div class="modal-content" style="width: 95vw; height: 95vh; max-width: 1400px; max-height: 900px; overflow: hidden; display: flex; flex-direction: column;">
                <div class="modal-header" style="flex-shrink: 0;">
                    <div class="game-info">
                        <span>第 <span id="currentRound">1</span>/10 回合</span>
                        <span>对手: ${this.opponentName}</span>
                        <span>赌注: ${this.betAmount}元</span>
                    </div>
                </div>
                <div class="modal-body" style="display: flex; flex-direction: column; flex: 1; overflow: hidden; padding: 15px;">
                    <div class="game-area" style="flex: 1; min-height: 400px; overflow: hidden;">
                        <canvas id="shineHumanTeenCanvas" style="display: block;"></canvas>
                    </div>
                    <div class="control-area" style="flex-shrink: 0; margin-top: 15px;">
                        <div class="player-card-area" style="width: 100%;">
                            <div id="playerCardsDisplay" class="cards-display"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="animation-container"></div>
        `;

        document.body.appendChild(modal);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .game-info {
                display: flex;
                gap: 20px;
                align-items: center;
                color: rgba(255, 255, 255, 0.8);
                font-size: 1em;
            }

            .game-area {
                background: #0d1117;
                border-radius: 8px;
                overflow: hidden;
                position: relative;
            }

            .control-area {
                display: flex;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }

            .player-card-area {
                flex: 1;
            }

            .area-title {
                color: #e8c76a;
                font-size: 1em;
                margin-bottom: 10px;
                font-weight: bold;
            }

            .cards-display {
                display: flex;
                gap: 15px;
                min-height: 100px;
                align-items: center;
                width: 100%;
                margin-top: -10px;
            }

            .cards-container {
                display: flex;
                gap: 15px;
                flex: 1;
            }

            .card {
                width: 140px;
                height: 165px;
                background: linear-gradient(135deg, #e8c76a 0%, #d4a84b 100%);
                border-radius: 12px;
                padding: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                border: 3px solid transparent;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }

            .card:hover {
                transform: translateY(-50px);
                box-shadow: 0 8px 16px rgba(232, 199, 106, 0.5);
            }

            .card.selected {
                border-color: #fff;
                box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
            }

            .card .card-name {
                font-size: 1em;
                font-weight: bold;
                color: #0d1117;
                margin-bottom: 6px;
            }

            .card .card-subtitle {
                font-size: 0.8em;
                color: rgba(0, 0, 0, 0.7);
                margin-bottom: 6px;
                font-style: italic;
            }

            .card .card-desc {
                font-size: 0.7em;
                color: rgba(0, 0, 0, 0.6);
            }

            .next-round-btn {
                background: #3498db;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 0.9em;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
            }

            .next-round-btn:hover {
                background: #2980b9;
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(52, 152, 219, 0.5);
            }

            .next-round-btn:disabled {
                background: #7f8c8d;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
                opacity: 0.6;
            }

            .animation-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 10000;
                overflow: hidden;
            }

            .round-transition {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.95);
                padding: 40px 60px;
                border-radius: 16px;
                text-align: center;
                z-index: 100;
                border: 2px solid #e8c76a;
            }

            .round-transition h3 {
                color: #e8c76a;
                font-size: 28px;
                margin-bottom: 20px;
            }

            .round-transition .position-changes {
                color: rgba(255, 255, 255, 0.9);
                font-size: 1.1em;
                line-height: 2;
            }
        `;

        document.head.appendChild(style);

        // 初始化Canvas
        this.canvas = document.getElementById('shineHumanTeenCanvas');
        this.ctx = this.canvas.getContext('2d');

        // 设置Canvas尺寸
        this._resizeCanvas();

        // 添加Canvas点击事件监听器
        this.canvas.addEventListener('click', (e) => this._handleCanvasClick(e));

        // 监听窗口大小变化，保存监听器引用
        this.resizeListener = () => this._resizeCanvas();
        window.addEventListener('resize', this.resizeListener);

        // 渲染玩家手牌
        this._renderPlayerCards();

        // 开始动画循环
        this._startAnimationLoop();

        // 播放比赛开始的特效
        this._playGameStartEffect();
    }

    // 播放比赛开始的特效
    _playGameStartEffect() {
        const modal = document.getElementById('shineHumanTeenModal');
        if (!modal) return;

        // 创建闪光特效
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            inset: 0;
            background: white;
            z-index: 2000;
            opacity: 1;
            pointer-events: none;
            transition: opacity 0.8s ease-out;
        `;
        document.body.appendChild(flash);

        // 闪光淡出
        setTimeout(() => {
            flash.style.opacity = '0';
        }, 100);

        // 移除闪光元素
        setTimeout(() => {
            flash.remove();
        }, 900);

        // 创建"开始比赛"的文字特效
        const title = document.createElement('div');
        title.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 48px;
            font-weight: bold;
            color: #e8c76a;
            text-shadow: 0 0 20px rgba(232, 199, 106, 0.8);
            z-index: 2000;
            pointer-events: none;
            transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;
        title.textContent = '🏆 比赛开始！';
        document.body.appendChild(title);

        // 文字放大并淡出
        setTimeout(() => {
            title.style.transform = 'translate(-50%, -50%) scale(1.5)';
            title.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            title.style.opacity = '0';
            title.style.transform = 'translate(-50%, -50%) scale(2)';
        }, 1200);

        // 移除文字元素
        setTimeout(() => {
            title.remove();
        }, 2000);

        // 游戏开始动画完成后，检查是否需要触发"信息"卡牌
        setTimeout(() => {
            if (this.autoTriggerInfoCard) {
                this._autoPlayInfoCardAnimation();
            }
        }, 2100);
    }

    // 调整Canvas尺寸
    _resizeCanvas() {
        const container = this.canvas.parentElement;
        if (container) {
            // 保存当前的显示尺寸
            const currentDisplayWidth = this.canvas.style.width;
            const currentDisplayHeight = this.canvas.style.height;
            
            // 设置 Canvas 内部分辨率
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
            
            // 确保 Canvas 的 CSS 尺寸与内部分辨率匹配
            this.canvas.style.width = this.canvas.width + 'px';
            this.canvas.style.height = this.canvas.height + 'px';
        }
    }

    // 渲染玩家手牌
    _renderPlayerCards() {
        const display = document.getElementById('playerCardsDisplay');
        if (!display) return;

        display.innerHTML = '';

        // 创建卡牌容器
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'cards-container';

        this.playerCards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            if (this.currentRoundCard === index) {
                cardEl.classList.add('selected');
            }

            // 根据卡牌类型设置不同的颜色
            let bgColor = 'linear-gradient(135deg, #e8c76a 0%, #d4a84b 100%)';  // 默认金色
            if (card.type === CardType.BOOST) {
                bgColor = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';  // 绿色
            } else if (card.type === CardType.SLOW) {
                bgColor = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';  // 红色
            } else if (card.type === CardType.SPECIAL) {
                bgColor = 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)';  // 紫色
            } else if (card.type === CardType.EMPTY) {
                bgColor = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';  // 灰色
            }

            cardEl.style.background = bgColor;

            cardEl.innerHTML = `
                <div class="card-name">${card.name}</div>
                ${card.subtitle ? `<div class="card-subtitle">${card.subtitle}</div>` : ''}
                <div class="card-desc">${card.effect}</div>
            `;

            cardEl.onclick = () => {
                this.currentRoundCard = index;
                this._renderPlayerCards();
            };

            cardsContainer.appendChild(cardEl);
        });

        display.appendChild(cardsContainer);

        // 添加下一回合按钮（在右侧）
        const nextBtn = document.createElement('button');
        nextBtn.id = 'nextRoundBtn';
        nextBtn.className = 'next-round-btn';
        nextBtn.textContent = '进入下一回合';
        nextBtn.disabled = (this.currentRoundCard === null || this.currentRoundCard === undefined);
        
        nextBtn.onclick = (e) => {
            e.target.disabled = true;
            this._nextRound();
        };
        display.appendChild(nextBtn);

        // 如果需要自动触发"信息"卡牌效果
        if (this.autoTriggerInfoCard) {
            this.autoTriggerInfoCard = false;
            // 延迟一帧触发，确保DOM已经渲染
            setTimeout(() => {
                this._autoPlayInfoCardAnimation();
            }, 100);
        }

        // 如果是新回合，触发卡牌刷新特效
        if (this.isNewRound) {
            this.isNewRound = false;
            this._playCardRefreshEffect();
        }
    }

    // 动画循环
    _startAnimationLoop() {
        const animate = () => {
            if (!this.active) return;

            this._renderGame();
            this.animationFrame++;
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    // 渲染游戏画面
    _renderGame() {
        const ctx = this.ctx;
        const canvas = this.canvas;

        // 清空画布
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制赛道
        this._drawTracks(ctx, canvas);

        // 绘制组合
        this._drawPairs(ctx, canvas);

        // 绘制终点线（如果比赛结束）
        if (this.isFinished) {
            this._drawFinishLine(ctx, canvas);
        }

        // 更新跑道偏移（模拟前进，平滑连续）
        this.roadOffset += 2; // 不重置，保持连续移动
    }

    // 绘制赛道
    _drawTracks(ctx, canvas) {
        // 计算赛道高度和间距
        const totalHeight = canvas.height - 60; // 上下留边
        const trackGap = 3;
        const trackHeight = (totalHeight - (4 - 1) * trackGap) / 4;
        const startY = 30;

        for (let i = 0; i < 4; i++) {
            const y = startY + i * (trackHeight + trackGap);

            // 跑道背景（红色）
            ctx.fillStyle = '#c0392b';
            ctx.fillRect(0, y, canvas.width, trackHeight);

            // 跑道渐变
            const gradient = ctx.createLinearGradient(0, y, 0, y + trackHeight);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, y, canvas.width, trackHeight);

            // 白色赛道分割线
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.moveTo(0, y + trackHeight);
            ctx.lineTo(canvas.width, y + trackHeight);
            ctx.stroke();

            // 跑道标志物（向左移动，白色箭头）
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for (let x = 120 - (this.roadOffset % 120); x < canvas.width; x += 120) {
                ctx.beginPath();
                ctx.moveTo(x, y + trackHeight * 0.2);
                ctx.lineTo(x - 30, y + trackHeight * 0.5);
                ctx.lineTo(x, y + trackHeight * 0.8);
                ctx.closePath();
                ctx.fill();
            }

            // 组合标签
            const pair = this.pairs[i];
            const carrier = this.gameClass._getStudentByIndex(pair.carrier);
            const rider = this.gameClass._getStudentByIndex(pair.rider);

            // 标签背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(5, y + 5, 180, 40);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`组合${i + 1}`, 15, y + 22);
            ctx.font = '12px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillText(`${carrier.name} + ${rider.name}`, 15, y + 38);

            // 身位指示
            const posText = ['最后', '后方', '中间', '前方', '最前'][this.pairStates[i].targetPosition !== undefined ? this.pairStates[i].targetPosition : this.pairStates[i].position];
            ctx.textAlign = 'right';
            
            // 身位背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(canvas.width - 85, y + 5, 80, 30);
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 13px Arial';
            ctx.fillText(posText, canvas.width - 10, y + 25);
        }
    }

    // 绘制组合
    _drawPairs(ctx, canvas) {
        // 计算赛道高度和间距
        const totalHeight = canvas.height - 60;
        const trackGap = 3;
        const trackHeight = (totalHeight - (4 - 1) * trackGap) / 4;
        const startY = 30;
        const centerX = canvas.width / 2;

        // 更新位置动画进度
        if (this.positionAnimationProgress < 1) {
            this.positionAnimationProgress += 0.01; // 进一步减慢动画速度
            if (this.positionAnimationProgress > 1) {
                this.positionAnimationProgress = 1;
                // 动画结束，同步position到targetPosition（跳过被冻结的选手）
                this.pairStates.forEach(state => {
                    if (!state.frozen) {
                        state.position = state.targetPosition;
                    }
                });
            }
        }

        this.pairs.forEach((pair, index) => {
            const state = this.pairStates[index];
            const y = startY + index * (trackHeight + trackGap) + trackHeight / 2;

            // 使用插值计算当前位置（平滑移动）
            let currentPosition;
            if (state.frozen) {
                // 如果被冻结，保持当前位置不动
                currentPosition = state.position;
            } else if (this.positionAnimationProgress < 1) {
                // 正常动画移动
                currentPosition = state.position + (state.targetPosition - state.position) * this._easeInOut(this.positionAnimationProgress);
            } else {
                currentPosition = state.targetPosition;
            }

            // 根据身位计算X位置
            const positionOffset = (currentPosition - 2) * 80;
            const x = centerX + positionOffset;

            // 获取学生信息
            const carrier = this.gameClass._getStudentByIndex(pair.carrier);
            const rider = this.gameClass._getStudentByIndex(pair.rider);

            const carrierColor = carrier.gender === Gender.Boy ? '#3498db' : '#e91e63';
            const riderColor = rider.gender === Gender.Boy ? '#3498db' : '#e91e63';

            // 绘制骑背组合（增大尺寸）
            this._drawPiggybackPair(ctx, x, y, 1.5, 1.1, this.animationFrame, carrierColor, riderColor, state.frozen);

            // 如果被冻结，显示冻结标记
            if (state.frozen) {
                ctx.fillStyle = 'rgba(155, 89, 182, 0.9)';
                ctx.beginPath();
                ctx.arc(x, y - 70, 15, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('❄', x, y - 66);
            }

            // 如果被绑定，显示绑定框和连接线
            if (state.bindTo !== undefined && state.bindTo >= 0 && state.bindTo < 4) {
                // 绘制绑定框（橙色虚线）
                ctx.save();
                ctx.strokeStyle = 'rgba(230, 126, 34, 0.9)';
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 3]);
                
                // 绘制矩形框围绕整个组合
                ctx.beginPath();
                ctx.rect(x - 60, y - 50, 120, 100);
                ctx.stroke();
                
                // 绘制绑定标记
                ctx.fillStyle = 'rgba(230, 126, 34, 0.9)';
                ctx.beginPath();
                ctx.arc(x, y + 60, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('链', x, y + 64);
                
                ctx.restore();
            }

            // 如果是Canvas中选中的组合，绘制高亮边框
            if (this.selectedPairInCanvas === index) {
                ctx.save();
                ctx.strokeStyle = 'rgba(232, 199, 106, 0.9)';
                ctx.lineWidth = 3;
                ctx.setLineDash([8, 4]);
                
                // 绘制椭圆边框围绕整个组合
                ctx.beginPath();
                ctx.ellipse(x, y - 20, 50, 45, 0, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.restore();
            }

            // 如果是玩家下注的组合，显示标记
            if (this.playerBet === index) {
                ctx.fillStyle = 'rgba(46, 204, 113, 0.9)';
                ctx.beginPath();
                ctx.arc(x - 60, y - 60, 18, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('★', x - 60, y - 56);
            }
        });

        // 绘制绑定关系的连接线
        this._drawBindingLines(ctx, canvas, totalHeight, trackGap, trackHeight, startY, centerX);
    }

    // 绘制绑定关系的连接线
    _drawBindingLines(ctx, canvas, totalHeight, trackGap, trackHeight, startY, centerX) {
        this.pairStates.forEach((state, index) => {
            if (state.bindTo !== undefined && state.bindTo >= 0 && state.bindTo < 4) {
                // 计算当前组合的位置
                const y1 = startY + index * (trackHeight + trackGap) + trackHeight / 2;
                let currentPosition1;
                if (state.frozen) {
                    currentPosition1 = state.position;
                } else if (this.positionAnimationProgress < 1) {
                    currentPosition1 = state.position + (state.targetPosition - state.position) * this._easeInOut(this.positionAnimationProgress);
                } else {
                    currentPosition1 = state.targetPosition;
                }
                const x1 = centerX + (currentPosition1 - 2) * 80;

                // 计算绑定对象的位置
                const y2 = startY + state.bindTo * (trackHeight + trackGap) + trackHeight / 2;
                const boundState = this.pairStates[state.bindTo];
                let currentPosition2;
                if (boundState.frozen) {
                    currentPosition2 = boundState.position;
                } else if (this.positionAnimationProgress < 1) {
                    currentPosition2 = boundState.position + (boundState.targetPosition - boundState.position) * this._easeInOut(this.positionAnimationProgress);
                } else {
                    currentPosition2 = boundState.targetPosition;
                }
                const x2 = centerX + (currentPosition2 - 2) * 80;

                // 绘制连接线（橙色虚线）
                ctx.save();
                ctx.strokeStyle = 'rgba(230, 126, 34, 0.6)';
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                
                // 绘制曲线连接两个组合
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                
                // 控制点，使曲线更平滑
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                ctx.quadraticCurveTo(midX, midY, x2, y2);
                
                ctx.stroke();
                
                // 绘制箭头
                const angle = Math.atan2(y2 - y1, x2 - x1);
                const arrowSize = 8;
                ctx.beginPath();
                ctx.moveTo(x2 - arrowSize * Math.cos(angle - Math.PI / 6), y2 - arrowSize * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(x2, y2);
                ctx.lineTo(x2 - arrowSize * Math.cos(angle + Math.PI / 6), y2 - arrowSize * Math.sin(angle + Math.PI / 6));
                ctx.fillStyle = 'rgba(230, 126, 34, 0.6)';
                ctx.fill();
                
                ctx.restore();
            }
        });
    }

    // 缓动函数
    _easeInOut(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // 处理Canvas点击事件
    _handleCanvasClick(e) {
        // 获取点击位置相对于Canvas的坐标
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // 碰撞检测，判断点击了哪个组合
        const clickedPair = this._hitTestPair(clickX, clickY);

        if (clickedPair !== null) {
            // 直接选中点击的组合
            this.selectedPairInCanvas = clickedPair;
            const pair = this.pairs[clickedPair];
            const carrier = this.gameClass._getStudentByIndex(pair.carrier);
            const rider = this.gameClass._getStudentByIndex(pair.rider);
            console.log(`选中组合${clickedPair + 1}: ${carrier.name} + ${rider.name}`);
        } else {
            // 点击空白区域，取消选中
            this.selectedPairInCanvas = null;
            console.log('取消选中组合');
        }
    }

    // 碰撞检测：判断点击位置是否在某个组合上
    _hitTestPair(clickX, clickY) {
        const canvas = this.canvas;
        const totalHeight = canvas.height - 60;
        const trackGap = 3;
        const trackHeight = (totalHeight - (4 - 1) * trackGap) / 4;
        const startY = 30;
        const centerX = canvas.width / 2;

        // 检查每个组合
        for (let i = 0; i < 4; i++) {
            const state = this.pairStates[i];
            const y = startY + i * (trackHeight + trackGap) + trackHeight / 2;

            // 使用插值计算当前位置
            const currentPosition = this.positionAnimationProgress < 1 
                ? state.position + (state.targetPosition - state.position) * this._easeInOut(this.positionAnimationProgress)
                : state.targetPosition;

            // 根据身位计算X位置
            const positionOffset = (currentPosition - 2) * 80;
            const x = centerX + positionOffset;

            // 碰撞检测：椭圆区域（与选中边框大小一致）
            const ellipseCenterX = x;
            const ellipseCenterY = y - 20;
            const radiusX = 50;
            const radiusY = 45;

            // 标准化点击坐标到椭圆坐标系
            const normalizedX = (clickX - ellipseCenterX) / radiusX;
            const normalizedY = (clickY - ellipseCenterY) / radiusY;

            // 判断是否在椭圆内
            if (normalizedX * normalizedX + normalizedY * normalizedY <= 1) {
                return i; // 返回组合索引
            }
        }

        return null; // 没有点中任何组合
    }

    // 绘制骑背组合
    _drawPiggybackPair(ctx, x, y, carrierScale, riderScale, frame, carrierColor, riderColor, frozen = false) {
        ctx.save();
        ctx.translate(x, y);

        // 载体
        this._drawSimplePerson(ctx, 0, 0, carrierScale, frame, carrierColor, frozen);

        // 骑乘者（正身站着）
        const riderX = 2;
        const riderY = -30;
        const riderFrame = frozen ? 0 : frame * 0.7;  // 如果冻结，不播放动画

        ctx.save();
        ctx.translate(riderX, riderY);
        ctx.scale(riderScale, riderScale);

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.fillStyle = riderColor;

        const bodyTilt = 0.0;  // 身体直立

        // 头部（直立）
        ctx.save();
        ctx.translate(0, -25);
        ctx.rotate(bodyTilt);
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(1, -2, 1.2, 0, Math.PI * 2);  // 眼睛（面向右边）
        ctx.arc(3, -2, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 身体（直立）
        ctx.save();
        ctx.translate(0, -8);
        ctx.rotate(bodyTilt);
        ctx.fillRect(-6, -12, 12, 20);
        ctx.strokeRect(-6, -12, 12, 20);
        ctx.restore();

        // 手臂（向前抓住载体）
        ctx.save();
        ctx.translate(-5, -12);
        ctx.rotate(0.4 + Math.sin(frame * 0.1) * 0.05);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(5, 10);
        ctx.lineTo(8, 18);
        ctx.stroke();

        ctx.fillStyle = riderColor;
        ctx.beginPath();
        ctx.arc(8, 18, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(5, -12);
        ctx.rotate(0.4 + Math.sin(frame * 0.1) * 0.05);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-5, 10);
        ctx.lineTo(-8, 18);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(-8, 18, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 腿（盘在载体腰部）
        ctx.save();
        ctx.translate(-3, 9);
        ctx.rotate(-0.6 + Math.sin(frame * 0.1 + Math.PI) * 0.05); // 大腿向外
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(5, 7); // 大腿
        ctx.lineTo(8, 14); // 小腿向下
        ctx.stroke();

        // 脚
        ctx.fillStyle = riderColor;
        ctx.beginPath();
        ctx.ellipse(8, 14, 3, 1.5, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(3, 9);
        ctx.rotate(0.6 - Math.sin(frame * 0.1 + Math.PI) * 0.05); // 大腿向外
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-5, 7);
        ctx.lineTo(-8, 14);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(-8, 14, 3, 1.5, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.restore();
        ctx.restore();
    }

    // 绘制简单人物（爬行姿势 - 赛人）
    _drawSimplePerson(ctx, x, y, scale, frame, color, frozen = false) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        ctx.fillStyle = color;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;

        const cycle = frozen ? 0 : frame * 0.12;  // 如果冻结，不播放动画
        
        // 爬行姿势：躯干与地面平行
        const bodyTilt = 0.0;
        
        // 四肢摆动（像四足动物，对角线同步）
        const leftFrontAngle = Math.sin(cycle) * 0.35;  // 左前肢
        const rightFrontAngle = Math.sin(cycle + Math.PI) * 0.35;  // 右前肢
        const leftBackAngle = Math.sin(cycle + Math.PI) * 0.35;  // 左后肢
        const rightBackAngle = Math.sin(cycle) * 0.35;  // 右后肢

        // 头部（向前伸出，与躯干平行）
        ctx.save();
        ctx.translate(15, -8);  // 头部位置在躯干前方（右边）
        ctx.rotate(bodyTilt);  // 头部与躯干平行
        ctx.beginPath();
        ctx.ellipse(0, 0, 12, 9, 0, 0, Math.PI * 2);  // 椭圆形头部
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(5, -2, 1.5, 0, Math.PI * 2);  // 眼睛（面向右边）
        ctx.arc(8, -2, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 身体（用黑色线段表示，与四肢一样粗）
        ctx.save();
        ctx.translate(0, 0);
        ctx.rotate(bodyTilt);
        ctx.beginPath();
        ctx.moveTo(-15, -2);  // 躯干起点
        ctx.lineTo(15, -2);   // 躯干终点
        ctx.strokeStyle = '#333';  // 黑色，与四肢一样
        ctx.lineWidth = 2;  // 与四肢一样粗
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();

        // 前肢（左前臂）- 从躯干前端开始
        ctx.save();
        ctx.translate(15, -2);  // 从躯干前端开始
        ctx.rotate(leftFrontAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(5, 10);
        ctx.lineTo(6, 18);
        ctx.stroke();

        // 手掌/脚掌
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(6, 18, 4, 2, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 前肢（右前臂）- 从躯干前端开始
        ctx.save();
        ctx.translate(15, -2);  // 从躯干前端开始
        ctx.rotate(rightFrontAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-5, 10);
        ctx.lineTo(-6, 18);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(-6, 18, 4, 2, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 后肢（左后腿）- 从躯干后端开始
        ctx.save();
        ctx.translate(-15, -2);  // 从躯干后端开始
        ctx.rotate(leftBackAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-4, 12);
        ctx.lineTo(-5, 20);
        ctx.stroke();

        // 脚掌
        ctx.beginPath();
        ctx.ellipse(-5, 20, 4, 2, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 后肢（右后腿）- 从躯干后端开始
        ctx.save();
        ctx.translate(-15, -2);  // 从躯干后端开始
        ctx.rotate(rightBackAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(4, 12);
        ctx.lineTo(5, 20);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(5, 20, 4, 2, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.restore();
    }

    // 绘制终点线
    _drawFinishLine(ctx, canvas) {
        // 终点线从右往左移动，速度与背景移动保持一致
        this.finishLineX -= 2; // 与背景移动速度一致

        // 绘制终点线
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 6;
        ctx.setLineDash([15, 10]);
        ctx.beginPath();
        ctx.moveTo(this.finishLineX, 30);
        ctx.lineTo(this.finishLineX, canvas.height - 30);
        ctx.stroke();
        ctx.setLineDash([]);

        // 绘制终点线标记
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏁 终点', this.finishLineX, 20);

        // 检查是否所有组合都通过了终点线
        if (this.finishLineX < -100) {
            this._showResult();
        }
    }

    // 下一回合
    _nextRound() {
        // 检查是否选择了卡牌
        if (this.currentRoundCard === null || this.currentRoundCard === undefined) {
            // 启用按钮并提示
            const nextBtn = document.getElementById('nextRoundBtn');
            if (nextBtn) {
                nextBtn.disabled = false;
            }
            alert('请先选择一张卡牌！');
            return;
        }

        const card = this.playerCards[this.currentRoundCard];

        // 检查是否需要选择目标骑手
        if (card.target === 'selected' && this.selectedPairInCanvas === null) {
            // 启用按钮并提示
            const nextBtn = document.getElementById('nextRoundBtn');
            if (nextBtn) {
                nextBtn.disabled = false;
            }
            alert('请先点击画布选择一个骑手组合！');
            return;
        }

        // 检查是否是冲刺、最后一搏、鞭策，如果是，只能作用于自己下注的组合
        if (card.target === 'selected' && (card.id === 'common_sprint' || card.id === 'common_last_chance' || card.id === 'common_whip')) {
            if (this.selectedPairInCanvas !== this.playerBet) {
                // 启用按钮并提示
                const nextBtn = document.getElementById('nextRoundBtn');
                if (nextBtn) {
                    nextBtn.disabled = false;
                }
                alert('这张卡牌只能作用于你自己下注的组合！');
                return;
            }
        }

        // 禁用下一回合按钮
        const nextBtn = document.getElementById('nextRoundBtn');
        if (nextBtn) {
            nextBtn.disabled = true;
        }

        // 强制重新计算 Canvas 尺寸，确保尺寸正确
        this._resizeCanvas();

        // 玩家出牌动画
        const selectedCardIndex = this.currentRoundCard;
        const cardElement = document.querySelectorAll('#playerCardsDisplay .card')[selectedCardIndex];

            if (cardElement) {
                // 获取卡牌的初始位置
                const rect = cardElement.getBoundingClientRect();
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                // 创建动画卡牌克隆
                const animatedCard = cardElement.cloneNode(true);
                animatedCard.style.position = 'fixed';
                animatedCard.style.left = rect.left + 'px';
                animatedCard.style.top = rect.top + 'px';
                animatedCard.style.width = rect.width + 'px';
                animatedCard.style.height = rect.height + 'px';
                animatedCard.style.zIndex = '1000';
                animatedCard.style.transition = 'all 0.5s ease';
                animatedCard.style.transform = 'none';
                animatedCard.style.pointerEvents = 'none';
                
                const animationContainer = document.querySelector('.animation-container');
                if (animationContainer) {
                    animationContainer.appendChild(animatedCard);
                } else {
                    document.body.appendChild(animatedCard);
                }

                // 隐藏原始卡牌
                cardElement.style.opacity = '0';

                // 第一步：移动到屏幕中间（0.5秒）
                requestAnimationFrame(() => {
                    animatedCard.style.left = (centerX - rect.width / 2) + 'px';
                    animatedCard.style.top = (centerY - rect.height / 2) + 'px';
                });

                // 第二步：在中心停留并变大（0.8秒）
                setTimeout(() => {
                    animatedCard.style.transition = 'all 0.8s ease';
                    animatedCard.style.transform = 'scale(2.0)'; // 放大2.0倍
                }, 500);

                // 第三步：旋转并向右下移出屏幕（0.4秒）
                setTimeout(() => {
                    animatedCard.style.transition = 'all 0.4s ease-in';
                    animatedCard.style.left = (window.innerWidth + 100) + 'px';
                    animatedCard.style.top = (window.innerHeight + 100) + 'px';
                    animatedCard.style.transform = 'rotate(720deg) scale(0.1)';
                    animatedCard.style.opacity = '0';
                }, 1300);

                // 移除动画卡牌并进入下一回合
                setTimeout(() => {
                    animatedCard.remove();
                    cardElement.remove();

                    // 显示回合过渡
                    this._showRoundTransition();
                }, 1700);
            } else {
                // 如果找不到卡牌元素，直接进入下一回合
                this._showRoundTransition();
            }
    }

    // 自动播放"信息"卡牌的动效
    _autoPlayInfoCardAnimation() {
        // 获取玩家牌区的第一个卡牌元素的位置（用于定位"信息"卡牌的起始位置）
        const playerCardsDisplay = document.getElementById('playerCardsDisplay');
        if (!playerCardsDisplay) return;

        const firstCard = playerCardsDisplay.querySelector('.card');
        if (!firstCard) return;

        // 获取第一个卡牌的位置
        const rect = firstCard.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // 创建临时的"信息"卡牌元素
        const tempCard = this._getCardById('wang_info');
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card';
        cardContainer.style.cssText = `
            position: fixed;
            left: ${rect.left + 'px'};
            top: ${rect.top + 'px'};
            width: ${rect.width + 'px'};
            height: ${rect.height + 'px'};
            background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
            border-radius: 12px;
            padding: 12px;
            color: white;
            transition: all 0.5s ease;
            box-shadow: 0 8px 16px rgba(155, 89, 182, 0.5);
            pointer-events: none;
            will-change: transform, left, top;
            z-index: 1000;
        `;
        cardContainer.innerHTML = `
            <div class="card-name" style="color: white; font-size: 1em; font-weight: bold; margin-bottom: 8px;">${tempCard.name}</div>
            ${tempCard.subtitle ? `<div class="card-subtitle" style="color: rgba(255,255,255,0.8); font-size: 0.8em; margin-bottom: 6px;">${tempCard.subtitle}</div>` : ''}
            <div class="card-desc" style="color: rgba(255,255,255,0.9); font-size: 0.7em;">${tempCard.effect}</div>
        `;
        
        const animationContainer = document.querySelector('.animation-container');
        if (animationContainer) {
            animationContainer.appendChild(cardContainer);
        } else {
            document.body.appendChild(cardContainer);
        }

        // 禁用下一回合按钮
        const nextBtn = document.getElementById('nextRoundBtn');
        if (nextBtn) {
            nextBtn.disabled = true;
        }

        // 第一步：移动到屏幕中间（0.5秒）
        requestAnimationFrame(() => {
            cardContainer.style.left = (centerX - rect.width / 2) + 'px';
            cardContainer.style.top = (centerY - rect.height / 2) + 'px';
        });

        // 第二步：在中心停留并变大（0.8秒）
        setTimeout(() => {
            cardContainer.style.transition = 'all 0.8s ease';
            cardContainer.style.transform = 'scale(2.0)';
        }, 500);

        // 第三步：旋转并向右下移出屏幕（0.4秒）
        setTimeout(() => {
            cardContainer.style.transition = 'all 0.4s ease-in';
            cardContainer.style.left = (window.innerWidth + 100) + 'px';
            cardContainer.style.top = (window.innerHeight + 100) + 'px';
            cardContainer.style.transform = 'rotate(720deg) scale(0.1)';
            cardContainer.style.opacity = '0';
        }, 1300);

        // 移除动画卡牌并显示对手手牌
        setTimeout(() => {
            cardContainer.remove();
            
            // 显示对手手牌
            this._showOpponentCards();

            // 启用下一回合按钮
            if (nextBtn) {
                nextBtn.disabled = false;
            }
        }, 1700);
    }

    // 播放"信息"卡牌的出牌动画
    _playInfoCardAnimation() {
        const selectedCardIndex = this.currentRoundCard;
        const cardElement = document.querySelectorAll('#playerCardsDisplay .card')[selectedCardIndex];

        if (!cardElement) return;

        // 获取卡牌的初始位置
        const rect = cardElement.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // 创建动画卡牌克隆
        const animatedCard = cardElement.cloneNode(true);
        animatedCard.style.position = 'fixed';
        animatedCard.style.left = rect.left + 'px';
        animatedCard.style.top = rect.top + 'px';
        animatedCard.style.width = rect.width + 'px';
        animatedCard.style.height = rect.height + 'px';
        animatedCard.style.zIndex = '1000';
        animatedCard.style.transition = 'all 0.5s ease';
        animatedCard.style.transform = 'none';
        animatedCard.style.pointerEvents = 'none';
        
        const animationContainer = document.querySelector('.animation-container');
        if (animationContainer) {
            animationContainer.appendChild(animatedCard);
        } else {
            document.body.appendChild(animatedCard);
        }

        // 隐藏原始卡牌
        cardElement.style.opacity = '0';

        // 第一步：移动到屏幕中间（0.5秒）
        requestAnimationFrame(() => {
            animatedCard.style.left = (centerX - rect.width / 2) + 'px';
            animatedCard.style.top = (centerY - rect.height / 2) + 'px';
        });

        // 第二步：在中心停留并变大（0.8秒）
        setTimeout(() => {
            animatedCard.style.transition = 'all 0.8s ease';
            animatedCard.style.transform = 'scale(2.0)';
        }, 500);

        // 第三步：旋转并向右下移出屏幕（0.4秒）
        setTimeout(() => {
            animatedCard.style.transition = 'all 0.4s ease-in';
            animatedCard.style.left = (window.innerWidth + 100) + 'px';
            animatedCard.style.top = (window.innerHeight + 100) + 'px';
            animatedCard.style.transform = 'rotate(720deg) scale(0.1)';
            animatedCard.style.opacity = '0';
        }, 1300);

        // 移除动画卡牌，从手牌中移除，显示对手手牌
        setTimeout(() => {
            animatedCard.remove();
            cardElement.remove();

            // 从手牌中移除"信息"卡牌
            this.playerCards.splice(selectedCardIndex, 1);
            this.currentRoundCard = null;

            // 显示对手手牌
            this._showOpponentCards();

            // 启用下一回合按钮
            const nextBtn = document.getElementById('nextRoundBtn');
            if (nextBtn) {
                nextBtn.disabled = false;
            }
        }, 1700);
    }

    // 显示回合过渡
    _showRoundTransition() {
        // 不在这里生成对手卡牌，使用游戏初始化或进入下一回合时生成的卡牌

        // 对手随机选择一张卡牌（优先选择非空牌）
        this._opponentSelectCard();

        // 先显示对手出牌动画（不立即启动位置动画）
        this._opponentPlayCard();

        // 等待对手出牌动画完成后（1.7秒），才计算位置变化并启动位置动画
        setTimeout(() => {
            // 按优先级处理卡牌效果
            this._processCardEffectsByPriority();

            // 等待位置动画完成后（约1.67秒）
            setTimeout(() => {
                if (this.round >= this.maxRounds) {
                    // 第10回合完成，启动终点线动画
                    this._endGame();
                } else {
                    // 进入下一回合
                    this.round++;
                    document.getElementById('currentRound').textContent = this.round;

                    // 标记这是新回合，触发刷新特效
                    this.isNewRound = true;

                    // 生成新手牌（包括玩家和对手）
                    this._generatePlayerCards();
                    this._generateOpponentCards();  // 每回合开始时重新生成对手手牌
                    this._renderPlayerCards();

                    // 重置当前选择的卡牌
                    this.currentRoundCard = null;

                    // 启用下一回合按钮
                    const nextBtn = document.getElementById('nextRoundBtn');
                    if (nextBtn) {
                        nextBtn.disabled = false;
                    }
                    
                    // 重新启用 resize 监听器
                    if (this.resizeListener) {
                        window.addEventListener('resize', this.resizeListener);
                    }
                }
            }, 1670); // 位置动画约1.67秒完成（100帧 * 16.7ms）
        }, 1700); // 对手出牌动画1.7秒完成
    }

    // 播放卡牌刷新特效
    _playCardRefreshEffect() {
        const cardsContainer = document.querySelector('.cards-container');
        if (!cardsContainer) return;

        const cards = cardsContainer.querySelectorAll('.card');
        if (cards.length === 0) return;

        // 添加刷新特效
        cards.forEach((card, index) => {
            // 初始状态：从左侧滑入，带有模糊效果
            card.style.transform = 'translateX(-100px)';
            card.style.opacity = '0';
            card.style.filter = 'blur(4px)';
            
            // 依次延迟触发动画
            setTimeout(() => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease, filter 0.5s ease';
                card.style.transform = 'translateX(0)';
                card.style.opacity = '1';
                card.style.filter = 'blur(0)';
            }, index * 80);
        });
    }

    // 按优先级处理卡牌效果
    _processCardEffectsByPriority() {
        // 收集所有卡牌
        const allCards = [];
        if (this.playerCards[this.currentRoundCard]) {
            allCards.push({ card: this.playerCards[this.currentRoundCard], isPlayer: true });
        }
        if (this.opponentCard) {
            allCards.push({ card: this.opponentCard, isPlayer: false });
        }

        // 按优先级分类卡牌
        const priorityGroups = {
            freezeSingle: [], // 直接毙了（最高优先级）
            counter: [],      // 做生物/徐达逸
            forceMove: [],    // 冲刺/最后一搏/鞭策（仅次于做生物/徐达逸）
            binding: [],      // 重铬酸根
            freezeAll: [],    // 这不解完了吗
            skylark: [],      // 百灵鸟
            shuffle: [],      // 你在干什么
            other: [],        // 其他
            suppress: []      // 压制（最后执行，检查最终位置）
        };

        allCards.forEach(({ card, isPlayer }) => {
            if (card.id === 'qin_kill') {
                priorityGroups.freezeSingle.push({ card, isPlayer });
            } else if (card.id === 'common_bio' || card.id === 'common_xuda') {
                priorityGroups.counter.push({ card, isPlayer });
            } else if (card.id === 'common_sprint' || card.id === 'common_last_chance' || card.id === 'common_whip') {
                priorityGroups.forceMove.push({ card, isPlayer });
            } else if (card.id === 'wang_chromium6') {
                priorityGroups.binding.push({ card, isPlayer });
            } else if (card.id === 'wei_done') {
                priorityGroups.freezeAll.push({ card, isPlayer });
            } else if (card.id === 'qin_skylark') {
                priorityGroups.skylark.push({ card, isPlayer });
            } else if (card.id === 'qin_what') {
                priorityGroups.shuffle.push({ card, isPlayer });
            } else if (card.id === 'common_suppress') {
                priorityGroups.suppress.push({ card, isPlayer });
            } else {
                priorityGroups.other.push({ card, isPlayer });
            }
        });

        // 按优先级执行效果
        console.log('按优先级执行卡牌效果:', priorityGroups);

        // 辅助函数：检查目标是否被冻结
        const isTargetFrozen = (targetPairIndex) => {
            if (targetPairIndex === null || targetPairIndex === undefined) return false;
            return this.pairStates[targetPairIndex].frozen;
        };

        // 1. 直接毙了（冻结单个）- 最高优先级
        priorityGroups.freezeSingle.forEach(({ card, isPlayer }) => {
            this._applyCardEffect(card, isPlayer);
        });

        // 2. 做生物/徐达逸（反制效果）
        this._checkCounterEffects();

        // 3. 冲刺/最后一搏/鞭策（强制前进，消耗精力）
        priorityGroups.forceMove.forEach(({ card, isPlayer }) => {
            const targetPairIndex = isPlayer ? this.selectedPairInCanvas : this.opponentTargetPair;

            // 检查是否作用于自己的组合
            if (isPlayer && targetPairIndex !== this.playerBet) {
                console.log(`卡牌 ${card.name} 只能作用于自己下注的组合，效果跳过`);
                return;
            }
            if (!isPlayer && targetPairIndex !== this.opponentBet) {
                console.log(`卡牌 ${card.name} 只能作用于自己下注的组合，效果跳过`);
                return;
            }

            // 如果目标是冻结状态，跳过这个效果
            if (isTargetFrozen(targetPairIndex)) {
                console.log(`卡牌 ${card.name} 的目标已被冻结，效果跳过`);
                return;
            }

            this._applyCardEffect(card, isPlayer);
        });

        // 4. 重铬酸根（绑定）
        priorityGroups.binding.forEach(({ card, isPlayer }) => {
            this._applyCardEffect(card, isPlayer);
        });
        this._processBindingEffect();

        // 4. 这不解完了吗（冻结所有）
        priorityGroups.freezeAll.forEach(({ card, isPlayer }) => {
            this._applyCardEffect(card, isPlayer);
        });

        // 5. 百灵鸟（特定身位移动）
        // 跳过被冻结的选手
        priorityGroups.skylark.forEach(({ card, isPlayer }) => {
            const originalExecute = card.execute;
            card.execute = (allStates) => {
                // 只对未被冻结的选手应用效果
                originalExecute.call(card, allStates.map((state, index) => {
                    return state.frozen ? { ...state, targetPosition: state.targetPosition } : state;
                }));
            };
            this._applyCardEffect(card, isPlayer);
            // 恢复原始execute方法
            card.execute = originalExecute;
        });

        // 6. 你在干什么（打乱位置）
        // 跳过被冻结的选手
        priorityGroups.shuffle.forEach(({ card, isPlayer }) => {
            const originalExecute = card.execute;
            card.execute = (allStates) => {
                // 只对未被冻结的选手打乱位置
                const frozenIndices = allStates.map((state, index) => state.frozen ? index : -1).filter(i => i !== -1);
                const activeStates = allStates.filter(state => !state.frozen);
                const activePositions = activeStates.map(state => state.targetPosition);
                
                // 打乱位置
                for (let i = activePositions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [activePositions[i], activePositions[j]] = [activePositions[j], activePositions[i]];
                }
                
                // 应用新位置到未被冻结的选手
                let activeIndex = 0;
                allStates.forEach((state, index) => {
                    if (!state.frozen) {
                        state.targetPosition = activePositions[activeIndex++];
                    }
                });
            };
            this._applyCardEffect(card, isPlayer);
            // 恢复原始execute方法
            card.execute = originalExecute;
        });

        // 7. 其他效果
        // 跳过被冻结的选手
        priorityGroups.other.forEach(({ card, isPlayer }) => {
            const targetPairIndex = isPlayer ? this.selectedPairInCanvas : this.opponentTargetPair;

            // 如果目标是冻结状态，跳过这个效果
            if (card.target === 'selected' && isTargetFrozen(targetPairIndex)) {
                console.log(`卡牌 ${card.name} 的目标已被冻结，效果跳过`);
                return;
            }

            this._applyCardEffect(card, isPlayer);
        });

        // 8. 压制效果（最后执行，检查最终位置）
        priorityGroups.suppress.forEach(({ card, isPlayer }) => {
            const targetPairIndex = isPlayer ? this.selectedPairInCanvas : this.opponentTargetPair;

            // 如果目标是冻结状态，跳过这个效果
            if (card.target === 'selected' && isTargetFrozen(targetPairIndex)) {
                console.log(`卡牌 ${card.name} 的目标已被冻结，效果跳过`);
                return;
            }

            // 检查是否在最前位置（经过所有其他卡牌处理后）
            if (this.pairStates[targetPairIndex].targetPosition === POSITION.FIRST) {
                this._applyCardEffect(card, isPlayer);
            }
        });

        // 检查是否冻结所有回合
        if (!this.freezeAllPairs) {
            // 启动位置动画
            this.positionAnimationProgress = 0;
        } else {
            // 冻结所有回合，位置不变
            this.freezeAllPairs = false;
        }
    }

    // 检查反制卡牌效果
    _checkCounterEffects() {
        // 检查玩家是否使用了反制卡牌
        if (this.playerCards[this.currentRoundCard]) {
            const playerCard = this.playerCards[this.currentRoundCard];
            if (playerCard.id === 'common_bio' && this.opponentName === SportsCharacterData.wang.name) {
                // 玩家使用"做生物"，对手是王老师，使对手的牌无效
                this.opponentCard = null;
                console.log('反制成功：王老师的卡牌被"做生物"无效化');
            } else if (playerCard.id === 'common_xuda' && this.opponentName === SportsCharacterData.qin.name) {
                // 玩家使用"徐达逸"，对手是秦老师，使对手的牌无效
                this.opponentCard = null;
                console.log('反制成功：秦老师的卡牌被"徐达逸"无效化');
            }
        }

        // 检查对手是否使用了反制卡牌
        if (this.opponentCard) {
            const opponentCard = this.opponentCard;
            const playerCharacter = this.gameClass.teacher.characterType;
            if (opponentCard.id === 'common_bio' && playerCharacter === CharacterType.WANG) {
                // 对手使用"做生物"，玩家是王老师，使玩家的牌无效
                this.playerCards[this.currentRoundCard] = null;
                console.log('反制成功：你的卡牌被对手的"做生物"无效化');
            } else if (opponentCard.id === 'common_xuda' && playerCharacter === CharacterType.QIN) {
                // 对手使用"徐达逸"，玩家是秦老师，使玩家的牌无效
                this.playerCards[this.currentRoundCard] = null;
                console.log('反制成功：你的卡牌被对手的"徐达逸"无效化');
            }
        }
    }

    // 应用卡牌效果
    _applyCardEffect(card, isPlayer) {
        if (!card) return;

        try {
            let result;

            // 根据卡牌的目标类型传入不同的参数
            if (card.target === 'all') {
                // 对所有组合生效的卡牌
                result = card.execute(this.pairStates);
            } else if (card.target === 'opponent') {
                // 对手反制卡牌
                result = card.execute();
            } else if (card.target === 'none') {
                // 无目标卡牌
                result = card.execute();
            } else if (card.target === 'selected') {
                // 对选中的组合生效的卡牌
                const targetPairIndex = isPlayer ? this.selectedPairInCanvas : this.opponentTargetPair;
                result = card.execute(this.pairStates[targetPairIndex], targetPairIndex, this.pairStates, this.gameClass);
            }

            // 处理特殊返回值
            if (result === 'freeze_all') {
                this.freezeAllPairs = true;
            } else if (result === 'draw_extra') {
                if (isPlayer) {
                    this.drawExtraNextRound = true;
                }
            } else if (result === 'skip_next_draw') {
                if (isPlayer) {
                    this.skipNextDraw = true;
                }
            } else if (typeof result === 'object' && result.type === 'sprint') {
                // 冲刺！：消耗赛人40精力，骑手20精力
                if (isPlayer) {
                    const pair = this.pairs[result.pairIndex];
                    const carrier = this.gameClass._getStudentByIndex(pair.carrier);
                    const rider = this.gameClass._getStudentByIndex(pair.rider);
                    if (carrier) {
                        const carrierEnergyLost = Math.min(carrier.energy, 40);
                        carrier.energy = Math.max(0, carrier.energy - 40);
                        this.pairStates[result.pairIndex].energyUsed += carrierEnergyLost;
                    }
                    if (rider) {
                        const riderEnergyLost = Math.min(rider.energy, 20);
                        rider.energy = Math.max(0, rider.energy - 20);
                        this.pairStates[result.pairIndex].riderEnergyUsed += riderEnergyLost;
                    }
                }
            } else if (typeof result === 'object' && result.type === 'whip') {
                // 鞭策：消耗赛人10精力
                if (isPlayer) {
                    const pair = this.pairs[result.pairIndex];
                    const carrier = this.gameClass._getStudentByIndex(pair.carrier);
                    if (carrier) {
                        const carrierEnergyLost = Math.min(carrier.energy, 10);
                        carrier.energy = Math.max(0, carrier.energy - 10);
                        this.pairStates[result.pairIndex].energyUsed += carrierEnergyLost;
                    }
                }
            }
            // 最后一搏的死亡效果在比赛结算时处理
        } catch (error) {
            console.error('卡牌效果执行失败:', error);
        }
    }

    // 处理绑定效果
    _processBindingEffect() {
        this.pairStates.forEach((state, index) => {
            if (state.bindTo !== undefined && state.bindTo >= 0 && state.bindTo < 4) {
                const boundState = this.pairStates[state.bindTo];
                
                // 如果自己或绑定的目标被冻结，保持当前位置不变
                if (state.frozen || boundState.frozen) {
                    // 不更新位置，保持当前状态
                    console.log(`组合${index + 1}或绑定的目标被冻结，绑定效果跳过`);
                } else {
                    // 将当前位置设置为绑定对象的目标位置
                    state.targetPosition = boundState.targetPosition;
                }
            }
        });
    }

    // 显示对手当前持有的牌（"信息"卡牌效果）
    _showOpponentCards() {
        // 如果对手还没有生成卡牌，先生成
        if (!this.opponentCards || this.opponentCards.length === 0) {
            this._generateOpponentCards();
        }

        // 创建弹窗
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.8);
        `;

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px; max-height: 80vh; overflow-y: auto; position: relative;">
                <div class="modal-header" style="padding-right: 40px;">
                    <h2>👁️ 对手手牌</h2>
                    <button class="close-btn" style="position: absolute; right: 15px; top: 15px; background: rgba(232, 199, 106, 0.2); border: 1px solid #e8c76a; color: #e8c76a; font-size: 24px; cursor: pointer; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(232, 199, 106, 0.4)'" onmouseout="this.style.background='rgba(232, 199, 106, 0.2)'" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p style="color: rgba(255,255,255,0.8); margin-bottom: 20px;">
                        对手 (${this.opponentName}) 当前持有的3张卡牌：
                    </p>
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        ${this.opponentCards.map((card, index) => `
                            <div class="card" style="width: 140px; height: 165px;">
                                <div class="card-name">${card.name}</div>
                                ${card.subtitle ? `<div class="card-subtitle">${card.subtitle}</div>` : ''}
                                <div class="card-desc">${card.effect}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // 显示下一回合抽到的牌
    _showNextRoundCards() {
        // 预测对手下一回合会抽到的牌（1张空牌+2张随机牌）
        const opponentCharacter = this._getOpponentCharacter();
        const predictedCards = [];
        
        // 固定抽一张空牌
        predictedCards.push(this._getCardById('common_empty'));
        
        // 抽取2张随机牌
        for (let i = 0; i < 2; i++) {
            const card = this._drawRandomCard(opponentCharacter, true);
            predictedCards.push(card);
        }

        // 创建弹窗
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.8);
        `;

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px; max-height: 80vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2>👁️ 下一回合预测</h2>
                </div>
                <div class="modal-body">
                    <p style="color: rgba(255,255,255,0.8); margin-bottom: 20px;">
                        对手 (${this.opponentName}) 下一回合会抽到以下3张卡牌（1张空牌+2张随机牌）：
                    </p>
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        ${predictedCards.map((card, index) => `
                            <div class="card" style="width: 140px; height: 165px;">
                                <div class="card-name">${card.name}</div>
                                ${card.subtitle ? `<div class="card-subtitle">${card.subtitle}</div>` : ''}
                                <div class="card-desc">${card.effect}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // 获取对手角色
    _getOpponentCharacter() {
        // 根据对手名字确定角色（直接使用名字匹配）
        if (this.opponentName === SportsCharacterData.wei.name) return 'wei';
        if (this.opponentName === SportsCharacterData.wang.name) return 'wang';
        if (this.opponentName === SportsCharacterData.qin.name) return 'qin';
        // 默认返回王老师
        return 'wang';
    }

    // 对手随机选择卡牌
    _opponentSelectCard() {
        if (!this.opponentCards || this.opponentCards.length === 0) return;

        // 获取对手角色
        const opponentCharacter = this._getOpponentCharacter();

        // 过滤掉针对自己角色的反制卡牌
        let availableCards = this.opponentCards.filter(card => {
            if (opponentCharacter === CharacterType.WANG && card.id === 'common_bio') {
                return false; // 王老师不使用"做生物"
            }
            if (opponentCharacter === CharacterType.QIN && card.id === 'common_xuda') {
                return false; // 秦老师不使用"徐达逸"
            }
            return true;
        });

        // 如果过滤后没有可用卡牌，就使用空牌
        if (availableCards.length === 0) {
            const emptyCard = this.opponentCards.find(card => card.id === 'common_empty');
            if (emptyCard) {
                this.opponentCardIndex = this.opponentCards.indexOf(emptyCard);
                this.opponentCard = emptyCard;
                return;
            }
        }

        // 优先选择非空牌
        const nonEmptyCards = availableCards.filter((card, index) => card.id !== 'common_empty');
        
        if (nonEmptyCards.length > 0) {
            // 70%概率选非空牌
            if (Math.random() < 0.7) {
                const selectedCard = nonEmptyCards[Math.floor(Math.random() * nonEmptyCards.length)];
                this.opponentCardIndex = this.opponentCards.indexOf(selectedCard);
                this.opponentCard = selectedCard;
            } else {
                // 30%概率随机选
                this.opponentCardIndex = Math.floor(Math.random() * availableCards.length);
                this.opponentCard = availableCards[this.opponentCardIndex];
            }
        } else {
            // 只有空牌，就随机选
            this.opponentCardIndex = Math.floor(Math.random() * availableCards.length);
            this.opponentCard = availableCards[this.opponentCardIndex];
        }

        // 智能选择目标骑手
        if (this.opponentCard && this.opponentCard.target === 'selected') {
            // 判断卡牌是正面还是负面效果
            const isPositiveEffect = this._isPositiveCard(this.opponentCard);
            
            if (isPositiveEffect) {
                // 正面效果：作用在自己下注的组合上
                this.opponentTargetPair = this.opponentBet;
            } else {
                // 负面效果：随机选择其他组合（优先选择玩家的组合）
                const otherPairs = [0, 1, 2, 3].filter(i => i !== this.opponentBet);
                // 60%概率选玩家的组合，40%概率选其他人的组合
                if (Math.random() < 0.6) {
                    this.opponentTargetPair = this.playerBet;
                } else {
                    this.opponentTargetPair = otherPairs[Math.floor(Math.random() * otherPairs.length)];
                }
            }
        } else {
            this.opponentTargetPair = null;
        }
    }

    // 判断卡牌是否为正面效果
    _isPositiveCard(card) {
        // 正面效果的卡牌类型
        if (card.type === CardType.BOOST) return true;
        
        // 特殊判断某些卡牌
        const positiveCards = [
            'wei_reference',      // 变换参考系（可能前进或后退，但概率是50%前进）
            'wei_rejuvenate',     // 返老还童（70%概率前进）
            'wang_chromium3',     // 三价铬（前进一次）
            'wang_time',          // 14:10（70%概率前进）
            'qin_skylark',        // 百灵鸟（前面的前进）
            'common_boost',       // 加速（60%概率前进）
            'common_surpass',     // 超越（前进到中间）
            'common_double',      // 连击（可能前进）
            'common_suppress'     // 压制（如果自己在最前，其他人后退）
        ];
        
        return positiveCards.includes(card.id);
    }

    // 对手出牌动画
    _opponentPlayCard() {
        // 使用对手已经选择的卡牌
        const opponentCard = this.opponentCard;

        if (!opponentCard) {
            // 没有选中的卡牌，不执行动画
            return;
        }

        // 创建动画卡牌
        const animatedCard = document.createElement('div');
        animatedCard.className = 'card opponent-animating-card';

        // 根据卡牌类型设置颜色
        let bgColor = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';  // 默认红色
        if (opponentCard.type === CardType.BOOST) {
            bgColor = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
        } else if (opponentCard.type === CardType.SLOW) {
            bgColor = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        } else if (opponentCard.type === CardType.SPECIAL) {
            bgColor = 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)';
        } else if (opponentCard.type === CardType.EMPTY) {
            bgColor = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
        }

        animatedCard.style.cssText = `
            position: fixed;
            left: -300px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
            min-width: 140px;
            min-height: 165px;
            background: ${bgColor};
            border: 3px solid #c0392b;
            border-radius: 12px;
            padding: 12px;
            color: white;
            transition: all 0.5s ease;
            box-shadow: 0 8px 16px rgba(231, 76, 60, 0.5);
            pointer-events: none;
            will-change: transform, left, top;
        `;
        animatedCard.innerHTML = `
            <div class="card-name" style="color: white; font-size: 1em; font-weight: bold; margin-bottom: 6px;">${opponentCard.name}</div>
            ${opponentCard.subtitle ? `<div class="card-subtitle" style="color: rgba(255,255,255,0.8); font-size: 0.8em; margin-bottom: 6px;">${opponentCard.subtitle}</div>` : ''}
            <div class="card-desc" style="color: rgba(255,255,255,0.9); font-size: 0.7em;">${opponentCard.effect}</div>
        `;
        
        const animationContainer = document.querySelector('.animation-container');
        if (animationContainer) {
            animationContainer.appendChild(animatedCard);
        } else {
            document.body.appendChild(animatedCard);
        }

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // 第一步：移动到屏幕中央（0.5秒）
        requestAnimationFrame(() => {
            animatedCard.style.left = (centerX - 70) + 'px';
            animatedCard.style.top = (centerY - 82.5) + 'px';
            animatedCard.style.transform = 'none';
        });

        // 第二步：在中央停留并放大（0.8秒）
        setTimeout(() => {
            animatedCard.style.transition = 'all 0.8s ease';
            animatedCard.style.transform = 'scale(1.5)';
        }, 500);

        // 第三步：旋转并向左下方移出屏幕（0.4秒）
        setTimeout(() => {
            animatedCard.style.transition = 'all 0.4s ease-in';
            animatedCard.style.left = '-400px';
            animatedCard.style.top = (window.innerHeight + 100) + 'px';
            animatedCard.style.transform = 'rotate(-720deg) scale(0.1)';
            animatedCard.style.opacity = '0';
        }, 1300);

        // 移除动画卡牌
        setTimeout(() => {
            animatedCard.remove();
        }, 1700);
    }

    // 结束游戏
    _endGame() {
        this.isFinished = true;

        // 重新启用 resize 监听器
        if (this.resizeListener) {
            window.addEventListener('resize', this.resizeListener);
        }

        // 清空卡牌显示
        const playerCardsDisplay = document.getElementById('playerCardsDisplay');
        if (playerCardsDisplay) {
            playerCardsDisplay.innerHTML = '';
        }

        // 隐藏下一回合按钮
        const nextBtn = document.getElementById('nextRoundBtn');
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }

        // 设置终点线初始位置为屏幕最右边
        this.finishLineX = this.canvas.width;

        // 确定获胜者（身位最前的）
        let maxPos = -1;
        this.pairStates.forEach((state, index) => {
            const finalPos = state.targetPosition !== undefined ? state.targetPosition : state.position;
            if (finalPos > maxPos) {
                maxPos = finalPos;
                this.winnerIndex = index;
            }
        });
    }

    // 显示结果
    _showResult() {
        this.active = false;
        cancelAnimationFrame(this.animationId);

        const modal = document.getElementById('shineHumanTeenModal');

        // 获取对手选择的组合信息
        const opponentPair = this.pairs[this.opponentBet];
        const opponentCarrier = this.gameClass._getStudentByIndex(opponentPair.carrier);
        const opponentRider = this.gameClass._getStudentByIndex(opponentPair.rider);

        modal.innerHTML = `
            <div class="modal-content" style="width: 95vw; max-width: 900px; display: flex; flex-direction: column; height: auto;">
                <div class="modal-header" style="flex-shrink: 0;">
                    <h2>🏆 比赛结束！</h2>
                </div>
                <div class="modal-body" style="display: flex; flex-direction: column; padding: 15px; overflow-y: auto; max-height: 80vh;">
                    <!-- 赌注结果（胜负结果）放在最上面 -->
                    <div class="bet-result" id="betResult" style="flex-shrink: 0; margin-bottom: 20px;"></div>

                    <!-- 保留比赛最终画面 -->
                    <div class="result-canvas-container" style="flex-shrink: 0; margin-bottom: 20px;">
                        <canvas id="finalRaceCanvas" style="width: 100%; height: 300px; background: #0d1117; border-radius: 8px;"></canvas>
                    </div>

                    <!-- 比赛结果信息 -->
                    <div class="result-info">
                        <h3>🏆 比赛结果</h3>
                        <div class="pairs-results">
                            ${this.pairs.map((pair, index) => {
                                const carrier = this.gameClass._getStudentByIndex(pair.carrier);
                                const rider = this.gameClass._getStudentByIndex(pair.rider);
                                const isPlayerBet = index === this.playerBet;
                                const isOpponentBet = index === this.opponentBet;
                                const pos = this.pairStates[index].targetPosition !== undefined
                                    ? this.pairStates[index].targetPosition
                                    : this.pairStates[index].position;
                                const posText = ['最后', '后方', '中间', '前方', '最前'][pos];

                                return { index, pair, carrier, rider, isPlayerBet, isOpponentBet, pos, posText };
                            }).sort((a, b) => b.pos - a.pos).map((item, rank) => {
                                return `
                                    <div class="pair-result-item ${item.isPlayerBet ? 'player-bet' : ''} ${item.isOpponentBet ? 'opponent-bet' : ''}">
                                        <div class="pair-result-rank">#${rank + 1}</div>
                                        <div class="pair-result-names">
                                            <div class="pair-result-rider">${item.rider.name}</div>
                                            <div class="pair-result-divider">+</div>
                                            <div class="pair-result-carrier">${item.carrier.name}</div>
                                        </div>
                                        <div class="pair-result-position">组合 ${item.index + 1}</div>
                                        ${item.isPlayerBet ? '<div class="bet-badge player-badge">你</div>' : ''}
                                        ${item.isOpponentBet ? '<div class="bet-badge opponent-badge">对手</div>' : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="bet-result-summary">
                            <p>你下注的组合: <strong>${this.playerBet + 1}</strong></p>
                            <p>对手 (${this.opponentName}) 下注的组合: <strong>${this.opponentBet + 1}</strong></p>
                        </div>
                    </div>

                    <!-- 精力消耗和死亡统计 -->
                    <div class="result-info">
                        <h3>⚡ 精力消耗统计</h3>
                        <div class="energy-stats">
                            ${this.pairs.map((pair, index) => {
                                const carrier = this.gameClass._getStudentByIndex(pair.carrier);
                                const rider = this.gameClass._getStudentByIndex(pair.rider);
                                const willDie = this.pairStates[index].willDieAfterRace;
                                const energyUsed = this.pairStates[index].energyUsed;
                                const riderEnergyUsed = this.pairStates[index].riderEnergyUsed;
                                const carrierInitialEnergy = this.pairStates[index].carrierInitialEnergy;
                                const riderInitialEnergy = this.pairStates[index].riderInitialEnergy;
                                const carrierCurrentEnergy = carrier ? carrier.energy : 100;
                                const riderCurrentEnergy = rider ? rider.energy : 100;

                                return { index, carrier, rider, carrierInitialEnergy, riderInitialEnergy, carrierCurrentEnergy, riderCurrentEnergy, willDie, energyUsed, riderEnergyUsed };
                            }).filter(item => item.willDie || item.energyUsed > 0 || item.riderEnergyUsed > 0).map(item => {
                                return `
                                    <div class="energy-stat-item ${item.willDie ? 'death' : ''}">
                                        <div class="stat-pair-info">
                                            <span class="stat-role">组合${item.index + 1}</span>
                                            <span class="stat-divider">|</span>
                                            <span class="stat-name">${item.carrier.name}</span>
                                            <span class="stat-divider">|</span>
                                            <span class="stat-name">${item.rider.name}</span>
                                        </div>
                                        <div class="stat-details">
                                            ${item.willDie ? '<span class="death-status">💀 赛人死亡</span>' : ''}
                                            ${item.energyUsed > 0 ? `<span class="energy-stat">赛人: ${item.carrierInitialEnergy} → ${item.carrierCurrentEnergy} (-${item.energyUsed})</span>` : ''}
                                            ${item.riderEnergyUsed > 0 ? `<span class="energy-stat">骑手: ${item.riderInitialEnergy} → ${item.riderCurrentEnergy} (-${item.riderEnergyUsed})</span>` : ''}
                                            ${item.carrierCurrentEnergy <= 0 ? '<span class="death-status">💀 赛人精力耗尽</span>' : ''}
                                            ${item.riderCurrentEnergy <= 0 ? '<span class="death-status">💀 骑手精力耗尽</span>' : ''}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                            ${this.pairs.every((pair, index) => !this.pairStates[index].willDieAfterRace && this.pairStates[index].energyUsed === 0 && this.pairStates[index].riderEnergyUsed === 0) ?
                                '<p style="color: rgba(255,255,255,0.6); text-align: center;">本场比赛没有精力消耗或死亡</p>' : ''}
                        </div>
                    </div>
                    <button class="btn" onclick="document.getElementById('shineHumanTeenModal').style.display='none'" style="margin-top: 15px;">关闭</button>
                </div>
            </div>
        `;

        // 绘制最终比赛画面
        setTimeout(() => {
            const finalCanvas = document.getElementById('finalRaceCanvas');
            if (finalCanvas) {
                finalCanvas.width = finalCanvas.clientWidth;
                finalCanvas.height = finalCanvas.clientHeight;
                const finalCtx = finalCanvas.getContext('2d');

                // 绘制最终状态
                this._drawTracks(finalCtx, finalCanvas);
                this._drawPairs(finalCtx, finalCanvas);

                // 绘制获胜标记
                const totalHeight = finalCanvas.height - 60;
                const trackGap = 3;
                const trackHeight = (totalHeight - (4 - 1) * trackGap) / 4;
                const startY = 30;
                const centerX = finalCanvas.width / 2;

                const winnerY = startY + this.winnerIndex * (trackHeight + trackGap) + trackHeight / 2;
                const winnerState = this.pairStates[this.winnerIndex];
                const winnerPos = winnerState.targetPosition !== undefined ? winnerState.targetPosition : winnerState.position;
                const winnerX = centerX + (winnerPos - 2) * 80;

                // 绘制皇冠
                finalCtx.fillStyle = '#f1c40f';
                finalCtx.font = 'bold 40px Arial';
                finalCtx.textAlign = 'center';
                finalCtx.fillText('👑', winnerX, winnerY - 70);
            }
        }, 100);

        // 判断赌注结果
        const resultDiv = document.getElementById('betResult');

        // 获取玩家和对手下注组合的最终位置
        const playerPos = this.pairStates[this.playerBet].targetPosition !== undefined
            ? this.pairStates[this.playerBet].targetPosition
            : this.pairStates[this.playerBet].position;
        const opponentPos = this.pairStates[this.opponentBet].targetPosition !== undefined
            ? this.pairStates[this.opponentBet].targetPosition
            : this.pairStates[this.opponentBet].position;

        if (playerPos > opponentPos) {
            // 玩家赢 - 获得2倍赌注（本金+奖金）
            const winnings = this.betAmount * 2;
            this.gameClass.teacher.salary += winnings;
            resultDiv.innerHTML = `
                <p style="color: #2ecc71; font-size: 1.3em; font-weight: bold;">🎉 恭喜！你赢了！</p>
                <p>获得 ${winnings} 元（本金+奖金）</p>
            `;
            this.gameClass.log(`🏆 闪耀！类人少年项目胜利！获得${winnings}元工资`, 'highlight');
        } else if (playerPos < opponentPos) {
            // 对手赢 - 失去赌注
            resultDiv.innerHTML = `
                <p style="color: #e74c3c; font-size: 1.3em; font-weight: bold;">😢 很遗憾，你输了！</p>
                <p>失去 ${this.betAmount} 元</p>
            `;
            this.gameClass.log(`😢 闪耀！类人少年项目失败！失去${this.betAmount}元工资`, 'warning');
        } else {
            // 平局 - 返还赌注
            this.gameClass.teacher.salary += this.betAmount;
            resultDiv.innerHTML = `
                <p style="color: #f39c12; font-size: 1.3em; font-weight: bold;">🤝 平局！</p>
                <p>赌注已返还</p>
            `;
            this.gameClass.log(`🤝 闪耀！类人少年项目平局！赌注已返还`, 'info');
        }

        // 处理死亡和精力消耗效果
        this.pairStates.forEach((state, index) => {
            const pair = this.pairs[index];
            const carrier = this.gameClass._getStudentByIndex(pair.carrier);
            const rider = this.gameClass._getStudentByIndex(pair.rider);

            // 处理赛人
            if (carrier && carrier.alive) {
                // 检查是否因为"最后一搏"而死亡
                if (state.willDieAfterRace) {
                    carrier.alive = false;
                    this.gameClass.log(`💀 ${carrier.name} 在闪耀！类人少年项目中因"最后一搏"而死亡！`, 'danger');
                }
                // 检查是否因为精力耗尽而死亡
                else if (state.energyUsed > 0 && carrier.energy <= 0) {
                    carrier.alive = false;
                    this.gameClass.log(`💀 ${carrier.name} 在闪耀！类人少年项目中因精力耗尽而死亡！`, 'danger');
                }
                // 精力消耗日志
                else if (state.energyUsed > 0) {
                    this.gameClass.log(`⚡ ${carrier.name} 在闪耀！类人少年项目中消耗${state.energyUsed}精力`, 'info');
                }
            }

            // 处理骑手（如果有精力消耗且精力耗尽，也应该死亡）
            if (rider && rider.alive && state.riderEnergyUsed > 0) {
                if (rider.energy <= 0) {
                    rider.alive = false;
                    this.gameClass.log(`💀 ${rider.name} 在闪耀！类人少年项目中因精力耗尽而死亡！`, 'danger');
                } else {
                    this.gameClass.log(`⚡ ${rider.name} 在闪耀！类人少年项目中消耗${state.riderEnergyUsed}精力`, 'info');
                }
            }
        });

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .result-info {
                background: rgba(232, 199, 106, 0.1);
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }

            .result-info h3 {
                color: #e8c76a;
                font-size: 1.5em;
                margin-bottom: 15px;
                text-align: center;
            }

            .result-info p {
                margin: 10px 0;
                color: rgba(255, 255, 255, 0.9);
                font-size: 1.1em;
            }

            .pairs-results {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 20px;
            }

            .pair-result-item {
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(232, 199, 106, 0.3);
                border-radius: 8px;
                padding: 15px 20px;
                position: relative;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-height: 60px;
            }

            .pair-result-item:hover {
                background: rgba(232, 199, 106, 0.1);
            }

            .pair-result-item.winner {
                background: rgba(241, 196, 15, 0.15);
                border-color: #f1c40f;
                box-shadow: 0 0 15px rgba(241, 196, 15, 0.3);
            }

            .pair-result-rank {
                font-size: 1.4em;
                font-weight: bold;
                color: #e8c76a;
                width: 50px;
                flex-shrink: 0;
            }

            .pair-result-names {
                display: flex;
                align-items: center;
                gap: 12px;
                flex-grow: 1;
            }

            .pair-result-rider,
            .pair-result-carrier {
                font-size: 1.1em;
                color: rgba(255, 255, 255, 0.9);
                font-weight: 500;
            }

            .pair-result-divider {
                color: rgba(255, 255, 255, 0.3);
                font-weight: bold;
                font-size: 1.2em;
            }

            .pair-result-position {
                font-size: 1.0em;
                color: rgba(255, 255, 255, 0.7);
                flex-shrink: 0;
                padding-right: 80px;
            }

            .bet-badge {
                position: absolute;
                right: 10px;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8em;
                font-weight: bold;
            }

            .bet-badge.player-badge {
                background: #2ecc71;
                color: white;
            }

            .bet-badge.opponent-badge {
                background: #e74c3c;
                color: white;
            }

            .energy-stats {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .energy-stat-item {
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(232, 199, 106, 0.3);
                border-radius: 8px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .energy-stat-item.death {
                background: rgba(231, 76, 60, 0.15);
                border-color: #e74c3c;
            }

            .stat-pair-info {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 1.1em;
                font-weight: bold;
            }

            .stat-role {
                color: #e8c76a;
            }

            .stat-divider {
                color: rgba(255, 255, 255, 0.3);
            }

            .stat-name {
                color: rgba(255, 255, 255, 0.9);
            }

            .stat-details {
                display: flex;
                flex-direction: column;
                gap: 5px;
                font-size: 1.0em;
            }

            .death-status {
                color: #e74c3c;
                font-weight: bold;
            }

            .energy-stat {
                color: rgba(255, 255, 255, 0.8);
            }

            .bet-result-summary {
                background: rgba(52, 152, 219, 0.1);
                padding: 15px;
                border-radius: 8px;
                border: 2px solid #3498db;
                margin-top: 10px;
            }

            .bet-result-summary p {
                margin: 5px 0;
                color: rgba(255, 255, 255, 0.9);
            }

            .bet-result {
                padding: 30px;
                border-radius: 12px;
                margin-bottom: 20px;
                background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(52, 152, 219, 0.1) 100%);
                border: 3px solid #e8c76a;
                box-shadow: 0 8px 20px rgba(232, 199, 106, 0.3);
                text-align: center;
            }

            .bet-result p {
                margin: 10px 0;
                font-size: 1.4em;
            }

            .result-canvas-container {
                border: 3px solid #e8c76a;
                border-radius: 8px;
            }
        `;

        document.head.appendChild(style);
    }

    // 退出游戏
    exitGame() {
        this.active = false;
        cancelAnimationFrame(this.animationId);

        // 返还赌注
        if (!this.isFinished) {
            this.gameClass.teacher.salary += this.betAmount;
        }

        const modal = document.getElementById('shineHumanTeenModal');
        if (modal) {
            modal.remove();
        }
    }
}

// 创建全局实例
let shineHumanTeen = null;

// 暴露给console调用的函数
window.openSportsDay = function() {
    if (!gameClass) {
        console.error('游戏未开始！');
        alert('请先开始游戏！');
        return;
    }

    console.log('正在打开运动会活动...');
    
    // 如果之前有活动的实例，先清理
    if (shineHumanTeen && shineHumanTeen.active) {
        shineHumanTeen.active = false;
        cancelAnimationFrame(shineHumanTeen.animationId);
        const modal = document.getElementById('shineHumanTeenModal');
        if (modal) {
            modal.remove();
        }
    }
    
    // 清理活动选择modal
    const sportsDayModal = document.getElementById('sportsDayModal');
    if (sportsDayModal) {
        sportsDayModal.remove();
    }

    try {
        shineHumanTeen = new ShineHumanTeenActivity(gameClass);
        shineHumanTeen.showActivitySelection();
        console.log('运动会活动已打开');
    } catch (error) {
        console.error('打开运动会活动失败:', error);
        alert('打开失败：' + error.message);
    }
};

console.log('✨ 闪耀！类人少年 活动系统已加载');
console.log('📝 使用 openSportsDay() 打开活动选择界面');

// ============================================================================
// 标枪接力 - 活动类
// ============================================================================

class JavelinRelayActivity {
    constructor(gameClass) {
        this.gameClass = gameClass;
        this.active = false;

        // 选中的学生（5个参赛选手）
        this.selectedStudents = [];
        this.throwerIndex = 0;  // 当前投掷者索引（0-4）

        // 跑道配置
        this.ATHLETE_ZONE_WIDTH = 120;   // 选手区域宽度
        this.AUDIENCE_MIN_WIDTH = 100;   // 观众席最小宽度
        this.AUDIENCE_MAX_WIDTH = 250;   // 观众席最大宽度
        this.EMPTY_ZONE_WIDTH = 300;     // 空地宽度

        // 跑道段（从左到右）
        this.trackSegments = [];
        this.cameraOffset = 0;  // 摄像机偏移量
        this.cameraTargetOffset = 0;  // 目标偏移量

        // 标枪状态
        this.javelin = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            isFlying: false,
            trail: [],  // 尾迹点数组
            hasLanded: false,
            landTime: 0  // 落地时间
        };

        // 投掷控制
        this.throwControl = {
            isCharging: false,
            chargeStartTime: 0,
            mousePos: { x: 0, y: 0 },
            mouseDown: false
        };

        // 接力状态
        this.relayState = {
            caught: false,
            caughtTime: 0,
            waitingForCatch: false
        };

        // 回飞状态
        this.returnState = {
            isReturning: false,
            returnStartTime: 0,
            returnDelay: 2000  // 回飞延迟2秒
        };

        // 受害学生（被扎死的学生）
        this.victims = [];

        // Canvas和上下文
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;

        // 游戏结束
        this.gameOver = false;
        this.gameOverReason = null;

        // 重力
        this.gravity = 9.8 * 10;  // 放大重力效果
    }

    // 显示活动选择界面
    showActivitySelection() {
        const modal = document.getElementById('javelinRelayModal');
        if (!modal) {
            this._createActivityModal();
        } else {
            modal.style.display = 'flex';
        }
    }

    // 创建活动模态框
    _createActivityModal() {
        const modal = document.createElement('div');
        modal.id = 'javelinRelayModal';
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            z-index: 800;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(4px);
            padding: 0;
        `;

        modal.innerHTML = `
            <div class="modal-content javelin-relay-selection" style="width: 100vw; height: 100vh; max-width: none; max-height: none; overflow: hidden; display: flex; flex-direction: column; padding: 0; margin: 0;">
                <div class="modal-header" style="flex-shrink: 0;">
                    <h2>🏃‍♂️ 标枪接力</h2>
                </div>
                <div class="modal-body" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px;">
                    <div class="activity-card">
                        <div class="activity-icon">🏆</div>
                        <div class="activity-title">标枪接力</div>
                        <div class="activity-desc">
                            <p>选择5名参赛选手，依次投掷标枪进行接力</p>
                            <p style="color: #e74c3c; font-weight: bold;">⚠️ 小心：标枪可能扎死观众或选手！</p>
                        </div>
                        <button class="btn start-activity-btn" onclick="javelinRelay.showStudentSelection()">开始活动</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .javelin-relay-selection {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                max-width: 600px;
            }

            .activity-card {
                background: rgba(232, 199, 106, 0.1);
                border: 2px solid #e8c76a;
                border-radius: 12px;
                padding: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin: 10px;
            }

            .activity-card:hover {
                background: rgba(232, 199, 106, 0.2);
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(232, 199, 106, 0.3);
            }

            .activity-icon {
                font-size: 48px;
                text-align: center;
                margin-bottom: 15px;
            }

            .activity-title {
                font-size: 24px;
                font-weight: bold;
                color: #e8c76a;
                text-align: center;
                margin-bottom: 15px;
            }

            .activity-desc {
                color: rgba(255, 255, 255, 0.8);
                text-align: center;
                line-height: 1.6;
            }

            .start-activity-btn {
                background: rgba(232, 199, 106, 0.2);
                color: #e8c76a;
                border: 2px solid #e8c76a;
                padding: 12px 30px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 1em;
                transition: all 0.3s ease;
                margin-top: 15px;
            }

            .start-activity-btn:hover {
                background: rgba(232, 199, 106, 0.3);
                transform: translateY(-2px);
            }
        `;

        document.head.appendChild(style);
    }

    // 显示学生选择界面
    showStudentSelection() {
        const modal = document.getElementById('javelinRelayModal');

        modal.innerHTML = `
            <div class="modal-content" style="width: 100vw; height: 100vh; max-width: none; max-height: none; overflow: hidden; display: flex; flex-direction: column; padding: 0; margin: 0;">
                <div class="modal-header" style="flex-shrink: 0;">
                    <h2>🏃‍♂️ 标枪接力 - 选择参赛选手</h2>
                </div>
                <div class="modal-body" style="flex: 1; overflow: hidden; display: flex; flex-direction: column; padding: 0;">
                    <div class="selection-info">
                        <p>请选择5名参赛选手（按顺序：1号→2号→3号→4号→5号）</p>
                        <p>已选择: <span id="selectedCount">0</span>/5</p>
                        <div id="selectionProgress" class="selection-progress"></div>
                    </div>
                    <div class="student-grid-container">
                        <div class="student-grid" id="studentGrid"></div>
                    </div>
                    <div class="selection-buttons">
                        <button class="btn" id="confirmSelectionBtn" onclick="javelinRelay.confirmStudentSelection()" disabled>确认选择</button>
                        <button class="btn" onclick="javelinRelay.clearSelection()">清空选择</button>
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .selection-info {
                background: rgba(232, 199, 106, 0.1);
                padding: 20px;
                border-bottom: 2px solid rgba(232, 199, 106, 0.3);
                margin-bottom: 10px;
                text-align: center;
                flex-shrink: 0;
            }

            .selection-info p {
                margin: 5px 0;
                color: rgba(255, 255, 255, 0.9);
                font-size: 1.2em;
            }

            .selection-progress {
                display: flex;
                gap: 8px;
                justify-content: center;
                margin-top: 10px;
            }

            .progress-slot {
                width: 35px;
                height: 35px;
                border: 2px dashed rgba(232, 199, 106, 0.5);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75em;
                color: rgba(255, 255, 255, 0.5);
                flex-shrink: 0;
            }

            .progress-slot.filled {
                background: rgba(232, 199, 106, 0.3);
                border-color: #e8c76a;
                color: #e8c76a;
                font-weight: bold;
            }

            .student-grid-container {
                flex: 1;
                overflow-y: auto;
                padding: 30px;
                background: rgba(255, 255, 255, 0.02);
                margin-bottom: 0;
            }

            .student-grid {
                display: grid;
                grid-template-columns: repeat(9, 1fr);
                gap: 20px;
            }

            .student-select-item {
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(232, 199, 106, 0.3);
                border-radius: 12px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
                position: relative;
                min-height: 110px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .student-select-item:hover {
                background: rgba(232, 199, 106, 0.1);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(232, 199, 106, 0.4);
            }

            .student-select-item.selected {
                background: rgba(232, 199, 106, 0.2);
                border-color: #e8c76a;
                box-shadow: 0 0 15px rgba(232, 199, 106, 0.6);
            }

            .student-select-item .selection-number {
                position: absolute;
                top: -10px;
                right: -10px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: #e8c76a;
                color: #0d1117;
                font-weight: bold;
                font-size: 1em;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            }

            .student-select-item .name {
                color: #fff;
                font-weight: bold;
                margin-bottom: 8px;
                font-size: 0.95em;
            }

            .selection-buttons {
                display: flex;
                gap: 20px;
                justify-content: center;
                flex-shrink: 0;
                padding: 20px;
                background: rgba(0, 0, 0, 0.3);
            }

            .selection-buttons button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .selection-buttons button {
                background: #e8c76a;
                color: #0d1117;
                border: none;
                padding: 18px 50px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
                font-size: 1.2em;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(232, 199, 106, 0.3);
            }

            .selection-buttons button:hover {
                background: #ffd700;
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(232, 199, 106, 0.5);
            }
        `;

        document.head.appendChild(style);

        // 渲染学生列表
        this._renderStudentGrid();
    }

    // 渲染学生选择网格
    _renderStudentGrid() {
        const grid = document.getElementById('studentGrid');
        if (!grid) return;

        grid.innerHTML = '';

        // 更新选择进度
        const progressDiv = document.getElementById('selectionProgress');
        if (progressDiv) {
            progressDiv.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const slot = document.createElement('div');
                slot.className = 'progress-slot';
                if (i < this.selectedStudents.length) {
                    slot.classList.add('filled');
                    slot.textContent = i + 1;
                } else {
                    slot.textContent = `${i + 1}号`;
                }
                progressDiv.appendChild(slot);
            }
        }

        const aliveStudents = this.gameClass.students.filter(s => s.status !== Status.Dead);

        aliveStudents.forEach(student => {
            const selectedIndex = this.selectedStudents.indexOf(student.index);
            const item = document.createElement('div');
            item.className = 'student-select-item';
            if (selectedIndex !== -1) {
                item.classList.add('selected');
            }

            let content = `<div class="name">${student.name}</div>`;

            if (selectedIndex !== -1) {
                content = `
                    <div class="selection-number">${selectedIndex + 1}</div>
                    <div class="name">${student.name}</div>
                `;
            }

            item.innerHTML = content;

            item.onclick = () => {
                if (this.selectedStudents.includes(student.index)) {
                    this.selectedStudents = this.selectedStudents.filter(i => i !== student.index);
                } else if (this.selectedStudents.length < 5) {
                    this.selectedStudents.push(student.index);
                }

                this._renderStudentGrid();
                document.getElementById('selectedCount').textContent = this.selectedStudents.length;
                document.getElementById('confirmSelectionBtn').disabled = this.selectedStudents.length !== 5;
            };

            grid.appendChild(item);
        });
    }

    // 清空选择
    clearSelection() {
        this.selectedStudents = [];
        this._renderStudentGrid();
        document.getElementById('selectedCount').textContent = '0';
        document.getElementById('confirmSelectionBtn').disabled = true;
    }

    // 确认学生选择
    confirmStudentSelection() {
        if (this.selectedStudents.length !== 5) return;

        // 初始化游戏
        this._initializeGame();

        // 显示游戏界面
        this._showGameInterface();
    }

    // 初始化游戏
    _initializeGame() {
        this.active = true;
        this.throwerIndex = 0;
        this.gameOver = false;
        this.gameOverReason = null;
        this.victims = [];

        // 生成跑道段
        this._generateTrackSegments();

        // 计算跑道总宽度
        const totalTrackWidth = this.trackSegments.reduce((sum, seg) => sum + seg.width, 0);

        // 计算初始摄像机偏移，让场地显示在屏幕中央
        // 假设屏幕宽度约等于跑道总宽度
        // 摄像机偏移 = (跑道总宽度 - 屏幕宽度) / 2
        // 但我们希望选手1的位置（0）在屏幕左侧一点，所以不居中整个跑道
        // 让前两个选手区域和观众席1在屏幕内可见
        const targetWidth = this.ATHLETE_ZONE_WIDTH * 2 + this.AUDIENCE_MIN_WIDTH;  // 前2个选手区域+最小观众席
        this.cameraOffset = (targetWidth - 600) / 2;  // 600是预估的屏幕宽度
        if (this.cameraOffset < 0) this.cameraOffset = 0;
        this.cameraTargetOffset = this.cameraOffset;

        // 重置标枪状态
        this.javelin = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            isFlying: false,
            trail: [],
            hasLanded: false,
            landTime: 0
        };

        // 重置投掷控制
        this.throwControl = {
            isCharging: false,
            chargeStartTime: 0,
            mousePos: { x: 0, y: 0 },
            mouseDown: false
        };

        // 重置接力状态
        this.relayState = {
            caught: false,
            caughtTime: 0,
            waitingForCatch: false
        };

        // 重置回飞状态
        this.returnState = {
            isReturning: false,
            returnStartTime: 0,
            returnDelay: 2000
        };
    }

    // 生成跑道段
    _generateTrackSegments() {
        this.trackSegments = [];

        // 计算观众席宽度（随机）
        const audience1Width = Math.random() * (this.AUDIENCE_MAX_WIDTH - this.AUDIENCE_MIN_WIDTH) + this.AUDIENCE_MIN_WIDTH;
        const audience2Width = Math.random() * (this.AUDIENCE_MAX_WIDTH - this.AUDIENCE_MIN_WIDTH) + this.AUDIENCE_MIN_WIDTH;

        // 按顺序添加跑道段
        // 1. 选手1位置段
        this.trackSegments.push({
            type: 'athlete',
            index: 0,
            width: this.ATHLETE_ZONE_WIDTH,
            startX: 0
        });

        // 2. 观众席1
        this.trackSegments.push({
            type: 'audience',
            width: audience1Width,
            startX: this.ATHLETE_ZONE_WIDTH
        });

        // 3. 选手2位置段
        this.trackSegments.push({
            type: 'athlete',
            index: 1,
            width: this.ATHLETE_ZONE_WIDTH,
            startX: this.ATHLETE_ZONE_WIDTH + audience1Width
        });

        // 4. 观众席2
        this.trackSegments.push({
            type: 'audience',
            width: audience2Width,
            startX: this.ATHLETE_ZONE_WIDTH + audience1Width + this.ATHLETE_ZONE_WIDTH
        });

        // 5. 空地
        this.trackSegments.push({
            type: 'empty',
            width: this.EMPTY_ZONE_WIDTH,
            startX: this.ATHLETE_ZONE_WIDTH + audience1Width + this.ATHLETE_ZONE_WIDTH + audience2Width
        });
    }

    // 显示游戏界面
    _showGameInterface() {
        const modal = document.getElementById('javelinRelayModal');

        modal.innerHTML = `
            <div class="modal-content" style="width: 100vw; height: 100vh; max-width: none; max-height: none; overflow: hidden; display: flex; flex-direction: column; padding: 0; margin: 0;">
                <div class="modal-header" style="flex-shrink: 0;">
                    <div class="game-info">
                        <span>🏃‍♂️ 标枪接力</span>
                        <span>当前投掷: <span id="currentThrower">1</span>号选手</span>
                        <span>已死亡: <span id="deathCount">0</span>人</span>
                    </div>
                </div>
                <div class="modal-body" style="display: flex; flex-direction: column; flex: 1; overflow: hidden; padding: 0;">
                    <div class="game-area" style="flex: 1; min-height: 400px; overflow: hidden; position: relative;">
                        <canvas id="javelinRelayCanvas" style="display: block;"></canvas>
                        <div class="instructions">
                            <p>🖱️ 鼠标控制方向，按住蓄力，松开发射</p>
                            <p>⌨️ 接住标枪后按空格键</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .game-info {
                display: flex;
                gap: 30px;
                align-items: center;
                color: rgba(255, 255, 255, 0.8);
                font-size: 1em;
            }

            .game-area {
                background: #0d1117;
                border-radius: 8px;
                overflow: hidden;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #javelinRelayCanvas {
                width: 100%;
                height: 100%;
            }

            .instructions {
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                padding: 15px 25px;
                border-radius: 8px;
                border: 1px solid rgba(232, 199, 106, 0.3);
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.9em;
                text-align: center;
                z-index: 10;
            }

            .instructions p {
                margin: 5px 0;
            }
        `;

        document.head.appendChild(style);

        // 初始化Canvas
        this.canvas = document.getElementById('javelinRelayCanvas');
        this.ctx = this.canvas.getContext('2d');

        // 设置Canvas尺寸
        this._resizeCanvas();

        // 添加事件监听器
        this.canvas.addEventListener('mousemove', (e) => this._handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this._handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this._handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this._handleMouseUp(e));

        // 添加键盘事件监听器（空格键）
        window.addEventListener('keydown', (e) => this._handleKeyDown(e));

        // 监听窗口大小变化
        window.addEventListener('resize', () => this._resizeCanvas());

        // 开始动画循环
        this._startAnimationLoop();
    }

    // 调整Canvas尺寸
    _resizeCanvas() {
        const container = this.canvas.parentElement;
        if (container) {
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;

            // 重新计算摄像机偏移，让场地居中
            const totalTrackWidth = this.trackSegments.reduce((sum, seg) => sum + seg.width, 0);
            const screenWidth = this.canvas.width;
            
            // 让场地居中显示
            const centerOffset = (totalTrackWidth - screenWidth) / 2;
            if (centerOffset > 0) {
                this.cameraTargetOffset = centerOffset;
            } else {
                this.cameraTargetOffset = 0;
            }
        }
    }

    // 处理鼠标移动
    _handleMouseMove(e) {
        if (!this.active || this.gameOver) return;

        const rect = this.canvas.getBoundingClientRect();
        this.throwControl.mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    // 处理鼠标按下
    _handleMouseDown(e) {
        if (!this.active || this.gameOver || this.javelin.isFlying) return;

        this.throwControl.isCharging = true;
        this.throwControl.chargeStartTime = Date.now();
        this.throwControl.mouseDown = true;
    }

    // 处理鼠标松开
    _handleMouseUp(e) {
        if (!this.active || this.gameOver || !this.throwControl.isCharging) return;

        // 发射标枪
        this._throwJavelin();

        this.throwControl.isCharging = false;
        this.throwControl.mouseDown = false;
    }

    // 处理键盘按下
    _handleKeyDown(e) {
        if (!this.active || this.gameOver) return;

        // 空格键：接住标枪
        if (e.code === 'Space' && this.relayState.waitingForCatch && !this.relayState.caught) {
            e.preventDefault();
            this._catchJavelin();
        }
    }

    // 投掷标枪
    _throwJavelin() {
        const thrower = this.gameClass._getStudentByIndex(this.selectedStudents[this.throwerIndex]);
        if (!thrower) return;

        // 计算投掷位置
        const throwerX = 50;  // 选手1的固定位置
        const throwerY = this.canvas.height / 2;

        // 计算投掷方向
        const dx = this.throwControl.mousePos.x - throwerX;
        const dy = this.throwControl.mousePos.y - throwerY;
        const angle = Math.atan2(dy, dx);

        // 计算蓄力（0-3秒）
        const chargeTime = Math.min((Date.now() - this.throwControl.chargeStartTime) / 1000, 3);
        const power = 300 + chargeTime * 300;  // 基础速度300，最大速度1200

        // 设置标枪初始状态
        this.javelin.x = throwerX;
        this.javelin.y = throwerY;
        this.javelin.vx = Math.cos(angle) * power;
        this.javelin.vy = Math.sin(angle) * power;
        this.javelin.isFlying = true;
        this.javelin.hasLanded = false;
        this.javelin.trail = [];

        // 记录日志
        this.gameClass.log(`🏃‍♂️ ${thrower.name} 投掷标枪！`, 'highlight');
    }

    // 接住标枪
    _catchJavelin() {
        if (this.throwerIndex >= 4) {
            // 最后一个选手，游戏结束
            this._endGame(true);
            return;
        }

        this.relayState.caught = true;
        this.relayState.caughtTime = Date.now();

        // 记录日志
        const catcher = this.gameClass._getStudentByIndex(this.selectedStudents[this.throwerIndex + 1]);
        this.gameClass.log(`✅ ${catcher.name} 成功接住标枪！`, 'highlight');

        // 移动视角
        const currentThrowerZone = this.trackSegments.find(s => s.type === 'athlete' && s.index === this.throwerIndex);
        const nextThrowerZone = this.trackSegments.find(s => s.type === 'athlete' && s.index === this.throwerIndex + 1);

        if (currentThrowerZone && nextThrowerZone) {
            this.cameraTargetOffset = nextThrowerZone.startX;
        }

        // 延迟后准备下一轮投掷
        setTimeout(() => {
            this._prepareNextThrow();
        }, 1000);
    }

    // 准备下一轮投掷
    _prepareNextThrow() {
        this.throwerIndex++;
        this.javelin.isFlying = false;
        this.javelin.hasLanded = false;
        this.javelin.trail = [];
        this.relayState.caught = false;
        this.relayState.waitingForCatch = false;

        // 更新UI
        document.getElementById('currentThrower').textContent = this.throwerIndex + 1;

        // 记录日志
        const thrower = this.gameClass._getStudentByIndex(this.selectedStudents[this.throwerIndex]);
        this.gameClass.log(`🏃‍♂️ 轮到 ${thrower.name} 投掷`, 'info');
    }

    // 开始动画循环
    _startAnimationLoop() {
        const animate = () => {
            if (!this.active) return;

            this._update();
            this._render();

            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    // 更新游戏状态
    _update() {
        if (this.gameOver) return;

        // 平滑移动摄像机
        this.cameraOffset += (this.cameraTargetOffset - this.cameraOffset) * 0.1;

        // 更新标枪位置
        if (this.javelin.isFlying && !this.javelin.hasLanded) {
            // 保存当前位置到尾迹
            this.javelin.trail.push({ x: this.javelin.x, y: this.javelin.y });
            if (this.javelin.trail.length > 100) {
                this.javelin.trail.shift();
            }

            // 更新位置
            this.javelin.x += this.javelin.vx * 0.016;  // dt = 0.016s
            this.javelin.y += this.javelin.vy * 0.016;

            // 应用重力
            this.javelin.vy += this.gravity * 0.016;

            // 检查是否落地
            this._checkLanding();
        }

        // 检查回飞
        if (this.returnState.isReturning) {
            if (Date.now() - this.returnState.returnStartTime >= this.returnState.returnDelay) {
                this._executeReturn();
            }
        }
    }

    // 检查标枪是否落地
    _checkLanding() {
        // 检查标枪是否碰到地面（Canvas底部）
        if (this.javelin.y >= this.canvas.height - 50) {
            this.javelin.hasLanded = true;
            this.javelin.landTime = Date.now();
            this.javelin.y = this.canvas.height - 50;

            // 检查落在哪个区域
            this._checkLandingZone();
        }
    }

    // 检查落在哪个区域
    _checkLandingZone() {
        const landX = this.javelin.x + this.cameraOffset;

        for (const segment of this.trackSegments) {
            if (landX >= segment.startX && landX < segment.startX + segment.width) {
                if (segment.type === 'audience') {
                    // 落在观众席，随机扎死观众
                    this._killAudience();
                } else if (segment.type === 'athlete') {
                    // 落在选手区域
                    if (segment.index === this.throwerIndex + 1) {
                        // 落在下一个选手区域
                        this.relayState.waitingForCatch = true;

                        // 0.5秒后检查是否接住
                        setTimeout(() => {
                            if (!this.relayState.caught && this.relayState.waitingForCatch) {
                                // 没接住，选手被扎死
                                this._killAthlete(segment.index);
                            }
                        }, 500);
                    } else if (segment.index === this.throwerIndex) {
                        // 落在自己区域，无效果
                    }
                } else if (segment.type === 'empty') {
                    // 落在空地，触发回飞
                    this.returnState.isReturning = true;
                    this.returnState.returnStartTime = Date.now();
                    this.gameClass.log('⚠️ 标枪落在空地，即将回飞！', 'warning');
                }
                break;
            }
        }
    }

    // 扎死观众
    _killAudience() {
        // 获取非选手的学生
        const audienceStudents = this.gameClass.students.filter(s =>
            s.status !== Status.Dead && !this.selectedStudents.includes(s.index)
        );

        if (audienceStudents.length === 0) {
            this.gameClass.log('⚠️ 没有观众可扎', 'warning');
            this._resetJavelin();  // 标枪回到投掷者手里
            return;
        }

        let victims = [];

        // 1%概率一穿三
        if (Math.random() < 0.01) {
            // 随机选择3个观众
            const shuffled = audienceStudents.sort(() => Math.random() - 0.5);
            victims = shuffled.slice(0, 3);

            victims.forEach(student => {
                student.status = Status.Dead;
                this.gameClass.studentAliveNum--;
                this.victims.push(student);
            });

            this.gameClass.log(`💀 一穿三！${victims.map(s => s.name).join('、')} 被扎死！`, 'danger');

            // 显示弹窗
            this._showModal('一穿三！', `标枪一箭穿心，扎死了 ${victims.length} 名观众！\n受害者：${victims.map(s => s.name).join('、')}`);
        } else {
            // 随机选择1个观众
            const victim = audienceStudents[Math.floor(Math.random() * audienceStudents.length)];
            victims = [victim];
            victim.status = Status.Dead;
            this.gameClass.studentAliveNum--;
            this.victims.push(victim);

            this.gameClass.log(`💀 ${victim.name} 被标枪扎死！`, 'danger');

            // 显示弹窗
            this._showModal('观众被扎死', `标枪扎死了 ${victim.name}！`);
        }

        // 更新死亡计数
        document.getElementById('deathCount').textContent = this.victims.length;

        // 标枪回到投掷者手里
        this._resetJavelin();
    }

    // 重置标枪到投掷者手里
    _resetJavelin() {
        const thrower = this.gameClass._getStudentByIndex(this.selectedStudents[this.throwerIndex]);
        if (!thrower) return;

        // 重置标枪状态
        this.javelin = {
            x: 50,  // 选手1的固定位置
            y: this.canvas.height / 2,
            vx: 0,
            vy: 0,
            isFlying: false,
            trail: [],
            hasLanded: false,
            landTime: 0
        };

        this.gameClass.log(`🔄 标枪回到 ${thrower.name} 手中`, 'info');
    }

    // 扎死选手
    _killAthlete(athleteIndex) {
        const athlete = this.gameClass._getStudentByIndex(this.selectedStudents[athleteIndex]);
        if (!athlete) return;

        athlete.status = Status.Dead;
        this.gameClass.studentAliveNum--;
        this.victims.push(athlete);

        this.gameClass.log(`💀 ${athlete.name} 被标枪扎死！`, 'danger');

        // 显示弹窗
        this._showModal('选手被扎死', `标枪扎死了 ${athlete.name}！`);

        // 更新死亡计数
        document.getElementById('deathCount').textContent = this.victims.length;

        // 标枪回到投掷者手里
        this._resetJavelin();

        // 选手3移动到选手2的位置接替
        if (athleteIndex < 4) {
            const replacement = this.gameClass._getStudentByIndex(this.selectedStudents[athleteIndex + 1]);
            this.gameClass.log(`🔄 ${replacement.name} 移动到 ${athlete.name} 的位置接替`, 'info');
        } else {
            // 最后一个选手被扎死，游戏结束
            this._endGame(false, '最后一名选手被扎死');
        }
    }

    // 执行回飞
    _executeReturn() {
        // 标枪从选手1身后水平飞来
        const thrower = this.gameClass._getStudentByIndex(this.selectedStudents[this.throwerIndex]);
        if (!thrower) return;

        this.javelin.x = -200;  // 从屏幕外左侧
        this.javelin.y = this.canvas.height / 2;
        this.javelin.vx = 800;  // 水平飞回
        this.javelin.vy = 0;
        this.javelin.isFlying = true;
        this.javelin.hasLanded = false;
        this.javelin.trail = [];

        this.returnState.isReturning = false;

        this.gameClass.log('⚠️ 标枪回飞中！', 'danger');

        // 定期检查是否击中选手1
        const checkHit = setInterval(() => {
            if (!this.javelin.isFlying || this.gameOver) {
                clearInterval(checkHit);
                return;
            }

            const throwerScreenX = 50;  // 选手1的屏幕位置

            if (this.javelin.x >= throwerScreenX) {
                // 击中选手1
                clearInterval(checkHit);
                thrower.status = Status.Dead;
                this.gameClass.studentAliveNum--;
                this.victims.push(thrower);

                this.gameClass.log(`💀 ${thrower.name} 被回飞的标枪扎死！`, 'danger');

                // 显示弹窗
                this._showModal('标枪回飞', `${thrower.name} 被回飞的标枪扎死！`);

                // 游戏结束
                this._endGame(false, '标枪回飞扎死选手');
            }
        }, 16);
    }

    // 显示模态框
    _showModal(title, message) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="background: #111827; border: 2px solid #e8c76a; border-radius: 12px; padding: 30px; max-width: 400px; text-align: center;">
                <h3 style="color: #e8c76a; font-size: 1.5em; margin-bottom: 20px;">${title}</h3>
                <p style="color: rgba(255, 255, 255, 0.8); line-height: 1.6;">${message}</p>
                <button onclick="this.closest('.modal').remove()" style="margin-top: 20px; background: #e8c76a; color: #0d1117; border: none; padding: 10px 30px; border-radius: 8px; cursor: pointer; font-weight: bold;">确定</button>
            </div>
        `;

        document.body.appendChild(modal);

        // 3秒后自动关闭
        setTimeout(() => {
            modal.remove();
        }, 3000);
    }

    // 结束游戏
    _endGame(success, reason = '') {
        this.gameOver = true;
        this.gameOverReason = reason;

        // 停止动画
        cancelAnimationFrame(this.animationId);

        // 移除事件监听器
        window.removeEventListener('keydown', this._handleKeyDown);

        // 记录日志
        if (success) {
            this.gameClass.log(`🏆 标枪接力完成！共死亡 ${this.victims.length} 人`, 'highlight');
        } else {
            this.gameClass.log(`💔 标枪接力失败：${reason}`, 'danger');
        }

        // 延迟后关闭界面
        setTimeout(() => {
            const modal = document.getElementById('javelinRelayModal');
            if (modal) {
                modal.remove();
            }

            // 如果游戏还在进行，重新计算座位表
            if (this.gameClass && !this.gameClass.ended) {
                this.gameClass._recalculateSeats();
            }
        }, 2000);
    }

    // 渲染
    _render() {
        const ctx = this.ctx;
        const canvas = this.canvas;

        // 清空画布
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 应用摄像机偏移
        ctx.save();
        ctx.translate(-this.cameraOffset, 0);

        // 绘制跑道段
        this._renderTrackSegments(ctx);

        // 绘制选手
        this._renderAthletes(ctx);

        // 绘制观众
        this._renderAudience(ctx);

        // 绘制标枪
        this._renderJavelin(ctx);

        ctx.restore();

        // 绘制投掷指示器（不受摄像机影响）
        this._renderThrowIndicator(ctx);

        // 绘制接住提示
        if (this.relayState.waitingForCatch && !this.relayState.caught) {
            this._renderCatchPrompt(ctx);
        }
    }

    // 绘制跑道段
    _renderTrackSegments(ctx) {
        const trackY = this.canvas.height - 50;

        for (const segment of this.trackSegments) {
            ctx.fillStyle = segment.type === 'athlete' ? '#3498db' :
                           segment.type === 'audience' ? '#e74c3c' :
                           '#2ecc71';

            ctx.fillRect(segment.startX, trackY, segment.width, 50);

            // 绘制边框
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(segment.startX, trackY, segment.width, 50);

            // 绘制标签
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            const label = segment.type === 'athlete' ? `选手${segment.index + 1}` :
                         segment.type === 'audience' ? '观众席' : '空地';
            ctx.fillText(label, segment.startX + segment.width / 2, trackY + 30);
        }
    }

    // 绘制选手
    _renderAthletes(ctx) {
        for (let i = 0; i < 5; i++) {
            const athleteZone = this.trackSegments.find(s => s.type === 'athlete' && s.index === i);
            if (!athleteZone) continue;

            const athlete = this.gameClass._getStudentByIndex(this.selectedStudents[i]);
            if (!athlete) continue;

            const x = athleteZone.startX + athleteZone.width / 2;
            const y = this.canvas.height - 100;

            // 绘制选手图标
            ctx.fillStyle = '#3498db';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();

            // 绘制选手编号
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${i + 1}号`, x, y + 5);

            // 绘制选手名称
            ctx.font = '12px Arial';
            ctx.fillText(athlete.name, x, y - 30);

            // 如果是当前投掷者，绘制高亮
            if (i === this.throwerIndex) {
                ctx.strokeStyle = '#e8c76a';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(x, y, 25, 0, Math.PI * 2);
                ctx.stroke();

                // 如果持枪，绘制标枪
                if (!this.javelin.isFlying) {
                    ctx.strokeStyle = '#e74c3c';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(x + 20, y);
                    ctx.lineTo(x + 40, y - 10);
                    ctx.stroke();
                }
            }
        }
    }

    // 绘制观众
    _renderAudience(ctx) {
        const audienceStudents = this.gameClass.students.filter(s =>
            s.status !== Status.Dead && !this.selectedStudents.includes(s.index)
        );

        for (const segment of this.trackSegments) {
            if (segment.type !== 'audience') continue;

            // 在观众席随机位置绘制观众
            const audienceCount = Math.floor(segment.width / 30);

            for (let i = 0; i < audienceCount; i++) {
                const x = segment.startX + 15 + i * 30;
                const y = this.canvas.height - 70;

                // 绘制观众图标（不显示姓名）
                ctx.fillStyle = '#e74c3c';
                ctx.beginPath();
                ctx.arc(x, y, 10, 0, Math.PI * 2);
                ctx.fill();

                // 绘制简单的人形轮廓
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(x, y - 5, 3, 0, Math.PI * 2);  // 头
                ctx.fill();

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, y - 2);
                ctx.lineTo(x, y + 8);  // 身体
                ctx.stroke();
            }
        }
    }

    // 绘制标枪
    _renderJavelin(ctx) {
        if (!this.javelin.isFlying) return;

        // 绘制尾迹
        if (this.javelin.trail.length > 1) {
            ctx.strokeStyle = 'rgba(231, 76, 60, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.javelin.trail[0].x, this.javelin.trail[0].y);

            for (let i = 1; i < this.javelin.trail.length; i++) {
                ctx.lineTo(this.javelin.trail[i].x, this.javelin.trail[i].y);
            }

            ctx.stroke();
        }

        // 绘制标枪
        ctx.save();
        ctx.translate(this.javelin.x, this.javelin.y);

        // 计算标枪角度
        const angle = Math.atan2(this.javelin.vy, this.javelin.vx);
        ctx.rotate(angle);

        // 绘制标枪主体
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(-20, -2, 40, 4);

        // 绘制标枪尖端
        ctx.beginPath();
        ctx.moveTo(20, -2);
        ctx.lineTo(30, 0);
        ctx.lineTo(20, 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    // 绘制投掷指示器
    _renderThrowIndicator(ctx) {
        if (!this.throwControl.mouseDown || this.javelin.isFlying) return;

        const thrower = this.gameClass._getStudentByIndex(this.selectedStudents[this.throwerIndex]);
        if (!thrower) return;

        const throwerX = 50;
        const throwerY = this.canvas.height / 2;

        // 绘制方向线
        ctx.strokeStyle = 'rgba(232, 199, 106, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(throwerX, throwerY);
        ctx.lineTo(this.throwControl.mousePos.x, this.throwControl.mousePos.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // 绘制蓄力条
        const chargeTime = Math.min((Date.now() - this.throwControl.chargeStartTime) / 1000, 3);
        const chargePercent = chargeTime / 3;

        const barWidth = 100;
        const barHeight = 10;
        const barX = throwerX - barWidth / 2;
        const barY = throwerY - 60;

        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // 蓄力条
        const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
        gradient.addColorStop(0, '#2ecc71');
        gradient.addColorStop(0.5, '#f1c40f');
        gradient.addColorStop(1, '#e74c3c');
        ctx.fillStyle = gradient;
        ctx.fillRect(barX, barY, barWidth * chargePercent, barHeight);

        // 边框
        ctx.strokeStyle = '#e8c76a';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // 蓄力文字
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`蓄力: ${chargePercent.toFixed(0)}%`, throwerX, barY - 10);
    }

    // 绘制接住提示
    _renderCatchPrompt(ctx) {
        const catcher = this.gameClass._getStudentByIndex(this.selectedStudents[this.throwerIndex + 1]);
        if (!catcher) return;

        const catcherZone = this.trackSegments.find(s => s.type === 'athlete' && s.index === this.throwerIndex + 1);
        if (!catcherZone) return;

        const catcherX = catcherZone.startX + catcherZone.width / 2 - this.cameraOffset;
        const catcherY = this.canvas.height - 100;

        // 绘制提示框
        ctx.fillStyle = 'rgba(232, 199, 106, 0.9)';
        ctx.fillRect(catcherX - 60, catcherY - 50, 120, 30);

        // 绘制提示文字
        ctx.fillStyle = '#0d1117';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('按空格接住！', catcherX, catcherY - 30);
    }

    // 退出游戏
    exitGame() {
        this.active = false;
        cancelAnimationFrame(this.animationId);

        const modal = document.getElementById('javelinRelayModal');
        if (modal) {
            modal.remove();
        }

        // 移除事件监听器
        window.removeEventListener('keydown', this._handleKeyDown);
    }
}

// 创建全局实例
let javelinRelay = null;

// 暴露给console调用的函数
window.openJavelinRelay = function() {
    if (!gameClass) {
        console.error('游戏未开始！');
        alert('请先开始游戏！');
        return;
    }

    console.log('正在打开标枪接力活动...');
    
    // 如果之前有活动的实例，先清理
    if (javelinRelay && javelinRelay.active) {
        javelinRelay.active = false;
        cancelAnimationFrame(javelinRelay.animationId);
        const modal = document.getElementById('javelinRelayModal');
        if (modal) {
            modal.remove();
        }
    }
    
    // 清理活动选择modal
    const sportsDayModal = document.getElementById('javelinRelayModal');
    if (sportsDayModal) {
        sportsDayModal.remove();
    }

    try {
        javelinRelay = new JavelinRelayActivity(gameClass);
        javelinRelay.showActivitySelection();
        console.log('标枪接力活动已打开');
    } catch (error) {
        console.error('打开标枪接力活动失败:', error);
        alert('打开失败：' + error.message);
    }
};

console.log('🏃‍♂️ 标枪接力活动系统已加载');
console.log('📝 使用 openJavelinRelay() 打开标枪接力活动选择界面');

// ============================================================================
// 运动会总览界面
// ============================================================================

class SportsDayOverview {
    constructor(gameClass) {
        this.gameClass = gameClass;
        this.active = false;
    }

    // 显示运动会总览界面
    showOverview() {
        const modal = document.getElementById('sportsDayOverviewModal');
        if (modal) {
            modal.remove();
        }

        const overview = document.createElement('div');
        overview.id = 'sportsDayOverviewModal';
        overview.className = 'modal';
        overview.style.cssText = `
            position: fixed;
            inset: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 800;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(4px);
        `;

        // 生成时间线HTML
        const timelineHTML = SPORTS_EVENTS.map(event => `
            <div class="timeline-item" data-event="${event.id}">
                <div class="timeline-day">
                    <span class="day-number">第${event.day}天</span>
                </div>
                <div class="timeline-content">
                    <div class="event-icon">${event.icon}</div>
                    <div class="event-info">
                        <div class="event-name">${event.name}</div>
                        <div class="event-desc">${event.description}</div>
                    </div>
                    <button class="debug-btn" onclick="sportsDayOverview.debugEvent('${event.id}')">
                        🔧 调试
                    </button>
                </div>
            </div>
        `).join('');

        overview.innerHTML = `
            <div class="modal-content sports-overview" style="width: 800px; max-width: 95vw; max-height: 85vh; overflow-y: auto; position: relative;">
                <div class="overview-header">
                    <h2>🏆 运动会总览</h2>
                    <button class="close-btn" onclick="sportsDayOverview.close()">✕</button>
                </div>
                <div class="overview-body">
                    <div class="timeline">
                        ${timelineHTML}
                    </div>
                </div>
                <div class="overview-footer">
                    <p>💡 选择上方活动进行调试</p>
                </div>
            </div>
        `;

        document.body.appendChild(overview);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .sports-overview {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid rgba(232, 199, 106, 0.3);
                border-radius: 16px;
                padding: 0;
                overflow: hidden;
            }

            .overview-header {
                background: rgba(232, 199, 106, 0.15);
                padding: 24px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid rgba(232, 199, 106, 0.3);
                flex-shrink: 0;
            }

            .overview-header h2 {
                color: #e8c76a;
                font-family: 'Noto Serif SC', serif;
                font-size: 1.5em;
                margin: 0;
            }

            .close-btn {
                background: rgba(231, 76, 60, 0.2);
                border: 2px solid #ef4444;
                color: #ef4444;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.4em;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .close-btn:hover {
                background: rgba(231, 76, 60, 0.4);
                transform: scale(1.1);
            }

            .overview-body {
                padding: 30px;
                flex: 1;
            }

            .timeline {
                display: flex;
                flex-direction: column;
                gap: 25px;
                position: relative;
            }

            .timeline::before {
                content: '';
                position: absolute;
                left: 80px;
                top: 0;
                bottom: 0;
                width: 3px;
                background: linear-gradient(180deg, #e8c76a 0%, rgba(232, 199, 106, 0.2) 100%);
                border-radius: 3px;
            }

            .timeline-item {
                display: flex;
                gap: 20px;
                position: relative;
            }

            .timeline-day {
                flex-shrink: 0;
                width: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .day-number {
                background: linear-gradient(135deg, #e8c76a 0%, #c9952a 100%);
                color: #1a1200;
                padding: 8px 12px;
                border-radius: 8px;
                font-weight: bold;
                font-size: 0.9em;
                text-align: center;
                box-shadow: 0 4px 12px rgba(232, 199, 106, 0.3);
            }

            .timeline-content {
                flex: 1;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(232, 199, 106, 0.2);
                border-radius: 12px;
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 20px;
                transition: all 0.3s ease;
                position: relative;
            }

            .timeline-content::before {
                content: '';
                position: absolute;
                left: -11px;
                top: 50%;
                transform: translateY(-50%);
                width: 20px;
                height: 20px;
                background: #e8c76a;
                border: 4px solid #1a1a2e;
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(232, 199, 106, 0.5);
            }

            .timeline-content:hover {
                background: rgba(232, 199, 106, 0.1);
                border-color: rgba(232, 199, 106, 0.4);
                transform: translateX(5px);
                box-shadow: 0 6px 20px rgba(232, 199, 106, 0.2);
            }

            .event-icon {
                font-size: 3em;
                flex-shrink: 0;
            }

            .event-info {
                flex: 1;
            }

            .event-name {
                color: #e8c76a;
                font-size: 1.3em;
                font-weight: bold;
                margin-bottom: 8px;
                font-family: 'Noto Serif SC', serif;
            }

            .event-desc {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.95em;
                line-height: 1.5;
            }

            .debug-btn {
                background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 0.95em;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
                flex-shrink: 0;
            }

            .debug-btn:hover {
                background: linear-gradient(135deg, #2980b9 0%, #1f6dad 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(52, 152, 219, 0.5);
            }

            .overview-footer {
                background: rgba(0, 0, 0, 0.3);
                padding: 16px 30px;
                text-align: center;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                flex-shrink: 0;
            }

            .overview-footer p {
                color: rgba(255, 255, 255, 0.6);
                margin: 0;
                font-size: 0.9em;
            }
        `;

        document.head.appendChild(style);
    }

    // 调试指定活动
    debugEvent(eventId) {
        // 关闭总览界面
        this.close();

        console.log(`调试活动: ${eventId}`);

        // 根据活动ID调用对应的函数
        switch (eventId) {
            case SportsEventType.SHINE_HUMAN_TEEN:
                if (typeof openSportsDay === 'function') {
                    openSportsDay();
                } else {
                    console.error('openSportsDay 函数未找到');
                }
                break;
            case SportsEventType.JAVELIN_RELAY:
                if (typeof openJavelinRelay === 'function') {
                    openJavelinRelay();
                } else {
                    console.error('openJavelinRelay 函数未找到');
                }
                break;
            default:
                console.error(`未知的活动ID: ${eventId}`);
        }
    }

    // 关闭总览界面
    close() {
        const modal = document.getElementById('sportsDayOverviewModal');
        if (modal) {
            modal.remove();
        }
    }
}

// 创建全局实例
let sportsDayOverview = null;

// 暴露给console调用的函数
window.openSportsDayOverview = function() {
    if (!gameClass) {
        console.error('游戏未开始！');
        alert('请先开始游戏！');
        return;
    }

    console.log('正在打开运动会总览...');

    try {
        sportsDayOverview = new SportsDayOverview(gameClass);
        sportsDayOverview.showOverview();
        console.log('运动会总览已打开');
    } catch (error) {
        console.error('打开运动会总览失败:', error);
        alert('打开失败：' + error.message);
    }
};

console.log('🏆 运动会总览系统已加载');
console.log('📝 使用 openSportsDayOverview() 打开运动会总览');