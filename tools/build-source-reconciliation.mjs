import { readFileSync, writeFileSync } from "node:fs";

const coverage = JSON.parse(readFileSync(new URL("../data/ppt-page-coverage.json", import.meta.url), "utf8"));

const reviewed = new Map();
const add = (sourceId, pdfPage, status, items) => reviewed.set(`${sourceId}:${pdfPage}`, { status, items });
const item = (id, type, evidenceSummary, websiteLocations, canonicalIds = [], note = "") => ({
  id, type, evidenceSummary, websiteLocations, canonicalIds, note
});

add("L01", 13, "fully_preserved", [item("L01-P13-I01", "definition", "选择结构由非空预算集合族与非空、预算内的选择结果组成。", ["L01-M14#definition-DEF-CS"], ["DEF-CS"])]);
add("L01", 14, "fully_preserved", [item("L01-P14-I01", "definition", "WARP 是跨两份预算记录的一致性要求；不负责保证预算或结果非空。", ["L01-M15#definition-DEF-WARP"], ["DEF-WARP"])]);
add("L01", 15, "fully_preserved", [item("L01-P15-I01", "definition", "由共同预算中的实际选择定义揭示弱偏好与揭示严格偏好。", ["L01-M16#definition-DEF-REVEALED"], ["DEF-REVEALED"])]);
add("L01", 16, "fully_preserved", [item("L01-P16-I01", "definition", "理性偏好在预算内生成全部弱最大元集合 C*。", ["L01-M17#definition-DEF-CSTAR"], ["DEF-CSTAR"])]);
add("L01", 17, "fully_preserved", [item("L01-P17-I01", "proof", "由理性偏好生成的选择满足 WARP；证明逐步调用预算内最大性与传递性。", ["L01-M17"], ["DEF-CSTAR", "DEF-WARP"])]);
add("L01", 18, "fully_preserved", [item("L01-P18-I01", "counterexample", "稀疏二元素预算允许三点揭示循环而不直接违反 WARP。", ["L01-M18"], ["DEF-WARP", "DEF-REVEALED"])]);
add("L01", 19, "fully_preserved", [item("L01-P19-I01", "counterexample", "三点循环不能由传递的理性偏好生成。", ["L01-M18"], ["DEF-REVEALED"])]);
add("L01", 20, "fully_preserved", [item("L01-P20-I01", "transition", "加入三元素预算后进入理性化存在与唯一性命题。", ["L01-M19"], ["DEF-RATIONALIZE"])]);
add("L01", 21, "fully_preserved", [item("L01-P21-I01", "definition", "理性化要求原选择与偏好生成的最大元集合对每个预算完全相等。", ["L01-M19#definition-DEF-RATIONALIZE"], ["DEF-RATIONALIZE"])]);
for (const page of [22, 23, 24, 25]) add("L01", page, "fully_preserved", [item(`L01-P${page}-I01`, "proof", "理性化定理的完备性、传递性或双包含步骤；取选择元素处已回指 CS-3。", [page <= 23 ? "L01-M19" : "L01-M20"], ["DEF-CS", "DEF-WARP", "DEF-REVEALED", "DEF-RATIONALIZE"])]);

add("L02", 8, "fully_preserved", [item("L02-P08-I01", "assumption", "从本页起把需求暂设为单值、连续且在使用导数处可微。", ["L02-M03#definition-ASSUMP-L02-SMOOTH-DEMAND"], ["ASSUMP-L02-SMOOTH-DEMAND"])]);
add("L02", 17, "fully_preserved", [item("L02-P17-I01", "definition", "Slutsky 补偿把新财富设为新价格下购买原束所需支出。", ["L02-M07"], [])]);
add("L02", 18, "fully_preserved", [item("L02-P18-I01", "proposition", "WARP 给出补偿需求法则的有限变化不等式。", ["L02-M09"], ["DEF-WARP"])]);
add("L02", 22, "fully_preserved", [item("L02-P22-I01", "proof", "补偿证明区分原束在新预算可负担与新束实际被选择。", ["L02-M09"], ["DEF-WARP"])]);
add("L02", 23, "fully_preserved", [item("L02-P23-I01", "proof", "交叉可负担严格不等式给出补偿需求法则严格号。", ["L02-M09"], ["DEF-WARP"])]);
add("L02", 28, "fully_preserved", [item("L02-P28-I01", "proof", "中间价格构造的加权预算余量明确算为严格正数，再推出至少一项正。", ["L02-M10"], ["ASSUMP-L02-SMOOTH-DEMAND"])]);
add("L02", 35, "fully_preserved", [item("L02-P35-I01", "proposition", "Slutsky 负半定是 WARP 的局部必要限制，不足以推出 WARP。", ["L02-M12"], [])]);
add("L02", 36, "fully_preserved", [item("L02-P36-I01", "counterexample", "三商品需求给出反对称 Slutsky 矩阵，二次型恒为零。", ["L02-M12"], [], "网页明确保留其定义域为 R^3，第二分量可为负。")]);
add("L02", 37, "fully_preserved", [item("L02-P37-I01", "counterexample", "两组具体价格财富下需求束不同且交叉支出均等于预算，故违反 WARP。", ["L02-M12"], ["DEF-WARP"])]);

