import React, { useState, useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
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
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';

export default function CriarAnotacao({ navigation }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Estado para os campos do formulário
  const [tituloAnotacao, setTituloAnotacao] = useState('');
  const [anotacao, setAnotacao] = useState('');

  // Estado para a seleção do paciente e o dropdown
  const [pacientes, setPacientes] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // Estado para o ID do usuário
  const [userId, setUserId] = useState(null);

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

  // Efeito para buscar a lista de pacientes do Firestore
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

  // Função para selecionar um paciente do dropdown
  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDropdown(false);
  };

  // Função para salvar a anotação no Firestore
  const handleSalvarAnotacao = async () => {
    if (!tituloAnotacao.trim()) {
      Alert.alert("Erro", "Por favor, preencha o título da anotação.");
      return;
    }
    if (!anotacao.trim()) {
      Alert.alert("Erro", "Por favor, preencha o corpo da anotação.");
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
      const anotacoesRef = collection(db, 'notes');
      await addDoc(anotacoesRef, {
        titulo: tituloAnotacao,
        conteudo: anotacao,
        pacienteId: selectedPatient.id,
        userId: userId,
        createdAt: new Date(),
      });
      Alert.alert("Sucesso", "Anotação salva com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar anotação: ", error.message);
      Alert.alert("Erro", "Ocorreu um erro ao salvar a anotação. Tente novamente.");
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerComponent}>
          <View style={styles.textoView}>
            <Text style={styles.tituloText}>Adicionar uma anotação</Text>
          </View>
          <View style={styles.camposView}>
            {/* Campo de seleção de paciente */}
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
                {pacientes.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.dropdownItem}
                    onPress={() => selectPatient(item)}
                  >
                    <Text style={styles.dropdownItemText}>{item.nome}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* Campo de título da anotação */}
            <Text style={styles.camposText}>Título da anotação</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o título"
              placeholderTextColor="#aaa"
              value={tituloAnotacao}
              onChangeText={setTituloAnotacao}
            />

            {/* Campo de texto da anotação */}
            <Text style={styles.camposText}>Anotação</Text>
            <TextInput
              multiline={true}
              style={styles.inputDisc}
              placeholder="Digite suas anotações"
              placeholderTextColor="#aaa"
              value={anotacao}
              onChangeText={setAnotacao}
            />
          </View>
          <View style={styles.botoesView}>
            <TouchableOpacity style={styles.salvarBottom} onPress={handleSalvarAnotacao}>
              <Text style={styles.salvarText}>Salvar anotações</Text>
            </TouchableOpacity>
          </View>
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
  scrollView: {
    flex: 1,
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
    backgroundColor: 'white',
    borderColor: '#ADADAD',
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
    width: '90%',
    height: 45,
    alignSelf: 'center',
    paddingLeft: 10,
    justifyContent: 'center',
  },
  inputDisc: {
    backgroundColor: 'white',
    borderColor: '#ADADAD',
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
    width: '90%',
    height: 350,
    alignSelf: 'center',
    paddingLeft: 10,
    textAlignVertical: 'top',
    marginTop: 10,
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
  selectedText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
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
