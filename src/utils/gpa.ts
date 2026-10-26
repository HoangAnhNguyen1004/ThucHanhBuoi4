export function toScale4(score10) {
    const score = Number(score10);

    if (!Number.isFinite(score) || score < 0 || score > 10) {
        return 0;
    }

    if (score >= 8.5) return 4;
    if (score >= 8) return 3.5;
    if (score >= 7) return 3;
    if (score >= 6.5) return 2.5;
    if (score >= 5.5) return 2;
    if (score >= 5) return 1.5;
    if (score >= 4) return 1;

    return 0;
}

export function calcGpa(grades = [], courses = []) {
    let weighted = 0;
    let attemptedCredits = 0;
    let totalCredits = 0;

    grades.forEach(grade => {
        const course =
            courses.find(item => String(item.id) === String(grade.courseId)) ||
            grade.course;

        const credits = Number(course?.credits || 0);
        const score = Number(grade.total);

        if (!credits || !Number.isFinite(score)) {
            return;
        }

        weighted += toScale4(score) * credits;
        attemptedCredits += credits;

        if (score >= 4) {
            totalCredits += credits;
        }
    });

    return {
        gpa: attemptedCredits ? weighted / attemptedCredits : 0,
        totalCredits,
        attemptedCredits,
    };
}