add("L03", 9, "fully_preserved", [item("L03-P09-I01", "definition", "位似偏好的定义域、单调背景与所有非负缩放量词。", ["L03-M05#definition-DEF-HOMOTHETIC"], ["DEF-HOMOTHETIC"])]);
add("L03", 10, "fully_preserved", [item("L03-P10-I01", "definition", "拟线性偏好采用 R×R_+^(L-1)，平移量可为任意实数。", ["L03-M05#definition-DEF-QUASILINEAR"], ["DEF-QUASILINEAR"])]);
add("L03", 15, "fully_preserved", [item("L03-P15-I01", "existence", "UMP 存在性依赖非空紧预算集与连续效用。", ["L03-M08"], [])]);
add("L03", 25, "fully_preserved", [item("L03-P25-I01", "assumption", "KKT 的可行性、乘子与互补条件；MRS 比值只在分母非零且相关商品内点时使用。", ["L03-M10#definition-ASSUMP-UMP-KKT", "L03-M10#definition-DEF-MRS"], ["ASSUMP-UMP-KKT", "DEF-MRS"])]);
add("L03", 36, "fully_preserved", [item("L03-P36-I01", "property_list", "Hicks 需求的齐次、恰达目标、凸值、单值/连续性等性质逐项保留。", ["L03-M18#definition-PROP-HICKS-PROPERTIES"], ["PROP-HICKS-PROPERTIES"])]);
add("L03", 37, "fully_preserved", [item("L03-P37-I01", "property_list", "支出函数的齐次、关于效用和价格的单调、关于价格凹及连续性逐项保留。", ["L03-M18#definition-PROP-EXPENDITURE-PROPERTIES"], ["PROP-EXPENDITURE-PROPERTIES"])]);

add("L04", 27, "fully_preserved", [item("L04-P27-I01", "figure", "Hicks 曲线、普通需求、税前税后价格及面积 B 的坐标与结论在教学重绘中保留。", ["L04-M15#unit-L04-M15-dwl-area-graph"], ["DEF-DWL-AV"])]);
add("L04", 28, "fully_preserved", [item("L04-P28-I01", "figure_formula", "普通需求近似面积为 B+C，误差为 C，并保留相对误差未必消失的结论。", ["L04-M15#definition-DEF-DWL-AV", "L04-M15#unit-L04-M15-dwl-area-graph"], ["DEF-DWL-AV"])]);

add("L05", 8, "fully_preserved", [item("L05-P08-I01", "definition", "不可逆性与规模、可加、凸性等性质分开定义。", ["L05-M04#definition-DEF-IRREVERSIBILITY"], ["DEF-IRREVERSIBILITY"])]);
add("L05", 21, "fully_preserved", [item("L05-P21-I01", "property_list", "利润与供给的齐次、凸性、凸值/单值、恢复技术及 Hotelling 导数性质。", ["L05-M09#definition-PROP-PROFIT-RECOVERY"], ["PROP-PROFIT-RECOVERY"])]);
add("L05", 27, "fully_preserved", [item("L05-P27-I01", "property_list", "成本与条件要素需求的齐次、关于 q 非减、凹性、凸值/单值及恢复技术。", ["L05-M13#definition-PROP-COST-RECOVERY"], ["PROP-COST-RECOVERY"])]);
add("L05", 32, "fully_preserved", [item("L05-P32-I01", "figure_example", "凸生产集、等利润线斜率、成本曲线与 p=MC 的全局最优含义。", ["L05-M15#unit-L05-M15-teacher-example-convex-production"], [])]);
add("L05", 33, "fully_preserved", [item("L05-P33-I01", "figure_example", "非沉没启动成本导致非凸，停产点可支撑更高利润。", ["L05-M15#unit-L05-M15-teacher-example-nonconvex-production"], [])]);
add("L05", 34, "fully_preserved", [item("L05-P34-I01", "figure_example", "成本图中 p=MC 的正规模候选不一定是全局 PMP 解。", ["L05-M15#unit-L05-M15-teacher-example-nonconvex-production"], [])]);

const pages = coverage.map(row => {
  const key = `${row.sourceId}:${row.pdfPage}`;
  const audit = reviewed.get(key);
  return {
    sourceId: row.sourceId,
    file: row.file,
    pdfPage: row.pdfPage,
    pageStatus: audit ? "partially_expanded" : "pending_source_review",
    existingLessonRoutes: row.publishedLessonIds,
    items: audit?.items || [],
    nextAction: audit ? "已按原页图像核对本轮点名条目，但尚未把该页所有定义、条件、公式、图、脚注和例题逐项拆完，因此整页保持部分完成。" : "逐项读取原页的定义、条件、公式、图、脚注和例题，并填写真实网页锚点；当前页码路由不等于内容验收。"
  };
});

const counts = pages.reduce((acc, page) => {
  acc[page.pageStatus] = (acc[page.pageStatus] || 0) + 1;
  acc.items += page.items.length;
  return acc;
}, { items: 0, fully_preserved: 0, partially_expanded: 0, missing: 0, source_question: 0, pending_source_review: 0 });

const output = {
  schemaVersion: 1,
  contentVersion: "2026.09.29-exercise-expansion-1",
  baselineCommit: "e866ba25babafeb61609f662e4d958cd4c2eabca",
  generatedFrom: "data/ppt-page-coverage.json plus direct visual inspection of the listed local PPT pages",
  missingBundleFiles: ["CODEX_EXECUTION.md", "SOURCE_RECONCILIATION_SEED.json", "PPT_182_PAGE_CHECKLIST.md", "WARP_CANONICAL_LESSON.md", "mathematical_checks.py"],
  truthfulnessNote: "缺少附件所述637项种子文件，因此未伪造637项。未逐项核对的页面保持 pending_source_review；existingLessonRoutes 仅表示现有网页路由。",
  counts,
  pages
};

writeFileSync(new URL("../data/source-reconciliation.json", import.meta.url), `${JSON.stringify(output, null, 2)}\n`);
