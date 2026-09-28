import test from "node:test";
import assert from "node:assert/strict";
import {
  COURSE_ID, STORAGE_KEY, PREIMPORT_KEY, REVIEW_ALGORITHM, initialState, completeLesson,
  rateReview, dueReviewIds, previewReviewOutcomes, exportBackup, importBackup,
  loadState, saveState, reconcileMainlineCompletion
} from "../src/state.js";

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

test("使用独立 courseId 和稳定默认主线", () => {
  const state = initialState("L01-M01");
  assert.equal(state.courseId, COURSE_ID);
  assert.equal(state.mainLessonId, "L01-M01");
  assert.deepEqual(state.completedIds, []);
});

test("主线已到后续知识点时恢复此前缺失的完成记录但不推断当前点已完成", () => {
  const state = initialState("L01-M09");
  const lessonIds = ["L01-M01", "L01-M02", "L01-M03", "L01-M04", "L01-M05", "L01-M06", "L01-M07", "L01-M08", "L01-M09"];
  const recovered = reconcileMainlineCompletion(state, lessonIds);
  assert.deepEqual(recovered.completedIds, lessonIds.slice(0, 8));
  assert.equal(recovered.mainLessonId, "L01-M09");
  assert.equal(recovered.reviewLog.length, 0);
  assert.equal(Object.keys(recovered.reviewCards).length, 0);
  assert.deepEqual(recovered.recoveryLog.at(-1).recoveredLessonIds, lessonIds.slice(0, 8));
});

test("双击式重复完成不会制造重复记录，也不会自动评价练习", () => {
  let state = initialState("L01-M01");
  const review = { id: "R-1" };
  state = completeLesson(state, "L01-M01", "L01-M02", review);
  state = completeLesson(state, "L01-M01", "L01-M02", review);
  assert.deepEqual(state.completedIds, ["L01-M01"]);
  assert.deepEqual(state.exerciseState, {});
  assert.equal(Object.keys(state.reviewCards).length, 1);
  assert.equal(state.reviewCards["R-1"].lastRating, null);
});

test("启用回忆不等于成功回忆；评分后只排程一次", () => {
  const now = new Date("2026-09-26T10:00:00.000Z");
  let state = completeLesson(initialState(), "L01-M01", "L01-M02", { id: "R-1" });
  state.reviewCards["R-1"].dueAt = now.toISOString();
  assert.deepEqual(dueReviewIds(state, now), ["R-1"]);
  state = rateReview(state, "R-1", "good", now);
  assert.equal(state.reviewLog.length, 1);
  assert.equal(state.reviewCards["R-1"].lastRating, "good");
  assert.equal(state.reviewCards["R-1"].algorithm, REVIEW_ALGORITHM);
  assert.ok(state.reviewCards["R-1"].stability > 0);
  assert.ok(state.reviewCards["R-1"].difficulty >= 1);
  assert.equal(state.reviewCards["R-1"].intervalDays, 3);
  assert.deepEqual(dueReviewIds(state, now), []);
});

test("FSRS 关闭短期步后 Again 不会在当前学习段立即重弹", () => {
  const now = new Date("2026-09-26T10:00:00.000Z");
  let state = completeLesson(initialState(), "L01-M01", "L01-M02", { id: "R-A" });
  state = rateReview(state, "R-A", "again", now);
  const delayMs = new Date(state.reviewCards["R-A"].dueAt) - now;
  assert.equal(state.reviewCards["R-A"].intervalDays, 1);
  assert.equal(delayMs, 86400000);
});

test("界面可预览 FSRS 四个评分的实际间隔", () => {
  const now = new Date("2026-09-26T10:00:00.000Z");
  const state = completeLesson(initialState(), "L01-M01", "L01-M02", { id: "R-P" });
  const preview = previewReviewOutcomes(state, "R-P", now);
  assert.deepEqual(
    [preview.again.intervalDays, preview.hard.intervalDays, preview.good.intervalDays, preview.easy.intervalDays],
    [1, 2, 3, 8]
  );
});

