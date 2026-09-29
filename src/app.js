import { course, lessons, lessonById, exerciseById, reviewById, nextLessonId, lessonIndex } from "./course.js?v=2026.09.29-exercise-expansion-1";
import { renderVisual, bindVisuals } from "./visuals.js?v=2026.09.29-exercise-expansion-1";
import { buildDailyPlan } from "./planner.js?v=2026.09.29-exercise-expansion-1";
import { escapeHtml, escapeAttribute, safeRichText, controlledTableHtml, mathBlock, renderMath } from "./math-render.js?v=2026.09.29-exercise-expansion-1";
import { definitionRecords, definitionById } from "./definitions.js?v=2026.09.29-exercise-expansion-1";
import {
  loadState, saveState, completeLesson, rateReview, dueReviewIds,
  previewReviewOutcomes, exportBackup, importBackup, reconcileMainlineCompletion, CONTENT_VERSION
} from "./state.js?v=2026.09.29-exercise-expansion-1";

const main = document.querySelector("#content");
const toastNode = document.querySelector("#toast");
const localSourceAvailable = ["127.0.0.1", "localhost"].includes(location.hostname);
let state = loadState(localStorage, lessons[0].id);
let route = location.hash.replace("#", "") || "learn";
let completing = false;
let saveTimer;

if (!lessonById.has(state.mainLessonId)) state.mainLessonId = lessons[0].id;
const beforeRecoveryCount = state.completedIds.length;
state = reconcileMainlineCompletion(state, lessons.map(lesson => lesson.id));
const recoveredProgressCount = state.completedIds.length - beforeRecoveryCount;
if (recoveredProgressCount > 0) state = saveState(state);
document.documentElement.style.setProperty("--reader-size", `${state.fontSize || 19}px`);
document.querySelector("#font-size").value = state.fontSize || 19;

function persist(immediate = false) {
  clearTimeout(saveTimer);
  if (immediate) state = saveState(state);
  else saveTimer = setTimeout(() => { state = saveState(state); }, 120);
}

function toast(message) {
  toastNode.textContent = message;
  toastNode.classList.add("show");
  setTimeout(() => toastNode.classList.remove("show"), 2200);
}

function paragraphs(items = []) { return items.map(item => `<p>${safeRichText(item)}</p>`).join(""); }

const definitionKindLabel = kind => ({
  definition: "规范定义",
  assumption: "工作假设",
  proposition: "性质与命题"
}[kind] || "规范记录");

function renderDefinitionRecord(definition, compact = false) {
  if (!definition) return "";
  const clauses = (definition.clauses || []).map(clause => `<li id="definition-${escapeAttribute(definition.id)}-${escapeAttribute(clause.id)}">
    <p><strong>${escapeHtml(clause.id)}</strong> ${safeRichText(clause.text)}</p>
    ${mathBlock({ tex: clause.tex, label: `${definition.title} ${clause.id}` })}
  </li>`).join("");
  const body = `<p><strong>对象：</strong>${safeRichText(definition.object)}</p>
    <p><strong>范围：</strong>${safeRichText(definition.scope)}</p>
    <ol class="definition-clauses">${clauses}</ol>
    ${definition.example ? `<p><strong>例子：</strong>${safeRichText(definition.example)}</p>` : ""}
    ${definition.boundary ? `<p class="definition-boundary"><strong>边界：</strong>${safeRichText(definition.boundary)}</p>` : ""}
    <p class="source-line">来源：${safeRichText(definition.source)}</p>`;
  if (compact) return body;
  return `<section class="definition-card definition-${escapeAttribute(definition.kind)}" id="definition-${escapeAttribute(definition.id)}" data-definition-id="${escapeAttribute(definition.id)}">
    <div class="label">${definitionKindLabel(definition.kind)} · ${escapeHtml(definition.id)}</div>
    <h2>${definitionKindLabel(definition.kind)}：${safeRichText(definition.title)}</h2>
    ${body}
  </section>`;
}

function renderDefinitionRecall(definitionIds = []) {
  return definitionIds.map(id => {
    const definition = definitionById.get(id);
    if (!definition) return "";
    return details(`definition-recall:${id}`, `回查：${definitionKindLabel(definition.kind)}「${definition.title}」`, renderDefinitionRecord(definition, true), "definition-recall");
  }).join("");
}

function sourceHref(filename, page) {
  const encoded = filename.split("/").map(part => encodeURIComponent(part)).join("/");
  return `sources/raw/${encoded}#page=${page}`;
}

function renderLessonSourceLinks(lesson) {
  if (!localSourceAvailable) {
    return `<p class="source-line">原 PDF 因版权与课程资料限制未包含在公开站点；来源文件名和物理页码已保留，可在本地完整项目中打开。</p>`;
  }
  const links = lesson.sourceRefs.map(ref => {
    const firstPage = ref.pdfPages[0];
    const pageLabel = ref.pdfPages.length === 1
      ? `第 ${firstPage} 页`
      : `第 ${ref.pdfPages[0]}–${ref.pdfPages.at(-1)} 页`;
    return `<li><a class="source-link" href="${sourceHref(ref.file, firstPage)}" target="_blank" rel="noopener">${escapeHtml(ref.file)} ${pageLabel}</a></li>`;
  }).join("");
  return details(`${lesson.id}:sources`, "打开本地课件原页（不改变学习进度）", `<ul class="clean">${links}</ul>`);
}

