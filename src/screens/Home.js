import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Importa a autenticação
import { doc, getDoc, getFirestore } from 'firebase/firestore'; // Importa o Firestore
import { auth, db } from '../firebaseConfig'; // Importe as instâncias do auth e db

export default function Home({ navigation }) {
  const [userName, setUserName] = useState(''); // Estado para armazenar o nome do usuário

  useEffect(() => {
    // Escuta as mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Se o usuário estiver logado, tenta pegar o nome do perfil
        if (user.displayName) {
          setUserName(user.displayName);
        } else {
          // Se o nome não estiver no perfil, busca no Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
          }
        }
      } else {
        // Se o usuário não estiver logado, limpa o nome
        setUserName('');
      }
    });

    // Retorna a função de "limpeza" para parar de escutar
    return unsubscribe;
  }, []);

  const handleGoToPatients = () => {
    navigation.navigate('Pacientes'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        {userName ? `Olá, ${userName}!` : 'Bem-vindo à tela inicial!'}
      </Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
