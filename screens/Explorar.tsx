import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import CartaoONG from '../components/ONGCard';
import ModalONG from '../components/ONGModal';
import { listaOngs } from '../data/ongs';

type ONG = {
  id: string;
  nome: string;
  causa: string;
  descricao: string;
  imagem: string;
};

export default function Explorar() {
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState<ONG[]>([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [ongSelecionada, setOngSelecionada] = useState<ONG | null>(null);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setDados(listaOngs);
      setCarregando(false);
    }, 2000);

    return () => clearTimeout(temporizador);
  }, []);

  function abrirModal(ong: ONG) {
    setOngSelecionada(ong);
    setModalVisivel(true);
  }

  if (carregando) {
    return (
      <View style={estilos.containerCarregamento}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={estilos.textoCarregamento}>
          Carregando ONGs...
        </Text>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartaoONG
            nome={item.nome}
            causa={item.causa}
            imagem={item.imagem}
            onPress={() => abrirModal(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoLista}
      />

      {ongSelecionada && (
        <ModalONG
          visible={modalVisivel}
          onClose={() => setModalVisivel(false)}
          nome={ongSelecionada.nome}
          descricao={ongSelecionada.descricao}
          causa={ongSelecionada.causa}
          imagem={ongSelecionada.imagem}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  conteudoLista: {
    paddingBottom: 20,
  },

  containerCarregamento: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },

  textoCarregamento: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
});