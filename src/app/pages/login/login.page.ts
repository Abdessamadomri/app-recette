import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  email = '';
  password = '';
  isRegister = false; // Alterne entre Connexion et Inscription

  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  async submit() {
  // ... (ton code de chargement loader.present)
  try {
    if (this.isRegister) {
      await this.authService.register(this.email, this.password);
    } else {
      await this.authService.login(this.email, this.password);
    }
    
    // Une fois connecté, on change de page
    this.router.navigateByUrl('/home', { replaceUrl: true });
    
  } catch (error) {
    // ... gestion des erreurs
  }
}

  // Traduction des erreurs Firebase pour faire "Pro"
  private translateError(code: string) {
    switch (code) {
      case 'auth/email-already-in-use': return 'Cet email est déjà utilisé.';
      case 'auth/invalid-email': return 'Email invalide.';
      case 'auth/weak-password': return 'Mot de passe trop court (min 6 caractères).';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential': return 'Identifiants incorrects.';
      default: return 'Une erreur est survenue.';
    }
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}