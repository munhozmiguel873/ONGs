import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useSearchParams } from "expo-router";

export default function Dashboard() {
  const router = useRouter();
  const { userName, voluntarioId } = useSearchParams();

  const handleLogout = () => {
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {userName}, que bom ter você aqui para ajudar!</Text>
      <Text style={styles.subtitle}>ID do voluntário: {voluntarioId}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.buttonText}>SAIR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#59BA67",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    marginBottom: 32,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});