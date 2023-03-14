# easy-typer-js

<a href="https://www.npmjs.com/package/easy-typer-js"><img src="https://img.shields.io/npm/v/easy-typer-js.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/easy-typer-js"><img src="https://img.shields.io/npm/l/easy-typer-js.svg" alt="License"></a>
<a href="https://npmcharts.com/compare/easy-typer-js?minimal=true"><img src="https://img.shields.io/npm/dm/easy-typer-js.svg" alt="Downloads"></a>
[![](https://data.jsdelivr.com/v1/package/npm/easy-typer-js/badge)](https://www.jsdelivr.com/package/npm/easy-typer-js)

> 功能十分强大打字机插件，兼容原生JS和MVVM类框架（Vue,React,angular），随心所欲的输出任何你想输出的内容。



## 特点（优势）

> 与其他相似的打字机插件我们的有点在哪里？

- 1. 我们的打字机不操作DOM，重要的事情讲三遍，不操作DOM！不操作DOM！不操作DOM！
- 2. 我们的打字机与MVVM框架结合性能超棒！
- 3. 我们的打字机只改变数据对象的输出，并不对DOM进行操作！

## 去我的站点看真正的效果

=> [彭小呆的随笔杂谈](https://inner.ink)  <=




## 一、效果展示
![](https://user-gold-cdn.xitu.io/2019/12/23/16f325042e4afa28?w=822&h=590&f=gif&s=113630)
![](https://user-gold-cdn.xitu.io/2019/12/23/16f324f83b23d43f?w=813&h=508&f=gif&s=155566)
> easy-typer-js是一个轻量级的插件, 用于实现页面文字的打字机效果. 它使用起来非常简单, 只需要几行代码就能实现高大上的打字机效果.而且对MVVM框架支持完美，还兼容原生JS.


## 二、使用easy-typer-js

### 2.1 引入easy-typer-js
- 方法1: ES6模块化引入(官方推荐)
```js
// 安装
npm install easy-typer-js --save
或者
yarn add easy-typer-js
```
```js
// 引入
import EasyTyper from 'easy-typer-js'
// 实例化
const typed = new EasyTyper(obj, input, fn, hooks)
```

- 方法2: 常规导入

```js
// 下载至本地
<script src="./easy-typer-js"></script>

//cdn导入
<script src="https://cdn.jsdelivr.net/npm/easy-typer-js@1.0.3/easy-typer-min.js"></script>
```

### 2.2 使用它作为你最强大的武器吧！

#### 2.2.1 在原生JS中使用

> 打开页面你会发现`黎明前的黑暗是最深不见底的黑暗！`这句话被一个一个字`敲`出来！哇哦！是不是很炫酷！

```js
  const typing = new EasyTyper(obj, `黎明前的黑暗是最深不见底的黑暗！`, 
    instance => {
      // 回调函数
      // 此回调一般用于获取新的数据然后循环输出
      // instance { 实例EasyTyper }
      console.log(instance) // 打印出实例对象
    }, (output, instance)=>{
      // 钩子函数
      // output { 当前帧的输出内容 }
      // instance { 实例EasyTyper }
      // 通过钩子函数动态更新dom元素
      document.getElementById('output').innerHTML = `${output}`
  })

```
#### 2.2.2 在Vue中使用

> 打开页面你会发现`我将要被打字机输出`这句话被一个一个字`敲`出来!

```html
<template>	
  // 动态绑定
  <div>{{ obj.output }}</div>
</template>
<script>
import EasyTyper from 'easy-typer-js'
export default {
  name: 'home',
  data() {
    return {
      obj: {
        output: '',
        // 其他参数省略
      }
    }
  },
  mounted() {
    const typed = new EasyTyper(this.obj, `我将要被打字机输出`)
  }
}
</script>
```

#### 2.2.3 在React中使用

> 打开页面你会发现`我是被React所创造出来的！`这句话上帝所诉说！

![](https://user-gold-cdn.xitu.io/2019/12/23/16f32526f656e5e1?w=813&h=600&f=gif&s=748601)

```js
import EasyTyper from 'easy-typer-js'

class showText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '',
      typer: null
    }
    this.initTyper = this.initTyper.bind(this)
    this.changeOutput = this.changeOutput.bind(this)
  }

  initTyper() {
    // 配置对象
    const obj = {
      output: '',
      isEnd: false,
      speed: 80,
      singleBack: false,
      sleep: 0,
      type: 'normal',
      backSpeed: 40,
      sentencePause: false
    }
    // 实例化
    this.typer = new EasyTyper(obj, '我是被React所创造出来的！', this.completeAsentence, this.changeOutput)
  }

  // 输出完毕后的回调函数
  completeAsentence() {
    console.log('输出完毕！长官！')
  }

  // 钩子函数和setState结合
  changeOutput(output) {
    this.setState(state => ({
      output: output
    }))
  }

  render() {
    return (
      <p>{this.state.output}</p>
    )
  }
}



```



### 2.3[实战] 实践出真理 ( 完整代码 )



#### 2.3.1 Vue + Vuepress + 一言API === 实现博客首页炫酷文字输出效果

> 以下为完整代码！！！

```html
<template>	
  <div>
    {{ obj.output }}
    <span class="easy-typed-cursor">|</span>
  </div>
</template>
```
```js
<script>
import EasyTyper from 'easy-typer-js'
export default {
  name: 'home',
  data() {
    return {
      obj: {
        output: '',
        isEnd: false,
        speed: 80,
        singleBack: false,
        sleep: 0,
        type: 'rollback',
        backSpeed: 40,
        sentencePause: false
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.fetchData()
    },
    fetchData() {
        // 一言Api进行打字机循环输出效果
      fetch('https://v1.hitokoto.cn')
        .then(res => {
            return res.json()
        })
        .then(({ hitokoto }) => {
            this.initTyped(hitokoto)
        .catch(err => {
            console.error(err)
        })
    },
    initTyped(input, fn, hooks) {
      const obj = this.obj
      const typed = new EasyTyper(obj, input, fn, hooks)
    }
  }
}
</script>
```
```stylus
<style lang="stylus">
  .typed-cursor
    margin-left: 10px
    opacity: 1
    -webkit-animation: blink 0.7s infinite
    -moz-animation: blink 0.7s infinite
    animation: blink 0.7s infinite
  @keyframes blink
    0%
      opacity: 1
    50%
      opacity: 0
    100%
      opacity: 1
  
  @-webkit-keyframes blink
    0%
      opacity: 1
    50%
      opacity: 0
    100%
      opacity: 1
  
  @-moz-keyframes blink
    0%
      opacity: 1
    50%
      opacity: 0
    100%
      opacity: 1
</style>

```

> 效果如下就是首页你们可以看到的啦！:pig: 

##### 回滚时间`sleep`设置为0时的效果

![](https://user-gold-cdn.xitu.io/2019/12/23/16f32533326539eb?w=1200&h=800&f=gif&s=146036)



#### 2.3.2 在React中



```js
import React from 'react'
import logo from './logo.svg'
import './App.css'
import EasyTyper from 'easy-typer-js'

class showText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '',
      typer: null
    }
    this.initTyper = this.initTyper.bind(this)
    this.changeOutput = this.changeOutput.bind(this)
  }

  componentDidMount() {
    this.initTyper()
  }

  componentWillUnmount() {
    this.typer.close()
  }

  initTyper() {
    // 配置对象
    const obj = {
      output: '',
      isEnd: false,
      speed: 80,
      singleBack: false,
      sleep: 0,
      type: 'normal',
      backSpeed: 40,
      sentencePause: false
    }
    // 实例化
    this.typer = new EasyTyper(obj, '我是被React所创造出来的！', this.completeAsentence, this.changeOutput)
  }

  // 输出完毕后的回调函数
  completeAsentence() {
    console.log('输出完毕！长官！')
  }

  // 钩子函数和setState结合
  changeOutput(output) {
    this.setState(state => ({
      output: output
    }))
  }

  render() {
    return (
       <div className="App">
       <header className="App-header">
         <img src={logo} className="App-logo" alt="logo" />
         <p>{this.state.output}</p>
         <a
           className="App-link"
           href="https://reactjs.org"
           target="_blank"
           rel="noopener noreferrer"
         >
           上帝
         </a>
       </header>
     </div>
    )
  }
}

export default showText

```
> 效果如下

##### 只输出一句话

![](https://user-gold-cdn.xitu.io/2019/12/23/16f32526f656e5e1?w=813&h=600&f=gif&s=748601)


#### 2.3.3 原生实例

```html
<div id="output"></div>
<script src="https://cdn.jsdelivr.net/npm/easy-typer-js@1.0.3/easy-typer-min.js"></script>
```
```js

const obj = {
  output: '', // 输出内容  使用MVVM框架时可以直接使用
  type: 'normal',
  isEnd: false,
  speed: 80,
  backSpeed: 40,
  sleep: 3000,
  singleBack: true,
  sentencePause: false
}
const typing = new easyTyper(obj, `黎明前的黑暗是最深不见底的黑暗！`, (instance)=>{
    // 回调函数 如果这里使用了递归调用会一直循环打印，需要在外部触发停止
    // 此回调用于获取新的数据然后重新输出
    instance.input = [`天不生我彭小呆，万古长青一生狂！`]
    instance.play()
  }, (output, instance)=>{
    // 钩子函数，每一帧的数据获取和实例easy-typer-js的获取
    document.getElementById('output').innerHTML = `${output}<span class="easy-typed-cursor">|</span>`
})
// 12秒后停止
let timer = setTimeout(() => {
  clearTimeout(timer)
  timer = null
  typing.close()
  alert('stop!')
}, 12000)

```

> 效果如下！！！

##### 第一句输出后回滚，后面不回滚！

![](https://user-gold-cdn.xitu.io/2019/12/23/16f325115a964e14?w=627&h=254&f=gif&s=46466)



## 三、参数解析

### 3.1 new EasyTyper(obj, input, fn, hooks)

|参数|	说明	|回调 | 是否必须|
|---|-------|-----|------|
|`obj`|	配置对象 |	无 | 必须一定有且格式要对，十分严格，比起教导主任毫不逊色|
|`input`|	内容输入 |	无 | 可以没有，会有小彩蛋|
|`fn`|	完成一次output输出后的回调函数 |	当前easy-typer-js实例instance | 否 |
|`hooks`|	钩子 钩在每一帧将要完成的时间片段上 | 当前帧输出的内容、当前easy-typer-js实例instance | 否 |

> 回调函数与钩子函数使用方法在上面都使用到了哦


### 3.2 obj配置

| 参数(params)          | 含义(meaning)                                    | 类型(type)  |
| --------------------- | ----------------------------------------------- | ---------------- |
| `output`              | 输出内容,使用MVVM框架时直接使用 { obj.output }  |      string          |
| `type`                | 下一次的行为 'roolback', 'normal', 'custom'       |      string(有且仅有此三种)    |
| `isEnd`               | 全局控制是否终止                                  |      boolean         |
| `speed`               | 打字速度                                         |      number          |
| `backSpeed`           | 回滚速度                                          |      number          |
| `sleep`               | 完整输出完一句话后，睡眠一定时间后触发回滚事件           |       number         |
| `singleBack`          | 单次的回滚（优先级高于type）                       |      boolean         |
| `sentencePause`       | 整个生命周期运行完毕后，句子是否暂停显示（仅在回滚模式下生效）             |      boolean         |
obj配置对象校验非常严格，对象的字段和类型都要遵从以上格式，否则你会在控制台看到一个非常显眼的error！




### 3.3 暴露出可直接调用方法

|方法名|	说明	|参数 |
|---|-------|-----|
|`close`|	停止打字 |	无 |
|`sleep`|	单独可以调用睡眠线程，可以使用在任何地方 | ms(毫秒) |

### 3.4 源码

源码都在GitHub上开源了，可以自行查看，后续还会继续更新。

## 四、原理解析与FAQ

### 4.1 为什么说我们的打字机不进行DOM操作？

> 可以去Github查看我们的打字机源码，你会发现里面没有一行代码有涉及DOM操作的。

### 4.2 我们怎么做到的不涉及DOM操作的？

> 我们秉承一个概念，数据输入进来，我们拷贝一份数据，然后对数据进行解析，最后使用一个对象进行数据的输出！


## 五、更多请查阅

- easy-typer-js官网: [https://inner.ink/typer/](https://inner.ink/typer/)
- Github文档地址: [https://github.com/pengqiangsheng/easy-typer-js](https://github.com/pengqiangsheng/easy-typer-js)
- CDN地址: [https://cdn.jsdelivr.net/npm/easy-typer-js@1.0.3/easy-typer-min.js](https://cdn.jsdelivr.net/npm/easy-typer-js@1.0.3/easy-typer-min.js)


## 六、计划更新内容
- 1.可以输出不仅是文字还有dom元素
- 2.给输出的文字加动画特效
- 3.输出时加上敲字的声音

## 七、邀赞👍
如果这篇文章能够帮到你什么，希望能花一点时间帮我点个赞👍b(￣▽￣)d。
=.=[戳我点赞](https://github.com/pengqiangsheng/easy-typer-js)😊



## 八、更新内容说明

### 1.1.0
- 更新了输入源可以为一个数组，与原有模式兼容
- 更新了句子暂停模式（在**rollback**模式下生效）

```js
  const obj = {
    // 其他省略
    sentencePause: true // 最后一句将会暂停回滚，常显示下去
  }
  // 数组模式 根据顺序一句一句输出
  const inputArr = [`黎明前的黑暗是最深不见底的黑暗！`, `世界上本没有无用的齿轮，只有齿轮自身能决定它的用途！`, `天不生我彭小呆，万古长青一生狂！`]
  const typing = new EasyTyper(obj, inputArr, ()=>{
    // 回调函数，easyTyper生命周期结束后执行
    console.log('结束了，我的使命！')
  }, (output, instance) => {
    // 钩子函数，每一帧的数据获取和实例EasyTyper的获取
    document.getElementById('output').innerHTML = `${output}`
  })
```

### 2.0.0

- 重构源码，全面支持TS！

### 2.1.0

- 新增测试功能，引入`jest`测试框架
- 新增测试单元，测试命令`yarn test`