import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Por favor, informe o nome do voluntário.");
      return;
    }

    const expectedPassword = "123456";
    const trimmedName = name.trim();

    if (password === expectedPassword) {
      const voluntarioId = Math.floor(Math.random() * 1000) + 1;
      router.push({
        pathname: '/(tabs)/Dashboard',
        params: { userName: trimmedName, voluntarioId: voluntarioId.toString() },
      });
    } else {
      Alert.alert("Erro", "Senha inválida. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do voluntário"
        placeholderTextColor="#888"
        autoCapitalize="words"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#888"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={6}
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.hintText}>A senha deve conter 6 dígitos numéricos.</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
        {/* TEXTO ALTERADO DE "Sair" PARA "Entrar" */}
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F9F5",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#20662D",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    color: "#000000",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  hintText: {
    alignSelf: "flex-start",
    color: "#666666",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  button: {
    width: "100%",
    backgroundColor: "#20662D",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 18,
  },
  backButtonText: {
    color: "#20662D",
    fontSize: 16,
    fontWeight: "600",
  },
});
