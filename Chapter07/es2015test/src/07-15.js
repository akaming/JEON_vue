
class Employee extends Person {
	constructor(name, tel, address, empno, dept) {
		super(name, tel, address);
		this.empno = empno;
		this.dept = dept;
	}
	toString() {
		return super.toString() + `, empno=${this.name}, dept=${this.dept}`;
	}
	getEmpInfo() {
		return `${this.empno} : ${this.name}은 ${this.dept} 부서입니다.`;
	}
}

let e1 = new Employee("이몽룡", "010-222-2121", "서울시", "A12311", "회계팀");
console.log(e1.getEmpInfo());
console.log(e1.toString());
console.log(Person.getPersonCount());