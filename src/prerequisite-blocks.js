const practice = (id, title, purpose, prompt, hints, answer) => ({
  id, type: "practice", title, purpose, prompt, hints, answer, label: "前置理解检查 · 教学自编"
});

export const prerequisiteBlocks = {
  "L03-M01": [
    {
      id: "bridge-demand-to-optimization", type: "explanation", placement: "prerequisite", label: "章节桥梁", title: "第二讲描述了需求限制；现在解释它们从哪里来",
      paragraphs: ["第二讲先把需求的齐次性、加总式和 WARP 当作可观察限制。第三讲回到偏好、效用与两类最优化，逐步说明哪些偏好条件保证解存在、唯一，以及这些需求性质为何成立。"]
    }
  ],
  "L04-M01": [
    {
      id: "bridge-optimization-to-duality", type: "explanation", placement: "prerequisite", label: "章节桥梁", title: "已有两类最优化；现在研究它们怎样互相恢复",
      paragraphs: ["第三讲已经得到普通需求、Hicks 需求、间接效用和支出函数。第四讲固定这些对象，研究包络导数、Slutsky 方程、Roy 恒等式以及价格变化的货币福利度量。"]
    },
    {
      id: "star-gradient-multiplier", type: "explanation", placement: "prerequisite", label: "符号拆读 · 一阶条件", title: "x*、∇u(x*) 和 λ 是三种不同对象",
      paragraphs: [
        "x* 读作 x 星，表示已经选出的最优商品束；星号在这里是最优解标签，不是乘法。u(x*) 是这个束的效用数值。",
        "∇u(x*) 读作 u 在 x* 处的梯度，是把各商品边际效用排成的向量；它与价格向量 p 维度相同。λ 是拉格朗日乘子，是一个标量，用来把梯度按比例与价格比较，不是新的商品或商品束。"
      ],
      math: [{ tex: "x^*\\in\\mathbb{R}_+^L,\\qquad \\nabla u(x^*)=\\left(\\frac{\\partial u}{\\partial x_1},\\ldots,\\frac{\\partial u}{\\partial x_L}\\right)_{x=x^*},\\qquad \\lambda\\in\\mathbb{R}_+" }]
    }
  ],
  "L01-M12": [
    {
      id: "open-interval-density", type: "explanation", placement: "prerequisite", label: "数学补充 · 构造工具", title: "开区间和有理数稠密：为什么每个效用缝隙里都能选一个有理数",
      paragraphs: [
        "开区间 (A,B) 是所有满足 A<r<B 的实数 r；端点 A、B 不包含在内。证明里 A=u(t,b)、B=u(t,a)，严格偏好保证 A<B，所以区间确实非空。",
        "有理数稠密的当前用法只有一句：任意两个不同实数 A<B 之间，至少存在一个有理数 r。我们把它当作本题使用的数学工具，不在这里证明整个实数理论。构造 r(t) 的目的，是给每个第一坐标 t 贴一个可计数的‘标签’。"
      ],
      math: ["u(t,b)<r(t)<u(t,a)，且 r(t)∈ℚ"]
    },
    {
      id: "countable-injection", type: "explanation", placement: "prerequisite", label: "数学补充 · 计数矛盾", title: "可数、不可数和单射分别在证明中做什么",
      paragraphs: [
        "集合可数，意思是它的元素能够排成有限表或自然数编号的序列；ℚ 可数。ℝ₊ 不可数，意思是任何自然数编号都无法列完。",
        "单射要求不同输入得到不同输出。区间互不重叠保证 s≠t 时 r(s)≠r(t)，于是 r 把 ℝ₊ 的每个元素塞进 ℚ 的不同位置。不可数集合不可能单射进可数集合，这才产生矛盾。只说‘每个区间有有理数’还不够，因为不同区间若重叠，可能选到同一个数。"
      ]
    },
    practice("P-PREQ-L01-LEX", "按目的复述字典序证明的三次构造", "不背结论，说明固定 a>b、选 r(t)、证明区间不交各自为下一步提供什么。", "请依次回答：为什么固定 a>b？为什么在每个区间选有理数？为什么必须证明不同 t 的区间不交？", ["固定 a>b 先制造什么严格偏好？", "最后的矛盾需要一张什么性质的映射？"], ["固定 a>b 让同一第一坐标 t 下有 (t,a)≻(t,b)，制造非空效用区间。", "选有理数把每个区间转换为 ℚ 中的标签。证明区间不交则保证标签不同，从而得到 ℝ₊→ℚ 的单射并与可数性矛盾。"])
  ],
  "L01-M14": [
    {
      id: "choice-situation-input", type: "example", placement: "prerequisite", label: "教学自编 · 先有具体选择情境", title: "B 先表示‘这一次有哪些方案可以选’",
      paragraphs: [
        "先不写选择规则。设 x 是米饭套餐，y 是面条套餐；今天窗口只供应这两种套餐。把‘今天可以选择的方案’收进集合 B={x,y}。",
        "B 是这一次的可选集合，不是一笔钱，也不是已经选中的结果。第一讲 PPT 把抽象可选集合称为 budget set；到第二讲才把它具体化为由价格和财富决定的预算集。"
      ],
      math: [{ tex: "B=\\{x,y\\}" }]
    },
    {
      id: "choice-rule-output", type: "explanation", placement: "prerequisite", label: "教学自编 · 从输入走到结果", title: "C 是整条规则；C(B) 是规则面对 B 时给出的结果集合",
      paragraphs: [
        "C 用来记录：面对每一个给定的可选集合，哪些方案被列为可接受选择。把 B 放进规则的输入位置，写成 C(B)，读作‘C 作用在 B 上’或‘面对 B 时的选择结果’；圆括号不是乘法。",
        "例如规则面对 B={x,y} 时只接受 x，就写 C(B)={x}。B 是输入集合，C 是整条规则，C(B) 是这一次的结果集合。即使结果只有一个方案，也要写成单元素集合 {x}，不能把集合 C(B) 与元素 x 混成同一对象。",
        "只知道 B={x,y} 不能算出 C(B)。还需要题目给出的选择规则或观察记录；另一条规则完全可以在同一个 B 上给出 {y} 或 {x,y}。PPT 第14页用 C₁、C₂ 区分两条规则；临时写 C 只是省略区分规则的下标。"
      ],
      math: [{ tex: "C:B\\longmapsto C(B),\\qquad B=\\{x,y\\},\\qquad C(B)=\\{x\\}" }]
    },
    {
      id: "choice-four-statements", type: "explanation", placement: "prerequisite", label: "符号拆读", title: "四个相似式子分别说‘可选’、‘被选’、‘唯一结果’和‘结果合法’",
      paragraphs: [
        "x∈B 只说明 x 在这次可选集合中；x∈C(B) 才说明 x 被列入可接受结果，但不排除还有其他结果。C(B)={x} 使用集合等号，说明结果集合恰好只有 x。",
        "∅≠C(B)⊆B 同时规定两件事：结果不能为空；结果中的每个元素都来自 B。成员符号 ∈ 比较一个元素与集合，子集符号 ⊆ 比较两个集合。"
      ],
      math: [
        { tex: "x\\in B\\quad\\text{（x 可选）}" },
        { tex: "x\\in C(B)\\quad\\text{（x 被列入结果）}" },
        { tex: "C(B)=\\{x\\}\\quad\\text{（结果恰好只有 x）}" },
        { tex: "\\varnothing\\ne C(B)\\subseteq B" }
      ]
    },
    { ...practice("P-PREQ-L01-CHOICE", "可选与被选不是同一件事", "区分 B 的成员和 C(B) 的成员。", "给定 B={x,y,z}、C(B)={x,z}。判断：①y∈B；②y∈C(B)；③z∈C(B)；④C(B)⊆B。", ["先分别列出 B 和 C(B) 的成员。", "子集判断要检查结果中的每个成员是否来自 B。"], ["①成立：y 可选。②不成立：y 没有列入结果。③成立：z 既可选也被列入结果。④成立：x、z 都来自 B。这里只检查一份局部选择记录，暂不讨论 WARP。"]), placement: "prerequisite" },
    { ...practice("P-PREQ-L01-CHOICE-MEMBER", "含有 x 不等于结果只有 x", "区分成员关系和集合等号。", "已知 x∈C(B)，能否断言 C(B)={x}？", ["成员关系只保证集合里有 x。", "试写一个还含 y 的结果集合。"], ["不能。例如 C(B)={x,y} 也满足 x∈C(B)。x∈C(B) 只说结果包含 x；C(B)={x} 才说结果恰好只有 x。"]), placement: "prerequisite" },
    { ...practice("P-PREQ-L01-CHOICE-RULE", "可选集合不会自己算出选择结果", "确认 C 才是缺少的信息。", "只知道 B={x,y}，能否推出 C(B)={x}？", ["定义只要求 C(B) 是 B 的非空子集。"], ["不能。可能的结果至少有 {x}、{y}、{x,y}；必须再知道规则 C 或实际选择记录，才能确定是哪一个。"]), placement: "prerequisite" },
    {
      id: "choice-correspondence-name", type: "explanation", placement: "prerequisite", label: "正式技术名称", title: "结果可以有多个，所以 C 是集合值的选择对应",
      paragraphs: [
        "若 C(B)={x,y}，意思是 x、y 都属于可接受结果；它不要求一次同时消费两份套餐，也不能在尚未连接偏好前就断言 x∼y。",
        "因为同一个输入 B 可以对应一个含多个元素的结果集合，课程称 C 为选择对应。也可以把它理解成给每个 B 指定一个集合的集合值映射；不是说它在任何意义下都不能叫函数。"
      ]
    },
    { id: "definition-choice-structure", type: "definition", placement: "prerequisite", definitionId: "DEF-CS" }
  ],
  "L01-M15": [
    {
      id: "warp-object-reminder", type: "explanation", placement: "prerequisite", label: "对象提醒 · 正式定义前", title: "先把 WARP 页里的 B、B′、C(B)、C(B′) 各自放回对象层级",
      paragraphs: [
        "B 与 B′（读作 B 撇）是两种可选集合；撇号这里只是给另一个集合做标记，不是求导，也不表示 B′ 一定比 B 更大或更晚。两个集合不必互相包含。",
        "C 是同一条选择规则。输入从 B 换成 B′ 时，规则没有换；C(B)、C(B′) 是同一规则面对两份输入得到的两份结果集合。网站使用集合族 𝓑，对应 PPT 第13页的 β；𝓑 的成员是 B 这样的可选集合，不是套餐 x。",
        "B∩B′ 是两个集合共同包含的方案。调用 WARP 时，x、y 必须同时属于 B 与 B′；然后再检查 x∈C(B)、y∈C(B′) 这些选择结果条件。检查可以交换对象和预算角色，与叙述先后无关。"
      ],
      math: [{ tex: "\\begin{gathered}B,B'\\in\\mathcal{B},\\qquad x,y\\in B\\cap B',\\\\x\\in C(B),\\qquad y\\in C(B')\\\\\\Longrightarrow x\\in C(B')\\end{gathered}" }]
    },
    { id: "definition-warp", type: "definition", placement: "prerequisite", definitionId: "DEF-WARP" }
  ],
  "L01-M16": [
    { id: "definition-revealed-preference", type: "definition", placement: "prerequisite", definitionId: "DEF-REVEALED" },
    {
      id: "quantifier-order", type: "explanation", placement: "prerequisite", label: "逻辑补充 · WARP", title: "‘存在一个预算’与‘任意另一个预算’的次序不能调换",
      paragraphs: [
        "揭示 x⪰*y 只需存在一个 B，使 x、y 同在 B 且 x 被选。WARP 接着说：对任何另一个同含 x、y 且选择 y 的 B′，都必须同时选择 x。",
        "存在量词给出一份证据；任意量词要求所有符合条件的 B′ 都通过检查。证明等价表述时交换 x/y 和 B/B′，是在同一个全称规则中再次调用 WARP，不是把一个观察擅自推广为所有预算。"
      ],
      math: ["∃B∈ℬ：[x,y∈B 且 x∈C(B)]", "∀B′∈ℬ：[x,y∈B′ 且 y∈C(B′)]⇒x∈C(B′)"]
    }
  ],
  "L01-M17": [
    { id: "definition-generated-choice", type: "definition", placement: "prerequisite", definitionId: "DEF-CSTAR" }
  ],
  "L01-M19": [
    { id: "definition-rationalization", type: "definition", placement: "prerequisite", definitionId: "DEF-RATIONALIZE" },
    { id: "recall-rationalization-inputs", type: "definitionRecall", placement: "prerequisite", definitionIds: ["DEF-CS", "DEF-WARP", "DEF-REVEALED"] },
    {
      id: "set-equality-containment", type: "explanation", placement: "prerequisite", label: "证明动作补充", title: "证明两个选择集合相等，为什么必须做两个包含方向",
      paragraphs: [
        "要证明 C(B)=C*(B,⪰*)，不能只说明原选择里的元素也是最大元。集合相等需要 C(B)⊆C* 和 C*⊆C。",
        "每个包含方向都从左侧集合任取一个元素，展开它进入左侧的条件，再用定义/WARP 推到右侧的进入条件。两个方向的论证目的不同，不能用‘同理’遮掉反向中真正使用的 WARP。"
      ]
    }
  ],
  "L01-M20": [
    { id: "recall-rationalization-proof", type: "definitionRecall", placement: "prerequisite", definitionIds: ["DEF-RATIONALIZE", "DEF-CS", "DEF-WARP"] }
  ],
  "L02-M01": [
    {
      id: "vector-dot-product", type: "example", placement: "prerequisite", label: "数学补充 · 两商品先算", title: "向量、分量和点积先落到一张购物单",
      paragraphs: [
        "x=(x₁,x₂) 是一个商品束，x₁、x₂ 是两个分量；p=(p₁,p₂) 是价格向量。点积 p·x=p₁x₁+p₂x₂ 把每种商品的价格×数量相加，得到总支出这个数。",
        "例如 p=(3,2)、x=(2,1)，总支出是3×2+2×1=8。推广到 L 种商品只是把两项加法扩成 Σpℓxℓ，经济含义没有改变。"
      ],
      math: ["p·x=p₁x₁+p₂x₂（两商品）", "p·x=Σₗpₗxₗ（L 商品）"]
    },
    {
      id: "hyperplane-normal", type: "explanation", placement: "prerequisite", label: "几何补充", title: "预算超平面和法向量：当前只需要知道什么",
      paragraphs: [
        "p·x=w 收集所有恰好花完财富的商品束。在二维它是一条直线；在三维是一个平面；更高维统一叫超平面。‘超’不是更神秘，只是维数变化后的统一名称。",
        "沿预算面内移动 dx 必须保持 p·dx=0，所以 p 与面内每个可行小移动都正交；这就是 p 是法向量。两商品直线斜率 -p₁/p₂ 来自 p₁dx₁+p₂dx₂=0。"
      ],
      math: ["p·dx=0 ⇒ dx₂/dx₁=−p₁/p₂"]
    },
    practice("P-PREQ-L02-BUDGET", "从具体支出读回预算几何", "把点积、截距、斜率和同比缩放接成同一个对象。", "p=(3,2)、w=12。求两个轴截距、预算线斜率；再说明把 p、w 都乘2为什么不改变预算集。", ["令另一个商品数量为0求截距。", "比较 6x₁+4x₂≤24 与原不等式。"], ["截距为(4,0)、(0,6)，斜率-3/2。同比缩放后约束两边可同时除以2，得到完全相同的3x₁+2x₂≤12。"])
  ],
  "L02-M02": [
    {
      id: "demand-correspondence-symbol", type: "explanation", placement: "prerequisite", label: "符号拆读 · 需求对应", title: "x 是整条需求规则；x(p,w) 是给定价格财富后的选择结果",
      paragraphs: [
        "输入 (p,w) 由价格向量 p 和财富数 w 组成。需求对应 x 把每个这样的输入送到预算内被选择的商品束集合；圆括号表示代入输入，不是 x 乘 p、w。",
        "如果某个输入下只有一个最优束，常把 x(p,w) 同时写成那个束；若有多个最优束，它就是含多个商品束的集合。写‘取 x∈x(p,w)’时，左边 x 是一个具体束，右边 x(p,w) 是结果集合，要靠上下文区分。"
      ],
      math: [{ tex: "(p,w)\\longmapsto x(p,w)\\subseteq B_{p,w}" }]
    }
  ],
  "L02-M07": [
    {
      id: "prime-second-observation", type: "explanation", placement: "prerequisite", label: "符号拆读 · 撇号", title: "p′、w′、x′ 是第二组观察，不是导数",
      paragraphs: [
        "本页比较两个价格—财富情形：(p,w) 与 (p′,w′)。撇号读作‘撇’，只是给第二组对象做标签；x′=x(p′,w′) 是第二组输入对应的需求束。",
        "真正的导数会写成 ∂x/∂p 或 f′(q)，不能看到撇号就一律读成求导。两组预算也没有默认的时间或包含顺序，WARP 要根据交叉可负担条件判断。"
      ],
      math: [{ tex: "x=x(p,w),\\qquad x'=x(p',w')" }]
    }
  ],
  "L02-M03": [
    { id: "assumption-smooth-demand", type: "definition", placement: "prerequisite", definitionId: "ASSUMP-L02-SMOOTH-DEMAND" },
    {
      id: "parameter-partial", type: "explanation", placement: "prerequisite", label: "微积分补充", title: "变量、参数和偏导：一次只让一个输入动",
      paragraphs: [
        "需求分量 xℓ(p,w) 的输入是所有价格和财富。计算 ∂xℓ/∂pk 时，只让第 k 个价格做一个很小变化，其余价格和 w 暂时固定；计算 ∂xℓ/∂w 时则只让财富动。偏导符号记录这种‘一次只动一个输入’的局部变化率。",
        "Euler 公式当前不是凭空出现的定理名。零次齐次说沿 (p,w) 同比缩放方向需求不变；可微时，这个方向上的总变化率必须为0，于是所有偏导乘各自初始水平后相加为0。"
      ],
      math: ["Σₖ(∂xₗ/∂pₖ)pₖ+(∂xₗ/∂w)w=0"]
    },
    practice("P-PREQ-L02-PARTIAL", "读懂一个偏导而不是只算符号", "确认固定对象和变化对象。", "用一句话分别解释 ∂x₂/∂p₁ 与 ∂x₂/∂w；哪一个能直接判断商品2是否劣等？", ["先说谁是输出，再说只改变哪个输入。"], ["∂x₂/∂p₁ 是固定其余价格与财富时，商品1价格对商品2需求的局部影响；∂x₂/∂w 是固定价格时财富对商品2需求的影响。后者为负才说明商品2在该点是劣等品。"])
  ],
  "L02-M05": [
    {
      id: "elasticity-definition", type: "explanation", placement: "prerequisite", label: "微积分补充 · 第14页弹性定义", title: "弹性把‘单位变化率’换成‘百分比对百分比’",
      paragraphs: [
        "偏导数的单位取决于商品和价格的计量单位。弹性把局部导数乘输入水平、再除以当前需求量，从而近似回答：输入变化1%，需求变化百分之几。",
        "价格弹性记为 εℓk=(∂xℓ/∂pk)(pk/xℓ)，财富弹性记为 εℓw=(∂xℓ/∂w)(w/xℓ)。普通比例形式要求当前 xℓ>0；若 xℓ=0，不能直接除以0，应回到导数或使用另行定义。弹性是点上的局部量，不自动描述有限大变化。"
      ],
      math: [
        { tex: "\\varepsilon_{\\ell k}=\\frac{\\partial x_\\ell}{\\partial p_k}\\frac{p_k}{x_\\ell},\\qquad x_\\ell>0" },
        { tex: "\\varepsilon_{\\ell w}=\\frac{\\partial x_\\ell}{\\partial w}\\frac{w}{x_\\ell},\\qquad x_\\ell>0" }
      ]
    }
  ],
  "L02-M06": [
    {
      id: "product-rule-budget", type: "explanation", placement: "prerequisite", label: "微积分补充 · 乘积法则", title: "对预算恒等式求价格偏导，为什么会多出 xₖ",
      paragraphs: [
        "Walras 等式是 Σpℓxℓ(p,w)=w。对 pk 求偏导时，每一项都是‘价格×会随价格变化的需求’。乘积法则要求分别求两个因子的变化。",
        "当 ℓ≠k，pℓ 对 pk 的导数为0；当 ℓ=k，pk 对自己导数为1，于是那一项额外留下 xk。右侧财富固定，导数为0。"
      ],
      math: ["∂[pₗxₗ]/∂pₖ=(∂pₗ/∂pₖ)xₗ+pₗ(∂xₗ/∂pₖ)", "Σₗpₗ(∂xₗ/∂pₖ)+xₖ=0"]
    }
  ],
  "L02-M10": [
    {
      id: "alpha-construction", type: "explanation", placement: "prerequisite", label: "证明构造补充", title: "为什么要构造中间价格 p̄=αp′+(1−α)p″",
      paragraphs: [
        "反设两个不同选择束在彼此预算中都严格可负担，会得到同一个差向量 d=x″−x′ 在 p′、p″ 下的点积一负一正。",
        "记 A=p′·d<0、B=p″·d>0，直接取 α=B/(B−A)∈(0,1)。把两个价格按这个 α 加权，p̄·d=αA+(1−α)B=0；因此 p̄·x′=p̄·x″，两个旧束落在同一条中间预算线上。",
        "令 x̄ 是中间预算的需求。加权原预算余量等于 (1−α)B>0，所以至少一个原预算严格买得起 x̄。严格余量也排除了 x̄ 等于对应原需求；于是形成真正的双向可负担冲突，而不是只说‘构造了中间价格’。"
      ],
      math: [
        { tex: "A=p'\\cdot d<0,\\qquad B=p''\\cdot d>0,\\qquad \\alpha=\\frac{B}{B-A}\\in(0,1)" },
        { tex: "\\bar p=\\alpha p'+(1-\\alpha)p'',\\qquad \\bar p\\cdot d=0" },
        { tex: "\\alpha(w'-p'\\cdot\\bar x)+(1-\\alpha)(w''-p''\\cdot\\bar x)=(1-\\alpha)B>0" }
      ]
    }
  ],
  "L02-M11": [
    {
      id: "total-differential", type: "explanation", placement: "prerequisite", label: "矩阵微积分补充", title: "全微分：把所有小输入变化的一阶影响加起来",
      paragraphs: [
        "x 是 L×1 需求列向量。价格小变化 dp 是 L×1，财富小变化 dw 是标量。Dpx 是 L×L，每一列记录一个价格变化对全部需求的影响；Dwx 是 L×1。",
        "所以 dx=Dpx·dp+Dwx·dw 的两项都是 L×1，才能相加。Slutsky 补偿给 dw=xᵀdp，是1×L乘L×1得到的标量。"
      ],
      math: ["dx=Dₚx·dp+Dwx·dw", "dw=xᵀdp"]
    },
    {
      id: "outer-product", type: "explanation", placement: "prerequisite", label: "矩阵维度补充", title: "外积为什么产生 L×L 的财富修正矩阵",
      paragraphs: [
        "Dwx 是 L×1 列向量，xᵀ 是1×L行向量；按矩阵乘法，外积 Dwx·xᵀ 是 L×L。第(ℓ,k)项正是 (∂xℓ/∂w)xk。",
        "把它乘 dp 后，第 k 个价格变化先决定需要补偿 xk·dpk 的财富，再由每个商品的财富效应分配到需求变化。"
      ],
      math: ["(Dwx·xᵀ)ₗₖ=(∂xₗ/∂w)xₖ"]
    }
  ],
  "L02-M12": [
    {
      id: "quadratic-form-nsd", type: "explanation", placement: "prerequisite", label: "线性代数补充", title: "二次型和负半定：检查所有价格变化方向",
      paragraphs: [
        "给定一个价格变化方向 v，Sv 是补偿需求的一阶变化，vᵀSv 是价格变化与需求变化的点积，是一个数。矩阵 S 负半定，意思是对每个方向 v 都有 vᵀSv≤0。",
        "它不是说 S 的每个元素都≤0；交叉项可以为正。取只有第ℓ位为1的方向 eℓ，才得到 eℓᵀSeℓ=sℓℓ≤0。零矩阵负半定但不负定，因为非零方向的二次型仍可能等于0。"
      ],
      math: ["S 负半定 ⇔ ∀v，vᵀSv≤0", "eₗᵀSeₗ=sₗₗ≤0"]
    },
    practice("P-PREQ-L02-NSD", "负半定不等于每项为负", "把矩阵性质翻译成方向上的标量检查。", "矩阵 S 的某个交叉项 s₁₂>0，能否立刻断言 S 不是负半定？若要检查自身项 s₂₂，应选什么方向？", ["负半定检查 vᵀSv，不是逐元素检查。"], ["不能由一个正交叉项直接否定负半定。检查 s₂₂ 可取 v=e₂=(0,1,0,…)，此时 vᵀSv=s₂₂。"])
  ],
  "L03-M02": [
    {
      id: "norm-neighborhood", type: "example", placement: "prerequisite", label: "数学补充 · 局部非饱和前置", title: "距离、范数和 ε 邻域：‘任意近’到底怎样检查",
      paragraphs: [
        "在二维里，两束 x=(x₁,x₂)、y=(y₁,y₂) 的欧氏距离是 ‖y−x‖=√[(y₁−x₁)²+(y₂−x₂)²]。范数 ‖·‖ 在这里就是把差向量变成一个非负距离数。",
        "以 x 为中心、半径 ε 的邻域包含所有距离小于或等于 ε 的可行束。局部非饱和要求对每个 ε>0 都能找到邻域内更好束；ε 可以很小，因此‘远处存在更好束’不够。还要检查找到的 y 属于消费集 X，尤其在坐标轴边界不能走到负消费。"
      ],
      math: ["‖y−x‖=√Σₗ(yₗ−xₗ)²", "B(x,ε)∩X={y∈X:‖y−x‖≤ε}"]
    },
    practice("P-PREQ-L03-NEIGHBOR", "在边界点构造一个可行的邻近改善", "同时检查距离、消费集可行性和偏好改善。", "X=ℝ²₊、u=x₁+x₂，当前 x=(0,2)，给定 ε=0.1。构造一个 y，使 y∈X、‖y−x‖≤ε 且 y≻x。", ["只增加一个坐标不到0.1即可；不要把第一坐标减成负数。"], ["可取 y=(0.05,2)。它非负，距离0.05≤0.1，效用从2升到2.05，所以 y≻x。"])
  ],
  "L03-M03": [
    {
      id: "convex-combination-quasiconcave", type: "explanation", placement: "prerequisite", label: "数学补充 · 凸偏好前置", title: "凸组合是两点之间的加权平均；拟凹检查上轮廓而不是函数图像弯曲",
      paragraphs: [
        "αy+(1−α)z（0≤α≤1）是 y、z 的加权平均。α=1得到 y，α=0得到 z，中间 α 给两点连线上的束。消费集需要容纳这个组合，才能谈这段线是否可行。",
        "u 拟凹的定义是 u[αy+(1−α)z]≥min{u(y),u(z)}。它保证两端都至少达到某水平时，中间不会跌破该水平；这正对应上轮廓集凸。拟凹不是要求 u 的二阶导数处处为负，也不是说下轮廓集凸。"
      ],
      math: ["αy+(1−α)z，0≤α≤1", "u[αy+(1−α)z]≥min{u(y),u(z)}"]
    }
  ],
  "L03-M05": [
    { id: "definition-homothetic", type: "definition", placement: "prerequisite", definitionId: "DEF-HOMOTHETIC" },
    { id: "definition-quasilinear", type: "definition", placement: "prerequisite", definitionId: "DEF-QUASILINEAR" }
  ],
  "L03-M06": [
    {
      id: "sequence-limit-closed", type: "explanation", placement: "prerequisite", label: "数学补充 · 连续偏好前置", title: "序列、极限和闭集：把越来越接近的比较带到终点",
      paragraphs: [
        "序列 x¹,x²,… 是按自然数编号的一串商品束。xⁿ→x 表示 n 足够大时，xⁿ 可以任意接近 x。偏好连续要求：若每一步都有 xⁿ⪰yⁿ，极限也保留 x⪰y。",
        "集合闭，当前只需这样用：集合内一列点若收敛到环境空间 X 中的 x，则 x 仍在该集合。必须说明环境空间；例如 [0,1) 在 ℝ 中不闭，因为内部序列可趋于1，而1不在集合。上、下轮廓集闭正是避免偏好在极限处突然翻转。"
      ]
    },
    practice("P-PREQ-L03-CLOSED", "找出字典序连续性失败的极限一步", "把每个 n 的比较与极限比较分开。", "令 xⁿ=(1/n,0)、yⁿ=(0,1)。字典序下每个 n 谁更好？极限 x、y 是什么，哪条弱比较失效？", ["每个 n 的第一坐标 1/n>0；极限时第一坐标都为0。"], ["每个 n 有 xⁿ≻yⁿ。极限是 x=(0,0)、y=(0,1)，此时 y≻x，所以极限不再有 x⪰y；偏好比较没有在极限中保留。"])
  ],
  "L03-M08": [
    {
      id: "compact-weierstrass", type: "explanation", placement: "prerequisite", label: "数学工具 · 当前作存在性使用", title: "紧集和最大值定理：不是一句‘连续所以有最大值’",
      paragraphs: [
        "在有限维欧氏空间里，本课可以把‘紧’理解为闭且有界。预算集闭：若可负担束收敛，点积连续使极限仍满足 p·x≤w；预算集有界：p≫0 时每个 xℓ≤w/pℓ。",
        "Weierstrass 最大值定理说：连续实值函数在非空紧集上能取到最大值。这里分别对应连续效用、非空紧预算集和‘最大值由某个可行束达到’。缺少正价格时预算可能无界；只有连续但定义域不紧时，最大值也可能只无限接近而不取得。"
      ],
      math: ["p≫0 ⇒ 0≤xₗ≤w/pₗ", "连续 u + 非空紧 Bₚ,ᵥ ⇒ ∃x*∈Bₚ,ᵥ 取得 max u"]
    }
  ],
  "L03-M10": [
    { id: "assumption-ump-kkt", type: "definition", placement: "prerequisite", definitionId: "ASSUMP-UMP-KKT" },
    { id: "definition-mrs", type: "definition", placement: "prerequisite", definitionId: "DEF-MRS" },
    {
      id: "kkt-objects", type: "explanation", placement: "prerequisite", label: "优化补充 · KKT 首次使用", title: "目标、约束、乘子和互补松弛各自是什么",
      paragraphs: [
        "UMP 的选择变量是 x；价格 p、财富 w 是给定参数；目标是让 u(x) 最大；预算和 x≥0 是约束。拉格朗日乘子 λ 衡量把预算右侧放宽一点对最优值的一阶影响，不是新商品或新选择变量。",
        "条件 ∂u/∂xℓ≤λpℓ 说每元钱的边际效用不能超过共同影子价值；互补式 xℓ[∂u/∂xℓ−λpℓ]=0 说：若 xℓ>0，括号必须为0；若括号严格小于0，最优量只能在角点 xℓ=0。"
      ],
      math: ["∂u/∂xₗ≤λpₗ", "xₗ[∂u/∂xₗ−λpₗ]=0"]
    },
    practice("P-PREQ-L03-KKT", "读一个角点条件", "不把内点等式无条件套到零消费商品。", "已知商品1最优消费 x₁*=0，商品2为正。KKT 对商品1允许 ∂u/∂x₁ 与 λp₁ 是等号还是不等式？为什么不能要求 MRS₁₂=p₁/p₂？", ["x₁*=0 时互补乘积自动为0。"], ["允许 ∂u/∂x₁≤λp₁，不必取等。因为减少商品1的方向在0处不可行，内点两向交换逻辑失效，所以 MRS 与价格比可以是单边不等式。"])
  ],
  "L03-M13": [
    {
      id: "value-versus-optimizer", type: "explanation", placement: "prerequisite", label: "符号拆读 · 最优值与最优解", title: "v(p,w) 是一个效用数值；x(p,w) 是达到它的商品束",
      paragraphs: [
        "同一个 UMP 同时产生两类输出：x(p,w) 回答‘选哪些商品束’，v(p,w) 回答‘最优效用是多少’。前者是解集合/商品束，后者是实数，不能相加或互换。",
        "max 后面写的是目标函数 u(x)；v 是把最优值随参数 (p,w) 的变化记录成一个函数。若最优束多值，v 仍然可以是唯一的数。"
      ],
      math: [{ tex: "v(p,w)=\\max_{x\\in B_{p,w}}u(x),\\qquad x(p,w)=\\operatorname*{argmax}_{x\\in B_{p,w}}u(x)" }]
    }
  ],
  "L03-M15": [
    {
      id: "hicks-expenditure-symbols", type: "explanation", placement: "prerequisite", label: "符号拆读 · EMP 输入输出", title: "ū 是给定目标；h(p,ū) 是最省钱的束，e(p,ū) 是最低支出数值",
      paragraphs: [
        "ū 读作 u bar（u 上横线），这里是外部给定的目标效用，不是平均效用。价格 p 与目标 ū 是 EMP 的输入。",
        "h(p,ū) 是达到目标的最低成本商品束集合；e(p,ū) 是相应最低支出这个数。argmin 返回最小化者，min 返回最小值。h 可以多值，而所有最小化者给出的 e 相同。"
      ],
      math: [{ tex: "h(p,\\bar u)=\\operatorname*{argmin}_{x\\ge0,\\ u(x)\\ge\\bar u}p\\cdot x,\\qquad e(p,\\bar u)=\\min_{x\\ge0,\\ u(x)\\ge\\bar u}p\\cdot x" }]
    }
  ],
  "L03-M16": [
    {
      id: "strict-slack-perturbation", type: "explanation", label: "证明动作补充", title: "‘更便宜’为什么要升级成‘仍可负担且更好’",
      paragraphs: [
        "反设有 x′ 达到目标效用且 p·x′<p·x*≤w。严格小于号提供正预算余量 δ=w−p·x′>0。只要扰动足够小，新增支出仍小于 δ，所以邻近束仍可负担。",
        "局部非饱和再保证任意小邻域内存在 x″≻x′。于是 x″ 同时可负担且效用高于 x*，才真正与 UMP 最优性冲突。若只有 p·x′≤w 没有严格余量，邻近改善可能马上越过预算，证明不能跳过这一步。"
      ]
    }
  ],
  "L03-M17": [
    {
      id: "scaling-purpose", type: "explanation", label: "证明动作补充", title: "按比例缩小 αx′ 的构造目的",
      paragraphs: [
        "若 x′ 在财富 w 下可负担且效用严格高于 x*，直接用 x′ 只能说明 UMP 更优束存在；为了反驳 EMP，还要制造‘达到目标却比 x* 更便宜’。",
        "取 α<1 会把支出严格缩小为 αp·x′。连续性保证 α 足够接近1时效用仍高于目标。这个构造不需要 x′ 与 x* 逐坐标可比；真正用到的是消费集沿原点缩放可行、效用连续和严格效用余量。"
      ],
      math: ["p·(αx′)=αp·x′<p·x′≤p·x*，α<1"]
    }
  ],
  "L03-M18": [
    { id: "properties-hicks-demand", type: "definition", placement: "development", definitionId: "PROP-HICKS-PROPERTIES" },
    { id: "properties-expenditure", type: "definition", placement: "development", definitionId: "PROP-EXPENDITURE-PROPERTIES" }
  ],
  "L04-M02": [
    {
      id: "envelope-current-use", type: "explanation", placement: "prerequisite", label: "数学工具 · 包络定理", title: "为什么对最优值求参数导数时，不必把最优选择的每条变化都展开",
      paragraphs: [
        "e(p,u) 是在给定 p、u 下已经最小化后的支出。价格变化会直接改变 p·x，也会间接使最优束 h(p,u) 改变。包络定理说，在满足可微、最优性和约束正则条件时，间接项在一阶上由最优条件抵消，只留下目标/约束对参数的直接影响。",
        "当前对 pk 求导，目标 p·x 的直接偏导是 xk；效用约束 u(x)≥ū 不直接含 p，所以参数偏导为0。因此 ∂e/∂pk=hk。包络定理不是‘把 h 当常数’，而是解释为什么 h 的导数项在最优点无需单独计算。"
      ],
      math: ["∂e(p,u)/∂pₖ=hₖ(p,u)"]
    },
    practice("P-PREQ-L04-ENVELOPE", "分清直接效应与最优选择的间接变化", "理解 Shephard 引理来自包络，而非粗暴忽略 h 的变化。", "价格 pk 小幅增加时，最低支出为什么一阶增加约 hk·dpk？这句话固定了什么？", ["EMP 固定的是目标效用 u。"], ["在固定效用 u 下，当前最省钱束使用 hk 单位商品 k；价格每单位增加 dpk，直接支出增加 hk·dpk。最优束会调整，但包络定理说明其一阶间接项由最优条件抵消。"])
  ],
  "L04-M03": [
    {
      id: "hessian-mixed-partials", type: "explanation", placement: "prerequisite", label: "微积分补充 · Hessian", title: "Hessian 是二阶偏导矩阵；对称性需要光滑条件",
      paragraphs: [
        "∇pe=h 是一阶价格导数组成的列向量。再对价格求导，Dph=D²pe；第(ℓ,k)项是 ∂²e/(∂pℓ∂pk)=∂hℓ/∂pk。",
        "上标 T 读作转置：它把列向量变为行向量；写 (Dph)ᵀ=Dph 表示矩阵沿主对角线翻转后不变，即第(ℓ,k)项等于第(k,ℓ)项。",
        "若 e 在该区域二阶连续可微，混合偏导可以交换，所以 ∂hℓ/∂pk=∂hk/∂pℓ，矩阵对称。e 对 p 凹意味着任一价格方向 v 上的二阶变化 vᵀD²pev≤0，因此 Hessian 负半定。非光滑价格点不能无条件写普通 Hessian。"
      ]
    }
  ],
  "L04-M05": [
    {
      id: "chain-rule-composite", type: "explanation", placement: "prerequisite", label: "微积分补充 · 复合函数链式法则", title: "h(p,u)=x[p,e(p,u)] 中 pk 从两条路径影响需求",
      paragraphs: [
        "固定效用 u 时，hℓ 是复合函数：pk 一方面直接进入普通需求 xℓ 的价格位置；另一方面先改变达到 u 所需财富 e，再通过财富效应改变 xℓ。",
        "所以链式法则产生两项：直接项 ∂xℓ/∂pk，间接项 (∂xℓ/∂w)(∂e/∂pk)。Shephard 引理再把最后一个导数替换为 hk；在与普通需求对应的点上 h=x，才得到 Slutsky 方程中的 xk。每次替换都依赖具体等式和固定对象。"
      ],
      math: ["∂hₗ/∂pₖ=∂xₗ/∂pₖ+(∂xₗ/∂w)(∂e/∂pₖ)"]
    }
  ],
  "L04-M08": [
    {
      id: "roy-denominator", type: "explanation", placement: "prerequisite", label: "条件补充 · Roy 恒等式", title: "为什么要除以财富边际效用，并且分母不能为0",
      paragraphs: [
        "∂v/∂pℓ 是价格变化造成的效用单位变化；∂v/∂w 是一单位财富造成的效用单位变化。负比值把前者换算回财富/数量尺度，消除效用表示的任意刻度。",
        "这里必须把‘偏好上财富增加可改善’与‘某个效用表示的导数严格为正’分开。严格递增或局部非饱和并不能单独保证每一点都有 ∂v/∂w>0；例如严格递增三次函数在拐点的导数可以为0。",
        "所以本页使用普通比值形式时，明确额外要求 v 在该点可微且 ∂v/∂w≠0（常见正则版本由非零效用梯度等条件保证）。若分母为0、v 不可微或需求多值，不能直接套该公式，应使用更一般的对偶/次梯度表述。"
      ],
      math: ["xₗ(p,w)=−(∂v/∂pₗ)/(∂v/∂w)，要求 ∂v/∂w≠0"]
    }
  ],
  "L04-M10": [
    {
      id: "ordinal-money-metric", type: "explanation", placement: "prerequisite", label: "福利前置 · 序数与金额", title: "效用差为什么不能直接当福利金额",
      paragraphs: [
        "效用表示只要求保持排序。若 f 严格递增，f∘u 表示同一偏好，但数值差 f(u₁)−f(u₀) 会随 f 改变，所以‘效用增加5’没有表示无关的金额含义。",
        "货币度量固定一组参照价格 p̄，用 e(p̄,u) 问达到该偏好水平最少需要多少钱。e(p̄,·) 保持效用排序，又把单位换成货币；代价是金额会依赖所选参照价格。EV 和 CV 正是分别选旧价格与新价格。"
      ]
    }
  ],
  "L04-M13": [
    {
      id: "directed-integral-area", type: "explanation", placement: "prerequisite", label: "积分补充 · 福利面积", title: "带方向的定积分：先读上下限，再解释面积符号",
      paragraphs: [
        "∫ₐᵇq(p)dp 把价格从 a 走到 b 时的许多小矩形 q(p)·dp 相加。若交换上下限，积分变号：∫ᵦᵃ=−∫ₐᵇ。",
        "课件在价格从 p⁰ 降到 p¹（p⁰>p¹）时写 ∫_{p¹}^{p⁰}，得到正的几何面积，并与其 EV/CV 符号约定一致。不能只看图中面积为正，就忽略价格变化方向和公式定义。多商品同时变价时，单条需求曲线下面积不再自动给路径无关的精确福利。"
      ],
      math: ["∫ₐᵇq(p)dp=−∫ᵦᵃq(p)dp"]
    },
    practice("P-PREQ-L04-INTEGRAL", "先判断积分方向再谈福利正负", "避免把正几何面积无条件当作正福利变化。", "若 p⁰=5、p¹=3，需求恒为2，计算 ∫_{p¹}^{p⁰}2dp 与 ∫_{p⁰}^{p¹}2dp。", ["常数函数积分等于高度×带符号宽度。"], ["从3到5的积分是2×(5−3)=4；从5到3是2×(3−5)=−4。两者几何面积相同，但方向符号相反。"])
  ],
  "L04-M14": [
    {
      id: "first-order-approximation", type: "explanation", placement: "prerequisite", label: "近似补充", title: "一阶近似不是有限变化恒等式",
      paragraphs: [
        "在起点附近，平滑函数变化可写成‘导数×小变化’加上更高阶余项。说 Hicks 与 Slutsky 补偿一阶相同，是说它们的线性主项相同，不是任意大价格变化下两个金额完全相等。",
        "价格变化缩小时，绝对余项通常更小；但若被近似的对象本身也是二阶小量（如小税率的 DWL），相对误差未必消失。每次使用 AV 都要说明是精确等式还是近似，以及小的是哪个变化。"
      ]
    }
  ],
  "L04-M15": [
    { id: "definition-dwl-av", type: "definition", placement: "development", definitionId: "DEF-DWL-AV" },
    {
      id: "dwl-area-graph", type: "example", placement: "development", label: "图例补全 · 教学自绘", title: "先在图上区分真实损失 B 与近似多算的 C",
      paragraphs: [
        "纵轴是商品 ℓ 的价格，横轴是该商品数量。两条 Hicks 需求分别固定旧效用 u⁰ 与新效用 u¹；普通需求位于二者之间。课件第27页把真实 Hicks 无谓损失标成 B。",
        "第28页改用普通需求曲线做面积近似，所得区域是 B+C。因此 C 不是另一项真实损失，而是把普通需求面积当作 Hicks 面积时多算的近似误差。这里的 B、C 只是图中面积标签，与第一讲预算集 B、选择规则 C 无关。"
      ],
      visual: { type: "dwl", title: "同一张图读出 DWL、DWL_AV 与误差", caption: "曲线位置与区域关系按教师 PPT 第27—28页重绘；为教学自绘，不是课件原图复制。" }
    },
    practice("P-PREQ-L04-DWL-AREA", "从面积等式读回近似误差", "不要把 C 当作新增福利损失。", "若图中 B=12、C=3，真实 DWL、普通需求近似 DWL_AV 与近似误差分别是多少？", ["使用 DWL=B 与 DWL_AV=B+C。"], ["真实 DWL=12；DWL_AV=15；近似误差为15−12=3，正好是区域 C。"])
  ],
  "L05-M01": [
    {
      id: "bridge-consumer-to-production", type: "explanation", placement: "prerequisite", label: "章节桥梁", title: "从消费者选择转向生产计划：工具相似，符号要重新确认",
      paragraphs: ["第五讲继续使用最优化、包络和曲率工具，但对象从消费束变为生产计划。进入利润问题前，先重新确认净投入为何写负号、价格向量中 w 的新角色，以及最大值、最大化者和上确界的区别。"]
    },
    {
      id: "net-output-sign", type: "example", placement: "prerequisite", label: "符号前置 · 生产向量", title: "同一个坐标系里，投入为什么写负数",
      paragraphs: [
        "生产向量 y 记录企业对市场的净供给：向市场交付为正，从市场拿走作为投入为负。若用4单位原料1生产2单位产品2，写 y=(−4,2)，不是因为投入数量本身为负，而是它在净供给账本上流入企业。",
        "单产出记号 z≥0 又把投入的物理用量写成正数，此时同一计划写 y=(−z,q)。从 y 切换到 z 时负号角色必须明确，不能把 yℓ 和 zℓ 当同一个有符号变量。"
      ],
      math: ["y=(−z,q)，z≥0，q≥0"]
    },
    practice("P-PREQ-L05-SIGN", "在净供给和物理投入记号之间翻译", "避免利润公式中的投入符号错误。", "企业使用 z=(3,5) 两种投入，产出 q=4。写出生产向量 y，并说明 p·y 在价格向量 (w₁,w₂,p) 下为何等于利润。", ["投入坐标取负，产出坐标取正。"], ["y=(−3,−5,4)。价格点积为 −3w₁−5w₂+4p=pq−w·z，正好是收入减投入成本。"])
  ],
  "L05-M04": [
    { id: "definition-irreversibility", type: "definition", placement: "development", definitionId: "DEF-IRREVERSIBILITY" }
  ],
  "L05-M05": [
    {
      id: "maximum-argmax-supremum", type: "explanation", placement: "prerequisite", label: "优化前置", title: "利润数值、最大化计划和上确界不是同一个对象",
      paragraphs: [
        "π(p) 是一个数：可行利润的最高水平。y(p) 是达到最高利润的生产计划集合。max 表示最高值由某个可行计划真正取得；sup 只表示最小上界，可能没有计划达到。",
        "例如可行利润能无限接近1却永远小于1时，sup=1但没有最大值，argmax 为空。CRS 技术在单位净利润为正时则更严重：利润可随规模趋于+∞。闭性、边界和规模性质决定‘最优计划是否存在’，不能由写出 π 符号就假定有解。"
      ],
      math: ["π(p)=sup_{y∈Y}p·y", "y(p)=argmax_{y∈Y}p·y"]
    }
  ],
  "L05-M07": [
    {
      id: "w-role-change", type: "explanation", placement: "prerequisite", label: "符号角色提醒", title: "这里的 w 已从消费者财富变成投入价格向量",
      paragraphs: [
        "消费者问题中 w 是一个财富标量；生产单产出部分中 w=(w₁,…,w_{L−1}) 是投入价格向量。相同字母在章节切换后角色改变，必须看函数输入和上下文。",
        "条件 pfℓ(z*)≤wℓ 的左侧是多用一单位投入带来的边际收入，右侧是该投入的单位成本。只有实际使用 zℓ*>0 时取等；角点 zℓ*=0 允许严格小于。"
      ]
    }
  ],
  "L05-M09": [
    {
      id: "upper-envelope-profit", type: "explanation", label: "凸性补充", title: "利润函数是线性利润的上包络",
      paragraphs: [
        "每个固定生产计划 y 都给出关于价格的线性函数 p↦p·y。企业对所有 y 取最大，π(p) 是这些直线/超平面的上包络，所以关于 p 凸。",
        "若最优计划唯一，包络在该点的斜率就是 y(p)（Hotelling）。进一步的 Hessian 正半定表示沿任意价格变化方向，供给响应与价格变化点积非负。这里正半定来自最大值的凸性，和消费者支出函数的负半定方向相反。"
      ]
    },
    { id: "property-profit-recovery", type: "definition", placement: "development", definitionId: "PROP-PROFIT-RECOVERY" }
  ],
  "L05-M13": [
    { id: "property-cost-recovery", type: "definition", placement: "development", definitionId: "PROP-COST-RECOVERY" }
  ],
  "L05-M15": [
    {
      id: "teacher-example-convex-production", type: "example", placement: "prerequisite", label: "教师 PPT 图例 · 教学重绘", subgoal: "A", title: "例1：凸技术中，切线条件能找到全局利润最大点",
      paragraphs: [
        "PPT 第32页先看一个产出 q、一个投入 z、投入价 w=1 的凸生产集。等利润线 pq−z=常数在 (−z,q) 图上的斜率是 −1/p；把等利润线向东北移动，最后与生产集相切于 (−z*,q*)。",
        "同一例子换到成本图，c(1,q)=f⁻¹(q) 是凸曲线。斜率为 p 的收益线与成本曲线相切，所以 p=∂c/∂q 找到 q*；凸性保证这个一阶候选是全局利润最大点。"
      ],
      math: [{ tex: "pq-z=\\pi(p),\\qquad p=\\frac{\\partial c(1,q^*)}{\\partial q}" }],
      visual: { type: "production-convex", title: "凸生产集：等利润线最后相切", caption: "按教师 PPT 第32页的对象和结论教学重绘；不是 MWG 5.C.9。" }
    },
    {
      id: "teacher-example-nonconvex-production", type: "counterexample", placement: "prerequisite", label: "教师 PPT 图例 · 教学重绘", subgoal: "B", title: "例2：非沉没启动成本使技术非凸，一阶候选可能输给停产",
      paragraphs: [
        "PPT 第33—34页加入非沉没启动成本。正规模部分仍可能有一个满足 p=∂c/∂q 的切点 q̂，但成本在 q=0 与 q>0 之间有跳跃，整个技术不再凸。",
        "比较全局利润时，经过 q̂ 的等利润线仍低于停产点 (0,0) 对应的最高可达等利润线，所以真正的 PMP 解是停产。成本图中，p=MC 只定位了正规模驻点，不能替代与 q=0 的利润比较。"
      ],
      math: [{ tex: "p=MC(\\hat q)\\quad\\text{但}\\quad \\pi(p)>p\\hat q-c(1,\\hat q),\\qquad q^*=0" }],
      visual: { type: "production-nonconvex", title: "非凸生产集：局部切点不是全局供给", caption: "按教师 PPT 第33—34页重绘。它先于教材原题 5.C.9 出现，二者承担不同教学任务。" }
    },
    practice("P-PREQ-L05-GRAPHS", "先判技术曲率，再判断 p=MC 的地位", "把教师两个图例的逻辑并排比较。", "为什么例1可以用 p=MC 结束，而例2必须再和 q=0 比利润？", ["分别判断 pq−c(q) 是否为凹函数。"], ["例1成本凸，所以利润 pq−c(q) 凹，一阶条件给全局最大。例2有不可避免的非凸/启动跳跃，正规模的一阶切点只是一名候选；停产点可能给更高利润，必须全局比较。"])
  ],
  "L05-M14": [
    {
      id: "necessary-sufficient", type: "explanation", placement: "prerequisite", label: "优化逻辑补充", title: "p=MC 何时只是候选，何时足以保证全局最优",
      paragraphs: [
        "一阶条件 p=MC 只说利润导数为0，是内点最优的必要候选。若成本曲线非凸，驻点可能是局部最小或较差的局部最大，还必须与停产和其他产量比较利润。",
        "若技术凸使成本 c(w,q) 关于 q 凸，则利润 pq−c(w,q) 关于 q 凹。在凸可行域 q≥0 上，凹目标的可微一阶条件才足以保证全局最大；角点还要检查单边 KKT 条件。"
      ]
    }
  ],
  "L05-M16": [
    {
      id: "quotient-rule-ac", type: "explanation", placement: "prerequisite", label: "微积分补充 · 商法则", title: "平均成本最低处 AC=MC 的每一步",
      paragraphs: [
        "AC(q)=C(q)/q 只在 q>0 定义。C′(q) 中的撇号在这里才表示对 q 的导数；这与前面 p′ 表示第二组价格不同。对商求导：分子导数 C′(q) 乘 q，减去 C(q) 乘分母导数1，再除以 q²。",
        "q̄ 读作 q bar（q 上横线），这里只是给所讨论的有效规模做固定标记。若 q̄>0 是 AC 的内点全局最小，且 C 在 q̄ 可微，则 AC′(q̄)=0。令 [q̄C′(q̄)−C(q̄)]/q̄²=0，得到 C′(q̄)=C(q̄)/q̄。证明只需 q̄ 处可微，不需 C 处处可微。"
      ],
      math: ["AC′(q)=[qC′(q)−C(q)]/q²", "AC′(q̄)=0 ⇒ MC(q̄)=AC(q̄)"]
    }
  ],
  "L05-M19": [
    {
      id: "shutdown-baseline", type: "example", label: "经济比较补充", title: "停产判断先固定比较基准：停产也可能要付沉没成本",
      paragraphs: [
        "比较‘生产 q>0’与‘停产 q=0’时，沉没成本 KS 两边都要付，所以两边同时出现 −KS 并抵消；非沉没固定成本 KNS 只在生产时支付，因此会影响是否开工。",
        "生产 q 的利润减停产利润为 pq−CV(q)−KNS=q[p−ANSC(q)]。所以阈值看平均非沉没成本 ANSC，而不是含沉没成本的 AC。价格等于最低 ANSC 时，停产和所有 ANSC 最小规模可能并列最优。"
      ],
      math: ["π(q)−π(0)=q[p−ANSC(q)]"]
    },
    practice("P-PREQ-L05-SHUTDOWN", "用同一个基准比较生产与停产", "区分沉没和可避免成本。", "CV(q)=q²、KNS=4、KS=10。写出生产 q 的利润与停产利润之差。KS 是否影响停产阈值？", ["分别写 π(q) 与 π(0)，再相减。"], ["π(q)=pq−q²−4−10，π(0)=−10，所以差为 pq−q²−4。KS=10 抵消，不影响停产阈值；KNS=4 会影响。"])
  ]
};
