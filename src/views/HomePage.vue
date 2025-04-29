<template>
    <div class="min-h-screen flex flex-col items-center bg-gray-100 p-8">
        <h1 class="text-3xl font-bold text-pink-700 mb-6">Usuários</h1>
        <ul class="w-full max-w-md bg-white rounded-lg shadow-md divide-y divide-gray-200">
            <li v-for="user in filteredUsers" :key="user.id" @click="goToConversation(user.id)"
                class="p-4 cursor-pointer hover:bg-pink-100 transition-colors">
                <span class="text-gray-800 font-medium">{{ user.name }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
import api from '@/services/api';

export default {
    data() {
        return {
            users: [],
            currentUser: null,
        };
    },
    async mounted() {
        const currentUser = await api.get('/me');
        this.currentUser = currentUser.data;

        const users = await api.get('/users');
        this.users = users.data;
    },
    computed: {
        filteredUsers() {
            return this.users.filter(user => user.id !== this.currentUser.id);
        },
    },
    methods: {
        goToConversation(userId) {
            this.$router.push(`/conversation/${userId}`);
        },
    },
};
</script>
