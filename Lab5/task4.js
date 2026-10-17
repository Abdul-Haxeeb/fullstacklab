
class Person {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    introduce() {
        return `My name is ${this.name} and my email is ${this.email}.`;
    }
}

class Student extends Person {
    constructor(name, email, rollNo, marks) {
        super(name, email);
        this.rollNo = rollNo;
        this.marks = marks;
    }

    introduce() {
        return `${super.introduce()} My roll number is ${this.rollNo}.`;
    }

    getResult() {
        return this.marks >= 50 ? 'PASS' : 'FAIL';
    }
}

class FacultyMember extends Person {
    constructor(name, email, employeeId, department) {
        super(name, email);
        this.employeeId = employeeId;
        this.department = department;
    }

    introduce() {
        return `${super.introduce()} I work in ${this.department}.`;
    }
}

const student1 = new Student('Ali', 'ali@au.edu.pk', 101, 82);
const student2 = new Student('Sara', 'sara@au.edu.pk', 102, 45);
const faculty1 = new FacultyMember('Dr. Ahmed', 'ahmed@au.edu.pk', 501, 'CS');
const faculty2 = new FacultyMember('Dr. Hina', 'hina@au.edu.pk', 502, 'AI');

const users = [student1, student2, faculty1, faculty2];

users.forEach(user => console.log(user.introduce()));

console.log('Student result:', student1.getResult());
console.log('Student result:', student2.getResult());

console.log('Student instance:', student1 instanceof Student);
console.log('Person instance:', student1 instanceof Person);
console.log('Faculty instance:', faculty1 instanceof FacultyMember);

const guest = {
    name: 'Dr. Ahmed',
    email: 'ahmed@example.com'
};

console.log('Call:', Person.prototype.introduce.call(guest));

const fn = student1.introduce;

try {
    console.log('Detached method:', fn());
} catch (error) {
    console.log('Detached method error:', error.name);
}

const boundFn = student1.introduce.bind(student1);
console.log('Bound method:', boundFn());
