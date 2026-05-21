import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { useRouter } from 'expo-router';

const interessesLista = [
  'Educação',
  'Saúde',
  'Meio Ambiente',
  'Assistência Social',
  'Animais',
  'Tecnologia',
];

export default function Interesses() {
  const router = useRouter();
  const [selecionados, setSelecionados] =
    useState<string[]>([]);


  function toggleInteresse(interesse: string) {
    if (selecionados.includes(interesse)) {
      setSelecionados(
        selecionados.filter((item) => item !== interesse)
      );

    } else {
      setSelecionados([
        ...selecionados,
        interesse,
      ]);
    }
  }


  function salvar() {

    Alert.alert(
      'Sucesso',
      'Interesses atualizados!'
    );

    router.back();
  }


  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Escolha seus interesses 💚
      </Text>


      {interessesLista.map((interesse) => {

        const ativo =
          selecionados.includes(interesse);

        return (

          <TouchableOpacity
            key={interesse}

            style={[
              styles.card,
              ativo && styles.cardAtivo,
            ]}

            onPress={() =>
              toggleInteresse(interesse)
            }
          >

            <Text
              style={[
                styles.cardTexto,
                ativo && styles.cardTextoAtivo,
              ]}
            >
              {interesse}
            </Text>

          </TouchableOpacity>
        );
      })}


      <TouchableOpacity
        style={styles.botao}
        onPress={salvar}
      >
        <Text style={styles.botaoTexto}>
          Salvar
        </Text>
      </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#59BA67',
    marginBottom: 24,
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },

  cardAtivo: {
    backgroundColor: '#59BA67',
    borderColor: '#59BA67',
  },

  cardTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  cardTextoAtivo: {
    color: '#fff',
  },

  botao: {
    marginTop: 24,
    backgroundColor: '#59BA67',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});