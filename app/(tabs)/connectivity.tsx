/* import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import * as Network from 'expo-network';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from 'expo-router';

import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WifiNetwork {
    id: string;
    ssid: string;
    level: string;
}

// Estrutura do item que ficará salvo na fila offline
interface DonationQueueItem {
    id: string;
    description: string;
    localPhotoUri: string;
}
export default function ConnectivityDashboard() {
    const [loadingLatency, setLoadingLatency] = useState(false);
    const [latency, setLatency] = useState<number | null>(null);
    const [scanningWifi, setScanningWifi] = useState(false);
    const [wifiList, setWifiList] = useState<WifiNetwork[]>([]);

    // Controla o indicador de carregamento do botão da doação
    const [sendingDonation, setSendingDonation] = useState(false);

    const [conn, setConn] = useState({
        isConnected: false,
        type: 'unknown',
        ip: 'Buscando...',
        isInternetReachable: false
    });
    // 1. Busca o IP
    const fetchIP = async () => {
        try {
            const ip = await Network.getIpAddressAsync();
            setConn(prev => ({ ...prev, ip: ip || 'Desconhecido' }));
        } catch (e) {
            setConn(prev => ({ ...prev, ip: Platform.OS === 'web' ? 'Privado (Web)' : 'Erro' }));
        }
    };

    // 2. Teste de Latência Real
    const testLatency = async () => {
        setLoadingLatency(true);
        const start = Date.now();
        try {
            await fetch('https://google.com', { mode: 'no-cors', cache: 'no-cache' });
            const end = Date.now();
            setLatency(end - start);
        } catch (error) {
            setLatency(null);
        } finally {
            setLoadingLatency(false);
        }
    };

    // 3. Varredura de Redes (Mock)
    const scanWifiNetworks = () => {
        setScanningWifi(true);
        setWifiList([]);
        setTimeout(() => {
            const mockNetworks = [
                { id: '1', ssid: 'ONG_CONNECT_MAIN_5G', level: 'Forte' },
                { id: '2', ssid: 'REDE_ADMINISTRATIVA', level: 'Média' },
                { id: '3', ssid: 'LINK_CONVIDADOS', level: 'Fraca' },
                { id: '4', ssid: 'HOTSPOT_DIRETORIA', level: 'Forte' },
            ];
            setWifiList(mockNetworks);
            setScanningWifi(false);
        }, 2500);
    };
    // 4. Função chamada pelo botão de enviar doação (Decide se envia ou salva local)
    const handleNewDonation = async (tempPhotoUri: string, description: string) => {
        setSendingDonation(true);

        if (conn.isConnected) {
            try {
                console.log("Enviando diretamente para o servidor da ONG...");
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simula envio HTTP
                Alert.alert("Sucesso", "Doação enviada diretamente para o servidor!");
            } catch (error) {
                Alert.alert("Erro", "Falha ao enviar. Salvando localmente...");
                await saveDonationLocally(tempPhotoUri, description);
            } finally {
                setSendingDonation(false);
            }
        } else {
            await saveDonationLocally(tempPhotoUri, description);
            setSendingDonation(false);
        }
    };

    // 5. Salva a foto física no disco e os dados estruturados no AsyncStorage
    const saveDonationLocally = async (tempUri: string, description: string) => {
        try {
            const donationId = Math.random().toString(36).substring(7);
            const filename = `donation_${donationId}.jpg`;
            const permanentUri = `${FileSystem.documentDirectory}${filename}`;

            // Cria um arquivo temporário físico caso ele não exista para o teste
            const fileInfo = await FileSystem.getInfoAsync(tempUri);
            if (!fileInfo.exists) {
                await FileSystem.writeAsStringAsync(tempUri, "mock_image_data");
            }

            // Move a imagem da pasta temporária para o armazenamento permanente do app
            await FileSystem.copyAsync({ from: tempUri, to: permanentUri });

            const existingQueueStr = await AsyncStorage.getItem('@ong_connect_sync_queue');
            const queue: DonationQueueItem[] = existingQueueStr ? JSON.parse(existingQueueStr) : [];

            // Adiciona o novo item na fila offline
            queue.push({ id: donationId, description, localPhotoUri: permanentUri });

            await AsyncStorage.setItem('@ong_connect_sync_queue', JSON.stringify(queue));
            Alert.alert("Modo Offline", "Você está sem rede. A foto foi guardada no aparelho e será enviada ao voltar online!");
        } catch (error) {
            console.error("Erro ao salvar localmente:", error);
            Alert.alert("Erro", "Não foi possível salvar os dados localmente.");
        }
    };

    // 6. Processa e esvazia a fila offline enviando tudo para o servidor
    const syncOfflineDonations = async () => {
        try {
            const queueStr = await AsyncStorage.getItem('@ong_connect_sync_queue');
            if (!queueStr) return;

            const queue: DonationQueueItem[] = JSON.parse(queueStr);
            if (queue.length === 0) return;

            console.log(`Conexão reestabelecida! Sincronizando ${queue.length} doações...`);

            for (const donation of queue) {
                try {
                    console.log(`Subindo foto do arquivo local: ${donation.localPhotoUri}`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula tempo do upload

                    // Apaga o arquivo físico local após subir com sucesso para liberar espaço
                    await FileSystem.deleteAsync(donation.localPhotoUri, { idempotent: true });
                } catch (uploadError) {
                    console.error(`Erro ao subir item ${donation.id}, mantendo na fila.`, uploadError);
                    return; // Interrompe o loop para tentar novamente na próxima mudança de rede
                }
            }

            await AsyncStorage.removeItem('@ong_connect_sync_queue');
            Alert.alert("Sincronização Concluída", "Todas as doações offline foram enviadas com sucesso!");
        } catch (e) {
            console.error("Erro geral na sincronização:", e);
        }
    };
    // Monitor de mudanças na rede
    useEffect(() => {
        fetchIP();
        const unsubscribe = NetInfo.addEventListener(state => {
            const isNowOnline = (state.isConnected && state.isInternetReachable) ?? false;

            setConn(prev => ({
                ...prev,
                isConnected: state.isConnected ?? false,
                type: state.type ?? 'unknown',
                isInternetReachable: state.isInternetReachable ?? false,
            }));

            // SE VOLTOU A FICAR ONLINE DE VERDADE: Dispara a sincronização!
            if (isNowOnline) {
                syncOfflineDonations();
            }
        });
        return () => unsubscribe();
    }, []);

    // FUNÇÃO DE SIMULAÇÃO
    const testOfflineFlow = async () => {
        try {
            // 1. Define onde o arquivo temporário de teste vai ficar
            const mockPhotoUri = `${FileSystem.cacheDirectory}captured_photo_test.jpg`;

            // 2. Cria um arquivo de texto simples fingindo ser uma imagem (pro FileSystem aceitar copiar)
            await FileSystem.writeAsStringAsync(mockPhotoUri, "dados_falsos_de_uma_imagem_base64");

            console.log("Arquivo temporário de simulação criado com sucesso!");

            // 3. Dispara o fluxo principal de doação passando o arquivo que criamos acima
            await handleNewDonation(mockPhotoUri, "Cesta Básica para a comunidade");

        } catch (error) {
            console.error("Falha ao simular o arquivo de foto:", error);
            Alert.alert("Erro no Teste", "Não foi possível simular a criação da foto.");
        }
    };

    return (
        <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>ONG Connect</Text>
                    <Text style={styles.title}>Painel de Conectividade</Text>
                </View>

                <View style={styles.mainCard}>
                    <View style={[styles.statusIconBg, { backgroundColor: conn.isConnected ? '#DCFCE7' : '#FEE2E2' }]}>
                        <Ionicons
                            name={conn.isConnected ? "cloud-done" : "cloud-offline"}
                            size={40}
                            color={conn.isConnected ? "#16A34A" : "#DC2626"}
                        />
                    </View>
                    <Text style={styles.statusText}>
                        Status: <Text style={{ fontWeight: 'bold' }}>{conn.isConnected ? "Online" : "Offline"}</Text>
                    </Text>
                    <Text style={styles.infoText}>Tipo: {conn.type.toUpperCase()}</Text>
                    <Text style={styles.infoText}>IP: {conn.ip}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ações e Testes</Text>

                    <TouchableOpacity style={styles.button} onPress={testOfflineFlow} disabled={sendingDonation}>
                        {sendingDonation ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Ionicons name="camera" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                <Text style={styles.buttonText}>Simular Envio de Foto (Doação)</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={testLatency} disabled={loadingLatency}>
                        {loadingLatency ? (
                            <ActivityIndicator color="#475569" />
                        ) : (
                            <Text style={styles.secondaryButtonText}>
                                {latency ? `Latência: ${latency}ms (Testar Novamente)` : "Testar Latência Real"}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Redes Wi-Fi Próximas</Text>
                    <TouchableOpacity style={styles.scanButton} onPress={scanWifiNetworks} disabled={scanningWifi}>
                        <Text style={styles.buttonText}>{scanningWifi ? "Buscando Redes..." : "Escanear Redes"}</Text>
                    </TouchableOpacity>
                    {scanningWifi && <ActivityIndicator style={{ marginTop: 15 }} color="#2563EB" />}

                    {wifiList.map(wifi => (
                        <View key={wifi.id} style={styles.wifiItem}>
                            <Ionicons name="wifi" size={18} color="#2563EB" />
                            <Text style={styles.wifiSsid}>{wifi.ssid}</Text>
                            <Text style={styles.wifiLevel}>{wifi.level}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 24, paddingTop: 60 },
    header: { marginBottom: 24 },
    greeting: { fontSize: 16, color: '#64748B' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#1E293B' },
    mainCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 24
    },
    statusIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    statusText: { fontSize: 18, color: '#334155', marginBottom: 8 },
    infoText: { fontSize: 14, color: '#64748B', marginBottom: 4 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
    button: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    secondaryButton: { backgroundColor: '#E2E8F0' },
    secondaryButtonText: { color: '#475569', fontWeight: 'bold' },
    scanButton: { backgroundColor: '#10B981', borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center' },
    wifiItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    wifiSsid: { flex: 1, marginLeft: 12, fontSize: 14, color: '#334155', fontWeight: '500' },
    wifiLevel: { fontSize: 12, color: '#64748B', backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }
}); */