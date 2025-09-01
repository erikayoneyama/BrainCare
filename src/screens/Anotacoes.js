import React, { useState, useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; 

export default function Anotacoes({ navigation }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [anotacoes, setAnotacoes] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // 1. Efeito para autenticação do usuário
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribeAuth();
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

  // Efeito para buscar e ouvir anotações em tempo real (com filtro)
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let q = query(
      collection(db, 'notes'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    // Adicionar o filtro de paciente se um paciente estiver selecionado
    if (selectedPatient) {
      q = query(q, where('pacienteId', '==', selectedPatient.id));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData = [];
      querySnapshot.forEach((doc) => {
        notesData.push({ id: doc.id, ...doc.data() });
      });
      setAnotacoes(notesData);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar anotações: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, selectedPatient]);

  const handleDeleteNote = async (id) => {
    try {
      const noteRef = doc(db, 'notes', id);
      await deleteDoc(noteRef);
      Alert.alert("Sucesso", "Anotação excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir anotação: ", error);
      Alert.alert("Erro", "Ocorreu um erro ao excluir a anotação.");
    }
  };

  const getPatientName = (pacienteId) => {
    const paciente = pacientes.find(p => p.id === pacienteId);
    return paciente ? paciente.nome : 'Paciente Desconhecido';
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDropdown(false);
  };
  
  const handleClearFilter = () => {
    setSelectedPatient(null);
    setShowPatientDropdown(false);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
         <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}>
        
                    </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.titulo}>Minhas Anotações</Text>
        
        {/* Campo de filtro de paciente */}
        <Text style={styles.filterLabel}>Filtrar por Paciente:</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowPatientDropdown(!showPatientDropdown)}
          >
            <Text style={styles.filterButtonText}>
              {selectedPatient ? selectedPatient.nome : 'Todos os Pacientes'}
            </Text>
          </TouchableOpacity>
          {selectedPatient && (
            <TouchableOpacity onPress={handleClearFilter} style={styles.clearFilterButton}>
              <Text style={styles.clearFilterText}>Limpar</Text>
            </TouchableOpacity>
          )}
        </View>

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

        <ScrollView style={styles.anotacoesContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8A38F5" />
              <Text style={styles.loadingText}>Carregando anotações...</Text>
            </View>
          ) : (
            anotacoes.length > 0 ? (
              anotacoes.map((anotacao) => (
                <View key={anotacao.id} style={styles.anotacaoCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.anotacaoTitulo}>{anotacao.titulo}</Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteNote(anotacao.id)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.patientName}>{getPatientName(anotacao.pacienteId)}</Text>
                  <Text style={styles.anotacaoConteudo}>{anotacao.conteudo}</Text>
                  <Text style={styles.anotacaoData}>
                    {anotacao.createdAt && new Date(anotacao.createdAt.toDate()).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noAnotacoesText}>Nenhuma anotação adicionada ainda.</Text>
            )
          )}
        </ScrollView>
        
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    color: '#7D00A7',
    marginBottom: 5,
  },
  subTitulo: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#555',
    marginBottom: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterButton: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#ADADAD',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  filterButtonText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  clearFilterButton: {
    marginLeft: 10,
    padding: 8,
  },
  clearFilterText: {
    color: 'red',
    fontFamily: 'Inter_500Medium',
  },
  dropdown: {
    width: '100%',
    backgroundColor: '#E9E9E9',
    borderRadius: 12,
    marginTop: 5,
    maxHeight: 200,
    position: 'absolute',
    top: 190,
    zIndex: 10,
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
  anotacoesContainer: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  anotacaoCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  anotacaoTitulo: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    flexShrink: 1,
  },
  patientName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#7D00A7',
    marginBottom: 5,
  },
  anotacaoConteudo: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: '#555',
  },
  anotacaoData: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 10,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noAnotacoesText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#8A38F5',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  backButton: {
        backgroundColor: '#E9E9E9',
        height: 50,
        width: 50,
        borderRadius: 10,
        marginTop: 30,
        marginLeft: 20
    },
});