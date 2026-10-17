
export function calculateGrade(marks) {
    if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
        throw new RangeError('Marks must be between 0 and 100');
    }

    if (marks >= 85) return 'A';
    if (marks >= 80) return 'A';
    if (marks >= 75) return 'B+';
    if (marks >= 70) return 'B';
    if (marks >= 65) return 'B';
    if (marks >= 60) return 'C+';
    if (marks >= 50) return 'C';

    return 'F';
}

export function calculateAverage(marks) {
    if (!Array.isArray(marks) || marks.length === 0) {
        throw new TypeError('Marks must be a non-empty array');
    }

    if (!marks.every(mark => Number.isFinite(mark) && mark >= 0 && mark <= 100)) {
        throw new RangeError('Every mark must be between 0 and 100');
    }

    return Number((marks.reduce((sum, mark) => sum + mark, 0) / marks.length).toFixed(2));
}

export function calculateGPA(marks) {
    if (!Array.isArray(marks) || marks.length === 0) {
        throw new TypeError('Marks must be a non-empty array');
    }

    const points = marks.map(mark => {
        calculateGrade(mark);

        if (mark >= 85) return 4.0;
        if (mark >= 80) return 4.0;
        if (mark >= 75) return 3.5;
        if (mark >= 70) return 3.0;
        if (mark >= 65) return 3.0;
        if (mark >= 60) return 2.5;
        if (mark >= 50) return 2.0;

        return 0.0;
    });

    return Number((points.reduce((sum, point) => sum + point, 0) / points.length).toFixed(2));
}
