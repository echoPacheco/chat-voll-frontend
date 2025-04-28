<template>
    <div class="login">
        <h2>Login</h2>
        <form @submit.prevent="login">
            <label>Email</label>
            <input type="email" v-model="email" required />

            <label>Senha</label>
            <input type="password" v-model="password" required />

            <button type="submit">Entrar</button>
            <p v-if="error" style="color: red;">{{ error }}</p>
        </form>
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
