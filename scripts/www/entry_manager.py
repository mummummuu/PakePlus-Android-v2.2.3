import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import json
import os

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
ENTRIES_FILE = os.path.join(PROJECT_DIR, "entries.json")
OUTPUT_FILE = os.path.join(PROJECT_DIR, "game_guide.js")


class EntryManager:
    def __init__(self, root):
        self.root = root
        self.root.title("词条管理器")
        self.root.geometry("800x600")
        self.root.minsize(700, 500)

        self.data = {"categories": []}
        self.current_cat_idx = None
        self.current_entry_idx = None
        self._suppress_sync = False

        self.load_data()
        self.build_ui()

    def load_data(self):
        if os.path.exists(ENTRIES_FILE):
            with open(ENTRIES_FILE, "r", encoding="utf-8") as f:
                self.data = json.load(f)
        else:
            self.data = {"categories": []}

    def save_and_export(self):
        self.sync_editor_to_data()
        with open(ENTRIES_FILE, "w", encoding="utf-8") as f:
            json.dump(self.data, f, ensure_ascii=False, indent=4)

        # 生成 game_guide.js
        lines = []
        lines.append("const ENTRIES_DATA = " + json.dumps(self.data, ensure_ascii=False))
        lines.append(";")
        lines.append("")

        # Markdown to HTML 简单转换器
        lines.append("function mdToHtml(text) {")
        lines.append("    if (!text) return '';")
        lines.append("    var lines = text.split('\\n');")
        lines.append("    var html = '';")
        lines.append("    var inP = false;")
        lines.append("    for (var i = 0; i < lines.length; i++) {")
        lines.append("        var line = lines[i];")
        lines.append("        if (line.trim() === '') {")
        lines.append("            if (inP) { html += '</p>'; inP = false; }")
        lines.append("            continue;")
        lines.append("        }")
        lines.append("        line = line.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');")
        lines.append("        line = line.replace(/\\*(.+?)\\*/g, '<em>$1</em>');")
        lines.append("        if (!inP) { html += '<p>'; inP = true; } else { html += '<br>'; }")
        lines.append("        html += line;")
        lines.append("    }")
        lines.append("    if (inP) html += '</p>';")
        lines.append("    return html;")
        lines.append("}")
        lines.append("")

        # 渲染逻辑
        lines.append("let guideCurrentCat = null;")
        lines.append("let guideCurrentEntry = null;")
        lines.append("")
        lines.append("function openGameGuideModal() {")
        lines.append("    document.getElementById('gameGuideModal').style.display = 'flex';")
        lines.append("    renderGuideTree();")
        lines.append("    if (ENTRIES_DATA.categories.length > 0) selectCategory(0);")
        lines.append("}")
        lines.append("")
        lines.append("function closeGameGuideModal() {")
        lines.append("    document.getElementById('gameGuideModal').style.display = 'none';")
        lines.append("}")
        lines.append("")
        lines.append("function renderGuideTree() {")
        lines.append("    var tree = document.getElementById('guideTree');")
        lines.append("    tree.innerHTML = '';")
        lines.append("    ENTRIES_DATA.categories.forEach(function(cat, idx) {")
        lines.append("        var item = document.createElement('div');")
        lines.append("        item.className = 'guide-tree-item' + (guideCurrentCat === idx ? ' active' : '');")
        lines.append("        item.textContent = cat.icon + ' ' + cat.title;")
        lines.append("        item.addEventListener('click', function() { selectCategory(idx); });")
        lines.append("        tree.appendChild(item);")
        lines.append("    });")
        lines.append("}")
        lines.append("")
        lines.append("function selectCategory(idx) {")
        lines.append("    guideCurrentCat = idx;")
        lines.append("    guideCurrentEntry = null;")
        lines.append("    renderGuideTree();")
        lines.append("    renderEntryList();")
        lines.append("}")
        lines.append("")
        lines.append("function renderEntryList() {")
        lines.append("    var list = document.getElementById('guideEntryList');")
        lines.append("    list.innerHTML = '';")
        lines.append("    if (guideCurrentCat === null) return;")
        lines.append("    var cat = ENTRIES_DATA.categories[guideCurrentCat];")
        lines.append("    cat.entries.forEach(function(entry, idx) {")
        lines.append("        var item = document.createElement('div');")
        lines.append("        item.className = 'entry-item' + (guideCurrentEntry === idx ? ' active' : '');")
        lines.append("        item.textContent = entry.title;")
        lines.append("        item.addEventListener('click', function() { selectEntry(idx); });")
        lines.append("        list.appendChild(item);")
        lines.append("    });")
        lines.append("}")
        lines.append("")
        lines.append("function selectEntry(idx) {")
        lines.append("    guideCurrentEntry = idx;")
        lines.append("    renderEntryList();")
        lines.append("    var cat = ENTRIES_DATA.categories[guideCurrentCat];")
        lines.append("    var entry = cat.entries[idx];")
        lines.append("    var content = document.getElementById('guideEntryContent');")
        lines.append("    var html = '<h1>' + entry.title + '</h1>';")
        lines.append("    if (entry.image) {")
        lines.append("        html += '<img src=\"' + entry.image + '\" alt=\"\" class=\"entry-image\">';")
        lines.append("    }")
        lines.append("    html += '<div class=\"entry-body\">' + mdToHtml(entry.content) + '</div>';")
        lines.append("    content.innerHTML = html;")
        lines.append("}")
        lines.append("")
        lines.append("function initGameGuide() {")
        lines.append("    var btn = document.getElementById('gameGuideBtn');")
        lines.append("    var closeBtn = document.getElementById('closeGameGuideBtn');")
        lines.append("    if (btn) btn.addEventListener('click', openGameGuideModal);")
        lines.append("    if (closeBtn) closeBtn.addEventListener('click', closeGameGuideModal);")
        lines.append("}")
        lines.append("")
        lines.append("if (document.readyState === 'loading') {")
        lines.append("    document.addEventListener('DOMContentLoaded', initGameGuide);")
        lines.append("} else {")
        lines.append("    initGameGuide();")
        lines.append("}")

        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

        messagebox.showinfo("保存并导出", f"已保存到 entries.json\n已导出到 game_guide.js")

    def build_ui(self):
        # 顶部工具栏
        toolbar = ttk.Frame(self.root)
        toolbar.pack(fill=tk.X, padx=5, pady=5)

        ttk.Button(toolbar, text="保存并导出", command=self.save_and_export).pack(side=tk.LEFT, padx=2)

        # 主区域
        main = ttk.Frame(self.root)
        main.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)

        # 左侧：分类
        cat_frame = ttk.LabelFrame(main, text="分类")
        cat_frame.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 5))

        self.cat_listbox = tk.Listbox(cat_frame, width=16, font=("", 11))
        self.cat_listbox.pack(fill=tk.Y, expand=True)
        self.cat_listbox.bind("<<ListboxSelect>>", self.on_cat_select)

        cat_btns = ttk.Frame(cat_frame)
        cat_btns.pack(fill=tk.X, pady=5)
        ttk.Button(cat_btns, text="新增", command=self.add_category).pack(side=tk.LEFT, expand=True, fill=tk.X)
        ttk.Button(cat_btns, text="删除", command=self.del_category).pack(side=tk.LEFT, expand=True, fill=tk.X)
        ttk.Button(cat_btns, text="重命名", command=self.rename_category).pack(side=tk.LEFT, expand=True, fill=tk.X)

        # 中间：词条列表
        entry_list_frame = ttk.LabelFrame(main, text="词条")
        entry_list_frame.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 5))

        self.entry_listbox = tk.Listbox(entry_list_frame, width=18, font=("", 11))
        self.entry_listbox.pack(fill=tk.Y, expand=True)
        self.entry_listbox.bind("<<ListboxSelect>>", self.on_entry_select)

        entry_btns = ttk.Frame(entry_list_frame)
        entry_btns.pack(fill=tk.X, pady=5)
        ttk.Button(entry_btns, text="新增", command=self.add_entry).pack(side=tk.LEFT, expand=True, fill=tk.X)
        ttk.Button(entry_btns, text="删除", command=self.del_entry).pack(side=tk.LEFT, expand=True, fill=tk.X)

        entry_move_btns = ttk.Frame(entry_list_frame)
        entry_move_btns.pack(fill=tk.X, pady=(0, 5))
        ttk.Button(entry_move_btns, text="↑", command=self.move_entry_up).pack(side=tk.LEFT, expand=True, fill=tk.X)
        ttk.Button(entry_move_btns, text="↓", command=self.move_entry_down).pack(side=tk.LEFT, expand=True, fill=tk.X)

        # 右侧：编辑区
        edit_frame = ttk.LabelFrame(main, text="编辑")
        edit_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        # 标题
        ttk.Label(edit_frame, text="标题：").grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
        self.title_var = tk.StringVar()
        self.title_var.trace_add("write", self.on_title_change)
        ttk.Entry(edit_frame, textvariable=self.title_var, font=("", 12)).grid(row=0, column=1, sticky=tk.EW, padx=5, pady=5)

        # 图片
        ttk.Label(edit_frame, text="图片：").grid(row=1, column=0, sticky=tk.W, padx=5, pady=5)
        self.image_var = tk.StringVar()
        img_entry = ttk.Entry(edit_frame, textvariable=self.image_var)
        img_entry.grid(row=1, column=1, sticky=tk.EW, padx=5, pady=5)
        ttk.Button(edit_frame, text="选择", command=self.pick_image).grid(row=1, column=2, padx=5, pady=5)

        # 内容
        ttk.Label(edit_frame, text="内容：").grid(row=2, column=0, sticky=tk.NW, padx=5, pady=5)
        self.content_text = tk.Text(edit_frame, wrap=tk.WORD, font=("", 11))
        scrollbar = ttk.Scrollbar(edit_frame, orient=tk.VERTICAL, command=self.content_text.yview)
        self.content_text.configure(yscrollcommand=scrollbar.set)
        self.content_text.grid(row=2, column=1, columnspan=2, sticky=tk.NSEW, padx=5, pady=5)
        scrollbar.grid(row=2, column=3, sticky=tk.NS)

        edit_frame.columnconfigure(1, weight=1)
        edit_frame.rowconfigure(2, weight=1)

        # 说明
        info = ttk.Label(self.root, text="内容支持 **粗体** 和 *斜体*，空行分段", font=("", 9))
        info.pack(anchor=tk.W, padx=10, pady=(0, 5))

        self.refresh_cat_list()

    def refresh_cat_list(self):
        self.cat_listbox.delete(0, tk.END)
        for cat in self.data["categories"]:
            self.cat_listbox.insert(tk.END, f"{cat.get('icon', '📌')} {cat['title']}")

    def refresh_entry_list(self):
        self.entry_listbox.delete(0, tk.END)
        if self.current_cat_idx is None:
            return
        cat = self.data["categories"][self.current_cat_idx]
        for entry in cat["entries"]:
            self.entry_listbox.insert(tk.END, entry.get("title", "(无标题)"))

    def on_cat_select(self, event=None):
        sel = self.cat_listbox.curselection()
        if not sel:
            return
        self.sync_editor_to_data()
        self.current_cat_idx = sel[0]
        self.current_entry_idx = None
        self.refresh_entry_list()
        self._suppress_sync = True
        self.title_var.set("")
        self.image_var.set("")
        self.content_text.delete(1.0, tk.END)
        self._suppress_sync = False

    def on_entry_select(self, event=None):
        sel = self.entry_listbox.curselection()
        if not sel:
            return
        self.sync_editor_to_data()
        self.current_entry_idx = sel[0]
        cat = self.data["categories"][self.current_cat_idx]
        entry = cat["entries"][self.current_entry_idx]
        self._suppress_sync = True
        self.title_var.set(entry.get("title", ""))
        self.image_var.set(entry.get("image", ""))
        self.content_text.delete(1.0, tk.END)
        self.content_text.insert(1.0, entry.get("content", ""))
        self._suppress_sync = False

    def clear_editor(self):
        self._suppress_sync = True
        self.title_var.set("")
        self.image_var.set("")
        self.content_text.delete(1.0, tk.END)
        self._suppress_sync = False

    def sync_editor_to_data(self):
        if self.current_cat_idx is None or self.current_entry_idx is None:
            return
        cat = self.data["categories"][self.current_cat_idx]
        if 0 <= self.current_entry_idx < len(cat["entries"]):
            cat["entries"][self.current_entry_idx]["title"] = self.title_var.get()
            cat["entries"][self.current_entry_idx]["image"] = self.image_var.get()
            cat["entries"][self.current_entry_idx]["content"] = self.content_text.get(1.0, tk.END).strip()

    def on_title_change(self, *args):
        if self._suppress_sync:
            return
        self.sync_editor_to_data()
        self.refresh_entry_list()
        if self.current_entry_idx is not None:
            self.entry_listbox.selection_set(self.current_entry_idx)

    def add_category(self):
        name = tk.simpledialog.askstring("新增分类", "分类名称：")
        if not name:
            return
        icon = tk.simpledialog.askstring("新增分类", "图标（emoji，可选）：") or "📌"
        cat_id = name.lower().replace(" ", "-").replace("\n", "")
        cat = {"id": cat_id, "title": name, "icon": icon, "entries": []}
        self.data["categories"].append(cat)
        self.refresh_cat_list()
        # 选中新分类
        idx = len(self.data["categories"]) - 1
        self.cat_listbox.selection_set(idx)
        self.on_cat_select()

    def del_category(self):
        if self.current_cat_idx is None:
            return
        cat = self.data["categories"][self.current_cat_idx]
        if not messagebox.askyesno("删除分类", f"确定删除「{cat['title']}」及其所有词条？"):
            return
        self.data["categories"].pop(self.current_cat_idx)
        self.current_cat_idx = None
        self.current_entry_idx = None
        self.refresh_cat_list()
        self.refresh_entry_list()
        self.clear_editor()

    def rename_category(self):
        if self.current_cat_idx is None:
            return
        cat = self.data["categories"][self.current_cat_idx]
        name = tk.simpledialog.askstring("重命名", "新名称：", initialvalue=cat["title"])
        if name:
            cat["title"] = name
            self.refresh_cat_list()

    def add_entry(self):
        if self.current_cat_idx is None:
            messagebox.showwarning("提示", "请先选择一个分类")
            return
        cat = self.data["categories"][self.current_cat_idx]
        name = tk.simpledialog.askstring("新增词条", "词条标题：")
        if not name:
            return
        entry_id = name.lower().replace(" ", "-").replace("\n", "")
        cat["entries"].append({"id": entry_id, "title": name, "image": "", "content": ""})
        self.refresh_entry_list()
        idx = len(cat["entries"]) - 1
        self.entry_listbox.selection_set(idx)
        self.on_entry_select()

    def del_entry(self):
        if self.current_cat_idx is None or self.current_entry_idx is None:
            return
        cat = self.data["categories"][self.current_cat_idx]
        entry = cat["entries"][self.current_entry_idx]
        if not messagebox.askyesno("删除词条", f"确定删除「{entry['title']}」？"):
            return
        cat["entries"].pop(self.current_entry_idx)
        self.current_entry_idx = None
        self.refresh_entry_list()
        self.clear_editor()

    def move_entry_up(self):
        if self.current_cat_idx is None or self.current_entry_idx is None or self.current_entry_idx <= 0:
            return
        cat = self.data["categories"][self.current_cat_idx]
        idx = self.current_entry_idx
        cat["entries"][idx - 1], cat["entries"][idx] = cat["entries"][idx], cat["entries"][idx - 1]
        self.current_entry_idx = idx - 1
        self.refresh_entry_list()
        self.entry_listbox.selection_set(self.current_entry_idx)

    def move_entry_down(self):
        if self.current_cat_idx is None or self.current_entry_idx is None:
            return
        cat = self.data["categories"][self.current_cat_idx]
        idx = self.current_entry_idx
        if idx >= len(cat["entries"]) - 1:
            return
        cat["entries"][idx], cat["entries"][idx + 1] = cat["entries"][idx + 1], cat["entries"][idx]
        self.current_entry_idx = idx + 1
        self.refresh_entry_list()
        self.entry_listbox.selection_set(self.current_entry_idx)

    def pick_image(self):
        path = filedialog.askopenfilename(
            title="选择图片",
            filetypes=[("图片", "*.png *.jpg *.jpeg *.gif *.webp"), ("全部", "*.*")]
        )
        if path:
            # 转换为相对路径
            rel = os.path.relpath(path, PROJECT_DIR).replace("\\", "/")
            self.image_var.set("./" + rel if not rel.startswith("./") else rel)


def main():
    root = tk.Tk()
    EntryManager(root)
    root.mainloop()


if __name__ == "__main__":
    main()
