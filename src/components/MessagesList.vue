<template>
    <div class="flex-1 p-5 overflow-y-auto bg-gray-100 pb-20">
        <div class="flex justify-center mb-4" v-if="messages.length < totalMessages">
            <button @click="$emit('loadMore')"
                class="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600">
                Carregar mais mensagens
            </button>
        </div>

        <div v-for="message in messages" :key="message.id"
            :class="['p-4 mb-2 rounded-xl max-w-3xl', message.sender_id === currentUser.id ? 'ml-auto bg-yellow-100' : 'mr-auto bg-white']">
            <div class="flex flex-col gap-2">
                <p v-if="message.content" class="text-gray-900">{{ message.content }}</p>
                <div v-if="message.file_url">
                    <img v-if="isImageFile(message.file_url)" :src="getFileUrl(message.file_url)"
                        class="max-w-full max-h-48 object-contain rounded-lg mt-2" />
                    <a v-else :href="getFileUrl(message.file_url)" target="_blank" download
                        class="text-blue-500 underline">{{ getFileName(message.file_url) }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        messages: Array,
        currentUser: Object,
        totalMessages: Number,
    },
    methods: {
        isImageFile(url) {
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
            return imageExtensions.some(extension => url.toLowerCase().endsWith(extension));
        },
        getFileUrl(url) {
            if (url.startsWith('/rails/active_storage')) {
                return `http://localhost:3000${url}`;
            }
            return url;
        },
        getFileName(url) {
            const parts = url.split('/');
            return decodeURIComponent(parts[parts.length - 1]);
        },
    },
};
</script>
