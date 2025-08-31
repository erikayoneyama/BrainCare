import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Importe as instâncias do auth e db

export default function Agenda() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

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

  // Escuta os eventos no Firestore
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'events'),
      where('userId', '==', userId),
      orderBy('data', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minha Agenda</Text>
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
                <Text style={styles.eventoInfo}>Ás {item.hora}</Text>
              </View>

              <View style={styles.divInfos}>
                <View style={styles.dataView}>
                  <Text style={styles.dataText}>{item.data}</Text>
                </View>

                <TouchableOpacity style={styles.consultaBottom}>
                <Text style={styles.botaoText}>Ver detalhes </Text>
              </TouchableOpacity>
              </View>

              
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  titulo: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 20,
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
  eventoDescricao: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#333',
    marginTop: 10,
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
});
