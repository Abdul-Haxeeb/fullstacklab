
import Student from './Student.js';
import { calculateAverage, calculateGPA as getGPA, calculateGrade } from './gradeUtils.js';

export function processTranscript(rawData) {
    let data;

    try {
        data = JSON.parse(rawData);
    } catch {
        throw new SyntaxError('Transcript contains malformed JSON');
    }

    if (!Array.isArray(data)) {
        throw new TypeError('Transcript must contain an array of students');
    }

    const ids = new Set();

    const students = data.map(record => {
        if (!record || typeof record !== 'object' || Array.isArray(record)) {
            throw new TypeError('Invalid student record');
        }

        if (record.id === undefined || record.id === null || record.id === '') {
            throw new TypeError('Student ID is required');
        }

        if (ids.has(record.id)) {
            throw new Error(`Duplicate student ID: ${record.id}`);
        }

        ids.add(record.id);

        if (typeof record.name !== 'string' || record.name.trim() === '') {
            throw new TypeError('Student name is required');
        }

        if (!Array.isArray(record.courses) || record.courses.length === 0) {
            throw new TypeError('Each student must have at least one course');
        }

        const courses = record.courses.map(course => {
            if (!course || typeof course.code !== 'string' || course.code.trim() === '') {
                throw new TypeError('Course code is required');
            }

            if (typeof course.marks !== 'number' ||
                !Number.isFinite(course.marks)) {
                throw new TypeError('Course marks must be a valid number');
            }

            if (course.marks < 0 || course.marks > 100) {
                throw new RangeError('Course marks must be between 0 and 100');
            }

            return {
                code: course.code,
                marks: course.marks,
                grade: calculateGrade(course.marks)
            };
        });

        const marks = courses.map(course => course.marks);
        const average = calculateAverage(marks);
        const gpa = getGPA(marks);

        return new Student(record.id, record.name, courses, average, gpa);
    });

    const report = {
        totalStudents: students.length,
        students
    };

    return {
        report,
        json: JSON.stringify(report, null, 2)
    };
}
