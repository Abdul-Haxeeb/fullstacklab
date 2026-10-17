
const applicants = [
    { id: 'A101', name: 'Sara Khan', age: '19', matricMarks: '91', intermediateMarks: '87', entryTest: '78', program: 'BSCS', feePaid: 'true' },
    { id: 'A102', name: 'Ahmed Ali', age: 'twenty', matricMarks: '88', intermediateMarks: '', entryTest: '72', program: 'BSSE', feePaid: 'false' },
    { id: 'A103', name: 'Hassan', age: '18', matricMarks: '76', intermediateMarks: '83', entryTest: '91', program: 'BSAI', feePaid: 'true' },
    { id: 'A104', name: 'Ayesha', age: '17', matricMarks: '80', intermediateMarks: '75', entryTest: '70', program: 'BSCS', feePaid: 'false' },
    { id: 'A105', name: 'Bilal', age: '31', matricMarks: '85', intermediateMarks: '82', entryTest: '80', program: 'BSIT', feePaid: 'true' },
    { id: 'A106', name: 'Noor', age: '22', matricMarks: '100', intermediateMarks: '100', entryTest: '100', program: 'BSSE', feePaid: 'true' },
    { id: 'A107', name: 'Usman', age: '20', matricMarks: '55', intermediateMarks: '65', entryTest: '45', program: 'BSCS', feePaid: 'true' }
];

const supportedPrograms = ['BSCS', 'BSSE', 'BSAI'];

function processApplicant(applicant) {
    const errors = [];

    if (!applicant || typeof applicant !== 'object' || Array.isArray(applicant)) {
        return {
            id: null,
            name: null,
            merit: null,
            status: 'INVALID DATA',
            errors: ['Invalid applicant record']
        };
    }

    const { id, name, program } = applicant;

    if (typeof id !== 'string' || id.trim() === '') {
        errors.push('Missing ID');
    }

    if (typeof name !== 'string' || name.trim() === '') {
        errors.push('Missing name');
    }

    const fields = {
        age: applicant.age,
        matricMarks: applicant.matricMarks,
        intermediateMarks: applicant.intermediateMarks,
        entryTest: applicant.entryTest
    };

    const numbers = {};

    for (const [field, value] of Object.entries(fields)) {
        if (value === undefined || value === null ||
            (typeof value === 'string' && value.trim() === '')) {
            errors.push(`Missing ${field}`);
        } else if (typeof value !== 'string' && typeof value !== 'number') {
            errors.push(`Invalid ${field}`);
        } else if (!Number.isFinite(Number(value))) {
            errors.push(`Invalid ${field}`);
        } else {
            numbers[field] = Number(value);
        }
    }

    const { age, matricMarks, intermediateMarks, entryTest } = numbers;

    if (age !== undefined && (age < 17 || age > 30)) {
        errors.push('Age must be between 17 and 30');
    }

    for (const field of ['matricMarks', 'intermediateMarks', 'entryTest']) {
        if (numbers[field] !== undefined &&
            (numbers[field] < 0 || numbers[field] > 100)) {
            errors.push(`${field} must be between 0 and 100`);
        }
    }

    if (typeof program !== 'string' || !supportedPrograms.includes(program)) {
        errors.push('Unsupported program');
    }

    let feePaid;

    if (applicant.feePaid === 'true' || applicant.feePaid === true) {
        feePaid = true;
    } else if (applicant.feePaid === 'false' || applicant.feePaid === false) {
        feePaid = false;
    } else {
        errors.push('Invalid or missing fee status');
    }

    if (errors.length > 0) {
        return {
            id: id ?? null,
            name: name ?? null,
            program: program ?? null,
            merit: null,
            status: 'INVALID DATA',
            errors
        };
    }

    const merit = Number((
        matricMarks * 0.20 +
        intermediateMarks * 0.30 +
        entryTest * 0.50
    ).toFixed(2));

    const eligible = merit >= 70 &&
        entryTest >= 60 &&
        intermediateMarks >= 60;

    let status;

    if (!eligible) {
        status = 'REJECTED';
    } else if (merit >= 80 && feePaid) {
        status = 'SELECTED';
    } else {
        status = 'WAITING';
    }

    return {
        id,
        name,
        age,
        matricMarks,
        intermediateMarks,
        entryTest,
        program,
        feePaid,
        merit,
        status,
        errors
    };
}

function generateSummary(processedApplicants) {
    const valid = processedApplicants.filter(
        applicant => applicant.status !== 'INVALID DATA'
    );

    const invalid = processedApplicants.filter(
        applicant => applicant.status === 'INVALID DATA'
    );

    const ranked = [...valid].sort((a, b) => b.merit - a.merit);

    const totalMerit = valid.reduce(
        (sum, applicant) => sum + applicant.merit, 0
    );

    const programCounts = {};

    for (const applicant of processedApplicants) {
        const program = applicant.program || 'Missing/Unknown';
        programCounts[program] = (programCounts[program] || 0) + 1;
    }

    return {
        validApplicants: valid.length,
        invalidApplicants: invalid.length,
        highestMeritApplicant: ranked[0] ?? null,
        lowestMerit: ranked.length > 0 ? ranked[ranked.length - 1].merit : null,
        averageMerit: valid.length > 0
            ? Number((totalMerit / valid.length).toFixed(2))
            : null,
        programCounts
    };
}

const processedApplicants = applicants.map(processApplicant);

console.log('ADMISSION RESULTS');
console.log(JSON.stringify(processedApplicants, null, 2));

console.log('FINAL SUMMARY');
console.log(JSON.stringify(generateSummary(processedApplicants), null, 2));
