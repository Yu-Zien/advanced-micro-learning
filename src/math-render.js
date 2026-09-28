import katex from "../vendor/katex/katex.mjs";
import renderMathInElement from "../vendor/katex/contrib/auto-render.mjs";

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

export function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

const richTagPattern = /<\/?(?:strong|em|sub|sup|code)>|<br\s*\/?>/gi;

export function safeRichText(value) {
  const tokens = [];
  let tokenized = String(value ?? "").replace(/\\\([\s\S]*?\\\)/g, source => {
    const token = `@@RICH_TAG_${tokens.length}@@`;
    tokens.push({ value: source, rawHtml: false });
    return token;
  });
  tokenized = tokenized.replace(richTagPattern, tag => {
    const token = `@@RICH_TAG_${tokens.length}@@`;
    tokens.push({ value: tag, rawHtml: true });
    return token;
  });
  const inlineExpression = /([A-Za-zα-ωΑ-Ω∂∇Σ∑ℝℚ𝒫ℬ][A-Za-z0-9α-ωΑ-Ω₀-₉ₖₗ⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᴸ{}()[\],.'′″·+\-*\/\s]*?(?:<|>|≤|≥|=|≠|∈|∉|⊆|⇒|⇔|⪰|≻|∼)[A-Za-z0-9α-ωΑ-Ωℝℚ𝒫ℬ₀-₉ₖₗ⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᴸ{}()[\],.'′″·+\-*\/\s<>=≤≥≠∈∉⊆⇒⇔⪰≻∼]*(?=[，。；：？！]|$))/gu;
  tokenized = tokenized.replace(inlineExpression, expression => {
    const token = `@@RICH_TAG_${tokens.length}@@`;
    tokens.push({ value: `\\(${legacyMathToTex(expression.trim())}\\)`, rawHtml: false });
    return token;
  });
  let escaped = escapeHtml(tokenized);
  tokens.forEach((tokenValue, index) => {
    escaped = escaped.replace(`@@RICH_TAG_${index}@@`, tokenValue.rawHtml ? tokenValue.value : escapeHtml(tokenValue.value));
  });
  return escaped;
}

export function controlledTableHtml(value = "") {
  if (!value) return "";
  const input = String(value);
  if (/<(?:script|style|iframe)|\son\w+\s*=|javascript:/i.test(input)) {
    throw new Error("受控表格中出现不允许的 HTML。");
  }
  const allowed = /<\/?(?:table|thead|tbody|tr|th|td)(?:\s+class="object-levels")?>/gi;
  const tokens = [];
  const tokenized = input.replace(allowed, tag => {
    const token = `@@TABLE_TAG_${tokens.length}@@`;
    tokens.push(tag);
    return token;
  });
  let escaped = escapeHtml(tokenized);
  tokens.forEach((tag, index) => {
    escaped = escaped.replace(`@@TABLE_TAG_${index}@@`, tag);
  });
  return escaped;
}

const subscriptMap = {
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4",
  "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
  "ₐ": "a", "ₑ": "e", "ₕ": "h", "ᵢ": "i", "ⱼ": "j", "ₖ": "k", "ₗ": "\\ell ",
  "ₘ": "m", "ₙ": "n", "ₒ": "o", "ₚ": "p", "ᵣ": "r", "ₛ": "s", "ₜ": "t", "ₓ": "x",
  "₋": "-", "₊": "+"
};

const superscriptMap = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
  "ⁿ": "n", "ᴸ": "L"
};

