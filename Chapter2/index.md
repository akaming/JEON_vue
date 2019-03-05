# Vue.js 기초
Vue.js는 전형적인 MVVM  패턴을 따르고 있습니다.  MVVM 패턴은 Model - View - ViewModel의 줄임말입니다. MVVM패턴은  애플리케이션 로직과  UI의 분리를 위해 설계된 패턴입니다. View는 HTML과 css로 작성하게 됩니다. ViewModel은 View의 실제 논리 및 데이터 흐름을 담당합니다. View는 ViewModel만 알고있으면 되라 뿐, 그 외의 요소는 신경 쓰지 않아도 됩니다. 비지니스 로직에서는 ViewModel의 상태 데이터만 변경하면 즉시 View에 반영됩니다. 
 뷰의 대표적 문법은 콧수염 모양을 닮았다고해서 콧수염 표현식(Mustache Expression)이라고도 부르며, 문자열의 덧붙인다는 의미로 보간법(InterPolation)이라고도 합니다.
 
## 기본 예제
```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
</head>
<body>
    <h1>Vue</h1>
    <div id="sample">
        <h2>{{message}}</h2>
    </div>
    <script>
        var model = {
            message : '첫 번째 Vue.js 앱입니다.'
        };

        var sample = new Vue({
            el : "#sample",
            data : model
        });
        
        //model.message = "반응형 data 입니다."
    </script>
</body>
</html>
```

## 기본 디렉티브 
### v-text, v-html 디렉티브 
선언적 렌더링을 위해 HTML 요소 내부에 템플릿 표현식만 사용할 수 있는 것은 아닙니다. 
```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
</head>
<body>
    <h1>Vue</h1>
    <div id="sample">
        <h2 v-text="message"></h2>
    </div>
    <script>
        var model = {
            message : '첫 번째 Vue.js 앱입니다.'
        };

        var sample = new Vue({
            el : "#sample",
            data : model
        });

    </script>
</body>
</html>
```
* v-text,{{ }} innerText 속성에 연결됨, 태그 문자열을 HTML 인코딩하여 나타내기 때문에 화면에는 태그 문자열이 그대로 나타남
* v-html innerHTML 속성에 연결됨, 태그 문자열을 파싱하여 화면에 나타남 

위와 같은 차이로 v-html을 사용하면 문제가 없지만 v-html은 스크립트 태그를 그대로 바인딩합니다. 요즘 문제가 되고 있는 XSS 공격 등에 취약합니다. 
꼭 필요한 경우가 아니라면 v-text를 사용하는 것이 더 안전합니다.

### v-bind 디렉티브
요소 속성들을 바인딩하기 위해 사용합니다.
```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script  src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
</head>
<body>
    <h1>Vue</h1>
    <div id="sample">
        <input id="a" type="text" v-bind:value="message"> <br />
        <img :src="imagePath" alt="">
    </div>
    <script>
        var model = {
            message : 'v-bind 디렉티브',
            imagePath: "http://sample.bmaster.kro.kr/photos/61.jpg"
        };

        var sample = new Vue({
            el : "#sample",
            data : model
        });

    </script>
</body>
</html>
```
### v-model 디렉티브
양방향 데이터 바인딩이 필요한 경우 사용합니다.

```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script  src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
</head>
<body>
    <h1>Vue</h1>
    <div id="sample1">
        <div>좋아하는 과일을 모두 골라주세요 : </div>
        <input type="checkbox" value="1" v-model="fruits"> 사과,
        <input type="checkbox" value="2" v-model="fruits"> 키위,
        <input type="checkbox" value="3" v-model="fruits"> 포도,
    </div>
    <div id="sample2">
        선택한 과일들 : <span v-html="fruits"></span>
    </div>
    <script>
        var model = {
            fruits : []
        };

        var simple1 = new Vue({
            el : "#sample1",
            data : model
        });
        
        var simple2 = new Vue({
            el : "#sample2",
            data : model
        })

    </script>
</body>
</html>
```
양방향 데이터가 바인딩하여 실시간 반영이 됩니다. v-model은 몇가지 수식어(Modifier)를 지원합니다. 
* lazy: change 이벤트 이후에 동기화 할 수 있습니다.
* number : type="number"를 사용하는 경우에도 HTML 입력 엘리먼트의 값은 항상 문자열을 반환하기 때문에 이것은 종종 유용하게 사용할 수 있습니다.
* trim : 공백을 제거합니다.

