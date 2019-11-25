
const bus = new Vue()

Vue.component('form-wrapper', {
  data: function() {
    return {
      todoTitle: '',
    }
  },
  template: `
  <div>
    <h1>Todoアプリ</h1>
    <input type="text" v-model="todoTitle"/>
    <button @click="addItem" @keydown="addItem(e)">Add</button>
    <todo-items></todo-items>
  </div>
  `,
  mounted: function() {
    const self = this
    window.addEventListener('keydown', function(e) {
      if(e.key === 'Enter') {
        self.addItem()
      }
    })
  },
  methods: {
    addItem: function() {
      if(this.todoTitle === '') return
      bus.$emit('insertTodo', this.todoTitle)
      this.todoTitle = ''
    },
  }
})//form-wrapper


Vue.component('todo-items', {
  template: `
  <ul>
    <li v-for="todo in todos" v-if="!todo.done">
        <input type="checkbox" v-model="todo.done"/>
        {{ todo.title }}
        <button @click="beginTimer(todo.id)" :disabled="!!todo.timerId">begin</button>
        <button @click="endTimer(todo.id)">end</button>
      timer:  {{ todo.timerCount }}
    </li>
    <li v-for="todo in todos" v-if="todo.done" class="done">
        {{ todo.title }}
        timer:  {{ todo.timerCount }}
        <button @click="restoreTodo(todo.id)">restore</button>
    </li>
  </ul>
  `,
  data: function() {
    return {
      todos: [
        { id:1, title: 'やること１', done: false, timerCount: 0, timerId: 0 }, 
        { id:2, title: 'やること２', done: true, timerCount: 0, timerId: 0 }, 
        { id:3, title: 'やること３', done: false, timerCount: 0, timerId: 0 }
      ]
    }
  },
  mounted: function() {
    this.todos = JSON.parse(localStorage.getItem('key'))
    bus.$on('insertTodo', this.insertItem)
  },
  methods: {
    beginTimer: function(arg) {
      const self = this
      this.todos.forEach(function(todo, index) {
        if(todo.id === arg) {
          let counter = self.todos[index].timerCount;
          const timerId = setInterval(function() {
            self.todos[index].timerCount = counter++
          }, 1000)
          self.todos[index].timerId = timerId
        }
      })
    },
    endTimer: function(arg) {
      const self = this
      this.todos.forEach(function(todo, index) {
        if(todo.id === arg) {
          clearInterval(todo.timerId)
          self.todos[index].timerId = 0
          self.todos[index].done = true
        }
      })
      this.setTodosToLocal()
    },
    insertItem: function(newTitle) {
      let maxId = 0

      if(this.todos !== null) {
        maxId = this.todos.reduce(function(max, todo, index) {
          if(max.id < todo.id) {
            return { id: todo.id }
          } else {
            return { id: max.id }
          } 
        }).id
      }

      if(this.todos == null) this.todos = []

      this.todos.push({
          id: maxId + 1, title: newTitle, done: false, timerCount: 0, timerId: 0
      })
      this.setTodosToLocal()  
    },
    restoreTodo(id) {
      //done を falseに戻す
      //ついでにタイマーは途中からすたーとさせる
      const self = this
      this.todos.forEach(function(todo, index) {
        if(todo.id === id) {
          self.todos[index].done = false
        }
      })
      this.setTodosToLocal()
    },
    setTodosToLocal() {
      localStorage.setItem('key' ,JSON.stringify(this.todos))
    }
  }
})//todo-items


const app = new Vue({
  el: '#app'
})//app
