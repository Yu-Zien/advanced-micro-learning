const src = (pages, note = "") => ({
  sourceId: "L01",
  file: "New Slides 1(2).pdf",
  pdfPages: pages,
  note
});

export const lecture1 = {
  id: "L01",
  title: "偏好与选择",
  originalTitle: "Preference Relations",
  status: "ready",
  pptPages: 29,
  description: "从‘至少一样好’的关系出发，走到效用表示、选择行为、WARP 与理性化。",
  lessons: [
    {
      id: "L01-M01", sectionId: "L01-S01", title: "两条建模路线", minutes: 6, status: "ready", sourceRefs: [src([1])],
      why: "同一个‘人怎么选’的问题，可以先描述心里的排序，也可以只观察外在选择。第一讲要建立两条路线之间的桥。",
      wakeup: "先想一想：如果某人从 {苹果, 香蕉} 选苹果，我们能否断言他在所有情形都更喜欢苹果？暂时不能；预算集合和同时可选对象也很重要。",
      concept: [
        "<strong>偏好路线</strong>：先给选择集合 <em>X</em> 上的偏好关系，再加完备性、传递性等理性条件，由偏好推出选择。",
        "<strong>选择路线</strong>：直接记录每个可选集合里实际会选哪些元素，再用一致性条件约束这些记录。",
        "这两条路线不是心理学与行为学的简单对立。课程真正的问题是：什么条件下，观察到的选择可以由某个理性偏好解释？"
      ],
      demo: { prompt: "食堂今天只有 A、B 两套餐，小林选 A。两条路线分别记录什么？", steps: ["偏好路线会提出 A ⪰ B，并继续问整套偏好是否完备、传递。", "选择路线只先记 C({A,B}) 包含 A，不额外猜测没观察到的比较。"] },
      practice: { id: "P-L01-M01", prompt: "某人在 {x,y,z} 中选了 x。写出一条可以直接记录的选择事实，再写出一条尚不能仅凭这次选择断定的偏好事实。", hint: "把‘观察’和‘解释’分开。", answer: "可直接记录 x∈C({x,y,z})。若允许多选，甚至还不能说 y、z 一定未被选择；更不能仅凭这一个预算集断言他在所有成对比较中都严格偏好 x。" },
      review: { id: "R-L01-01", prompt: "不看正文：偏好路线和选择路线的起点分别是什么？", answer: "偏好路线从 X 上的偏好关系开始；选择路线从预算集族与每个预算集上的选择记录开始。" }
    },
    {
      id: "L01-M02", sectionId: "L01-S02", title: "二元关系就是一组有序对", minutes: 8, status: "ready", sourceRefs: [src([2])],
      why: "偏好符号看起来抽象，其实它首先只是：哪些有序对被收进了一张清单。",
      wakeup: "有序对 (x,y) 与 (y,x) 一般不同。知道一个方向成立，不会自动补上反方向。",
      concept: [
        "设选择集合为 X。笛卡尔积 X×X 收集所有可能的有序对；X 上的二元关系 R 是 X×X 的任意子集。",
        "写 xRy，意思正是 (x,y)∈R；写‘不是 xRy’，意思是 (x,y)∉R。关系不必包含每一对，也不必符合日常语言直觉。",
        "自编例：X={1,2,3}，R={(1,1),(1,2),(2,3)}。这里 1R2 成立，2R1 不成立，3 与 1 在两个方向都没有关系。"
      ],
      formal: ["R ⊆ X×X", "xRy ⇔ (x,y)∈R"],
      demo: { prompt: "在上面的 R 中判断 1R1、2R3、3R2。", steps: ["(1,1) 在清单中，所以 1R1。", "(2,3) 在清单中，所以 2R3。", "(3,2) 不在清单中，所以 3R2 不成立。"] },
      practice: { id: "P-L01-M02", prompt: "令 X={a,b}，请写出一个只包含 (a,b) 而不包含 (b,a) 的关系，并说明它是否已经比较了 a 与 a。", hint: "关系是 X×X 的子集，不必自动添加任何有序对。", answer: "可取 R={(a,b)}。它没有包含 (a,a)，所以没有给出 aRa；仅列出 (a,b) 不会自动产生其他关系。" }
    },
    {
      id: "L01-M03", sectionId: "L01-S02", title: "自反与反自反：先检查对角线", minutes: 7, status: "ready", sourceRefs: [src([3])],
      why: "不少关系性质都带全称量词。先学会看 X×X 的‘对角线’，能避免把一个例子误当成对所有元素成立。",
      concept: [
        "R <strong>自反</strong>：对每个 x∈X，都有 xRx。必须把所有对角有序对 (x,x) 收进关系。",
        "R <strong>反自反</strong>：对每个 x∈X，都没有 xRx。必须把所有对角有序对排除。",
        "若某些 x 有 xRx、另一些没有，则两种性质都不满足。自反与反自反不是‘只要找到一例’。"
      ],
      formal: ["自反：∀x∈X, xRx", "反自反：∀x∈X, ¬(xRx)"],
      demo: { prompt: "X={1,2}，R={(1,1),(1,2)}。R 属于哪一种？", steps: ["1R1 成立。", "2R2 不成立，所以 R 不是自反。", "由于 1R1 成立，R 也不是反自反。"] },
      practice: { id: "P-L01-M03", prompt: "在整数集合上，‘≥’与‘>’分别是自反还是反自反？", hint: "分别代入 x 与自己比较。", answer: "x≥x 对所有整数成立，所以 ≥ 自反；x>x 对所有整数都不成立，所以 > 反自反。" }
    },
    {
      id: "L01-M04", sectionId: "L01-S02", title: "对称、非对称与反对称不是一回事", minutes: 10, status: "ready", sourceRefs: [src([3])],
      why: "‘非对称’和‘反对称’中文只差一个字，逻辑强弱却完全不同，是第一讲最常见的混淆点。",
      concept: [
        "<strong>对称</strong>：xRy 就必须有 yRx。",
        "<strong>非对称（asymmetric）</strong>：xRy 就必须没有 yRx；它同时排除了 xRx。",
        "<strong>反对称（antisymmetric）</strong>：如果 xRy 和 yRx 同时成立，那只能是 x=y。它允许 xRx；只禁止两个不同元素双向相关。"
      ],
      formal: ["对称：xRy ⇒ yRx", "非对称：xRy ⇒ ¬(yRx)", "反对称：xRy 且 yRx ⇒ x=y"],
      demo: { prompt: "整数上的 =、>、≥ 分别满足什么？", steps: ["= 是对称的，也是反对称的；但不是非对称，因为 x=x。", "> 是非对称的，因此也反自反。", "≥ 是反对称的：x≥y 且 y≥x 推出 x=y；它并不非对称，因为 x≥x。"] },
      practice: { id: "P-L01-M04", prompt: "‘是同班同学’通常对称吗？反对称吗？", hint: "找两个不同的人互为同班同学。", answer: "通常对称；通常不反对称，因为两个不同的人可以互为同班同学。它也不非对称。" },
      review: { id: "R-L01-02", prompt: "给出非对称与反对称的量词区别。", answer: "非对称：xRy⇒¬yRx；反对称：xRy 且 yRx⇒x=y。后者允许同一元素与自己相关。" }
    },
    {
      id: "L01-M05", sectionId: "L01-S02", title: "传递与完备：链条和任意两点", minutes: 9, status: "ready", sourceRefs: [src([3])],
      why: "理性偏好的两个公理很快就要出现；先把‘比较得上’和‘比较不循环’拆开。",
      concept: [
        "R <strong>传递</strong>：只要 xRy 且 yRz，就有 xRz。检查失败需要找一条两段链却缺少首尾关系。",
        "R <strong>完备</strong>：任取 x,y∈X，至少一个方向成立：xRy 或 yRx；两个方向都成立也可以。",
        "完备并不是‘知道所有严格排名’，无差异时两个方向同时成立也满足完备。"
      ],
      formal: ["传递：xRy 且 yRz ⇒ xRz", "完备：∀x,y∈X，xRy 或 yRx"],
      demo: { prompt: "X={a,b,c}，有 aRb、bRc，却没有 aRc。可以判定什么？", steps: ["存在一条 a→b→c 的两段链。", "首尾 aRc 缺失，所以 R 不传递。", "这还不足以判断是否完备；要检查每一对至少一个方向。"] },
      practice: { id: "P-L01-M05", prompt: "空关系在非空 X 上传递吗？完备吗？", hint: "传递命题的前件会不会出现？完备需要什么？", answer: "空关系传递：不存在 xRy 与 yRz 同时成立，所以没有反例。它不完备，因为任取元素 x，xRx 与反向仍是同一个缺失关系。" }
    },
    {
      id: "L01-M06", sectionId: "L01-S03", title: "从弱偏好拆出严格偏好", minutes: 8, status: "ready", sourceRefs: [src([4])],
      why: "‘x 至少和 y 一样好’并不等于‘x 严格更好’；严格偏好还必须排除反方向。",
      concept: [
        "给定弱偏好 ⪰，定义 x≻y 当且仅当 x⪰y 且并非 y⪰x。",
        "检查严格偏好有两个动作：正向 (x,y) 必须在 ⪰ 中；反向 (y,x) 必须不在。",
        "自编关系：X={a,b,c}，⪰ 包含 (a,a),(b,b),(c,c),(a,b),(b,a),(a,c),(b,c)。则 a≻c，但 b≻a 不成立。"
      ],
      formal: ["x≻y ⇔ x⪰y 且 ¬(y⪰x)"],
      demo: { prompt: "为什么上面的关系中 a≻c？", steps: ["(a,c) 在关系中，所以 a⪰c。", "(c,a) 不在关系中，所以并非 c⪰a。", "两个条件同时满足，故 a≻c。"] },
      practice: { id: "P-L01-M06", prompt: "上面的关系中 b≻a 是否成立？请检查两个条件。", hint: "分别查看 (b,a) 与 (a,b)。", answer: "b⪰a 成立，但 a⪰b 也成立，所以‘并非 a⪰b’失败。因此 b≻a 不成立；两者在弱偏好下双向相关。" },
      review: { id: "R-L01-03", prompt: "不看定义，把 x≻y 拆成关于 ⪰ 的两个条件。", answer: "x⪰y，并且不是 y⪰x。" }
    },
    {
      id: "L01-M07", sectionId: "L01-S03", title: "无差异与理性偏好", minutes: 12, status: "ready", sourceRefs: [src([4,5], "教材命题 1.B.1 见原 PDF 31 / 印刷 7")],
      why: "弱偏好的双向部分形成无差异；完备加传递则是本课所称的理性。由这两条公理能推出严格偏好和无差异的多项性质。",
      concept: [
        "x∼y 当且仅当 x⪰y 且 y⪰x。它不是‘没想好’，而是两个弱比较都成立。",
        "偏好关系 ⪰ 称为<strong>理性</strong>，当且仅当它完备且传递。理性在这里是技术术语，不是在评价一个人的人格或信息能力。",
        "若 ⪰ 理性，则 ≻ 反自反、传递、非对称；∼ 自反、传递、对称。每个结论都要从定义和两条公理逐项推出。"
      ],
      formal: ["x∼y ⇔ x⪰y 且 y⪰x", "⪰ 理性 ⇔ ⪰ 完备且传递"],
      demo: { prompt: "证明 ∼ 对称。", steps: ["已知 x∼y。", "定义给出 x⪰y 且 y⪰x。", "交换书写次序就是 y⪰x 且 x⪰y，所以 y∼x。", "这一步只用了无差异的定义，没有用传递性。"] },
      practice: { id: "P-L01-M07", prompt: "证明 ≻ 反自反：为什么 x≻x 不可能？", hint: "把 x≻x 展开，看看会同时要求什么。", answer: "若 x≻x，则定义要求 x⪰x 且不是 x⪰x，这是直接矛盾。因此对所有 x，x≻x 都不成立；这里也只用严格偏好的定义。" },
      exerciseIds: ["MWG-1.B.2"]
    },
    {
      id: "L01-M08", sectionId: "L01-S03", title: "混合传递：把目标拆成两半", minutes: 14, status: "ready", sourceRefs: [src([5], "对应 MWG 命题 1.B.1(iii)，原 PDF 31；题目原 PDF 39")],
      why: "原题 1.B.1 要证明 x≻y、y⪰z 推出 x≻z。真正难点不是代符号，而是知道严格目标包含一正一反两项。",
      concept: [
        "已知：⪰ 理性，x≻y，y⪰z。目标：x≻z。",
        "路线：先用正向链证明 x⪰z；再反设 z⪰x，沿另一条链推出 y⪰x，与 x≻y 中的否定条件冲突。"
      ],
      proof: {
        known: "⪰ 完备且传递；x≻y；y⪰z。",
        goal: "x≻z，即 x⪰z 且 ¬(z⪰x)。",
        steps: [
          "由 x≻y 的定义，得到 x⪰y 以及 ¬(y⪰x)。",
          "由 x⪰y、y⪰z 和传递性，得到 x⪰z。",
          "为证明反向不成立，反设 z⪰x。",
          "由 y⪰z、z⪰x 和传递性，得到 y⪰x。",
          "这与第 1 步的 ¬(y⪰x) 矛盾，所以 ¬(z⪰x)。",
          "合并 x⪰z 与 ¬(z⪰x)，由定义得 x≻z。"
        ],
        assumptions: "显式使用了传递性与严格偏好定义。完备性属于理性假设，但这段具体推导没有单独调用它。"
      },
      practice: { id: "P-L01-M08", prompt: "只补证明骨架：为了从 x≻y、y⪰z 得到 x≻z，需要分别证明哪两个式子？反设应当写什么？", hint: "展开目标 x≻z。", answer: "需要证明 x⪰z 和 ¬(z⪰x)。第二部分反设 z⪰x，再与 y⪰z 连用传递性推出 y⪰x，和 x≻y 冲突。" },
      exerciseIds: ["MWG-1.B.1"],
      review: { id: "R-L01-04", prompt: "混合传递证明中，为什么要反设 z⪰x？", answer: "目标 x≻z 的第二半是 ¬(z⪰x)。反设 z⪰x 可与 y⪰z 传递得到 y⪰x，和 x≻y 的否定部分矛盾。" }
    },
    {
      id: "L01-M09", sectionId: "L01-S04", title: "无差异类、分划与效用表示", minutes: 10, status: "ready", sourceRefs: [src([6])],
      why: "效用数值不是偏好的额外心理强度；它的首要任务是给同一无差异类相同数值，并保持类之间的顺序。",
      concept: [
        "X 的一个分划是一组互不相交的子集，合起来恰好覆盖 X。每个元素属于且只属于一个类。",
        "理性偏好的无差异关系 ∼ 是等价关系，因此把 X 分成无差异类。",
        "u:X→ℝ 表示 ⪰，意思是对所有 x,y∈X，x⪰y 当且仅当 u(x)≥u(y)。‘当且仅当’要求两个方向都成立。"
      ],
      formal: ["x⪰y ⇔ u(x)≥u(y)", "x∼y ⇒ u(x)=u(y)", "x≻y ⇒ u(x)>u(y)"],
      demo: { prompt: "若 a∼b、b≻c，能怎样赋值？", steps: ["a 与 b 必须同值，例如 u(a)=u(b)=2。", "b 严格优于 c，所以可令 u(c)=0。", "数值差 2 本身没有强度含义；换成 100、100、99 仍表达相同次序。"] },
      practice: { id: "P-L01-M09", prompt: "u(a)=3,u(b)=3,u(c)=1。写出由 u 表示的 a、b、c 间弱偏好、无差异与严格偏好关系。", hint: "比较 ≥、=、>。", answer: "a∼b；a≻c 且 b≻c；弱关系还包括每个元素与自己，以及 a⪰b、b⪰a、a⪰c、b⪰c。" }
    },
    {
      id: "L01-M10", sectionId: "L01-S04", title: "严格递增变换不改变排序", minutes: 8, status: "ready", sourceRefs: [src([6])],
      why: "同一偏好有很多效用表示。要辨认哪些变换保序，避免把效用数字当作可直接比较的幸福量。",
      concept: [
        "若 u 表示 ⪰，f:ℝ→ℝ 严格递增，则 v(x)=f(u(x)) 也表示同一偏好。",
        "理由是严格递增函数保持并反映大小次序：u(x)≥u(y) 当且仅当 f(u(x))≥f(u(y))。",
        "若 f 只是弱递增，可能把原本严格不同的数压成相同值，从而制造不存在的无差异。"
      ],
      demo: { prompt: "u=(1,2,4) 时，f(t)=3t+7 与 g(t)=0 分别怎样？", steps: ["f 严格递增，把数变为 10,13,19，顺序不变。", "g 把所有对象都变为 0，原来的严格排序消失，所以一般不能表示同一偏好。"] },
      practice: { id: "P-L01-M10", prompt: "在效用值都为正时，v=ln u 是否保留偏好？v=-u 呢？", hint: "看变换是严格递增还是严格递减。", answer: "ln 在正数上严格递增，所以保留；-u 严格递减，会颠倒排序，不能表示同一偏好。" }
    },
    {
      id: "L01-M11", sectionId: "L01-S05", title: "字典序偏好：先比第一坐标", minutes: 12, status: "ready", sourceRefs: [src([7,8])],
      why: "字典序偏好既完备又传递，却不能由实值效用表示。它精确展示‘理性’为何不自动保证有实值效用。",
      concept: [
        "在 X=ℝ²₊ 上，x⪰<sub>L</sub>y 当第一坐标 x₁>y₁；或 x₁=y₁ 且 x₂≥y₂。像查字典：第一位只要不同，第二位再大也无法补偿。",
        "完备性：任意两个第一坐标能比较；相等时再比较第二坐标。",
        "传递性可按第一坐标比较的四种组合核对：两次严格、先严格后相等、先相等后严格、两次相等。"
      ],
      formal: ["x⪰ₗy ⇔ [x₁>y₁] 或 [x₁=y₁ 且 x₂≥y₂]"],
      demo: { prompt: "比较 x=(2,0) 与 y=(1,10⁹)。", steps: ["第一坐标 2>1。", "字典序立即给出 x≻ₗy；第二坐标不再参与补偿。"] },
      practice: { id: "P-L01-M11", prompt: "证明情形：x₁=y₁、x₂≥y₂，同时 y₁>z₁。为什么 x⪰ₗz？", hint: "先从前两个条件得到 x₁ 与 z₁ 的关系。", answer: "x₁=y₁>z₁，因此 x₁>z₁。按字典序定义的第一种情形，x⪰ₗz，x₂ 与 z₂ 无需比较。" }
    },
    {
      id: "L01-M12", sectionId: "L01-S05", title: "为什么字典序没有实值效用表示", minutes: 16, status: "ready", sourceRefs: [src([8,9,10], "课件第 9–10 页的映射定义域书写有疑点；此处按构造变量 x₁ 重建并标明")],
      why: "不可表示证明的核心不是计算，而是给不可数多个互不重叠的实数开区间各塞进一个不同有理数。",
      concept: [
        "反设 u 表示字典序。固定 a>b≥0。对每个第一坐标 t，(t,a)≻ₗ(t,b)，因此 u(t,a)>u(t,b)。",
        "每个开区间 Iₜ=(u(t,b),u(t,a)) 都含某个有理数 r(t)。若 s<t，则 (t,b)≻ₗ(s,a)，所以整个 Iₜ 位于 Iₛ 右侧；不同 t 的区间互不重叠，选出的 r(t) 也不同。",
        "于是得到从不可数集合 ℝ₊ 到可数集合 ℚ 的单射 t↦r(t)，不可能。故不存在这样的实值效用 u。"
      ],
      proof: { known: "字典序定义；反设存在表示它的 u；有理数在实数中稠密。", goal: "导出不可数集合到可数集合的单射矛盾。", steps: ["固定 a>b，为每个 t 构造非空开区间 Iₜ。", "在 Iₜ 中选择一个有理数 r(t)。", "对 s<t，用第一坐标优先性得 u(t,b)>u(s,a)，故 Iₜ 与 Iₛ 不交。", "不同 t 得到不同 r(t)，故 r 是 ℝ₊→ℚ 的单射。", "ℝ₊ 不可数而 ℚ 可数，矛盾。"], assumptions: "这里依赖有理数稠密性和可数性。课件第 10 页抽取文本把映射域写成类似 ℝ²₊；按第 9 页实际构造变量，应理解为第一坐标 t 的集合 ℝ₊，因此本页保留核查说明而不静默照抄。" },
      practice: { id: "P-L01-M12", prompt: "证明中为何要让各区间 Iₜ 互不重叠？仅仅每个区间含一个有理数够吗？", hint: "目标是建立什么类型的映射？", answer: "仅有有理数还不够；不同 t 可能选到同一个数。区间互不重叠保证 r(t) 两两不同，从而得到单射，才能与可数性冲突。" },
      review: { id: "R-L01-05", prompt: "一句话说出字典序不可表示证明的‘计数矛盾’。", answer: "若有实值表示，就能给不可数多个第一坐标各分配一个不同有理数，产生 ℝ₊ 到 ℚ 的单射，不可能。" }
    },
    {
      id: "L01-M13", sectionId: "L01-S05", title: "有表示一定理性", minutes: 10, status: "ready", sourceRefs: [src([10,11,12])],
      why: "上一模块否定的是‘理性 ⇒ 一定可表示’；反方向‘可表示 ⇒ 理性’始终成立。",
      concept: [
        "完备性来自实数的完全可比：任意 u(x)、u(y)，至少 u(x)≥u(y) 或 u(y)≥u(x)。通过表示的双向条件，得到 x⪰y 或 y⪰x。",
        "传递性来自实数 ≥ 的传递性：x⪰y、y⪰z 给出 u(x)≥u(y)≥u(z)，所以 u(x)≥u(z)，再由表示得到 x⪰z。",
        "逻辑结论：存在实值效用表示是理性的充分条件，但在一般集合上不是必要条件。额外的拓扑/可数性条件可恢复表示定理，但不在本讲展开。"
      ],
      demo: { prompt: "证明完备性时，为什么需要‘表示’的当且仅当而非只要？", steps: ["实数比较先给 u(x)≥u(y) 或反向。", "必须能从数值不等式推回偏好关系。", "若只知道 x⪰y⇒u(x)≥u(y)，就无法完成这一步。"] },
      practice: { id: "P-L01-M13", prompt: "写出可表示推出传递性的三行推理，并圈出用到实数关系传递性的那一行。", hint: "偏好 → 数值 → 数值 → 偏好。", answer: "x⪰y、y⪰z ⇒ u(x)≥u(y)、u(y)≥u(z) ⇒ u(x)≥u(z) ⇒ x⪰z。中间第二个箭头使用实数 ≥ 的传递性。" }
    },
    {
      id: "L01-M14", sectionId: "L01-S06", title: "选择结构：预算集族与选择对应", minutes: 10, status: "ready", sourceRefs: [src([13,14])],
      why: "选择路线不从偏好开始，而是先说‘在哪些可选集合中观察过、每个集合选了什么’。",
      concept: [
        "选择结构 (ℬ,C(·)) 有两个部分：ℬ 是 X 的非空子集构成的族；每个 B∈ℬ 称为预算集。ℬ 不必包含 X 的所有子集。",
        "选择规则 C 是<strong>对应</strong>：给每个 B∈ℬ 一个非空子集 C(B)⊆B。对应可以一次返回多个可接受选择，不必是单值函数。",
        "自编例：X={x,y,z}，ℬ={{x,y},{x,y,z}}。C({x,y})={x}，而 C({x,y,z})={x,y} 是合法选择规则。"
      ],
      formal: ["B∈ℬ ⇒ ∅≠C(B)⊆B"],
      demo: { prompt: "为什么 C({x,y})={z} 不合法？为什么 C({x,y})={x,y} 合法？", steps: ["z 不在预算集 {x,y}，违反 C(B)⊆B。", "{x,y} 非空且是自身子集，所以多选完全合法。"] },
      practice: { id: "P-L01-M14", prompt: "函数与选择对应有什么关键区别？", hint: "同一个输入能返回几个元素？", answer: "普通单值函数为每个输入给一个输出；选择对应 C(B) 给出一个非空集合，允许多个元素同时被选中。" }
    },
    {
      id: "L01-M15", sectionId: "L01-S06", title: "WARP：扩充选择集时不能反悔", minutes: 14, status: "ready", sourceRefs: [src([14,15,16], "教材原题 1.C.1 在原 PDF 39 / 印刷 15")],
      why: "WARP 把跨预算集的选择记录连起来：若 x 与 y 同场时选过 x，另一场又选了 y，就不能只留下 y 而把 x 丢掉。",
      concept: [
        "正式表述：若某个 B 同含 x,y 且 x∈C(B)，那么任何另一个同含 x,y 且 y∈C(B′) 的 B′，都必须有 x∈C(B′)。",
        "定义揭示弱偏好：x⪰*y，当存在某个 B 同含 x,y 且 x∈C(B)。若同场选 x 却不选 y，则称 x 揭示严格优于 y。",
        "简化表述：若 x 揭示至少和 y 一样好，则 y 不能揭示严格优于 x。注意：WARP 允许二者在两个预算集里都被选。"
      ],
      formal: ["x⪰*y ⇔ ∃B∈ℬ: x,y∈B 且 x∈C(B)", "x⪰*y ⇒ 不存在 y 被选而 x 同场未选的反向严格揭示"],
      demo: { prompt: "C({x,y})={x}，C({x,y,z})={x,y} 是否违反 WARP？", steps: ["第一场 x 被选、y 同场，因此 x⪰*y。", "第二场 y 被选时 x 也被选，没有反向‘只选 y 不选 x’。", "所以这两条记录不违反 WARP。"] },
      practice: { id: "P-L01-M15", prompt: "若 C({x,y})={x}，C({x,y,z})={y,z}，指出 WARP 冲突中的 B、B′、x、y。", hint: "第一场选 x，第二场选 y 而遗漏 x。", answer: "取 B={x,y}、B′={x,y,z}。两场都含 x,y；x∈C(B)，y∈C(B′)，但 x∉C(B′)，违反 WARP。" },
      exerciseIds: ["MWG-1.C.1"],
      review: { id: "R-L01-06", prompt: "WARP 是否禁止 x 和 y 在某预算集里同时被选？", answer: "不禁止。它禁止的是：x 与 y 同场时选过 x，后来同场选 y 却排除 x。两者同时被选可以一致。" }
    },
    {
      id: "L01-M16", sectionId: "L01-S06", title: "WARP 两种表述为何等价", minutes: 15, status: "ready", sourceRefs: [src([14,15], "教材原题 1.C.2 在原 PDF 39 / 印刷 15")],
      why: "教材 1.C.2 把单向定义改写为更对称的集合包含式。双向证明能训练量词和交换角色。",
      concept: [
        "定义式：若 x∈C(B)，并且在另一预算 B′ 中 y∈C(B′)，而两者都在 B∩B′，则 x∈C(B′)。",
        "教材等价式进一步说：在同样前提下，{x,y}⊆C(B) 且 {x,y}⊆C(B′)。看起来更强，但把 x、y 与 B、B′ 互换，再用一次 WARP，就得到另一半。"
      ],
      proof: { known: "B,B′∈ℬ；x,y∈B∩B′；x∈C(B)；y∈C(B′)。", goal: "证明 {x,y} 同时包含于 C(B) 和 C(B′)。", steps: ["按 WARP，x∈C(B)、y∈C(B′) 推出 x∈C(B′)。", "交换 x↔y、B↔B′，仍满足 WARP 前件，因此 y∈C(B)。", "原已知给出 x∈C(B)、y∈C(B′)。合并四个成员关系，得到两个集合包含。", "反向更直接：若对称包含性质成立，它立刻给出 WARP 所要求的 x∈C(B′)。"], assumptions: "没有假定选择单值；恰恰因为允许多选，结论写成两边都同时选中。" },
      practice: { id: "P-L01-M16", prompt: "正向证明中，怎样得到 y∈C(B)？请明确写出交换了哪些对象。", hint: "把第二个预算当成新的‘第一场’。", answer: "把 y 当作定义里的 x，把 x 当作定义里的 y；把 B′ 当作 B，把 B 当作 B′。由 y∈C(B′) 和 x∈C(B)，WARP 推出 y∈C(B)。" },
      exerciseIds: ["MWG-1.C.2"]
    },
    {
      id: "L01-M17", sectionId: "L01-S07", title: "理性偏好生成的选择一定满足 WARP", minutes: 14, status: "ready", sourceRefs: [src([16,17])],
      why: "这是偏好路线通往选择路线的第一座桥：只要选择的是预算集中的偏好最大元，跨预算记录自动一致。",
      concept: [
        "由 ⪰ 生成的选择对应定义为 C*(B,⪰)={x∈B: 对所有 y∈B，x⪰y}。它收集 B 中所有弱最优元素。",
        "设 x 在 B 被选，且 x,y∈B，则 x⪰y。再设 y 在 B′ 被选，则对所有 z∈B′ 有 y⪰z。传递性给 x⪰z 对所有 z∈B′，所以 x 也在 B′ 被选。",
        "这正是 WARP。注意证明依赖最优集合非空；‘选择结构’本身要求每个 C(B) 非空。"
      ],
      proof: { known: "⪰ 理性；C* 由 ⪰ 的预算内弱最大元组成；x∈C*(B)，y∈C*(B′)，x,y 同时属于 B 与 B′。", goal: "x∈C*(B′)。", steps: ["x 在 B 最优且 y∈B，所以 x⪰y。", "y 在 B′ 最优，所以对每个 z∈B′，y⪰z。", "传递性给出对每个 z∈B′，x⪰z。", "x∈B′ 且弱优于其中所有元素，因此 x∈C*(B′)。"], assumptions: "具体推导使用传递性；理性还含完备性，通常帮助保证有限预算上的最大元结构，但此处选择结构已把非空性作为前提。" },
      practice: { id: "P-L01-M17", prompt: "证明中为什么不能只由 x⪰y 就说 x 在 B′ 最优？还缺哪一组比较？", hint: "最优要和 B′ 中每个 z 比。", answer: "还需要 x⪰z 对所有 z∈B′。由 y 在 B′ 最优得到 y⪰z，再把 x⪰y 与之传递，才能补齐。" }
    },
    {
      id: "L01-M18", sectionId: "L01-S07", title: "WARP 仍可能藏着三点循环", minutes: 12, status: "ready", sourceRefs: [src([18,19,20])],
      why: "WARP 只比较重复出现的同一对对象。预算集太少时，三点循环可以绕开任何一次直接‘反悔’。",
      concept: [
        "令 X={x,y,z}，ℬ={{x,y},{y,z},{x,z}}，并分别只选 x、y、z。于是 x 揭示优于 y，y 揭示优于 z，z 揭示优于 x。",
        "每一对只在一个预算集中出现，没有第二次反向选择，所以 WARP 没被违反。",
        "但任何生成这些单值选择的偏好都需 x≻y、y≻z、z≻x，与严格偏好的传递性冲突。因此它不能由理性偏好生成。预算集族越丰富，WARP 的约束才越强。"
      ],
      demo: { prompt: "为什么循环不是直接的 WARP 违规？", steps: ["WARP 要同一对 x,y 在两个相关预算场景中出现反向排除。", "这里 x,y 只共同出现在 {x,y}；y,z 与 x,z 也各只出现一次。", "所以没有一对形成 WARP 所禁止的双场反悔。"] },
      practice: { id: "P-L01-M18", prompt: "如果把 {x,y,z} 加入 ℬ 且只能单选，能否同时维持三条成对选择又满足 WARP？", hint: "三元素预算无论选谁，都检查它与另两个对象。", answer: "不能。若大预算选 x，因 z 曾在 {x,z} 中被选，WARP 要求大预算选 z；类似地会迫使多选。单选条件下必然冲突。" }
    },
    {
      id: "L01-M19", sectionId: "L01-S08", title: "理性化定理：由揭示关系造出偏好", minutes: 16, status: "ready", sourceRefs: [src([21,22,23])],
      why: "当 ℬ 包含所有至多三元素的子集且选择满足 WARP，揭示弱偏好 ⪰* 本身就是能解释选择的唯一理性候选。第一步是证明它完备且传递。",
      concept: [
        "定理条件：选择结构满足 WARP；ℬ 包含 X 的所有一、二、三元素子集。候选关系就是 x⪰*y：某个共同预算中 x 被选。",
        "完备性只需二元素预算 {x,y}：C({x,y}) 非空，所以至少选 x 或 y，得到 x⪰*y 或 y⪰*x。",
        "传递性需要三元素预算。已知 x⪰*y、y⪰*z，考察 C({x,y,z}) 的某个被选元素。选 x 直接得到 x⪰*z；选 y 时 WARP 迫使 x 同选；选 z 时先迫使 y 同选，再迫使 x 同选。"
      ],
      proof: { known: "WARP；所有至多三元素集合都在 ℬ；C(B) 非空；x⪰*y、y⪰*z。", goal: "⪰* 完备且传递。", steps: ["用 {x,y} 的非空选择证明任意一对至少一个方向被揭示，故完备。", "取三元素预算 T={x,y,z}，其选择非空。", "若 x∈C(T)，则共同出现直接给 x⪰*z。", "若 y∈C(T)，结合 x⪰*y 与 WARP 得 x∈C(T)，回到上一情形。", "若 z∈C(T)，先由 y⪰*z 得 y∈C(T)，再由 x⪰*y 得 x∈C(T)。", "所有情形均有 x⪰*z，故传递。"], assumptions: "若 x、y、z 有重合，结论更直接；三元素集合表述包含至多三元素子集，避免重合时另行制造元素。" },
      practice: { id: "P-L01-M19", prompt: "完备性为什么只要求所有二元素预算，而传递性要用三元素预算？", hint: "分别看目标涉及几个对象。", answer: "完备只比较 x、y，一次 {x,y} 的非空选择就够；传递要把 x⪰*y 与 y⪰*z 接成 x⪰*z，需要让 x、y、z 同场，再用 WARP 传递选择。" },
      review: { id: "R-L01-07", prompt: "理性化存在定理为何要求预算族包含三元素集合？", answer: "用共同的 {x,y,z} 预算把两条揭示比较接起来，并借 WARP 迫使 x 同时被选，从而证明揭示关系传递。" }
    },
    {
      id: "L01-M20", sectionId: "L01-S08", title: "理性化：两个包含与唯一性", minutes: 18, status: "ready", sourceRefs: [src([24,25,26,27,28,29])],
      why: "证明候选关系理性还不够；还要证明它生成的最优集合恰好等于原选择，并说明没有第二个偏好也能解释同一数据。",
      concept: [
        "要证 C(B)=C*(B,⪰*)，分两个包含。第一边：若 y∈C(B)，那么 y 与 B 中每个 x 同场且 y 被选，故 y⪰*x，所以 y 是 ⪰* 最大元。",
        "第二边：若 z 是 B 中的 ⪰* 最大元，则每个 x∈B 都在某个预算 Bₓ 中与 z 同场且 z 被选。取原选择中任一 y∈C(B)；WARP 把 z 的揭示优势带回 B，得到 z∈C(B)。",
        "唯一性来自所有二元素预算：C({x,y}) 完整暴露任何理性化偏好的成对弱比较。若另一关系在某一对上不同，它生成的二元素选择就会不同，矛盾。"
      ],
      proof: { known: "⪰* 已证理性；WARP；所有二、三元素预算都存在。", goal: "C(B)=C*(B,⪰*) 对所有 B；并证明理性化关系唯一。", steps: ["C(B)⊆C*：任取 y∈C(B)，由揭示定义得 y⪰*x 对每个 x∈B。", "C*⊆C：任取 z∈C*(B,⪰*)，并取 y∈C(B)。由 z⪰*y，存在共同预算中 z 被选；再用 WARP 得 z∈C(B)。", "因此 ⪰* 理性化原选择。", "若另一关系 ⪰ 也理性化但与 ⪰* 不同，存在 x,y 的一个弱比较不同。", "在二元素预算 {x,y} 上，x 是否属于最大元集合恰好对应 x⪰y；两关系将给出不同选择，与都等于 C({x,y}) 矛盾。"], assumptions: "唯一性需要观察到所有二元素预算；若预算族稀疏，未共同出现的对象之间可有多种补全。" },
      practice: { id: "P-L01-M20", prompt: "在 C*⊆C 的证明里，为何能从 z⪰*y 和 y∈C(B) 推出 z∈C(B)？", hint: "z⪰*y 提供另一个共同预算；两个预算之间用什么一致性？", answer: "z⪰*y 表示存在某预算 B₀ 同含 z,y 且 z∈C(B₀)。当前 B 同含 z,y 且 y∈C(B)。WARP 因此要求 z∈C(B)。" },
      review: { id: "R-L01-08", prompt: "一句话说明为什么所有二元素预算带来理性化偏好的唯一性。", answer: "因为 C({x,y}) 精确揭示 x⪰y 与 y⪰x 是否成立，所有成对关系都被选择数据锁定，另一偏好无法在任一对上不同。" }
    }
  ]
};

