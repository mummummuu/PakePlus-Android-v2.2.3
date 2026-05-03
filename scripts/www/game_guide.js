const ENTRIES_DATA = {"categories": [{"id": "items", "title": "物品", "icon": "📦", "entries": [{"id": "ice_tea", "title": "小冰茶", "image": "./assets/items/drink1.png", "content": "太好了，我买的第一瓶就中奖了，这才是对的，茶脆是什么东西？"}, {"id": "茶脆", "title": "茶脆", "image": "./assets/items/drink2.png", "content": "喝着像冰红茶\n我从来没中过奖，绝对是美国的阴谋"}, {"id": "yijin_jing", "title": "易筋经", "image": "./assets/items/classic.png", "content": "我每天都做一遍，感觉年轻了16岁"}, {"id": "one_yuan_ice_tea", "title": "一元乐享（小冰茶）", "image": "./assets/items/cap.png", "content": "太好了，我现在有很多\nthis is true cap!"}, {"id": "一元乐享（茶脆）", "title": "一元乐享（茶脆）", "image": "./assets/items/cap.png", "content": "事实上，这东西并不存在于世上\n\n这其实是美国的阴谋，等到中美开战，你们那些持有茶脆瓶盖的人就等着被炸死吧！！！"}, {"id": "angry", "title": "愤怒", "image": "./assets/items/angry.png", "content": "be water my friend"}, {"id": "mp5", "title": "MP5", "image": "./assets/items/mp5.png", "content": "十二中只有禁止mp3、mp4的校规，然而没有禁止mp5，食堂一楼抓住了这一商机，这使得mp5成了师生之间互相牵制的有力工具\n\n\n（可是听说最近食堂三楼出了个竞品）"}, {"id": "cheers!", "title": "Cheers!", "image": "./assets/items/cheers.png", "content": "这下不得不给你点赞了\n哦，dt了，wonderful！"}, {"id": "泥巴人", "title": "泥巴人", "image": "./assets/items/figure.png", "content": "神秘小人，时常出没在英语老师的ppt中（我也会画↓↓↓）\n<img src=\"./assets/items/figuree.png\">"}, {"id": "hero_pen", "title": "希罗的钢笔", "image": "./assets/items/pen.png", "content": "没什么意义，最近玩魔法少女的魔女审判，所以加了这个钢笔用来测试物品功能"}]}, {"id": "characters", "title": "角色", "icon": "👤", "entries": [{"id": "teacher_wang", "title": "魏教授", "image": "", "content": "在十二中，他的物理水平敢称第一，没人敢称第二\n数学比数学老师还好\n爱好且精通除了足球外的全部运动项目\n！？强强？！"}, {"id": "teacher_wang_chem", "title": "王老师", "image": "", "content": "每节课前闪现到班里转悠两圈\n无时无刻不在看他的化学网课\n好像有时候会看斯诺克比赛"}, {"id": "teacher_qin", "title": "秦老师", "image": "", "content": "日常乘坐双人新能源豪华敞篷跑车上班（怎么还被通报了）\n身在二三班心在一班（对，本人说的）"}]}, {"id": "events", "title": "杂项", "icon": "🎲", "entries": [{"id": "食堂", "title": "食堂", "image": "", "content": "众所周知，十二中有三个强大的帮派：一楼帮、二楼帮和三楼帮，其中三楼帮认为食堂三楼性价比最高，二楼帮认为食堂二楼性价比最高，一楼帮认为食堂一楼性价比最低\n\n据说十二中一楼的食堂是由十八大街与经南八路交叉口某神秘学校代理的，受那里优良的食堂氛围影响，十二中食堂一楼也在售卖一些不寻常的东西\n\n出于对教学楼一楼学生的压迫，食堂一楼卖的东西往往贵一些"}, {"id": "跳蚤市场", "title": "跳蚤市场", "image": "", "content": "十二中经常有学生组织一些义卖活动，这在提升了十二中的道德水准的同时，严重影响了十二中的经济水平\n\n为了遏止大量钱财外流，保证校内大循环的主体地位，校领导组织了每学期一次的跳蚤市场活动，用来促进校内的消费\n\n校领导注意到赌博使人上瘾，只要稍微加入一些随机元素，不管是老师还是学生都会沉迷其中，于是他们设计了这个：\n第一个环节，大家将自己不用的东西以100元/件的价格售卖给学校\n第二个环节：大家花费一点小钱进行抽奖，奖池有1到4星四个等级的奖品，30抽保底出一个三星物品，50抽保底出一个四星物品\n\n这个跳蚤市场机制受到了广大师生的欢迎，同时也补充了学校的资金"}, {"id": "组织活动", "title": "组织活动", "image": "", "content": "十二中的班主任喜欢组织全班的存活同学团建，并以此为契机收取同学们的班费。但是，同学们很快就意识到了自己成为了班主任的捞钱工具，于是奋起反抗，试图群殴班主任"}, {"id": "贷款", "title": "贷款", "image": "", "content": "由于十二中许多班主任过于贫穷，为了照顾他们，学校推出了划算的贷款方案，以供老师们的不时之需\n由于十二中对信用的重视，学校会平等地击毙每一位没有按时还上贷款的老师"}]}]}
;

