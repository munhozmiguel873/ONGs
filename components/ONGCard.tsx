import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import colors from '../styles/colors';

type Props = {
  nome: string;
  causa: string;
  imagem: string;
  onPress?: () => void;
};

export default function ONGCard({ nome, causa, imagem, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: imagem }} style={styles.logo} />

      <View style={styles.content}>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.causa}>{causa}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 16,
    marginRight: 14,
    backgroundColor: colors.gray,
  },
  content: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  causa: {
    fontSize: 14,
    color: colors.gray,
  },
});
