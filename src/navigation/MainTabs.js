import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar telas
import HomeScreen from '../screens/Home';
import PacientesScreen from '../screens/Pacientes';
import CriarScreen from '../screens/Criar';
import CriarEventoScreen from '../screens/CriarEvento';
import AgendaScreen from '../screens/Agenda';
import ConfiguracoesScreen from '../screens/Configuracoes';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Crie uma Stack Navigator para a aba "Criar"
function CriarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Criar" component={CriarScreen} />
      <Stack.Screen name="CriarEvento" component={CriarEventoScreen} />
    </Stack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Pacientes" component={PacientesScreen} options={{ headerShown: false }} />
      <Tab.Screen 
        name="CriarTab" 
        component={CriarStack} 
        options={{ headerShown: false, title: 'Criar' }} 
      />
      <Tab.Screen name="Agenda" component={AgendaScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Configuracoes" component={ConfiguracoesScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
