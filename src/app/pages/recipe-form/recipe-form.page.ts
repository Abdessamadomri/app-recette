import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService, Recipe } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.page.html',
  styleUrls: ['./recipe-form.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecipeFormPage implements OnInit {
  recipe: Recipe = { title: '', ingredients: '', photoBase64: '', userId: '' };
  recipeId: string | null = null;

  private recipeService = inject(RecipeService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  ngOnInit() {
    // Vérifier si un ID est passé dans l'URL pour la modification
    this.recipeId = this.route.snapshot.paramMap.get('id');
    if (this.recipeId) {
      this.loadRecipeData();
    }
  }

  loadRecipeData() {
    this.recipeService.getRecipeById(this.recipeId!).subscribe(data => {
      if (data) this.recipe = data;
    });
  }

  async uploadPhoto(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const loader = await this.loadingCtrl.create({ message: 'Optimisation de l\'image...' });
    await loader.present();

    try {
      // Appel du service pour réduire et convertir l'image
      this.recipe.photoBase64 = await this.recipeService.processImage(file);
    } catch (error) {
      this.presentToast('Erreur lors du traitement de l\'image', 'danger');
    } finally {
      loader.dismiss();
    }
  }

  async save() {
    if (!this.recipe.title || !this.recipe.ingredients) {
      this.presentToast('Veuillez remplir les champs obligatoires', 'warning');
      return;
    }

    const loader = await this.loadingCtrl.create({ message: 'Enregistrement...' });
    await loader.present();

    try {
      if (this.recipeId) {
        // MISE À JOUR
        await this.recipeService.updateRecipe(this.recipeId, this.recipe);
        this.presentToast('Recette mise à jour !', 'success');
      } else {
        // NOUVELLE RECETTE
        this.recipe.userId = this.authService.currentUser?.uid || '';
        await this.recipeService.addRecipe(this.recipe);
        this.presentToast('Recette ajoutée !', 'success');
      }
      this.router.navigate(['/home']);
    } catch (error) {
      this.presentToast('Erreur lors de l\'enregistrement', 'danger');
    } finally {
      loader.dismiss();
    }
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg, duration: 2000, color: color, position: 'bottom'
    });
    toast.present();
  }
}