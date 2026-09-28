import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { course, lessonById } from "../src/course.js";
import { katex, legacyMathToTex, mathBlock, safeRichText } from "../src/math-render.js";

function warpViolations(choiceByBudget) {
  const rows = [...choiceByBudget.entries()];
  const violations = [];
  for (const [budget, choice] of rows) {
    for (const [otherBudget, otherChoice] of rows) {
      for (const x of budget) {
        for (const y of budget) {
          if (!otherBudget.has(x) || !otherBudget.has(y)) continue;
          if (choice.has(x) && otherChoice.has(y) && !otherChoice.has(x)) {
            violations.push({ budget, otherBudget, x, y });
          }
        }
      }
    }
  }
  return violations;
}

function nonemptySubsets(values) {
  return Array.from({ length: 2 ** values.length - 1 }, (_, maskIndex) => {
    const mask = maskIndex + 1;
    return new Set(values.filter((_, index) => mask & (1 << index)));
  });
}

test("1.C.1 的七个候选中只有 {x}、{z}、{x,z} 满足 WARP", () => {
  const smallBudget = new Set(["x", "y"]);
  const bigBudget = new Set(["x", "y", "z"]);
  const valid = nonemptySubsets(["x", "y", "z"])
    .filter(choice => warpViolations(new Map([
      [smallBudget, new Set(["x"])],
      [bigBudget, choice]
    ])).length === 0)
    .map(choice => [...choice].sort().join(""));
  assert.deepEqual(valid, ["x", "z", "xz"]);

  const lesson = lessonById.get("L01-M15");
  assert.match(lesson.demo.steps.join(" "), /违反 WARP/);
  const exercise = course.exercises.find(item => item.id === "MWG-1.C.1");
  assert.doesNotMatch(exercise.solution.join(" "), /其实允许|不违反 WARP/);
  assert.ok(exercise.solution.at(-1).includes("\\{x\\},\\{z\\},\\{x,z\\}"));
});

test("进入 innerHTML 的普通文本会转义小于号且保留其后中文", () => {
  const samples = [
    "若最优束有 p·x<w，局部非饱和能在仍可负担的小邻域找到严格更好束，矛盾；故瓦尔拉斯法则成立。",
    "反设有 x′ 达到 ū 且 p·x′<p·x*≤w。",
    "若 s<t，则 (t,b)≻ₗ(s,a)，所以整个 Iₜ 位于 Iₛ 右侧；"
  ];
  const rendered = samples.map(safeRichText);
  assert.match(rendered[0], /局部非饱和能在仍可负担的小邻域找到严格更好束/);
  assert.match(rendered[1], /达到 ū 且/);
  assert.match(rendered[2], /所以整个 Iₜ 位于 Iₛ 右侧/);
  for (const html of rendered) {
    assert.doesNotMatch(html, /<(?:w|p|t)[\s>]/i);
  }
});

test("全部结构化公式和正文自动识别公式均可由 KaTeX 解析", () => {
  const failures = [];
  let displayCount = 0;
  let inlineCount = 0;

  for (const lesson of course.lectures.flatMap(lecture => lecture.lessons)) {
    const formulas = [
      ...(lesson.formal || []),
      ...(lesson.blocks || []).flatMap(block => block.math || [])
    ];
    for (const formula of formulas) {
      const tex = typeof formula === "object" && formula.tex ? formula.tex : legacyMathToTex(formula);
      displayCount += 1;
      try {
        katex.renderToString(tex, { throwOnError: true, strict: "ignore" });
      } catch (error) {
        failures.push(`${lesson.id}: ${error.message}`);
      }
    }
  }

  const visit = (value, path = "course") => {
    if (/\.(?:html|original|tex)$/.test(path)) return;
    if (typeof value === "string") {
      const html = safeRichText(value);
      for (const match of html.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
        inlineCount += 1;
        const tex = match[1]
          .replaceAll("&lt;", "<").replaceAll("&gt;", ">")
          .replaceAll("&#39;", "'").replaceAll("&quot;", '"').replaceAll("&amp;", "&");
        try {
          katex.renderToString(tex, { throwOnError: true, strict: "ignore" });
        } catch (error) {
          failures.push(`${path}: ${error.message}`);
        }
      }
      return;
    }
    if (Array.isArray(value)) return value.forEach((item, index) => visit(item, `${path}[${index}]`));
    if (value && typeof value === "object") {
      for (const [key, item] of Object.entries(value)) visit(item, `${path}.${key}`);
    }
  };
  visit(course);

  assert.ok(displayCount >= 150);
  assert.ok(inlineCount >= 700);
  assert.deepEqual(failures, []);
});