test("旧固定间隔卡片在下一次评分时迁移到 FSRS 且保留日志", () => {
  const now = new Date("2026-09-26T10:00:00.000Z");
  const state = initialState();
  state.reviewCards["R-OLD"] = {
    id: "R-OLD", lessonId: "L01-M01", enabledAt: "2026-09-20T10:00:00.000Z",
    dueAt: now.toISOString(), intervalDays: 3, repetitions: 1, lastRating: "good"
  };
  state.reviewLog.push({
    reviewId: "R-OLD", rating: "good", at: "2026-09-20T10:00:00.000Z",
    dueAt: "2026-09-23T10:00:00.000Z"
  });
  const migrated = rateReview(state, "R-OLD", "hard", now);
  assert.equal(migrated.reviewCards["R-OLD"].algorithm, REVIEW_ALGORITHM);
  assert.ok(migrated.reviewCards["R-OLD"].fsrs);
  assert.equal(migrated.reviewLog.length, 2);
});

test("保存和刷新恢复主线、展开状态及练习自评", () => {
  const storage = new MemoryStorage();
  const state = initialState();
  state.mainLessonId = "L01-M06";
  state.mainScroll = 420;
  state.detailsOpen["P:answer"] = true;
  state.exerciseState.P = { selfRating: "cannot", hintUsed: true };
  state.assignment = { dueDate: "2026-10-03", exerciseIds: ["MWG-1.B.1"] };
  saveState(state, storage);
  const loaded = loadState(storage);
  assert.equal(loaded.mainLessonId, "L01-M06");
  assert.equal(loaded.mainScroll, 420);
  assert.equal(loaded.detailsOpen["P:answer"], true);
  assert.equal(loaded.exerciseState.P.selfRating, "cannot");
  assert.deepEqual(loaded.assignment, { dueDate: "2026-10-03", exerciseIds: ["MWG-1.B.1"] });
});

test("旧内容版本迁移保留完成、自评、FSRS、作业和展开状态", () => {
  const storage = new MemoryStorage();
  const old = initialState();
  old.contentVersion = "2026.09.26-l02";
  old.completedIds = ["L01-M01", "L01-M02"];
  old.exerciseState = { "P-L01-M01": { selfRating: "cannot" } };
  old.detailsOpen = { "P-L01-M01:answer": true };
  old.assignment = { dueDate: "2026-10-03", exerciseIds: ["MWG-1.B.1"] };
  old.reviewLog = [{ reviewId: "R-1", rating: "good", at: "2026-09-25T10:00:00.000Z" }];
  storage.setItem(STORAGE_KEY, JSON.stringify(old));
  const migrated = loadState(storage);
  assert.equal(migrated._migrationFrom, "2026.09.26-l02");
  assert.deepEqual(migrated.completedIds, old.completedIds);
  assert.equal(migrated.exerciseState["P-L01-M01"].selfRating, "cannot");
  assert.equal(migrated.detailsOpen["P-L01-M01:answer"], true);
  assert.deepEqual(migrated.assignment, old.assignment);
  assert.equal(migrated.reviewLog.length, 1);
  assert.equal(migrated.migrationLog.at(-1).preservedCompletedCount, 2);
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).contentVersion, migrated.contentVersion);
});

test("旧版完成的深化模块保留历史完成，但进入待补学队列", () => {
  const storage = new MemoryStorage();
  const old = initialState("L02-M01");
  old.contentVersion = "2026.09.26-full-r7";
  old.completedIds = ["L01-M09", "L01-M13"];
  storage.setItem(STORAGE_KEY, JSON.stringify(old));
  const migrated = loadState(storage);
  assert.deepEqual(migrated.completedIds, ["L01-M09", "L01-M13"]);
  assert.deepEqual(migrated.revisitLessonIds, ["L01-M09", "L01-M13"]);
  assert.equal(migrated.mainLessonId, "L02-M01");

  const afterRevisit = completeLesson(migrated, "L01-M09", migrated.mainLessonId, null);
  assert.deepEqual(afterRevisit.revisitLessonIds, ["L01-M13"]);
  assert.ok(afterRevisit.acknowledgedRevisions.includes("prereq-equivalence-partition-v1"));
  assert.equal(afterRevisit.mainLessonId, "L02-M01");
});

test("五讲原地新增前置的旧完成记录全部进入待补学而不移动主线", () => {
  const storage = new MemoryStorage();
  const old = initialState("L05-M20");
  old.contentVersion = "2026.09.26-full-r7";
  old.completedIds = ["L01-M12", "L02-M01", "L03-M08", "L04-M13", "L05-M19"];
  storage.setItem(STORAGE_KEY, JSON.stringify(old));
  const migrated = loadState(storage);
  assert.deepEqual(migrated.completedIds, old.completedIds);
  assert.deepEqual(migrated.revisitLessonIds, old.completedIds);
  assert.equal(migrated.mainLessonId, "L05-M20");

  const afterRevisit = completeLesson(migrated, "L03-M08", migrated.mainLessonId, null);
  assert.ok(!afterRevisit.revisitLessonIds.includes("L03-M08"));
  assert.ok(afterRevisit.acknowledgedRevisions.includes("prereq-l03-m08-v1"));
  assert.equal(afterRevisit.mainLessonId, "L05-M20");
});

