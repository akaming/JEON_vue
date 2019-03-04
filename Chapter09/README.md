# Chapter9 - 단일 파일 컴포넌트

## 9.1 - 컴포넌트 조합

- 단일 파일 컴포넌트( Single File Component ) 는 전역 수준 컴포넌트의 몇 가지 문제점을 해결합니다.

  - 빌드 단계가 없으므로 최신 자바스크립트(ECMAScript 2015, TypeScript) 문법 사용 불가합니다.
  - 컴포넌트들은 고유한 스타일 정보를 포함하는 경우가 많은데 전역 컴포넌트에서는 CSS 스타일을 빌드하고 모듈화 할 수 없습니다.
  - 컴포넌트의 템플릿이 작성될 때 HTML 파일 안에 여러 개의 `<Template />` 태그가 작성되어 식별하기 
    어렵고 템플릿마다 고유한 id를 부여하고 컴포넌트들도 고유한 이름을 지정해야 합니다. 
    **쉽게 말해서 가독성이 떨어지고 번거롭다.**
- Vue CLI 를 이용해 생성한 프로젝트 코드는 [vue-loader](https://vue-loader-v14.vuejs.org/kr/) 라는 npm 패키지를 이용해 단일 파일 컴포넌트를 지원합니다.
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















