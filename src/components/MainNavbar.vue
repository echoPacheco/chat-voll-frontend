<template>
    <nav v-if="isLoggedIn"
        class="fixed top-0 left-0 w-full z-50 bg-pink-700 text-white p-4 flex justify-between items-center shadow-md">
        <div class="text-xl font-bold">
            Chat Voll
        </div>
        <div class="space-x-4">
            <router-link to="/" class="hover:underline">
                Home
            </router-link>
            <router-link to="/metrics" class="hover:underline">
                Metrics
            </router-link>
            <button @click="logout" class="hover:underline">
                Logout
            </button>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'MainNavbar',
    computed: {
        isLoggedIn() {
            return this.$store.getters.isLoggedIn;
        },
    },
    methods: {
        logout() {
            this.$store.dispatch('logout');
            this.$router.push('/login');
        },
    },
    created() {
        this.$store.dispatch('checkLoginStatus');
    }
}
</script>