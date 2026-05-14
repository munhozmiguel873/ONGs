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

import colors from '../styles/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  nome: string;
  descricao: string;
  causa: string;
  imagem?: string;
};

export default function ONGModal({
  visible,
  onClose,
  nome,
  descricao,
  causa,
  imagem,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {imagem ? (
              <Image source={{ uri: imagem }} style={styles.image} />
            ) : null}

            <Text style={styles.title}>{nome}</Text>
            <Text style={styles.cause}>{causa}</Text>
            <Text style={styles.description}>{descricao}</Text>
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  scrollContent: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  cause: {
    fontSize: 15,
    color: colors.secondary,
    marginBottom: 14,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
