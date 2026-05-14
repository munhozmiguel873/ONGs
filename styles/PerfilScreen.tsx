import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import colors from '../styles/colors';

export default function PerfilScreen() {

  function editarInteresses() {
    Alert.alert(
      'Escolha suas causas',
      'Qual área você deseja apoiar?',
      [
        {
          text: 'Educação',
          onPress: () =>
            Alert.alert(
              'Selecionado',
              'Você escolheu Educação'
            ),
        },
        {
          text: 'Meio Ambiente',
          onPress: () =>
            Alert.alert(
              'Selecionado',
              'Você escolheu Meio Ambiente'
            ),
        },
        {
          text: 'Saúde',
          onPress: () =>
            Alert.alert(
              'Selecionado',
              'Você escolheu Saúde'
            ),
        },

        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Perfil do Voluntário
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={editarInteresses}
      >
        <Text style={styles.buttonText}>
          Editar Interesses
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: colors.primary,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,

    elevation: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});