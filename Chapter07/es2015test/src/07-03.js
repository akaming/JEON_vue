function addContct(name, mobile, home="없음", address="없음", email="없음") {
	var str = `name=${name}, mobile=${mobile}, home=${home}, address=${address}, email=${email}`;
	console.log(str);
}
addContct("홍길동", "010-222-3331");
addContct("홍길동", "010-222-3331", "02-3433-9990", "서울");