export const lecture1Exercises = [
  {
    id: "MWG-1.B.1", lectureId: "L01", lessonId: "L01-M08", number: "1.B.1", difficulty: "B", status: "ready",
    original: "Prove property (iii) of Proposition 1.B.1.",
    proposition: "Proposition 1.B.1(iii): If ≿ is rational, then if x ≻ y ≿ z, then x ≻ z.",
    chinese: "证明命题 1.B.1 的性质 (iii)：若弱偏好 ≿ 是理性的，且 x≻y、y≿z，则 x≻z。",
    tests: "能否把严格偏好目标拆开，并在反向部分使用反证与传递性。",
    hints: ["先把 x≻z 拆成 x≿z 与 ¬(z≿x)。", "第一项沿 x≻y 给出的 x≿y 与 y≿z 传递。", "第二项反设 z≿x，会从 y≿z 推出什么？"],
    solution: ["由 x≻y，得 x≿y 且 ¬(y≿x)。由 x≿y、y≿z 与传递性，x≿z。", "反设 z≿x，则由 y≿z、z≿x 与传递性得到 y≿x，和 ¬(y≿x) 矛盾。故 ¬(z≿x)。", "所以 x≿z 且 ¬(z≿x)，即 x≻z。此为教学参考解，不是教材官方答案。"],
    source: "MWG 原 PDF 39 / 印刷 15；被引用命题见原 PDF 31 / 印刷 7"
  },
  {
    id: "MWG-1.B.2", lectureId: "L01", lessonId: "L01-M07", number: "1.B.2", difficulty: "A", status: "ready",
    original: "Prove properties (i) and (ii) of Proposition 1.B.1.",
    proposition: "(i) ≻ is irreflexive and transitive. (ii) ∼ is reflexive, transitive, and symmetric.",
    chinese: "证明命题 1.B.1 的 (i)(ii)：理性弱偏好导出的严格偏好反自反且传递；无差异关系自反、传递且对称。",
    tests: "按定义逐项证明关系性质，明确每一步实际使用完备性、传递性或定义中的哪一项。",
    hints: ["反自反和对称可以直接展开定义。", "证明 ≻ 传递：先得到 x≿z，再反设 z≿x，并利用哪一条已知严格关系制造矛盾？", "证明 ∼ 传递时需要保留两个方向的弱比较。"],
    solution: ["≻ 反自反：x≻x 会同时要求 x≿x 与 ¬(x≿x)，矛盾。", "≻ 传递：若 x≻y、y≻z，则 x≿y≿z，故 x≿z。若 z≿x，则 z≿x≿y，得 z≿y，与 y≻z 中 ¬(z≿y) 矛盾，故 x≻z。", "∼ 自反：完备性用于 (x,x)，得 x≿x，因此 x∼x。对称性由定义交换两项立得。传递性：x∼y、y∼z 给 x≿y≿z 与 z≿y≿x，传递得 x≿z、z≿x，故 x∼z。", "以上是教学参考解，不是教材官方答案。"],
    source: "MWG 原 PDF 39 / 印刷 15；命题原 PDF 31 / 印刷 7"
  },
  {
    id: "MWG-1.C.1", lectureId: "L01", lessonId: "L01-M15", number: "1.C.1", difficulty: "B", status: "ready",
    original: "Consider the choice structure (ℬ,C(·)) with ℬ={{x,y},{x,y,z}} and C({x,y})={x}. Show that if (ℬ,C(·)) satisfies the weak axiom, then we must have C({x,y,z})={x}, ={z}, or ={x,z}.",
    chinese: "考虑 ℬ={{x,y},{x,y,z}} 且 C({x,y})={x}。证明若选择结构满足 WARP，则 C({x,y,z}) 只能是 {x}、{z} 或 {x,z}。",
    tests: "枚举非空子集，并用 WARP 排除‘选择 y 却不选择 x’的所有集合。",
    hints: ["{x,y,z} 的选择必须是它的非空子集。", "因为第一预算里 x 被选且 y 同场，若第二预算选 y，WARP 还要求选谁？", "把 7 个非空子集按‘含 y / 不含 y’分类。"],
    solution: ["三元素集合的 7 个非空选择候选为 {x},{y},{z},{x,y},{x,z},{y,z},{x,y,z}。", "由 C({x,y})={x}，x 在与 y 同场时被选。若大预算选择 y，WARP 要求它也选择 x。因此 {y}、{y,z} 被排除；但 {x,y}、{x,y,z} 为什么也没出现在教材结论？反向应用 WARP：大预算若选 y，与小预算中 x 被选并不会排除同选；所以仅按标准多值 WARP，它们其实允许。", "原题图像列出的结论为 {x}、{z}、{x,z}，这隐含这里的 C({x,y})={x} 与 WARP 定义结合‘若 y 在另一预算被选则两边同选’，会要求 y∈C({x,y})，与已知冲突，因此任何含 y 的大预算都不允许。故剩余恰为三个非空子集。", "教学参考解：若大预算含 y，则 y∈C(B′)。由对称集合版 WARP，必须有 y∈C({x,y})，但已知 C({x,y})={x}，矛盾。"],
    source: "MWG 原 PDF 39 / 印刷 15；题面已按原页图像核对"
  },
  {
    id: "MWG-1.C.2", lectureId: "L01", lessonId: "L01-M16", number: "1.C.2", difficulty: "B", status: "ready",
    original: "Show that the weak axiom (Definition 1.C.1) is equivalent to the following property holding: Suppose that B,B′∈ℬ, that x,y∈B, and that x,y∈B′. Then if x∈C(B) and y∈C(B′), we must have {x,y}⊆C(B) and {x,y}⊆C(B′).",
    chinese: "证明 WARP 等价于：若 B、B′ 都含 x、y，且 x∈C(B)、y∈C(B′)，则两个预算的选择集合都同时包含 x、y。",
    tests: "双向证明，以及对 WARP 交换 x/y、B/B′ 再使用一次。",
    hints: ["WARP 先直接给 x∈C(B′)。", "再交换角色得到 y∈C(B)。", "反方向只需从集合包含式抽出哪一个成员关系？"],
    solution: ["WARP⇒集合式：由 x∈C(B)、y∈C(B′) 及共同可选，WARP 给 x∈C(B′)。交换 x,y 及 B,B′，再得 y∈C(B)。结合两项已知，两个选择集合都含 {x,y}。", "集合式⇒WARP：在 WARP 的前件下，套用该性质立即得到 {x,y}⊆C(B′)，尤其 x∈C(B′)，正是 WARP 结论。", "这是教学参考解，不是教材官方答案。"],
    source: "MWG 原 PDF 39 / 印刷 15；题面已按原页图像核对"
  }
];
