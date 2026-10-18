function loadStudent(studentId, callback) {
    setTimeout(() => {
        if (studentId !== 101 && studentId !== 102) {
            return callback(new Error('Student does not exist'));
        }

        const student = {
            id: studentId,
            name: studentId === 101 ? 'Ali' : 'Sara',
            completedCourses: studentId === 101 ? ['CS301'] : []
        };

        callback(null, student);
    }, 100);
}

function checkPrerequisites(student, course, callback) {
    setTimeout(() => {
        if (!student.completedCourses.includes('CS301')) {
            return callback(new Error('Prerequisite not completed'));
        }

        callback(null, { student, course });
    }, 100);
}

function checkSeats(data, callback) {
    setTimeout(() => {
        if (data.course === 'FULL') {
            return callback(new Error('Course is full'));
        }

        callback(null, data);
    }, 100);
}

function registerCourse(data, callback) {
    setTimeout(() => {
        if (data.student.id === 101 && data.course === 'CS301') {
            return callback(new Error('Student already registered'));
        }

        callback(null, {
            studentId: data.student.id,
            course: data.course,
            status: 'REGISTERED'
        });
    }, 100);
}

function registerStudent(studentId, course, testName) {
    loadStudent(studentId, (error, student) => {
        if (error) return console.log(`${testName}: ${error.message}`);

        checkPrerequisites(student, course, (error, data) => {
            if (error) return console.log(`${testName}: ${error.message}`);

            checkSeats(data, (error, availableData) => {
                if (error) return console.log(`${testName}: ${error.message}`);

                registerCourse(availableData, (error, confirmation) => {
                    if (error) return console.log(`${testName}: ${error.message}`);

                    console.log(`${testName}: Registration successful`);
                    console.log(confirmation);
                });
            });
        });
    });
}

registerStudent(101, 'CS401', 'Successful registration');
registerStudent(999, 'CS401', 'Missing student');
registerStudent(102, 'CS401', 'Missing prerequisite');
registerStudent(101, 'FULL', 'Full course');
registerStudent(101, 'CS301', 'Duplicate registration');
