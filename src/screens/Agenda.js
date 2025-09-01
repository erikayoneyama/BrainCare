import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { auth, db } from '../firebaseConfig';

export default function Agenda({ navigation, route }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [pacienteId, setPacienteId] = useState(null);
  const [pacienteNome, setPacienteNome] = useState('Todos os Pacientes');

  // Escuta a autenticação para obter o ID do usuário
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

  // Escuta os eventos no Firestore com base nos filtros
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    let eventosQuery = query(
      collection(db, 'events'),
      where('userId', '==', userId),
      orderBy('data', 'asc'),
    );

    // Adiciona o filtro por paciente se o ID for recebido da navegação
    if (pacienteId) {
      eventosQuery = query(
        collection(db, 'events'),
        where('userId', '==', userId),
        where('pacienteId', '==', pacienteId),
        orderBy('data', 'asc'),
      );
    }

    const unsubscribe = onSnapshot(eventosQuery, (querySnapshot) => {
      const eventosList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        eventosList.push({
          id: doc.id,
          nome: data.nome,
          descricao: data.descricao,
          data: data.data.toDate().toLocaleDateString('pt-BR'),
          hora: data.hora.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        });
      });
      setEventos(eventosList);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar eventos: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, pacienteId]);

  // Efeito para obter o ID do paciente da navegação
  useEffect(() => {
    if (route.params?.pacienteId) {
      setPacienteId(route.params.pacienteId);
      // Busca o nome do paciente para o título da tela
      const getPacienteNome = async () => {
        const pacienteRef = doc(db, 'patients', route.params.pacienteId);
        const pacienteDoc = await getDoc(pacienteRef);
        if (pacienteDoc.exists()) {
          setPacienteNome(pacienteDoc.data().nome);
        }
      };
      getPacienteNome();
    } else {
      setPacienteId(null);
      setPacienteNome('Todos os Pacientes');
    }
  }, [route.params?.pacienteId]);

  if (!fontsLoaded) {
    return null;
  }

  const handleClearFilter = () => {
    navigation.setParams({ pacienteId: null });
  };
  
  const handleVerDetalhes = (evento) => {
    // Altera a navegação para especificar a stack correta
    navigation.navigate('CriarTab', { screen: 'Evento', params: { evento } });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando eventos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>{`Agenda de\n${pacienteNome}`}</Text>
      
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Text style={styles.noEventsText}>Nenhum evento adicionado ainda.</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.eventoCard}>
            <View style={styles.infosCard}>
              <View style={styles.divInfos}>
                <Text style={styles.eventoTitulo}>{item.nome}</Text>
                <Text style={styles.eventoInfo}>Às {item.hora}</Text>
              </View>
              <View style={styles.divInfos}>
                <View style={styles.dataView}>
                  <Text style={styles.dataText}>{item.data}</Text>
                </View>
                <TouchableOpacity style={styles.consultaBottom} onPress={() => handleVerDetalhes(item)}>
                  <Text style={styles.botaoText}>Ver detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  eventoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginHorizontal:15,
    marginVertical:10
  },
  infosCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divInfos: {
    justifyContent: 'center',
  },
  eventoTitulo: {
    fontSize: 18,
    fontFamily: 'Inter_500Medium',
    color: '#000',
    marginBottom: 15,
    marginTop:-20
  },
  eventoInfo: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#000',
  },
  noEventsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 50,
  },
  dataView: {
    borderWidth: 1.4,
    borderColor: '#000',
    borderRadius: 4,
    height: 26,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    marginBottom:10,
    marginLeft:40
  },
  dataText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#000',
  },
  consultaBottom: {
    backgroundColor: '#8A38F5',
    height: 33,
    width: 130,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  botaoText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#fff',
  },
  clearFilterButton: {
    backgroundColor: '#E9E9E9',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
  },
  clearFilterText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#333',
  },
});