function renderExerciseSourceLink(exercise) {
  if (!localSourceAvailable) return `<span class="source-line">原 PDF 仅在本地完整项目中提供。</span>`;
  const match = exercise.source.match(/原 PDF (\d+)/);
  if (!match) return "";
  const page = Number(match[1]);
  return `<a class="source-link" href="${sourceHref("MWG Textbook.pdf", page)}" target="_blank" rel="noopener">打开 MWG 原 PDF 第 ${page} 页核对</a>`;
}

function details(id, label, body, className = "") {
  const isOpen = state.detailsOpen[id] ? " open" : "";
  return `<details data-detail-id="${escapeAttribute(id)}" class="${escapeAttribute(className)}"${isOpen}><summary>${safeRichText(label)}</summary>${body}</details>`;
}

function ratingButtons(id, current) {
  return `<div class="rating-row" aria-label="练习自评">
    <button data-rate-practice="unrated" data-practice-id="${escapeAttribute(id)}" aria-pressed="${!current || current === "unrated"}">未评价</button>
    <button data-rate-practice="can" data-practice-id="${escapeAttribute(id)}" aria-pressed="${current === "can"}">会做</button>
    <button data-rate-practice="cannot" data-practice-id="${escapeAttribute(id)}" aria-pressed="${current === "cannot"}">还不会</button>
  </div>`;
}

function renderPractice(practice) {
  const exState = state.exerciseState[practice.id] || {};
  return `<section class="practice" aria-labelledby="${practice.id}-title">
    <div class="label">练习 B · 教学自编</div>
    <h3 id="${practice.id}-title">请先在纸上或心里作答</h3>
    <p>${safeRichText(practice.prompt)}</p>
    ${details(`${practice.id}:hint`, "看渐进提示", `<p>${safeRichText(practice.hint)}</p>`) }
    ${details(`${practice.id}:answer`, "展开教学参考解", `<p>${safeRichText(practice.answer)}</p>`) }
    ${ratingButtons(practice.id, exState.selfRating)}
    <p class="microcopy">自评只记录这次练习感受，不决定能否继续，也不会被当成成功回忆。</p>
  </section>`;
}

function renderBlockPractice(block) {
  const exState = state.exerciseState[block.id] || {};
  const hints = (block.hints || []).map((hint, index) =>
    details(`${block.id}:hint:${index}`, `提示 ${index + 1}`, `<p>${safeRichText(hint)}</p>`)
  ).join("");
  return `<section class="practice teaching-block" aria-labelledby="${block.id}-title">
    <div class="label">${safeRichText(block.label || "理解检查 · 教学自编")}</div>
    <h2 id="${escapeAttribute(block.id)}-title">${safeRichText(block.title || "先尝试，再看提示")}</h2>
    ${(block.estimatedMinutes || block.optional) ? `<div class="exercise-meta"><span>预计 ${Number(block.estimatedMinutes || 0)} 分钟</span>${block.optional ? `<span>可选加练 · 不计入今日核心时长</span>` : ""}</div>` : ""}
    ${block.purpose ? `<p class="microcopy"><strong>这题检验：</strong>${safeRichText(block.purpose)}</p>` : ""}
    ${block.whyHere ? `<p class="exercise-why"><strong>为什么现在做：</strong>${safeRichText(block.whyHere)}</p>` : ""}
    <p>${safeRichText(block.prompt)}</p>
    ${hints}
    ${details(`${block.id}:answer`, "展开教学参考解", paragraphs(block.answer || []))}
    ${block.confusionNote ? `<p class="confusion-note"><strong>容易混淆：</strong>${safeRichText(block.confusionNote)}</p>` : ""}
    ${ratingButtons(block.id, exState.selfRating)}
    <p class="microcopy">这是普通理解练习；自评不推进主线，也不自动成为成功回忆。</p>
  </section>`;
}

