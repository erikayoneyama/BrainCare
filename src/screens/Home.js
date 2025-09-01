import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

SplashScreen.preventAutoHideAsync();

export default function Home({ navigation }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [userName, setUserName] = useState('');
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Lógica para buscar o nome do usuário
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      try {
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    setUserName(userDoc.data().name);
  } else if (user.displayName) {
    setUserName(user.displayName);
  }
} catch (error) {
  console.error("Erro ao buscar nome do usuário: ", error);
  if (user.displayName) {
    setUserName(user.displayName);
  }
}

      } else {
        setUserId(null);
        setUserName('');
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Lógica para buscar os eventos
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const eventosQuery = query(
      collection(db, 'events'),
      where('userId', '==', userId),
      orderBy('data', 'asc')
    );

    const unsubscribeSnapshot = onSnapshot(eventosQuery, (querySnapshot) => {
      const eventosList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        eventosList.push({
          id: doc.id,
          nome: data.nome,
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

    return () => unsubscribeSnapshot();
  }, [userId]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const renderCardEvento = ({ id, nome, data, hora }) => (
    <View style={styles.cardInfos} key={id}>
      <View style={[styles.infosCard, styles.margin]}>
        <Text style={styles.tituloConsulta}>{nome}</Text>
        <View style={styles.dataView}>
          <Text style={styles.dataText}>{data}</Text>
        </View>
      </View>
      <View style={styles.infosCard}>
        <View style={styles.datahoraView}>
          <Text style={styles.horarioText}>Às {hora}</Text>
        </View>
        <TouchableOpacity style={styles.consultaBottom} onPress={() => navigation.navigate('Agenda')}>
          <Text style={styles.botaoText}>Ver detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Seção de saudação do usuário */}
        <View style={styles.welcomeView}>
          <Text style={styles.welcomeTitle}>
            {userName ? `Olá, ${userName}!` : 'Bem-vindo!'}
          </Text>
        </View>
        <TouchableOpacity 
                style={styles.cadastroBottom} 
                onPress={() => navigation.navigate('Anotacoes')}
              ></TouchableOpacity>
        {/* Seção de Próximos Eventos */}
        <View style={styles.consultasView}>
          <Text style={styles.titulosText}>Próximos eventos</Text>
          <View style={styles.consultasScrollView}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : eventos.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
                {eventos.map(renderCardEvento)}
              </ScrollView>
            ) : (
              <Text style={styles.noEventsText}>Nenhum evento futuro.</Text>
            )}
          </View>
        </View>

        {/* Seção de Conteúdos Educativos */}
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... seus estilos existentes ...
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '100%',
    paddingTop: 30
  },
  scrollContainer: {
    padding: 15,
  },
  welcomeView: {
    padding: 10,
    marginTop: 20
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#000',
  },
  consultasView: {
    width: '100%',
    marginTop: 40,
    paddingTop: 10,
    paddingBottom: 10
  },
  consultasScrollView: {
    marginTop: 30,
  },
  titulosText: {
    color: "black",
    fontSize: 21,
    fontFamily: 'Inter_500Medium',
    marginLeft: 12,
    marginBottom: -30
  },
  cardInfos: {
    width: 300,
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginRight: 15,
    marginTop: 6,
    marginBottom: 6,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tituloConsulta: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: 'black'
  },
  consultaBottom: {
    backgroundColor: '#8A38F5',
    height: 33,
    width: 130,
    borderRadius: 25,
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  botaoText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 5,
    marginLeft: 2
  },
  infosCard: {
    flexDirection: 'row'
  },
  cadastroBottom:{
    backgroundColor:'#7D00A7',
    width:'90%',
    height:45,
    borderRadius:10,
    marginTop:20,
    alignSelf:'center',
    alignContent:'center',
    alignItems:'center', 
    justifyContent: 'center'
  },
  dataView: {
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 1.4,
    borderColor: 'black',
    height: 26,
    width: 90,
    borderRadius: 4,
    marginTop: 5,
    marginLeft: 59
  },
  dataText: {
    color: "black",
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 1,
  },
  datahoraView: {
    backgroundColor: 'white',
    marginRight: 50,
    marginTop: -4
  },
  horarioText: {
    color: "black",
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginBottom: 10
  },
  conteudoView: {
    marginTop: 5,
  },
  artigosView: {
    width: '95%',
    height: 190,
    backgroundColor: 'white',
    borderRadius: 19,
    marginBottom: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignSelf: 'center',
    padding: 10,
    flexDirection: 'row',
  },
  artigoInfos: {
    marginLeft: 10,
    width: '60%'
  },
  artigoText: {
    color: "black",
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 7
  },
  artigoData: {
    color: "black",
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 16
  },
  artigoImage: {
    height: '100%',
    width: 130,
    borderRadius: 15
  },
  margin: {
    marginBottom: 20
  },
  artigoMargin: {
    marginTop: 50
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  noEventsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontFamily: 'Inter_400Regular',
  },
});