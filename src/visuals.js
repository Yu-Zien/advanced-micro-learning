const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function budgetGeometry(p1, p2, wealth) {
  const safeP1 = Math.max(0.1, Number(p1));
  const safeP2 = Math.max(0.1, Number(p2));
  const safeWealth = Math.max(0, Number(wealth));
  return {
    p1: safeP1,
    p2: safeP2,
    wealth: safeWealth,
    x1Intercept: safeWealth / safeP1,
    x2Intercept: safeWealth / safeP2,
    slope: -safeP1 / safeP2
  };
}

export function convexMix(alpha) {
  const a = clamp(Number(alpha), 0, 1);
  const A = { x1: 1, x2: 4 };
  const B = { x1: 4, x2: 1 };
  const mix = {
    x1: a * A.x1 + (1 - a) * B.x1,
    x2: a * A.x2 + (1 - a) * B.x2
  };
  return { alpha: a, A, B, mix, endpointUtility: 4, mixUtility: mix.x1 * mix.x2 };
}

export function costGeometry(fixedCost) {
  const K = clamp(Number(fixedCost), 1, 36);
  const efficientScale = Math.sqrt(K);
  const minimumAverageCost = 2 * efficientScale;
  return { fixedCost: K, efficientScale, minimumAverageCost, marginalCost: 2 * efficientScale };
}

function point(x, y, xMax, yMax) {
  const left = 44;
  const top = 16;
  const width = 300;
  const height = 190;
  return {
    x: left + (x / xMax) * width,
    y: top + height - (y / yMax) * height
  };
}

function budgetSvg(values) {
  const xMax = Math.max(6, values.x1Intercept * 1.15);
  const yMax = Math.max(6, values.x2Intercept * 1.15);
  const xEnd = point(values.x1Intercept, 0, xMax, yMax);
  const yEnd = point(0, values.x2Intercept, xMax, yMax);
  return `<svg viewBox="0 0 370 235" role="img" aria-label="两商品预算集教学图">
    <path d="M44 206 L${xEnd.x.toFixed(1)} 206 L44 ${yEnd.y.toFixed(1)} Z" class="svg-fill" />
    <line x1="44" y1="206" x2="350" y2="206" class="svg-axis" />
    <line x1="44" y1="206" x2="44" y2="12" class="svg-axis" />
    <line x1="${yEnd.x}" y1="${yEnd.y.toFixed(1)}" x2="${xEnd.x.toFixed(1)}" y2="${xEnd.y}" class="svg-main" />
    <text x="350" y="225" text-anchor="end">x₁</text><text x="26" y="20">x₂</text>
    <text x="${xEnd.x.toFixed(1)}" y="224" text-anchor="middle">${values.x1Intercept.toFixed(1)}</text>
    <text x="36" y="${(yEnd.y + 4).toFixed(1)}" text-anchor="end">${values.x2Intercept.toFixed(1)}</text>
  </svg>`;
}

function convexSvg(values) {
  const A = point(values.A.x1, values.A.x2, 5, 5);
  const B = point(values.B.x1, values.B.x2, 5, 5);
  const M = point(values.mix.x1, values.mix.x2, 5, 5);
  return `<svg viewBox="0 0 370 235" role="img" aria-label="两个无差异消费束的凸组合教学图">
    <line x1="44" y1="206" x2="350" y2="206" class="svg-axis" />
    <line x1="44" y1="206" x2="44" y2="12" class="svg-axis" />
    <line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" class="svg-guide" />
    <circle cx="${A.x}" cy="${A.y}" r="5" class="svg-point" /><text x="${A.x - 8}" y="${A.y - 9}">A</text>
    <circle cx="${B.x}" cy="${B.y}" r="5" class="svg-point" /><text x="${B.x + 7}" y="${B.y - 9}">B</text>
    <circle cx="${M.x}" cy="${M.y}" r="7" class="svg-focus" /><text x="${M.x + 9}" y="${M.y + 4}">混合束</text>
    <text x="350" y="225" text-anchor="end">x₁</text><text x="26" y="20">x₂</text>
  </svg>`;
}

function costSvg(values) {
  const qMax = 10;
  const yMax = 22;
  const acPoints = [];
  const mcPoints = [];
  for (let q = 0.5; q <= qMax; q += 0.25) {
    const ac = values.fixedCost / q + q;
    const mc = 2 * q;
    const acP = point(q, Math.min(ac, yMax), qMax, yMax);
    const mcP = point(q, Math.min(mc, yMax), qMax, yMax);
    acPoints.push(`${acP.x.toFixed(1)},${acP.y.toFixed(1)}`);
    mcPoints.push(`${mcP.x.toFixed(1)},${mcP.y.toFixed(1)}`);
  }
  const E = point(values.efficientScale, values.minimumAverageCost, qMax, yMax);
  return `<svg viewBox="0 0 370 235" role="img" aria-label="平均成本边际成本与有效规模教学图">
    <line x1="44" y1="206" x2="350" y2="206" class="svg-axis" />
    <line x1="44" y1="206" x2="44" y2="12" class="svg-axis" />
    <polyline points="${acPoints.join(" ")}" class="svg-main" fill="none" />
    <polyline points="${mcPoints.join(" ")}" class="svg-secondary" fill="none" />
    <line x1="${E.x}" y1="206" x2="${E.x}" y2="${E.y}" class="svg-guide" />
    <circle cx="${E.x}" cy="${E.y}" r="7" class="svg-focus" />
    <text x="${E.x + 8}" y="${E.y - 8}">AC=MC</text><text x="310" y="82">MC</text><text x="310" y="142">AC</text>
    <text x="350" y="225" text-anchor="end">q</text><text x="22" y="20">成本</text>
  </svg>`;
}

