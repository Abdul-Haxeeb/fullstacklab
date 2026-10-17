
const student = {
    id: 101,
    name: 'Ali',
    marks: 0,
    scholarship: false,
    address: {
        city: 'Islamabad',
        sector: 'F-10'
    },
    contact: {
        email: 'ali@university.edu'
    }
};

const update = {
    name: 'Ali Khan',
    address: {
        city: 'Rawalpindi'
    },
    contact: {
        phone: '03001234567'
    }
};

function updateProfile(student, update, ...extraFields) {
    const { id, name: oldName, marks = 0, scholarship = false } = student;
    const { city: oldCity, sector } = student.address;
    const { email } = student.contact;
    const { name = oldName, address = {}, contact = {}, ...otherUpdates } = update;

    const {
        city = oldCity,
        sector: newSector = sector
    } = address;

    const {
        email: newEmail = email,
        ...otherContact
    } = contact;

    const updatedStudent = {
        ...student,
        ...otherUpdates,
        ...Object.fromEntries(extraFields),
        id,
        name,
        marks: update.marks ?? marks,
        scholarship: update.scholarship ?? scholarship,
        address: {
            ...student.address,
            ...address,
            city,
            sector: newSector
        },
        contact: {
            ...student.contact,
            ...otherContact,
            email: newEmail
        }
    };

    return updatedStudent;
}

const updatedStudent = updateProfile(student, update);

const { address: { city: updatedCity }, contact: { phone } } = updatedStudent;

const optionalPhone = updatedStudent.contact?.phone ?? 'Not provided';
const scholarshipValue = updatedStudent.scholarship ?? false;

const [firstCourse = 'No course selected', secondCourse = 'No second course'] =
    ['FSWD'];

console.log('Original student:', student);
console.log('Updated student:', updatedStudent);
console.log('Updated city:', updatedCity);
console.log('Phone:', phone);
console.log('Optional phone:', optionalPhone);
console.log('Scholarship:', scholarshipValue);
console.log('Courses:', firstCourse, secondCourse);
console.log('Original object differs:', student !== updatedStudent);
console.log('Address differs:', student.address !== updatedStudent.address);
console.log('Contact differs:', student.contact !== updatedStudent.contact);
console.log('Original city unchanged:', student.address.city);
console.log('Original email unchanged:', student.contact.email);
