// src/screens/LoginScreen.js

import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, TextInput, ScrollView, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Importe a instância do auth
import SofaImage from '../../assets/sofa.png'; 
// Renomeado para seguir a convenção
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Se o login for bem-sucedido, o AppNavigator já vai detectar e redirecionar
    } catch (error) {
      Alert.alert('Erro de Login', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
        
        <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        
        </TouchableOpacity>

        <View style={styles.imagemView}>
           <Image source={SofaImage} style={styles.imagem} />
        </View>

        <View style={styles.textoView}>
          <Text style={styles.tituloText}>Entre em sua conta</Text>
        </View>
        <View style={styles.camposView}>
          <Text style={styles.camposText}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.camposText}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#aaa"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Redefinicao')}>
            <Text style={styles.redefinirText}>Esqueci minha senha</Text>
        </TouchableOpacity>
        <View style={styles.botoesView}>
          <TouchableOpacity 
            style={styles.loginBottom}
            onPress={handleLogin}
          >
            <Text style={styles.loginText}>Entrar na conta</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cadastroBottom}
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={styles.cadastroText1}>Ainda não possui uma conta?</Text>
            <Text style={styles.cadastroText}>Cadastre-se agora</Text>
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
  scrollContainer: {
    flexGrow: 1,
    padding: 15,
  },
  imagemView: {
    height: 250,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20
  },
  imagem: {
    height: 290,
    width: 257,
    alignSelf: 'center',
    marginBottom:70, 
    marginTop:70
  },
  textoView: {
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    marginLeft: 12,
    marginBottom: 15,
    marginTop:60
  },
  tituloText: {
    fontSize: 20,
    fontFamily: 'Inter_500Medium',
    marginLeft: -9,
    marginTop:-15
  },
  camposView: {
    justifyContent: 'center',
    alignContent: 'center',
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
    borderRadius: 10,
    fontSize: 16,
    width: '90%',
    height: 45,
    alignSelf: 'center',
    paddingLeft: 10,
  },
  botoesView: {
    alignContent: 'center',
    padding: 1,
    marginBottom: 20,
  },
  loginBottom: {
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
  loginText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  cadastroBottom: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
  },
  cadastroText: {
    textDecorationLine: 'underline',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
   color: '#7D00A7',
    marginLeft: 5,
  },
  cadastroText1: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'black',
  },
  backButton:{
    backgroundColor:'#E9E9E9',
    height:50, 
    width:50,
    borderRadius: 10,
    marginTop:30,
    marginLeft:20
  },
  redefinirText: {
    textDecorationLine: 'underline',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#7D00A7',
    marginLeft: 10,
    marginLeft:225,
    marginTop:10,
    marginBottom:-12
  },
});