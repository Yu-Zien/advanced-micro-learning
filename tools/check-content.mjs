import { course, lessons } from "../src/course.js";
import { katex, legacyMathToTex, safeRichText } from "../src/math-render.js";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const allowPrivateSourcesMissing = process.env.ALLOW_PRIVATE_SOURCES_MISSING === "1";
const ids = lessons.map(x => x.id);
assert(ids.length === new Set(ids).size, "lessonId 必须唯一");
const lessonPracticeIds = lessons.map(x => x.practice?.id).filter(Boolean);
const blockPracticeIds = lessons.flatMap(lesson => (lesson.blocks || []).filter(block => block.type === "practice").map(block => block.id));
const practiceIds = [...lessonPracticeIds, ...blockPracticeIds];
const reviewIds = lessons.map(x => x.review?.id).filter(Boolean);
const exerciseIds = course.exercises.map(x => x.id);
assert(practiceIds.length === new Set(practiceIds).size, "练习 B 的稳定 ID 必须唯一");
assert(reviewIds.length === new Set(reviewIds).size, "精选回忆 ID 必须唯一");
assert(exerciseIds.length === new Set(exerciseIds).size, "教材原题 ID 必须唯一");
assert(course.courseId === "advanced-microeconomics-2026", "courseId 必须保持独立且稳定");
const fsrsBundle = readFileSync(new URL("../vendor/ts-fsrs/index.mjs", import.meta.url));
const fsrsHash = createHash("sha256").update(fsrsBundle).digest("hex");
assert(fsrsHash === "ad4a4b3b7e259fcbf02764454c8f9db4ea3bf5aae2f473198129ecb7728f1a19", "ts-fsrs vendor 校验和不匹配");
const katexBundle = readFileSync(new URL("../vendor/katex/katex.mjs", import.meta.url));
const katexCss = readFileSync(new URL("../vendor/katex/katex.min.css", import.meta.url));
const katexAutoRender = readFileSync(new URL("../vendor/katex/contrib/auto-render.mjs", import.meta.url));
assert(createHash("sha256").update(katexBundle).digest("hex") === "180dade94d7cbd593e59ded86d347f1482e1e17840ee528109283b1b888452af", "KaTeX ESM 校验和不匹配");
assert(createHash("sha256").update(katexCss).digest("hex") === "b9ce0e8ce93f0c18c4986fe1f1c3c269d921b56a69e6c97f83a507916b38aab5", "KaTeX CSS 校验和不匹配");
assert(createHash("sha256").update(katexAutoRender).digest("hex") === "e0410e8ce6c38869bf2f703fcc3b8d192308b5f3b34264625d605d742b1309e0", "KaTeX auto-render 校验和不匹配");
const manifest = JSON.parse(readFileSync(new URL("../sources/manifest.json", import.meta.url), "utf8"));
const sourceLimits = new Map(manifest.source_files.map(source => [source.original_filename, source.physical_pdf_pages]));
for (const lesson of lessons) {
  assert(lesson.status === "ready", `${lesson.id} 尚未 ready`);
  assert(Number.isFinite(lesson.minutes) && lesson.minutes > 0, `${lesson.id} 缺少有效时间估计`);
  assert(lesson.why && Array.isArray(lesson.concept) && lesson.concept.length > 0, `${lesson.id} 缺少讲解内容`);
  assert(lesson.practice?.prompt && lesson.practice?.hint && lesson.practice?.answer, `${lesson.id} 的练习 B 不完整`);
  assert(lesson.demo || lesson.proof, `${lesson.id} 缺少示范 A 或证明路线`);
  assert(Array.isArray(lesson.sourceRefs) && lesson.sourceRefs.length > 0, `${lesson.id} 缺少来源引用`);
  const blockIds = (lesson.blocks || []).map(block => block.id).filter(Boolean);
  assert(blockIds.length === new Set(blockIds).size, `${lesson.id} 内的连续内容块 ID 必须唯一`);
  for (const ref of lesson.sourceRefs) {
    const sourcePath = new URL(`../sources/raw/${ref.file}`, import.meta.url);
    assert(allowPrivateSourcesMissing || existsSync(sourcePath), `${lesson.id} 的来源文件不存在：${ref.file}`);
    assert(ref.pdfPages.every(page => Number.isInteger(page) && page > 0), `${lesson.id} 含无效来源页码`);
    const pageLimit = sourceLimits.get(ref.file);
    assert(Number.isInteger(pageLimit), `${lesson.id} 的来源文件未登记在 manifest：${ref.file}`);
    assert(ref.pdfPages.every(page => page <= pageLimit), `${lesson.id} 的来源页码超过文件总页数`);
  }
  for (const exerciseId of lesson.exerciseIds || []) {
    const exercise = course.exercises.find(item => item.id === exerciseId);
    assert(exercise, `${lesson.id} 引用了不存在的原题 ${exerciseId}`);
    assert(exercise?.lessonId === lesson.id, `${exerciseId} 的 lessonId 与实际嵌入位置不一致`);
  }
}
for (const exercise of course.exercises) {
  assert(/原 PDF \d+/.test(exercise.source), `${exercise.number} 缺少可链接的原 PDF 物理页码`);
  assert(exercise.status === "ready", `${exercise.number} 尚未 ready`);
  assert(exercise.original && exercise.chinese && exercise.tests, `${exercise.number} 题干或教学说明不完整`);
  assert(Array.isArray(exercise.hints) && exercise.hints.length > 0, `${exercise.number} 缺少渐进提示`);
  assert(Array.isArray(exercise.solution) && exercise.solution.length > 0, `${exercise.number} 缺少教学参考解`);
  const embeddedCount = lessons.filter(lesson => lesson.exerciseIds?.includes(exercise.id)).length;
  assert(embeddedCount === 1, `${exercise.number} 必须且只能嵌入一个主线知识点，当前 ${embeddedCount}`);
}

