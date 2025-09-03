import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function Biblioteca({ navigation }) {
    const [favoritos, setFavoritos] = useState([]);

    useEffect(() => {
        const fetchFavoritos = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const favRef = collection(db, "usuarios", user.uid, "favoritos");
                const snapshot = await getDocs(favRef);
                const favList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setFavoritos(favList);
            } catch (error) {
                console.error("Erro ao buscar favoritos:", error);
            }
        };

        fetchFavoritos();
    }, []);

    const removerFavorito = async (artigoId) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await deleteDoc(doc(db, "usuarios", user.uid, "favoritos", artigoId));
            setFavoritos(prev => prev.filter(a => a.id !== artigoId));
            Alert.alert("Sucesso", "Artigo removido da sua Biblioteca.");
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
            Alert.alert("Erro", "Não foi possível remover o artigo.");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={{ fontSize: 20, color: 'black', textAlign: 'center' }}>←</Text>
            </TouchableOpacity>
            <Text style={styles.titulo}> Biblioteca</Text>
            <Text style={styles.tituloText}> Aqui ficam os conteúdos que você marcou como favoritos.
                Vídeos, artigos e materiais que podem te ajudar nos momentos de dúvida ou quando quiser aprender mais
                sobre os cuidados com o paciente e com você mesmo.</Text>
            {favoritos.length === 0 ? (
                <Text style={styles.noFavoritos}>Nenhum artigo salvo ainda.</Text>
            ) : (
                <FlatList
                    data={favoritos}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            
                                <Image
                                    source={{ uri: item.imagem }}
                                    style={styles.artImage}
                                    onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
                                />
                                <Text style={styles.itemTitulo}>{item.titulo}</Text>
                                
                               <Text style={styles.itemData}> {item.descricao}</Text>
                            
                            <View style={styles.rowView}> 
                            <TouchableOpacity style={styles.lerBottom} onPress={() => navigation.navigate('ArtigoDetalhes', { artigo: item })}>
                                <Text style={styles.botaoText}>Leia agora</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.removerButton}
                                onPress={() => removerFavorito(item.id)}
                            >
                                <Text style={styles.removerText}>Remover</Text>
                            </TouchableOpacity>

                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    titulo: {
        fontSize: 30,
        fontFamily: 'Inter_500Medium',
        marginBottom: 10,
        marginLeft:10
    },
    tituloText: {
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        color: '#808080',
        textAlign: 'justify',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10
    },
    noFavoritos: { fontSize: 16, color: "#777", marginTop: 20, textAlign: "center" },
    item: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
        marginHorizontal: 20,
        marginVertical: 20
    },
    itemTitulo: {
        fontSize: 18,
    fontFamily: 'Inter_500Medium',
    color: '#000',
    marginTop: 15,
    marginBottom:10
    },
    itemAutor: { fontSize: 14, color: "gray", marginTop: 3 },
    itemData: { fontSize: 12, color: "#777", fontStyle: "italic", marginTop: 2 },
    removerButton: {
        
        backgroundColor: "#FF5154",
        width: '49%',
    height: 40,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    },
    backButton: {
        backgroundColor: '#E9E9E9',
        height: 45,
        width: 45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10,
        marginLeft:10
    },
    removerText: {
        color: 'white',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginLeft: 2,
    textAlign:'center' },
    artImage: {
        height: 120,
        width: '100%',
        borderRadius: 10,
        alignSelf: 'center',
    },
    lerBottom:{
    backgroundColor: '#8A38F5',
    width: '49%',
    height: 40,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
    },
    rowView:{
        flexDirection:'row',
        justifyContent: 'space-between'
    },
    botaoText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginLeft: 2,
    textAlign:'center'
  },
});
