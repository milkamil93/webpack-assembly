<template>
    <ul>
        <li v-for="(todo, index) in todos" v-on:click="deleteTodo(index)" :key="index">{{todo}}</li>
    </ul>
</template>

<script>
export default {
    props: ['todos'],
    methods: {
        deleteTodo(index) {
            this.$emit('deleteTodo', index);
        }
    }
}
</script>