const coverageIndex = JSON.parse(readFileSync(new URL("../data/ppt-page-coverage.json", import.meta.url), "utf8"));
assert(coverageIndex.length === 182, "PPT 覆盖索引行数必须为182");
for (const row of coverageIndex) {
  const lecture = course.lectures.find(item => item.id === row.sourceId);
  const actual = (lecture?.lessons || [])
    .filter(lesson => lesson.sourceRefs.some(ref => ref.sourceId === row.sourceId && ref.pdfPages.includes(row.pdfPage)))
    .map(lesson => lesson.id)
    .sort();
  const indexed = [...row.publishedLessonIds].sort();
  assert(JSON.stringify(actual) === JSON.stringify(indexed), `${row.sourceId} 第${row.pdfPage}页的 publishedLessonIds 与课程源码不一致`);
  assert(row.status === "ready", `${row.sourceId} 第${row.pdfPage}页覆盖状态不是 ready`);
}

const blueprint = JSON.parse(readFileSync(new URL("../data/curriculum-blueprint.json", import.meta.url), "utf8"));
for (const lectureRow of blueprint.lectures) {
  const lecture = course.lectures.find(item => item.id === lectureRow.lectureId);
  assert(lecture, `蓝图讲次不存在：${lectureRow.lectureId}`);
  for (const section of lectureRow.sections) {
    const actual = (lecture?.lessons || []).filter(lesson => lesson.sectionId === section.sectionId).map(lesson => lesson.id).sort();
    const indexed = [...section.lessonIds].sort();
    assert(JSON.stringify(actual) === JSON.stringify(indexed), `${section.sectionId} 的 lessonIds 与课程源码不一致`);
    assert(section.contentStatus === "ready", `${section.sectionId} 尚未 ready`);
  }
}

const exerciseIndex = JSON.parse(readFileSync(new URL("../data/exercise-index.json", import.meta.url), "utf8"));
for (const exercise of course.exercises) {
  const row = exerciseIndex.exercises.find(item => item.exerciseId === exercise.id);
  assert(row, `原题索引缺少 ${exercise.id}`);
  assert(row?.statementTranscribed === true, `${exercise.id} 尚未标记题干已转录`);
  assert(row?.solutionStatus === "teaching_solution_authored", `${exercise.id} 尚未标记教学解已编写`);
}

