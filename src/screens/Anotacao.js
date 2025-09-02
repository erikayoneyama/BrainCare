import React, { useState } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function Anotacao({ route, navigation }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Extrai o objeto da anotação dos parâmetros de navegação
  const { anotacao, pacienteNome } = route.params;

  const handleDeleteNote = async () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta anotação? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const noteRef = doc(db, 'notes', anotacao.id);
              await deleteDoc(noteRef);
              Alert.alert("Sucesso", "Anotação excluída com sucesso!");
              navigation.goBack(); // Volta para a tela anterior após a exclusão
            } catch (error) {
              console.error("Erro ao excluir anotação: ", error);
              Alert.alert("Erro", "Ocorreu um erro ao excluir a anotação.");
            }
          }
        }
      ]
    );
  };

  if (!fontsLoaded || !anotacao) {
    return null; // Retorna nulo se as fontes não carregarem ou se a anotação não for encontrada
  }

  // Obter a data formatada
  const dataFormatada = anotacao.createdAt
    ? new Date(anotacao.createdAt.toDate()).toLocaleDateString('pt-BR')
    : 'Data Desconhecida';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
        </View>

        <View style={styles.card}>
            <Text style={styles.tituloText}>Título</Text>
            <View style={styles.tituloView}>
                <Text style={styles.anotacaoTitulo}>{anotacao.titulo}</Text>
            </View>
            
        <View style={styles.cardHeader}>
            <View style={{flexDirection:'row-reverse', marginTop:10}}> 
                <Text style={styles.anotacaoData}>{dataFormatada}</Text>
                <Text style={styles.patientName}> {pacienteNome || 'Paciente Desconhecido'}</Text>
                <Text style={styles.patientNome}> Paciente:</Text>
            </View>
            
        </View>

          <ScrollView style={styles.anotacaoConteudoContainer}>
            <Text style={styles.tituloText}>Anotação</Text>
            <View style={styles.tituloView}>
            <Text style={styles.anotacaoConteudo}>{anotacao.conteudo}</Text>
</View>
<TouchableOpacity onPress={handleDeleteNote} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Apagar anotação</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop:40
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#E9E9E9',
    height: 50,
    width: 50,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  titulo: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    marginLeft: -40, // Centraliza o título
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding:5,
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  anotacaoTitulo: {
    fontSize: 17,
    fontFamily: 'Inter_500Medium',
    color: '#333',
    flexShrink: 1,
    marginLeft:2
    
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#7D00A7',
    marginBottom: 5,
  },
  patientNome: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#000000ff',
    marginBottom: 5,
  },
  anotacaoData: {
    fontSize: 14,
    color: '#999',
    marginTop:3,
    marginLeft:'36%'

  },
  anotacaoConteudoContainer: {
    flex: 1,
  },
  anotacaoConteudo: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#555',
    lineHeight: 24,
  },
  deleteButton: {
    backgroundColor: '#7D00A7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignContent:'center',
    alignItems:'center',
    marginTop:'13%'
  },
  deleteButtonText: {
    color: 'white',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  tituloView:{
    borderWidth:1,
    borderColor:'#c1c0c0ff',
    borderRadius:10,
    padding:10,
    alignContent:'center',
  },
  tituloText:{
    fontFamily:'Inter_400Regular',
    fontSize:13,
    marginBottom:8
  },
  tituloView:{
    borderWidth:1,
    borderColor:'#c1c0c0ff',
    borderRadius:10,
    padding:8,
    alignContent:'center',
  },
});
