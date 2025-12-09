import { User, BusinessConcept } from '../types';

const USERS_KEY = 'concept_ai_users';
const CURRENT_USER_KEY = 'concept_ai_current_user';
const CONCEPTS_KEY = 'concept_ai_concepts';

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
    const data = localStorage.getItem(CONCEPTS_KEY);
    const allConcepts: BusinessConcept[] = data ? JSON.parse(data) : [];
    // Filter concepts usually, but here we might just simulate a simple list per user key if we wanted strict separation.
    // For simplicity in this demo, we'll store all and filter by logic if needed, but let's assume local storage is per browser instance for now or just filter by ID if we add userId to concept.
    // Let's add userId to storage key to separate or filter.
    // Since we didn't put userId in BusinessConcept in types, let's just use a separate key per user for simplicity or just return all for the demo user.
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
  }
};