const prerequisiteMap = JSON.parse(readFileSync(new URL("../data/prerequisite-map.json", import.meta.url), "utf8"));
assert(prerequisiteMap.contentVersion === course.contentVersion, "前置映射版本与课程内容版本不一致");
for (const mapping of prerequisiteMap.legacyMappings) {
  const lesson = lessons.find(item => item.id === mapping.newLessonId);
  assert(lesson, `前置迁移映射指向不存在的 lesson：${mapping.newLessonId}`);
  const blockIds = new Set((lesson?.blocks || []).map(block => block.id));
  for (const blockId of mapping.newBlockIds) assert(blockIds.has(blockId), `${mapping.revisionId} 缺少内容块 ${blockId}`);
}
for (const lessonId of prerequisiteMap.inPlaceRevisionMapping.lessonIds) {
  const lesson = lessons.find(item => item.id === lessonId);
  assert(lesson, `原地深化映射指向不存在的 lesson：${lessonId}`);
  assert((lesson?.blocks || []).length > 0, `原地深化映射没有新增 block：${lessonId}`);
}
for (const item of prerequisiteMap.items.filter(item => item.status === "deepened")) {
  const lessonId = item.teachingLocation.match(/L\d\d-M\d\d/)?.[0];
  assert(lessonId && lessons.some(lesson => lesson.id === lessonId), `${item.id} 的教学位置无效`);
  for (const practiceId of item.practiceIds || []) assert(practiceIds.includes(practiceId), `${item.id} 的尝试机会不存在：${practiceId}`);
}

const prerequisiteBeforeFormal = [
  ["L01-M12", "open-interval-density"],
  ["L02-M03", "parameter-partial"],
  ["L02-M05", "elasticity-definition"],
  ["L03-M02", "norm-neighborhood"],
  ["L03-M06", "sequence-limit-closed"],
  ["L03-M10", "kkt-objects"]
];
for (const [lessonId, blockId] of prerequisiteBeforeFormal) {
  const lesson = lessons.find(item => item.id === lessonId);
  const block = lesson?.blocks?.find(item => item.id === blockId);
  assert(block?.placement === "prerequisite", `${lessonId} 的 ${blockId} 没有排在正式定义前`);
}
assert(!lessons.find(item => item.id === "L02-M05")?.blocks?.some(block => block.id === "parameter-partial"), "偏导首次讲解仍滞留在 L02-M05");

let displayFormulaCount = 0;
let inlineFormulaCount = 0;
const mathFailures = [];
for (const lesson of lessons) {
  const formulas = [
    ...(lesson.formal || []),
    ...(lesson.blocks || []).flatMap(block => block.math || [])
  ];
  for (const formula of formulas) {
    const tex = typeof formula === "object" && formula.tex ? formula.tex : legacyMathToTex(formula);
    displayFormulaCount += 1;
    try { katex.renderToString(tex, { throwOnError: true, strict: "ignore" }); }
    catch (error) { mathFailures.push(`${lesson.id}: ${error.message}`); }
  }
}
const visitInline = (value, path = "course") => {
  if (/\.(?:html|original|tex)$/.test(path)) return;
  if (typeof value === "string") {
    const html = safeRichText(value);
    for (const match of html.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
      inlineFormulaCount += 1;
      const tex = match[1]
        .replaceAll("&lt;", "<").replaceAll("&gt;", ">")
        .replaceAll("&#39;", "'").replaceAll("&quot;", '"').replaceAll("&amp;", "&");
      try { katex.renderToString(tex, { throwOnError: true, strict: "ignore" }); }
      catch (error) { mathFailures.push(`${path}: ${error.message}`); }
    }
    return;
  }
  if (Array.isArray(value)) return value.forEach((item, index) => visitInline(item, `${path}[${index}]`));
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) visitInline(item, `${path}.${key}`);
  }
};
visitInline(course);
assert(mathFailures.length === 0, `KaTeX 解析失败：${mathFailures.slice(0, 3).join(" | ")}`);
assert(displayFormulaCount >= 150, "结构化公式数量异常减少");
assert(inlineFormulaCount >= 700, "正文/提示/答案中的行内公式覆盖异常减少");

const symbolMap = JSON.parse(readFileSync(new URL("../data/symbol-first-use.json", import.meta.url), "utf8"));
assert(symbolMap.contentVersion === course.contentVersion, "符号首次使用映射版本与课程内容版本不一致");
for (const item of symbolMap.items) {
  const teachingIndex = ids.indexOf(item.teachingLessonId);
  const useIndex = ids.indexOf(item.firstIndependentUse);
  assert(teachingIndex >= 0, `${item.id} 的教学 lesson 不存在`);
  assert(useIndex >= 0, `${item.id} 的首次使用 lesson 不存在`);
  assert(teachingIndex <= useIndex, `${item.id} 的符号教学晚于首次使用`);
  if (item.teachingBlockId) {
    const lesson = lessons[teachingIndex];
    const block = lesson?.blocks?.find(candidate => candidate.id === item.teachingBlockId);
    assert(block, `${item.id} 缺少教学块 ${item.teachingBlockId}`);
    assert(block?.placement === "prerequisite", `${item.id} 的教学块没有排在正文/正式公式前`);
  }
  assert(!item.status.startsWith("needs_"), `${item.id} 仍有未修的首次使用顺序问题`);
}

