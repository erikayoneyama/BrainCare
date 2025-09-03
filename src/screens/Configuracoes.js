import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../firebaseConfig'; // caminho do seu firebaseConfig
import { signOut } from 'firebase/auth';

export default function Configuracoes({ navigation }) {
  
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Logout realizado, navega para a tela Intro
        
      })
      .catch((error) => {
        Alert.alert('Erro ao deslogar', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Configurações</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#FF4D4D',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
