import fs from "node:fs";
import { course } from "../src/course.js";

const readyLectures = new Map(course.lectures.filter(x => x.status === "ready").map(x => [x.id, x]));
const coveragePath = new URL("../data/ppt-page-coverage.json", import.meta.url);
const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf8"));
for (const row of coverage) {
  const lecture = readyLectures.get(row.sourceId);
  if (!lecture) continue;
  row.publishedLessonIds = lecture.lessons
    .filter(lesson => lesson.sourceRefs.some(ref => ref.pdfPages.includes(row.pdfPage)))
    .map(lesson => lesson.id);
  row.status = row.publishedLessonIds.length ? "ready" : "mapped_not_authored";
}
fs.writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 2)}\n`);

const blueprintPath = new URL("../data/curriculum-blueprint.json", import.meta.url);
const blueprint = JSON.parse(fs.readFileSync(blueprintPath, "utf8"));
for (const lecture of blueprint.lectures) {
  const ready = readyLectures.get(lecture.lectureId);
  if (!ready) continue;
  for (const section of lecture.sections) {
    section.lessonIds = ready.lessons.filter(x => x.sectionId === section.sectionId).map(x => x.id);
    section.contentStatus = section.lessonIds.length ? "ready" : "planned";
  }
}
fs.writeFileSync(blueprintPath, `${JSON.stringify(blueprint, null, 2)}\n`);

const exercisePath = new URL("../data/exercise-index.json", import.meta.url);
const index = JSON.parse(fs.readFileSync(exercisePath, "utf8"));
const readyExercises = new Map(course.exercises.map(x => [x.id, x]));
for (const exercise of index.exercises) {
  if (!readyExercises.has(exercise.exerciseId)) continue;
  exercise.statementTranscribed = true;
  exercise.solutionStatus = "teaching_solution_authored";
  exercise.reviewStatus = "source_page_checked_and_teaching_solution_reviewed";
}
fs.writeFileSync(exercisePath, `${JSON.stringify(index, null, 2)}\n`);

console.log(`Synced ready coverage for ${[...readyLectures.keys()].join(", ")}.`);
