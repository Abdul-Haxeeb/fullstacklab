
const results = [
    { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 82 },
    { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 91 },
    { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
    { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73 },
    { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
    { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 }
];

function getGrade(marks) {
    if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
        return { grade: 'Invalid', gradePoints: 0, status: 'INVALID' };
    }

    if (marks >= 85) return { grade: 'A', gradePoints: 4.0, status: 'PASS' };
    if (marks >= 80) return { grade: 'A', gradePoints: 4.0, status: 'PASS' };
    if (marks >= 75) return { grade: 'B+', gradePoints: 3.5, status: 'PASS' };
    if (marks >= 70) return { grade: 'B', gradePoints: 3.0, status: 'PASS' };
    if (marks >= 65) return { grade: 'B', gradePoints: 3.0, status: 'PASS' };
    if (marks >= 60) return { grade: 'C+', gradePoints: 2.5, status: 'PASS' };
    if (marks >= 50) return { grade: 'C', gradePoints: 2.0, status: 'PASS' };

    return { grade: 'F', gradePoints: 0, status: 'FAIL' };
}

const processedResults = results.map(student => ({
    ...student,
    ...getGrade(student.marks)
}));

const rankedResults = [...processedResults].sort((a, b) =>
    b.marks - a.marks || a.name.localeCompare(b.name)
);

const departmentStats = processedResults.reduce((stats, student) => {
    const department = student.department;

    if (!stats[department]) {
        stats[department] = {
            students: 0,
            totalMarks: 0,
            average: 0,
            highest: 0,
            passed: 0
        };
    }

    stats[department].students++;
    stats[department].totalMarks += student.marks;
    stats[department].highest = Math.max(
        stats[department].highest,
        student.marks
    );

    if (student.status === 'PASS') {
        stats[department].passed++;
    }

    return stats;
}, {});

Object.values(departmentStats).forEach(department => {
    department.average = Number(
        (department.totalMarks / department.students).toFixed(2)
    );
    delete department.totalMarks;
});

const firstAbove85 = processedResults.find(student => student.marks > 85);

const firstFailedIndex = processedResults.findIndex(
    student => student.status === 'FAIL'
);

const anyFailed = processedResults.some(
    student => student.status === 'FAIL'
);

const allMarksValid = processedResults.every(
    student => Number.isFinite(student.marks) &&
        student.marks >= 0 && student.marks <= 100
);

const totalMarks = processedResults.reduce(
    (sum, student) => sum + student.marks, 0
);

const overallAverage = totalMarks / processedResults.length;

const aboveAverage = processedResults.filter(
    student => student.marks > overallAverage
);

const topThree = rankedResults.slice(0, 3);

console.log('PROCESSED RESULTS');
console.log(JSON.stringify(processedResults, null, 2));

console.log('RANKED MERIT LIST');
console.log(JSON.stringify(rankedResults, null, 2));

console.log('DEPARTMENT STATISTICS');
console.log(JSON.stringify(departmentStats, null, 2));

console.log('ACADEMIC QUERIES');
console.log('First student above 85:', firstAbove85);
console.log('Index of first failed student:', firstFailedIndex);
console.log('Any student failed:', anyFailed);
console.log('All marks valid:', allMarksValid);
console.log('Overall average:', Number(overallAverage.toFixed(2)));
console.log('Students above average:', aboveAverage.map(student => student.name));
console.log('Top three students:', topThree.map(student => student.name));
console.log('Original results unchanged:', results[0].grade === undefined);
