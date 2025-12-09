import { db } from './firebase';
import { ref, get, set, child, push, update } from 'firebase/database';
import { User, BusinessConcept, ChatMessage } from '../types';

export const storageService = {
  // --- Users ---
  getUserProfile: async (userId: string): Promise<User | null> => {
    try {
      const snapshot = await get(child(ref(db), `users/${userId}`));
      if (snapshot.exists()) {
        return snapshot.val() as User;
      }
      return null;
    } catch (e) {
      console.error("Error fetching user profile:", e);
      return null;
    }
  },

  saveUser: async (user: User): Promise<void> => {
    try {
      await set(ref(db, `users/${user.id}`), user);
    } catch (e) {
      console.error("Error saving user profile:", e);
      throw e;
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const snapshot = await get(ref(db, 'users'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.values(data);
      }
      return [];
    } catch (e) {
      console.error("Error fetching all users:", e);
      return [];
    }
  },

  // --- Concepts ---
  getConcepts: async (userId: string): Promise<BusinessConcept[]> => {
    try {
      const snapshot = await get(child(ref(db), `concepts/${userId}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.values(data);
      }
      return [];
    } catch (e) {
      console.error("Error fetching concepts:", e);
      return [];
    }
  },

  saveConcept: async (userId: string, concept: BusinessConcept): Promise<void> => {
    try {
      // Use concept.id as key, or push for new ID. We use concept.id here.
      await set(ref(db, `concepts/${userId}/${concept.id}`), concept);
    } catch (e) {
      console.error("Error saving concept:", e);
      throw e;
    }
  },

  // --- Chat History ---
  getChatHistory: async (userId: string): Promise<ChatMessage[]> => {
    try {
      const snapshot = await get(child(ref(db), `chats/${userId}`));
      if (snapshot.exists()) {
        return snapshot.val() as ChatMessage[];
      }
      return [];
    } catch (e) {
      console.error("Error fetching chat history:", e);
      return [];
    }
  },

  saveChatHistory: async (userId: string, messages: ChatMessage[]): Promise<void> => {
    try {
      await set(ref(db, `chats/${userId}`), messages);
    } catch (e) {
      console.error("Error saving chat history:", e);
    }
  },

  clearChatHistory: async (userId: string): Promise<void> => {
    try {
      await set(ref(db, `chats/${userId}`), null);
    } catch (e) {
      console.error("Error clearing chat history:", e);
    }
  }
};