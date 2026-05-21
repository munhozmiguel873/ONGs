import React from 'react';

import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;

  nome: string;
  descricao: string;
  causa: string;
  imagem: string;
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.overlay}>

        <View style={styles.modal}>

          <Image
            source={{ uri: imagem }}
            style={styles.imagem}
          />

          <Text style={styles.nome}>
            {nome}
          </Text>

          <Text style={styles.causa}>
            {causa}
          </Text>

          <Text style={styles.descricao}>
            {descricao}
          </Text>

          <TouchableOpacity
            style={styles.botao}
            onPress={onClose}
          >
            <Text style={styles.botaoTexto}>
              Fechar
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modal: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },

  imagem: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 14,
  },

  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  causa: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },

  descricao: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },

  botao: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});