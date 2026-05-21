import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import ONGCard from '../../components/ONGCard';
import ONGModal from '../../components/ONGModal';
import { listaOngs } from '../../data/ongs';
import colors from '../../styles/colors';


type ONG = typeof listaOngs[number];

export default function Explorar() {

  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<ONG[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ongSelecionada, setOngSelecionada] =
    useState<ONG | null>(null);


  useEffect(() => {

    const timer = setTimeout(() => {

      setDados(listaOngs);

      setLoading(false);

    }, 1500);

    return () => clearTimeout(timer);

  }, []);


  function abrirModal(ong: ONG) {

    setOngSelecionada(ong);

    setModalVisible(true);
  }


  function fecharModal() {

    setModalVisible(false);

    setTimeout(() => {
      setOngSelecionada(null);
    }, 300);
  }


  // LOADING
  if (loading) {
    return (
      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Carregando ONGs...
        </Text>

      </View>
    );
  }


  // TELA PRINCIPAL
  return (

    <View style={styles.container}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F7FA"
      />

      <Text style={styles.title}>
        Explore ONGs 🌍
      </Text>

      <Text style={styles.subtitle}>
        Descubra projetos incríveis e ajude quem precisa.
      </Text>


      <FlatList
        data={dados}

        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (

          <ONGCard
            nome={item.nome}
            causa={item.causa}
            imagem={item.imagem}
            onPress={() => abrirModal(item)}
          />

        )}

        showsVerticalScrollIndicator={false}

        contentContainerStyle={styles.listContent}
      />


      {ongSelecionada && (

        <ONGModal
          visible={modalVisible}
          onClose={fecharModal}

          nome={ongSelecionada.nome}
          descricao={ongSelecionada.descricao}
          causa={ongSelecionada.causa}
          imagem={ongSelecionada.imagem}
        />

      )}

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 20,
    paddingHorizontal: 18,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 22,
    lineHeight: 22,
  },

  listContent: {
    paddingBottom: 30,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },

  loadingText: {
    marginTop: 14,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },

});