test("C(B) 与 WARP 对象教学升级保留旧完成但要求补学", () => {
  const storage = new MemoryStorage();
  const old = initialState("L01-M16");
  old.contentVersion = "2026.09.28-logic-latex-1";
  old.completedIds = ["L01-M14", "L01-M15"];
  storage.setItem(STORAGE_KEY, JSON.stringify(old));
  const migrated = loadState(storage);
  assert.deepEqual(migrated.completedIds, old.completedIds);
  assert.ok(migrated.revisitLessonIds.includes("L01-M14"));
  assert.ok(migrated.revisitLessonIds.includes("L01-M15"));
  assert.equal(migrated.mainLessonId, "L01-M16");
  assert.equal(migrated.exerciseState["P-PREQ-L01-CHOICE"], undefined);
});

test("导入前保留当前状态，错误课程备份被拒绝且不覆盖", () => {
  const storage = new MemoryStorage();
  const current = initialState();
  current.mainLessonId = "L01-M03";
  storage.setItem(STORAGE_KEY, exportBackup(current));
  const invalid = JSON.stringify({ ...current, courseId: "topology-learning-v1" });
  assert.throws(() => importBackup(invalid, storage), /课程不匹配/);
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).mainLessonId, "L01-M03");
  const incoming = { ...current, mainLessonId: "L01-M05" };
  importBackup(exportBackup(incoming), storage);
  assert.equal(JSON.parse(storage.getItem(PREIMPORT_KEY)).mainLessonId, "L01-M03");
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).mainLessonId, "L01-M05");
});

test("带校验码的备份可恢复，内容被改动时拒绝且不覆盖", () => {
  const storage = new MemoryStorage();
  const current = initialState("L01-M02");
  storage.setItem(STORAGE_KEY, JSON.stringify(current));
  const exported = exportBackup({ ...current, mainLessonId: "L03-M08" });
  const restored = importBackup(exported, storage, new Set(["L01-M02", "L03-M08"]));
  assert.equal(restored._importIntegrity, "verified");
  assert.equal(restored.mainLessonId, "L03-M08");

  const tampered = JSON.parse(exported);
  tampered.mainLessonId = "L05-M20";
  assert.throws(() => importBackup(JSON.stringify(tampered), storage), /完整性校验失败/);
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).mainLessonId, "L03-M08");
});

test("导入拒绝当前课程不存在的主线 ID", () => {
  const storage = new MemoryStorage();
  const backup = exportBackup({ ...initialState(), mainLessonId: "L99-M01" });
  assert.throws(
    () => importBackup(backup, storage, new Set(["L01-M01"])),
    /主线位置不存在/
  );
});

test("导入拒绝当前课程不存在的作业题号", () => {
  const storage = new MemoryStorage();
  const state = initialState();
  state.assignment = { dueDate: "2026-10-03", exerciseIds: ["MWG-9.Z.9"] };
  const backup = exportBackup(state);
  assert.throws(
    () => importBackup(backup, storage, new Set(["L01-M01"]), new Set(["MWG-1.B.1"])),
    /作业题号/
  );
});

test("无校验码的同课程旧备份可兼容恢复并明确标记", () => {
  const storage = new MemoryStorage();
  const legacy = JSON.stringify({ ...initialState(), mainLessonId: "L02-M01" });
  const restored = importBackup(legacy, storage, new Set(["L01-M01", "L02-M01"]));
  assert.equal(restored.mainLessonId, "L02-M01");
  assert.equal(restored._importIntegrity, "legacy-unchecked");
});

test("最后一课完成后保留主线位置并启用回忆，不制造空白位置", () => {
  let state = initialState("L05-M20");
  state = completeLesson(state, "L05-M20", null, { id: "R-LAST" });
  assert.equal(state.mainLessonId, "L05-M20");
  assert.deepEqual(state.completedIds, ["L05-M20"]);
  assert.equal(state.reviewCards["R-LAST"].lastRating, null);
  assert.deepEqual(dueReviewIds(state), ["R-LAST"]);
});
