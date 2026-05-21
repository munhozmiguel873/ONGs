import React from 'react';

import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import cores from '../styles/colors';

type Propriedades = {
  visible: boolean;
  onClose: () => void;
  nome: string;
  descricao: string;
  causa: string;
  imagem?: string;
};

export default function ModalONG({
  visible,
  onClose,
  nome,
  descricao,
  causa,
  imagem,
}: Propriedades) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={estilos.sobreposicao}>
        <View style={estilos.containerModal}>
          <ScrollView
            contentContainerStyle={estilos.conteudoScroll}
          >
            {imagem ? (
              <Image
                source={{ uri: imagem }}
                style={estilos.imagem}
              />
            ) : null}

            <Text style={estilos.titulo}>
              {nome}
            </Text>

            <Text style={estilos.causa}>
              {causa}
            </Text>

            <Text style={estilos.descricao}>
              {descricao}
            </Text>
          </ScrollView>

          <TouchableOpacity
            style={estilos.botao}
            onPress={onClose}
          >
            <Text style={estilos.textoBotao}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  sobreposicao: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',

    justifyContent: 'center',
    alignItems: 'center',

    padding: 20,
  },

  containerModal: {
    width: '100%',
    maxWidth: 420,

    backgroundColor: cores.white,

    borderRadius: 22,

    padding: 18,

    elevation: 8,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.18,

    shadowRadius: 8,
  },

  conteudoScroll: {
    alignItems: 'center',
  },

  imagem: {
    width: '100%',
    height: 160,

    borderRadius: 16,

    marginBottom: 14,
  },

  titulo: {
    fontSize: 20,
    fontWeight: 'bold',

    color: cores.primary,

    marginBottom: 6,

    textAlign: 'center',
  },

  causa: {
    fontSize: 15,

    color: cores.secondary,

    marginBottom: 14,

    textAlign: 'center',
  },

  descricao: {
    fontSize: 15,

    color: cores.text,

    lineHeight: 22,

    textAlign: 'center',

    marginBottom: 20,
  },

  botao: {
    backgroundColor: cores.primary,

    paddingVertical: 14,

    borderRadius: 14,

    alignItems: 'center',
  },

  textoBotao: {
    color: cores.white,

    fontWeight: '700',

    fontSize: 16,
  },
});