function renderLearningBlock(block, lessonId, index) {
  const key = `${lessonId}:block:${block.id || index}`;
  const anchor = `unit-${lessonId}-${block.id || index}`;
  if (block.type === "definition") return renderDefinitionRecord(definitionById.get(block.definitionId));
  if (block.type === "definitionRecall") {
    return `<section class="definition-recall-group teaching-block" id="${escapeAttribute(anchor)}"><div class="label">本段调用的定义与假设</div>${renderDefinitionRecall(block.definitionIds)}</section>`;
  }
  if (block.type === "practice") return renderBlockPractice(block);
  if (block.type === "proof") {
    return `<section class="proof teaching-block" id="${escapeAttribute(anchor)}" data-block-key="${escapeAttribute(key)}">
      <div class="label">${safeRichText(block.label || "数学补充 · 完整证明")}</div>
      <h2>${safeRichText(block.title)}</h2>
      ${block.intro ? paragraphs(block.intro) : ""}
      <p><strong>已知：</strong>${safeRichText(block.known)}</p>
      <p><strong>目标：</strong>${safeRichText(block.goal)}</p>
      <ol class="proof-steps">${block.steps.map(step => typeof step === "string"
        ? `<li><p>${safeRichText(step)}</p></li>`
        : `<li><p><strong>${safeRichText(step.action)}</strong></p>${step.why ? `<p class="step-why">为什么：${safeRichText(step.why)}</p>` : ""}${step.uses ? `<p class="microcopy">使用：${safeRichText(step.uses)}</p>` : ""}</li>`).join("")}</ol>
      ${block.conclusion ? `<p><strong>结论：</strong>${safeRichText(block.conclusion)}</p>` : ""}
      ${block.assumptions ? `<p class="microcopy"><strong>条件核对：</strong>${safeRichText(block.assumptions)}</p>` : ""}
    </section>`;
  }
  if (block.type === "transition") {
    return `<section class="transition-block teaching-block" id="${escapeAttribute(anchor)}" data-block-key="${escapeAttribute(key)}"><div class="label">回到高微主线</div><h2>${safeRichText(block.title)}</h2>${paragraphs(block.paragraphs)}</section>`;
  }
  const className = block.type === "counterexample" ? "counterexample-block" : block.type === "example" ? "demo" : "callout";
  return `<section class="${className} teaching-block" id="${escapeAttribute(anchor)}" data-block-key="${escapeAttribute(key)}">
    <div class="label">${safeRichText(block.label || (block.type === "example" ? "教学自编例子" : "数学补充"))}</div>
    <h2>${safeRichText(block.title)}</h2>
    ${paragraphs(block.paragraphs || [])}
    ${(block.math || []).map(mathBlock).join("")}
    ${controlledTableHtml(block.html || "")}
    ${renderVisual(block.visual)}
    ${block.note ? `<p class="microcopy">${safeRichText(block.note)}</p>` : ""}
  </section>`;
}

function renderLearningBlocks(lesson, placement = "development") {
  return (lesson.blocks || []).map((block, index) => ({ block, index }))
    .filter(({ block }) => (block.placement || "development") === placement)
    .map(({ block, index }) => renderLearningBlock(block, lesson.id, index)).join("");
}

function renderSubgoalNavigation(lesson) {
  const subgoals = (lesson.blocks || []).filter(block => block.subgoal);
  if (!subgoals.length) return "";
  return `<nav class="subgoal-nav" aria-label="本主题子目标"><div class="label">本主题 ${subgoals.length} 个连续子目标</div><ol>${subgoals.map(block =>
    `<li><a href="#unit-${escapeAttribute(lesson.id)}-${escapeAttribute(block.id)}">${safeRichText(block.subgoal)}. ${safeRichText(block.title)}</a></li>`
  ).join("")}</ol><p class="microcopy">可连续阅读，也可按子目标定位；滚动位置会自动保存，不设置答对门槛。</p></nav>`;
}

function renderProof(proof) {
  if (!proof) return "";
  return `<section class="proof">
    <div class="label">证明路线</div>
    <p><strong>已知：</strong>${safeRichText(proof.known)}</p>
    <p><strong>目标：</strong>${safeRichText(proof.goal)}</p>
    <ol class="reasoning">${proof.steps.map(step => `<li>${safeRichText(step)}</li>`).join("")}</ol>
    <p class="microcopy"><strong>条件核对：</strong>${safeRichText(proof.assumptions)}</p>
  </section>`;
}

function renderExercise(exercise) {
  const s = state.exerciseState[exercise.id] || {};
  const hints = exercise.hints.map((hint, index) => details(`${exercise.id}:hint:${index}`, `提示 ${index + 1}`, `<p>${safeRichText(hint)}</p>`)).join("");
  const related = (exercise.relatedConcepts || []).map(item => `<span>${safeRichText(item)}</span>`).join("");
  const difficulty = exercise.displayLabel?.includes("教学拆分")
    ? String(exercise.difficulty).replace(/\s*·\s*教学拆分/gi, "")
    : exercise.difficulty;
  return `<section class="exercise${exercise.role === "textbook_reinforcement" ? " exercise-reinforcement" : ""}" id="exercise-${exercise.id}">
    <div class="label">${safeRichText(exercise.displayLabel || "MWG 教材原题")} · 难度 ${safeRichText(difficulty)}</div>
    <h2>${exercise.number}</h2>
    ${(exercise.estimatedMinutes || exercise.optional) ? `<div class="exercise-meta"><span>预计 ${Number(exercise.estimatedMinutes || 0)} 分钟</span>${exercise.optional ? `<span>可选加练 · 不计入今日核心时长</span>` : ""}${related}</div>` : ""}
    ${exercise.whyHere ? `<p class="exercise-why"><strong>为什么现在安排：</strong>${safeRichText(exercise.whyHere)}</p>` : ""}
    <p lang="en"><strong>${exercise.role === "textbook_reinforcement" ? "题意简述" : "Original"}.</strong> ${escapeHtml(exercise.original)}</p>
    ${exercise.proposition ? `<p lang="en"><strong>Referenced statement.</strong> ${escapeHtml(exercise.proposition)}</p>` : ""}
    <p><strong>中文解释：</strong>${safeRichText(exercise.chinese)}</p>
    <p class="microcopy"><strong>这题检验：</strong>${safeRichText(exercise.tests)}</p>
    ${exercise.scopeNote ? `<p class="scope-note"><strong>范围：</strong>${safeRichText(exercise.scopeNote)}</p>` : ""}
    ${hints}
    ${details(`${exercise.id}:solution`, "展开教学参考解（非官方答案）", exercise.solution.map(x => `<p>${safeRichText(x)}</p>`).join(""))}
    ${ratingButtons(exercise.id, s.selfRating)}
    <p class="source-line">来源：${safeRichText(exercise.source)}</p>
    <p class="source-actions">${renderExerciseSourceLink(exercise)}</p>
  </section>`;
}

