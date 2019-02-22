# Chapter5. 스타일

## 5.1 스타일 적용

HTML 요소의 스타일 특성은 모두 문자열이며, 케밥 표기법(kebab casing)을 사용한다.
케밥 표기법을 사용하는 이유는 HTML 에서는 대소문자를 구별하지 않기 위함 이다.

```
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>05-01</title>
    <style>
        .test {background-color:yellow; border:double 4px gray;}
        .over {background-color:aqua; width:300px; height:100px;}
    </style>
</head>
<body>
    <div style="background-color:orange;" class="test over"></div>
</body>
</html>
```
위 예제의 실행 결과를 살펴 보면 <style></style> 태그에 작성된 순서대로 CSS클래스의 스타일이 적용된 후 HTML 요소에 style 특성을 이용하는 인라인 스타일이 적용된다.

## 5.2 인라인 스타일
가능하다면 인라인 스타일은 사용하지 않는 것이 바람직하다.
하지만 인라인 스타일이 필요한 경우도 있으니 사용 방법을 익혀둬야 한다.

### Vue.js에서 인라인 스타일 적용 방법
* 인라인 스타일은 **v-bind:style** 로 작성한다.
* 케밥 표기법(kebab casing)이 아닌 카멜 표기법(camel casing)을 사용해야 한다.

| 케밥 표기법 | 카멜 표기법 |
|:--------|:--------|
|font-size|fontSize|
|backgroubd-color|backgroundColor|

* 스타일 속성과 속성은 세미콜론(;)이 아닌 콤마(,) 기호를 이용해 구분한다.

```
<body>
    <div id="example">
(10행) <button id="a" v-bind:style="style1" @mouseover.stop="overEvent" @mouseout.stop="outEvent">테스트</button>
    </div>
    <script type="text/javascript">
        var vm = new Vue({
            el : "#example",
            data : {
(17행)      style1 : {backgroundColor:'aqua', border:'solid 1px gray', width:'100px', textAlign:'center'}
            },
            methods : {
                overEvent : function(e) {
                    this.style1.backgroundColor = "purple";
                    this.style1.color = "yellow";
                },
                outEvent :function(e) {
                    this.style1.backgroundColor = "aqua";
                    this.style1.color = "black";
                }
            }
        })
    </script>
</body>
```
위 예제 에서는 mouseover와 mouseout 이벤트를 사용해 버튼에 마우스가 over나 out될 때 17행 의 style1 데이터 속성을 변경 한다. 변경된 속성은 10행의 v-bind:style="style1"을 통해 바인딩 된다. 17행의 style 데이터 속성을 살펴보면 backgroundColor, textAlign가 같이 카멜 표기법을 사용하면서 자바스크립트 객체 표기법을 사용하고 있음을 알 수 있다.

v-bind:style 디렉티브를 통해서 개별적인 속성 하나하나를 바인딩할 수도 있다.
```
<body>
    <div id="example">
        <div :style="{backgroundColor:a.bc, border:a.bd, width:a.w+'px', height:a.h+'px'}"></div>
    </div>
    <script type="text/javascript">
        var vm = new Vue({
            el : "#example",
            data : {
                a : {bc:'yellow', bd:'solid 1px gray', w:200, h:100}
            }
        })
    </script>
</body>
```
이 방법은 그리 추천하지 않는다.

```
<body>
    <div id="example">
        <button id="btn1" v-bind:style="[myColor, myLayout]">버튼1</button>
    </div>
    <script type="text/javascript">
        var vm = new Vue({
            el : "#example",
            data : {
                myColor : {backgroundColor:'purple', color:'yellow'},
                myLayout : {width:'150px', height:'80px', textAlign:'center'}
            }
        })
    </script>
</body>
```
myColor, myLayout 스타일 객체를 배열 구조를 이용해 적용하고 있다.

## 5.3 CSS 클래스 바인딩
CSS 클래스를 바인딩하기 위해서 v-bind:class를 사용한다. 이떄 개별적인 클래스 단위로 true가 되면 클래스가 주어진다.
```
<head>
    <meta charset="UTF-8">
    <title>05-05: v-bind:class 적용</title>
    <script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
    <style>
        .set1 {background-color:aqua; color:purple;}
        .set2 {text-align:center; width:120px;}
        .set3 {border:sandybrown dashed 1px;}
    </style>
</head>
<body>
    <div id="example">
        <button id="btn1" v-bind:class="{set1:s1, set2:s2, set3:s3}">버튼1</button>
        <P>
            <input type="checkbox" v-model="s1" value="true" />Set1 디자인<br/>
            <input type="checkbox" v-model="s2" value="true" />Set2 디자인<br/>
            <input type="checkbox" v-model="s3" value="true" />Set3 디자인<br/>
        </P>
    </div>
    <script type="text/javascript">
        var vm = new Vue({
            el : "#example",
            data : {s1:false, s2:false, s3:false}
        })
    </script>
</body>
```
v-bind:class를 이용해 클래스를 적용할 때는 boolean 값(true/false)을 이용해 지정한다. 
체크 박스에 v-model 디렉티브를 이용해 양방향 바인딩되어 있다.
체크되면 데이터 속성 값은 true로 변경 된다. 이 값은 v-bind:class="{set1:s1, set2:s2, set3:s3}"와 같은 형태로 각각의 클래스 지정 여부를 결정하게 된다.

