import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ArtigoDetalhes({ route }) {
  const { artigo } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>{artigo.titulo}</Text>
      <Text style={styles.autor}>Autor: {artigo.autor}</Text>
      <Text style={styles.conteudo}>{artigo.conteudo}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  autor: {
    fontSize: 14,
    marginBottom: 20,
    color: 'gray',
  },
  conteudo: {
    fontSize: 16,
    lineHeight: 24,
    color: 'black',
  },
});
