# Chapter6 - 컴포넌트 기초

## 6.1 - 컴포넌트 조합

- Vue.js는 컴포넌트들을 조합해 전체 애플리케이션을 작성
- 컴포넌트들은 부모 - 자식 관계로 트리 구조를 형성
- 부모 컴포넌트가 자식 컴포넌트를 포함하고 있는 형태이며 `속성(Props)`를 통해 자식 컴포넌트로 정보를 전달 할 수 있다. 전달 방향은 주로 부모 -> 자식으로 향한다.(단방향)
- 양방향으로 데이터를 전달할 수 있지만 애플리케이션의 복잡도가 높아지고 유지보수에 어려움이 있어 권장하지 않는다.
- 자식 컴포넌트에서 부모 컴포넌트로는 이벤트를 발신하여 전달 가능하다.
- 자식 컴포넌트에서 사용자 정의 이벤트를 정의하고 이벤트를 발생시키면 부모 컴포넌트에서 이벤트 핸들러 메서드를 호출하도록 작성한다.
- **속성 전달(부모->자식)과 이벤트 발신(자식->부모) 컴포넌트 간의 상호작용을 일으키는 방법이다.**
- `data, methods, computed, watch`옵션과 같은 대부분의 Vue 인스턴스의 옵션을 컴퓨넌트 수준에서도 사용할 수 있다.
  - data옵션은 각 컴포넌트의 로컬 상태(Local State)를 관리하기 위한 용도로만 사용
  - 하나의 컴포넌트를 애플리케이션에서 여러 번 사용할 경우에는 모두 다른 상태 정보를 가져야 한다.
  - 그렇기때문에 data 옵션은 기존 단순한 객체 값으로 작성하게 되면 모두 동일한 값을 참조하게 된다.
  - 이러한 이유로 `data` 옵션은 반드시 함수로 작성하고 함수 내부에서 객체를 리턴하도록 작성

## 6.2 - 컴포넌트의 작성

- 컴포너트를 작성하는 메서드는 다음과 같다.
``` js
Vue.component(tagname, options)

tagname : 컴포넌트를 사용할 태그명
options : 컴포넌트에서 렌더링할 template 등을 지정
```

- 태그명은 가능하다면 케밥 표기법(kebob casing)을 따르는 것이 좋다. 대소문자를 구별하지 않기 때문에 파스칼 표기법(pascal casing)이나 카멜 표기법(camel casing)은 적절하지 않다.

*예제 06-01~03 - 06-01~03.html*
``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>06-01</title>
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>

<!-- 컴포넌트 작성 부분 -->
<script type="text/javascript">
  Vue.component('hello-component', {
    template : '<div>hello world!!!</div>'
  })
</script>
<!-- //컴포넌트 작성 부분 -->

<body>
  <!-- 컴포넌트 사용 -->
  <div id="app">
    <hello-component></hello-component>
    <hello-component></hello-component>
    <hello-component></hello-component>
  </div>
  <!-- //컴포넌트 사용 -->
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var v = new Vue({
  el : '#app'
})
</script>
</html>
```

- Vue 컴포넌트의 template 옵션에 템플릿 문자열을 사용
- 이와 같은 방식을 인라인 템플릿(inline template)라고 한다.
- 이 방법은 권장되지 않지만 처음 작성하는 예제이므로 사용
- `Vue.config.devtools = true;` 크롬 브라우저에 설치한 Vue devtools를 사용하기 위함이다. 반드신 웹서버를 통해 실행해야만 사용할 수 있다.(live-server 등 사용)
  ``` js
  npm install -g live-sever (windows)
  sudo npm install -g live-sever (mac)
  ```

*인라인 템플릿 대신 `<template>` 사용 06-04.html*

``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>06-04</title>
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<!-- <template> 태그 이용 -->
<template id="helloTemplate">
    <div>hello world!!!</div>
</template>
<script type="text/javascript">
  Vue.component('hello-component', {
    template : '#helloTemplate'
  })
</script>
<!-- //<template> 태그 이용 -->
<body>
  <div id="app">
    <hello-component></hello-component>
    <hello-component></hello-component>
    <hello-component></hello-component>
  </div>
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var v = new Vue({
  el : '#app'
})
</script>
</html>
```

