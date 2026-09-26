import { lecture1, lecture1Exercises } from "./course-l01.js";
import { lecture2, lecture2Exercises } from "./course-l02.js";
import { lecture3, lecture3Exercises } from "./course-l03.js";
import { lecture4, lecture4Exercises } from "./course-l04.js";
import { lecture5, lecture5Exercises } from "./course-l05.js";

const plannedLectures = [];

export const course = {
  courseId: "advanced-microeconomics-2026",
  contentVersion: "2026.09.26-full-r7",
  title: "高级微观经济学",
  assignedExerciseIds: null,
  lectures: [
    { ...lecture1, lessons: lecture1.lessons.map(lesson => ({ ...lesson, lectureId: "L01" })) },
    { ...lecture2, lessons: lecture2.lessons.map(lesson => ({ ...lesson, lectureId: "L02" })) },
    { ...lecture3, lessons: lecture3.lessons.map(lesson => ({ ...lesson, lectureId: "L03" })) },
    { ...lecture4, lessons: lecture4.lessons.map(lesson => ({ ...lesson, lectureId: "L04" })) },
    { ...lecture5, lessons: lecture5.lessons.map(lesson => ({ ...lesson, lectureId: "L05" })) },
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
