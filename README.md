# 高级微观连续学习网站

本项目是独立的本地学习网站。五讲均已接入：90 个连续知识点、182 页 PPT、17 道PPT指定 MWG 原题及11道筛选后的教材强化题。当前本地候选版本为 `2026.09.29-exercise-expansion-1`：在定义完整性、KaTeX、安全渲染和前置教学基础上，增加即时巩固、教材强化与隔段回练。

## 启动

macOS 可直接双击项目根目录的 `打开高微网站.command`；它会在需要时启动本地服务并打开正确地址。不要直接双击 `index.html`，`file://` 模式会被浏览器阻止加载 JavaScript 模块。

在本目录运行：

```bash
npm start
```

或直接运行：

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

浏览器打开 <http://127.0.0.1:4173/>。服务器只绑定本机回环地址，避免把教材和课件目录暴露到局域网。无需安装依赖、登录、API Key 或联网模型。

## 公开版本

当前公开站点仍是上一轮已发布版本；本地 `exercise-expansion-1` 候选尚未推送或覆盖线上。

公开 GitHub 仓库与 GitHub Pages 只包含网站源码、结构化课程内容、测试和文档。教师 PPT、MWG 原 PDF、节选文件、拓扑参考源码和个人学习备份均由 `.gitignore` 排除，不会上传。公开站点仍显示准确来源文件名与物理页码，但原 PDF 按钮只在本地完整项目中可用。

- 公开源码：<https://github.com/Yu-Zien/advanced-micro-learning>
- 在线学习：<https://yu-zien.github.io/advanced-micro-learning/>
- `main` 每次推送都会先运行测试与内容审计，再由 GitHub Actions 发布白名单静态目录。

## 检查

```bash
npm test
npm run check
```

`npm test` 检查独立状态、重复完成、练习/回忆分离、刷新恢复、备份校验、错误课程拒绝及深化内容的非破坏迁移；`npm run check` 检查 PPT 路由、稳定 ID、原题接入、规范定义、前置教学映射和来源核对的真实状态。

内容检查还会把课程源码与 `sources/manifest.json`、PPT逐页覆盖表、课程蓝图及原题索引交叉核对，防止新增或修改内容时出现页码越界、重复ID、索引漂移或原题脱离主线。

数学渲染使用本地 vendored KaTeX 0.18.9。普通文本先转义，只有受控强调/表格与结构化 TeX 进入 HTML；检查器会让无法解析的结构化公式失败。正文、提示、答案和复习内容中的比较式也通过同一安全边界转换为可复制的 KaTeX/MathML，不把公式转成图片。

## 数据与隐私

- `courseId`: `advanced-microeconomics-2026`
- localStorage: `advanced-microeconomics-2026::state::v1`
- 不读取或迁移拓扑项目进度；不自动上传原 PDF 或学习备份。
- 每个知识点与教材原题都可在新标签打开本机原 PDF 对应物理页；来源回看不会推进或重置主线。
- 阅读设置中可选本周作业题号和截止日期；未选择时保持 `null`，不会自动把17题全部标成作业。作业标签不改变课程完成或回忆状态。
- 预算线、严格凸混合束和 AC/MC 有效规模提供本地 SVG 互动图；均标为教学自绘，不冒充课件原图，拖动参数不会写入学习成绩。
- “继续学习”顶部按约60分钟生成每日软计划：到期回忆最多预留约10分钟，其余按主线顺序安排新知识点。它没有倒计时或通关约束，随时暂停不会损失位置。
- 新导出的备份带非加密完整性校验码，用于发现文件损坏或误改；它不是数字签名。导入前会在独立键下保留当前状态。错误课程、schema、未知内容位置或被改动的备份会被拒绝；无校验码的旧版备份仍可兼容导入并明确提示。
- “完成本轮”、普通练习自评、FSRS 回忆排程是三类独立状态。精选回忆使用本地固定版本的 `ts-fsrs 5.4.2`（FSRS v6），目标保持率 0.9；关闭短期学习步，答“没想起”也不会在当前学习段立即重弹。
- 新增16个教学自编短题和11道教材强化题均在原知识点页面连续出现；教材题显示筛选理由、预计时间、知识点映射、渐进提示与分步参考解。可选题不计入每日核心时长。
- 若旧记录已完成本轮任何被实质深化的模块，网站保留原完成记录，但把该模块加入“待补学”队列；补学不会把新增普通题自动写成成功回忆，也不会移动原主线位置。
- 主线只能按课程顺序推进；若旧状态异常地只保住后续主线位置却漏掉此前完成列表，网站会恢复主线之前的知识点为“完成本轮”，但不会推断当前点已完成，也不会制造练习或回忆评分。目录同时显示“已完成数”和“当前主线”。

## 内容状态

- L01：ready，20 个知识点，29/29 页，4/4 原题。
- L02：ready，14 个知识点，39/39 页，4/4 原题。
- L03：ready，21 个知识点，42/42 页，3/3 原题。
- L04：ready，15 个知识点，28/28 页，3/3 原题。
- L05：ready，20 个知识点，44/44 页，3/3 原题。

课程模块的 `ready` 只表示可进入学习，不再等同于“原PPT每个页内条目都已逐项终验”。本轮独立来源核对见 [`data/source-reconciliation.json`](data/source-reconciliation.json)：36/182 页的本轮点名条目已按原页图像核对，但因尚未把整页全部项目逐条拆完，状态保持 `partially_expanded`；另146页为 `pending_source_review`。缺少附件所述637项种子文件时没有伪造或批量填成通过。

五讲的前置位置、依赖链、练习机会和旧到新映射见 [`data/prerequisite-map.json`](data/prerequisite-map.json)；本轮教学核对与“修改前/修改后”样例见 [`docs/PREREQUISITE_AUDIT.md`](docs/PREREQUISITE_AUDIT.md)。

重要符号的读法、对象类型、首次独立使用和此前教学位置见 [`data/symbol-first-use.json`](data/symbol-first-use.json)。它记录的是教学覆盖，不是学习者掌握证明。

本轮规范定义、条件追溯、数学修正、来源状态与浏览器验收见 [`docs/DEFINITION_COMPLETENESS_REPAIR.md`](docs/DEFINITION_COMPLETENESS_REPAIR.md)。

本轮练习筛选、录取/拒绝理由与“首次学习→即时→隔段→教材强化”路径见 [`docs/EXERCISE_EXPANSION.md`](docs/EXERCISE_EXPANSION.md) 和 [`data/exercise-candidate-index.json`](data/exercise-candidate-index.json)。

第三方本地依赖的版本、来源、文件校验和与许可证见 [`vendor/ts-fsrs/PROVENANCE.md`](vendor/ts-fsrs/PROVENANCE.md) 和 [`vendor/katex/PROVENANCE.md`](vendor/katex/PROVENANCE.md)。
