import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';

import ONGCard from '../components/ONGCard';

export default function Explorar() {

    // Estado de carregamento
    const [loading, setLoading] = useState(true);

    // Lista de ONGs
    const [ongs, setOngs] = useState<any[]>([]);

    useEffect(() => {

        // Simula API carregando
        setTimeout(() => {

            setOngs([
                {
                    id: '1',
                    nome: 'ONG Amigos dos Animais',
                    causa: 'Proteção animal',
                    imagem: require('https://chatgpt.com/backend-api/estuary/content?id=file_0000000086b471f595f4ea6a0f678c88&ts=494101&p=fs&cid=1&sig=8fd4409eacd1dc9f012eea30413f934cbe73432799dbe5e9b55a4dfa36897f4d&v=0'),
                },

                {
                    id: '2',
                    nome: 'Salvar o Planeta',
                    causa: 'Meio ambiente',
                    imagem: require('https://chatgpt.com/backend-api/estuary/content?id=file_0000000096f0720e9a430820867f8c7d&ts=494100&p=fs&cid=1&sig=8309a97f31c93cc7f76a2a0ba891ba12d2d74c4ad4af83b6ee3b5b4fcf04eb38&v=0'),
                },

                {
                    id: '3',
                    nome: 'Mãos Solidárias',
                    causa: 'Ajuda humanitária',
                    imagem: require('https://chatgpt.com/backend-api/estuary/content?id=file_00000000a6c5721f9b540830968f9c8e&ts=494102&p=fs&cid=1&sig=941ab08f42d94dd8f77b3a1cb9a2c13ebe84543800ec8f7a666b5c5gd37a8f5e&v=0'),
                },
            ]);

            setLoading(false);

        }, 2000);

    }, []);

    // Tela de loading
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />

                <Text style={styles.loadingText}>
                    Carregando ONGs...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <FlatList
                data={ongs}

                keyExtractor={(item) => item.id}

                renderItem={({ item }) => (
                    <ONGCard
                        nome={item.nome}
                        causa={item.causa}
                        imagem={item.imagem}
                    />
                )}

                showsVerticalScrollIndicator={false}
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: 20,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },

});