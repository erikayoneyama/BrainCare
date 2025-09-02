import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar telas
import HomeScreen from '../screens/Home';
import PacientesScreen from '../screens/Pacientes';
import CriarScreen from '../screens/Criar';
import CriarEventoScreen from '../screens/CriarEvento';
import AddPaciente from '../screens/AddPaciente';
import AgendaScreen from '../screens/Agenda';
import ConfiguracoesScreen from '../screens/Configuracoes';
import Evento from '../screens/Evento';
import CriarAnotacaoScreen from '../screens/CriarAnotacao';
import Anotacoes from '../screens/Anotacoes';
import Anotacao from '../screens/Anotacao';
import ArtigoDetalhes from '../screens/ArtigoDetalhes';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack dentro da aba Criar
function CriarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Criar" component={CriarScreen} />
      <Stack.Screen name="CriarEvento" component={CriarEventoScreen} />
      <Stack.Screen name="AddPaciente" component={AddPaciente} />
      <Stack.Screen name="CriarAnotacao" component={CriarAnotacaoScreen} />
      <Stack.Screen name="Evento" component={Evento} />
    </Stack.Navigator>
  );
}

// Tabs principais
function Tabs() {
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

// Stack global envolvendo Tabs
export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs principais */}
      <Stack.Screen name="MainTabs" component={Tabs} />
      
      {/* Telas globais acessíveis de qualquer lugar */}
      <Stack.Screen name="Anotacoes" component={Anotacoes} />
      <Stack.Screen name="Anotacao" component={Anotacao} />
      <Stack.Screen name="ArtigoDetalhes" component={ArtigoDetalhes} />
    </Stack.Navigator>
  );
}
