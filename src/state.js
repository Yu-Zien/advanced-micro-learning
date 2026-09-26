import { createEmptyCard, fsrs, Rating, State } from "../vendor/ts-fsrs/index.mjs";

export const COURSE_ID = "advanced-microeconomics-2026";
export const SCHEMA_VERSION = 1;
export const CONTENT_VERSION = "2026.09.26-full-r7";
export const STORAGE_KEY = `${COURSE_ID}::state::v1`;
export const PREIMPORT_KEY = `${COURSE_ID}::pre-import::v1`;
export const REVIEW_ALGORITHM = "FSRS-6/ts-fsrs-5.4.2";

const reviewScheduler = fsrs({
  request_retention: 0.9,
  maximum_interval: 36500,
  enable_fuzz: false,
  enable_short_term: false,
  learning_steps: [],
  relearning_steps: []
});

const ratingMap = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy
};

function serializeFsrsCard(card) {
  return {
    ...card,
    due: card.due.toISOString(),
    last_review: card.last_review ? card.last_review.toISOString() : null
  };
}

function deserializeFsrsCard(card) {
  return {
    ...card,
    due: new Date(card.due),
    last_review: card.last_review ? new Date(card.last_review) : undefined
  };
}

function serializeFsrsLog(log) {
  return {
    ...log,
    due: log.due.toISOString(),
    review: log.review.toISOString()
  };
}

function replayLegacyCard(card, reviewLog, now) {
  let migrated = createEmptyCard(new Date(card.enabledAt || now));
  const history = reviewLog
    .filter(log => log.reviewId === card.id && ratingMap[log.rating])
    .sort((a, b) => new Date(a.at) - new Date(b.at));
  for (const log of history) {
    migrated = reviewScheduler.next(migrated, new Date(log.at), ratingMap[log.rating]).card;
  }
  return migrated;
}

export function initialState(firstLessonId = "L01-M01") {
  return {
    courseId: COURSE_ID,
    schemaVersion: SCHEMA_VERSION,
    contentVersion: CONTENT_VERSION,
    mainLessonId: firstLessonId,
    mainScroll: 0,
    browseLessonId: null,
    completedIds: [],
    exerciseState: {},
    detailsOpen: {},
    reviewCards: {},
    reviewLog: [],
    assignment: { dueDate: null, exerciseIds: null },
    migrationLog: [],
    fontSize: 19,
    updatedAt: new Date().toISOString()
  };
}

export function validateState(value) {
  if (!value || typeof value !== "object") throw new Error("备份内容不是有效对象。");
  if (value.courseId !== COURSE_ID) throw new Error(`课程不匹配：需要 ${COURSE_ID}。`);
  if (value.schemaVersion !== SCHEMA_VERSION) throw new Error(`暂不支持 schemaVersion=${value.schemaVersion}。`);
  if (typeof value.mainLessonId !== "string") throw new Error("备份缺少主线位置。");
  if (!Array.isArray(value.completedIds) || !value.completedIds.every(id => typeof id === "string")) throw new Error("备份中的完成进度格式不正确。");
  if (!Array.isArray(value.reviewLog)) throw new Error("备份中的回忆日志格式不正确。");
  if (!value.exerciseState || typeof value.exerciseState !== "object" || Array.isArray(value.exerciseState)) throw new Error("备份中的练习状态格式不正确。");
  if (!value.reviewCards || typeof value.reviewCards !== "object" || Array.isArray(value.reviewCards)) throw new Error("备份中的回忆卡片格式不正确。");
  if (value.assignment !== undefined) {
    if (!value.assignment || typeof value.assignment !== "object" || Array.isArray(value.assignment)) throw new Error("备份中的作业设置格式不正确。");
    if (value.assignment.exerciseIds !== null && !Array.isArray(value.assignment.exerciseIds)) throw new Error("备份中的作业题号格式不正确。");
  }
  return true;
}