*`<template>` 대신 `<script>` 사용 06-05.html*

``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>06-05</title>
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<script type="text/x-template" id="helloTemplate">
    <div>hello world!!!</div>
</script>
<script type="text/javascript">
  Vue.component('hello-component', {
    template : '#helloTemplate'
  })
</script>
<body>
  <div id="app">
    <hello-component></hello-component>
    <hello-component></hello-component>
    <hello-component></hello-component>
  </div>
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var v = new Vue({
  el : '#app'
})
</script>
</html>
```

## 6.3 - DOM 템플릿 구문 작성 시 주의 사항

- HTML 요소들을 자식 요소로 포함시킬 수 있는 요소들이 정해져 있는 경우가 있고, 이 사항을 브라우저가 구문 분성을 수행한다. 이러한 경우에 Vue 컴포넌트가 사용되면 때때로 오류가 발생하기도 한다.

*06-06.html*
``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>06-06</title>
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<script type="text/javascript">
  Vue.component('option-component', {
    template : '<option>hello</option>'
  })
</script>
<body>
    <div id="app">
        <select>
            <option-component></option-component>
            <option-component></option-component>
        </select>
    </div>
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var v = new Vue({
  el : '#app'
})
</script>
</html>
```
- `<select>` 태그 안에 `<option-component>`라는 태그를 사용할 수 있다라는 것이 브라우저에 등록되어 있지 않다. 브라우저는 이 구문 분석을하는 작업을 먼저 수행한 후 Vue 컴포넌트를 렌더링하기 때문에 정상적으로 작동되지 않는다.
- 이 문제를 해결 하려면 `is`속성을 사용하면 된다.

``` html
<option is="option-component"></option>
<option is="option-component"></option>
```

- `<script>`를 사용한 템플릿이나 확장자가 `.vue`인 단일 파일 컴포넌트(9장)를 사용하는 경우네는 `is`속성을 사용하지 않아도 된다.
- `<template>`태그는 `is` 특성을 사용해야 한다.

*06-08.html*
``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>06-08</title>
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<script type="text/javascript">
  Vue.component('option-component', {
    template : '<option>hello</option>'
  })
</script>
<script type="text/x-template" id="selectTemplate">
   <select>
      <option-component></option-component>
      <option-component></option-component>
   </select>
</script>
<script type="text/javascript">
  Vue.component('select-component', {
    template : '#selectTemplate'
  })
</script>
<body>
<div id="app">
    <select-component></select-component>
</div>
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var v = new Vue({
  el : '#app'
})
</script>
</html>
```

- `<template>`를 사용할때는 루트 요소(root element)는 하나여야 한다. 아래와 같은 경우는 작동하지 않는다.

``` html
<template>
  <div>hello</div>
  <div>world</div>
</template>
```

- 루트 요소 사용시(`div`로 감싼다.)
``` html
<template>
  <div>
    <div>hello</div>
    <div>world</div>
  </div>
</template>
```

## 6.4 - 컴포넌트에서의 data 옵션

- 컴포넌트 내부의 로컬 상태 정보를 저장하기 위해 data 옵션을 사용할 수 있다.
- 하지만 이제까지 작성하듯이  data 옵션에 객체를 직접 지정하면 컴포넌트가 정상적으로 렌더링되지 않는다.

*06-09.html*

``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>06-09</title>
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<template id='timeTemplate'>
    <div>
        <span>{{nowTS}}</span>
        <button v-on:click="timeClick">현재 시간</button>
    </div>
</template>
<script type="text/javascript">
  Vue.component('time-component', {
    template : '#timeTemplate',
    data : { nowTS : 0 },
    methods : {
        timeClick : function(e) {
            this.nowTS = (new Date()).getTime();
        }
    }
  })
</script>
<body>
    <div id="app">
        <time-component></time-component>
        <time-component></time-component>
    </div>
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var v = new Vue({
    el : '#app'
})
</script>
</html>
```

