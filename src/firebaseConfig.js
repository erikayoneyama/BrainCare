import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBg3dN3toxI75_o_iOWBkAAO4wD-FPZAWo",
  authDomain: "brain-1f34d.firebaseapp.com",
  projectId: "brain-1f34d",
  storageBucket: "brain-1f34d.firebasestorage.app",
  messagingSenderId: "339139492327",
  appId: "1:339139492327:web:d77d26ca8e3496a17a6542"
};

// Garante que não inicialize duas vezes
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa Auth só se ainda não estiver inicializado
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  // Se já estiver inicializado, pega a instância existente
  if (e.code === "auth/already-initialized") {
    const { getAuth } = require("firebase/auth");
    auth = getAuth(app);
  } else {
    throw e;
  }
}

// Firestore
const db = getFirestore(app);

export { auth, db };