const l01 = course.lectures.find(x => x.id === "L01");
const pages = new Set(l01.lessons.flatMap(lesson => lesson.sourceRefs.flatMap(ref => ref.pdfPages)));
for (let page = 1; page <= 29; page += 1) assert(pages.has(page), `第一讲缺少 PPT 第 ${page} 页去向`);
assert(l01.lessons.every(x => x.status === "ready"), "第一讲仍有非 ready 知识点");
assert(l01.lessons.every(x => x.practice), "第一讲每个知识点都必须有练习 B");
assert(l01.lessons.every(x => x.demo || x.proof), "第一讲每个知识点都必须有示范或完整证明路线");

const expectedExercises = ["1.B.1", "1.B.2", "1.C.1", "1.C.2"];
for (const number of expectedExercises) {
  const exercise = course.exercises.find(x => x.number === number);
  assert(exercise, `缺少原题 ${number}`);
  assert(exercise?.original && exercise?.chinese && exercise?.solution?.length, `原题 ${number} 内容不完整`);
  assert(lessons.some(x => x.exerciseIds?.includes(exercise?.id)), `原题 ${number} 未嵌入主线`);
}

if (failures.length) {
  console.error(failures.map(x => `FAIL ${x}`).join("\n"));
  process.exit(1);
}

console.log(`PASS courseId=${course.courseId}`);
console.log(`PASS L01 lessons=${l01.lessons.length}, pptPages=${pages.size}/29`);
console.log(`PASS L01 exercises=${expectedExercises.length}/4, all embedded`);
console.log(`PASS reviewCandidates=${l01.lessons.filter(x => x.review).length}`);

const l02 = course.lectures.find(x => x.id === "L02");
const l02Pages = new Set(l02.lessons.flatMap(lesson => lesson.sourceRefs.flatMap(ref => ref.pdfPages)));
for (let page = 1; page <= 39; page += 1) assert(l02Pages.has(page), `第二讲缺少 PPT 第 ${page} 页去向`);
assert(l02.lessons.every(x => x.status === "ready" && x.practice), "第二讲仍有非 ready 或缺少练习的知识点");
const l02Numbers = ["2.E.3", "2.E.7", "2.F.6", "2.F.17"];
for (const number of l02Numbers) {
  const exercise = course.exercises.find(x => x.number === number);
  assert(exercise?.solution?.length, `原题 ${number} 未完成`);
  assert(lessons.some(x => x.exerciseIds?.includes(exercise?.id)), `原题 ${number} 未嵌入主线`);
}
if (failures.length) {
  console.error(failures.map(x => `FAIL ${x}`).join("\n"));
  process.exit(1);
}
console.log(`PASS L02 lessons=${l02.lessons.length}, pptPages=${l02Pages.size}/39`);
console.log(`PASS L02 exercises=${l02Numbers.length}/4, all embedded`);

const l03 = course.lectures.find(x => x.id === "L03");
const l03Pages = new Set(l03.lessons.flatMap(lesson => lesson.sourceRefs.flatMap(ref => ref.pdfPages)));
for (let page = 1; page <= 42; page += 1) assert(l03Pages.has(page), `第三讲缺少 PPT 第 ${page} 页去向`);
assert(l03.lessons.every(x => x.status === "ready" && x.practice), "第三讲仍有非 ready 或缺少练习的知识点");
assert(l03.lessons.every(x => x.demo || x.proof), "第三讲每个知识点都必须有示范或完整证明路线");
const l03Numbers = ["3.C.6", "3.D.1", "3.D.3"];
for (const number of l03Numbers) {
  const exercise = course.exercises.find(x => x.number === number);
  assert(exercise?.original && exercise?.chinese && exercise?.solution?.length, `原题 ${number} 未完成`);
  assert(lessons.some(x => x.exerciseIds?.includes(exercise?.id)), `原题 ${number} 未嵌入主线`);
}
if (failures.length) {
  console.error(failures.map(x => `FAIL ${x}`).join("\n"));
  process.exit(1);
}
console.log(`PASS L03 lessons=${l03.lessons.length}, pptPages=${l03Pages.size}/42`);
console.log(`PASS L03 exercises=${l03Numbers.length}/3, all embedded`);

