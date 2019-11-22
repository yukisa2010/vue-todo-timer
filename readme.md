# イベントの流れについて

## Vueで子コンポーネント間で通信を行う方法

### バス(bus)を使う
#### ComponentA => ComponentB
- グローバル
```JavaScript
const bus = new Vue()
```

- ComponentA
```JavaScript
//トリガーとなるメソッドの中に入れる
bus.$emit('イベント名', 渡したい値)
```

- ComponentB
```JavaScript
//mountedの中に書いて受け取り
Vue.component({
  ...
  mounted: function() {
    bus.$on('イベント名', this.callback)
  },
  methods: {
    callback: function() {
      //行いたい処理
    }
  }
})
```


# 親子間のイベントの受け渡し
- 親 => 子コンポーネント
  - 親(app)
    - html => v-bind:message
  - 子
    - props: {
        message: String
      }
    - template: {{ message }}


- 子コンポーネント => 親
  - 子
    - this.$emit('event')
  - 親(app)
    - html => @event='doSomething'
    - methods: doSomething() {}