function dwlSvg() {
  return `<svg viewBox="0 0 420 255" role="img" aria-label="Hicks 无谓损失与普通需求近似的面积分解图">
    <defs><pattern id="dwl-hatch" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6 L6 0" stroke="currentColor" stroke-opacity=".15" /></pattern></defs>
    <line x1="48" y1="218" x2="396" y2="218" class="svg-axis"/><line x1="48" y1="218" x2="48" y2="18" class="svg-axis"/>
    <line x1="48" y1="62" x2="385" y2="62" class="svg-guide"/><line x1="48" y1="172" x2="385" y2="172" class="svg-guide"/>
    <path d="M94 36 C115 78 142 132 188 205" class="svg-secondary" fill="none"/>
    <path d="M170 35 C188 78 228 130 332 205" class="svg-main" fill="none"/>
    <path d="M82 38 C132 84 188 133 360 194" class="svg-guide" fill="none" style="stroke-width:3;stroke-dasharray:none"/>
    <path d="M105 62 C120 94 139 134 160 172 L235 172 C190 136 153 99 132 62 Z" fill="var(--accent-soft)" opacity=".95"/>
    <path d="M132 62 C153 99 190 136 235 172 L269 172 C210 128 177 91 158 62 Z" fill="url(#dwl-hatch)"/>
    <text x="148" y="126" text-anchor="middle">B</text><text x="202" y="128" text-anchor="middle">C</text>
    <text x="397" y="238" text-anchor="end">xℓ</text><text x="29" y="22">pℓ</text>
    <text x="55" y="58">p¹</text><text x="55" y="168">p⁰</text>
    <text x="247" y="96">普通需求 xℓ</text><text x="221" y="35">补偿需求</text>
  </svg>`;
}

function productionConvexSvg() {
  return `<svg viewBox="0 0 420 255" role="img" aria-label="凸生产集的等利润线与成本曲线图">
    <line x1="45" y1="210" x2="390" y2="210" class="svg-axis"/><line x1="330" y1="230" x2="330" y2="20" class="svg-axis"/>
    <path d="M52 58 C150 58 258 80 330 205 L52 205 Z" class="svg-fill"/>
    <path d="M52 58 C150 58 258 80 330 205" class="svg-main" fill="none"/>
    <line x1="75" y1="35" x2="355" y2="183" class="svg-secondary"/>
    <circle cx="228" cy="116" r="6" class="svg-focus"/><line x1="228" y1="116" x2="228" y2="210" class="svg-guide"/>
    <text x="343" y="31">q</text><text x="370" y="232">−z</text><text x="117" y="154">Y（凸）</text><text x="245" y="105">(−z*,q*)</text>
    <text x="87" y="30">等利润线：pq−z=π(p)，斜率 −1/p</text>
  </svg>`;
}

function productionNonconvexSvg() {
  return `<svg viewBox="0 0 420 255" role="img" aria-label="非沉没启动成本造成的非凸技术与停产选择图">
    <line x1="45" y1="210" x2="390" y2="210" class="svg-axis"/><line x1="330" y1="230" x2="330" y2="20" class="svg-axis"/>
    <path d="M72 62 C170 62 260 85 295 196 L72 196 Z" class="svg-fill"/>
    <path d="M72 62 C170 62 260 85 295 196" class="svg-main" fill="none"/>
    <line x1="104" y1="40" x2="340" y2="188" class="svg-secondary"/><line x1="118" y1="32" x2="354" y2="180" class="svg-guide" style="stroke-dasharray:none"/>
    <circle cx="0" cy="0" r="0"/><circle cx="330" cy="210" r="6" class="svg-focus"/><circle cx="252" cy="132" r="6" class="svg-point"/>
    <line x1="252" y1="132" x2="252" y2="210" class="svg-guide"/>
    <text x="343" y="31">q</text><text x="370" y="232">−z</text><text x="118" y="154">Y（非凸）</text><text x="205" y="122">候选 (−ẑ,q̂)</text>
    <text x="160" y="238">停产 (0,0) 的利润更高</text>
  </svg>`;
}

