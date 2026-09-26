import test from "node:test";
import assert from "node:assert/strict";
import { buildDailyPlan } from "../src/planner.js";

const lessons = [
  { id: "A", title: "A", minutes: 12, lectureId: "L01" },
  { id: "B", title: "B", minutes: 18, lectureId: "L01" },
  { id: "C", title: "C", minutes: 20, lectureId: "L01" },
  { id: "D", title: "D", minutes: 25, lectureId: "L02" }
];

test("今日计划为到期回忆保留最多10分钟并按主线填充剩余时间", () => {
  const plan = buildDailyPlan({ lessons, mainLessonId: "A", completedIds: [], dueReviewCount: 8 });
  assert.equal(plan.reviewMinutes, 10);
  assert.equal(plan.learningBudget, 50);
  assert.deepEqual(plan.plannedLessons.map(x => x.id), ["A", "B", "C"]);
  assert.equal(plan.learningMinutes, 50);
});

test("今日计划跳过已完成模块且不为凑时长越过预算", () => {
  const plan = buildDailyPlan({ lessons, mainLessonId: "A", completedIds: ["A"], dueReviewCount: 1 });
  assert.equal(plan.reviewMinutes, 2);
  assert.deepEqual(plan.plannedLessons.map(x => x.id), ["B", "C"]);
  assert.equal(plan.learningMinutes, 38);
});

test("全课完成后计划不制造新的学习任务", () => {
  const plan = buildDailyPlan({ lessons, mainLessonId: "D", completedIds: lessons.map(x => x.id), dueReviewCount: 0 });
  assert.equal(plan.courseComplete, true);
  assert.deepEqual(plan.plannedLessons, []);
});
