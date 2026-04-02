import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { db } from '../firebase';
import { PageContent, PortfolioItem, Stat, SiteSettings } from '../types';

const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
} as const;

type OperationType = typeof OperationType[keyof typeof OperationType];

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error(`Firestore Error [${operationType}] at [${path}]:`, error);
  throw error;
}

export const contentService = {
  // Pages
  async getPageBySlug(slug: string): Promise<PageContent | null> {
    try {
      const q = query(collection(db, 'pages'), where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as PageContent;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `pages/slug/${slug}`);
      return null;
    }
  },

  async getAllPages(): Promise<PageContent[]> {
    try {
      const snapshot = await getDocs(collection(db, 'pages'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PageContent));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'pages');
      return [];
    }
  },

  // Portfolio
  async getPortfolioItems(onlyPublished = true): Promise<PortfolioItem[]> {
    try {
      let q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
      if (onlyPublished) {
        q = query(q, where('published', '==', true));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'portfolio');
      return [];
    }
  },

  async getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | null> {
    try {
      const q = query(collection(db, 'portfolio'), where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as PortfolioItem;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `portfolio/slug/${slug}`);
      return null;
    }
  },

  // Stats
  async getStats(): Promise<Stat[]> {
    try {
      const q = query(collection(db, 'stats'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Stat));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'stats');
      return [];
    }
  },

  // Settings
  async getSettings(): Promise<SiteSettings | null> {
    try {
      const docRef = doc(db, 'settings', 'main');
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return { id: 'main', ...snapshot.data() } as SiteSettings;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'settings/main');
      return null;
    }
  },

  // Admin Actions
  async savePortfolioItem(item: Partial<PortfolioItem>): Promise<string> {
    try {
      const data = {
        ...item,
        updatedAt: serverTimestamp(),
      };
      if (item.id) {
        const docRef = doc(db, 'portfolio', item.id);
        await updateDoc(docRef, data);
        return item.id;
      } else {
        const docRef = await addDoc(collection(db, 'portfolio'), {
          ...data,
          createdAt: serverTimestamp(),
        });
        return docRef.id;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'portfolio');
      throw error;
    }
  },

  async deletePortfolioItem(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'portfolio', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `portfolio/${id}`);
      throw error;
    }
  },

  async savePage(page: Partial<PageContent>): Promise<string> {
    try {
      const data = {
        ...page,
        updatedAt: serverTimestamp(),
      };
      if (page.id) {
        const docRef = doc(db, 'pages', page.id);
        await updateDoc(docRef, data);
        return page.id;
      } else {
        const docRef = await addDoc(collection(db, 'pages'), data);
        return docRef.id;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'pages');
      throw error;
    }
  },

  async deletePage(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'pages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `pages/${id}`);
      throw error;
    }
  },

  async saveSettings(settings: Partial<SiteSettings>): Promise<void> {
    try {
      const docRef = doc(db, 'settings', 'main');
      await updateDoc(docRef, settings);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/main');
      throw error;
    }
  },

  async testConnection() {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log('Firestore connection successful');
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  }
};
