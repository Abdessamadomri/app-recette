import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// IMPORTANT : Importe initializeApp depuis @angular/fire/app
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Ton objet de config que tu as reçu
const firebaseConfig = {
  apiKey: "AIzaSyDOYpjTWrs1ooqxBd38OfgEOi_96h05bzM",
  authDomain: "app-recette-64cfa.firebaseapp.com",
  projectId: "app-recette-64cfa",
  storageBucket: "app-recette-64cfa.firebasestorage.app",
  messagingSenderId: "22492192674",
  appId: "1:22492192674:web:b61c924bb13dd49bbfdcfb"
};

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),

    // Initialisation correcte pour Angular Standalone
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
});