export function renderVisual(spec) {
  if (!spec) return "";
  if (spec.type === "budget") {
    const values = budgetGeometry(2, 1, 6);
    return `<figure class="interactive-figure" data-visual="budget">
      <div class="label">教学自绘 · 可互动</div><h3>${spec.title}</h3>
      <div class="visual-stage">${budgetSvg(values)}</div>
      <div class="visual-controls">
        <label>p₁ <input data-control="p1" type="range" min="1" max="5" step=".5" value="2"></label>
        <label>p₂ <input data-control="p2" type="range" min="1" max="5" step=".5" value="1"></label>
        <label>w <input data-control="wealth" type="range" min="2" max="20" step="1" value="6"></label>
      </div><output>截距 (${values.x1Intercept.toFixed(1)}, 0)、(0, ${values.x2Intercept.toFixed(1)})；斜率 ${values.slope.toFixed(2)}</output>
      <figcaption>${spec.caption}</figcaption></figure>`;
  }
  if (spec.type === "convex") {
    const values = convexMix(0.5);
    return `<figure class="interactive-figure" data-visual="convex">
      <div class="label">教学自绘 · 可互动</div><h3>${spec.title}</h3>
      <div class="visual-stage">${convexSvg(values)}</div>
      <div class="visual-controls"><label>α <input data-control="alpha" type="range" min="0" max="1" step=".05" value=".5"></label></div>
      <output>混合束 (${values.mix.x1.toFixed(2)}, ${values.mix.x2.toFixed(2)})，u=${values.mixUtility.toFixed(2)}；端点效用均为4</output>
      <figcaption>${spec.caption}</figcaption></figure>`;
  }
  if (spec.type === "cost") {
    const values = costGeometry(16);
    return `<figure class="interactive-figure" data-visual="cost">
      <div class="label">教学自绘 · 可互动</div><h3>${spec.title}</h3>
      <div class="visual-stage">${costSvg(values)}</div>
      <div class="visual-controls"><label>固定成本 K <input data-control="fixedCost" type="range" min="1" max="36" step="1" value="16"></label></div>
      <output>有效规模 q̄=${values.efficientScale.toFixed(2)}；最低 AC=MC=${values.minimumAverageCost.toFixed(2)}</output>
      <figcaption>${spec.caption}</figcaption></figure>`;
  }
  if (spec.type === "dwl") {
    return `<figure class="interactive-figure" data-visual="dwl"><div class="label">教学自绘 · 对照 L04 PPT 第27—28页</div><h3>${spec.title}</h3><div class="visual-stage">${dwlSvg()}</div><output>DWL=B；DWL_AV=B+C；近似误差=C</output><figcaption>${spec.caption}</figcaption></figure>`;
  }
  if (spec.type === "production-convex") {
    return `<figure class="interactive-figure" data-visual="production-convex"><div class="label">教学自绘 · 对照 L05 PPT 第32页</div><h3>${spec.title}</h3><div class="visual-stage">${productionConvexSvg()}</div><output>凸技术：切线斜率条件与全局最优一致</output><figcaption>${spec.caption}</figcaption></figure>`;
  }
  if (spec.type === "production-nonconvex") {
    return `<figure class="interactive-figure" data-visual="production-nonconvex"><div class="label">教学自绘 · 对照 L05 PPT 第33—34页</div><h3>${spec.title}</h3><div class="visual-stage">${productionNonconvexSvg()}</div><output>非凸技术：p=MC 的正产量候选仍可能输给停产</output><figcaption>${spec.caption}</figcaption></figure>`;
  }
  return "";
}

export function bindVisuals(root) {
  root.querySelectorAll("[data-visual]").forEach(figure => {
    figure.addEventListener("input", () => {
      const stage = figure.querySelector(".visual-stage");
      const output = figure.querySelector("output");
      if (figure.dataset.visual === "budget") {
        const values = budgetGeometry(
          figure.querySelector('[data-control="p1"]').value,
          figure.querySelector('[data-control="p2"]').value,
          figure.querySelector('[data-control="wealth"]').value
        );
        stage.innerHTML = budgetSvg(values);
        output.textContent = `截距 (${values.x1Intercept.toFixed(1)}, 0)、(0, ${values.x2Intercept.toFixed(1)})；斜率 ${values.slope.toFixed(2)}`;
      } else if (figure.dataset.visual === "convex") {
        const values = convexMix(figure.querySelector('[data-control="alpha"]').value);
        stage.innerHTML = convexSvg(values);
        output.textContent = `混合束 (${values.mix.x1.toFixed(2)}, ${values.mix.x2.toFixed(2)})，u=${values.mixUtility.toFixed(2)}；端点效用均为4`;
      } else if (figure.dataset.visual === "cost") {
        const values = costGeometry(figure.querySelector('[data-control="fixedCost"]').value);
        stage.innerHTML = costSvg(values);
        output.textContent = `有效规模 q̄=${values.efficientScale.toFixed(2)}；最低 AC=MC=${values.minimumAverageCost.toFixed(2)}`;
      }
    });
  });
}