function mdToHtml(text) {
    if (!text) return '';
    var lines = text.split('\n');
    var html = '';
    var inP = false;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.trim() === '') {
            if (inP) { html += '</p>'; inP = false; }
            continue;
        }
        line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
        if (!inP) { html += '<p>'; inP = true; } else { html += '<br>'; }
        html += line;
    }
    if (inP) html += '</p>';
    return html;
}

let guideCurrentCat = null;
let guideCurrentEntry = null;

function openGameGuideModal() {
    document.getElementById('gameGuideModal').style.display = 'flex';
    renderGuideTree();
    if (ENTRIES_DATA.categories.length > 0) selectCategory(0);
}

function closeGameGuideModal() {
    document.getElementById('gameGuideModal').style.display = 'none';
}

function renderGuideTree() {
    var tree = document.getElementById('guideTree');
    tree.innerHTML = '';
    ENTRIES_DATA.categories.forEach(function(cat, idx) {
        var item = document.createElement('div');
        item.className = 'guide-tree-item' + (guideCurrentCat === idx ? ' active' : '');
        item.textContent = cat.icon + ' ' + cat.title;
        item.addEventListener('click', function() { selectCategory(idx); });
        tree.appendChild(item);
    });
}

function selectCategory(idx) {
    guideCurrentCat = idx;
    guideCurrentEntry = null;
    renderGuideTree();
    renderEntryList();
}

function renderEntryList() {
    var list = document.getElementById('guideEntryList');
    list.innerHTML = '';
    if (guideCurrentCat === null) return;
    var cat = ENTRIES_DATA.categories[guideCurrentCat];
    cat.entries.forEach(function(entry, idx) {
        var item = document.createElement('div');
        item.className = 'entry-item' + (guideCurrentEntry === idx ? ' active' : '');
        item.textContent = entry.title;
        item.addEventListener('click', function() { selectEntry(idx); });
        list.appendChild(item);
    });
}

function selectEntry(idx) {
    guideCurrentEntry = idx;
    renderEntryList();
    var cat = ENTRIES_DATA.categories[guideCurrentCat];
    var entry = cat.entries[idx];
    var content = document.getElementById('guideEntryContent');
    var html = '<h1>' + entry.title + '</h1>';
    if (entry.image) {
        html += '<img src="' + entry.image + '" alt="" class="entry-image">';
    }
    html += '<div class="entry-body">' + mdToHtml(entry.content) + '</div>';
    content.innerHTML = html;
}

function initGameGuide() {
    var btn = document.getElementById('gameGuideBtn');
    var closeBtn = document.getElementById('closeGameGuideBtn');
    if (btn) btn.addEventListener('click', openGameGuideModal);
    if (closeBtn) closeBtn.addEventListener('click', closeGameGuideModal);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGameGuide);
} else {
    initGameGuide();
}