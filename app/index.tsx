import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>A esperança da sociedade</Text>
      <Logo />
      <Slogan />

      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log("Botão Login pressionado!")}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>
    </View>
  );
}

// Logo da empresa
const Logo = () => (
  <Image
    source={{
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPD_0iBv76x1mNGph0QgZjEBs2MFKBBHLMOA&s",
    }}
    style={styles.logo}
    resizeMode="contain"
  />
);

// Slogan
const Slogan = () => (
  <View style={styles.sloganContainer}>
    <Text style={styles.sloganText}>“Transformando vidas com solidariedade.”</Text>
  </View>
);

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#59BA67", // verde que combina melhor com o logo
  },
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 20,
  },
  sloganContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  sloganText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 30,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});