### v-show, v-if, v-else, v-else-if 디렉티브 
```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script  src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
</head>
<body>
    <h1>Vue</h1>
    <div id="account">
        예금액 : <input type="text" v-model="amount" />
        <img v-if="amount < 0" src="http://sample.bmaster.kro.kr/img/error.png" title="마이너스는 허용하지 않습니다." style="width: 15px; vertical-align: middle">
    </div>
    <script>
    var sample = new Vue({
        el: "#account",
        data : {
            amount : 0
        }
    });

    </script>
</body>
</html>
```
v-show, v-if는 같은 view 화면을 보여주고있습니다. 차이는 v-show는 렌디링을 하며 조건에 부합하지 않으면 display: none;을 사용하는 차이가 있습니다. 그러므로 자주 화면이 변경되는 부분에 대해서는 v-show 디렉티브를 사용하는 것이 바람직하며 여러 조건식이 있을경우 v-if를 사용하는것이 바람직합니다.

````
<span v-else-if="amount >= 100000">Gold/span>
<span v-else-if="amount >= 50000">Silver</span>
<span v-else-if="amount >= 20000">Bronze</span>
<span v-else>Basic</span>
````
### 반복 렌더링 디렉티브
반복적인 데이터를 렌더링하기 위해서 v-for 디렉티브를 사용합니다. 

####배열 데이터
```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script  src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
    <style>
        #list {width: 400px; border: 1px solid black; border-collapse: collapse;}
        #list td, #list th {border: 1px solid black; text-align: center;}
        #list > thead > tr {color: yellow; background-color: purple;}
    </style>
</head>
<body>
    <h1>Vue</h1>
    <div id="exmaple">
        <table>
            <thead>
            <tr>
                <th>번호</th>
                <th>이름</th>
                <th>전화번호</th>
                <th>주소</th>
            </tr>
            </thead>
            <tbody id="contacts">
            <tr v-for="contact in contacts">
                <td>{{contact.no}}</td>
                <td>{{contact.name}}</td>
                <td>{{contact.tel}}</td>
                <td>{{contact.address}}</td>
            </tr>
            </tbody>
        </table>
    </div>
    <script>
        var model = {
            "pageno" : 1,
            "pagesize" : 10,
            "totalcount" : 100,
            "contacts" : [
                {
                    "no" : 100,
                    "name" : "설현",
                    "tel" : "010-1234-9875",
                    "address" : "서울"
                },{
                    "no" : 99,
                    "name" : "태연",
                    "tel" : "010-1234-9874",
                    "address" : "서울"
                },{
                    "no" : 98,
                    "name" : "하니",
                    "tel" : "010-1234-9873",
                    "address" : "서울"
                },{
                    "no" : 97,
                    "name" : "성소",
                    "tel" : "010-1234-9872",
                    "address" : "서울"
                }
            ]
        }
        var list = new Vue({
            el : "#exmaple",
            data : model
        })
    </script>
</body>
</html>
```
####객체 데이터
```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script  src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
    <style>
        #list {width: 400px; border: 1px solid black; border-collapse: collapse;}
        #list td, #list th {border: 1px solid black; text-align: center;}
        #list > thead > tr {color: yellow; background-color: purple;}
    </style>
</head>
<body>
    <h1>Vue</h1>
    <div id="exmaple">
        <select name="" id="regions">
            <option disabled="disabled" selected>지역을 선택하세요</option>
            <option v-for="(val, key) in regions" :value="key" v-text="val"></option>
        </select>
    </div>
    <script>
    var regions = {
        "A" : "Asia",
        "B" : "America",
        "C" : "Europe"
    };

    var list = new Vue({
        el : "#exmaple",
        data : {regions : regions}
    });
    </script>
</body>
</html>
```
만일 인덱스 번호를 표현해야 한다면 다음과 같이 표현할 수 있습니다.
* 배열 데이터인 경우
   ```
    <tr v-for="(contact, index) in contacts">
   ```
* 객체 데이터인 경우
    ```
     <option v-for="(val, key, index) in regions" :value="key" v-text="val">
   ```
 위 예제에서는 단 하나의 요소만 반복 렌더링을 수행했습니다. 만일 여러요소의 그룹을 반복 렌더링하려면 <template>태그를 사용합니다.
 ```
 <tbody id="contacts">
 <template v-for="(contact, index) in contacts">
     <tr :key="contact.no">
         <td>{{index + 1}}</td>
         <td>{{contact.name}}</td>
         <td>{{contact.tel}}</td>
         <td>{{contact.address}}</td>
     </tr>
     <tr class="divider" v-if="(index + 1) % 2 == 0"></tr>
 </template>

 </tbody>
 ```
 또한 Key특성을 부여할 수 있습니다. 일반적으로 key특성을 바인딩할 것을 권장합니다. 
 
 ### 기타 디렉티브
 #### v-pre 
 v-pre 디렉티브로 인해 Vue 객체는 컴파일하지 않고 {{message}} 문자열 그대로 출력합니다.
```
<div id="example">
    <span v-pre>{{message}}</span>
</div>
<script>
    var vm = new Vue({
       el : "#example",
        data : {
           message : "Hello World"
        }
    });
</script>
```

