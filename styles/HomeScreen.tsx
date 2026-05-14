import React, { useState } from 'react';

import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';

import ONGCard from '../components/ONGCard';
import ONGModal from '../components/ONGModal';

import { ongs } from '../data/ongs';

import colors from '../styles/colors';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] =
    useState(false);

  const [ongSelecionada, setOngSelecionada] =
    useState<any>(null);

  function abrirModal(ong: any) {
    setOngSelecionada(ong);
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ONGCard
            nome={item.nome}
            onPress={() => abrirModal(item)}
          />
        )}
      />

      {ongSelecionada && (
        <ONGModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          nome={ongSelecionada.nome}
          descricao={ongSelecionada.descricao}
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
});