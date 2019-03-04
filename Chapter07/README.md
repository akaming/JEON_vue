# 07. ECMAScript 2015
* Vue.js 기반의 SPA(Single Page Application) 애플리케이션을 개발하려면 Vue Router, Vuex등의 다양한 요소가 필요합니다.
* 이들을 이용하기 위해서는 ECMAScript 2015(이하 ES2015라고 표기합니다.)나, Typescript등을 사용해야 합니다.
* 최신 브라우저에서만 지원하므로 트랜스파일러(Transpiler)라는 것을 이용해 하위 버전의 자바스크립트로 번역합니다.
* 대표적인 트랜스파일러는 Babel, TSC(typeScript Compiler)이며, Vue CLI는 두 가지 트랜스파일러를 모두 제공합니다.
* 이 책에서는 ES2015 코드를 작성하고 Babel로 트랜스파일하여 실행해 볼 것입니다.

## 7.1 ES2015를 사용하기 위한 프로젝트 설정
1. 프로젝트 디렉터리 생성 : 임의의 폴더(es2015test) 생성
2. package.json파일 생성 : 프로젝트 디렉터리로 이동 후 npm init (기본값으로 설정)
    ![package.json파일 생성](./img/7_01.png)
3. Babel 관련 라이브러리는 자주 사용되기 때문에 전역에 설치 ([yarn](https://www.holaxprogramming.com/2017/12/21/node-yarn-tutorials/) 설치 권장)
    + npm install -g babel-cli yarn (windows)
    + sudo npm install -g babel-cli yarn (macOS)
4. Babel 트랜스파일러는 개발 의존성 패키지로 설치합니다.
    + yarn add -D babel-cli babel=preset-env babel-preset-stage-2
    + npm install --save-dev babel-cli babel=preset-env babel-preset-stage-2
    ![babel관련 라이브러리 설치](./img/7_02.png)
5. .babelrc 파일 작성(Babel 사용시 필수)
```
    {
        "presets":["env","stage-2"]
    }
```
6. [예제 07-01](es2015test/src/07-01.js)를 통해 트랜스파일된 코드 확인
	+ VSCode : build 디렉터리에 동일한 파일명으로 출력 (node build/07-01.js 실행)
	+ babel 명령어로 코드를 변환 : babel src -d build -w
	+ Babel 사이트에서 직접 변환 : <https://babeljs.io/repl/>에 접속해서 코드를 직접 확인 할 수도 있습니다.
	![babel 트랜스파일](./img/7_03.png)

## 7.2 let과 const 
[Jeonjeongho/JEON206](https://github.com/Jeonjeongho/JEON206/blob/master/Chapter3/index.md#%EB%B3%80%EC%88%98%EC%99%80-%EC%83%81%EC%88%98)의 **변수와 상수** 참고해주세요.
* let과 const는 변수선언 키워드 입니다.
* ES2015 이전까지는 var 키워드를 사용하였는데 호이스팅이 되고, 중복 선언해도 오류가 발생하지 않았습니다.
* 이러한 문제를 해결하기 위해 let드 키워를 지원합니다. (블록 단위의 스코프, 중복 선언 방지)
* const는 상수 기능을 제공합니다. 즉 한번 값이 주어지면 다시 변경할 수 없습니다.
    + var 키워드는 중복 선언해도 오류가 발생하지 않습니다.
    ```
    var a = 100;
    var a = "hello";
    var a = {name:"sangmi", age: 20};
    ```
    + let을 사용하면 오류 발생
    ```
    let a = 100;
    var a = "hello";
    var a = {name:"sangmi", age: 20};
    ```
    ![let 키워드](./img/7_04.png)

## 7.3 기본 파라미터와 가변 파라미터
* 기본 파라미터(Default Parameter)를 이용해 함수 파라미터의 기본값을 지정할 수 있습니다.[예제 07-03](es2015test/src/07-03.js)
* 가변 파라미터(Rest Parameter)는 여러 개의 파라미터 값을 배열로 받을 수 있습니다.[예제 07-04](es2015test/src/07-04.js)
    + 가변 파라미터는 파라미터 앞에 ...으로 시작하고 배열 형태로 반환 됩니다. 

## 7.4 구조분해 할당(destructuring  assignment)
* 배열, 객체의 값들을 추출하여 여러 변수에 할당할 수 있는 기능을 제공합니다. [예제 07-05](es2015test/src/07-05.js)
* 구조분해 할당은 함수 파라미터에서도 사용할 수 있습니다. [예제 07-06](es2015test/src/07-06.js)

## 7.5 화살표 함수(Arrow function)
* ES2015의 화살표 함수는 기존 함수 표현식에 비해 간결함을 제공합니다.
* 아래 3개의 함수는 모두 동일한 기능을 수행합니다.
```
var test1 = {
    return a+b;
}
let tet2 = (a,b) => {
    return a+b;
};
let test3 = (a,b) => a+b;

console.log(test1(3,4));
console.log(test2(3,4));
console.log(test3(3,4));
```
* 주의해야 할 점은 화살표 함수와 전통적인 함수는 서로 다른 this값이 바인딩된다는 점입니다. 
    + [예제 07-07](es2015test/src/07-07.js)
    + [예제 07-08](es2015test/src/07-08.js)

## 7.6 새로운 객체 리터럴
* 객체의 속성 표기법이 개선되었습니다.
* 객체의 속성을 작성할 때 변수명과 동일하다면 생략할 수 있습니다. [예제 07-09](es2015test/src/07-09.js)
```
var obj = {name:name, age:age, email:email};
-- or --
var obj = {name, age, email}
```
* 새로운 메서드 표기법도 제공합니다. [예제 07-10](es2015test/src/07-10.js)
    + 5행의 order메서드와 11행의 discount메서드 작성법 비교

## 7.7 템플릿 리터럴
* 템플릿 리터럴(Template Literal)은 역따옴표(Backquote:\`)로 묶여진 문자열에서 템플릿대입문(${})을 이용해 동적으로 문자열을 끼워넣어 구성할 수 있는 방법을 제공합니다.
* 템플릿 대입문에는 수식 구문, 변수 함수 호출 구문 등 대부분의 표현식을 사용할 수 있습니다.
* 템플릿 문자열은 개행 문자를 포함하여 여러 줄로 작성할 수 있습니다.
* [예제 07-11](es2015test/src/07-11.js)

## 7.8 컬렉션
* 자바스크립트의 배열도 List 형태의 컬렉션이기는 하지만 사용하기에 불편함이 있었습니다.
* ES2015에서는 Set, Map, WeakSet, WeakMap과 같은 집합, 맵을 제공하여 이런 불편함을 해소할 수 있습니다.
* Set은 중복을 허용하지 않습니다. 합집합(Union), 교집합(Inersesct)과 같은 다양한 집합연산을 제공합니다. [예제 07-12](es2015test/src/07-12.js)
    + 여러 개의 요소를 가진 집합을 초기화할 때는 Set 생성자 함수에 배열값을 인자로 전달하면 됩니다.
    + 교집합(Inersesct), 합집합(Union), 차집합(Difference)을 연산하기 위해서는 배열의 기능을 활용합니다. 
    + 교집합, 차집합의 경우는 배열의 filter메서드를 이용했습니다.
* Map은 키-값 쌍의 집합체이며, 키는 고유한 값이어야 합니다. [예제 07-13](es2015test/src/07-13.js)
    + 예제 07-13에서는 set(), get(), has() 메서드만 사용했습니다.
    + 각각 값의 설정, 획득, 키의 존재 여부를 확인하는 메서드입니다. 이 밖에도 clear(), delete()와 같은 메서드를 사용할 수 있습니다. 

## 7.9 클래스
* 이전 버전에서는 유사 클래스(Pseudo Class)를 만드는 방법을 사용했으나,
* ES2015에서는 공식적으로 클래스를 지원합니다. [예제 07-14](es2015test/src/07-14.js)
    + 다른 프로그래밍 언어의 클래스와 유사하게 정적 메서드(Static Method), 인스턴스 메서드(Instance Method), 생성자(Constructor)를 모두 잘 지원하고 있습니다. 또한 ES2015 클래스는 상속도 지원합니다.
* [예제 07-15](es2015test/src/07-15.js)의 클래스는 Person 클래스로부터 상속받았습니다. 
    + 기존 클래스의 기능들을 상속받아 사용하고, getEmpInfo()와 같은 메서드를 추가하여 기능을 확장했습니다.
    + 자바나 C#과 같은 프로그래밍 언어를 다뤄본 독자라면 익숙한 코드일 것입니다.

## 7.10 모듈
* 전통적인 자바스크립트에서는 모듈이라는 개념이 희박합니다.
* ES2015부터는 공식적으로 모듈 기능을 제공합니다.
* **모듈이란 독립성을 가진 재사용 가능한 코드 블록입니다.**
* 여러 개의 코드 블록을 각각의 파일로 분리한 후 필요한 모듈들을 조합해 애플리케이션을 개발할 수 있습니다.
* ES2015에서는 모듈을 Js코드를 포함하고 있는 파일이라고 간주해도 무방합니다.
* 블록 안에서 import, export 구문을 이용해서 모듈을 가져오거나 내보낼 수 있습니다. [예제 07-16](es2015test/src/07-16.js)
    + 모듈 내부에서 선언된 모든 변수, 함수, 객체, 클래스는 지역적인 것으로 간주되어 재사용 가능한 모듈을 만들려면 반드시 외부로 공개하고자 하는 것을 export해야 합니다.
    + export된 모듈은 다른 모듈에서 import구문으로 참조하여 사용할 수 있습니다.
    ```
    export let a = 1000;
    export function f1(a) {...}
    export {n1, n2 as othername, ...}
    ```
    + export한 요소들을 import할 때 파일의 경로를 지정하면 됩니다. .js 확장자는 생략할 수 있습니다.  [예제 07-17](es2015test/src/07-17.js)
    + import할 때의 주사항은 상대 경로를 사용한다는 것입니다.
    + import할 때 이름을 변경하고 싶다면 as예약어를 사용합니다. [예제 07-18](es2015test/src/07-18.js)
    + 만일 export하는 값이 단일 값, 단일 객체, 단일 함수, 단일 클래스라면 default 키워드를 이용해 export한 후 단일 값으로 import할 수 있습니다.  [예제 07-19](es2015test/utils/utility3.js)
    + [예제 07-20](es2015test/src/07-20.js)에서는 단일 객체를 import하므로 import {calc} from ...와 같이 구조분해 할당을 사용하지 않고 import calc from ...와 같이 단일 객체로 가져올 수 있습니다.

## 7.11 Promise
* 비동기 처리를 좀 더 깔끔하게 수행할 수 있게 도와주는 객체입니다.
* 이미 3장의 [예제 03-09](https://github.com/camass94/Vue.js-Quick-Start/blob/master/03%EC%9E%A5_%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4/watch_fetch.html)에서 사용했었던 whatwg-fetch와 같은 것이 대표적인 Promise객체를 사용하는 라이브러리입니다. 이 밖에도 superagent, axios, vue-resource등이 대부분 Promise 객체를 사용합니다.
* [예제 07-21](es2015test/src/07-21.js) 1행의 Promise 객체를 생성할 때 전달하는 함수가 비동기로 실행됩니다. 첫 번째 인자로 전달된 resolve함수를 호출하면 Promise 객체의 then 메서드에 등록된 함수가 호출됩니다. 두 번째 인자로 전달된 reject 함수를 호출하면 Promise 객체의 catch 메서드에 등록된 함수가 호출됩니다.
    + 이로써 비동기로 실행할 코드와 비동기 처리 결과를 받아 실행하는 코드를 분리할 수 있습니다.
* [예제 07-22](es2015test/src/07-22.html)에서 8행에서 babel-polyfill을 참조했습니다.
    + babel-polyfill은 낮은 버전의 브라우저에서 ES2015코드를 작성할 수 있도록 합니다.

## 7.12 전개 연산자(Spread Operator)
* ...연산자를 함수의 인자로 사용하면 가변 파라미터라고 부릅니다.
    + 가변 파라미터는 개별 값을 나열하여 함수의 인자로 전달하면 함수의 내부에서 배열로 사용할 수 있도록 합니다.
* 전개 연산자는 가변 파라미터와 사용 방법이 다릅니다. 배열이나 객체를 ...연산자와 함께 객체 리터럴, 배열 리터럴에서 사용하면 분해된 값으로 전달합니다.
    + 전개 연산자는 표준 프리셋(ES2015, ES2016, ES2017)만으로는 안됩니다. stage-2 프리셋을 사용해야 합니다.
* 기존 객체의 속성이나 배열의 요소들을 포함하여 새로운 객체, 배열을 생성하고자 할 때 사용합니다.

## 정리
ES2015에 관한 내용은 대규모 웹 애플리케이션을 개발하기 위해 꼭 필요한 내용이므로 잘 알아두어야 합니다. ES2015에 대한 자세한 내용은 다음 웹사이트를 살펴보세요.
* http://hacks.mozilla.or.kr/category/es6-in-depth/





















