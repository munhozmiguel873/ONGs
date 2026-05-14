import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import ONGCard from '../components/ONGCard';
import ONGModal from '../components/ONGModal';
import { ongs } from '../data/ongs';

export default function Explorar() {
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ongSelecionada, setOngSelecionada] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDados(ongs);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  function abrirModal(ong: any) {
    setOngSelecionada(ong);
    setModalVisible(true);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando ONGs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          onClose={() => setModalVisible(false)}
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
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
});