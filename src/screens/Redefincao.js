// src/screens/Redefinicao.js

import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View, TextInput, Alert, ScrollView } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth'; // Importe a função do Firebase
import { auth } from '../firebaseConfig'; // Importe a instância do Firebase Auth

export default function Redefinicao({ navigation }) {
  const [email, setEmail] = useState('');

  // Função para enviar o e-mail de redefinição de senha
  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('E-mail enviado', 'Verifique sua caixa de entrada para redefinir sua senha.');
      // Opcional: Navegar de volta para a tela de login
      // navigation.navigate('Login'); 
    } catch (error) {
      // Exibe um erro se o e-mail não for encontrado ou se houver um problema de conexão
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              
              </TouchableOpacity>

        <View style={styles.textoView}>
          <Text style={styles.tituloText}>Redefinir senha</Text>
          <Text style={styles.boldText}>Insira o seu e-mail</Text>
          <Text style={styles.textoText}>Ao inserir seu e-mail no campo abaixo, enviaremos um código para você.</Text>
        </View>

        <Text style={styles.camposText}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <View style={styles.botoesView}>
          <TouchableOpacity 
            style={styles.cadastroBottom}
            onPress={handlePasswordReset} // VINCULE O BOTÃO À FUNÇÃO
          >
            <Text style={styles.cadastroText}>Confirmar e-mail</Text>
          </TouchableOpacity>
        </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 8,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 15,
  },
  textoView: {
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    marginLeft: 12,
    marginBottom: 20,
  },
  tituloText: {
    fontSize: 24,
    fontFamily: 'Inter_500Medium',
    marginLeft: -7,
    marginTop:260,
    marginBottom:40
  },
  boldText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    marginLeft:-5,
    marginBottom:10
  },
  textoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    marginLeft:-5
  },
  camposText: {
    fontSize: 13,
    color: 'black',
    fontFamily: 'Inter_400Regular',
    marginLeft: 20,
    marginBottom: 5,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#E9E9E9',
    borderRadius: 12,
    fontSize: 16,
    width: '90%',
    height: 45,
    alignSelf: 'center',
    paddingLeft: 10,
  },
  botoesView: {
    alignContent: 'center',
    padding: 1,
    marginTop: 15,
    marginBottom: 20,
  },
  cadastroBottom: {
    backgroundColor: '#7D00A7',
    width: '90%',
    height: 45,
    borderRadius: 10,
    marginTop: 40,
    marginBottom: 20,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cadastroText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  backButton:{
    backgroundColor:'#E9E9E9',
    height:50, 
    width:50,
    borderRadius: 10,
    marginTop:30,
    marginLeft:20
  },
});