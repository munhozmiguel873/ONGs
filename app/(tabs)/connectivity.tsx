import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Platform,
    TouchableOpacity, // Corrigido capitalização
    ActivityIndicator, // Corrigido capitalização
} from 'react-native';
import * as Network from 'expo-network';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from 'expo-router';

interface WifiNetwork {
    id: string;
    ssid: string;
    level: string;
}

export default function ConnectivityDashboard() {
    const [loadingLatency, setLoadingLatency] = useState(false);
    const [latency, setLatency] = useState<number | null>(null);
    const [scanningWifi, setScanningWifi] = useState(false);
    const [wifiList, setWifiList] = useState<WifiNetwork[]>([]); // Corrigida a inicialização do estado

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
            await fetch('https://www.google.com', { mode: 'no-cors', cache: 'no-cache' });
            const end = Date.now();
            setLatency(end - start);
        } catch (error) {
            setLatency(null);
        } finally {
            setLoadingLatency(false);
        }
    };

    // 3. Varredura de Redes (Simulada)
    const scanWifiNetworks = () => {
        setScanningWifi(true);
        setWifiList([]);
        setTimeout(() => {
            const mockNetworks = [
                { id: '1', ssid: 'SESI_ALUNOS_5G', level: 'Forte' },
                { id: '2', ssid: 'REDE_ADMINISTRATIVA', level: 'Média' },
                { id: '3', ssid: 'LINK_CONVIDADOS', level: 'Fraca' },
                { id: '4', ssid: 'HOTSPOT_DIRETORIA', level: 'Forte' },
            ];
            setWifiList(mockNetworks);
            setScanningWifi(false);
        }, 2500);
    };

    useEffect(() => {
        fetchIP();
        const unsubscribe = NetInfo.addEventListener(state => {
            setConn(prev => ({
                ...prev,
                isConnected: state.isConnected ?? false,
                type: state.type ?? 'unknown',
                isInternetReachable: state.isInternetReachable ?? false,
            }));
        });
        return () => unsubscribe();
    }, []);

    return (
        <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hardware III</Text>
                    <Text style={styles.title}>Connectivity Pro</Text>
                </View>

                {/* CARD PRINCIPAL */}
                <View style={styles.mainCard}>
                    <View style={[styles.statusIconBg, { backgroundColor: conn.isConnected ? '#dcfce7' : '#fee2e2' }]}>
                        <Ionicons
                            name={conn.isConnected ? "wifi" : "cloud-offline"}
                            size={40}
                            color={conn.isConnected ? "#16a34a" : "#dc2626"}
                        />
                    </View>
                    <View style={styles.mainInfo}>
                        <Text style={styles.statusLabel}>Status da Rede</Text>
                        <Text style={[styles.statusValue, { color: conn.isConnected ? '#16a34a' : '#dc2626' }]}>
                            {conn.isConnected ? "Online" : "Offline"}
                        </Text>
                    </View>
                </View>

                {/* GRID DE DETALHES TÉCNICOS */}
                <View style={styles.grid}>
                    <View style={styles.detailCard}>
                        <Ionicons name="git-network-outline" size={24} color="#64748b" />
                        <Text style={styles.detailLabel}>Tipo</Text>
                        <Text style={styles.detailValue}>{conn.type.toUpperCase()}</Text>
                    </View>

                    <View style={styles.detailCard}>
                        <Ionicons name="locate-outline" size={24} color="#64748b" />
                        <Text style={styles.detailLabel}>IP Local</Text>
                        <Text style={styles.detailValue}>{conn.ip}</Text>
                    </View>

                    <View style={styles.detailCard}>
                        <Ionicons name="timer-outline" size={24} color="#64748b" />
                        <Text style={styles.detailLabel}>Latência</Text>
                        <Text style={styles.detailValue}>{latency ? `${latency}ms` : '--'}</Text>
                    </View>

                    <View style={styles.detailCard}>
                        <Ionicons name="globe-outline" size={24} color="#64748b" />
                        <Text style={styles.detailLabel}>Internet</Text>
                        <Text style={styles.detailValue}>{conn.isInternetReachable ? "OK" : "Falha"}</Text>
                    </View>
                </View>

                {/* BOTÃO: DIAGNÓSTICO */}
                <TouchableOpacity
                    style={[styles.button, loadingLatency && { opacity: 0.7 }]}
                    onPress={testLatency}
                    disabled={loadingLatency}
                >
                    {loadingLatency ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>TESTAR LATÊNCIA</Text>}
                </TouchableOpacity>

                {/* BOTÃO: VARREDURA */}
                <TouchableOpacity
                    style={[styles.button, styles.btnScan, scanningWifi && { opacity: 0.7 }]}
                    onPress={scanWifiNetworks}
                    disabled={scanningWifi}
                >
                    {scanningWifi ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>VARREDURA DE REDES</Text>}
                </TouchableOpacity>

                {/* LISTA DE RESULTADOS DA VARREDURA */}
                {wifiList.length > 0 && (
                    <View style={styles.wifiListContainer}>
                        <Text style={styles.wifiListTitle}>Redes Encontradas:</Text>
                        {wifiList.map((item) => (
                            <View key={item.id} style={styles.wifiItem}>
                                <Ionicons name="wifi" size={18} color="#64748b" />
                                <Text style={styles.wifiName}>{item.ssid}</Text>
                                <Text style={styles.wifiLevel}>{item.level}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 25, paddingTop: 60 },
    header: { marginBottom: 30 },
    greeting: { fontSize: 14, color: '#64748b', fontWeight: 'bold', letterSpacing: 1 },
    title: { fontSize: 28, fontWeight: '800', color: '#1E293B' },
    mainCard: {
        backgroundColor: '#FFF', borderRadius: 24, padding: 20, flexDirection: 'row',
        alignItems: 'center', elevation: 4, marginBottom: 20
    },
    statusIconBg: {
        width: 70, height: 70, borderRadius: 20, justifyContent: 'center',
        alignItems: 'center'
    },
    mainInfo: { flex: 1, marginLeft: 15 },
    statusLabel: { fontSize: 14, color: '#94A3B8' },
    statusValue: { fontSize: 22, fontWeight: '800' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    detailCard: {
        backgroundColor: '#FFF', width: '48%', borderRadius: 20, padding: 15,
        marginBottom: 15
    },
    detailLabel: { fontSize: 12, color: '#94A3B8', marginTop: 10 },
    detailValue: { fontSize: 15, color: '#334155', fontWeight: 'bold' },
    button: {
        backgroundColor: '#1E293B', padding: 18, borderRadius: 16, alignItems: 'center',
        marginTop: 10, flexDirection: 'row', justifyContent: 'center'
    },
    btnScan: { backgroundColor: '#334155', marginTop: 15 },
    buttonText: { color: '#FFF', fontWeight: 'bold', letterSpacing: 1 },
    wifiListContainer: {
        marginTop: 25, backgroundColor: '#FFF', borderRadius: 20, padding: 20,
        marginBottom: 40
    },
    wifiListTitle: { fontWeight: '800', color: '#1E293B', marginBottom: 15 },
    wifiItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9'
    },
    wifiName: { flex: 1, marginLeft: 10, color: '#334155', fontWeight: '600' },
    wifiLevel: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold' }
});