const l04 = course.lectures.find(x => x.id === "L04");
const l04Pages = new Set(l04.lessons.flatMap(lesson => lesson.sourceRefs.flatMap(ref => ref.pdfPages)));
for (let page = 1; page <= 28; page += 1) assert(l04Pages.has(page), `第四讲缺少 PPT 第 ${page} 页去向`);
assert(l04.lessons.every(x => x.status === "ready" && x.practice), "第四讲仍有非 ready 或缺少练习的知识点");
assert(l04.lessons.every(x => x.demo || x.proof), "第四讲每个知识点都必须有示范或完整证明路线");
const l04Numbers = ["3.E.1", "3.G.15", "3.I.5"];
for (const number of l04Numbers) {
  const exercise = course.exercises.find(x => x.number === number);
  assert(exercise?.original && exercise?.chinese && exercise?.solution?.length, `原题 ${number} 未完成`);
  assert(lessons.some(x => x.exerciseIds?.includes(exercise?.id)), `原题 ${number} 未嵌入主线`);
}
if (failures.length) {
  console.error(failures.map(x => `FAIL ${x}`).join("\n"));
  process.exit(1);
}
console.log(`PASS L04 lessons=${l04.lessons.length}, pptPages=${l04Pages.size}/28`);
console.log(`PASS L04 exercises=${l04Numbers.length}/3, all embedded`);

const l05 = course.lectures.find(x => x.id === "L05");
const l05Pages = new Set(l05.lessons.flatMap(lesson => lesson.sourceRefs.flatMap(ref => ref.pdfPages)));
for (let page = 1; page <= 44; page += 1) assert(l05Pages.has(page), `第五讲缺少 PPT 第 ${page} 页去向`);
assert(l05.lessons.every(x => x.status === "ready" && x.practice), "第五讲仍有非 ready 或缺少练习的知识点");
assert(l05.lessons.every(x => x.demo || x.proof), "第五讲每个知识点都必须有示范或完整证明路线");
const l05Numbers = ["5.C.2", "5.C.9", "5.D.1"];
for (const number of l05Numbers) {
  const exercise = course.exercises.find(x => x.number === number);
  assert(exercise?.original && exercise?.chinese && exercise?.solution?.length, `原题 ${number} 未完成`);
  assert(lessons.some(x => x.exerciseIds?.includes(exercise?.id)), `原题 ${number} 未嵌入主线`);
}
assert(course.lectures.every(x => x.status === "ready"), "仍有讲次未达到 ready");
assert(course.lectures.reduce((sum, x) => sum + x.pptPages, 0) === 182, "PPT 总页数不是 182");
assert(course.exercises.length === 17, "教材原题总数不是 17");
if (failures.length) {
  console.error(failures.map(x => `FAIL ${x}`).join("\n"));
  process.exit(1);
}
console.log(`PASS L05 lessons=${l05.lessons.length}, pptPages=${l05Pages.size}/44`);
console.log(`PASS L05 exercises=${l05Numbers.length}/3, all embedded`);
console.log(`PASS FULL lectures=5, lessons=${lessons.length}, pptPages=182, exercises=17`);
console.log(`PASS FSRS vendor=ts-fsrs-5.4.2, sha256=${fsrsHash.slice(0, 12)}…`);
console.log(`PASS KATEX vendor=0.18.9, display=${displayFormulaCount}, inline=${inlineFormulaCount}`);
console.log(`PASS SOURCE LINKS lessons=${lessons.length}, exercises=${course.exercises.length}`);
console.log(`PASS STABLE IDS lessons=${ids.length}, practices=${practiceIds.length}, reviews=${reviewIds.length}`);
console.log(`PASS INDEX CROSS-CHECK coverage=${coverageIndex.length}, sections=${blueprint.lectures.flatMap(x => x.sections).length}, exercises=${exerciseIndex.exercises.length}`);
console.log(`PASS PREREQUISITE MAP deepened=${prerequisiteMap.items.filter(x => x.status === "deepened").length}, pending=${prerequisiteMap.items.filter(x => x.status !== "deepened").length}`);
console.log(`PASS SYMBOL FIRST USE items=${symbolMap.items.length}, pending=${symbolMap.items.filter(x => x.status.startsWith("needs_")).length}`);
if (allowPrivateSourcesMissing) console.log("PASS PUBLIC CI mode: private PDFs intentionally absent; manifest bounds verified");
