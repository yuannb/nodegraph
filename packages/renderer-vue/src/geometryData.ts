import { defineStore } from 'pinia';
export const useEventStore = defineStore('event', {
    state: () => ({
      messages: ''
    }),
    actions: {
      postMessage(message: any) {
        this.messages = message
      }
    }
  });