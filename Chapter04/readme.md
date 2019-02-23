# Chapter4. 이벤트 처리

## 4.1 인라인 이벤트 처리

Vue.js에서 이벤트는 v-on 디렉티브를 이용해서 처리할 수 있습니다.

```
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>4-01</title>
<script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
</head>
<body>

<div id="exp">
    <button id="plus" v-on:click="total+=num">더하기</button>
    <button id="minus" v-on:click="total-=num">빼기</button>
    <p>{{total}}</p>
</div>

<script>
    var vm = new Vue({
        el : '#exp',
        data : {
            num : 1,
            total : 0
        },
    })
</script>
</body>
</html>
```

## 4.2 이벤트 핸들러 메서드

Vue 인스턴스에 메서드를 작성하여 이벤트를 처리할 수 있습니다.

```
<div id="exp">
    <button id="plus" @click="plus">더하기</button>
    <button id="minus" @click="minus">빼기</button>
    <p>{{total}}</p>
</div>

<script>
    var vm = new Vue({
        el : '#exp',
        data : {
            num : 1,
            total : 0
        },
        methods : {
            plus : function(e) {
                return this.total += this.num;
            },
            minus : function() {
                return this.total -= this.num;
            }
        }
    })
</script>
```

## 4.3 이벤트 객체

이벤트를 처리하는 메서드는 첫 번째 파라미터로 이벤트 객체를 전달 받습니다.<br>
Vue.js의 이벤트 객체는 W3C 표준 HTML DOM Event 모델을 그대로 따르면서 추가적인 속성을 제공합니다.

표 04-01 이벤트 객체의 주요 공통 속성

| 속성명 | 설명 |
|:--------|:--------|
| target | 이벤트가 발생한 HTML 요소를 리턴함 |
| currentTarget | 이벤트리스너가 이벤트를 발생시키는 HTML 요소를 리턴함 |
| path | 이벤트 발생 HTML 요소로부터 document, window 객체로 거슬러 올라가는 경로 |
| bubbles | 현재의 이벤트가 버블링을 일으키는 이벤트인지 여부를 리턴함 |
| cancelable | 기본 이벤트를 방지할 수 있는지 여부를 리턴함 |
| defaultPrevented | 기본 이벤트가 방지되었는지 여부를 나타냄 |
| eventPhase | 이벤트 흐름의 단계를 나타냄<br> 1.포착(CAPTURING_PHASE)<br> 2.이벤트 발생(AT_TARGET)<br> 3.버블링(BUBBLING_PHASE)|
| srcElement | ID에서 사용되던 속성으로 TARGET과 동일한 속성 |

표 04-02 키보드 이벤트 관련 속성

| 속성명 | 설명 |
|:--------|:--------|
| altKey | ALT 키가 눌러졌는지 여부를 나타냄 |
| shiftKey | SHIFT 키가 눌러졌는지 여부를 나타냄 |
| ctrlKey | CTRL 키가 눌러졌는지 여부를 나타냄 |
| metaKey | 윈도우는 window 키, 맥은 Command 키를 눌렀는지 여부를 나타냄 |
| key | 이벤트에 의해 나타나는 키의 값을 리턴함. 대소문자 구분 |
| code | 이벤트를 발생시킨 키의 코드값을 리턴함 |
| keyCode | 이벤트를 발생시킨 키보드의 고유 키코드. 대소문자 구분하지 않음 |
| charCode | keypress 이벤트가 발생될 때 Unicode 캐릭터 코드를 리턴함 |
| location | 디바이스에서의 키 위치값. 일반 키보드는 이 값이 모두 0이므로 이용할 수 없음 |

표 04-03 마우스 이벤트 관련 속성

| 속성명 | 설명 |
|:--------|:--------|
| altKey, shiftKey<br>ctrlKey, metaKey | 키보드 이벤트 관련 속성 참조 |
| button | 이벤트를 발생시킨 마우스 버튼<br> 0 : 마우스 왼쪽<br> 1 : 마우스 휠<br> 2 : 마우스 오른쪽 |
| buttons | 마우스 이벤트가 발생한 후에 눌러져 있는 마우스 버튼의 값을 리턴함<br> 1 : 마우스 왼쪽 버튼<br> 2 : 마우스 오른쪽 버튼<br> 4 : 마우스 휠 |
| clientX, clientY | 마우스 이벤트가 일어났을 때의 뷰포트 영역상의 좌표 |
| layerX, layerY | 마우스 이벤트가 발생한 HTML 요소 영역상에서의 좌표(IE 이외 사용) |
| offsetX, offsetY | 마우스 이벤트가 발생한 HTML 요소 영역상에서의 좌표(IE 사용) |
| pageX, pageY | 마우스 이벤트가 일어났을 때의 HTML 문서 영역상의 좌표 |
| screenX, screenY | 마우스 이벤트가 일어났을 때의 모니터 화면 영역상의 좌표 |

표 04-04 이벤트 객체의 주요 메서드

| 속성명 | 설명 |
|:--------|:--------|
| preventDefault() | 기본 이벤트의 자동 실행을 중지시킴 |
| stopPropagation() | 이벤트의 전파를 막음 |

## 4.4 기본 이벤트

