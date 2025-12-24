import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    addDoc,
    collection,
    collectionData,
    deleteDoc,
    doc,
    docData, query,
    updateDoc,
    where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Recipe {
  id?: string;
  title: string;
  ingredients: string;
  photoBase64: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private firestore = inject(Firestore);
  private recipeCollection = collection(this.firestore, 'recipes');

  // --- CRUD ---
  addRecipe(recipe: Recipe) {
    return addDoc(this.recipeCollection, recipe);
  }

  getUserRecipes(userId: string): Observable<Recipe[]> {
    const q = query(this.recipeCollection, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Recipe[]>;
  }

  getRecipeById(id: string): Observable<Recipe> {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    return docData(recipeDoc, { idField: 'id' }) as Observable<Recipe>;
  }

  updateRecipe(id: string, recipe: Partial<Recipe>) {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    return updateDoc(recipeDoc, recipe);
  }

  deleteRecipe(id: string) {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    return deleteDoc(recipeDoc);
  }

  // --- REDUCTION DE L'IMAGE (Technique Canvas) ---
  async processImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // On définit une largeur max de 600px (qualité pro pour mobile)
          const MAX_WIDTH = 600;
          const scale = MAX_WIDTH / img.width;
          
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Compression en JPEG à 60% de qualité (poids divisé par 20 environ)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(dataUrl);
        };
      };
      reader.onerror = (err) => reject(err);
    });
  }

  // Petit utilitaire pour renommer le toDataURL si erreur de frappe au dessus
  private toToDataURL(canvas: HTMLCanvasElement, type: string, quality: number) {
      return canvas.toDataURL(type, quality);
  }
}