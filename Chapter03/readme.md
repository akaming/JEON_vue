# Chapter 3 : Vue 인스턴스

## 3.1 el, data, computed 옵션

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
   }
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
var vm = new Nue({
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