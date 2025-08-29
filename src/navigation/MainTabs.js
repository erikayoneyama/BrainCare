// src/navigation/MainTabs.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importar telas
import Home from '../screens/Home';
import Pacientes from '../screens/Pacientes';
import Criar from '../screens/Criar';
import Agenda from '../screens/Agenda';
import Configuracoes from '../screens/Configuracoes';


const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Pacientes" component={Pacientes} />
      <Tab.Screen name="Criar" component={Criar} />
      <Tab.Screen name="Agenda" component={Agenda} />
      <Tab.Screen name="Configuracoes" component={Configuracoes} />
    </Tab.Navigator>
  );
}