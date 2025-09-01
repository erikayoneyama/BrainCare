import React, { useState, useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
  Alert,
  FlatList,
} from 'react-native';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';

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

  const [pacientes, setPacientes] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // Efeito para verificar a autenticação do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Efeito para buscar a lista de pacientes
  useEffect(() => {
    if (userId) {
      const q = query(collection(db, 'patients'), where('userId', '==', userId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const pacientesData = [];
        querySnapshot.forEach((doc) => {
          pacientesData.push({ id: doc.id, ...doc.data() });
        });
        setPacientes(pacientesData);
      }, (error) => {
        console.error("Erro ao buscar pacientes: ", error);
        Alert.alert('Erro', 'Ocorreu um erro ao carregar a lista de pacientes.');
      });
      return () => unsubscribe();
    }
  }, [userId]);

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

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDropdown(false);
  };

  const handleAdicionarEvento = async () => {
    if (!nomeEvento.trim()) {
      Alert.alert("Erro", "Por favor, preencha o nome do evento.");
      return;
    }
    if (!selectedPatient) {
      Alert.alert("Erro", "Por favor, selecione um paciente.");
      return;
    }
    if (!userId) {
      Alert.alert("Erro", "Usuário não identificado. Tente fazer login novamente.");
      return;
    }

    try {
      const eventosRef = collection(db, 'events');
      await addDoc(eventosRef, {
        nome: nomeEvento,
        descricao: descricao,
        data: dataEvento,
        hora: horaEvento,
        pacienteId: selectedPatient.id,
        userId: userId,
      });
      Alert.alert("Sucesso", "Evento criado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao criar evento: ", error.message);
      Alert.alert("Erro", "Ocorreu um erro ao criar o evento. Tente novamente.");
    }
  };

  // Componente de cabeçalho que contém todos os campos do formulário
  const ListHeaderComponent = () => (
    <View style={styles.headerComponent}>
      <View style={styles.textoView}>
        <Text style={styles.tituloText}>Adicionar um evento</Text>
      </View>
      <View style={styles.camposView}>
        <Text style={styles.camposText}>Nome do evento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Consulta semanal"
          placeholderTextColor="#aaa"
          value={nomeEvento}
          onChangeText={setNomeEvento}
        />

        <Text style={styles.camposText}>Paciente</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPatientDropdown(!showPatientDropdown)}
        >
          <Text style={styles.selectedText}>
            {selectedPatient ? selectedPatient.nome : 'Selecione um paciente'}
          </Text>
        </TouchableOpacity>
        {showPatientDropdown && (
          <View style={styles.dropdown}>
            <FlatList
              data={pacientes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => selectPatient(item)}
                >
                  <Text style={styles.dropdownItemText}>{item.nome}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        <View style={styles.datahora}>
          <View style={styles.dataView}>
            <Text style={styles.dataHText}>Data do evento</Text>
            <TouchableOpacity onPress={showDatePickerModal} style={styles.inputDataH}>
              <Text style={styles.selectedText}>{dataEvento.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.horaView}>
            <Text style={styles.dataHText}>Horário do evento</Text>
            <TouchableOpacity onPress={showTimePickerModal} style={styles.inputDataH}>
              <Text style={styles.selectedText}>{horaEvento.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.camposText}>Descrição</Text>
        <TextInput
          multiline={true}
          style={styles.inputDisc}
          placeholder="Ex: Terapia cognitiva"
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
      {showDatePicker && (
        <DateTimePicker
          value={dataEvento}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={horaEvento}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={null}
        ListHeaderComponent={ListHeaderComponent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerComponent: {
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
    justifyContent: 'center',
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
  backButtonText: {
    fontSize: 24,
    color: 'black',
  },
  dropdown: {
    width: '90%',
    alignSelf: 'center',
    maxHeight: 200,
    backgroundColor: '#E9E9E9',
    borderRadius: 12,
    marginTop: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});
