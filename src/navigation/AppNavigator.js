// src/navigation/AppNavigator.js

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Importe os navegadores que você vai usar
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

export default function AppNavigator() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return subscriber;
  }, []);

  // Removido o <NavigationContainer> daqui
  return user ? (
    // Se o 'user' existir, o usuário está logado. Mostre o menu principal.
    <MainTabs />
  ) : (
    // Se 'user' for nulo, o usuário não está logado. Mostre a navegação de autenticação.
    <AuthStack />
  );
}