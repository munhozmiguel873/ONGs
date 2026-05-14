import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from './_layout';
import colors from '../../styles/colors';

export default function Dashboard() {
  const router = useRouter();
  const context = useContext(UserContext);
  const { userName, voluntarioId } = context || { userName: 'voluntário', voluntarioId: '0' };

  function handleLogout() {
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, {userName}!</Text>
      <Text style={styles.subtitle}>
        Bem-vindo ao painel da ONG Connect. Aqui você encontra o melhor caminho para ajudar.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Seu ID de voluntário</Text>
        <Text style={styles.cardValue}>{voluntarioId}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2FAF4',
    padding: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  logoutButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
