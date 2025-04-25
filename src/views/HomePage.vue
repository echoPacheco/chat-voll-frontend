<template>
    <div>
        <h1>Usuários</h1>
        <ul>
            <li v-for="user in users" :key="user.id">{{ user.name }}</li>
        </ul>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    data() {
        return {
            users: [],
        };
    },
    async mounted() {
        const response = await api.get('/users');
        this.users = response.data;
    },
};
</script>
