import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View, TextInput, ScrollView, Platform, Alert } from 'react-native';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore'; // Importe as funções do Firestore
import { auth, db } from '../firebaseConfig'; // Importe as instâncias do auth e db

export default function CriarEvento({ navigation }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [nomeEvento, setNomeEvento] = useState('');
  const [descricao, setDescricao] = useState('');
  
  const [dataEvento, setDataEvento] = useState(new Date());
  const [horaEvento, setHoraEvento] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Escuta a mudança de estado do usuário para obter o ID
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dataEvento;
    setShowDatePicker(Platform.OS === 'ios');
    setDataEvento(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || horaEvento;
    setShowTimePicker(Platform.OS === 'ios');
    setHoraEvento(currentTime);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const handleAdicionarEvento = async () => {
    if (!nomeEvento.trim() || !descricao.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o nome e a descrição do evento.');
      return;
    }

    if (!userId) {
        Alert.alert('Erro', 'Usuário não autenticado. Por favor, faça login.');
        return;
    }

    try {
      const eventoRef = collection(db, 'events');
      await addDoc(eventoRef, {
        nome: nomeEvento,
        descricao: descricao,
        data: dataEvento,
        hora: horaEvento,
        userId: userId, // Salva o ID do usuário que criou o evento
      });

      Alert.alert('Sucesso', 'Evento adicionado com sucesso!');
      navigation.navigate('Agenda'); // Volta para a tela anterior
    } catch (error) {
      console.error("Erro ao adicionar o evento: ", error);
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar o evento. Tente novamente.');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 24, color: 'black' }}>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.textoView}>
          <Text style={styles.tituloText}>Adicionar um evento</Text>
        </View>

        <View style={styles.camposView}>
          <Text style={styles.camposText}>Nome do evento</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do evento"
            placeholderTextColor="#aaa"
            value={nomeEvento}
            onChangeText={setNomeEvento}
          />

          <View style={styles.datahora}>
            <View style={styles.dataView}>
              <Text style={styles.dataHText}>Data do evento</Text>
              <TouchableOpacity onPress={showDatePickerModal} style={styles.inputDataH}>
                <Text style={styles.selectedText}>{dataEvento.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dataEvento}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>

            <View style={styles.horaView}>
              <Text style={styles.dataHText}>Horário do evento</Text>
              <TouchableOpacity onPress={showTimePickerModal} style={styles.inputDataH}>
                <Text style={styles.selectedText}>{horaEvento.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={horaEvento}
                  mode="time"
                  display="default"
                  onChange={onChangeTime}
                />
              )}
            </View>
          </View>
          <Text style={styles.camposText}>Descrição do evento</Text>
          <TextInput 
            multiline={true}
            style={styles.inputDisc}
            placeholder="Adicione uma descrição ao evento"
            placeholderTextColor="#aaa"
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        <View style={styles.botoesView}>
          <TouchableOpacity style={styles.salvarBottom} onPress={handleAdicionarEvento}>
            <Text style={styles.salvarText}>Adicionar o evento</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  textoView: {
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    marginLeft: 12,
    marginBottom: 20,
    marginTop: 50,
  },
  tituloText: {
    fontSize: 24,
    fontFamily: 'Inter_500Medium',
    marginLeft: -7,
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
    height: 45,
    alignSelf: 'center',
    paddingLeft: 10,
  },
  inputDisc: {
    backgroundColor: '#E9E9E9',
    borderRadius: 12,
    fontSize: 16,
    width: '90%',
    height: 250,
    alignSelf: 'center',
    paddingLeft: 10,
    textAlignVertical: 'top',
  },
  datahora: {
    flexDirection: 'row',
    marginLeft: -15,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    width: '90%',
    alignSelf: 'center',
  },
  dataHText: {
    fontSize: 13,
    color: 'black',
    fontFamily: 'Inter_400Regular',
    marginBottom: 5,
    marginTop: 20,
  },
  dataView: {
    flex: 1,
    marginRight: 10,
  },
  horaView: {
    flex: 1,
  },
  inputDataH: {
    backgroundColor: '#E9E9E9',
    borderRadius: 12,
    fontSize: 16,
    height: 45,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  selectedText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  botoesView: {
    alignContent: 'center',
    padding: 1,
    marginTop: 10,
    marginBottom: 20,
  },
  salvarBottom: {
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
  salvarText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  backButton: {
    backgroundColor: '#E9E9E9',
    height: 50,
    width: 50,
    borderRadius: 10,
    marginTop: 30,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