HTML 문서나 요소에 어떤 기능을 실행하도록 이미 정의되어 있는 이벤트를 **기본 이벤트(Default Event)** 라고 합니다.

- &lt;a&gt; 요소의 href 특성
- 브라우저 화면을 마우스 오른쪽 클릭했을 때 나오는 메뉴 - 컨텍스트 메뉴(ContextMenu)
- &lt;form&gt; 요소 내부의 submit 버튼 클릭 시 action 특성과 method 특성
- &lt;input type="text"&gt; 요소에 키보드를 누르면 입력한 문자가 박스에 나타남

```
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>04-4</title>
<script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
<style>
html, body{margin:0; padding:0;}
#exp{height:98vh; min-height:100%; padding:5px;}
</style>
</head>
<body>

<div id="exp" @contextmenu="ctxStop">
    <a href="https://google.com" @click="goGoogle">구글</a>
</div>

<script>
    var vm = new Vue({
        el : '#exp',
        methods : {
            ctxStop : function(e) {
                e.preventDefault();
            },
            goGoogle : function(e) {
                if( !confirm('구글로 이동할까요?') ) {
                    e.preventDefault();
                }
            }
        }
    })
</script>
</body>
</html>
```

## 4.5 이벤트 전파와 버블링

HTML 문서의 이벤트 처리는 3단계 입니다.

1. 이벤트 포착 단계(CAPTURING_PHASE) - 문서 내의 요소에 이벤트 발생 시, HTML 문서의 밖에서부터 이벤트 발생시킨 HTML 요소까지 포착
2. 이벤트 발생(PAISING_PHASE:AT_TARGET) - 이벤트를 발생시킨 요소에 다다르면 요소의 이벤트에 연결된 함수를 직접 호출
3. 버블링(BUBBLING_PHASE) - 이벤트가 발생한 요소로부터 상위 요소로 거슬러 올라가면서 동일한 이벤트를 호출

```
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>04-4</title>
<script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
<style>
html, body{margin:0; padding:0;}
#outer{position:absolute; top:100px; left:50px; width:200px; height:200px; padding:10px; border:2px solid #000; background:#333;}
#inner{width:100px; height:100px; border:2px solid #000; background:#CCC;}
</style>
</head>
<body>

<div id="exp">
    <div id="outer" @click="outerClick">
        <div id="inner" @click.stop="innerClick"></div>
    </div>
</div>

<script>
    var vm = new Vue({
        el : '#exp',
        methods : {
            outerClick : function(e) {
                console.log('### Outer Click');
                console.log('Event Phase : ', e.eventPhase);
                console.log('Current Target : ', e.currentTarget);
                console.log('target : ', e.target);
            },
            innerClick : function(e) {
                console.log('### Inner Click');
                console.log('Event Phase : ', e.eventPhase);
                console.log('Current Target : ', e.currentTarget);
                console.log('target : ', e.target);
            }
        }
    })
</script>
</body>
</html>
```

## 4.6 [이벤트 수식어](https://kr.vuejs.org/v2/guide/events.html#%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%88%98%EC%8B%9D%EC%96%B4)

### 4.6.1 Once

once 수식어는 한 번만 이벤트를 발생시킵니다.

```
<div id="exp">
    <button id="once" @click.once="once">버튼</button>
</div>

<script>
    var vm = new Vue({
        el : '#exp',
        methods : {
            once : function() {
                alert('한 번 호출');
            }
        }
    })
</script>
```

### 4.6.2 키코드 수식어

키보드 관련 이벤트를 처리할 때 사용할 수 있는 수식어 입니다.<br>
고유의 키코드(KeyCode) 값을 가질 때만 이벤트를 발생시킬 수 있습니다.<br>
키코드 값은 일일이 기억할 수 없기에, Vue.js에서 키코드 수식어의 별칭을 제공합니다.

```
<div id="key">
    <button id="once" @keyup="go">버튼</button>
</div>

<script>
    var vm1 = new Vue({
        el : '#key',
        methods : {
            go : function(e) {
                if( e.keyCode == 13 ) {
                    alert('출력')
                }
            }
        }
    })
</script>
```

### 4.6.3 마우스 버튼 수식어

특정 마우스 버튼에 의해 이벤트를 제어합니다.

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>04-06</title>
    <style>
        html, body { margin: 0;padding: 0; }
        #example {
            height: 98vh; min-height: 100%; padding:10px
        }
    </style>
    <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
</head>
<body>
<div id="example" v-on:contextmenu.prevent="ctxStop" @mouseup.left="leftMouse" @mouseup.right="rightMouse">
    <div>
        Left Click : 왼쪽으로<br />
        Right Click : 오른쪽으로
    </div>
    <img src="images/foot.jpg" v-bind:style="{ position:'absolute', left: pos.left + 'px', top:pos.top +'px' }" />
</div>
<script type="text/javascript">
var vm = new Vue({
    el : "#example",
    data : {
        pos : {
            left : 100,
            top:100
        }
    },
    methods: {
        ctxStop : function(e) {

        },
        leftMouse : function(e) {
            if ( this.pos.left > 30 ) {
                this.pos.left -= 30;
            }
            
            console.log("Move Left!!");
        },
        rightMouse : function(e) {
            this.pos.left += 30;
            console.log("Move Right!!");
        }
    }
})
</script>
</body>
</html>
```