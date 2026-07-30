import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Accelerometer } from 'expo-sensors';

export default function DashboardONG() {
  const [image, setImage] = useState<string | null>(null);
  const isShaking = useRef(false);

  // Requisito 2: Shake to Refresh - Simula busca de doações
  useEffect(() => {
    // Não inicializa sensores no ambiente web (expo-sensors requer módulo nativo)
    if (Platform.OS === 'web' || typeof Accelerometer.addListener !== 'function') {
      return;
    }

    Accelerometer.setUpdateInterval(200);

    const subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      const shakeThreshold = 2.5;

      if (acceleration > shakeThreshold && !isShaking.current) {
        isShaking.current = true; // Evita que o alerta abra várias vezes

        Alert.alert(
          "🔄 Sincronizando...",
          "Buscando novas doações e atualizando as causas no servidor.",
          [{ text: "OK", onPress: () => { isShaking.current = false; } }]
        );
      }
    });

    return () => {
      subscription && subscription.remove();
    };
  }, []);

  // Requisito 1: Escolher foto da Galeria
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria para anexar fotos da causa.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Requisito 3: Se o usuário cancelar, o estado permanece intacto
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Requisito 1 extra: Capturar usando a Câmera
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à câmera para fotografar a causa.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ONG Connect 🚀</Text>
      <Text style={styles.subtitle}>Dashboard e Causas Sociais</Text>

      {/* Requisito 3: Exibir a imagem em um componente Image */}
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={() => setImage(null)}>
            <Text style={styles.buttonText}>Remover Imagem</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>📁 Escolher da Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={takePhoto}>
            <Text style={styles.buttonText}>📸 Tirar Foto da Causa</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Text style={styles.hint}>Chacoalhe o aparelho para sincronizar doações</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#7f8c8d',
  },
  actionsContainer: {
    gap: 15, // Espaçamento entre os botões (funciona bem em RN moderno)
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  cameraButton: {
    backgroundColor: '#27ae60', // Verde para diferenciar a câmera
  },
  clearButton: {
    backgroundColor: '#e74c3c', // Vermelho para ação de remover
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  hint: {
    textAlign: 'center',
    marginTop: 40,
    color: '#95a5a6',
    fontSize: 14,
    fontStyle: 'italic',
  },
});