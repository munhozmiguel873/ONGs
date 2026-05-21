import React from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import cores from '../styles/colors';

type Propriedades = {
  nome: string;
  causa: string;
  imagem: string;
  onPress?: () => void;
};

export default function CartaoONG({
  nome,
  causa,
  imagem,
  onPress,
}: Propriedades) {
  return (
    <TouchableOpacity
      style={estilos.cartao}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: imagem }}
        style={estilos.logo}
      />

      <View style={estilos.conteudo}>
        <Text style={estilos.nome}>
          {nome}
        </Text>

        <Text style={estilos.causa}>
          {causa}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: cores.white,

    borderRadius: 18,

    padding: 14,

    marginBottom: 14,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.12,

    shadowRadius: 6,

    elevation: 4,
  },

  logo: {
    width: 70,
    height: 70,

    borderRadius: 16,

    marginRight: 14,

    backgroundColor: cores.gray,
  },

  conteudo: {
    flex: 1,
  },

  nome: {
    fontSize: 16,

    fontWeight: '700',

    color: cores.text,

    marginBottom: 4,
  },

  causa: {
    fontSize: 14,

    color: cores.gray,
  },
});