function renderDueReview() {
  const id = dueReviewIds(state)[0];
  const review = reviewById.get(id);
  if (!id || !review) return "";
  const preview = previewReviewOutcomes(state, id);
  const interval = rating => {
    const days = preview[rating]?.intervalDays;
    if (!Number.isFinite(days)) return "";
    return days === 1 ? " · 明天" : ` · ${days} 天后`;
  };
  return `<aside class="review-card" data-review-id="${id}">
    <div class="label">到期回忆 · 与普通练习分开</div>
    <h2>先合上答案，真实回忆一次</h2>
    <p>${safeRichText(review.prompt)}</p>
    ${details(`${id}:answer`, "尝试后展开答案", `<p>${safeRichText(review.answer)}</p><div class="review-actions">
      <button data-review-rating="again">没想起${interval("again")}</button>
      <button data-review-rating="hard">困难${interval("hard")}</button>
      <button data-review-rating="good">想起${interval("good")}</button>
      <button data-review-rating="easy">很稳${interval("easy")}</button>
    </div>`)}
    <p class="microcopy">只有你点选上面的回忆评分，才会写入排程。阅读、展开或完成知识点都不算成功回忆。</p>
  </aside>`;
}

function renderDailyPlan() {
  const plan = buildDailyPlan({
    lessons,
    mainLessonId: state.mainLessonId,
    completedIds: state.completedIds,
    dueReviewCount: dueReviewIds(state).length
  });
  const reviewText = plan.reviewCount
    ? `${plan.reviewCount} 项到期回忆，建议约 ${plan.reviewMinutes} 分钟`
    : "今天没有到期回忆";
  const lessonList = plan.plannedLessons.length
    ? `<ol>${plan.plannedLessons.map(item => `<li><span>${safeRichText(item.title)}</span><small>${item.minutes} 分钟</small></li>`).join("")}</ol>`
    : `<p>${plan.courseComplete ? "主线已完成；有到期回忆时继续学习入口仍会显示。" : "今天不安排新的知识点。"}</p>`;
  return `<aside class="daily-plan">
    <div><span class="label">今日建议 · 约 ${plan.totalMinutes} 分钟 · 非门槛</span><strong>${reviewText}</strong></div>
    ${lessonList}
    <p class="microcopy">新学习预计 ${plan.learningMinutes} 分钟，其中页面内核心练习约 ${plan.practiceMinutes || 0} 分钟。可随时暂停；实际主线位置、滚动和展开状态会自动保存。</p>
  </aside>`;
}

function renderRevisitNotice() {
  const nextId = state.revisitLessonIds?.[0];
  const lesson = lessonById.get(nextId);
  if (!lesson) return "";
  return `<aside class="revision-notice">
    <div class="label">本次新增前置 · 旧完成不等于新内容已掌握</div>
    <p><strong>${safeRichText(lesson.title)}</strong> 已按当前基础重写。旧版完成记录仍保留，但这部分深化内容尚未替你标为完成。</p>
    <button class="secondary" data-study-revisit="${lesson.id}">现在补学这一段</button>
  </aside>`;
}