- `time-component`의 data 옵션에 함수가 주어져야 한다. `함수가 호출되어 리턴된 객체가 data옵션에 주어진다.`

*06-10.html*
``` js
<script type="text/javascript">
Vue.component('time-component', {
    template : '#timeTemplate',
    data : function() {
        return { nowTS : 0 };
    },
    methods : {
        timeClick : function(e) {
            this.nowTS = (new Date()).getTime();
        }
    }
})
</script>
```

- **data 옵션에 함수를 지정하는 이유는 동일한 컴포넌트가 여러 번 사용되더라도 동일한 객체를 가리키는 것이 아니라 함수가 호출될 때마다 만들어진 객체가 리턴되기 때문이다.**

- 다음은 data 옵션에 함수를 지정하더라도 모두 동일한 객체를 참조할 수 있는 코드입니다.
**이 방식은 사용하면 안됩니다.**

*06-11.html*
``` html
<script type="text/javascript">
// 전역 변수 설정
var data = { nowTS : 0 };
Vue.component('time-component', {
    template : '#timeTemplate',
    data : function() {
        return data;
    },
    methods : {
        timeClick : function(e) {
            this.nowTS = (new Date()).getTime();
        }
    }
})
</script>
```

- 동일한 컴포넌트를 여러 번 사용하더라도 전역변수 `data`를 참조하므로 모두 동일 한 값을 참조한다.

## 6.5 - props와 event

