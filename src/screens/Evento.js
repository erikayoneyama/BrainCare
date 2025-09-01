import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

export default function Evento({ navigation, route }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { evento } = route.params;

  if (!evento) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Evento não encontrado.</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{evento.nome}</Text>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.infoText}>{evento.data}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Hora:</Text>
            <Text style={styles.infoText}>{evento.hora}</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.descriptionText}>{evento.descricao}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar para Agenda</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#8A38F5',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    marginRight: 10,
  },
  infoText: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: '#333',
  },
  descriptionContainer: {
    marginTop: 15,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#555',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#8A38F5',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#fff',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    marginTop: 50,
  },
});