#### v-once
처음 한번만 렌더링을 수행합니다. 그렇기 대문에 변경이 불가능합니다.
```
<div id="example">
    <span v-once>{{message}}</span>
</div>
<script>
    var vm = new Vue({
       el : "#example",
        data : {
           message : "Hello World"
        }
    });
</script>

```

### 계산형 속성
계산형 속성(Computed Property)은 이러한 문제를 해결하는 방법 중의 하나입니다. Vue 객체를 만들 때 Computed라는 속성과 함께 함수를 등록해두면 마치 속성처럼 이용할 수 있습니다.
```
<!doctype html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script  src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
    <style>
        #list {width: 400px; border: 1px solid black; border-collapse: collapse;}
        #list td, #list th {border: 1px solid black; text-align: center;}
        #list > thead > tr {color: yellow; background-color: purple;}
    </style>
</head>
<body>
<h1>Vue</h1>
<div id="exmaple">
    <p>
        국가명 : <input type="text" v-model="countryname" placeholder="국가명">
    </p>
    <table id="list">
        <thead>
        <tr>
            <th>번호</th>
            <th>국가명</th>
            <th>수도</th>
            <th>지역</th>
        </tr>
        </thead>
        <tbody id="contacts">
            <tr v-for="c in filtered">
                <td>{{c.no}}</td>
                <td>{{c.name}}</td>
                <td>{{c.capital}}</td>
                <td>{{c.region}}</td>
            </tr>
        </tbody>
    </table>
</div>
<script>
    var model = {
        countryname : "",
        countries : [
            { no:1, name : "미국", capital : "워싱턴DC", region: "america"},
            { no:1, name : "프랑스", capital : "파리", region: "europe"},
            { no:1, name : "영국", capital : "런던", region: "europe"},
            { no:1, name : "중국", capital : "베이징", region: "asia"},
            { no:1, name : "태국", capital : "방콕", region: "asia"},
            { no:1, name : "모로코", capital : "라바트", region: "africa"},
            { no:1, name : "라오스", capital : "비엔티안", region: "asia"},
            { no:1, name : "베트남", capital : "하노이", region: "asia"}
        ]
    }
    var clist = new Vue({
        el: "#exmaple",
        data : model,
        computed : {
            filtered : function() {
                var cname = this.countryname.trim();
                return this.countries.filter(function(item, index) {
                    if(item.name.indexOf(cname) > -1) {
                        return true;
                    }
                })
            }
        }
    })
</script>
</body>
</html>
```
v-model 디렉티브를 이용해 양방향 바인딩으로 사용자의 입력값을 받아내고있습니다.  이 문제를 해결하기 위해서는 v-on 디렉티브를 이용해 keyup이벤트 처리를 수행하면 됩니다.

```
<!doctype html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script  src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
    <style>
        #list {width: 400px; border: 1px solid black; border-collapse: collapse;}
        #list td, #list th {border: 1px solid black; text-align: center;}
        #list > thead > tr {color: yellow; background-color: purple;}
    </style>
</head>
<body>
<h1>Vue</h1>
<div id="exmaple">
    <p>
        국가명 : <input type="text" :value="countryname" placeholder="국가명" @input="nameChanged">
    </p>
    <table id="list">
        <thead>
        <tr>
            <th>번호</th>
            <th>국가명</th>
            <th>수도</th>
            <th>지역</th>
        </tr>
        </thead>
        <tbody id="contacts">
            <tr v-for="c in filtered">
                <td>{{c.no}}</td>
                <td>{{c.name}}</td>
                <td>{{c.capital}}</td>
                <td>{{c.region}}</td>
            </tr>
        </tbody>
    </table>
</div>
<script>
    var model = {
        countryname : "",
        countries : [
            { no:1, name : "미국", capital : "워싱턴DC", region: "america"},
            { no:2, name : "프랑스", capital : "파리", region: "europe"},
            { no:3, name : "영국", capital : "런던", region: "europe"},
            { no:4, name : "중국", capital : "베이징", region: "asia"},
            { no:5, name : "태국", capital : "방콕", region: "asia"},
            { no:6, name : "모로코", capital : "라바트", region: "africa"},
            { no:7, name : "라오스", capital : "비엔티안", region: "asia"},
            { no:8, name : "베트남", capital : "하노이", region: "asia"}
        ]
    }
    var clist = new Vue({
        el: "#exmaple",
        data : model,
        computed : {
            filtered : function() {
                var cname = this.countryname.trim();
                return this.countries.filter(function(item, index) {
                    if(item.name.indexOf(cname) > -1) {
                        return true;
                    }
                })
            }
        },
        methods: {
            nameChanged: function(e) {
                this.countryname = e.target.value;
            }
        }
    })
</script>
</body>
</html>

```
