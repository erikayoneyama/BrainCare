// src/screens/Cadastro.js

import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, TextInput, ScrollView, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Importe a função do Firebase
import { auth } from '../firebaseConfig'; // Importe a instância do auth
import SofaImage from '../../assets/sofa.png'; 
// Renomeado para seguir a convenção de nomenclatura
export default function Cadastro({ navigation }) { 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    // 1. Verifique se as senhas são iguais
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    try {
      // 2. Tente criar o usuário no Firebase
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Sucesso!', 'Conta criada com sucesso!');
      
    } catch (error) {
      // Exiba um alerta caso ocorra um erro no cadastro
      Alert.alert('Erro no Cadastro', error.message);
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
          <Text style={styles.tituloText}>Crie uma conta</Text>
        </View>

        <View style={styles.camposView}>
          <Text style={styles.camposText}>Nome de usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu usuário"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.camposText}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.camposText}>Crie sua senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#aaa"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.camposText}>Confirme a sua senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirme sua senha"
            placeholderTextColor="#aaa"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <View style={styles.botoesView}>
          <TouchableOpacity 
            style={styles.cadastroBottom}
            onPress={handleRegister}
          >
            <Text style={styles.cadastroText}>Criar uma conta</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.loginBottom}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText1}>Já possui uma conta?</Text>
            <Text style={styles.loginText}>Entre agora</Text>
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
  backButton:{
    backgroundColor:'#E9E9E9',
    height:50, 
    width:50,
    borderRadius: 10,
    marginTop:30,
    marginLeft:20
  },
  imagemView: {
    height: 250,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop:-20
  },
  imagem: {
    height: 220,
    width: 190,
    alignSelf: 'center',
  },
  textoView: {
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    marginLeft: 12,
    marginBottom: 15,
  },
  tituloText: {
    fontSize: 20,
    fontFamily: 'Inter_500Medium',
    marginLeft: -7,
    marginTop:-6,
    marginBottom:-13
  },
  camposView: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  camposText: {
    fontSize: 13,
    color: 'black',
    fontFamily: 'Inter_400Regular',
    marginLeft: 22,
    marginBottom: 5,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#E9E9E9',
    borderRadius: 12,
    fontSize: 16,
    width: '90%',
    height: 43,
    alignSelf: 'center',
    paddingLeft: 10,
  },
  botoesView: {
    alignContent: 'center',
    padding: 1,
    marginTop: 10,
    marginBottom: 20,
  },
  cadastroBottom: {
    backgroundColor: '#7D00A7',
    width: '90%',
    height: 45,
    borderRadius: 10,
    marginTop: 30,
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
  loginBottom: {
    height: 30,
    width: '100%',
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
    justifyContent:'center'
  },
  loginText: {
    textDecorationLine: 'underline',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'black',
    marginLeft: 10,
  },
  loginText1: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'black',
  },
  
});