function renderLesson(id, browsing = false) {
  const lesson = lessonById.get(id) || lessons[0];
  const lecture = course.lectures.find(x => x.id === lesson.lectureId);
  const lectureCompleted = lecture.lessons.filter(x => state.completedIds.includes(x.id)).length;
  const index = lessonIndex(lesson.id);
  const nextId = nextLessonId(lesson.id);
  const isLastLesson = nextId === null;
  const completed = state.completedIds.includes(lesson.id);
  const revisiting = state.revisitLessonId === lesson.id;
  const needsRevisit = state.revisitLessonIds?.includes(lesson.id);
  const exerciseHtml = (lesson.exerciseIds || []).map(exId => renderExercise(exerciseById.get(exId))).join("");
  const sources = lesson.sourceRefs.map(ref => `${ref.file} 第 ${ref.pdfPages.join("、")} 页${ref.note ? `；${ref.note}` : ""}`).join("；");
  main.innerHTML = `${browsing ? `<div class="browse-banner">你正在回看；这里的浏览不会推进主线。<button class="text-button" data-return-main>回到正在学习</button></div>` : revisiting ? `<div class="browse-banner revision-banner">你正在补学本次新增前置；原主线位置保持不变。<button class="text-button" data-cancel-revisit>暂时回到原主线</button></div>` : ""}
    <article class="reader" data-lesson-id="${lesson.id}">
      <div class="eyebrow">${safeRichText(lecture.title)} · 知识点 ${index + 1}/${lessons.length}</div>
      <h1>${safeRichText(lesson.title)}</h1>
      <p class="lesson-meta">约 ${lesson.minutes} 分钟 · PPT ${lesson.sourceRefs[0].pdfPages.join("–")} 页 · ${needsRevisit ? "旧版已完成，本次深化待补" : completed ? "已完成本轮" : "学习中"}</p>
      <div class="progress-track" aria-label="${lecture.title}进度"><span style="width:${Math.round((lectureCompleted / lecture.lessons.length) * 100)}%"></span></div>
      ${!browsing && !revisiting ? renderRevisitNotice() : ""}
      ${!browsing ? renderDailyPlan() : ""}
      ${!browsing ? renderDueReview() : ""}
      ${lesson.bridge ? `<aside class="chapter-bridge"><div class="label">章节桥梁</div><p>${safeRichText(lesson.bridge)}</p></aside>` : ""}
      <p class="lede">${safeRichText(lesson.why)}</p>
      ${lesson.wakeup ? `<section class="callout"><div class="label">前置唤醒</div><p>${safeRichText(lesson.wakeup)}</p></section>` : ""}
      ${renderSubgoalNavigation(lesson)}
      ${renderLearningBlocks(lesson, "prerequisite")}
      <section><h2>把这一点讲清楚</h2>${paragraphs(lesson.concept)}</section>
      ${lesson.formal ? lesson.formal.map(mathBlock).join("") : ""}
      ${renderVisual(lesson.visual)}
      ${renderLearningBlocks(lesson, "development")}
      ${lesson.demo ? `<section class="demo"><div class="label">示范 A · 教学自编</div><h3>${safeRichText(lesson.demo.prompt)}</h3><ol class="reasoning">${lesson.demo.steps.map(s => `<li>${safeRichText(s)}</li>`).join("")}</ol></section>` : ""}
      ${renderProof(lesson.proof)}
      ${renderPractice(lesson.practice)}
      ${exerciseHtml}
      <p class="source-line">本知识点来源：${safeRichText(sources)}。未标为教材原题的例子、说明与参考解均为本站教学补充。</p>
      ${renderLessonSourceLinks(lesson)}
      <footer class="lesson-footer">
        ${index > 0 ? `<button class="secondary" data-browse-lesson="${lessons[index - 1].id}">上一知识点（回看）</button>` : `<span></span>`}
        ${browsing
          ? `<button class="primary" data-return-main>回到正在学习</button>`
          : revisiting
            ? `<button class="primary" data-complete-lesson="${lesson.id}" ${completing ? "disabled" : ""}>补学完成，回到原主线</button>`
          : isLastLesson && completed
            ? `<button class="primary" data-route="outline">主线已完成，查看目录与回顾</button>`
            : `<button class="primary" data-complete-lesson="${lesson.id}" ${completing ? "disabled" : ""}>${completed ? "本知识点已学完，继续" : isLastLesson ? "完成最后知识点" : "本知识点学完，继续"}</button>`}
      </footer>
    </article>`;
  updateNav("learn");
  bindDetails();
  bindVisuals(main);
  renderMath(main);
  requestAnimationFrame(() => {
    const top = browsing ? (state.browseScroll || 0) : (state.mainScroll || 0);
    scrollTo({ top, behavior: "instant" });
  });
}

function renderOutline() {
  const readyLessons = lessons.length;
  const completed = state.completedIds.length;
  const readyLectures = course.lectures.filter(x => x.status === "ready");
  const readyPages = readyLectures.reduce((sum, x) => sum + x.pptPages, 0);
  const readyExercises = course.exercises.filter(x => x.status === "ready").length;
  const reinforcementExercises = course.exercises.filter(x => x.role === "textbook_reinforcement").length;
  const listedExercises = readyExercises - reinforcementExercises;
  const assignment = assignmentDescription();
  main.innerHTML = `<section class="panel-page">
    <div class="eyebrow">目录与进度</div>
    <h1>五讲路线</h1>
    <p class="lede">完成本轮只表示你走过这个知识点；练习自评和真实回忆另行保存。</p>
    <div class="summary-grid">
      <div class="summary-card"><span>已学完本轮</span><strong>${completed}/${readyLessons}</strong><small>当前主线：${lessonIndex(state.mainLessonId) + 1}/90；不会自动等于掌握</small></div>
      <div class="summary-card"><span>到期回忆</span><strong>${dueReviewIds(state).length}</strong><small>只统计已启用卡片</small></div>
      <div class="summary-card"><span>可学内容</span><strong>${readyLectures.length} 讲</strong><small>${readyPages} 页课件，${listedExercises} 道指定原题 + ${reinforcementExercises} 道教材强化</small></div>
    </div>
    ${assignment.configured ? `<div class="assignment-summary"><strong>本周作业：</strong>${assignment.text}</div>` : ""}
    <input id="outline-search" class="search-box" type="search" placeholder="搜索标题、术语、定义、假设或题号" aria-label="搜索课程">
    <div id="definition-results">${definitionIndexHtml("")}</div>
    <div id="outline-results">${lectureListHtml("")}</div>
  </section>`;
  updateNav("outline");
  document.querySelector("#outline-search").addEventListener("input", event => {
    const query = event.target.value.trim().toLowerCase();
    document.querySelector("#definition-results").innerHTML = definitionIndexHtml(query);
    document.querySelector("#outline-results").innerHTML = lectureListHtml(query);
    renderMath(document.querySelector("#definition-results"));
    renderMath(document.querySelector("#outline-results"));
  });
  renderMath(main);
}

