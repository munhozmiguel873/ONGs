import React, { useContext } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useRouter } from 'expo-router';
import { UserContext } from './_layout';
import colors from '../../styles/colors';


export default function Perfil() {
  const context = useContext(UserContext);
  const { userName } =
    context || { userName: 'Voluntário' };
  const router = useRouter();


  return (

    <View style={styles.container}>

      <Text style={styles.greeting}>
        Perfil de {userName}
      </Text>


      <Text style={styles.subtitle}>
        Aqui você pode gerenciar suas preferências
        e manter seu perfil atualizado.
      </Text>


      <View style={styles.infoBox}>

        <Text style={styles.infoLabel}>
          Voluntário
        </Text>

        <Text style={styles.infoValue}>
          {userName}
        </Text>

      </View>


      <View style={styles.infoBox}>

        <Text style={styles.infoLabel}>
          Status
        </Text>

        <Text style={styles.infoValue}>
          Ativo para novas causas
        </Text>

      </View>


      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/interesses')}
        activeOpacity={0.85}
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
    backgroundColor: colors.background,
    padding: 24,
  },

  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 24,
  },

  infoBox: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },

  infoLabel: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },

  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  button: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});