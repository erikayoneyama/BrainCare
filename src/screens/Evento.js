import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Image 
} from 'react-native';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons'; 
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Import das imagens
import dataImage from '../../assets/data.png'; 
import horaImage from '../../assets/hora.png'; 

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

  const handleDeleteEvento = async () => {
    try {
      await deleteDoc(doc(db, "events", evento.id));
      console.log("Evento apagado:", evento.id);
      navigation.goBack(); // volta para a agenda
    } catch (error) {
      console.error("Erro ao apagar evento:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Botão voltar */}
        <TouchableOpacity 
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* Nome do evento */}
        <Text style={styles.title}>{evento.nome}</Text>

        {/* Data */}
        <View style={styles.infoContainer}>
          <Image source={dataImage} style={styles.imagem} />
          <Text style={styles.infoText}>{evento.data}</Text>
        </View>

        {/* Hora */}
        <View style={styles.infoContainer}>
          <Image source={horaImage} style={styles.imagem} />
          <Text style={styles.infoText}>{evento.hora}</Text>
        </View>

        {/* Descrição */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.descriptionText}>{evento.descricao}</Text>
        </View>

        {/* Botão apagar evento */}
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.7}
          onPress={handleDeleteEvento}
        >
          <Text style={styles.buttonText}>Apagar evento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 35,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 35,
    fontFamily: 'Inter_500Medium',
    color: '#000',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'left',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imagem: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    marginRight: 10,
    marginBottom:10
  },
  infoText: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: '#333',
  },
  descriptionContainer: {
    marginTop: 25,
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
    marginTop: 30,
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
  backButton: {
    backgroundColor: '#E9E9E9',
    height: 50, 
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});
