<template>
    <div class="flex flex-col">
        <div class="flex-1 p-5 overflow-y-auto bg-gray-100 pb-20">
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

        <form @submit.prevent="sendMessage"
            class="flex p-3 bg-white border-t border-gray-300 fixed bottom-0 left-0 w-full">
            <input v-model="newMessage" type="text" placeholder="Digite uma mensagem..."
                class="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="file" @change="handleFileChange" class="ml-3" />
            <button type="submit"
                class="px-4 py-2 ml-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Enviar
            </button>
        </form>
    </div>
</template>



<script>
import api from '@/services/api';
import * as ActionCable from '@rails/actioncable';

export default {
    data() {
        return {
            messages: [],
            newMessage: '',
            totalMessages: 0,
            selectedFile: null,
            currentUser: null,
            cableConnection: null,
            userChannel: null,
        };
    },
    async mounted() {
        await this.fetchCurrentUser();
        await this.fetchMessages();
        this.setupActionCable();
    },
    beforeDestroy() {
        if (this.userChannel) {
            this.userChannel.unsubscribe();
        }
    },
    methods: {
        async fetchCurrentUser() {
            const response = await api.get('/me');
            this.currentUser = response.data;
        },
        async fetchMessages() {
            if (!this.currentUser) return;
            const receiverId = this.$route.params.id;
            const response = await api.get('/messages', {
                params: {
                    page: 1,
                    sender_id: this.currentUser.id,
                    receiver_id: receiverId,
                },
            });
            this.messages = response.data.messages;
            this.totalMessages = response.data.total_count;
        },
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        async sendMessage() {
            if (!this.newMessage && !this.selectedFile) return;

            const formData = new FormData();
            formData.append('receiver_id', this.$route.params.id);
            if (this.newMessage) formData.append('content', this.newMessage);
            if (this.selectedFile) formData.append('file', this.selectedFile);

            try {
                const response = await api.post('/messages', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                this.messages.push(response.data);
                this.newMessage = '';
                this.selectedFile = null;
                this.$nextTick(() => {
                    const fileInput = this.$el.querySelector('input[type="file"]');
                    if (fileInput) {
                        fileInput.value = '';
                    }
                });
            } catch (error) {
                console.error('Error sending message', error);
            }
        },
        setupActionCable() {
            this.cableConnection = ActionCable.createConsumer(`ws://localhost:3000/cable`);

            this.userChannel = this.cableConnection.subscriptions.create(
                { channel: 'UserChannel', user_id: this.currentUser.id },
                {
                    received: (data) => {
                        const receiverId = this.$route.params.id;
                        if (String(data.sender_id) === receiverId || String(data.receiver_id) === receiverId) {
                            this.messages.push(data);
                        }
                    },
                }
            );
        },
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
            const fileName = parts[parts.length - 1];
            return decodeURIComponent(fileName);
        }
    },
};
</script>