하지만 개별적인 값을 지정하는 것은 역시나 불편하다. 클래스 이름을 데이터 속성명으로 사용하면 이런 불편한 점을 쉽게 해결할 수 있다.
```
<div id="example">
    <button id="btn1" v-bind:class="mystyle">버튼1</button>
    <P>
        <input type="checkbox" v-model="mystyle.set1" value="true" />Set1 디자인<br/>
        <input type="checkbox" v-model="mystyle.set2" value="true" />Set2 디자인<br/>
        <input type="checkbox" v-model="mystyle.set3" value="true" />Set3 디자인<br/>
    </P>
</div>
<script type="text/javascript">
    var vm = new Vue({
        el : "#example",
        data : {
            mystyle : {set1:false, set2:false, set3:false}
        }
    })
</script>
```
적용할 클래스명을 포함하는 mystyle 이라는 이름의 데이터 속성을 가진 객첼르 작성하고, 2행에서 v-bind:class="mystyle"로 객체를 바인딩 한다.

## 5.4 계산형 속성, 메서드를 이용한 스타일 적용
다음 예제는 입력 값이 올바른 범위에 포함 되지 않을 떄 스타일 적용하는 예제 이다.
```
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>05-06</title>
    <script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
    <style>
        .score {border:solid 1px black;}
        .warning {background-color:orange; color:purple;}
        .warnimage {width:18px; height:18px; top:5px; position:relative;}
    </style>
</head>
<body>
    <div id="example">
        <div>
            <p>1부터 100까지만 입력가능 합니다.</p>
            <div>
                점수 : <input type="text" class="score" v-model.number="score" v-bind:class="info">
                <img src="http://sample.bmaster.kro.kr/img/error.png" class="warnimage" v-show="info.warning">
            </div>
        </div>
    </div>
    <script type="text/javascript">
        var vm = new Vue({
            el : "#example",
            data : {
                score : 0
            },
            computed : {
                info : function() {
                    if (this.score >= 1 && this.score <= 100)
                        return {warning:false};
                    else 
                        return {warning:true};
                }
            }
        })
    </script>
</body>
```
score 데이터 속성은 input 요소에 양방향 바인딩 되어 있다. 
input 요소에서 입력한 값은 score에 설정되고, v-bind:class="info"에 의해 info 계산형 속성이 바인딩 된다. info 계산형 속성은 score 값의 범위에 따라서 {warning:true} 또는 {warning:false}를 리턴하며, 이 값에 의해 warning  클래스의 지정 여부가 결정된다. 

## 5.5 컴포넌트에서의 스타일 적용
간단한 Vue 컴포넌트는 Vue.component()를 이용해 작성할 수 있다.
(자세한 컴포넌트는 추후에 살펴 볼 것이다.)
```
<div id="example">
    <center-box></center-box>
</div>
......
Vue.component('center-box',{
    template : '<div class="center">중앙에 위치</div>'
})
```
center-box라는 이름의 Vue 컴포넌트를 작성했다. 이것은 <center-box></center-box>와 같이 사용할 수 있다. 이미 이 컴포넌트에도 클래스가 적용되어 있지만 추가로 클래스를 바인딩할 수 있다.
```
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>05-06</title>
    <script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
    <style>
        .boxcolor {background-color:orange;}
        .center {width:200px; height:100px; line-height:100px; text-align:center; border:1px solid gray;}
    </style>
</head>
<body>
    <div id="example">
       <center-box v-bind:class="boxstyle"></center-box>
    </div>
    <script type="text/javascript">
        Vue.component('center-box',{
            template:'<div class="center">중앙에 위치</div>'
        })
        var vm = new Vue({
            el : "#example",
            data : {
                boxstyle : {boxcolor:true}
            }
        })
    </script>
</body>
</html>
```
center 클래스는 Vue 컴포넌트의 template 내부에 이미 적용되어 있다. boxcolor 클래스는 Vue 인스턴스의 boxstyle 데이터 속성값에 의해 적용 여부를 결정 할 수 있도록  <center-box v-bind:class="boxstyle"></center-box>과 같이 v-bind 디렉티브를 사용한다. 개발자 도구에서 vm.boxstyle.boxcolor=false 구문을 실행하면 즉시 색상이 바뀌는 것을 알 수 있다.
이렇듯 간단한 방법을 사용해 컴포넌트 단위에 대해서도 클래스와 스타일을 적용할 수 있다.

## 5.6 TodoList 예제
[예제 보러가기](https://github.com/Jeonjeongho/JEON_vue/blob/myungmin/Chapter05/05-9.html)