function definitionIndexHtml(query) {
  const matches = definitionRecords.filter(definition => {
    const haystack = `${definition.id} ${definition.title} ${(definition.aliases || []).join(" ")} ${definition.object} ${definition.scope}`.toLowerCase();
    return !query || haystack.includes(query);
  });
  if (!matches.length) return "";
  const items = matches.map(definition => `<li>
    <span class="definition-kind">${definitionKindLabel(definition.kind)}</span>
    <button data-browse-lesson="${escapeAttribute(definition.lessonId)}" data-anchor="definition-${escapeAttribute(definition.id)}">${safeRichText(definition.title)}</button>
    <code>${escapeHtml(definition.id)}</code>
  </li>`).join("");
  return `<details class="definition-index" ${query ? "open" : ""}><summary>定义与假设 · ${matches.length} 项</summary><ul>${items}</ul></details>`;
}

function lectureListHtml(query) {
  return course.lectures.map((lecture, lectureIndex) => {
    const matching = lecture.lessons.filter(lesson => {
      const blockText = (lesson.blocks || []).flatMap(block => [block.title, ...(block.paragraphs || []), block.prompt, block.purpose]).filter(Boolean).join(" ");
      const text = `${lesson.title} ${lesson.concept.join(" ")} ${blockText} ${(lesson.exerciseIds || []).join(" ")}`.toLowerCase();
      return !query || text.includes(query);
    });
    if (query && matching.length === 0) return "";
    const items = matching.length ? matching.map((lesson, i) => {
      const done = state.completedIds.includes(lesson.id);
      const current = lesson.id === state.mainLessonId;
      const subgoals = (lesson.blocks || []).filter(block => block.subgoal);
      return `<li class="lesson-row"><span>${done ? "✓" : i + 1}</span><button data-browse-lesson="${escapeAttribute(lesson.id)}">${safeRichText(lesson.title)}</button><span class="status-dot status-${lesson.status}">${done ? "已完成本轮" : current ? "正在学习" : lesson.status === "ready" ? "可学习" : lesson.status}</span>${subgoals.length ? `<ol class="outline-subgoals">${subgoals.map(block => `<li>${block.subgoal}. ${safeRichText(block.title)}</li>`).join("")}</ol>` : ""}</li>`;
    }).join("") : `<li><span>·</span><span>${lecture.description}</span><span class="status-dot status-${lecture.status}">${lecture.status === "planned" ? "待编写，不冒充可学" : lecture.status}</span></li>`;
    return `<details class="lecture" ${lectureIndex === 0 ? "open" : ""}><summary>${lecture.id} · ${lecture.title} <span class="microcopy">${lecture.pptPages} 页</span></summary><ul class="lesson-list">${items}</ul></details>`;
  }).join("") || `<p class="empty">没有匹配内容。</p>`;
}

function renderExercises() {
  const assignment = assignmentDescription();
  main.innerHTML = `<section class="panel-page">
    <div class="eyebrow">教材习题</div>
    <h1>与主线共用同一份题目状态</h1>
    <p class="lede">这里只用于查找和回看。浏览题目、展开答案不会推进课程，也不会产生成功记录。${assignment.configured ? `本周设置：${assignment.text}` : "本周提交范围尚未指定。"}</p>
    <input id="exercise-search" class="search-box" type="search" placeholder="搜索题号、主题或中文说明" aria-label="搜索教材习题">
    <div id="exercise-results" class="exercise-index">${exerciseIndexHtml("")}</div>
  </section>`;
  updateNav("exercises");
  document.querySelector("#exercise-search").addEventListener("input", event => {
    document.querySelector("#exercise-results").innerHTML = exerciseIndexHtml(event.target.value.trim().toLowerCase());
    renderMath(document.querySelector("#exercise-results"));
  });
  renderMath(main);
}

