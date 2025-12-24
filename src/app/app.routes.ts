import { Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const toLogin = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // On demande d'aller sur login par défaut
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
    ...canActivate(toLogin) // Seul le Home est protégé
  },
  {
    path: 'recipe-form',
    loadComponent: () => import('./pages/recipe-form/recipe-form.page').then(m => m.RecipeFormPage),
    ...canActivate(toLogin)
  },
  {
    path: 'recipe-form/:id',
    loadComponent: () => import('./pages/recipe-form/recipe-form.page').then(m => m.RecipeFormPage),
    ...canActivate(toLogin)
  }
];