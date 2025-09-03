import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function ArtigoDetalhes({ route, navigation }) {
  const { artigo } = route.params;

  const salvarFavorito = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado para salvar favoritos.");
      return;
    }

    try {
      await setDoc(
        doc(db, "usuarios", user.uid, "favoritos", artigo.id),
        artigo
      );
      Alert.alert("Sucesso", "Artigo salvo na sua Biblioteca!");
    } catch (error) {
      console.error("Erro ao salvar favorito:", error);
      Alert.alert("Erro", "Não foi possível salvar o artigo.");
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Botão Voltar */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ fontSize: 20, color: 'black', textAlign: 'center' }}>←</Text>
      </TouchableOpacity>

      {/* Imagem */}
      <Image 
        source={{ uri: artigo.imagem }} 
        style={styles.artImage}
        resizeMode="cover"
        onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
      />

      {/* Título */}
      <Text style={styles.titulo}>{artigo.titulo}</Text>

      {/* Conteúdo */}
      <Text style={styles.conteudo}>{artigo.conteudo}</Text>

      {/* Autor e Data */}
      <Text style={styles.autor}>Autor: {artigo.autor}</Text>
      {artigo.dataArt && (
        <Text style={styles.data}>Publicado em: {artigo.dataArt}</Text>
      )}

      {/* Botão de salvar */}
      <TouchableOpacity style={styles.botao} onPress={salvarFavorito}>
        <Text style={styles.botaoTexto}>Salvar na Biblioteca</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 25,
    fontFamily: 'Inter_500Medium',
    marginBottom: 10,
    color: 'black',
    marginTop: 15,
  },
  autor: {
    fontSize: 14,
    marginBottom: 5,
    color: 'gray',
  },
  data: {
    fontSize: 12,
    marginBottom: 20,
    color: '#777',
    fontStyle: 'italic',
  },
  conteudo: {
    fontSize: 16,
    lineHeight: 24,
    color: 'black',
    marginBottom: 20,
    textAlign: 'justify',
  },
  botao: {
    backgroundColor: '#8A38F5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  artImage: {
    width: width - 40, // total width minus padding
    height: 200,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#E9E9E9',
    height: 45,
    width: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});
