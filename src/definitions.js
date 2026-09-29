const record = (id, kind, title, lessonId, source, fields) => ({ id, kind, title, lessonId, source, ...fields });

export const definitionRecords = [
  record("DEF-CS", "definition", "选择结构", "L01-M14", "L01 PPT 第13页；MWG 印刷第10页 / 原 PDF 34", {
    aliases: ["choice structure", "C(B)", "预算集族", "选择对应"],
    object: "一对对象 (𝓑,C)：可选集合族与定义在该族上的选择对应。",
    scope: "给定总体方案集合 X。𝓑 不必包含 X 的所有子集。",
    clauses: [
      { id: "CS-1", text: "𝓑 是 X 的非空子集组成的集合族；每个 B∈𝓑 自身必须非空。", tex: "\\varnothing\\ne B\\subseteq X\\quad\\text{for every }B\\in\\mathcal{B}" },
      { id: "CS-2", text: "C 是同一条选择规则，输入是 B，输出是结果集合 C(B)。", tex: "C:\\mathcal{B}\\rightrightarrows X" },
      { id: "CS-3", text: "每个结果集合非空，并且只能从当前可选集合中选择。", tex: "\\varnothing\\ne C(B)\\subseteq B\\quad\\text{for every }B\\in\\mathcal{B}" }
    ],
    example: "若 B={x,y}，则 {x}、{y}、{x,y} 都是结构上合法的结果；∅ 和 {z} 不是。合法只检查 CS-3，尚未检查 WARP。",
    boundary: "C(B) 非空来自选择结构定义，不是 WARP 推出的结论。"
  }),
  record("DEF-WARP", "definition", "WARP（显示偏好弱公理）", "L01-M15", "L01 PPT 第14页；MWG Definition 1.C.1，印刷第10页 / 原 PDF 34", {
    aliases: ["weak axiom", "显示偏好弱公理"],
    object: "WARP 是对整个选择结构 (𝓑,C) 的跨预算一致性要求，不是集合或关系本身。",
    scope: "对任意 B,B′∈𝓑 以及任意共同可选的 x,y∈B∩B′。",
    clauses: [
      { id: "WARP-1", text: "若 x 在 B 中被选，而 y 在 B′ 中被选，", tex: "x\\in C(B),\\qquad y\\in C(B')" },
      { id: "WARP-2", text: "则 B′ 的结果不能选择 y 却排除 x。", tex: "x\\in C(B')" }
    ],
    example: "C({x,y})={x} 与 C({x,y,z})={x,y} 违反 WARP：交换预算和对象角色后，WARP 要求小预算也选择 y。",
    boundary: "WARP 不负责保证 B 或 C(B) 非空；这些先由 DEF-CS 的 CS-1、CS-3 保证。"
  }),
  record("DEF-REVEALED", "definition", "揭示弱偏好与揭示严格偏好", "L01-M16", "L01 PPT 第15页；MWG 印刷第11页 / 原 PDF 35", {
    aliases: ["revealed preference", "⪰*", "揭示偏好"],
    object: "由选择记录导出的二元关系。",
    scope: "x、y 属于总体方案集合 X；存在一个同时包含二者的已观察预算。",
    clauses: [
      { id: "RP-1", text: "x 揭示至少与 y 一样好：存在共同预算 B，且 x 被选。", tex: "x\\succeq^*y\\Longleftrightarrow\\exists B\\in\\mathcal{B}:x,y\\in B,\\ x\\in C(B)" },
      { id: "RP-2", text: "x 揭示严格优于 y：x 被选而 y 同场未被选。", tex: "x\\succ^*y\\Longleftrightarrow\\exists B\\in\\mathcal{B}:x,y\\in B,\\ x\\in C(B),\\ y\\notin C(B)" }
    ],
    example: "若 C({x,y})={x}，则 x⪰*y 且 x≻*y。",
    boundary: "揭示关系由数据构造；它是否理性、是否理性化原选择是后续需要分别证明的结论。"
  }),
  record("DEF-CSTAR", "definition", "偏好生成的预算内最大元集合 C*", "L01-M17", "L01 PPT 第16–17页", {
    aliases: ["C*", "generated choice", "最大元集合"],
    object: "给定偏好关系与预算集合后得到的选择结果集合。",
    scope: "B∈𝓑；偏好关系定义在 X 上。",
    clauses: [
      { id: "CSTAR-1", text: "C*(B,⪰) 收集 B 中弱优于 B 内每个方案的全部元素。", tex: "C^*(B,\\succeq)=\\{x\\in B:x\\succeq y\\ \\text{for every }y\\in B\\}" }
    ],
    example: "若 x∼y 且二者都优于 z，那么 C*({x,y,z},⪰)={x,y}。",
    boundary: "C* 是否非空需要预算和偏好的条件；不能从符号本身推出。"
  }),
  record("DEF-RATIONALIZE", "definition", "偏好关系理性化选择结构", "L01-M19", "L01 PPT 第21页", {
    aliases: ["rationalization", "理性化", "C*=C"],
    object: "一个偏好关系与一个给定选择结构之间的生成关系。",
    scope: "偏好关系 ⪰ 必须先是 X 上的理性偏好；等式必须对预算族中的每个 B 成立。",
    clauses: [
      { id: "RAT-1", text: "原选择恰好等于偏好在每个预算内生成的全部最大元。", tex: "C(B)=C^*(B,\\succeq)\\quad\\text{for every }B\\in\\mathcal{B}" }
    ],
    example: "只证明揭示关系完备、传递还不够；还必须证明 C⊆C* 与 C*⊆C。",
    boundary: "‘揭示关系理性’与‘揭示关系理性化 C’是两个不同证明目标。"
  }),
  record("ASSUMP-L02-SMOOTH-DEMAND", "assumption", "第二讲后续的单值、连续、可微需求假设", "L02-M03", "L02 PPT 第8页", {
    aliases: ["single-valued", "continuous", "differentiable", "smooth demand"],
    object: "从本页起对需求对象 x(p,w) 增加的工作假设。",
    scope: "第二讲第8页以后使用普通偏导、Jacobian 和单值 WARP 不等式的段落；不回溯改变 M02 对应的一般定义。",
    clauses: [
      { id: "SD-1", text: "每个价格—财富输入只返回一个需求束。", tex: "x(p,w)\\in\\mathbb{R}_+^L\\quad\\text{is single-valued}" },
      { id: "SD-2", text: "需求随参数连续。", tex: "x\\text{ is continuous in }(p,w)" },
      { id: "SD-3", text: "需要写 D_px、D_wx 的位置假设相应偏导存在。", tex: "x\\text{ is differentiable at the point under study}" }
    ],
    boundary: "这些是本讲新增假设，不是‘对应’一词自动蕴含的性质。"
  }),
  record("DEF-HOMOTHETIC", "definition", "位似偏好", "L03-M05", "L03 PPT 第9页", {
    aliases: ["homothetic"],
    object: "定义在非负商品空间上的单调偏好，其无差异比较沿原点射线同比缩放保持。",
    scope: "X=R_+^L；α≥0；源页同时以单调偏好为背景。",
    clauses: [{ id: "HOM-1", text: "无差异束同比缩放后仍无差异。", tex: "x\\sim y\\Longrightarrow\\alpha x\\sim\\alpha y\\quad\\text{for every }\\alpha\\ge0" }],
    boundary: "‘存在一次齐次效用表示’是带连续性等条件的表示命题，不是定义本身。"
  }),
  record("DEF-QUASILINEAR", "definition", "对商品1拟线性的偏好", "L03-M05", "L03 PPT 第10页", {
    aliases: ["quasilinear", "拟线性"],
    object: "沿商品1方向平移无差异集、且增加商品1严格改善的偏好。",
    scope: "源页临时采用 X=R×R_+^{L-1}；平移量 α∈R，并要求平移后的束属于 X。",
    clauses: [
      { id: "QL-1", text: "相同平移保持无差异。", tex: "x\\sim y\\Longleftrightarrow x+\\alpha e_1\\sim y+\\alpha e_1\\quad\\text{for every admissible }\\alpha\\in\\mathbb{R}" },
      { id: "QL-2", text: "正向增加商品1严格改善。", tex: "x+\\alpha e_1\\succ x\\quad\\text{for }\\alpha>0" }
    ],
    boundary: "若改回 X=R_+^L，负向平移受到边界限制，必须只在仍可行的范围使用。"
  }),
  record("ASSUMP-UMP-KKT", "assumption", "UMP 的 KKT 工作条件", "L03-M10", "L03 PPT 第25页；MWG 印刷第53–55页 / 原 PDF 77–79", {
    aliases: ["KKT", "λ", "interior optimum"],
    object: "在给定最优解存在后，用一阶条件分析该解的局部正则条件。",
    scope: "效用可微；价格严格为正；预算可行；非负约束与预算约束满足相应正则条件。",
    clauses: [
      { id: "KKT-1", text: "原始可行性。", tex: "x^*\\ge0,\\qquad p\\cdot x^*\\le w" },
      { id: "KKT-2", text: "预算乘子非负并满足预算互补。", tex: "\\lambda\\ge0,\\qquad\\lambda(w-p\\cdot x^*)=0" },
      { id: "KKT-3", text: "每个商品的边际条件与非负约束互补。", tex: "\\frac{\\partial u(x^*)}{\\partial x_\\ell}\\le\\lambda p_\\ell,\\qquad x_\\ell^*\\left(\\frac{\\partial u(x^*)}{\\partial x_\\ell}-\\lambda p_\\ell\\right)=0" }
    ],
    boundary: "λ>0 还需非退化条件（例如相关效用梯度非零）；严格递增或LNS本身不保证每点导数严格正。拟凹/凹性等条件决定一阶条件何时充分。"
  }),
  record("DEF-MRS", "definition", "边际替代率 MRS", "L03-M10", "L03 PPT 第25页；MWG 印刷第55页", {
    aliases: ["MRS", "边际替代率"],
    object: "保持效用一阶不变时，用商品k补偿一单位商品ℓ变化的局部比率。",
    scope: "效用在该点可微；分母边际效用非零。",
    clauses: [{ id: "MRS-1", text: "MRS 是两个边际效用之比。", tex: "MRS_{\\ell k}(x)=\\frac{\\partial u(x)/\\partial x_\\ell}{\\partial u(x)/\\partial x_k}" }],
    boundary: "MRS=pℓ/pk 是内点最优条件下的结论，不是 MRS 的定义。"
  }),
  record("PROP-HICKS-PROPERTIES", "proposition", "Hicks需求 h(p,u) 的性质清单", "L03-M18", "L03 PPT 第36页", {
    aliases: ["Hicks properties", "h性质"],
    object: "EMP 最小化者集合 h(p,u) 的性质。",
    scope: "目标效用可达到、价格严格为正；各条性质需要页面标明的偏好凸性/严格凸性和连续性条件。",
    clauses: [
      { id: "H-1", text: "对价格零次齐次。", tex: "h(\\alpha p,u)=h(p,u)\\quad(\\alpha>0)" },
      { id: "H-2", text: "任一最小化者恰好达到目标效用；证明回指 L03-M17。", tex: "x\\in h(p,u)\\Longrightarrow u(x)=u" },
      { id: "H-3", text: "偏好凸时解集凸值。", tex: "h(p,u)\\text{ is convex-valued}" },
      { id: "H-4", text: "偏好严格凸时，若解存在则单值。", tex: "h(p,u)\\text{ is single-valued when nonempty}" },
      { id: "H-5", text: "在源页相应条件下，h 是上半连续对应；严格凸使单值对应成为连续函数。", tex: "h\\text{ is upper hemicontinuous; under strict convexity, continuous}" }
    ]
  }),
  record("PROP-EXPENDITURE-PROPERTIES", "proposition", "支出函数 e(p,u) 的性质清单", "L03-M18", "L03 PPT 第37页", {
    aliases: ["expenditure properties", "e性质"],
    object: "EMP 的最优值函数。",
    scope: "目标效用在可达到域中；价格位于严格正价格域；连续性等依赖本讲偏好条件。",
    clauses: [
      { id: "E-1", text: "对价格一次齐次。", tex: "e(\\alpha p,u)=\\alpha e(p,u)" },
      { id: "E-2", text: "对目标效用严格递增。", tex: "u'>u\\Longrightarrow e(p,u')>e(p,u)" },
      { id: "E-3", text: "对每个价格分量非减。", tex: "p'\\ge p\\Longrightarrow e(p',u)\\ge e(p,u)" },
      { id: "E-4", text: "关于价格凹。", tex: "e(\\alpha p+(1-\\alpha)p',u)\\ge\\alpha e(p,u)+(1-\\alpha)e(p',u)" },
      { id: "E-5", text: "在相应条件下关于价格和目标效用连续。", tex: "e\\text{ is continuous in }(p,u)" }
    ]
  }),
  record("DEF-DWL-AV", "definition", "普通需求面积近似与无谓损失误差", "L04-M15", "L04 PPT 第27–28页", {
    aliases: ["DWL_AV", "area B", "area C", "无谓损失近似"],
    object: "图中纵轴为价格、横轴为商品数量时的带符号积分与面积分解。",
    scope: "单一商品价格变化；其他价格与财富按课件设定固定；沿用本课 EV/CV 符号。",
    clauses: [
      { id: "DWL-1", text: "真实 Hicks 无谓损失对应图中区域 B。", tex: "DWL=B" },
      { id: "DWL-2", text: "用普通需求构造的近似等于区域 B+C。", tex: "DWL_{AV}=\\int_{p_\\ell^0}^{p_\\ell^1}\\left[x_\\ell(p_\\ell,p_{-\\ell}^0,w)-x_\\ell(p^1,w)\\right]dp_\\ell=B+C" },
      { id: "DWL-3", text: "近似误差是区域 C；C/B 在小价格变化下未必趋零。", tex: "DWL_{AV}-DWL=C" }
    ],
    boundary: "本节的 B、C 是图形面积标签，不是第一讲的预算集 B 或选择规则 C。"
  }),
  record("DEF-IRREVERSIBILITY", "definition", "生产技术不可逆性", "L05-M04", "L05 PPT 第8页第6项及图例", {
    aliases: ["irreversibility", "不可逆性"],
    object: "生产集 Y 的一项独立性质。",
    scope: "任意非零可行生产向量 y。",
    clauses: [{ id: "IRR-1", text: "非零生产计划的完全反向计划不可行。", tex: "y\\in Y,\\ y\\ne0\\Longrightarrow -y\\notin Y" }],
    example: "若投入商品1生产商品2可行，不意味着把商品2完全变回商品1也可行。",
    boundary: "不可逆性不同于自由处置、无免费午餐、凸性或规模报酬。"
  }),
  record("PROP-PROFIT-RECOVERY", "proposition", "由利润函数恢复凸生产集", "L05-M09", "L05 PPT 第21页第3项", {
    aliases: ["profit recovery", "由利润恢复技术"],
    object: "用所有价格下的利润上界刻画生产集。",
    scope: "在源页采用的凸生产集与闭性等条件下；价格域按该命题规定。",
    clauses: [
      { id: "PR-1", text: "利润函数对价格一次齐次且凸。", tex: "\\pi(\\alpha p)=\\alpha\\pi(p),\\qquad \\pi\\text{ is convex in }p" },
      { id: "PR-2", text: "供给对应对价格零次齐次；生产集凸时供给集合凸值。", tex: "y(\\alpha p)=y(p),\\qquad y(p)\\text{ is convex-valued if }Y\\text{ is convex}" },
      { id: "PR-3", text: "生产集严格凸时，供给对应要么是单元素集合，要么为空。", tex: "y(p)\\text{ is either a singleton or the empty set under strict convexity}" },
      { id: "PR-4", text: "可行计划在每个价格下的价值都不超过利润函数；满足全部上界的向量构成恢复的生产集。", tex: "Y=\\{y\\in\\mathbb{R}^L:p\\cdot y\\le\\pi(p)\\ \\text{for all }p\\gg0\\}" }
    ],
    boundary: "没有相应凸闭条件时，右侧恢复的是由支持半空间决定的凸闭包式对象，不能无条件等同原 Y。"
  }),
  record("PROP-COST-RECOVERY", "proposition", "由成本函数恢复单产出技术", "L05-M13", "L05 PPT 第27页第4项", {
    aliases: ["cost recovery", "由成本恢复技术"],
    object: "用所有投入价格下的成本下界刻画达到产量 q 的投入集合。",
    scope: "单产出技术；达到集合具有源页要求的凸性/闭性；所有严格正投入价格。",
    clauses: [
      { id: "CR-1", text: "固定 q，成本对投入价格一次齐次且凹。", tex: "c(\\alpha w,q)=\\alpha c(w,q),\\qquad c(\\cdot,q)\\text{ is concave}" },
      { id: "CR-2", text: "固定 w，产量要求提高不会降低最低成本。", tex: "q'\\ge q\\Longrightarrow c(w,q')\\ge c(w,q)" },
      { id: "CR-3", text: "条件要素需求对投入价格零次齐次；达到集合凸时解集凸值。", tex: "z(\\alpha w,q)=z(w,q),\\qquad z(w,q)\\text{ is convex-valued}" },
      { id: "CR-4", text: "达到集合严格凸时，条件要素需求要么是单元素集合，要么为空。", tex: "z(w,q)\\text{ is either a singleton or the empty set under strict convexity}" },
      { id: "CR-5", text: "若达到 q 的投入集合凸，则可由所有价格下的成本不等式恢复。", tex: "Y=\\{(-z,q):w\\cdot z\\ge c(w,q)\\ \\text{for all }w\\gg0\\}" }
    ],
    boundary: "这是带技术条件的恢复命题，不是成本函数定义本身。"
  })
];

export const definitionById = new Map(definitionRecords.map(item => [item.id, item]));
