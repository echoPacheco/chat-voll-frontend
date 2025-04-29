<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 class="text-3xl font-bold text-pink-700 mb-6 text-center">Login</h2>
            <form @submit.prevent="login" class="flex flex-col gap-4">
                <div>
                    <label class="block text-gray-700 mb-1">Email</label>
                    <input type="email" v-model="email" required
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-700" />
                </div>
                <div>
                    <label class="block text-gray-700 mb-1">Senha</label>
                    <input type="password" v-model="password" required
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-700" />
                </div>
                <button type="submit"
                    class="bg-pink-700 hover:bg-pink-800 text-white font-semibold py-2 rounded-lg transition-colors">
                    Entrar
                </button>
                <p v-if="error" class="text-red-500 text-center text-sm mt-2">{{ error }}</p>
            </form>
        </div>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    data() {
        return {
            email: '',
            password: '',
            error: '',
        };
    },
    methods: {
        async login() {
            try {
                const response = await api.post('/auth/login', {
                    email: this.email,
                    password: this.password,
                });

                const access_token = response.data.access_token;

                if (access_token) {
                    this.$store.dispatch('login', access_token);
                    this.$router.push('/');
                } else {
                    this.error = 'Failed to obtain token.';
                }
            } catch (err) {
                this.error = 'Email or password wrong.';
                console.error(err);
            }
        },
    },
};
</script>