const exactTeX = new Map([
  ["a∈K₁，K₁⊆X，K₁∈𝒫", "a\\in K_1,\\qquad K_1\\subseteq X,\\qquad K_1\\in\\mathcal{P}"],
  ["K₁∪K₂∪K₃=X", "K_1\\cup K_2\\cup K_3=X"],
  ["Kᵢ∩Kⱼ=∅（i≠j）", "K_i\\cap K_j=\\varnothing\\qquad(i\\ne j)"],
  ["[x]ᵣ={y∈X:yRx}", "[x]_R=\\{y\\in X:yRx\\}"],
  ["[a]ᵣ=[b]ᵣ={a,b}", "[a]_R=[b]_R=\\{a,b\\}"],
  ["u:X→ℝ", "u:X\\to\\mathbb{R}"],
  ["x⪰y ⇔ u(x)≥u(y)", "x\\succeq y\\Longleftrightarrow u(x)\\ge u(y)"],
  ["u⁻¹({3})={a,b}，u⁻¹({2})={c,d}，u⁻¹({1})={e}", "u^{-1}(\\{3\\})=\\{a,b\\},\\quad u^{-1}(\\{2\\})=\\{c,d\\},\\quad u^{-1}(\\{1\\})=\\{e\\}"],
  ["u⁻¹({4})=∅", "u^{-1}(\\{4\\})=\\varnothing"],
  ["u(X)={1,2,3}", "u(X)=\\{1,2,3\\}"],
  ["𝒫ᵤ={u⁻¹({t}):t∈u(X)}", "\\mathcal{P}_u=\\{u^{-1}(\\{t\\}):t\\in u(X)\\}"],
  ["x⪰*y ⇔ ∃B∈ℬ: x,y∈B 且 x∈C(B)", "x\\succeq^*y\\Longleftrightarrow\\exists B\\in\\mathcal{B}:x,y\\in B\\ \\text{且}\\ x\\in C(B)"],
  ["x⪰*y ⇒ 不存在 y 被选而 x 同场未选的反向严格揭示", "x\\succeq^*y\\Longrightarrow\\text{不存在反向严格揭示}"],
  ["D_w x=(∂x₁/∂w,…,∂xᴸ/∂w)ᵀ", "D_wx=\\left(\\frac{\\partial x_1}{\\partial w},\\ldots,\\frac{\\partial x_L}{\\partial w}\\right)^{\\mathsf T}"],
  ["Dₚx=[∂xℓ/∂pₖ]_{L×L}", "D_px=\\left[\\frac{\\partial x_\\ell}{\\partial p_k}\\right]_{L\\times L}"],
  ["Dₚx·p+D_wx·w=0_L", "D_px\\,p+D_wx\\,w=0_L"],
  ["Σₖ(∂xₗ/∂pₖ)pₖ+(∂xₗ/∂w)w=0", "\\sum_{k=1}^{L}\\frac{\\partial x_\\ell}{\\partial p_k}p_k+\\frac{\\partial x_\\ell}{\\partial w}w=0"],
  ["∑ₖ εℓk+εℓw=0", "\\sum_{k=1}^{L}\\varepsilon_{\\ell k}+\\varepsilon_{\\ell w}=0"],
  ["pᵀDₚx+xᵀ=0ᵀ", "p^{\\mathsf T}D_px+x^{\\mathsf T}=0^{\\mathsf T}"],
  ["pᵀD_wx=1", "p^{\\mathsf T}D_wx=1"],
  ["∂[pₗxₗ]/∂pₖ=(∂pₗ/∂pₖ)xₗ+pₗ(∂xₗ/∂pₖ)", "\\frac{\\partial(p_\\ell x_\\ell)}{\\partial p_k}=\\frac{\\partial p_\\ell}{\\partial p_k}x_\\ell+p_\\ell\\frac{\\partial x_\\ell}{\\partial p_k}"],
  ["Σₗpₗ(∂xₗ/∂pₖ)+xₖ=0", "\\sum_{\\ell=1}^{L}p_\\ell\\frac{\\partial x_\\ell}{\\partial p_k}+x_k=0"],
  ["S(p,w)=Dₚx+D_wx·xᵀ", "S(p,w)=D_px+D_wx\\,x^{\\mathsf T}"],
  ["dx=Dₚx·dp+Dwx·dw", "dx=D_px\\,dp+D_wx\\,dw"],
  ["dw=xᵀdp", "dw=x^{\\mathsf T}dp"],
  ["(Dwx·xᵀ)ₗₖ=(∂xₗ/∂w)xₖ", "\\left(D_wx\\,x^{\\mathsf T}\\right)_{\\ell k}=\\frac{\\partial x_\\ell}{\\partial w}x_k"],
  ["sℓk=∂xℓ/∂pₖ+(∂xℓ/∂w)xₖ", "s_{\\ell k}=\\frac{\\partial x_\\ell}{\\partial p_k}+\\frac{\\partial x_\\ell}{\\partial w}x_k"],
  ["sℓℓ≤0", "s_{\\ell\\ell}\\le0"],
  ["pᵀS=0ᵀ_L", "p^{\\mathsf T}S=0_L^{\\mathsf T}"],
  ["Dₚh=D²ₚe ⪯0", "D_ph=D_p^2e\\preceq0"],
  ["Dₚh=(Dₚh)ᵀ", "D_ph=(D_ph)^{\\mathsf T}"],
  ["Dₚh·p=0", "D_ph\\,p=0"],
  ["h(p,u)=∇ₚe(p,u)", "h(p,u)=\\nabla_pe(p,u)"],
  ["∂e(p,u)/∂pₖ=hₖ(p,u)", "\\frac{\\partial e(p,u)}{\\partial p_k}=h_k(p,u)"],
  ["∂hℓ/∂pk=∂xℓ/∂pk+(∂xℓ/∂w)xk", "\\frac{\\partial h_\\ell}{\\partial p_k}=\\frac{\\partial x_\\ell}{\\partial p_k}+\\frac{\\partial x_\\ell}{\\partial w}x_k"],
  ["Dₚh(p,v(p,w))=S(p,w)", "D_ph(p,v(p,w))=S(p,w)"],
  ["∂hₗ/∂pₖ=∂xₗ/∂pₖ+(∂xₗ/∂w)(∂e/∂pₖ)", "\\frac{\\partial h_\\ell}{\\partial p_k}=\\frac{\\partial x_\\ell}{\\partial p_k}+\\frac{\\partial x_\\ell}{\\partial w}\\frac{\\partial e}{\\partial p_k}"],
  ["∂u/∂xℓ≤λpℓ；xℓ(∂u/∂xℓ-λpℓ)=0", "\\frac{\\partial u}{\\partial x_\\ell}\\le\\lambda p_\\ell,\\qquad x_\\ell\\left(\\frac{\\partial u}{\\partial x_\\ell}-\\lambda p_\\ell\\right)=0"],
  ["x≫0 ⇒ MRSℓk=pℓ/pk", "x\\gg0\\Longrightarrow\\operatorname{MRS}_{\\ell k}=\\frac{p_\\ell}{p_k}"],
  ["∂u/∂xₗ≤λpₗ", "\\frac{\\partial u}{\\partial x_\\ell}\\le\\lambda p_\\ell"],
  ["xₗ[∂u/∂xₗ−λpₗ]=0", "x_\\ell\\left(\\frac{\\partial u}{\\partial x_\\ell}-\\lambda p_\\ell\\right)=0"],
  ["v(p,w)=max_{x≥0,p·x≤w}u(x)", "v(p,w)=\\max_{x\\ge0,\\ p\\cdot x\\le w}u(x)"],
  ["h(p,ū)=argmin_{x≥0,u(x)≥ū}p·x", "h(p,\\bar u)=\\operatorname*{argmin}_{x\\ge0,\\ u(x)\\ge\\bar u}p\\cdot x"],
  ["e(p,ū)=min p·x", "e(p,\\bar u)=\\min_{x\\ge0,\\ u(x)\\ge\\bar u}p\\cdot x"],
  ["‖y−x‖=√Σₗ(yₗ−xₗ)²", "\\lVert y-x\\rVert=\\sqrt{\\sum_{\\ell=1}^{L}(y_\\ell-x_\\ell)^2}"],
  ["B(x,ε)∩X={y∈X:‖y−x‖≤ε}", "B(x,\\varepsilon)\\cap X=\\{y\\in X:\\lVert y-x\\rVert\\le\\varepsilon\\}"],
  ["p≫0 ⇒ 0≤xₗ≤w/pₗ", "p\\gg0\\Longrightarrow0\\le x_\\ell\\le\\frac{w}{p_\\ell}"],
  ["连续 u + 非空紧 Bₚ,ᵥ ⇒ ∃x*∈Bₚ,ᵥ 取得 max u", "\\text{连续 }u+\\text{非空紧 }B_{p,w}\\Longrightarrow\\exists x^*\\in B_{p,w}\\text{ 取得 }\\max u"],
  ["S 负半定 ⇔ ∀v，vᵀSv≤0", "S\\text{ 负半定}\\Longleftrightarrow\\forall v,\\ v^{\\mathsf T}Sv\\le0"],
  ["eₗᵀSeₗ=sₗₗ≤0", "e_\\ell^{\\mathsf T}Se_\\ell=s_{\\ell\\ell}\\le0"],
  ["e(p,u)=u²p₁p₂/[4D]", "e(p,u)=\\frac{u^2p_1p_2}{4D}"],
  ["v(p,w)=2√(wD/(p₁p₂))", "v(p,w)=2\\sqrt{\\frac{wD}{p_1p_2}}"],
  ["xₗ(p,w)=−(∂v/∂pₗ)/(∂v/∂w)，要求 ∂v/∂w≠0", "x_\\ell(p,w)=-\\frac{\\partial v/\\partial p_\\ell}{\\partial v/\\partial w},\\qquad \\frac{\\partial v}{\\partial w}\\ne0"],
  ["AV=∫_{pℓ¹}^{pℓ⁰}xℓ(pℓ,p₋ℓ,w)dpℓ", "\\operatorname{AV}=\\int_{p_\\ell^1}^{p_\\ell^0}x_\\ell(p_\\ell,p_{-\\ell},w)\\,dp_\\ell"],
  ["Y={y∈ℝᴸ:F(y)≤0}", "Y=\\{y\\in\\mathbb{R}^L:F(y)\\le0\\}"],
  ["frontier={y:F(y)=0}", "\\operatorname{frontier}(Y)=\\{y:F(y)=0\\}"],
  ["MRTℓk=Fℓ/Fk", "\\operatorname{MRT}_{\\ell k}=\\frac{F_\\ell}{F_k}"],
  ["MRTSℓk=fℓ/fk", "\\operatorname{MRTS}_{\\ell k}=\\frac{f_\\ell}{f_k}"],
  ["π(p)=sup{p·y:y∈Y}", "\\pi(p)=\\sup_{y\\in Y}p\\cdot y"],
  ["y(p)=argmax{p·y:y∈Y}", "y(p)=\\operatorname*{argmax}_{y\\in Y}p\\cdot y"],
  ["p=λ∇F(y*)", "p=\\lambda\\nabla F(y^*)"],
  ["MRTℓk(y*)=pℓ/pk", "\\operatorname{MRT}_{\\ell k}(y^*)=\\frac{p_\\ell}{p_k}"],
  ["max_{z≥0} pf(z)-w·z", "\\max_{z\\ge0}\\{pf(z)-w\\cdot z\\}"],
  ["c(w,q)=min{w·z:f(z)≥q,z≥0}", "c(w,q)=\\min_{z\\ge0}\\{w\\cdot z:f(z)\\ge q\\}"],
  ["λfℓ(z*)≤wℓ；zℓ*>0⇒=", "\\lambda f_\\ell(z^*)\\le w_\\ell,\\qquad z_\\ell^*>0\\Longrightarrow\\lambda f_\\ell(z^*)=w_\\ell"],
  ["∇_w c(w,q)=z(w,q)", "\\nabla_wc(w,q)=z(w,q)"],
  ["D_wz=D²_wc⪯0", "D_wz=D_w^2c\\preceq0"],
  ["q*>0 ⇒ p=MC(q*)", "q^*>0\\Longrightarrow p=MC(q^*)"],
  ["AC′(q)=[qC′(q)−C(q)]/q²", "AC'(q)=\\frac{qC'(q)-C(q)}{q^2}"],
  ["AC′(q̄)=0 ⇒ MC(q̄)=AC(q̄)", "AC'(\\bar q)=0\\Longrightarrow MC(\\bar q)=AC(\\bar q)"],
  ["ANSC(q)=[C_V(q)+K_NS]/q", "ANSC(q)=\\frac{C_V(q)+K_{NS}}{q}"],
  ["π(q)−π(0)=q[p−ANSC(q)]", "\\pi(q)-\\pi(0)=q\\left[p-ANSC(q)\\right]"],
  ["p=min ANSC ⇒ q*∈{0}∪argmin ANSC", "p=\\min_{q>0}ANSC(q)\\Longrightarrow q^*\\in\\{0\\}\\cup\\operatorname*{argmin}_{q>0}ANSC(q)"],
  ["∫ₐᵇq(p)dp=−∫ᵦᵃq(p)dp", "\\int_a^b q(p)\\,dp=-\\int_b^a q(p)\\,dp"]
]);

