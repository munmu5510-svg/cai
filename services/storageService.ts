import { User, BusinessConcept, ChatMessage } from '../types';

const USERS_KEY = 'concept_ai_users';
const CURRENT_USER_KEY = 'concept_ai_current_user';
const CONCEPTS_KEY = 'concept_ai_concepts';
const CHAT_HISTORY_KEY = 'cai_chat_history';

export const storageService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      storageService.saveUser(user);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  getConcepts: (userId: string): BusinessConcept[] => {
    const userConceptsKey = `${CONCEPTS_KEY}_${userId}`;
    const userData = localStorage.getItem(userConceptsKey);
    return userData ? JSON.parse(userData) : [];
  },

  saveConcept: (userId: string, concept: BusinessConcept) => {
    const concepts = storageService.getConcepts(userId);
    const index = concepts.findIndex(c => c.id === concept.id);
    if (index >= 0) {
      concepts[index] = concept;
    } else {
      concepts.push(concept);
    }
    localStorage.setItem(`${CONCEPTS_KEY}_${userId}`, JSON.stringify(concepts));
  },

  getChatHistory: (userId: string): ChatMessage[] => {
    const key = `${CHAT_HISTORY_KEY}_${userId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  saveChatHistory: (userId: string, messages: ChatMessage[]) => {
    const key = `${CHAT_HISTORY_KEY}_${userId}`;
    localStorage.setItem(key, JSON.stringify(messages));
  },

  clearChatHistory: (userId: string) => {
    const key = `${CHAT_HISTORY_KEY}_${userId}`;
    localStorage.removeItem(key);
  }
};