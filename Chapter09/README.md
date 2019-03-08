# Chapter9 - 단일 파일 컴포넌트

## 9.1 - 컴포넌트 조합

- 단일 파일 컴포넌트( Single File Component ) 는 전역 수준 컴포넌트의 몇 가지 문제점을 해결합니다.

  - 빌드 단계가 없으므로 최신 자바스크립트(ECMAScript 2015, TypeScript) 문법 사용 불가합니다.
  - 컴포넌트들은 고유한 스타일 정보를 포함하는 경우가 많은데 전역 컴포넌트에서는 CSS 스타일을 빌드하고 모듈화 할 수 없습니다.
  - 컴포넌트의 템플릿이 작성될 때 HTML 파일 안에 여러 개의 `<Template />` 태그가 작성되어 식별하기 
    어렵고 템플릿마다 고유한 id를 부여하고 컴포넌트들도 고유한 이름을 지정해야 합니다. 
    **쉽게 말해서 가독성이 떨어지고 번거롭다.**
- Vue CLI 를 이용해 생성한 프로젝트 코드는 [vue-loader](https://vue-loader-v14.vuejs.org/kr/) 라는 npm 패키지를 이용해 단일 파일 컴포넌트를 지원합니다.
  > Vue-CLI는 에반 유가 공식적으로 관리하는 커맨드라인 인터페이스 기반의 스캐폴딩 도구 이다. 특히, Vue.js 앱을 개발할 때 프로젝트의 폴더 구조를 어떻게 잡을 것인지, 테스트, 빌드, 의존성 부분은 어떻게 설정할 것인지에 대한 고민을 하지 않도록 프로젝트의 기본 템플릿을 설정해주는 도구이다.
  - vue-laoder : Vue 컴포넌트를 일반적인 자바스크립트 모듈로 변환할 수 있는 webpack에서 사용하는 로더입니다.
  - 기본적으로 ES2015를 지원합니다.
  - 확장자가 .vue 인 파일에  `<Template />, <script />, <style />`을 작성하면 vue-loader는 이 파일을 파싱하고 다른 로더들을 활용해 하나의 모듈로 조합합니다. 특히 css-loader를 이용해 CSS 스타일을
    전처리 할 수 있으며, 스타일 정보를 모듈화할 수도 있습니다. 
  - 기본골격은 `<Template />, <script />, <style />` 로 나눠진다.

![](http://lasertank3.cafe24.com/vuestudy/1.png)

1. 전역 컴포넌트와 비교시  `<Template>` 에는 id 특성을 부여하지 않는다

2. `<script>`영역에서는 Vue 컴포넌트의 template을 지정하지 않는 반면 name 속성을 지정할 수 있으며, 
   반드시 객체를 export 해야 합니다.

3. 사용할 스타일은 내부에서 작성하며, 다른 컴포넌트를 참조하여 사용할 경우 import 문을 이용합니다.

   

   

![](http://lasertank3.cafe24.com/vuestudy/2.png)

```
main.js 

import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

책에 나온 todolist 프로젝트를 기준으로 main.js 는 App.vue 컴포넌트를 import 하여 public/index.html 에 id가 app 인 엘리먼트 안으로 App.vue 컴포넌트를 추가시켜서 화면에 노출시키는 방식입니다.



쉽게 말해서 components -> parent-component( App.vue ) -> main.js -> public/index.html 의 과정을 거쳐서

컴포넌트가 조합된 화면을 노출시킵니다.



------

inputTodo.vue

```
<style>
* {
    box-sizing: border-box
}

.input {
    border: none;
    width: 75%;
    height: 35px;
    padding: 10px;
    float: left;
    font-size: 16px;
}

.addbutton {
    padding: 10px;
    width: 25%;
    height: 35px;
    background: #d9d9d9;
    color: #555;
    float: left;
    text-align: center;
    font-size: 13px;
    cursor: pointer;
    transition: .3s;
}

.addbutton:hover {
    background-color: #bbb
}
</style>

<template>
    <div>
        <input class="input" type="text" id="task" v-model.trim="todo" aria-placeholder="입력 후 엔터!" v-on:click="addTodo">
        <span class="addbutton" v-on:click="addTodo">추 가</span>
    </div>
</template>

<script type="text/javascript">
import eventBus from '../EventBus'

export default {
    name: 'input-todo',
    data: function() {
        return { todo: "" }
    },
    methods: {
        addTodo: function() {
            eventBus.$emit('add-todo', this.todo)
            this.todo = "";
        }
    }
}
</script>
```

- inputTodo 에서는 input 데이터 입력 관련 작업을 수행하고 eventBus 를 등록하여, List 에 데이터를 추가하게 만들어줍니다.

------

List.vue

```
<style>
ul {
    margin: 0;
    padding: 0;
}

ul li {
    cursor: pointer;
    position: relative;
    padding: 8px 8px 8px 40px;
    background: #eee;
    font-size: 14px;
    transition: 0.2s;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

ul li:hover {
    background: #ddd;
}

ul li.checked {
    background: #BBB;
    color: #fff;
    text-decoration: line-through;
}

ul li.checked::before {
    content: '';
    position: absolute;
    border-color: #fff;
    border-style: solid;
    border-width: 0px 1px 1px 0px;
    top: 10px;
    left: 16px;
    transform: rotate(45deg);
    height: 8px;
    width: 8px;
}

.close {
    position: absolute;
    right: 0;
    top: 0;
    padding: 12px 16px 12px 16px
}

.close:hover {
    background-color: #f44336;
    color: white;
}
</style>

<template>
    <ul id="todolist">
        <li v-for="a in todolist" :key="a.id" :class="checked(a.done)" 
        @click="doneToggle(a.id)">
            <span>{{ a.todo }}</span>
            <span v-if="a.done"> (완료)</span>
            <span class="close" v-on:click.stop="deleteTodo(a.id)">&#x00D7;</span>
        </li>
    </ul>
</template>

<script type="text/javascript">
    import eventBus from '../EventBus'

    export default {
        created : function() {
            eventBus.$on('add-todo', this.addTodo)
        },
        data: function() {
            return {
                todolist: [{
                    id:1,
                    todo: "영화보기",
                    done: false
                }, {
                    id:2,
                    todo: "주말 산책",
                    done: true
                }, {
                    id:3,
                    todo: "ES6 학습",
                    done: false
                }, {
                    id:4,
                    todo: "잠실 야구장",
                    done: false
                }, ]
            }
        },
        methods: {
            checked: function(done) {
                if (done) return {
                    checked: true
                };
                else return {
                    checked: false
                };
            },
            addTodo: function(todo) {
                if (todo !== "") {
                    this.todolist.push({
                        id:new Date().getTime(), todo:todo, done:false
                    });
                }
            },
            doneToggle: function(index) {
                var index = this.todolist.findIndex((item)=>item.id ==id);
                this.todolist[index].done = !this.todolist[index].done;
            },
            deleteTodo: function(index) {
                var index = this.todolist.findIndex((item)=>item.id ==id);
                this.todolist.splice(index, 1)
            }
        }
    }
</script>
```

- List 에서는 처음에 등록된 리스트를 화면에 보여주고, 상태 관리와 리스트 삭제 그리고 eventBus 를 감시하여

  inputTodo 액션에 따라 리스트를 추가해주는 작업을 합니다.

------

TodoList.vue

```
<style>
* {
    box-sizing: border-box
}

.header {
    background-color: purple;
    padding: 30px;
    color: yellow;
    text-align: center;
}

.header:after {
    content: "";
    display: table;
    clear: both;
}
</style>

<template>
    <div id="todolistapp">
        <div id="header" class="header">
            <h2>Todo List App</h2>
            <input-todo></input-todo>
        </div>
        <list></list>
    </div>
</template>

<script type="text/javascript">
import InputTodo from './InputTodo.vue'
import List from './List.vue'

export default {
    name: 'todo-list',
    components: { InputTodo, List }
}
</script>
```

- TodoList 에서는 InputTodo, List 컴포넌트를 조합하고, main.js 에서 import 하여 화면에 랜더링을 합니다.

  
  

## 9.2 - 컴포넌트에서의 스타일

- 컴포넌트의 스타일은 `<style>` 태그 내에 작성하지만, 다른 컴포넌트에서 동일한 CSS 클래스명을 사용할 경우 충돌이 발생하여 마지막에 선언된 클래스가 적용됩니다.
- 이를 방지하기 위해서 범위 CSS ( Scoped CSS ) 와 CSS 모듈( CSS Module )의 두가지 방법을 사용합니다.



### [9.2.1 범위 CSS ( Scoped CSS )](https://vue-loader-v14.vuejs.org/kr/features/scoped-css.html)

------

ex) 다른 컴포넌트에서 같은 클래스 네임을 사용했을 경우

![](http://lasertank3.cafe24.com/vuestudy/3.png)

위와 같은 오류를 방지하기 위해  `<style>`태그에 scoped 를 추가해줍니다.

![](http://lasertank3.cafe24.com/vuestudy/4.png)

- style 에 scoped 를 추가시 요소검사로 확인해보면 클래스 이름이 중복방지를 위해 변경된 것을 확인할 수 있으며, 추가적으로 범위 CSS를 사용할 때 몇가지 주의사항이 있습니다.

1. 범위 CSS 는 특성 선택자( Attribute Selector ) 를 사용하기 때문에 브라우저에서 스타일을 적용하는 속도가 느리므로 반드시 속도가 빠른 ID 선택자, 클래스 선택자, 태그명 선택자로 요소를 선택해 스타일을 적용해야합니다.

2. 부모 컴포넌트에 적용된 범위 CSS ( Scoped CSS ) 는 하위 컴포넌트에도 반영됩니다.

   

### 9.2.2 CSS 모듈 ( CSS Module )

------

- CSS 모듈은 CSS 스타일을 마치 객체처럼 다룰 수 있으며, 설정 방법은 `<style module></style>` 로 사용할 수 있습니다.

- 이 스타일은 Vue 인스턴스 내에서 `$style ` 이라는 계산형 속성( Computed Property ) 을 통해서 이용할 수 있습니다.



**범위 CSS와 CSS 모듈 두 방식 모두 적용의 범위를 지정한다는 것이 같아 보일 수 있겠지만 두개의 차이점은 책에 나와있지 않아서 구글링 결과 쉽게 말해서 상속에 있다고 찾았습니다.**

**범위 CSS 는 위에서도 언급했듯이 마크업 방식에 따라 자식 컴포넌트까지 영향을 줄 가능성이 있는 반면 CSS 모듈은 해당 컴포넌트만 적용되는 것이 차이점이나 두 방식 모두 상황에 따라서 어떤 방식이 더 효율적일지는 다를 수 있기에 어떤 것이 낫다 라고 말하긴 어려울 것 같습니다.**



## 9.3 슬롯

- props 는 편리한 기능이긴 하지만 속성으로 전달해야 하는 정보가 HTML 태그가 포함된 문자열이라면 사용하기 어렵지만 슬롯을 이용하면 부모 컴포넌트에서 자식 컴포넌트로 HTML 마크업을 전달할 수 있습니다.



### 9.3.1 슬롯의 기본 사용법

------

- 자식 컴포넌트에서는 `<slot></slot>` 태그를 작성하고 부모 컴포넌트에서는 콘텐츠 영역에 자식 컴포넌트의 `<slot></slot>` 영역에 나타낼 HTML 마크업을 작성하면 됩니다.

![](http://lasertank3.cafe24.com/vuestudy/5.png)

![](http://lasertank3.cafe24.com/vuestudy/6.png)

- 부모에서 자식에게 데이터를 전달하는 방법은 슬롯 외에도 속성으로 전달할 수도 있지만 아래와 같은 단점이 존재합니다.
  - HTML 마크업을 전달하기 어려움
  - CSS 클래스가 있을 경우 속성을 통해서 하나씩 전달하기 위해 자식 컴포넌트에 많은 수의 속성을 정의해야함 -> **유동적으로 사용하기 어려움**

![](http://lasertank3.cafe24.com/vuestudy/7.png)



### 9.3.2 명명된 슬롯

------

- 이름을 부여한 슬롯인 명명된 슬롯( named slot ) 을 사용하면 컴포넌트에 여러 개의 슬롯을 작성할 수 있습니다.

![](http://lasertank3.cafe24.com/vuestudy/8.png)

- 직접 만들어보면 그림대로 매칭이 이뤄짐을 알 수있습니다.



### 9.3.3 범위 슬롯

------

- 보통 부모 컴포넌트에서 자식 컴포넌트로 정보를 전달하지만, 간혹 자식 컴포넌트에서 부모로 속성을 전달하여 부모 컴포넌트 측에서 출력할 내용을 커스터마이징 할 필요가 있는데 이럴 경우 사용하는 것이 범위 슬롯( Soped Slot )입니다.

![](http://lasertank3.cafe24.com/vuestudy/9.png)

- 자식에서 가지고 있는 `Input` 의 값이 변경될 때마다 부모 컴포넌트로 값을 전달합니다.

  자식은 부모에게 cx, cy 라는 이름의 속성으로 전달하고 부모는 자식에게 p1,p2 라는 이름으로 속성을 전달받고 전달받은 p1, p2는 해당 템플릿 안에서만 사용할 수 있습니다.

  그래서 이를 **범위 슬롯** 이라고 합니다.
  
    

## 9.4  동적 컴포넌트

- 화면의 동일한 위치에 여러 컴포넌트를 표현해야 하는 경우 사용하는 것이 동적 컴포넌트 입니다.
  방법은 컴포넌트 요소를 템플릿에 작성하고 v-bind 디렉티브를 이용해 is 특성 값으로 어떤 컴포넌트를
  그 위치에 나타낼지 결정하면 됩니다.

- 동적 컴포넌트의 동작 원리는 https://seulcode.tistory.com/262 여기에 잘 나와있으며, 간단하게 설명하자면
  컴포넌트를 변경 시 매번 컴포넌트를 제거하고 새로 생성하는 방식입니다.

- 웹사이트의 효율을 높이기 위해서 유동적인 값이 필요하지 않은 정적 콘텐츠라면 `<keep-alive>` 요소로 감싸서 제거하지 않고 남게함으로 매번 새로 생성하는 불필요한 리소스를 절약할 수 있습니다.

  > 즉 `keep-alive`라는 추상 엘리먼트로 감싸져있는 컴포넌트들이 변경될 때, 사라질 인스턴스를 메모리에서 제거하지 않음. 이로 인해 불필요한 re-render 를 막고 활성화되을 때 변경되었던 상태가 비활성화 후 다시 활성화 되었을 때 유지 됨. 공식 문서에서는 `transition` 내장 컴포넌트와 함께 사용하여 애니메이션 된 상태를 유지할 때 사용하기도 한다고 되어있음.

App.vue

```
<template>
    <div>
        <div class="header">
            <h1 class="headerText">(주) OpenSG</h1>
            <nav>
                <ul>
                	// this.currentView 값 변경 -> 컨테이너 뷰 내용 변경
                    <li><a href="#" @click="changeMenu('home')">Home</a></li>
                    <li><a href="#" @click="changeMenu('about')">About</a></li>
                    <li><a href="#" @click="changeMenu('contact')">Contact</a></li>
                </ul>
            </nav>
        </div>
        <div class="container">
            <component v-bind:is="currentView"></component>  // 컨테이너 뷰 컴포넌트
        </div>
    </div>
</template>
<script>
import Home from './component/Home.vue' // 컴포넌트 임포트
import About from './component/About.vue' // 컴포넌트 임포트
import Contact from './component/Contact.vue' // 컴포넌트 임포트

export default {
    name: 'App',
    components : {Home, About, Contact},
    data(){
        return {currentView:'home'}  // 첫페이지 home 컴포넌트 노출
    },
    method : {
        changeMenu(view){
            this.currentView = view;
        }
    }
}
</script>
<style scoped>
.header {background-color:aqua; padding:10px 0px 0px 0px}
.haederText {padding:0 20px}
ul{
    list-style-type: none;margin:0;padding:0;overflow:hidden;background-color: purple;
}
li {float:left;}
li a {display:block;color:yellow;text-align:center;padding:14px 16px;text-decoration: none;}
li a:hover {background-color:aqua;color:black}
</style>
```

- 만일 특정 컴포너너트만 캐싱하고 싶다면 include 와 exclude 특성을 사용합니다

```
<keep-alive include="about, home">
    <component :is={currentView}></component>
</keep-alive>
```

그리고 각 컴포넌트에서 name 옵션을 부여 후 export 시킵니다.



## 9.5  재귀 컴포넌트

- 재귀 컴포넌트( Recursive Components )는 템플릿에서 자기 자신을 호출하는 컴포넌트 입니다. 
  ( 같을 수는 없지만 자바스크립트 이중 for문처럼 이해하면 더 쉽게 접근할 수 있을 것 같습니다. )
- 반드시 name 옵션을 지정해야 합니다.



6장에서 컴포넌트 기초를 설명했다면 9장에서는 컴포넌트를 활용하는 방법에 대해서 많이 정리되어 있습니다.

정리하면서 느낀 점은 일단 6장부터 완벽하게 이해를 한 뒤 9장의 스킬들을 얼마나 잘 활용하는지가 코드의 

퀄리티를 좌우할 것 같습니다.