function checksumPayload(value) {
  const input = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function mergeWithDefaults(raw, firstLessonId = "L01-M01") {
  const base = initialState(firstLessonId);
  validateState(raw);
  const previousVersion = raw.contentVersion || "legacy-unknown";
  const migrated = {
    ...base,
    ...raw,
    courseId: COURSE_ID,
    schemaVersion: SCHEMA_VERSION,
    contentVersion: CONTENT_VERSION,
    completedIds: [...new Set(raw.completedIds)],
    exerciseState: { ...raw.exerciseState },
    detailsOpen: { ...raw.detailsOpen },
    reviewCards: { ...raw.reviewCards },
    reviewLog: [...raw.reviewLog],
    assignment: { ...base.assignment, ...(raw.assignment || {}) },
    migrationLog: [...(raw.migrationLog || [])]
  };
  if (previousVersion !== CONTENT_VERSION) {
    migrated.migrationLog.push({
      from: previousVersion,
      to: CONTENT_VERSION,
      at: new Date().toISOString(),
      preservedCompletedCount: migrated.completedIds.length,
      preservedReviewCount: migrated.reviewLog.length
    });
    Object.defineProperty(migrated, "_migrationFrom", { value: previousVersion, enumerable: false });
  }
  return migrated;
}

export function loadState(storage = localStorage, firstLessonId) {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return initialState(firstLessonId);
  try {
    const merged = mergeWithDefaults(JSON.parse(raw), firstLessonId);
    if (merged._migrationFrom) storage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.error("高微学习状态读取失败；保留损坏数据，不自动清空。", error);
    const state = initialState(firstLessonId);
    state.loadError = error.message;
    return state;
  }
}

export function saveState(state, storage = localStorage) {
  const saved = { ...state, updatedAt: new Date().toISOString(), contentVersion: CONTENT_VERSION };
  validateState(saved);
  storage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return saved;
}

export function completeLesson(state, lessonId, nextLessonId, review) {
  const completedIds = state.completedIds.includes(lessonId)
    ? state.completedIds
    : [...state.completedIds, lessonId];
  const reviewCards = { ...state.reviewCards };
  if (review && !reviewCards[review.id]) {
    const enabledAt = new Date();
    const fsrsCard = createEmptyCard(enabledAt);
    reviewCards[review.id] = {
      id: review.id,
      lessonId,
      algorithm: REVIEW_ALGORITHM,
      enabledAt: enabledAt.toISOString(),
      dueAt: fsrsCard.due.toISOString(),
      intervalDays: 0,
      repetitions: 0,
      lastRating: null,
      fsrs: serializeFsrsCard(fsrsCard)
    };
  }
  return {
    ...state,
    completedIds,
    reviewCards,
    mainLessonId: nextLessonId || lessonId,
    mainScroll: 0,
    browseLessonId: null
  };
}

export function rateReview(state, reviewId, rating, now = new Date()) {
  if (!ratingMap[rating]) throw new Error("未知回忆评分。");
  const card = state.reviewCards[reviewId];
  if (!card) throw new Error("回忆项尚未启用。");
  const fsrsCard = card.fsrs
    ? deserializeFsrsCard(card.fsrs)
    : replayLegacyCard(card, state.reviewLog, now);
  const retrievability = fsrsCard.state === State.New
    ? null
    : reviewScheduler.get_retrievability(fsrsCard, now, false);
  const result = reviewScheduler.next(fsrsCard, now, ratingMap[rating]);
  const next = {
    ...card,
    algorithm: REVIEW_ALGORITHM,
    repetitions: result.card.reps,
    intervalDays: result.card.scheduled_days,
    lastRating: rating,
    lastReviewedAt: now.toISOString(),
    dueAt: result.card.due.toISOString(),
    stability: result.card.stability,
    difficulty: result.card.difficulty,
    retrievabilityAtReview: retrievability,
    fsrs: serializeFsrsCard(result.card)
  };
  return {
    ...state,
    reviewCards: { ...state.reviewCards, [reviewId]: next },
    reviewLog: [...state.reviewLog, {
      reviewId,
      rating,
      algorithm: REVIEW_ALGORITHM,
      at: now.toISOString(),
      dueAt: next.dueAt,
      intervalDays: next.intervalDays,
      stability: next.stability,
      difficulty: next.difficulty,
      retrievabilityAtReview: retrievability,
      fsrsLog: serializeFsrsLog(result.log)
    }]
  };
}

export function previewReviewOutcomes(state, reviewId, now = new Date()) {
  const card = state.reviewCards[reviewId];
  if (!card) return {};
  const fsrsCard = card.fsrs
    ? deserializeFsrsCard(card.fsrs)
    : replayLegacyCard(card, state.reviewLog, now);
  return Object.fromEntries(Object.entries(ratingMap).map(([key, value]) => {
    const next = reviewScheduler.next(fsrsCard, now, value).card;
    return [key, {
      dueAt: next.due.toISOString(),
      intervalDays: next.scheduled_days,
      stability: next.stability,
      difficulty: next.difficulty
    }];
  }));
}

export function dueReviewIds(state, now = new Date()) {
  return Object.values(state.reviewCards)
    .filter(card => new Date(card.dueAt).getTime() <= now.getTime())
    .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))
    .map(card => card.id);
}

