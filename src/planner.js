export function buildDailyPlan({ lessons, mainLessonId, completedIds, dueReviewCount, totalMinutes = 60, reviewCapMinutes = 10 }) {
  const completed = new Set(completedIds || []);
  const reviewMinutes = Math.min(reviewCapMinutes, Math.max(0, dueReviewCount) * 2);
  const learningBudget = Math.max(0, totalMinutes - reviewMinutes);
  const start = Math.max(0, lessons.findIndex(lesson => lesson.id === mainLessonId));
  const plannedLessons = [];
  let learningMinutes = 0;
  let practiceMinutes = 0;

  for (let index = start; index < lessons.length; index += 1) {
    const lesson = lessons[index];
    if (completed.has(lesson.id)) continue;
    const duration = Number(lesson.minutes) || 0;
    if (plannedLessons.length > 0 && learningMinutes + duration > learningBudget) break;
    const lessonPracticeMinutes = Math.max(0, Number(lesson.practiceMinutes) || 0);
    plannedLessons.push({ id: lesson.id, title: lesson.title, minutes: duration, lectureId: lesson.lectureId, practiceMinutes: lessonPracticeMinutes });
    learningMinutes += duration;
    practiceMinutes += lessonPracticeMinutes;
    if (learningMinutes >= learningBudget) break;
  }

  return {
    totalMinutes,
    reviewCount: Math.max(0, dueReviewCount),
    reviewMinutes,
    learningBudget,
    learningMinutes,
    practiceMinutes,
    plannedLessons,
    courseComplete: plannedLessons.length === 0 && completed.size >= lessons.length
  };
}
