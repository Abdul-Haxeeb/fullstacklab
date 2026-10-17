
function loadStudent(studentId, callback) {
    setTimeout(() => {
        if (studentId !== 101) {
            return callback(new Error('Student does not exist'));
        }

        callback(null, {
            id: studentId,
            name: 'Ali',
            completedCourses: ['CS301']
        });
    }, 300);
}

function checkPrerequisites(student, course, callback) {
    setTimeout(() => {
        if (!student.completedCourses.includes('CS301')) {
            return callback(new Error('Prerequisite not completed'));
        }

        callback(null, { student, course });
    }, 300);
}

function checkSeats(data, callback) {
    setTimeout(() => {
        if (data.course === 'FULL') {
            return callback(new Error('Course is full'));
        }

        callback(null, data);
    }, 300);
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
    }, 300);
}

function registerStudent(studentId, course) {
    loadStudent(studentId, (error, student) => {
        if (error) {
            return console.log(error.message);
        }

        checkPrerequisites(student, course, (error, data) => {
            if (error) {
                return console.log(error.message);
            }

            checkSeats(data, (error, availableData) => {
                if (error) {
                    return console.log(error.message);
                }

                registerCourse(availableData, (error, confirmation) => {
                    if (error) {
                        return console.log(error.message);
                    }

                    console.log('Registration successful');
                    console.log(confirmation);
                });
            });
        });
    });
}

registerStudent(101, 'CS401');