test("结构化 TeX 公式不会把对象字符串暴露为朗读标签", () => {
  const html = mathBlock({ tex: "C(B)=\\{x\\}" });
  assert.doesNotMatch(html, /\[object Object\]/);
  assert.match(html, /aria-label="C\(B\)=/);
});

test("首次必要前置排在正式定义前，偏导已移动到 M03", () => {
  const m03 = lessonById.get("L02-M03");
  assert.ok(m03.blocks.some(block => block.id === "parameter-partial" && block.placement === "prerequisite"));
  assert.ok(!lessonById.get("L02-M05").blocks.some(block => block.id === "parameter-partial"));
  assert.ok(lessonById.get("L02-M05").blocks.some(block => block.id === "elasticity-definition" && block.placement === "prerequisite"));
  assert.ok(lessonById.get("L03-M06").blocks.some(block => block.id === "sequence-limit-closed" && block.placement === "prerequisite"));
  assert.ok(lessonById.get("L03-M10").blocks.some(block => block.id === "kkt-objects" && block.placement === "prerequisite"));
});

test("C(B) 从具体情境教到可操作后才进入 WARP", () => {
  const entry = lessonById.get("L01-M01");
  assert.doesNotMatch(`${entry.practice.prompt} ${entry.practice.answer} ${entry.review.prompt}`, /C\(B\)|C\(\{/);

  const choice = lessonById.get("L01-M14");
  const prerequisiteIds = choice.blocks.filter(block => block.placement === "prerequisite").map(block => block.id);
  assert.deepEqual(prerequisiteIds.slice(0, 7), [
    "choice-situation-input",
    "choice-rule-output",
    "choice-four-statements",
    "P-PREQ-L01-CHOICE",
    "P-PREQ-L01-CHOICE-MEMBER",
    "P-PREQ-L01-CHOICE-RULE",
    "choice-correspondence-name"
  ]);
  assert.match(choice.blocks.find(block => block.id === "choice-rule-output").paragraphs.join(" "), /圆括号不是乘法/);
  assert.match(choice.blocks.find(block => block.id === "choice-rule-output").paragraphs.join(" "), /只知道 B=.*不能算出 C\(B\)/);

  const warp = lessonById.get("L01-M15");
  const reminder = warp.blocks.find(block => block.id === "warp-object-reminder");
  assert.equal(reminder?.placement, "prerequisite");
  assert.match(reminder.paragraphs.join(" "), /不是求导/);
  assert.match(reminder.paragraphs.join(" "), /不必互相包含/);
});

test("五讲重要符号首次使用映射没有迟到项", () => {
  const symbolMap = JSON.parse(readFileSync(new URL("../data/symbol-first-use.json", import.meta.url), "utf8"));
  const ids = course.lectures.flatMap(lecture => lecture.lessons.map(lesson => lesson.id));
  assert.ok(symbolMap.items.length >= 18);
  for (const item of symbolMap.items) {
    assert.ok(!item.status.startsWith("needs_"), item.id);
    assert.ok(ids.indexOf(item.teachingLessonId) <= ids.indexOf(item.firstIndependentUse), item.id);
    if (item.teachingBlockId) {
      const block = lessonById.get(item.teachingLessonId).blocks.find(candidate => candidate.id === item.teachingBlockId);
      assert.equal(block?.placement, "prerequisite", item.id);
    }
  }
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const prerequisiteRender = appSource.indexOf('renderLearningBlocks(lesson, "prerequisite")');
  const conceptRender = appSource.indexOf('paragraphs(lesson.concept)');
  const formalRender = appSource.indexOf('lesson.formal.map(mathBlock)');
  assert.ok(prerequisiteRender >= 0 && prerequisiteRender < conceptRender && conceptRender < formalRender);
});

test("点名的旧结论已从实际课程装配中清除", () => {
  const convexDemo = lessonById.get("L03-M03").demo.steps.join(" ");
  assert.match(convexDemo, /不能/);
  assert.doesNotMatch(convexDemo, /通常只说偏好非凸/);

  const slopeLesson = lessonById.get("L04-M06");
  assert.match(slopeLesson.concept.join(" "), /数量响应/);
  assert.match(slopeLesson.concept.join(" "), /纵轴、数量 x 为横轴|价格 p 为纵轴/);

  const roy = lessonById.get("L04-M08");
  assert.match(roy.concept.join(" "), /本身不保证/);
  assert.match(roy.formal[0].tex, /\\ne0/);
});
