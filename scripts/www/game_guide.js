const ENTRIES_DATA = {"categories": [{"id": "items", "title": "物品", "icon": "📦", "entries": [{"id": "hero_pen", "title": "希罗的钢笔", "image": "./assets/items/pen.png", "content": "没什么意义，最近玩魔法少女的魔女审判，所以加了这个钢笔用来测试物品功能"}, {"id": "ice_tea", "title": "小冰茶", "image": "./assets/items/drink1.png", "content": "太好了，我买的第一瓶就中奖了，这才是对的，茶脆是什么东西？"}, {"id": "茶脆", "title": "茶脆", "image": "./assets/items/drink2.png", "content": "喝着像冰红茶\n我从来没中过奖，绝对是美国的阴谋"}, {"id": "yijin_jing", "title": "易筋经", "image": "./assets/items/classic.png", "content": "我每天都做一遍，感觉年轻了16岁"}, {"id": "one_yuan_ice_tea", "title": "一元乐享（小冰茶）", "image": "./assets/items/cap.png", "content": "太好了，我现在有很多"}, {"id": "一元乐享（茶脆）", "title": "一元乐享（茶脆）", "image": "./assets/items/cap.png", "content": "事实上，这东西并不存在于世上"}, {"id": "angry", "title": "愤怒", "image": "./assets/items/angry.png", "content": "be water my friend"}, {"id": "mp5", "title": "MP5", "image": "./assets/items/mp5.png", "content": "十二中只有禁止mp3、mp4的校规，然而没有禁止mp5"}, {"id": "cheers!", "title": "Cheers!", "image": "./assets/items/cheers.png", "content": "这下不得不给你点赞了"}]}, {"id": "talents", "title": "天赋", "icon": "🎭", "entries": []}, {"id": "characters", "title": "角色", "icon": "👤", "entries": [{"id": "teacher_wang", "title": "魏教授", "image": "", "content": "在十二中，他的物理水平敢称第一，没人敢称第二\n数学比数学老师还好\n爱好且精通除了足球外的全部运动项目\n权威！"}, {"id": "teacher_wang_chem", "title": "王老师", "image": "", "content": "每节课前闪现到班里转悠两圈\n无时无刻不在看他的化学网课\n好像有时候会看斯诺克比赛"}, {"id": "teacher_qin", "title": "秦老师", "image": "", "content": "日常乘坐双人新能源豪华敞篷跑车上班（怎么还被通报了）\n身在二三班心在一班（对，本人说的）"}]}, {"id": "events", "title": "事件", "icon": "🎲", "entries": []}]}
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