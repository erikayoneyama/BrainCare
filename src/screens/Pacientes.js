import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { collection, onSnapshot, query, where, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';

export default function Pacientes({ navigation }) {
  const [pacientes, setPacientes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showOptionsFor, setShowOptionsFor] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

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
        Alert.alert('Erro', 'Ocorreu um erro ao carregar os pacientes.');
      });
      return () => unsubscribe();
    }
  }, [userId]);

  const handleDeletePatient = async (id) => {
    setShowOptionsFor(null);
    Alert.alert(
      "Excluir Paciente",
      "Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const pacienteRef = doc(db, 'patients', id);
              await deleteDoc(pacienteRef);
              Alert.alert('Sucesso', 'Paciente excluído com sucesso.');
            } catch (error) {
              console.error("Erro ao excluir paciente: ", error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir o paciente.');
            }
          }
        }
      ]
    );
  };

  const handleEditPatient = (paciente) => {
    setShowOptionsFor(null);
    navigation.navigate('CriarTab', {
      screen: 'AddPaciente',
      params: { pacienteParaEditar: paciente }
    });
  };

  const handleViewAgenda = (pacienteId) => {
    navigation.navigate('Agenda', { pacienteId });
  };

  const renderPacienteCard = ({ item }) => (
    <View style={styles.pacienteCard}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handleViewAgenda(item.id)}
      >
        <Text style={styles.pacienteCardNome}>{item.nome}</Text>
        <Text style={styles.pacienteCardInfo}>Nível: {item.nivel}</Text>
        <Text style={styles.pacienteCardInfo}>
          Nasc: {item.dataNascimento?.toDate ? item.dataNascimento.toDate().toLocaleDateString() : 'Não informado'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionsButtonContainer}
        onPress={() => setShowOptionsFor(showOptionsFor === item.id ? null : item.id)}
      >
        <Text style={styles.optionsButton}>...</Text>
      </TouchableOpacity>

      {showOptionsFor === item.id && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleEditPatient(item)}
          >
            <Text style={styles.optionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, styles.deleteButton]}
            onPress={() => handleDeletePatient(item.id)}
          >
            <Text style={[styles.optionText, styles.deleteText]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navBottom}
        onPress={() => navigation.navigate('CriarTab', { screen: 'AddPaciente' })}
      >
        <Text style={styles.navText}>Adicionar paciente</Text>
      </TouchableOpacity>

      <View style={styles.pacientesContainer}>
        <Text style={styles.sectionTitle}>Meus Pacientes</Text>
        {pacientes.length > 0 ? (
          <FlatList
            data={pacientes}
            renderItem={renderPacienteCard}
            keyExtractor={item => item.id}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.pacientesList}
          />
        ) : (
          <Text style={styles.noPatientsText}>Nenhum paciente cadastrado.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  navBottom: {
    backgroundColor: '#7D00A7',
    width: '90%',
    height: 45,
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  navText: {
    color: 'white',
    fontSize: 15,
  },
  pacientesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  pacientesList: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  pacienteCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: 360,
    alignSelf: 'center',
    height: 100,
    justifyContent: 'center',
    elevation: 3, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: 'relative',
    overflow: 'visible',
    marginTop:10,
    
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  pacienteCardNome: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
    marginRight: 5,
  },
  pacienteCardInfo: {
    fontSize: 12,
    color: '#555',
  },
  optionsButtonContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
  },
  optionsButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginRight:10,
  },
  optionsContainer: {
    position: 'absolute',
    top: 25,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
    minWidth: 100,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    marginRight:10,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  deleteButton: {
    borderBottomWidth: 0,
  },
  deleteText: {
    color: 'red',
  },
  noPatientsText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});
