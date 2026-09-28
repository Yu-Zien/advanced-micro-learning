import { lecture1, lecture1Exercises } from "./course-l01.js?v=2026.09.28-prereq-2";
import { lecture2, lecture2Exercises } from "./course-l02.js?v=2026.09.28-prereq-2";
import { lecture3, lecture3Exercises } from "./course-l03.js?v=2026.09.28-prereq-2";
import { lecture4, lecture4Exercises } from "./course-l04.js?v=2026.09.28-prereq-2";
import { lecture5, lecture5Exercises } from "./course-l05.js?v=2026.09.28-prereq-2";
import { prerequisiteBlocks } from "./prerequisite-blocks.js?v=2026.09.28-prereq-2";

const plannedLectures = [];
const enrichLecture = (lecture, lectureId) => ({
  ...lecture,
  lessons: lecture.lessons.map(lesson => ({
    ...lesson,
    lectureId,
    blocks: [...(lesson.blocks || []), ...(prerequisiteBlocks[lesson.id] || [])]
  }))
});

export const course = {
  courseId: "advanced-microeconomics-2026",
  contentVersion: "2026.09.28-prereq-2",
  title: "高级微观经济学",
  assignedExerciseIds: null,
  lectures: [
    enrichLecture(lecture1, "L01"),
    enrichLecture(lecture2, "L02"),
    enrichLecture(lecture3, "L03"),
    enrichLecture(lecture4, "L04"),
    enrichLecture(lecture5, "L05"),
    ...plannedLectures
  ],
  exercises: [...lecture1Exercises, ...lecture2Exercises, ...lecture3Exercises, ...lecture4Exercises, ...lecture5Exercises]
};

export const lessons = course.lectures.flatMap(lecture => lecture.lessons);
export const lessonById = new Map(lessons.map(lesson => [lesson.id, lesson]));
export const exerciseById = new Map(course.exercises.map(exercise => [exercise.id, exercise]));
export const reviewById = new Map(lessons.filter(x => x.review).map(x => [x.review.id, x.review]));

export function nextLessonId(id) {
  const index = lessons.findIndex(lesson => lesson.id === id);
  return index >= 0 && index < lessons.length - 1 ? lessons[index + 1].id : null;
}

export function lessonIndex(id) {
  return lessons.findIndex(lesson => lesson.id === id);
}