function exerciseIndexHtml(query) {
  const ready = course.exercises.filter(ex => !query || `${ex.number} ${ex.chinese} ${ex.tests}`.toLowerCase().includes(query));
  const blocks = ready.map(ex => {
    const rating = state.exerciseState[ex.id]?.selfRating;
    const assigned = state.assignment?.exerciseIds?.includes(ex.id);
    return `<article><span class="tag">${escapeHtml(ex.lectureId)}</span><span class="tag">教材难度 ${escapeHtml(ex.difficulty)}</span>${assigned ? `<span class="tag tag-assigned">本周作业</span>` : ""}<h2>${escapeHtml(ex.number)}</h2><p>${safeRichText(ex.chinese)}</p><p class="microcopy">${rating === "can" ? "自评：会做" : rating === "cannot" ? "自评：还不会" : "未评价"} · ${safeRichText(ex.source)}</p><button class="secondary" data-browse-lesson="${escapeAttribute(ex.lessonId)}" data-anchor="exercise-${escapeAttribute(ex.id)}">回到主线中的原题</button></article>`;
  }).join("");
  const remaining = course.exercises.filter(ex => ex.status !== "ready").length;
  const pending = course.lectures.filter(lecture => lecture.status !== "ready").map(lecture => lecture.id).join("–");
  return blocks + (remaining ? `<article><span class="tag">${pending}</span><h2>其余 ${remaining} 道题</h2><p>已在来源索引中定位，但教学内容与参考解尚未编写完成；当前不冒充可学习或已核验。</p><p class="microcopy">后续按现有讲次顺序接入。</p></article>` : "");
}

function assignmentDescription() {
  const ids = state.assignment?.exerciseIds;
  const dueDate = state.assignment?.dueDate;
  const configured = Array.isArray(ids) && ids.length > 0;
  const numbers = configured
    ? ids.map(id => exerciseById.get(id)?.number).filter(Boolean).join("、")
    : "";
  const due = dueDate ? `；截止 ${dueDate}` : "；未设置截止日期";
  return { configured, text: configured ? `${numbers}${due}` : "尚未设置" };
}

function renderAssignmentSettings() {
  const selected = new Set(state.assignment?.exerciseIds || []);
  document.querySelector("#assignment-due").value = state.assignment?.dueDate || "";
  document.querySelector("#assignment-exercises").innerHTML = course.exercises.map(exercise => `
    <label>
      <input type="checkbox" value="${escapeAttribute(exercise.id)}" ${selected.has(exercise.id) ? "checked" : ""}>
      <strong>${escapeHtml(exercise.number)}</strong>
      <span>${safeRichText(exercise.chinese)}</span>
    </label>`).join("");
  renderMath(document.querySelector("#assignment-exercises"));
  const description = assignmentDescription();
  document.querySelector("#assignment-note").textContent = description.configured
    ? description.text
    : "未设置时不会把17题自动标为本周作业。";
}

function updateNav(active) {
  document.querySelectorAll("[data-route]").forEach(node => node.setAttribute("aria-current", node.dataset.route === active ? "page" : "false"));
}

function bindDetails() {
  main.querySelectorAll("details[data-detail-id]").forEach(node => node.addEventListener("toggle", () => {
    state.detailsOpen[node.dataset.detailId] = node.open;
    if (node.dataset.detailId.includes(":hint") && node.open) {
      const practiceId = node.dataset.detailId.split(":hint")[0];
      state.exerciseState[practiceId] = { ...(state.exerciseState[practiceId] || {}), hintUsed: true };
    }
    persist();
  }));
}

function navigate(target) {
  route = target;
  history.replaceState(null, "", `#${target}`);
  if (target === "outline") renderOutline();
  else if (target === "exercises") renderExercises();
  else renderLesson(state.revisitLessonId || state.browseLessonId || state.mainLessonId, Boolean(state.browseLessonId));
}

