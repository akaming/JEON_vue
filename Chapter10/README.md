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

```
vue create contactsapp
cd contactsapp
yarn add axios 또는 npm i -d axios
```

사용법을 익히기 전에 http 프록시를 설정하는 이유와 방법을 살펴보겠습니다.

### 10.2.1 http 프록시 설정

브라우저에 기본 설정된 보안 정책 중에 SOP(Same Origin Policy) 라는 것이 있습니다.

- SOP 보안 정책 순서
1. 컨슈머 페이지(index.html)를 브라우저에 요청/응답
2. 브라우저에서 origin 지정(http://localhost:8080)
3. 브라우저에서 Service Provider로 요청
4. Service Provider에서 요청 수신
5. Service Provider에서 실행 -> 데이터 생성(http://sample.bmaster.kro.kr)
6. 응답 전송
7. 수신 후 로딩(서로 origin이 다른 경우 거부)

현재 브라우저의 origin과 다른 origin에 해당하는 서버와 통신하려고 할 때 요청부터 응답 전송까지는 정상적으로 수행되지만 브라우저로 로딩하는 단계에서 오류가 발생하는 현상이다.

이 문제를 흔히 크로스 도메인 문제라고 불러왔지만 정확한 의미는 __'SOP 보안 정책으로 인해 크로스 오리진으로부터 데이터를 로드할 수 없는 현상'__ 이라고 말할 수 있습니다.

도메인명이 같더라도 origin 정보가 한 글자라도 다르면 크로스 오리진 상태입니다.

이를 해결하기 위한 방법으로는 다음과 같습니다.

1. 컨슈머 서버(Consumer Server) 측에 프록시 요소 생성
2. 서비스 제공자(Service Provider) 측에서 CORS(Cross Origin Resource Sharing) 기능을 제공
3. 서비스 제공자(Service Provider) 측에서 JSONP(JSON Padding) 기능을 제공

2, 3번인 경우에는 다른 조치없이 사용이 가능하지만 그렇지 않은 경우는 컨슈머 서버에 프록시 요소를 생성해서 컨슈머를 거쳐 요청이 전달되도록 해야 합니다.

_프록시 서버는 JSP,PHP 등의 개발언어 기술로 만들거나 Tomcat, JBOSS 등의 웹 애플리케이션 서버로 설정을 해주면 이용할 수 있습니다._

Vue CLI가 생성하는 프로젝트 템플릿 코드에서 약간의 설정 파일만 작성하면 웹팩 개발서버를 이용해 프록시 서버 기능을 이용할 수 있습니다.

프로젝트 최상위 디렉토리에 `vue.config.js` 파일을 생성하고 다음과 같이 작성합니다.

```
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

- CLI 사용

`yarn add axios` or `npm i -d axios`

- 단일 HTML 파일 작성시 CDN 방식으로 사용

`<script src="https://unpkg.com/axios/dist/axios.min.js"></script>`

```
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

```
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

App.vue 대신에 AppAxiosTest.vue를 일시적으로 사용하도록 예제 10-03과 같이 `main.js`를 수정합니다.

```
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

```
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

```
// 예제 10-05 : axios.get 메서드
    axios.get('/api/contacts/', {
        params: { pageno:1, pagesize:5 }
    })
    .then(...)
    .catch(...)
```

한 건의 연락처를 조회하는 fetchContactOne 메서드 내부도 작성해보겠습니다.

```
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

```
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

```
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

```
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

```
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

```
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

```
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

```
// 예제 10-12 : fetchContactOne 메서드 변경
    this.$axios.get('/api/contacts/'+this.no)
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

위에서 학습한 내용을 바탕으로 <axios + 동적 컴포넌트 + 이벤트 버스> 기능을 결합해서 실질적인 연락처 애플리케이션을 만들어 보겠습니다

### 10.3.1 기초 작업

이전 예제에서 AppAxiosTest.vue를 사용하도록 설정하였는데 이를 다시 돌려놓도록 하겠습니다

```
// 예제 10-13 : src/main.js 변경
import Vue from 'vue'
import App from './App.vue'
// import App from './AppAxiosTest.vue'
import axios from 'axios'
```

axios를 이용해 접근할 URL를 상수로 정의해봅니다.

src 디렉토리 아래에 Config.js 파일을 추가하고 다음을 작성합니다.

```
// 예제 10-14 : src/Config.js
var BASE_URL = "/api";

export default {
    PAGESIZE : 5,

    //전체 연락처 데이터 요청(페이징 포함)
    FETCH : BASE_URL + "/contacts",
    //연락처 추가
    ADD : BASE_URL + "/contacts",
    //연락처 업데이트
    UPDATE : BASE_URL + "/contacts/${no}",
    //연락처 한건 조회
    FETCH_ONE : BASE_URL + "/contacts/${no}",
    //연락처 삭제
    DELETE : BASE_URL + "/contacts/${no}",
    //연락처 사진 업로드->변경
    UPDATE_PHOTO : BASE_URL + "/contacts/${no}/photo"
}
```

아무 기능이 정의되지 않은 비어 있는 펻 dlstmxjstmfmf todtjdgotj ㄷ테ㅐㄱㅅgkqslek.

src 디렉토리 아래에 EventBus.js 파일을 추가하고 다음을 작성합니다.

```
// 예제 10-15 : src/EventBus.js
import Vue from 'vue';

var vm = new Vue({
    name : "EventBus"
});

export default vm;
```

이제 초기 설정 작업의 마무리로 컴포넌트 파일을 작성하겠습니다.

src/components 디렉토리에 다음 5개의 컴포넌트 파일을 생성합니다

| 컴포넌트 | 필요 데이터 |
| :----: | :--- |
| App.vue | currentView: 동적 컴포넌트로 보여줄 컴포넌트를 지정
| ContactList.vue | contactlist: 연락처 목록 데이터 |
| AddContact.vue |  |
| UpdateContact.vue | contact: 연락처 한 건 데이터 |
| ContactForm.vue | mode: 쓰기/수정 여부('add' 또는 'update') |
| UpdatePhoto.vue | contact: 연락처 한 건 데이터 |


이제 App.vue부터 하향식으로 작성해보겠습니다 

컴포넌트를 작성해나가는 방법은 상향식과 하향식으로 나눌 수 있는데 상향식은 하위 컴포넌트를 먼저 작성하고 상위 컴포넌트를 만들어나가는 방법입니다. 하향식은 그 반대인데 하위 컴포넌트에서 보여줄 데이터가 무엇인지 정의되었다면 상위 컴포넌트부터 충분히 만들어 나갈 수 있습니다

이 예제에서는 많은 연락처를 페이지를 나누어 볼 수 있도록 페이징 기능을 제공할 것입니다

이를 위해 vuejs-paginate 라는 패키지를 설치하겠습니다.

`yarn add vuejs-paginate bootstrap@3.3.x` 또는 `npm i -d vuejs-paginate bootstrap@3.3.x`

vue-js-paginate 패키지는 부트스트랩 css 파일을 필요로 하므로 src/main.js에서 부트스트랩 css 파일을 import 해야합니다

[vuejs-paginate 컴포넌트 자세히 알아보기](https://github.com/lokyong/vuejs-paginate)

또한 IE에서는 Promise 객체를 지원하지 않는데 axios는 Promise 기반이므로 별도의 polyfill 요소를 다운로드하고 참조해야합니다.

`yarn add es6-promise` 또는 `npm i -d es6-promise`

이제 src/main.js 파일을 열어서 es6-promise Polyfill의 사용과 bootstrap을 참조하기 위해 코드를 변경합니다.

```
import Vue from 'vue'
// import App from './App.vue'
import App from './AppAxiosTest.vue'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.css'
import ES6Promise from 'es6-promise'
ES6Promise.polyfill()

Vue.prototype.$axios = axios;
...

```

### 10.3.2 App.vue 작성

하향식으로 구성할 것이므로 우선 최상위 컴포넌트인 App.vue부터 작성합니다.

앱 전체에서 사용되는 모든 상태(데이터)와 메서드(서버와의 통신 기능 포함)를 App.vue에서 배치합니다.

또한 동적 컴포넌트 방식으로 참조할 수 있도록 할 것입니다.

```
// 예제 10-16 : src/App.vue의 기본 골격
<template>
  <div id="container">
      <div class="page-header">
         <h1 class="text-center">연락처 관리 애플리케이션</h1>
         <p>(Dynamic Component + EventBus + Axios) </p>
      </div>
      <component :is="currentView" :contact="contact"></component>
      <contactList :contactlist="contactlist"></contactList>
  </div>
</template>

<script>
import ContactList from './components/ContactList';
import AddContact from './components/AddContact';
import UpdateContact from './components/UpdateContact';
import UpdatePhoto from './components/UpdatePhoto';
import CONF from './Config.js';
import eventBus from './EventBus.js';
export default {
    name: 'app',
    components : { ContactList, AddContact, UpdateContact, UpdatePhoto },
    data: function() {
        return { 
            currentView : null, 
            contact : { no:0, name:'', tel:'', address:'', photo:'' },
            contactlist : {
                pageno:1, pagesize: CONF.PAGESIZE, totalcount:0, contacts:[]
            }
        }
    },
    mounted : function() {
  
    },
    methods : {

    }
}
</script>

<style scoped>
#container {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

script 바로 아래에 4개의 컴포넌트와 이벤트 버스 설정 정보 파일을 참조하고 있습니다.

참조한 컴포넌트를 사용하기 위해서 default.components 와 같이 components 옵션을 등록합니다.

또한 하위 컴포넌트들이 필요로 하는 데이터를 App.vue에서 관리할 것이므로 모든 필요 데이터의 초기 상태를 default.data() 와 같이 저장합니다

이제 템플릿을 살펴보면 `<contactList :contactlist="contactlist"></contactList>` 이 부분과 같이 ContactList 컴포넌트를 항상 화면에 나타나도록 하기 위해 정적으로 사용합니다.

하지만 AddContact, UpdateContact, UpdatePhoto 컴포넌트는 7행과 같이 동적 컴포넌트로 currentView 데이터 옵션을 사용해 나타날 수 있도록 합니다. 즉, 평상시에는 보이지 않다가 추가, 수정, 사진 버튼을 클릭하면 나타나도록 할 것입니다.

- 필요기능

|메서드명|필요 인자|메서드 기능|
|:---:|:---|:---|
|pageChanged|page|보여줄 페이지를 변경함. data 속성의 contactlist 정보를 변경후 fetchContacts 호출하도록 작성. Paginate 컴포넌트에서 이 함수를 바인딩함|
|fetchContacts|pageno, pagesize|전체 연락처 데이터를 페이징하여 조회함. pageno, pagesize는 data 속성의 contactlist 정보를 활용함|
|fetchContactOne|no|일련번호를 이용해 특정 연락처 한건을 조회함|
|addContact|contact|연락처 한 건을 추가함. contact는 객체임|
|updateContact|contact|연락처 한 건을 수정함. contact는 객체임|
|deleteContact|no|일련번호를 이용해 연락처 한 건을 삭제함|
|updatePhoto|no, file|일련번호와 파일 요소 정보를 이용해 사진 파일을 변경함|

위 기능에 따라 methods 내부에 아래 코드를 작성합니다.

```
// 예제 10-17
    pageChanged : function(page) {
      this.contactlist.pageno = page;
      this.fetchContacts();
    },
    fetchContacts : function() {
      this.$axios.get(CONF.FETCH, {
          params : { 
              pageno:this.contactlist.pageno, 
              pagesize:this.contactlist.pagesize 
          } 
      })
      .then((response) => {
          this.contactlist = response.data;
      })
      .catch((ex)=> {
          console.log('fetchContacts failed', ex);
          this.contactlist.contacts = [];
      })
    },
    addContact : function(contact) {
    console.log("add!!")
      this.$axios.post(CONF.ADD,  contact)
      .then((response) => {
        if (response.data.status === "success") {
          this.contactlist.pageno = 1;
          this.fetchContacts();
        } else {
          console.log('연락처 추가 실패 : ' + response.data.message);
        }
      })
      .catch((ex)=> {
          console.log('addContact failed : ', ex);
      })
    },
    updateContact : function(contact) {
      this.$axios.put(CONF.UPDATE.replace("${no}", contact.no), contact)
      .then((response) => {
        if (response.data.status === "success") {
          this.fetchContacts();
        } else {
          console.log('연락처 변경 실패 : ' + response.data.message);
        }
      })
      .catch((ex) => {
          console.log('updateContact failed : ', ex);
      })
    },
    fetchContactOne : function(no) {
      this.$axios.get(CONF.FETCH_ONE.replace("${no}", no))
      .then((response) => {
          this.contact = response.data;
      })
      .catch((ex)=> {
          console.log('fetchContactOne failed', ex);
      })
    },
    deleteContact : function(no) {
      this.$axios.delete(CONF.DELETE.replace("${no}", no))
      .then((response) => {
        if (response.data.status === "success") {
          this.fetchContacts();
        } else {
          console.log('연락처 삭제 실패 : ' + response.data.message);
        }
      })
      .catch((ex) => {
          console.log('delete failed', ex);
      })
    },
    updatePhoto : function(no, file) {
      var data = new FormData();
      data.append('photo', file);
      this.$axios.post(CONF.UPDATE_PHOTO.replace("${no}", no), data)
      .then((response) => {
        if (response.data.status === "success") {
          this.fetchContacts();
        } else {
          console.log('연락처 사진 변경 실패 : ' + response.data.message);
        }
      })
      .catch((ex) => {
          console.log('updatePhoto failed', ex);
      });
    }
```

이제 각 컴포넌트가 발생시켜 이벤트 버스를 통해 전달될 이벤트에 대한 부분을 생각해봅시다.

- App.vue에서의 수신 이벤트

|이벤트 명|전달 인자|설명|
|:---|:---|:---|
|addContactForm||연락처 추가 폼이 나타날 수 있도록 currentView를 addContact로 변경함|
|editContactForm|no|변경폼에 기존 연락처 데이터가 나타날 수 있도록 no 인자를 
|editPhoto|no|editContactForm 이벤트와 유사하게 no 인자를 이요해 fetchContactOne 메서드를 호출하고 currentView를 updatePhoto로 변경함
|cancel||모든 입력폼에서 취소 버튼을 클릭했을 때 발생되는 이벤트. currentView를 null로 변경함.
|addSubmit|contact|연락처가 추가되는 이벤트. updateContact 메서드를 호출함. 수정 폼은 사라지도록 currentView를 null로 설정함.
|updateSubmit|contact|연락처가 수정되는 이벤트 updateContact 메서드를 호출함. 수정 폼은 사라지도록 currentView를 null로 설정함.
|updatePhoto|no, file|파일 정보가 존재할 때 updatePhoto 메서드를 호출하고 사진 변경 폼이 사라질 수 있또록 currentView를 null로 설정함.
|deleteContact|no|no를 이용해 deleteContact 메서드를 호출함.
|pageChanged|page|page 번호를 이용해 페이지를 이동시키도록 pageChanged 메서드를 호출함.

이벤트 수신 기능은 mounted 이벤트 훅에 작성하면 됩니다.

또한, 처음 실행시 첫번째 페이지 데이터가 나올 수 있도록 fetchContacts 메서드를 한 번 호출해야 합니다.

```
// 예제10-18 : mounted 이벤트 훅의 코드
  this.fetchContacts(); // 첫번째 페이지 데이터를 위한 호출
  eventBus.$on("cancel", () => {
      this.currentView = null;
  });
  eventBus.$on("addSubmit", (contact) => {
      this.currentView = null;
      this.addContact(contact);
  });
  eventBus.$on("updateSubmit", (contact) => {
      this.currentView = null;
      this.updateContact(contact);
  });
  eventBus.$on("addContactForm", () => {
      this.currentView = 'addContact';
  });
  eventBus.$on("editContactForm", (no) => {
      this.fetchContactOne(no)
      this.currentView = 'updateContact';
  });
  eventBus.$on("deleteContact", (no) => {
      this.deleteContact(no);
  });
  eventBus.$on("editPhoto", (no) => {
      this.fetchContactOne(no)
      this.currentView = 'updatePhoto';
  });
  eventBus.$on("updatePhoto", (no, file) => {
      if (typeof file !=='undefined') {
          this.updatePhoto(no, file);
      }
      this.currentView = null;
  });
  eventBus.$on("pageChanged", (page)=> {
    this.pageChanged(page);
  })      
```

### 10.3.3 ContactList.vue 작성

ContactList.vue는 App.vue로부터 contactlist 데이터 속성을 props로 전달받아 화면을 구성합니다.

이 화면에서는 다음과 같은 이벤트가 발생합니다.

|이벤트|전달 인자|설명|
|---|---|---|
|addContactForm||'새 연락처 추가 버튼을 클릭했을 때 입력폼을 나타내기 위한 이벤트
|editContactForm|no|조회하고 있는 연락처 리스트 중에서 편집 버튼을 누른 연락처의 no 필드값을 인자로 전달하여 연락처 수정 폼을 나타내기 위한 이벤트
|deleteContact|no|일련 번호를 이용해 삭제하기 위한 이벤트
|editPhoto|no|조회하고 있는 연락처 리스트에서 사진을 클릭했을 때 no 필드 값을 전달하여 사진 변경 폼을 나타내기 위한 이벤트
|pageChanged|page|ContactList.vue 컴포넌트에서 사용하는 vuejs-paginate 컴포넌트에서 페이지가 바뀌면 App.vue로 알려서 처리하기 위한 이벤트

```
// 예제 10-19 : src/components/ContactList.vue
<template>
    <div>
    <p class="addnew">
        <button class="btn btn-primary" @click="addContact()">
            새로운 연락처 추가하기</button>
    </p>
    <div id="example">
    <table id="list" class="table table-striped table-bordered table-hover">
        <thead>
            <tr>
                <th>이름</th><th>전화번호</th><th>주소</th>
                <th>사진</th><th>편집/삭제</th>
            </tr>
        </thead>
        <tbody id="contacts" >
            <tr v-for="contact in contactlist.contacts" :key="contact.no">
                <td>{{contact.name}}</td>
                <td>{{contact.tel}}</td>
                <td>{{contact.address}}</td>
                // 여기부터
                <td><img class="thumbnail" :src="contact.photo" 
                    @click="editPhoto(contact.no)" /></td>
                <td>
                    <button class="btn btn-primary" 
                        @click="editContact(contact.no)">편집</button>
                    <button class="btn btn-primary" 
                        @click="deleteContact(contact.no)">삭제</button>
                </td>
                // 여기까지
            </tr>
        </tbody>
    </table>
    </div>  
        // 여기부터
        <paginate ref="pagebuttons"
            :page-count="totalpage"
            :page-range="7"
            :margin-pages="3"
            :click-handler="pageChanged"
            :prev-text="'이전'"
            :next-text="'다음'"
            :container-class="'pagination'"
            :page-class="'page-item'">
        </paginate>
        // 여기까지
    </div>
</template>

<script>
import eventBus from '../EventBus';
import Paginate from 'vuejs-paginate';

export default {
    name : 'contactList',
    components : { Paginate },
    props : [ 'contactlist' ],
    computed : {
        totalpage : function() {
            return Math.floor((this.contactlist.totalcount - 1) / this.contactlist.pagesize) + 1;
        }
    },
    watch : {
        ['contactlist.pageno'] : function() {
            this.$refs.pagebuttons.selected = this.contactlist.pageno-1;
        }
    },
    methods : {
        pageChanged : function(page) {
            eventBus.$emit("pageChanged", page);
        },
        addContact : function() {
            eventBus.$emit("addContactForm");
        },
        editContact : function(no) {
            eventBus.$emit("editContactForm", no)
        },
        deleteContact : function(no) {
            if (confirm("정말로 삭제하시겠습니까?") == true) {
                eventBus.$emit('deleteContact', no);
            }
        },
        editPhoto : function(no) {
            eventBus.$emit("editPhoto", no);
        }
    }
}
</script>

<style scoped>
.addnew { margin:10px auto; max-width: 820px;  min-width: 820px;
    padding:40px 0px 0px 0px; text-align: left; }
#example { margin:10px auto; max-width: 820px; min-width: 820px;
    padding:0px; position:relative; font: 13px "verdana"; }
#example .long{ width: 100%; }
#example .short{ width: 50%; }
#example input, textarea, select{ box-sizing: border-box;
    border:1px solid #BEBEBE; padding: 7px; margin:0px;
    outline: none;  }
#list  { width: 800px; font: 13px "verdana";  }
#list thead tr { color:yellow; background-color: purple; }
#list th:nth-child(5n+1), #list td:nth-child(5n+1) { width:200px; }
#list th:nth-child(5n+2), #list td:nth-child(5n+2) { width:150px; }
#list th:nth-child(5n+3), #list td:nth-child(5n+3) { width:250px; }
#list th:nth-child(5n+4), #list td:nth-child(5n+4) { width:60px; }
#list th:nth-child(5n), #list td:nth-child(5n) { width:150px; }
#list th { padding:10px 5px 10px 5px; }
#list tr { border-bottom: solid 1px black; }
#list td, #list th {  text-align:center; vertical-align:middle; }
img.thumbnail { width:48px; height: 48px; margin-top: auto; 
    margin-bottom: auto; display: block; cursor:pointer; }
</style>
```

페이징 기능 제공을 위해 vuejs-paginate 컴포넌트를 사용합니다

`import Paginate from 'vuejs-paginate';`

위와 같이 import한 후 아래와 같이 <paginate> 요소를 사용합니다

```
    <paginate ref="pagebuttons"
        :page-count="totalpage"
        :page-range="7"
        :margin-pages="3"
        :click-handler="pageChanged"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'">
    </paginate>
```

또 한가지 확인할 것은 props 입니다.

자신의 데이터를 가지지 못하고 상위 컴포넌트로부터 props를 통해 전달받은 데이터(contactlist)를 화면에 나타내기만 합니다. 이러한 컴포넌트를 __상태가 없는 컴포넌트(Stateless Component)__ 라고 부릅니다.

자신의 상태가 없기 때문에 __반드시 props를 통해 전달__ 받아야만 합니다.

새로운 연락처 추가하기, 편집, 삭제 부분은 컴포넌트 내부의 이벤트 처리 과정입니다. 하지만 내부에는 데이터가 없으므로 부모 컴포넌트의 데이터를 변경하도록 하기 위해 __이벤트 버스 객체를 통해 $emit을 호출__ 하고 __App.vue에서 $on으로 이벤트를 수신__ 하여 처리하도록 합니다.

computed 속성 -> 전체 페이지 개수를 이용할 수 있도록 합니다.

watched 속성 -> 페이지를 조회하는 중에 새로운 연락처를 추가하면 방금 추가한 연락처를 확인할 수 있도록 첫번째 페이지로 이동할 수 있어야하기 때문에 직접 선택된 페이지 번호를 변경합니다.

method 속성 -> 이벤트 버스 객체를 통해 이벤트를 발신($emit)하고, App.vue에서 이벤트를 수신($on) 해서 App.vue 컴포넌트가 관리하는 데이터 옵션의 값들을 변경합니다.

여기까지의 코드를 실행해보겠습니다. Vue CLI로 생성한 프로젝트는 ESLint 기능에 의해 console 출력을 제한하고 있어, 확인을 위해 `package.json`에 다음 설정을 추가하고 `yarn serve` 명령어를 실행해 줍니다.

```
"rules": {
    "no-console": "off"
}
```

여기까지는 페이징 기능과 삭제 기능은 정상적으로 작동해야 합니다.

### 10.3.4 입력폼, 수정폼 작성

이제 입력폼(AddContact.vue)과 수정폼(UpdateContact.vue) 컴포넌트를 작성해보겠습니다.

이 두 폼은 공통 UI가 있어 ContactForm.vue를 자식 컴포넌트로 참조하도록 합니다.

```
예제 10-21 : src/components/Addcontact.vue
<template>
    <contactForm mode="add" />
</template>

<script>
import ContactForm from './ContactForm.vue';
export default {
    name : "addContact",
    components : { ContactForm }
}
</script>
```

```
예제 10-22 : src/components/UpdateContact.vue
<template>
    <contactForm mode="update" :contact="contact" />
</template>

<script>
import ContactForm from './ContactForm.vue';
export default {
    name : "updateContact",
    components : { ContactForm },
    props : [ 'contact' ]
}
</script>
```

이 두 컴포넌트는 연락처 한 건의 정보를 props를 통해 전달하느냐 전달하지 않느냐의 차이가 있습니다.

UpdateContact.vue 컴포넌트는 예제 10-22의 2행과 같이 App.vue로부터 전달받은 속성을 ContactForm.vue에 다시 전달합니다.

ContactForm.vue는 mode가 'update'인 경우에 contact 속성을 전달받아 화면에 뿌려주고 값을 수정하게 됩니다.

이제 ContactForm.vue를 작성하도록 합니다.

```
// 예제 10-23 : src/components/ContactForm.vue
<template>
<div class="modal">
    <div class="form" @keyup.esc="cancelEvent">
        <h3 class="heading">:: {{headingText}}</h3>
        <div v-if="mode=='update'"  class="form-group">
            <label>일련번호</label>
            <input type="text" name="no" class="long" disabled v-model="contact.no" />
        </div>
        <div class="form-group">
            <label>이름</label>
            <input type="text" name="name" class="long" v-model="contact.name" 
                ref="name" placeholder="이름을 입력하세요" />
        </div>
        <div class="form-group">
            <label>전화번호</label>
            <input type="text" name="tel" class="long" v-model="contact.tel" 
                placeholder="전화번호를 입력하세요" />
        </div>
        <div class="form-group">
            <label>주 소</label>
            <input type="text" name="address" class="long" v-model="contact.address" 
                placeholder="주소를 입력하세요" />
        </div>
        <div class="form-group">
            <div>&nbsp;</div>
            <input type="button" class="btn btn-primary" 
                v-bind:value="btnText" @click="submitEvent()" />
            <input type="button" class="btn btn-primary" 
                value="취 소" @click="cancelEvent()" />
        </div>
    </div>
</div>
</template>

<script>
import eventBus from '../EventBus.js';
export default {
    name : "contactForm",
    props : { 
        mode : { type:String, default:'add' },
        contact : {
            type : Object,
            default : function() {
                return { no:'', name:'', tel:'', address:'', photo:'' }
            }
        }
    },
    mounted : function() {
        this.$refs.name.focus()
    },
    computed : {
        btnText : function() {
            if (this.mode != 'update') return '추 가';
            else return '수 정';
        },
        headingText : function() {
            if (this.mode != 'update') return '새로운 연락처 추가';
            else return '연락처 변경';
        }
    },
    methods : {
        submitEvent : function() {
            if (this.mode == "update") {
                eventBus.$emit("updateSubmit", this.contact)
            } else {
                eventBus.$emit("addSubmit", this.contact);
            }
        },
        cancelEvent : function() {
            eventBus.$emit("cancel");
        }
    }
}
</script>

<style scoped>
.modal { display: block; position: fixed; z-index: 1; 
    left: 0; top: 0; width: 100%; height: 100%;
    overflow: auto; background-color: rgb(0,0,0); 
    background-color: rgba(0,0,0,0.4); }
.form { background-color: white; margin:100px auto;
    max-width: 400px; min-width: 200px; font: 13px "verdana";
    padding: 10px 10px 10px 10px;  }
.form div { padding: 0;  display: block;  margin: 10px 0 0 0; }
.form label{ text-align: left; margin:0 0 3px 0;  padding:0px;
    display:block; font-weight: bold; }
.form input, textarea, select { box-sizing: border-box;
    border:1px solid #BEBEBE; padding: 7px; margin:0px;
    outline: none;  }
.form .long { width: 100%; }
.form .button{ background: #2B798D; padding: 8px 15px 8px 15px;
    border: none; color: #fff; }
.form .button:hover { background: #4691A4; }
.form .heading { background: #33A17F; font-weight: 300;
    text-align: left; padding : 20px; color: #fff;
    margin:5px 0 30px 0; padding: 10px; min-width:200px;
    max-width:400px; }
</style>
```

mode 값에 따라 버튼과 제목이 다르게 나타나야 하기 때문에 computed 속성을 중간에 활용합니다.

method 속성에서는 저장 취소 버튼을 클릭했을때의 처리를 추가했습니다.

이벤트 버스 객체를 통해 App.vue에 이벤트를 알리고 App.vue가 관리하는 데이터를 변경시킵니다.

ContactForm.vue는 모달 폼을 구현하기 위해 이 폼이 보여지고 있는 동안은 연락처 목록이 비활성화되도록 .modal 클래스를 적용하고 있습니다. 이 컴포넌트가 화면에서 사라지면 다시 ContactList.vue 컴포넌트에 의해서 보이는 UI가 활성화될 것입니다.

입력, 수정 폼에서 ESC 키를 눌렀을 때에도 폼이 사라지도록 3행에 `@keyup.esc="cancelEvent"`과 같이 cancelEvent 메서드를 호출하도록 처리했습니다.

### 10.3.5 사진 변경폼 작성

마지막으로 UpdatePhoto.vue 컴포넌트를 작성합니다. 연락처 목록의 섬네일 사진을 클릭하면 현재 사진을 확인하고 사진 파일 업로드하여 변경할 수 있는 폼을 제공합니다.

```
// 예제 10-24 : src/components/UpdatePhoto.vue
<template>
<div class="modal">
    <div class="form" @keyup.esc="cancelEvent">
        <form method="post" enctype="multipart/form-data">
        <h3 class="heading">:: 사진 변경</h3>
        <input type="hidden" name="no" class="long" disabled v-model="contact.no" />
        <div>
            <label>현재 사진</label>
            <img class="thumb" :src="contact.photo" />
        </div>
        <div>
            <label>사진 파일 선택</label>
            <label>
                <input ref="photofile" type="file" name="photo" 
                    class="long btn btn-default" />
            </label>
        </div>
        <div>
            <div>&nbsp;</div>
            <input type="button" class="btn btn-primary" value="변 경" 
                @click="photoSubmit()" />
            <input type="button" class="btn btn-primary" value="취 소" 
                @click="cancelEvent" />
        </div>
        </form>
    </div>
</div>
</template>

<script>
import eventBus from '../EventBus.js';
export default {
    name : "updatePhoto",
    props : [ 'contact' ],
    methods : {
        cancelEvent : function() {
            eventBus.$emit('cancel');
        },
        photoSubmit : function() {
            var file = this.$refs.photofile.files[0];
            eventBus.$emit('updatePhoto', this.contact.no, file);
        }
    }
}
</script>

<style scoped>
.modal { z-index:10; display: block;  position: fixed;  z-index: 1; 
    left: 0; top: 0; width: 100%; height: 100%; overflow: auto; 
    background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);  }
.form { z-index:10;  background-color: white;  margin:100px auto;
    max-width: 400px;  min-width: 200px;  padding: 10px 10px 10px 10px;
    font: 13px "verdana"; }
.form div { padding: 0; display: block; margin: 10px 0 0 0; }
.form label{ text-align: left; margin:0 0 3px 0; padding:0px;
    display:block; font-weight: bold; }
.form input, textarea, select { box-sizing: border-box; 
    border:1px solid #BEBEBE; padding: 7px; margin:0px;
    outline: none;  }
.form .long { width: 100%; }
.form .heading { background: #33A17F; font-weight: 300;
    text-align: left; padding : 20px; color: #fff;
    margin:5px 0 30px 0; padding: 10px; min-width:200px;
    max-width:400px; }
img.thumb { width:160px; } 
</style>
```

UpdateContact.vue와 코드가 유사합니다. 다만 `ref="photofile"` 과 같이 ref 특성을 적용하고 `this.$refs.photofile`와 같이 가상 DOM이 아닌 HTML DOM의 필드를 직접 참조하고 있는 점을 유념해야합니다.

ref 특성을 필드에 지정하고 this.$ref 객체를 통해 접근하는 방법은 꽤 유용합니다.

이 예제에서는 파일 필드값을 얻어내어 이벤트를 발신할 때 인자로 전달하는 방법을 사용하였습니다. 전달된 파일 필드 객체는 App.vue의 updatePhoto 메서드로 전달되어 파일 업로드 시에 사용됩니다.

## 10.4 정리

위 예제에서 사용한 기법을 정리하면 다음과 같습니다.

- 상위 컴포넌트에서 하위 컴포넌트로 데이터를 전달하기 위해 props를 사용합니다.

- 데이터가 위치한 곳에 데이터를 변경하는 메서드를 중앙집중화하여 배치합니다.

- 다른 컴포넌트로 이벤트 정보를 전달하기 위해 이벤트 버스 객체를 사용합니다.

- 동적 컴포넌트를 이용해 <component> 위치에 여러 컴포넌트를 나타낼 수 있도록 합니다.