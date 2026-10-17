
function getStudent(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id !== 101) {
                reject(new Error('Student not found'));
            } else {
                resolve({ id, name: 'Ali', completedCourses: ['CS301'] });
            }
        }, 200);
    });
}

function getCourse(code) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!code) {
                reject(new Error('Course not found'));
            } else {
                resolve({ code, seats: 5, prerequisite: 'CS301' });
            }
        }, 200);
    });
}

function checkPrerequisites(data) {
    return new Promise((resolve, reject) => {
        if (!data.student.completedCourses.includes(data.course.prerequisite)) {
            reject(new Error('Prerequisite not completed'));
        } else {
            resolve(data);
        }
    });
}

function checkSeats(data) {
    return new Promise((resolve, reject) => {
        if (data.course.seats <= 0) {
            reject(new Error('Course is full'));
        } else {
            resolve(data);
        }
    });
}

function registerStudent(data) {
    return Promise.resolve({
        studentId: data.student.id,
        course: data.course.code,
        status: 'REGISTERED'
    });
}

function sendEmail() {
    return Promise.resolve('Email sent');
}

function sendSMS() {
    return Promise.reject(new Error('SMS service unavailable'));
}

function writeAuditLog() {
    return Promise.resolve('Audit log written');
}

function getCourseFromServer(server, delay, shouldFail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error(`${server} failed`));
            } else {
                resolve({ server, course: 'CS401' });
            }
        }, delay);
    });
}

getStudent(101)
    .then(student => {
        console.log('Student loaded:', student.name);
        return getCourse('CS401').then(course => ({ student, course }));
    })
    .then(checkPrerequisites)
    .then(checkSeats)
    .then(registerStudent)
    .then(confirmation => {
        console.log('Registration successful:', confirmation);

        return Promise.allSettled([
            sendEmail(),
            sendSMS(),
            writeAuditLog()
        ]).then(results => ({ confirmation, results }));
    })
    .then(({ confirmation, results }) => {
        const services = ['Email', 'SMS', 'Audit'];

        const report = results.map((result, index) => ({
            service: services[index],
            status: result.status
        }));

        console.log('Post-registration report:', report);
        console.log('Final confirmation:', confirmation);
    })
    .catch(error => {
        console.log('Registration failed:', error.message);
    })
    .finally(() => {
        console.log('Registration process finished');
    });

Promise.any([
    getCourseFromServer('Server A', 300, true),
    getCourseFromServer('Server B', 500, false)
])
    .then(result => console.log('First successful server:', result))
    .catch(error => console.log('All servers failed:', error.errors));
