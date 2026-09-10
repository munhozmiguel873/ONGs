import { Ionicons } from '@expo/vector-icons';
import Netinfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import * as Network from 'expo-network';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

/** =========================================
 *            IMPORTS DE IMAGEM
============================================**/
// Acesso às fotos salvas e à cemarea física
import * as ImagePicker from 'expo-image-picker';

// Acesso ao acelerômetro (sensor de movimento)
import { Accelerometer } from 'expo-sensors';

// Garante que o app respete os limites físicos da tela (notch, câmera)
import { SafeAreaView } from 'react-native-safe-area-context';


// Cálculo responsivo: divide a tela por 3 e desconta as margens
const { width } = Dimensions.get('window');
const columnWidth = width / 3 - 15;


export default function TraveLog() {
    const navigation = useNavigation();

    // Memória do componente: guarda a lista de caminhos das fotos
    const [images, setImages] = useState<string[]>([]);

    // --- FUNÇÃO PARA TIRAR A FOTO (CÂMERA) ---
    const takePhoto = async () => {
        // 1. Solicita acesso ao hardware da câmera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert("Erro", "Precisamos de permissão para usar a câmera!");
            return;
        }

        // 2. Abre a câmera nativa
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7, // Otimização: reduz o tamanho da foto na memória
        });

        // 3. Se a foto foi tirada, adciona à lista
        if (!result.canceled) {
            setImages(prev => [result.assets[0].uri, ...prev]);
        }
    };

    // --- FUNÇÃO PARA ESCOLHER DA GALERIA ---
    const pickImage = async () => {
        // 1. Solicita acesso aos arquivos salvos
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert("Erro", "Precisamos de acesso às suas fotos!");
            return;
        }

        // 2. Abre a glaeria de fotos do sistema
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        // 3. Adiciona a foto selecionada à lista
        if (!result.canceled) {
            setImages(prev => [result.assets[0].uri, ...prev]);
        }
    };

    // --- HARDWARE: SENSOR DE MOVIMENTO (SHAKE) ---
    useEffect(() => {
        // Proteção contra ambiente WEB (navegadores não têm acelerômetro acessível assim)
        if (Platform.OS === 'web') return;

        // Frequência de leitura (a cada 100 milissegundos)
        Accelerometer.setUpdateInterval(100);

        // Escuta os movimentos contínuos nos 3 eixos (x, y, z)
        const subscription = Accelerometer.addListener(({ x, y, z }) => {
            const totalForce = Math.abs(x) + Math.abs(y) + Math.abs(z);

            // Limiar de força para detectar o chacoalhão
            if (totalForce > 3.5) {
                handleShake();
            }
        });

        // Deliga a escuts ao sair da tela para poupar bateria
        return () => subscription.remove();
    }, [images]);

    const handleShake = () => {
        if (images.length > 0) {
            setImages([]); // Limpa todo o array de fotos
            Alert.alert("Galeria Resetada", "Você apagou todas as fotos da galeria!");
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    // --- PARTE DO DESAFIO FINAL DA ATIVIDADE DE CONECTIVIDADE ---
    const [scanningWIfi, setScanningWifi] = useState(false);

    const [conn, setConn] = useState<any>({
        isConnected: false,
        type: 'unknown',
        ip: 'Buscando...',
        isInternetReachable: false,
    });

    // 1. Função de Hardeware: Busca o IP Local no aparelho
    const fecthIP = async () => {
        try {
            const ip = await Network.getIpAddressAsync();
            setConn((prev: any) => ({ ...prev, ip }));
        } catch (e) {
            setConn((prev: any) => ({ ...prev, ip: Platform.OS === 'web' ? 'Privado (Web)' : 'Erro' }));
        }
    };

    // 2. Função de simulação de varredura de redes
    const scanWifiNetworks = () => {
        setScanningWifi(true);
    };

    useEffect(() => {
        fecthIP();
        // Listener: Ouve mudanças de conexão em tempo real (Observer Pattern)
        const unsubscribe = Netinfo.addEventListener(state => {
            setConn((prev: any) => ({
                ...prev,
                isConnected: state.isConnected,
                type: state.type,
                isInternetReachable: state.isInternetReachable,
            }));
        });
        return () => unsubscribe();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Galeria</Text>

                {/* CARD PRINCIPAL - REATIVIDADE */}
                <View style={styles.mainCard}>
                    <View style={[styles.statusIconBg, {
                        backgroundColor: conn.isConnected ? '#dcfe7' : '#fee2e2'
                    }]}>
                        <Ionicons
                            name={conn.isConnected ? "wifi" : "cloud-offline"}
                            size={40}
                            color={conn.isConnected ? "#16a34a" : "#dc2626"}
                        />
                    </View>

                    <View style={styles.mainInfo}>
                        <Text style={styles.statusLabel}>Status da Rede</Text>
                        <Text style={[styles.statusValue, {
                            color: conn.isConnected ? '#16a34a' : '#dc2626'
                        }]}>
                            {conn.isConnected ? "Online" : "Offline"}
                        </Text>
                    </View>
                </View>
            </View>


            {/* Botões de Ação */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                    <Text style={styles.buttonText}>Tirar Foto 📷</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.btnGallery]} onPress={pickImage}>
                    <Text style={styles.buttonText}>Galeria 🖼️</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>Minha Galeria de Imagens</Text>

            {/* Exibição em Grade */}
            <FlatList
                data={images}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3} // Ativa a grade de 3 colunas
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.thumbnail} />
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhum foto registrada ainda.</Text>
                }
            />

            <Text style={styles.hint}>Dica: Chacoalhe para limpar a galeria!</Text>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleBack}>
                <Text style={styles.logoutText}>↩ Voltar</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3fbff',
        paddingHorizontal: 10
    },

    headerContainer: {
        flexDirection: 'row',     // Garante que o texto Galeria e o Card fiquem na mesma linha
        alignItems: 'center',      // Alinha verticalmente o texto e o card ao centro
        justifyContent: 'center',  // Centraliza o conjunto na tela
        gap: 15,                  // Dá um espaçamento horizontal entre a palavra Galeria e o card
        paddingHorizontal: 10,
    },

    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 20,
        color: '#1E293B'
    },

    mainCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 15,              // Reduzi um pouco para caber melhor na linha
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
    },

    statusIconBg: {
        width: 70,
        height: 70,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },

    mainInfo: {
        marginLeft: 16
    },

    statusLabel: {
        fontSize: 16,
        color: '#94A3B8'
    },

    statusValue: {
        fontSize: 20,
        fontWeight: '800'
    },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },

    button: {
        flex: 1,
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 5,
        elevation: 3
    },

    btnGallery: {
        backgroundColor: '#2ecc71',
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#34495e',
    },

    listContent: {
        paddingBottom: 20,
    },

    thumbnail: {
        width: columnWidth,
        height: columnWidth, // Completado (a borda direita cortou "columnWidt")
        margin: 5,
        borderRadius: 8,
        backgroundColor: '#eee', // Completado (cortou após "background")
    },

    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#95a5a6',
        fontStyle: 'italic',
    },

    hint: {
        textAlign: 'center',
        marginVertical: 15,
        color: '#bdc3c7',
        fontSize: 12,
    },

    logoutBtn: {
        backgroundColor: '#ffe0e0',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 20,
    },

    logoutText: {
        color: '#cc0000',
        fontWeight: '700',
        fontSize: 15,
    },


});