- 참조 : [props와 event - vuejs.org 링크](https://kr.vuejs.org/v2/guide/components.html#%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%EC%9E%91%EC%84%B1)
- Vue 컴포넌트들은 부모-자식 관계가 형성되었을 때 각 컴포넌트 내부의 데이터는 캡슐화되기 때문에 다른 컴포넌트나 앱에서 접근할 수 없다.
- 따라서 부모 컴포넌트에서 자식 컴포넌트로 필요한 정보를 전달하기 위해서는 속성(props)을 이용
- **부모에서 자식으로 단방향으로만 전달**
- 반대로는 자식->부모 컴포넌트로의 전달은 **이벤트**를 이용
- `v-on` 디렉티브 이용
- 자식 컴포넌트에서 사용자 정의 이벤트를 필요한 정보와 함께 발신(`emit`)하면 부모 컴포넌트에서 `v-on`디렉티브를 이용해 이벤트를 처리한다.

### 6.5.1 - props를 이용한 정보 전달

- Vue 컴포넌트를 정의할 때 `props`라는 옵션을 작서앟고 `props`명을 `배열`로 나열한다.

*06-12.html*
``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>06-12</title>
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<template id="listTemplate">
    <li>{{message}}</li>
</template>
<script type="text/javascript">
Vue.component('list-component', {
    template : '#listTemplate',
    props : [ 'message' ]
})
</script>
<body>
<div id="app">
    <ul>
        <list-component message="Hello"></list-component>
        <list-component message="씬짜오"></list-component>
        <list-component message="니하오마"></list-component>
    </ul>
</div>
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var vm = new Vue({
    el : "#app"
})
</script>
</html>
```

- `list-component`컴포넌트를 작성하면서 `message`라는 이름의 속성을 정의했다.
- 이 속성을 통해서 `<template></template>`을 통해 출력된다.
- 속성을 통해 정보를 전달하기 위해서는 `<list-component></list-component>`에 특성(Attribute)처럼 전달한다.
- `vue devtools` 실행 후 확인, `live-server`로 실행
- 속성명을 작성할때는 대소문자를 구분하지 않으므로 케밥 표기법(kebob casing) 사용

*06-13.html*
``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>06-13</title>
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<template id="listTemplate">
    <li>{{myMessage}}</li>
</template>
<script type="text/javascript">
Vue.component('list-component', {
    template : '#listTemplate',
    props : [ 'myMessage' ]
})
</script>
<body>
<div id="app">
    <ul>
        <list-component myMessage="Hello"></list-component>
        <list-component myMessage="씬짜오"></list-component>
        <list-component myMessage="니하오마"></list-component>
    </ul>
</div>
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var vm = new Vue({
    el : "#app"
})
</script>
</html>
```

- 속성명을 카멜 표기법으로 작성하면 렌더링 되지 않는다.
- 아래와 같이 `myMessage`를 `my-message`로 수정해야 정상적으로 렌더링 된다.

``` html
<div id="app">
    <ul>
        <list-component my-message="Hello"></list-component>
        <list-component my-message="씬짜오"></list-component>
        <list-component my-message="니하오마"></list-component>
    </ul>
</div>
```

- 속성을 정의할 때 배열 형태로 나열하나 유효성 검증이 필요하다면 객체 형태로 사용할 수 있다.

**06-14~15.html**
``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>06-14~15</title>
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<template id="listTemplate">
    <li>{{message}}</li>
</template>
<script type="text/javascript">
Vue.component('list-component', {
    template : '#listTemplate',
    props : {
        message : {
          type:String,
          default:'안녕하세요'
        },
        count : {
          type:Number,
          required:true
        }
    }
})
</script>
<body>
<div id="app">
    <ul>
        <list-component message="문자열" count="100"></list-component>
        <list-component message="Hello" v-bind:count="100"></list-component>
        <list-component message="씬짜오" :count="21"></list-component>
        <list-component message="니하오마"></list-component>
        <list-component v-bind:count="1000"></list-component>
    </ul>
</div>
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var vm = new Vue({
    el : "#app"
})
</script>
</html>
```

- `message, count` 2개의 속성 정의
- `type : 타입정의, required : 필수 유무, default : 기본값 정의`의 속성 정의
- 1번째 컴포넌트의 `count`는 숫자형인데 개발자도구로 보면 문자형으로 되어 있다. 원인은 리터럴로 속성을 전달했기 때문이다. 이 문제를 해결하기 위해서는 `v-bind` 디렉티브를 사용
- `count` 속성이 필수 입력 사항이지만 아예 전달하지 않으면 렌더링에는 문제가 되지 않는다.
- 하지만 `:count="world"`와 같이 작성하는 경우 `world`를 변수명으로 간주하여 문제가 생긴다.

- 속성으로 배열, 객체를 전달할 경우 `default`값을 부여하려면 반드시 함수를 사용해야 한다.
- data 옵션을 부여할 때 함수의 리턴값으로 부여했던 것과 같은 맥락으로 생각하면 된다.

*06-16.html*
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
  <title>06-16</title>
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<template id="listTemplate">
  <li>{{message}}</li>
</template>
<script type="text/javascript">
Vue.component('list-component', {
    template : '#listTemplate',
    props : {
        message : { type:String, default:'안녕하세요' },
        count : { type:Number, required:true },
        countries : {
            type:Array,
            default: function() {
                return ['대한민국'];
            }
        }
    }
})
</script>
<body>
  <div id="app">
    <ul>
      <list-component message="Hello" v-bind:count="100"
            v-bind:countries="['미국', '영국', '호주']"></list-component>
        <list-component message="씬짜오" :count="21"
            :countries="['베트남']"></list-component>
        <list-component message="니하오마"
            :countries="['중국', '타이완']"></list-component>
        <list-component v-bind:count="1000"></list-component>
    </ul>
</div>
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var vm = new Vue({
    el : "#app"
})
</script>
</html>
```

- 또한 속성값을 전달할때는 `v:bind`를 사용

*06-17.html*
``` html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>06-17</title>
    <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<style>
#list  { width: 400px; border:1px solid black; border-collapse:collapse; }
#list td, #list th { border:1px solid black;  text-align:center; }
#list > thead > tr { color:yellow; background-color: purple; }
</style>
<template id="listTemplate">
    <div>
    <table id="list">
        <thead>
            <tr>
                <th>번호</th><th>이름</th><th>전화번호</th><th>주소</th>
            </tr>
        </thead>
        <tbody id="contacts" >
            <tr v-for="contact in contacts">
                <td>{{contact.no}}</td>
                <td>{{contact.name}}</td>
                <td>{{contact.tel}}</td>
                <td>{{contact.address}}</td>
            </tr>
        </tbody>
    </table>
    </div>
</template>
<script type="text/javascript">
Vue.component('contactlist-component', {
    template : '#listTemplate',
    props : [ 'contacts' ]
})
</script>
<body>
    <div id="app">
        <h1>예방 접종</h1>
        <hr />
        <h3>1차 대상자 : 5월 1~3일</h3>
        <contactlist-component :contacts="list1"></contactlist-component>
        <h3>2차 대상자 : 5월 13~15일</h3>
        <contactlist-component :contacts="list2"></contactlist-component>
    </div>
</body>
<script type="text/javascript">
Vue.config.devtools = true
var vm = new Vue({
    el : "#app",
    data : {
        list1 : [
            {"no":97,"name":"Kalisa Rogers","tel":"010-3456-8296","address":"서울시" },
            {"no":96,"name":"Jesse James","tel":"010-3456-8295","address":"서울시" },
            {"no":95,"name":"Jennifer Walker","tel":"010-3456-8294","address":"서울시" }
        ],
        list2 : [
            {"no":82,"name":"Zenon Howard","tel":"010-3456-8281","address":"서울시"},
            {"no":81,"name":"Kylie Allen","tel":"010-3456-8280","address":"서울시"}
        ]
    }
})

</script>
</html>
```

- `contactlist-component`를 정의할때 `contact`라는 이름의 속성을 정의했다.
- `<contactlist-component></contactlist-component>`를 사용할때 `v-bind`를 이용해 각각 `list1`,`list2` 배열 데이터를 전달
- 전달받은 배열 데이터를 이용해 `v-for`를 활용해 반복하면 렌더링한다.
- 이 예제를 통해 알 수 있듯이 컴포넌트를 잘 만들고 활용하면 반복되는 코드를 줄이고 재사용성을 크게 높일 수 있다.

### 6.5.2 - event를 이용한 정보 전달

- `event`를 이용해서 전달하는 방법은 사용자 정의 이벤트를 활용 한다.
- 자식 컴포넌트에서는 이벤트를 발신(`emit`)하고 부모 컴포넌트에서 `v-on` 디렉티브를 이용해 이벤트를 수신한다.

*06-18.html*
``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>06-18</title>
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<!-- child Component 시작 -->
<style>
    .buttonstyle { width:120px; height:30px; text-align: center; }
</style>
<template id="childTemplate">
    <div>
        <!-- 1. 버튼 클릭 -->
        <button class="buttonstyle" v-on:click="clickEvent"
            v-bind:data-lang="buttonInfo.value">{{ buttonInfo.text }}</button>
    </div>
</template>
<script type="text/javascript">
Vue.component('child-component', {
    template : '#childTemplate',
    props : [ 'buttonInfo' ],
    methods : {
        clickEvent : function(e) {
            // 2. 부모컴포넌트(parent Component) 한테 이벤트 emit(발신)
            this.$emit('timeclick', e.target.innerText, e.target.dataset.lang);
        }
    }
})
</script>
<!-- child Component 끝 -->
<!-- parent Component 시작 -->
<template id="parent-template">
    <div>
      <!-- 3. v-on 디렉티브 이용해 이벤트 수신 -->
        <child-component v-for="s in buttons" v-bind:button-info="s"
            v-on:timeclick="timeclickEvent">
        </child-component>
        <hr />
        <div>{{ msg }}</div>
    </div>
</template>
<script type="text/javascript">
Vue.component('parent-component', {
    template : '#parent-template',
    props : [ 'buttons' ],
    data : function() {
        return { msg:"" };
    },
    methods : {
        // 4. 이벤트 발생
        timeclickEvent : function(k, v) {
            this.msg = k + ", " +v;
        }
    }
})
</script>
<!-- parent Component 끝 -->
<body>
    <div id="app">
        <parent-component :buttons="buttons"></parent-component>
    </div>
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var vm = new Vue({
    el : "#app",
    data : {
        buttons : [
            { text : "Hello", value : "영어" },
            { text : "씬짜오", value : "베트남어" },
            { text : "니하오", value : "중국어" }
        ]
    }
})
</script>
</html>
```

- `this.$emit('timeclick', e.target.innerText, e.target.dataset.lang);`
- 1번째 이벤트명, 2,3번째는 인자로 넘길 값을 넣는다. 필요 없으면 정의하지 않아도 된다.

### 6.5.3 - props와 event 예제

- `search-contact-componet` 부모
- `search-component`,`contactlist-component` 자식들
  1. `search-component`에서 `keyup` 이벤트 발생
  2. `search-contact-component`(부모)로 이벤트 발신
      - 이때 텍스트 박스에 입력된 문자열을 인자로 담아 부모한테 전달
  3. 전달받은 데이터로 연락처 API에 요청하여 연락처 목록 받음
  4. 받아온 연락처 목록은 `search-contact-component`부모의 내부 상태로서 `contactlist` 데이터 옵션에 저장
  5. `contacts`속성을 통해 `contactlist-component`로 전달

*06-23.html*
``` html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>06-23</title>
<script src="https://unpkg.com/vue/dist/vue.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.1/es6-promise.auto.min.js"></script>
</head>
<!-- contactlist-component 시작 -->
<style>
#list  { width: 400px; border:1px solid black; border-collapse:collapse; }
#list td, #list th { border:1px solid black;  text-align:center; }
#list > thead > tr { color:yellow; background-color: purple; }
</style>
<template id="listTemplate">
    <div>
    <table id="list">
        <thead>
            <tr>
                <th>번호</th><th>이름</th><th>전화번호</th><th>주소</th>
            </tr>
        </thead>
        <tbody id="contacts" >
            <tr v-for="contact in contacts">
                <td>{{contact.no}}</td>
                <td>{{contact.name}}</td>
                <td>{{contact.tel}}</td>
                <td>{{contact.address}}</td>
            </tr>
        </tbody>
    </table>
    </div>
</template>
<script type="text/javascript">
Vue.component('contactlist-component', {
    template : '#listTemplate',
    props : [ 'contacts' ]
})
</script>
<!-- contactlist-component 끝 -->
<!-- search-component 시작 -->
<template id="searchTemplate">
    <p>
        이름 : <input type="text" v-model.trim="name" :placeholder="placeholder"
                @keyup.enter="keyupEvent" />
    </p>
</template>
<script type="text/javascript">
Vue.component('search-component', {
    template : '#searchTemplate',
    props : [ 'placeholder' ],
    data : function() {
        return { name: ''};
    },
    methods : {
        keyupEvent : function(e) {
            var val = e.target.value;
            if (val.length >= 2) {
                this.$emit('search', val);
            } else {
                this.$emit('search', '');
            }
        }
    }
})
</script>
<!-- search-component 끝 -->
<!-- searchcontact-component 시작 -->
<template id="searchcontactTemplate">
    <div>
        <search-component placeholder="두글자 이상 입력후 엔터!" v-on:search="searchEvent"></search-component>
        <contactlist-component v-bind:contacts="contactlist"></contactlist-component>
        <div v-show="isProcessing === true">조회중</div>
    </div>
</template>
<script type="text/javascript">
Vue.component('search-contact-component', {
    template : '#searchcontactTemplate',
    data : function() {
        return {
            contactlist : [],
            isProcessing : false
        }
    },
    methods : {
        searchEvent : function(name) {
            if (name == '')
                this.contactlist = [];
            else
                this.fetchContacts(name);
        },
        fetchContacts : _.debounce(function(name) {
            this.contactlist = [];
            this.isProcessing = true;
            var url = "http://sample.bmaster.kro.kr/contacts_long/search/" + name;
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
})
</script>
<!-- searchcontact-component 끝 -->
<body>
    <div id="app">
        <search-contact-component></search-contact-component>
    </div>
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var vm = new Vue({
    el : "#app"
})
</script>
</html>
```

- `contactlist-component`는 자체 상태를(데이터 옵션)을 가지고 있지 않습니다. 외부에서 상태를 제공받아야 되므로 props를 통해 제공받는다.
- `search-component`는 `search`이벤트를 발신한다. (`this.$emit('search', val);`)
- `searchcontact-component`는 `searchEvent` 메서드를 실행
- `vue devtool`을 통해 이벤트 발신(`emit`) 확인 가능

## 6.6 - 이벤트 버스 객체를 이용한 통신

- 부모-자식 관계는 `props`,`events`를 사용하면 된다.
- 부모-자식 관계가 아닌 경우에는 이벤트 버스(`event bus`) 객체를 만들어 사용한다.
- 비어있는 Vue인스턴스를 만들고 데이터를 저장할 필요가 있다면 데이터 옵션을 추가할 수 있다.
- `child1-component`, `child2-component`는 서로 형제이므로 `event bus`객체를 통해 통신한다.
- 이벤트를 수신하는 컴포넌트는 미리 이벤트 핸들러를 등록해야 한다.
- Vue 인스턴스 생명주기의 created 이벤트 훅을 이용하여 Vue 인스턴스가 만들어질 때 $on 메서드를 사용해 이벤트 수신 정보를 동록한다.

*06-24.html*

``` html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>06-24</title>
    <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<!-- 이벤트 버스 객체 -->
<script type="text/javascript">
var eventBus = new Vue();
</script>
<!-- 첫번째 자식 컴포넌트 시작-->
<template id="chidl1Template">
    <div>
        <button v-on:click="clickEvent">child1 button!!</button>
        <div>{{currentTime}}</div>
    </div>
</template>
<script type="text/javascript">
Vue.component('child1-component', {
    template : '#chidl1Template',
    data : function() {
        return { currentTime : '' };
    },
    methods : {
        clickEvent : function() {
            var d = new Date();
            var t = d.toLocaleTimeString() + " " + d.getMilliseconds() + "ms";
            // 이벤트 호출
            eventBus.$emit('click1', t);
            this.currentTime = t;
        }
    }
});
</script>
<!-- 첫번째 자식 컴포넌트 끝-->
<!-- 두번째 자식 컴포넌트 시작-->
<template id="chidl2Template">
    <ul>
        <li v-for="t in timelist">{{t}}</li>
    </ul>
</template>
<script type="text/javascript">
Vue.component('child2-component', {
    template : '#chidl2Template',
    data : function() {
        return {
            timelist : []
        };
    },
    // 이벤트 수신
    created : function() {
        eventBus.$on('click1', this.child1Click);
    },
    methods : {
        child1Click : function(time) {
            this.timelist.push(time);
        }
    }
});
</script>
<!-- 두번째 자식 컴포넌트 끝-->
<body>
    <div id="app">
        <child1-component></child1-component>
        <hr />
        <child2-component></child2-component>
    </div>
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var vm = new Vue({
    el : "#app"
})
</script>
</html>
```

- `child1-component`의 버튼을 클릭하면 `clickEvent` 호출
- 이벤트 버스 객체의 `$emit` 메서드를 이용해 이벤트 발신
- `child2-component`의 `created` 이벤트훅에서 `$on` 메서드를 이용해 이벤트 수신을 위한 바인딩을 수행한다.
- `click1`이 수신되면 `child1Click` 메서드가 호출되어 시간정보를 인자로 전달받아 로컬 상태인 `timelist` 데이터 옵션에 추가

### todolist

*06-28.html*
``` html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>06-28</title>
    <!-- 공용 스타일 시작-->
    <style>
    * {  box-sizing: border-box;  }
    .header {
        background-color: purple; padding: 30px 30px;
        color: yellow; text-align: center;
    }
    .header:after {
        content: ""; display: table; clear: both;
    }
    </style>
    <!-- 공용 스타일 끝-->
    <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<!--이벤트 버스 객체 시작-->
<script type="text/javascript">
var eventBus = new Vue();
</script>
<!--이벤트 버스 객체 끝-->
<!-- input-component 시작-->
<style>
.input {
    border: none; width: 75%; height:35px; padding: 10px;
    float: left; font-size: 16px;
}
.addbutton {
    padding: 10px; width: 25%; height:35px; background: #d9d9d9;
    color: #555; float: left; text-align: center;
    font-size: 13px; cursor: pointer; transition: 0.3s;
}
.addbutton:hover { background-color: #bbb; }
</style>
<template id="input-template">
    <div>
        <input class="input" type="text" id="task" v-model.trim="todo"
            placeholder="입력 후 엔터!" v-on:keyup.enter="addTodo">
        <span class="addbutton" v-on:click="addTodo">추 가</span>
    </div>
</template>
<script type="text/javascript">
Vue.component('input-component', {
    template : '#input-template',
    data : function() {
        return { todo : "" }
    },
    methods : {
        addTodo : function() {
            eventBus.$emit('add-todo', this.todo);
            this.todo = "";
        }
    }
})
</script>
<!-- input-component 끝-->
<!-- list-component 시작-->
<style>
ul {  margin: 0; padding: 0; }
ul li {
    cursor: pointer; position: relative; padding: 8px 8px 8px 40px;
    background: #eee; font-size: 14px;  transition: 0.2s;
    -webkit-user-select: none; -moz-user-select: none;
    -ms-user-select: none; user-select: none;
}
ul li:hover {  background: #ddd;  }
ul li.checked {
    background: #BBB;  color: #fff; text-decoration: line-through;
}
ul li.checked::before {
    content: ''; position: absolute; border-color: #fff;
    border-style: solid; border-width: 0px 1px 1px 0px;
    top: 10px; left: 16px;  transform: rotate(45deg);
    height: 8px; width: 8px;
}
.close {
    position: absolute; right: 0; top: 0;
    padding: 8px 12px 8px 12px
}
.close:hover {
    background-color: #f44336;  color: white;
}
</style>
<template id="list-template">
    <ul id="todolist">
        <li v-for="(a, index) in todolist" v-bind:class="checked(a.done)"
            v-on:click="doneToggle(index)">
            <span>{{ a.todo }}</span>
            <span v-if="a.done"> (완료)</span>
            <span class="close" v-on:click.stop="deleteTodo(index)">&#x00D7;</span>
        </li>
    </ul>
</template>
<script type="text/javascript">
Vue.component('list-component', {
    template : '#list-template',
    created : function() {
         eventBus.$on('add-todo', this.addTodo);
    },
    data : function() {
        return {
            todolist : [
                { todo : "영화보기", done:false },
                { todo : "주말 산책", done:true },
                { todo : "ES6 학습", done:false },
                { todo : "잠실 야구장", done:false },
            ]
        }
    },
    methods : {
        checked : function(done) {
            if(done) return { checked:true };
            else return { checked:false };
        },
        addTodo : function(todo) {
            if (todo !== "") {
                this.todolist.push({ todo : todo, done:false });
            }
        },
        doneToggle : function(index) {
            this.todolist[index].done = !this.todolist[index].done;
        },
        deleteTodo : function(index) {
            this.todolist.splice(index,1);
        }
    }
})
</script>
<!-- list-component 끝-->
<body>
    <div id="todolistapp">
        <div id="header" class="header">
            <h2>Todo List App</h2>
            <input-component></input-component>
        </div>
        <list-component></list-component>
    </div>
</body>
<script type="text/javascript">
Vue.config.devtools = true;
var vm = new Vue({
    el : "#todolistapp"
})
</script>
</html>
```

- 값을 입력하고 추가 버튼을 클릭하는 부분(`input-component`)
- Todolist를 나타내는 부분(`list-component`)
- 할 일을 추가하면 이벤트 객체를 이용해 데이터를 추가하고 그 데이터는 다시 `list-component`를 통해 나타나야 한다.
  1. 이벤트 버스 객체 생성(`var eventBus = new Vue();)`
  2. `list-component`에서 `$on`를 사용해 `add-todo`이벤트를 이벤트 버스 객체에 바인딩하여 `this.addTodo`를 호출하게 한다.
  3. `input-component`에서 이벤트가 발생하여 `addTodo`가 호출되어 `$emit`통해 이벤트 버스 객체에 발신한다.
