<template>
    <div class="min-h-screen pt-20 flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 class="text-3xl font-bold text-pink-700 mb-6 text-center">Métricas</h2>

            <div class="flex flex-col gap-4">
                <div class="p-4 border rounded-lg bg-gray-50 text-center">
                    <h3 class="text-lg text-gray-700">Total de Mensagens</h3>
                    <p class="text-2xl font-bold text-pink-700">{{ totalMessages }}</p>
                </div>
                <div class="p-4 border rounded-lg bg-gray-50 text-center">
                    <h3 class="text-lg text-gray-700">Usuários Ativos (7 dias)</h3>
                    <p class="text-2xl font-bold text-pink-700">{{ activeUsers }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/services/api';

export default {
    data() {
        return {
            totalMessages: 0,
            activeUsers: 0,
        };
    },
    async mounted() {
        try {
            const response = await api.get('/metrics');
            this.totalMessages = response.data.total_messages;
            this.activeUsers = response.data.active_users_last_7_days;
        } catch (error) {
            console.error('Error loading metrics:', error);
        }
    },
};
</script>
