import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { AuthService } from '../services/auth.service'; // <--- Vérifie bien le chemin
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class HomePage {
  // On injecte les services ici
  private recipeService = inject(RecipeService);
  public authService = inject(AuthService); // <--- C'est cette ligne qui manquait !
  private router = inject(Router);

  // Charger les recettes de l'utilisateur connecté
  recipes$ = this.authService.user$.pipe(
    switchMap(user => {
      if (user) {
        return this.recipeService.getUserRecipes(user.uid);
      }
      return [];
    })
  );

  constructor() {}

  async deleteRecipe(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette recette ?')) {
      await this.recipeService.deleteRecipe(id);
    }
  }

  // Fonction de déconnexion
  async logout() {
    await this.authService.logout();
    // Après déconnexion, on redirige vers le login
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}