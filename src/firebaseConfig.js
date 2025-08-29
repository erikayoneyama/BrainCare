// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Adicione esta linha para importar o serviço de autenticação

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBg3dN3toxI75_o_iOWBkAAO4wD-FPZAWo",
  authDomain: "brain-1f34d.firebaseapp.com",
  projectId: "brain-1f34d",
  storageBucket: "brain-1f34d.firebasestorage.app",
  messagingSenderId: "339139492327",
  appId: "1:339139492327:web:d77d26ca8e3496a17a6542"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Obtenha a instância de autenticação
export const auth = getAuth(app); // Adicione esta linha para exportar o auth