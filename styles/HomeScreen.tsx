import React, { useEffect, useState } from 'react';

import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';

import ONGCard from '../components/ONGCard';
import ONGModal from '../components/ONGModal';

import { ongs } from '../data/ongs';

import colors from '../styles/colors';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [ongSelecionada, setOngSelecionada] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
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
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando ONGs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ongs}
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
    backgroundColor: colors.background,
    padding: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    color: colors.text,
    fontSize: 16,
  },
});