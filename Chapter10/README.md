# Chapter 10 : axios를 이용한 서버통신

이번 장에서는 axios라는 라이브러리를 이용하여 서버와 통신하는 방법에 대해 살펴보겠습니다.

서버와 통신하기 위한 라이브러리는 fetch, superagent, axios 등이 있으며 Vue.js 플러그인으로 개발된 Vue-resource라는 것도 있습니다.

vue-resource가 많이 사용될 것 같지만 Vue.js의 창시자인 에반 유는 굳이 vue-resource를 사용할 필요는 없다고 설명했고, 대신 axios를 사용할 것을 권장하고 있습니다.

axios는 vue-resource가 지원하는 기능 대부분을 제공하며 취소 기능 또한 지원한다고 합니다.

[에반 유가 작성한 글 바로가기](https://medium.com/the-vue-point/retiring-vue-resource-871a82880af4)

----------
- 목차

[10.1 서비스 API 소개](#101-서비스-API-소개)

[10.2 axios 기능 테스트](#102-axios-기능-테스트)

[10.3 연락처 애플리케이션 예제](#103-연락처-애플리케이션-예제)

[10.4 정리](#104-정리)

---------

## 10.1 서비스 API 소개

[연락처 서비스 API 다운로드](https://github.com/stepanowon/contactsvc)

다운로드한 코드는 README.md에 소개한 대로 npm install, npm run start 명령어를 이용해 실행합니다.
명령어를 이용해 contactsapp 이라는 이름의 별도 프로젝트를 생성합니다.

axios 라이브러리는 자동으로 설치, 참조되지 않으며 추가적으로 설치해야 합니다.

```angular2html
vue create contactsapp
cd contactsapp
yarn add axios 또는 npm install --save axios
```

사용법을 익히기 전에 http 프록시를 설정하는 이유와 방법을 살펴보겠습니다.

### 10.2.1 http 프록시 설정

브라우저에 기본 설정된 보안 정책 중에 SOP(Same Origin Policy) 라는 것이 있습니다.

1. index.html 라는 컨슈머 페이지를 브라우저에 요청/응답
2. origin 지정
3. 브라우저에서 Service Provider로 요청
4. Service Provider에서 요청 수신
5. Service Provider 실행 -> 데이터 생성
6. 응답 전송
7. 수신 후 로딩

현재 브라우저의 origin과 다른 origin에 해당하는 서버와 통신하려고 할 때 요청부터 응답 전송까지는 정상적으로 수행되지만 브라우저로 로딩하는 단계에서 오류가 발생하는 현상이다.

이 문제를 흔히 크로스 도메인 문제라고 불러왔지만 정확한 의미는 'SOP 보안 정책으로 인해 크로스 오리진으로부터 데이터를 로드할 수 없는 현상' 이라고 말할 수 있습니다.

도메인명이 같더라도 origin 정보가 한 글자라도 다르면 크로스 오리진 상태입니다.

이를 해결하기 위한 방법으로는 다음과 같습니다.

1. 컨슈머 서버(Consumer Server) 측에 프록시 요소 생성
2. 서비스 제공자(Service Provider) 측에서 CORS(Cross Origin Resource Sharing) 기능을 제공
3. 서비스 제공자(Service Provider) 측에서 JSONP(JSON Padding) 기능을 제공

2, 3번인 경우에는 다른 조치없이 사용이 가능하지만 그렇지 않은 경우는 컨슈머 서버에 프록시 요소를 생성해서 컨슈머를 거쳐 요청이 전달되도록 해야 합니다.

(프록시 서버는 JSP,PHP 등의 개발언어 기술로 만들거나 Tomcat, JBOSS 등의 웹 애플리케이션 서버로 설정을 해주면 이용할 수 있습니다.)

Vue CLI가 생성하는 프로젝트 템플릿 코드에서 약간의 설정 파일만 작성하면 웹팩 개발서버를 이용해 프록시 서버 기능을 이용할 수 있습니다.

프로젝트 최상위 디렉토리에 `vue.config.js` 파일을 생성하고 다음과 같이 작성합니다.

```angular2html
// 예제 10-01 : vue.config.js 작성
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
};
```

개발용 서버에 /api로 요청하면 http://localhost:3000/로 요청이 전달됩니다.

[CORS에 대한 자세한 내용 바로가기](https://developer.mozilla.org/ko/docs/Web/HTTP/Access_control_CORS)

### 10.2.2 axios 사용

- 단일 HTML 파일 작성시 CDN 방식으로 사용

`<script src="https://unpkg.com/axios/dist/axios.min.js"></script>`

```angular2html
// [저수준 API]
axios(config)
axios(url, config)

// [각 메소드별 별칭]
axios.get(url[, config])
axios.delete(url[, config])
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.head(url[, config])
axios.options(url[, config])
```

여기서부터 예제를 통해 알아보겠습니다.

contactsapp 의 `src/AppAxiosTest.vue` 를 추가하고 기본 틀을 작성하겠습니다.

```angularjs
// 예제 10-02
<template>
    <div id="app">
        <div class="container">
            <div class="form-group">
                <button @click="fetchContacts">1페이지 연락처 조회</button>
            </div>
            <div  class="form-group">
                <input type="text" v-model="name" placeholder="이름을 입력합니다" />
                <input type="text" v-model="tel" placeholder="전화번호를 입력합니다" />
                <input type="text" v-model="address" placeholder="주소를 입력합니다" />
                <button @click="addContact">연락처 1건  추가</button>
            </div>
            <div  class="form-group">
                <input type="text" v-model="no" /> <button @click="fetchContactOne">연락처 1건  조회</button>
            </div>
            <div  class="form-group">
                <input type="text" v-model="no" />
                <input type="text" v-model="name" placeholder="이름을 입력합니다" />
                <input type="text" v-model="tel" placeholder="전화번호를 입력합니다" />
                <input type="text" v-model="address" placeholder="주소를 입력합니다" />
                <button @click="updateContact">수정</button>
            </div>
            <div class="form-group">
                <input type="text" v-model="no" /> <button @click="deleteContact">삭제</button>
            </div>
            <div class="form-group">
                <input type="text" v-model="no" />
                <input type="file" ref="photofile" name="photo" />
                <button @click="changePhoto">파일 변경</button>
            </div>
        </div>
        <span>JSON 출력</span>
        <div id="result" class="container">
            <xmp>{{result}}</xmp>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name : "app",
        data() {
            return {
                no : 0, name : '', tel:'', address:'',
                result : null
            }
        },
        methods : {
            fetchContacts : function() {

            },
            addContact : function() {

            },
            fetchContactOne : function() {

            },
            updateContact : function() {

            },
            deleteContact : function() {

            },
            changePhoto : function() {

            }
        }
    }
</script>

<style>
    @import url("https://cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.css");
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    .container { border:solid 1px gray; padding:10px; margin-bottom:10px; text-align:left; }
    #result { text-align: left ; padding:20px; border:solid 1px black; }
    .form-group { border:dashed 1px gray; padding:5px 5px 5px 20px; }
</style>
```

App.vue 대신에 AppAxiosTest.vue를 일시적으로 사용하도록 예제 10-03과 같이 main.js 를 수정합니다.

```angularjs
import Vue from 'vue'
// import App from './App.vue'
import App from './AppAxiosTest.vue'
```

예제 10-02는 디자인을 배제하고 기능만 확인하기 위해 만든 것입니다.

연락처 서비스에 대한 여러 건 조회, 한 건 조회, 추가, 변경, 삭제 등의 기능을 작성하면서 axios의 사용법을 익혀보겠습니다.

### 10.2.3 axios 요청 방법

여러 건의 데이터를 조회하는 방법부터 알아봅니다.

axios 저수준 api를 이용하는 예제부터 작성하겠습니다.

아래 코드를 FetchContacts 메서드 내부에 삽입해주세요.

```angularjs
// 예제 10-04 : axios 저수준 메서드
    axios({
        method : 'GET',
        url : '/api/contacts',
        params : { pageno : 1, pagesize:5 }
    })
    .then((response) => {
        console.log(response);
        this.result = response.data;
    })
    .catch((ex)=> {
        console.log("ERROR!!!! : ", ex);
    })
```

axios 저수준 메서드의 특징은 __모든 전달값을 config 객체로 전달__ 한다는 점입니다.

위에서 params 에 들어간 값은 'api/contacts?pageno=1&pagesize=5' 와 같은 요청입니다.

axios API 호출 후 리턴되는 객체는 Promise 객체입니다.

요청이 성공이라면 then을 호출하고, 실패하면 catch가 호출됩니다.

```angularjs
// 예제 10-05 : axios.get 메서드
    axios.get('/api/contacts/', {
        params: { pageno:1, pagesize:5 }
    })
    .then(...)
    .catch(...)
```

한 건의 연락처를 조회하는 fetchContactOne 메서드 내부도 작성해보겠습니다.

```angularjs
// 예제 10-06 : fetchContactOne 메서드
    axios.get('/api/contacts/'+this.no)
    .then((response) => {
        console.log(response);
        this.result = response.data;
    })
```

### 10.2.4 axios 응답 형식

Promise 객체의 then 메서드 내부에서의 함수 파라미터인 응답(response) 객체는 다양한 정보를 포함하고 있습니다.

- config : 요청 시에 사용된 config 옵션 정보
- headers : 응답 헤더 정보
- request : 서버와 통신 시에 사용된 XMLHttpRequest 객체 정보
- status : HTTP 상태 코드
- statusText : 서버 상태를 나타내는 문자열 정보

이 중에서 기본적으로 확인해야 하는 정보는 __HTTP 상태 코드__

서버에서 정상적으로 처리되었는지를 확인할 수 있다.

- 2XX : 성공
- 3XX : 리다이렉션
- 4XX : 요청 오류(클라이언트측 오류)
- 5XX : 서버 오류

[오류코드 자세히 알아보기](https://ko.wikipedia.org/wiki/HTTP_상태_코드)

### 10.2.5 기타 메서드

GET 메서드 이외의 다른 메서드를 이용하는 방법을 살펴보겠습니다.

POST 메서드에서는 주로 axios.post(url, data, config) 형태를 주로 사용합니다.

addContact 내부에 다음 코드를 작성합니다.

```angularjs
// 예제 10-07 : axios.post 메서드
    axios.post('/api/contacts', { name:this.name, tel:this.tel, address:this.address })
        .then((response) => {
            console.log(response);
            this.result = response.data;
            this.no = response.data.no;
        })
        .catch((ex)=> {
            console.log("ERROR!!!! : ", ex);
        })
```

PUT 메서드의 사용 방법은 POST와 유사합니다.

updateContact 메서드 내부에 다음 코드를 작성합니다.

```angularjs
// 예제 10-08 : axios.put 메서드
    axios.put('/api/contacts/'+this.no, { name:this.name, tel:this.tel, address:this.address })
        .then((response) => {
            console.log(response);
            this.name = '';
            this.tel = '';
            this.address='';
            this.result = response.data;
        })
        .catch((ex)=> {
            console.log("ERROR!!!! : ", ex);
        })
```

삭제를 위해서는 DELETE 메서드를 사용할 수 있습니다.

GET 메서드와 용법이 비슷합니다.

deleteContact 메서드 내부에 다음 코드를 작성합니다.

```angularjs
// 예제 10-09 : axios.delete 메서드
    axios.delete('/api/contacts/'+this.no)
        .then((response) => {
            console.log(response);
            this.no = 0;
            this.result = response.data;
        })
        .catch((ex)=> {
            console.log("ERROR!!!! : ", ex);
        })
```

### 10.2.6 파일 업로드 처리

```angularjs
<form method="post" enctype="nultipart/form-data" action="/contacts/1491586656774/photo">
    <input type="file" name="photo">
    <input type="submit">
</form>
```

다음 코드에 axios를 이용해서 파일 업로드 기능을 구현하기 위해서 `<input type="file" />` 필드를 직접 참고해야 합니다.

예제 10-02의 28행 코드를 보면 ref 라는 옵션을 사용한 것을 확인할 수 있습니다.

`<input type="file" ref="photofile" name="photo" />"`

바로 ref 옵션이라는 것을 이용해서 직접 참조할 수 있습니다.

changePhoto 메서드 내부에 다음 코드를 작성합니다.

```angularjs
// 예제 10-10 : 파일 업로드 기능
    var data = new FormData();
    var file = this.$refs.photofile.files[0];
    data.append('photo', file);
    this.$axios.post('/api/contacts/' +this.no + '/photo', data)
        .then((response) => {
            this.result = response.data;
        })
        .catch((ex) => {
            console.log('updatePhoto failed', ex);
        });
```

FormData 객체를 생성하고 this.$ref.photofile과 같이 ref 옵션을 이용해 파일 필드를 직접 참조합니다.

이 필드의 값을 FormData 객체에 추가한 뒤 서버로 요청하면 됩니다.

`yarn serve` 명령을 이용해서 이제까지 작성한 코드를 실행해보면 결과를 확인할 수 있습니다.

### 10.2.7 axios 요청과 config 옵션

앞 예제에서는 params 옵션만 사용했었지만 axios를 요청할 때 다양한 유형의 옵션을 이용할 수 있습니다.

- baseURL : 이 옵션을 이용해 공통적인 URL의 앞부분을 미리 등록해두면 요청 시 나머지 부분만을 요청 URL로 전달하면 됩니다. 가능하다면 axios.defaults.baseURL 값을 미리 바꾸는 편이 좋습니다.
- transformRequest: 요청 데이터를 서버로 전송하기 전에 데이터를 변환하기 위한 함수를 등록합니다.
- transformResponse : 응답 데이터를 수신한 직후에 데이터를 변환하기 위한 함수를 등록합니다.
- headers : 요청 시에 서버로 전달하고자 하는 HTTP 헤더 정보를 설정합니다.

### 10.2.8 Vue 인스턴스에서 axios 이용하기

Vue 인스턴스 내부에서 axios를 이용하기 위해 Vue.prototype에 axios를 추가하면 더욱 간단하게 사용할 수 있습니다.

다음 코드를 main.js에 추가합니다.

```angularjs
// 예제 10-11 : src/main.js 변경
import Vue from 'vue'
// import App from './App.vue'
import App from './AppAxiosTest.vue'
import axios from 'axios'

Vue.prototype.$axios = axios;
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

이제 Vue 인스턴스 내부에서는 axios를 import하지 않고도 this.$axios를 사용할 수 있습니다.

예를 들어 AppAxiosTest.vue 파일의 fetchContactOne 메서드는 다음과 같이 사용할 수 있습니다.

```angularjs
// 예제 10-12 : fetchContactOne 메서드 변경
    this.$axios({
        method : 'GET',
        url : '/api/contacts',
        params : { pageno : 1, pagesize:5 }
    })
        .then((response) => {
            console.log(response);
            this.result = response.data;
        })
```

`import axios from 'axios'` 코드는 main.js에서만 작성하면 됩니다.

이 애플리케이션 내부의 모든 Vue 인스턴스에서 this.$axios와 같이 사용할 수 있습니다.

### 10.2.9 axios 사용 시 주의 사항

axios를 사용하면서 then()를 처리할 때는 ES6의 화살표 함수를 사용할 것을 권장합니다.

데이터를 수신한 후에 Vue 인스턴스 내부의 데이터를 변경해야 하는 경우가 많은데, 데이터 옵션을 액세스하기 위해서는 this 객체가 Vue 인스턴스를 참조할 수 있어야 합니다.

## 10.3 연락처 애플리케이션 예제


### 10.3.1 기초 작업
### 10.3.2 App.vue 작성
### 10.3.3 ContactList.vue 작성
### 10.3.4 입력폼, 수정폼 작성
### 10.3.5 사진 변경폼 작성


## 10.4 정리

위 예제에서 사용한 기법을 정리하면 다음과 같습니다.

- 상위 컴포넌트에서 하위 컴포넌트로 데이터를 전달하기 위해 props를 사용합니다.

- 데이터가 위치한 곳에 데이터를 변경하는 메서드를 중앙집중화하여 배치합니다.

- 다른 컴포넌트로 이벤트 정보를 전달하기 위해 이벤트 버스 객체를 사용합니다.

- 동적 컴포넌트를 이용해 <component> 위치에 여러 컴포넌트를 나타낼 수 있도록 합니다.


- data : data 옵션에 주어진 모든 속성들은 Vue 인스턴스 내부에서 직접 이용되지 않고 Vue 인스턴스와 Data 옵션에 주어진 객체 사이에 프록시를 두어 처리.

> Vue.js 2.x 버전에서는 프록시 구현을 위해 속성을 사용합니다.
> Object.defineProperty() 메서드를 이용해 setter, getter를 정의하고 setter를 이용해 값이 변경될 때, 관찰자
(watcher)에게 변경 여부를 알려서 렌더링이 다시 일어나도록 제어합니다.
> 자세한 내용은 다음 웹문서를 참조합니다.
> https://kr.vuejs.org/v2/guide/reactivity.html

```angular2html
// 예제 03-01
   <div id="test">
       {{name}}
   </div>
   <script type="text/javascript">
   var model = {
       name : "홍길동"
   };
   var vm = new Vue({
       el: '#test',
       data: model
   })
</script>

// 콘솔 실행시 위 소스와 동일하게 작동됨을 알 수 있음
> vm.name = "이몽룡"
> model.name = "향단이"
> vm.$data.name = "성춘향"
```

_내장옵션들은 $식별자를 앞에 붙이고 있는데 이름 충돌을 피하기 위한 것이다._

- el : Vue 인스턴스에 연결할 HTML DOM 요소를 지정하는 옵션.

__주의할 점은 여러 개 요소에 지정할 수 없다는 것이다.__

실행 도중 동적으로 Vue 인스턴스와 HTML 요소를 연결할 수 있지만, 가능하다면 el 옵션은 Vue 인스턴스를 생성할 때 미리 지정할 것을 권장. ( vm.$mount('#test')와 같이 $mount()를 이용해 동적으로 연결할 수 있음 )

Vue 인스턴스가 HTML 요소와 연결되면 도중에 연결된 요소를 변경할 수 없다.

computed 옵션에 지정한 값은 함수였지만 Vue 인스턴스는 프록시 처리하여 마치 속성처럼 취급한다.

```angular2html
// 예제 03-02 : 예제 02-13 소환
<script type="text/javascript">
//1부터 입력된 숫자까지의 합구하기
var vmSum = new Vue({
    el: "#example",
    data: {num: 0},
    computed: {
        sum: function() {
            var n = Number(this.num);
            if (Number.isNaN(n) || n < 1) return 0;
            return ((1+n) * n) / 2;
        }
    }
})
</script>

// 계산형 속성으로 접근시 정상 실행됨을 알 수 있다.
> vmSum.sum // 계산형 속성
> vmSum.$data.sum
> vmSum.$options.computed.sum // $options : Vue 인스턴스의 모든 옵션 정보를 다룸
```

```angular2html
// 예제 03-03: 계산형 속성의 getter/setter 메서드
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>03-02</title>
<script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
</head>
<body>
<div id="example">
    금액 : <span>{{amount}}원</span>
</div>
<script type="text/javascript">
var vm = new Vue({
    el: "#example",
    data: {amt : 1234567},
    computed: {
        amount: {
            // amt 값을 숫자 3자리마다 쉼표 처리하여 리턴
            get: function() {
                var s = new String(""+this.amt);
                var result = "";
                var num = 0;
                for (var i=s.length-1;i>=0;i--){
                    result = s[i] + result;
                    if (num % 3 == 2 && i !== 0)
                        result = "," + result;
                    num++;
                }
                return result;
            },
            // 문자열을 쉼표 제거한 뒤 숫자 값으로 변환
            set: function(amt) {
                if (typeof(amt) === "string") {
                    var result = parseInt(amt.replace(/,/g, ""))
                    if (isNaN(result)) {
                        this.amt = 0;
                    } else {
                        this.amt = result;                    
                    }
                } else if (typeof(amt) === "number") {
                    this.amt = amt;
                }
            }
        }
    }
})
</script>
</body>
</html>

> vm.amount = "1,000,000,000"
> vm.amt
> vm.amount
```

## 3.2 메서드

- methods : Vue 인스턴스에서 사용할 메서드를 등록하는 옵션. 직접 호출, 디렉티브 표현식, 콧수염(Mustache) 표현식 등에서 사용할 수 있다.

```angular2html
// 예제 03-04 : 예제 03-02를 메서드 사용으로 변경
<div id="example">
    <input type="text" v-model="num" /><br />
    1부터 입력된 수까지의 합 : <span>{{sum()}}</span>
</div>
<script type="text/javascript">
//1부터 입려된 수까지의 합구하기
var vmSum = new Vue({
    el: "#example",
    data: {num: 0},
    methods: {
        sum: function() { // note: 내부에 this를 사용하는 함수는 es6 arrow function을 사용하지 않도록 주의해야한다.
            // console.log (Date.now());
            var n = Number(this.num);
            if (Number.isNaN(n) || n < 1) return 0;
            return ((1+n) * n) / 2;
        }
    }
})
</script>
```

{{sum()}} 으로 호출 구문 형식을 사용해야 하는데, 이 형식과 계산형 속성의 차이는 내부 작동 방식이다.

계산형 속성은 종속된 값에 의해 결과값이 캐싱이 되고, 예제 03-04 같은 경우에서는 메서드를 매번 실행한다.

## 3.3 관찰 속성

하나의 데이터를 기반으로 다른 데이터를 변경할 필요가 있을 때 흔히 계산형 속성을 쓰고 있는데, 이 외에도 관찰 속성(Watched Propperty)이라는 것을 사용할 수 있다.

주로 긴 처리 시간이 필요한 비동기 처리에 적합하다는 특징이 있다.

우선 watch 옵션을 이용해 관찰 속성을 등록한다.

```angular2html
// 예제 03-05
<div id="example">
    x: <input type="text" v-model="x"><br>
    y: <input type="text" v-model="y"><br>
    덧셈 결과 : {{sum}}
</div>
<script type="text/javascript">
var vm = new Vue({
    el: "#example",
    data: {x:0, y:0, sum:0},
    // 속성의 이름과 해당 속성이 변경되었을 때 호출할 함수
    watch: {
        x: function(v) {
            console.log("## x 변경");
            var result = Number(v) + Number(this.y);
            if (isNaN(result)) {
                this.sum = 0;                
            } else {
                this.sum = result;
            } 
        },
        y: function(v) {
            console.log("## y 변경");
            this.y = v;
            var result = Number(this.x) + Number(v);
            if (isNaN(result)) {
                this.sum = 0;
            } else {
                this.sum = result;
            }
        }
    }
})
</script>
```

이 경우는 굳이 관찰 속성을 쓸 필요 없이 계산형 속성을 사용하면 되는 경우이다.

예제 03-05를 이용해 스크립트 부분만 변경하면 다음과 같다.

```angular2html
// 예제 03-06
<script type="text/javascript">
var vm = new Vue({
    el: "#example",
    data: {x:0, y:0},
    computed: {
        sum: function() {
            var result = Number(this.x) + Number(this.y);
            if (isNaN(result)) {
                return 0;
            } else {
                return result;
            }
        }
    }
})
</script>
```

관찰 속성이 필요한 예제를 살펴보면 다음과 같다.

```angular2html
// 예제 03-07 : HTML 기본 틀
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>03-07</title>
</head>
<body>
<div id="example">

</div>
<script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.4/fetch.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.1/es6-promise.auto.min.js"></script>
<script type="text/javascript">


</script>
</body>
</html>
```

```angular2html
// 예제 03-08 : 나머지 코드 추가
// head 안쪽에 스타일을 정의합니다
<style>
    #list {width: 600px; border:1px solid black; border-collapse:collapse;}
    #list td, #list th {border:1px solid black; text-align:center;}
    #list > thead > tr {color:yellow; background-color:purple;} 
</style>

// id가 example인 요소 내에 작성합니다
<div id="example">
    <p>
    이름 : <input type="text" v-model="name" placeholder="두자 이상 입력하세요" />
    </p>
    <table id="list">
        <thead>
            <tr>
                <th>번호</th><th>이름</th><th>전홥너호</th><th>주소</th>
            </tr>
        </thead>
        <tbody id="contacts">
            <tr v-for="contact in contactlist">
                <td>{{contact.no}}</td>
                <td>{{contact.name}}</td>
                <td>{{contact.tel}}</td>
                <td>{{contact.address}}</td>
            </tr>
        </tbody>
    </table>
    <div v-show="isProcessing === true">조회중</div>
</div>
```

```angular2html
// 예제 03-09 : script 내에 작성할 vue 객체
<script type="text/javascritp">
var vm = new Vue({
    el: "#example",
    data: {
        name: "",
        isProcessing: false,
        contactlist: []
    },
    // name 속성의 변화를 감지하여 10행의 함수를 호출
    watch: {
        // 2자 이상 입력된 경우 fatchContacts 함수 호출
        name: function(val) {
            if (val.length >= 2) {
                this.fetchContacts();
            } else {
                this.contactlist = [];
            }
        }
    },
    methods: {
        fetchContacts: _.debounce(function(){ // lodash 라이브러리의 _.debounce() 함수를 이용해 일정시간이 지나도록 연속적인 호출이 일어나지 않으면 실제 API를 호출하도록 작성.
            this.contactlist = [];
            this.isProcessing = true;
            var url = "http://sample.bmaster.kro.kr/contacts_long/search/" + this.name;
            var vm = this;
            fetch(url)
                .then(function(response) {
                    return response.json()
                }).then(function(json) {
                    vm.contactlist = json;
                    vm.isProcessing = false;
                }).catch(function(ex) {
                    console.log('parsing failed', ex);
                    vm.contactlist = [];
                    vm.isProcessing = false;
                })
        }, 300)
    }
});
</script>
```



## 3.4 v-cloak 디렉티브

- v-cloak : 콧수염 표현식의 템플릿 문자열이 잠깐 나타났다가 사라지는 경우를 없애는데 사용하는 디렉티브.

```angular2html
// 예제 03-10
<style>
    #list {width:600px;border:1px solid black;border-collapse:collapse;}
    #list td,#list th{border:1px solid black;text-align:center;}
    #list>thead>tr{color:yellow;background-color:purple;}
    [v-cloak]{display:none;}
</style>

<div id="example" v-cloak>
......
</div>
```

## 3.5 Vue 인스턴스 라이프 사이클

Vue 인스턴스는 객체로 생성되고, 데이터에 대한 관찰 기능을 설정하는 등의 작업을 위해 초기화를 수행한다.

그리고 이 과정에서 다양한 라이프 사이클 훅 메서드를 적용할 수 있다.

| 라이프 사이클 훅 | 설명 |
| ------------- | ------- |
| beforeCreate | Vue 인스턴스가 실행되고 데이터에 대한 관찰 기능 및 이벤트 감시자 설정 전에 호출됩니다. |
| created | Vue 인스턴스가 생성된 후에 데이터에 대한 관찰 기능 계산형 속성 메서드 감시자 설정이 완료된 후에 호출됩니다. |
| beforeMount | 마운트가 시작되기 전에 호출됩니다. |
| mounted | el에 vue 인스턴스의 데이터가 마운트된 후에 호출됩니다. |
| beforeUpdate | 가상 DOM이 렌더링 패치되기 전에 데이터가 변경될 때 호출됩니다 이 훅에서 추가적인 상태 변경을 수행할 수 있습니다 하지만 추가로 다시 렌더링하지는 않습니다. |
| updated | 데이터의 변경으로 가상 DOM이 다시 렌더링되고 패치된 후에 호출됩니다. 이 훅이 호출되었을 때는 이미 컴포넌트의 DOM이 업데이트된 상태입니다 그래서 DOM에 종속성이 있는 연산을 이 단계에서 수행할 수 있습니다. |
| beforeDestroy | Vue 인스턴스가 제거되기 전에 호출됩니다. |
| destroyed | Vue 인스턴스가 제거된 후에 호출됩니다. 이 훅이 호출될 때는 Vue 인스턴스의 모든 디렉티브의 바인딩이 해제되고 이벤트 연결도 모두 제거됩니다. |

[Vue 컴포넌트 라이프 사이클 바로가기](https://kr.vuejs.org/v2/guide/instance.html#%EB%9D%BC%EC%9D%B4%ED%94%84%EC%82%AC%EC%9D%B4%ED%81%B4-%EB%8B%A4%EC%9D%B4%EC%96%B4%EA%B7%B8%EB%9E%A8)

```angular2html
// 예제 03-11: 라이프 사이클 훅 추가
<script type="text/javascript">
var vmSum = new Vue({
    el: "#example",
    data: {num: 0},
    // created 이벤트 발생 후 데이터가 변경될 때마다 updated 훅이 실행됨.
    created: function() {
        console.log("Created!!");
    },
    updated: function() {
        console.log("updated!!");
        console.log(this.num);
    },
    computed: {
        sum: function() {
            var n = Number(this.num);
            if (Number.isNaN(n) || n < 1) return 0;
            return ((1+n) * n) / 2;
        }
    }
});
</script>
```

## 정리

일반적인 경우라면 watch 옵션을 사용하는 관찰 속성보다는 계산형 속성이 더 편리하다.

하지만 긴 작업 시간이 필요한 비동기 처리가 요구되는 경우에는 관찰 속성을 사용해야 한다.

method 옵션은 Vue 인스턴스에 메서드를 정의할 수 있는 기능이다. 등록된 메서드는 콧수염 표현식의 템플릿 문자열로도 사용할 수 있으며, 다음 장에 살펴볼 이벤트에서도 사용이 가능하다.