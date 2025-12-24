import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  authState,
  user
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  // Observable pour suivre l'utilisateur en temps réel
  user$ = authState(this.auth);

  // Inscription
  register(email: string, pass: string) {
    return createUserWithEmailAndPassword(this.auth, email, pass);
  }

  // Connexion
  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  // Déconnexion
  logout() {
    return signOut(this.auth);
  }

  // Récupérer l'utilisateur actuel
  get currentUser() {
    return this.auth.currentUser;
  }
}