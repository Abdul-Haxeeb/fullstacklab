
const apiData = {
    '/users': [
        { id: 1, name: 'Ali', department: 'CS' },
        { id: 2, name: 'Sara', department: 'CS' },
        { id: 3, name: 'Usman', department: 'SE' },
        { id: 4, name: 'Hina', department: 'AI' }
    ],
    '/courses': [
        { id: 1, code: 'CS301' },
        { id: 2, code: 'CS302' },
        { id: 3, code: 'CS401' }
    ],
    '/results': [
        { studentId: 1, name: 'Ali', department: 'CS', marks: 82 },
        { studentId: 2, name: 'Sara', department: 'CS', marks: 91 },
        { studentId: 3, name: 'Usman', department: 'SE', marks: 47 },
        { studentId: 4, name: 'Hina', department: 'AI', marks: 73 }
    ]
};

function fakeFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        const signal = options.signal;

        if (signal?.aborted) {
            const error = new Error('Request aborted');
            error.name = 'AbortError';
            reject(error);
            return;
        }

        let delay = url === '/slow' ? 500 : 100;

        const timer = setTimeout(() => {
            if (url === '/network-error') {
                reject(new TypeError('Network connection failed'));
                return;
            }

            let status = 200;
            let body = apiData[url];

            if (url === '/404') {
                status = 404;
                body = { message: 'Resource not found' };
            } else if (url === '/500') {
                status = 500;
                body = { message: 'Server error' };
            } else if (url === '/invalid-json') {
                body = null;
            } else if (body === undefined && url !== '/invalid-json') {
                status = 404;
                body = { message: 'Resource not found' };
            }

            resolve({
                ok: status >= 200 && status < 300,
                status,
                async json() {
                    if (url === '/invalid-json') {
                        throw new SyntaxError('Invalid JSON response');
                    }

                    return body;
                }
            });
        }, delay);

        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timer);

                const error = new Error('Request aborted');
                error.name = 'AbortError';
                reject(error);
            }, { once: true });
        }
    });
}

async function getJSON(url, fetchImplementation) {
    const response = await fetchImplementation(url);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}

function generateDashboard(users, courses, results) {
    const validResults = results.filter(result =>
        Number.isFinite(result.marks) &&
        result.marks >= 0 &&
        result.marks <= 100
    );

    const averageMarks = validResults.length > 0
        ? Number((
            validResults.reduce((sum, result) => sum + result.marks, 0) /
            validResults.length
        ).toFixed(2))
        : null;

    const highestStudent = validResults.length > 0
        ? [...validResults].sort((a, b) => b.marks - a.marks)[0]
        : null;

    const departmentStats = validResults.reduce((stats, result) => {
        const department = result.department;

        if (!stats[department]) {
            stats[department] = {
                students: 0,
                totalMarks: 0,
                average: 0,
                passed: 0
            };
        }

        stats[department].students++;
        stats[department].totalMarks += result.marks;

        if (result.marks >= 50) {
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

    return {
        totalStudents: users.length,
        totalCourses: courses.length,
        overallAverageMarks: averageMarks,
        highestPerformingStudent: highestStudent,
        failedStudents: validResults.filter(result => result.marks < 50).length,
        departmentStats
    };
}

async function loadDashboard(fetchImplementation) {
    const [users, courses, results] = await Promise.all([
        getJSON('/users', fetchImplementation),
        getJSON('/courses', fetchImplementation),
        getJSON('/results', fetchImplementation)
    ]);

    return generateDashboard(users, courses, results);
}

async function fetchWithTimeout(url, milliseconds, fetchImplementation = fakeFetch) {
    const controller = new AbortController();

    const timer = setTimeout(() => {
        controller.abort();
    }, milliseconds);

    try {
        const response = await fetchImplementation(url, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error(`Request timed out after ${milliseconds} ms`);
        }

        throw error;
    } finally {
        clearTimeout(timer);
    }
}

async function runTests() {
    try {
        const dashboard = await loadDashboard(fakeFetch);

        console.log('DASHBOARD');
        console.log(JSON.stringify(dashboard, null, 2));
    } catch (error) {
        console.log('Dashboard error:', error.message);
    }

    const testURLs = [
        '/404',
        '/500',
        '/network-error',
        '/invalid-json'
    ];

    for (const url of testURLs) {
        try {
            await getJSON(url, fakeFetch);
            console.log(`${url}: Success`);
        } catch (error) {
            console.log(`${url}: ${error.name}: ${error.message}`);
        }
    }

    try {
        const result = await fetchWithTimeout('/slow', 50);
        console.log('Slow request:', result);
    } catch (error) {
        console.log('Timeout test:', error.message);
    }

    try {
        const result = await fetchWithTimeout('/users', 1000);
        console.log('Successful timed request:', result.length, 'users');
    } catch (error) {
        console.log('Timed request error:', error.message);
    }
}

runTests();
