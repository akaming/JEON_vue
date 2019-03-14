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

## 10.2 axios 기능 테스트

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