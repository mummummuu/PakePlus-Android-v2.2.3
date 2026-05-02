# 班主任模拟器 - AGENTS.md

## 项目概况

纯前端浏览器游戏，无构建工具、无包管理器、无测试框架。直接在浏览器中打开 `index.html` 即可运行。

## 关键文件

| 文件 | 用途 |
|------|------|
| `game.js` (~8000行) | 核心游戏逻辑、所有类定义、UI渲染 |
| `sports_day.js` (~5800行) | 运动会子系统（卡牌对战、标枪接力） |
| `index.html` | 主入口，加载上述两个JS |
| `style.css` | 全部样式 |
| `entry_manager.py` | 词条管理工具（Tkinter GUI） |
| `entries.json` | 图鉴词条数据源 |
| `game_guide.js` | 图鉴UI逻辑（由 entry_manager.py 导出） |
| `export_entries.py` | 将 entries.json 导出为 game_guide.js |

## 开发流程

- **运行**: 浏览器打开 `index.html`
- **测试**: 手动在浏览器中验证功能，无自动化测试
- **文档同步**: 修改代码后必须同步更新 `API.md`
- **代码风格**: 驼峰命名，类名首字母大写，常量全大写

## 架构要点

### game.js 结构（从上到下）
1. 常量配置（精力、成绩、关系、座位、请假、成长、天赋等）
2. 枚举定义（GameMode, ClassType, Subject, Item, Talent 等）
3. 工具函数（移动端检测、随机姓名生成、大学数据库）
4. NamePreset 类 + 姓名预设管理
5. 核心类: University, Student, Teacher, LeaveRequest, Class, Inventory
6. UI 渲染函数
7. 游戏主程序（事件监听、弹窗、通知）

### sports_day.js 结构
1. 枚举（SportsEventType, CardType）
2. ShineHumanTeenActivity 类（卡牌对战）
3. JavelinRelayActivity 类（标枪接力）
4. SportsDayOverview 类（运动会总览）

## 易错点

### 物品系统
- `INVENTORY_MAX_SLOTS = 9`，`INVENTORY_MAX_ITEM_STACK = 8`
- 物品按添加顺序显示，用完/丢弃后后续物品前移
- `consumable: true` → 使用后消耗1件；`false` → 不消耗
- 使用物品效果在 `_applyItemEffect` 方法中实现
- 食堂渲染顺序由 `displayOrder` 数组控制

#### 完整物品列表

| 物品 | ID | 图标 | 效果 |
|------|-----|------|------|
| 希罗的钢笔 | 1 | pen.png | 无特殊效果（初始物品） |
| 小冰茶 | 2 | drink1.png | +5血量，40%概率获得一元乐享（小冰茶） |
| 易筋经 | 3 | classic.png | 精力上限提升至120 |
| 一元乐享（小冰茶） | 4 | cap.png | 扣1元工资，获得1瓶小冰茶 |
| 暴怒 | 5 | angry.png | 特殊物品 |
| MP5 | 6 | mp5.png | 击毙选中的学生 |
| 茶脆 | 7 | drink2.png | **精力回满**，1%概率获得一元乐享（茶脆） |
| 一元乐享（茶脆） | 8 | cap.png | 扣1元工资，获得1瓶茶脆 |
| Σ | 9 | sigma.png | 选中学生物理学习能力+40（上限100） |

#### 食堂楼层配置

| 楼层 | 物品及价格 |
|------|------------|
| 1楼 | 小冰茶(600)、一元乐享-小冰茶(600)、茶脆(600)、一元乐享-茶脆(600)、Σ(400)、易筋经(3000)、暴怒(2500)、MP5(3500) |
| 2楼 | 小冰茶(500)、茶脆(500) |
| 3楼 | 小冰茶(500)、茶脆(500) |

### 存档系统
- 存档版本需与 `API.md` 版本号同步
- localStorage 存5个浏览器存档槽位
- 支持导出/导入 JSON 文件
- 存档包含: 班主任属性（含maxEnergy, inventory）、班级状态、学生数据

### 精力系统
- 班主任精力恢复使用 `maxEnergy`（不是固定值）
- 易筋经可将 maxEnergy 提升至120
- 精力低于20每周扣血量

### 工资扣减
- 每4周发放月薪，基础1500元
- 每死亡1名学生扣100元，最低工资保底300元
- 魏教授特质：学生死亡不扣工资
- 工资数字悬停显示详细扣减信息

### 姓名预设
- 使用 localStorage 保存自定义预设
- 随机生成器: 250姓氏 × 500名字 = 125,000种组合
- 导入格式为 JSON

### 图鉴系统
- 数据源: `entries.json`（JSON格式）
- 管理工具: `entry_manager.py`（Tkinter GUI）
- 导出: 运行 `python export_entries.py` 生成 `game_guide.js`
- UI结构: 左侧分类 → 中间词条列表 → 右侧内容详情
- 内容支持 `**粗体**` 和 `*斜体*` Markdown语法
- 图片使用 `image-rendering: pixelated` 保持像素清晰
- 词条图片尺寸: `40vmin × 30vmin`

### 返回主菜单
- 按钮ID: `exitGameBtn`
- 使用通用确认弹窗 `genericConfirmModal` 进行二次确认
- 确认后调用 `returnToMenu()` 清空游戏状态并返回主菜单

## 重要常量

```
SEMESTER_LENGTH = 10, TOTAL_SEMESTERS = 6  →  总60周
SEAT_COLUMNS = 9, SEAT_ROWS_MAX = 12
TEACHER_MONTHLY_SALARY = 1500（每4周发放）
TEACHER_HEALTH_MAX = 10
学生死亡扣薪 = 100元/人，最低工资保底300元
```

## 角色系统

| 角色 | 科目 | 特性 |
|------|------|------|
| 魏教授 | 物理 | 学生死亡不扣工资 |
| 王老师 | 化学 | 精力上限140 |
| 秦老师 | 数学 | 每回合30%概率复活死亡学生 |

## 调试入口

- `index.html` 中有临时调试按钮: `openSportsDayOverview()` 可直接打开运动会
