import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  Alert
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
  const [artigos, setArtigos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [loadingArtigos, setLoadingArtigos] = useState(true);
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
      setLoadingEventos(false);
      return;
    }

    setLoadingEventos(true);

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
      setLoadingEventos(false);
    }, (error) => {
      console.error("Erro ao carregar eventos: ", error);
      setLoadingEventos(false);
    });

    return () => unsubscribeSnapshot();
  }, [userId]);

  // Lógica para buscar os artigos
  useEffect(() => {
    const artigosQuery = query(collection(db, 'artigos'));

    const unsubscribeArtigos = onSnapshot(artigosQuery, (querySnapshot) => {
      const artigosList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        artigosList.push({
          id: doc.id,
          titulo: data.tituloArt,
          descricao: data.descricao,
          autor: data.autor,
          conteudo: data.conteudo,
          imagem: data.imagem, // Certifique-se de que a URL da imagem está sendo buscada
        });
      });
      setArtigos(artigosList);
      setLoadingArtigos(false);
    }, (error) => {
      console.error("Erro ao carregar artigos: ", error);
      setLoadingArtigos(false);
    });

    return () => unsubscribeArtigos();
  }, []);

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

        {/* Botão rápido */}
        <TouchableOpacity
          style={styles.cadastroBottom}
          onPress={() => navigation.navigate('Anotacoes')}
        >
          <Text style={{ color: 'white', fontFamily: 'Inter_500Medium' }}>Minhas Anotações</Text>
        </TouchableOpacity>

        {/* Seção de Próximos Eventos */}
        <View style={styles.consultasView}>
          <Text style={styles.titulosText}>Próximos eventos</Text>
          <View style={styles.consultasScrollView}>
            {loadingEventos ? (
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
        <Text style={[styles.titulosText, { marginTop: 40 }]}>Conteúdos educativos</Text>
        <View style={{ marginTop: 30 }}>
          {loadingArtigos ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : artigos.length > 0 ? (
            artigos.map((artigo) => (
              <TouchableOpacity
                key={artigo.id}
                style={styles.artigosView}
                onPress={() => navigation.navigate('ArtigoDetalhes', { artigo })}
              >
                <View style={styles.artigoInfos}>
                  {/* CORREÇÃO AQUI */}
                  <Image 
                    source={{ uri: artigo.imagem }} 
                    style={styles.fotinha}
                    onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
                  />
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: 'black' }}>
                    {artigo.titulo}
                  </Text>
                  <Text style={styles.artigoText} numberOfLines={3}>
                    {artigo.descricao}
                  </Text>
                  <Text style={styles.artigoData}>Autor: {artigo.autor}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noEventsText}>Nenhum conteúdo disponível.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  cadastroBottom: {
    backgroundColor: '#7D00A7',
    width: '90%',
    height: 45,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
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
  artigosView: {
    width: '95%',
    height: 150,
    backgroundColor: 'white',
    borderRadius: 19,
    marginBottom: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignSelf: 'center',
    padding: 15,
    justifyContent: 'center'
  },
  artigoInfos: {
    width: '100%'
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
    marginTop: 10
  },
  margin: {
    marginBottom: 20
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
  fotinha: {
    height: 50,
    width: 50, // Adicionei uma largura para a imagem aparecer
    resizeMode: 'contain', // Recomendo 'contain' para se ajustar ao container
  }
});