function replaceUnicodeScripts(input) {
  let output = input.replace(/([A-Za-z\)\}])ᴸ/g, "$1_{L}");
  output = output.replace(/([A-Za-z\)])([₀-₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜₓ₋₊]+)/g, (_, base, chars) => {
    const sub = [...chars].map(char => subscriptMap[char] || char).join("");
    return `${base}_{${sub}}`;
  });
  output = output.replace(/([A-Za-z\)\]])([⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᴸ]+)/g, (_, base, chars) => {
    const sup = [...chars].map(char => superscriptMap[char] || char).join("");
    return `${base}^{${sup}}`;
  });
  output = output.replace(/([₀-₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜₓ₋₊]+)/g, chars => {
    const sub = [...chars].map(char => subscriptMap[char] || char).join("");
    return `_{${sub}}`;
  });
  return output;
}

function wrapChineseText(input) {
  return input.replace(/[\u3400-\u9fff]+/g, text => `\\text{${text}}`);
}

export function legacyMathToTex(value) {
  if (exactTeX.has(String(value ?? ""))) return exactTeX.get(String(value ?? ""));
  let text = String(value ?? "")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replaceAll("{", "\\lbrace ")
    .replaceAll("}", "\\rbrace ")
    .replace(/\[([^\]]+)\]/g, "\\left[$1\\right]")
    .replace(/‖([^‖]+)‖/g, "\\lVert $1\\rVert")
    .replace(/u⁻¹/g, "u^{-1}")
    .replace(/([A-Za-zε])ℓ([A-Za-z])/g, "$1_{\\ell $2}")
    .replace(/([A-Za-z])ℓ/g, "$1_{\\ell}")
    .replace(/([A-Za-z])k/g, "$1_k")
    .replace(/ℓ/g, "\\ell")
    .replace(/ℝᴸ/g, "\\mathbb{R}^{L}")
    .replace(/ℚ/g, "\\mathbb{Q}")
    .replace(/ℝ/g, "\\mathbb{R}")
    .replace(/𝒫/g, "\\mathcal{P}")
    .replace(/ℬ/g, "\\mathcal{B}")
    .replace(/∂/g, "\\partial ")
    .replace(/[Σ∑]/g, "\\sum ")
    .replace(/∇/g, "\\nabla ")
    .replace(/∫/g, "\\int ")
    .replace(/√\[([^\]]+)\]/g, "\\sqrt{$1}")
    .replace(/√\(([^()]*)\)/g, "\\sqrt{$1}")
    .replace(/√([A-Za-z][₀-₉ₖₗ]*)/g, "\\sqrt{$1}")
    .replace(/⪰/g, "\\succeq ")
    .replace(/≻/g, "\\succ ")
    .replace(/∼/g, "\\sim ")
    .replace(/⪯/g, "\\preceq ")
    .replace(/∈/g, "\\in ")
    .replace(/∉/g, "\\notin ")
    .replace(/⊆/g, "\\subseteq ")
    .replace(/∪/g, "\\cup ")
    .replace(/∩/g, "\\cap ")
    .replace(/∅/g, "\\varnothing ")
    .replace(/∀/g, "\\forall ")
    .replace(/∃/g, "\\exists ")
    .replace(/¬/g, "\\neg ")
    .replace(/⇒/g, "\\Rightarrow ")
    .replace(/⇔/g, "\\Longleftrightarrow ")
    .replace(/→/g, "\\to ")
    .replace(/≥/g, "\\ge ")
    .replace(/≤/g, "\\le ")
    .replace(/≠/g, "\\ne ")
    .replace(/≫/g, "\\gg ")
    .replace(/≈/g, "\\approx ")
    .replace(/·/g, "\\cdot ")
    .replace(/×/g, "\\times ")
    .replace(/−/g, "-")
    .replace(/′/g, "'")
    .replace(/″/g, "''")
    .replace(/ᵀ/g, "^{\\mathsf T}")
    .replace(/α/g, "\\alpha ")
    .replace(/λ/g, "\\lambda ")
    .replace(/ε/g, "\\varepsilon ")
    .replace(/Δ/g, "\\Delta ")
    .replace(/π/g, "\\pi ")
    .replace(/ρ/g, "\\rho ")
    .replace(/ū/g, "\\bar u")
    .replace(/p̄/g, "\\bar p")
    .replace(/w̄/g, "\\bar w")
    .replace(/x̄/g, "\\bar x")
    .replace(/\bargmax\b/g, "\\operatorname*{argmax}")
    .replace(/\bargmin\b/g, "\\operatorname*{argmin}")
    .replace(/\bmax\b/g, "\\max")
    .replace(/\bmin\b/g, "\\min")
    .replace(/\bsup\b/g, "\\sup")
    .replace(/\bfrontier\b/g, "\\operatorname{frontier}")
    .replace(/\b(MRTS|MRT|MRS)\b/g, (_, name) => `\\operatorname{${name}}`)
    .replace(/\bLNS\b/g, "\\operatorname{LNS}")
    .replace(/\bDWL\b/g, "\\operatorname{DWL}")
    .replace(/\bEV\b/g, "\\operatorname{EV}")
    .replace(/\bCV\b/g, "\\operatorname{CV}")
    .replace(/\bAV\b/g, "\\operatorname{AV}")
    .replace(/：/g, "\\colon\\quad ")
    .replace(/，/g, ",\\quad ")
    .replace(/；/g, ";\\quad ")
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .replace(/ 且 /g, " \\;\\text{且}\\; ")
    .replace(/ 或 /g, " \\;\\text{或}\\; ")
    .replace(/不存在/g, "\\text{不存在}")
    .replace(/被选而/g, "\\text{被选而}")
    .replace(/同场未选的反向严格揭示/g, "\\text{同场未选的反向严格揭示}")
    .replace(/两商品/g, "\\text{两商品}")
    .replace(/商品/g, "\\text{商品}")
    .replace(/取得/g, "\\text{取得}")
    .replace(/连续/g, "\\text{连续}")
    .replace(/非空紧/g, "\\text{非空紧}")
    .replace(/负半定/g, "\\text{负半定}")
    .replace(/技术凸/g, "\\text{技术凸}")
    .replace(/凹/g, "\\text{凹}")
    .replace(/位似/g, "\\text{位似}")
    .replace(/拟线性/g, "\\text{拟线性}")
    .replace(/理性/g, "\\text{理性}")
    .replace(/完备且传递/g, "\\text{完备且传递}")
    .replace(/自反/g, "\\text{自反}")
    .replace(/反自反/g, "\\text{反自反}")
    .replace(/非对称/g, "\\text{非对称}")
    .replace(/反对称/g, "\\text{反对称}")
    .replace(/对称/g, "\\text{对称}")
    .replace(/传递/g, "\\text{传递}")
    .replace(/完备/g, "\\text{完备}");
  text = replaceUnicodeScripts(text);
  text = wrapChineseText(text);
  return text.replace(/\\text\{\\text\{([^{}]+)\}\}/g, "\\text{$1}");
}

