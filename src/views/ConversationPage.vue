<template>
    <div class="flex flex-col h-screen">
        <div class="bg-white shadow p-4 border-b">
            <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                <img :src="userIcon" alt="User Icon" class="w-6 h-6" />
                {{ receiverName }}
            </h1>
        </div>

        <MessagesList :messages="messages" :currentUser="currentUser" :totalMessages="totalMessages"
            @loadMore="loadMoreMessages" />

        <form @submit.prevent="sendMessage"
            class="flex p-3 bg-white border-t border-gray-300 fixed bottom-0 left-0 w-full">
            <input v-model="newMessage" type="text" placeholder="Digite uma mensagem..."
                class="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-600" />
            <input type="file" @change="handleFileChange" class="ml-3" />
            <button type="submit"
                class="px-4 py-2 ml-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600">
                Enviar
            </button>
        </form>
    </div>
</template>


<script>
import MessagesList from '@/components/MessagesList.vue';
import api from '@/services/api';
import * as ActionCable from '@rails/actioncable';

export default {
    components: {
        MessagesList,
    },
    data() {
        return {
            messages: [],
            newMessage: '',
            totalMessages: 0,
            selectedFile: null,
            currentUser: null,
            cableConnection: null,
            userChannel: null,
            page: 1,
            isLoading: false,
            receiverName: '',
            userIcon: require('@/assets/user.svg'),
        };
    },
    async mounted() {
        await this.fetchCurrentUser();
        await this.fetchReceiverName();
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
        async fetchReceiverName() {
            const receiverId = this.$route.params.id;
            const response = await api.get(`/users/${receiverId}`);
            this.receiverName = response.data.name;
        },
        async fetchMessages() {
            if (!this.currentUser || this.isLoading) return;

            this.isLoading = true;
            const receiverId = this.$route.params.id;

            try {
                const response = await api.get('/messages', {
                    params: {
                        page: this.page,
                        sender_id: this.currentUser.id,
                        receiver_id: receiverId,
                    },
                });

                this.messages = [...response.data.messages.reverse(), ...this.messages];
                this.totalMessages = response.data.total_count;
            } catch (error) {
                console.error('Error loading messages:', error);
            } finally {
                this.isLoading = false;
            }
        },
        async loadMoreMessages() {
            this.page += 1;
            await this.fetchMessages();
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
    },
};
</script>
