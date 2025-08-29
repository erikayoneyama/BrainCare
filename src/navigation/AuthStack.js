// src/navigation/AuthStack.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importe as telas
import Intro from '../screens/Intro';
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import Redefinicao from '../screens/Redefincao';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Redefinicao" component={Redefinicao} />
    </Stack.Navigator>
  );
}