export function mathBlock(value) {
  const tex = typeof value === "object" && value?.tex ? value.tex : legacyMathToTex(value);
  const accessibleLabel = typeof value === "object" ? (value.label || value.tex || "数学公式") : value;
  return `<div class="math" data-tex="${escapeAttribute(tex)}" aria-label="${escapeAttribute(String(accessibleLabel))}"></div>`;
}

export function inlineTex(tex) {
  return `\\(${tex}\\)`;
}

export function renderMath(root) {
  const errors = [];
  root.querySelectorAll("[data-tex]").forEach(node => {
    const tex = node.dataset.tex;
    try {
      katex.render(tex, node, { displayMode: true, throwOnError: true, strict: "ignore", trust: false });
    } catch (error) {
      errors.push({ tex, message: error.message });
      node.classList.add("math-error");
      node.textContent = tex;
    }
  });
  try {
    renderMathInElement(root, {
      delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: true,
      strict: "ignore",
      trust: false,
      errorCallback: (message, error) => errors.push({ tex: error?.token?.text || "inline", message })
    });
  } catch (error) {
    errors.push({ tex: "inline", message: error.message });
  }
  if (errors.length) console.error("KaTeX 公式渲染失败", errors);
  root.dataset.mathErrors = String(errors.length);
  return errors;
}

export { katex };
