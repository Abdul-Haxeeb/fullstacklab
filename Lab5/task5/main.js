
import Student from './Student.js';
import { processTranscript as buildTranscript } from './transcriptService.js';

const rawData = `
[
    {
        "id": 101,
        "name": "Ali",
        "courses": [
            { "code": "CS301", "marks": 81 },
            { "code": "CS302", "marks": 74 }
        ]
    },
    {
        "id": 102,
        "name": "Sara",
        "courses": [
            { "code": "CS301", "marks": 91 },
            { "code": "CS302", "marks": 88 }
        ]
    }
]
`;

try {
    const result = buildTranscript(rawData);

    console.log('TRANSCRIPT REPORT');
    console.log(result.json);

    console.log(
        'First record is a Student instance:',
        result.report.students[0] instanceof Student
    );
} catch (error) {
    console.log(`${error.name}: ${error.message}`);
} finally {
    console.log('Transcript processing finished');
}

const invalidData = `
[
    {
        "id": 101,
        "name": "Ali",
        "courses": [
            { "code": "CS301", "marks": 105 }
        ]
    }
]
`;

try {
    buildTranscript(invalidData);
} catch (error) {
    console.log(`Invalid transcript test: ${error.name}: ${error.message}`);
} finally {
    console.log('Invalid transcript test finished');
}
