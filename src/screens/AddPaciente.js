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
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';

export default function AddPaciente({ navigation, route }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [nomePaciente, setNomePaciente] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nivel, setNivel] = useState(null);
  const [userId, setUserId] = useState(null);
  const [pacienteId, setPacienteId] = useState(null);

  const cores = {
    Leve: "#4CAF50",
    Moderado: "#F5A623",
    Grave: "#E53935",
  };

  useEffect(() => {
    if (route.params?.pacienteParaEditar) {
      const paciente = route.params.pacienteParaEditar;
      setPacienteId(paciente.id);
      setNomePaciente(paciente.nome);
      setObservacoes(paciente.observacoes);
      if (paciente.dataNascimento && typeof paciente.dataNascimento.toDate === 'function') {
        setDataNascimento(paciente.dataNascimento.toDate());
      }
      setNivel(paciente.nivel);
    }
  }, [route.params?.pacienteParaEditar]);

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

  if (!fontsLoaded) {
    return null;
  }

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dataNascimento;
    setShowDatePicker(Platform.OS === 'ios');
    setDataNascimento(currentDate);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleSavePaciente = async () => {
    if (!userId) {
      console.error("Erro: Usuário não autenticado.");
      return;
    }
    if (!nomePaciente || !nivel) {
      Alert.alert("Erro", "Por favor, preencha o nome do paciente e o nível.");
      return;
    }

    try {
      if (pacienteId) {
        const pacienteRef = doc(db, 'patients', pacienteId);
        await updateDoc(pacienteRef, {
          nome: nomePaciente,
          dataNascimento: dataNascimento,
          nivel: nivel,
          observacoes: observacoes,
        });
        Alert.alert("Sucesso", "Paciente editado com sucesso!");
      } else {
        const pacientesRef = collection(db, 'patients');
        await addDoc(pacientesRef, {
          nome: nomePaciente,
          dataNascimento: dataNascimento,
          nivel: nivel,
          observacoes: observacoes,
          userId: userId,
        });
        Alert.alert("Sucesso", "Paciente adicionado com sucesso!");
      }

      navigation.navigate('Pacientes');
    } catch (error) {
      console.error("Erro ao salvar paciente: ", error.message);
      Alert.alert("Erro", "Ocorreu um erro ao salvar o paciente. Tente novamente.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.textoView}>
          <Text style={styles.tituloText}>{pacienteId ? "Editar paciente" : "Adicionar paciente"}</Text>
        </View>

        <View style={styles.camposView}>
          <Text style={styles.camposText}>Nome do paciente</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do paciente"
            placeholderTextColor="#aaa"
            value={nomePaciente}
            onChangeText={setNomePaciente}
          />

          <View style={styles.dataView}>
            <Text style={styles.dataHText}>Data de nascimento</Text>
            <TouchableOpacity onPress={showDatePickerModal} style={styles.inputDataH}>
              <Text style={styles.selectedText}>
                {dataNascimento instanceof Date ? dataNascimento.toLocaleDateString() : 'Selecionar Data'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dataNascimento}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>
          
          <Text style={styles.camposText}>Nível do transtorno</Text>
          <View style={styles.row}>
            {["Leve", "Moderado", "Grave"].map((opcao) => (
              <TouchableOpacity
                key={opcao}
                style={[
                  styles.botao,
                  nivel === opcao && { backgroundColor: cores[opcao] }
                ]}
                onPress={() => setNivel(opcao)}
              >
                <Text
                  style={[
                    styles.textoBotao,
                    nivel === opcao && styles.textoSelecionado
                  ]}
                >
                  {opcao}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.camposText}>Observações</Text>
          <TextInput 
            multiline={true}
            style={styles.inputDisc}
            placeholder="Observações do paciente"
            placeholderTextColor="#aaa"
            value={observacoes}
            onChangeText={setObservacoes}
          />

        </View>

        <View style={styles.botoesView}>
          <TouchableOpacity style={styles.salvarBottom} onPress={handleSavePaciente}>
            <Text style={styles.salvarText}>{pacienteId ? "Salvar alterações" : "Adicionar paciente"}</Text>
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
    marginBottom: 10,
    marginTop: 40,
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
    marginTop:10
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
    marginHorizontal:20
  },
  inputDataH: {
    backgroundColor: '#E9E9E9',
    borderRadius: 12,
    fontSize: 16,
    height: 45,
    paddingHorizontal: 10,
    justifyContent: 'center',
    width:130
  },
  selectedText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  row: {
    flexDirection: "row",
    marginTop: 10,
    alignSelf:'center'
  },
  botao: {
    width:'28%',
    backgroundColor: "#E5E5E5",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  textoBotao: {
    fontSize: 15,
    color: "#555",
    fontFamily: "Inter_400Regular",
  },
  textoSelecionado: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
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
});
