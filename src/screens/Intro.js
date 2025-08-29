// src/screens/IntroScreen.js

import React from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import PlantaImage from '../../assets/planta.png'; 

export default function IntroScreen({ navigation }) {
  // Remova a lógica de carregamento de fontes daqui, pois já está no App.js
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imagemView}>
        <Image source={PlantaImage} style={styles.imagem} />
      </View>
      
      <View style={styles.textoView}>
        <View style={styles.tituloView}>
          <Text style={styles.tituloText}> Bem-vindo ao </Text>
          <Text style={styles.brainCare}>BrainCare</Text>
        </View>
        <Text style={styles.introText}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Sit amet consectetur adipiscing elit quisque faucibus ex. Adipiscing elit quisque faucibus ex sapien vitae pellentesque.
        </Text>
      </View>

      <View style={styles.botoesView}>
        {/* Adicione a navegação aqui */}
        <TouchableOpacity 
          style={styles.cadastroBottom} 
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.cadastroText}>
            Criar uma conta
          </Text>
        </TouchableOpacity>

        {/* Adicione a navegação aqui */}
        <TouchableOpacity 
          style={styles.loginBottom}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginoText}>
            Entrar em uma conta
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (seus estilos aqui)
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#white',
    padding: 8,
  },
  imagemView:{
    justifyContent:'center',
    height:'56%',
    width:'100%'
  },
  imagem:{
    height:310,
    width:250,
    alignSelf:'center',
    marginBottom:120
  },
  textoView:{
    justifyContent:'center',
    width:'90%',
    alignSelf:'center'
  },
  tituloView:{
    flexDirection: 'row',
    marginBottom:15
  },
  brainCare:{
    fontSize:20,
    fontFamily:'Inter_700Bold'
  },
  tituloText:{
  fontSize:20,
    fontFamily:'Inter_500Medium',
    marginLeft:-7
  },
  introText:{
    color: 'black',
    fontSize:12,
    alignSelf:'center',
    fontFamily:'Inter_400Regular',
    textAlign: 'justify'
  },
  botoesView:{
    alignContent:'center',
    padding:1,
    marginTop:10
  },
  cadastroBottom:{
    backgroundColor:'#7D00A7',
    width:'90%',
    height:45,
    borderRadius:10,
    marginTop:20,
    alignSelf:'center',
    alignContent:'center',
    alignItems:'center', 
    justifyContent: 'center'
  },
  loginBottom:{
    backgroundColor:'white',
    width:'90%',
    height:43.6,
    borderWidth: 1.4, 
    borderColor:'#7D00A7',
    borderRadius:10,
    marginTop:20,
    alignSelf:'center',
    alignContent:'center',
    alignItems:'center', 
    justifyContent: 'center'
  },
  cadastroText:{
    color: 'white',
    fontSize:15,
    fontFamily:'Inter_400Regular'
  },
  loginoText:{
    color: '#7D00A7',
    fontSize:15,
    alignSelf:'center',
    fontFamily:'Inter_400Regular'
  }
});