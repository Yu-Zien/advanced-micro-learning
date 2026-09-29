import { lecture1, lecture1Exercises } from "./course-l01.js?v=2026.09.29-exercise-expansion-1";
import { lecture2, lecture2Exercises } from "./course-l02.js?v=2026.09.29-exercise-expansion-1";
import { lecture3, lecture3Exercises } from "./course-l03.js?v=2026.09.29-exercise-expansion-1";
import { lecture4, lecture4Exercises } from "./course-l04.js?v=2026.09.29-exercise-expansion-1";
import { lecture5, lecture5Exercises } from "./course-l05.js?v=2026.09.29-exercise-expansion-1";
import { prerequisiteBlocks } from "./prerequisite-blocks.js?v=2026.09.29-exercise-expansion-1";
import { exerciseBlocksByLesson, expandedTextbookExercises, expandedExerciseIdsByLesson } from "./exercise-expansion.js?v=2026.09.29-exercise-expansion-1";

const plannedLectures = [];
const expandedExerciseById = new Map(expandedTextbookExercises.map(exercise => [exercise.id, exercise]));
const enrichLecture = (lecture, lectureId) => ({
  ...lecture,
  lessons: lecture.lessons.map(lesson => {
    const existingBlocks = [...(lesson.blocks || []), ...(prerequisiteBlocks[lesson.id] || [])];
    const addedBlocks = exerciseBlocksByLesson[lesson.id] || [];
    const addedExerciseIds = expandedExerciseIdsByLesson[lesson.id] || [];
    const baselinePracticeMinutes = (lesson.practice ? 3 : 0)
      + existingBlocks.filter(block => block.type === "practice" && !block.optional).reduce((sum, block) => sum + (block.estimatedMinutes || 3), 0)
      + (lesson.exerciseIds || []).length * 7;
    const requiredBlockMinutes = addedBlocks.filter(block => !block.optional).reduce((sum, block) => sum + (block.estimatedMinutes || 0), 0);
    const requiredTextbookMinutes = addedExerciseIds.map(id => expandedExerciseById.get(id)).filter(exercise => exercise && !exercise.optional).reduce((sum, exercise) => sum + (exercise.estimatedMinutes || 0), 0);
    const totalMinutes = lesson.minutes + requiredBlockMinutes + requiredTextbookMinutes;
    return {
      ...lesson,
      lectureId,
      minutes: totalMinutes,
      practiceMinutes: Math.min(totalMinutes, baselinePracticeMinutes + requiredBlockMinutes + requiredTextbookMinutes),
      blocks: [...existingBlocks, ...addedBlocks],
      exerciseIds: [...(lesson.exerciseIds || []), ...addedExerciseIds]
    };
  })
});

export const course = {
  courseId: "advanced-microeconomics-2026",
  contentVersion: "2026.09.29-exercise-expansion-1",
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
  exercises: [...lecture1Exercises, ...lecture2Exercises, ...lecture3Exercises, ...lecture4Exercises, ...lecture5Exercises, ...expandedTextbookExercises]
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