document.addEventListener("click", event => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) { event.preventDefault(); navigate(routeButton.dataset.route); return; }

  const browse = event.target.closest("[data-browse-lesson]");
  if (browse) {
    state.mainScroll = route === "learn" && !state.browseLessonId ? scrollY : state.mainScroll;
    state.browseLessonId = browse.dataset.browseLesson;
    state.browseScroll = 0;
    persist(true);
    route = "learn";
    history.replaceState(null, "", "#learn");
    renderLesson(state.browseLessonId, true);
    if (browse.dataset.anchor) requestAnimationFrame(() => document.getElementById(browse.dataset.anchor)?.scrollIntoView());
    return;
  }

  if (event.target.closest("[data-return-main]")) {
    state.browseLessonId = null;
    persist(true);
    renderLesson(state.mainLessonId, false);
    return;
  }

  const revisit = event.target.closest("[data-study-revisit]");
  if (revisit) {
    state.revisitLessonId = revisit.dataset.studyRevisit;
    state.browseLessonId = null;
    state.mainScroll = scrollY;
    persist(true);
    renderLesson(state.revisitLessonId, false);
    return;
  }

  if (event.target.closest("[data-cancel-revisit]")) {
    state.revisitLessonId = null;
    persist(true);
    renderLesson(state.mainLessonId, false);
    return;
  }

  const rating = event.target.closest("[data-rate-practice]");
  if (rating) {
    const id = rating.dataset.practiceId;
    state.exerciseState[id] = { ...(state.exerciseState[id] || {}), selfRating: rating.dataset.ratePractice };
    persist(true);
    main.querySelectorAll(`[data-practice-id="${CSS.escape(id)}"]`).forEach(button => button.setAttribute("aria-pressed", String(button === rating)));
    toast("练习自评已保存；不会影响主线完成。 ");
    return;
  }

  const reviewRating = event.target.closest("[data-review-rating]");
  if (reviewRating) {
    const card = reviewRating.closest("[data-review-id]");
    state = rateReview(state, card.dataset.reviewId, reviewRating.dataset.reviewRating);
    persist(true);
    const dueAt = new Date(state.reviewCards[card.dataset.reviewId].dueAt);
    toast(`真实回忆已记录；下次 ${dueAt.toLocaleDateString("zh-CN")}。`);
    renderLesson(state.mainLessonId, false);
    return;
  }

  const complete = event.target.closest("[data-complete-lesson]");
  if (complete && !completing) {
    completing = true;
    const currentId = complete.dataset.completeLesson;
    const lesson = lessonById.get(currentId);
    const returnToMain = state.revisitLessonId === currentId;
    state = completeLesson(state, currentId, returnToMain ? state.mainLessonId : nextLessonId(currentId), lesson.review);
    if (returnToMain) state.revisitLessonId = null;
    persist(true);
    toast("已记为完成本轮；这不等于掌握。 ");
    completing = false;
    renderLesson(state.mainLessonId, false);
  }
});

let lastScrollSave = 0;
addEventListener("scroll", () => {
  if (route !== "learn") return;
  if (Date.now() - lastScrollSave < 180) return;
  lastScrollSave = Date.now();
  if (state.browseLessonId) state.browseScroll = scrollY;
  else state.mainScroll = scrollY;
  persist();
}, { passive: true });

addEventListener("beforeunload", () => {
  clearTimeout(saveTimer);
  saveState(state);
});

const settingsButton = document.querySelector("#reader-settings");
const settingsPanel = document.querySelector("#settings-panel");
settingsButton.addEventListener("click", () => {
  settingsPanel.hidden = !settingsPanel.hidden;
  settingsButton.setAttribute("aria-expanded", String(!settingsPanel.hidden));
});
document.querySelector("#font-size").addEventListener("input", event => {
  state.fontSize = Number(event.target.value);
  document.documentElement.style.setProperty("--reader-size", `${state.fontSize}px`);
  persist();
});
document.querySelector("#save-assignment").addEventListener("click", () => {
  const ids = [...document.querySelectorAll("#assignment-exercises input:checked")].map(input => input.value);
  state.assignment = {
    dueDate: document.querySelector("#assignment-due").value || null,
    exerciseIds: ids.length ? ids : null
  };
  persist(true);
  renderAssignmentSettings();
  if (route === "exercises") renderExercises();
  else if (route === "outline") renderOutline();
  toast(ids.length ? "本周作业设置已保存。" : "未选择题目，保持未指定状态。 ");
});
document.querySelector("#clear-assignment").addEventListener("click", () => {
  state.assignment = { dueDate: null, exerciseIds: null };
  persist(true);
  renderAssignmentSettings();
  if (route === "exercises") renderExercises();
  else if (route === "outline") renderOutline();
  toast("本周作业设置已清空；课程进度未改变。 ");
});
document.querySelector("#export-data").addEventListener("click", () => {
  const blob = new Blob([exportBackup(state)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `advanced-micro-backup-${new Date().toISOString().slice(0,10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  toast("高微学习备份已导出。 ");
});
document.querySelector("#import-data").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    state = importBackup(
      await file.text(),
      localStorage,
      new Set(lessons.map(lesson => lesson.id)),
      new Set(course.exercises.map(exercise => exercise.id))
    );
    document.documentElement.style.setProperty("--reader-size", `${state.fontSize || 19}px`);
    navigate("learn");
    toast(state._importIntegrity === "verified"
      ? "备份完整性已验证并恢复；导入前状态已保留。 "
      : "旧版备份已恢复（无校验码）；导入前状态已保留。 ");
  } catch (error) {
    toast(`拒绝导入：${error.message}`);
  } finally {
    event.target.value = "";
  }
});

if (state.loadError) toast(`未覆盖损坏数据：${state.loadError}`);
else if (recoveredProgressCount > 0) toast(`已按原主线位置恢复前 ${recoveredProgressCount} 个知识点的完成记录；没有写入掌握或回忆评分。`);
else if (state._migrationFrom) toast(`课程已从 ${state._migrationFrom} 更新；已有学习记录完整保留。`);
console.info(`高级微观课程 ${CONTENT_VERSION}，独立存储键已启用。`);
document.querySelector("#storage-note").textContent = `数据只保存在这台设备的独立高微空间。内容版本 ${CONTENT_VERSION} · FSRS v6。`;
renderAssignmentSettings();
navigate(["learn", "outline", "exercises"].includes(route) ? route : "learn");
