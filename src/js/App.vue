<template>
  <div id="app">
    <TodoList v-bind:todos="todos" v-on:deleteTodo="deleteTodo"/>
  </div>
</template>

<script>
import TodoList from "./components/TodoList.vue";

export default {
  name: 'app',
  data() {
    return {
      todos: ['Ремонт','Завтрак']
    }
  },
  components: {
    TodoList
  },
  methods: {
    deleteTodo(index) {
      this.todos.splice(index, 1);
    }
  }
}
</script>

<style>

</style>