export function exportBackup(state) {
  const payload = {
    ...state,
    contentVersion: CONTENT_VERSION,
    backupFormat: "advanced-micro-backup-v1",
    exportedAt: new Date().toISOString()
  };
  delete payload.checksum;
  validateState(payload);
  return JSON.stringify({ ...payload, checksum: checksumPayload(payload) }, null, 2);
}

export function importBackup(text, storage = localStorage, allowedLessonIds = null, allowedExerciseIds = null) {
  const parsed = JSON.parse(text);
  validateState(parsed);
  const { checksum, backupFormat, exportedAt, ...statePayload } = parsed;
  if (checksum && checksum !== checksumPayload({ ...statePayload, backupFormat, exportedAt })) {
    throw new Error("备份完整性校验失败，文件可能不完整或已被修改。");
  }
  if (allowedLessonIds && !allowedLessonIds.has(statePayload.mainLessonId)) {
    throw new Error(`备份中的主线位置不存在：${statePayload.mainLessonId}。`);
  }
  if (allowedLessonIds && statePayload.browseLessonId && !allowedLessonIds.has(statePayload.browseLessonId)) {
    throw new Error(`备份中的回看位置不存在：${statePayload.browseLessonId}。`);
  }
  const unknownCompletedId = allowedLessonIds && statePayload.completedIds.find(id => !allowedLessonIds.has(id));
  if (unknownCompletedId) throw new Error(`备份包含当前课程不存在的完成记录：${unknownCompletedId}。`);
  const unknownReview = allowedLessonIds && Object.values(statePayload.reviewCards)
    .find(card => card?.lessonId && !allowedLessonIds.has(card.lessonId));
  if (unknownReview) throw new Error(`备份包含当前课程不存在的回忆来源：${unknownReview.lessonId}。`);
  const unknownAssignment = allowedExerciseIds && statePayload.assignment?.exerciseIds
    ?.find(id => !allowedExerciseIds.has(id));
  if (unknownAssignment) throw new Error(`备份包含当前课程不存在的作业题号：${unknownAssignment}。`);
  const current = storage.getItem(STORAGE_KEY);
  if (current) storage.setItem(PREIMPORT_KEY, current);
  const merged = mergeWithDefaults(statePayload);
  storage.setItem(STORAGE_KEY, JSON.stringify(merged));
  Object.defineProperty(merged, "_importIntegrity", {
    value: checksum ? "verified" : "legacy-unchecked",
    enumerable: false
  });
  return merged;
}
