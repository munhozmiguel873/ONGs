import { Tabs, useLocalSearchParams } from 'expo-router';
import { createContext, useMemo, useState, useEffect, useContext } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

// 1. Definição dos tipos para o Contexto
export type UserContextValue = {
  userName: string;
  voluntarioId: string;
};

// 2. Criação do Contexto
export const UserContext = createContext<UserContextValue | undefined>(undefined);

// 3. Hook personalizado para facilitar o uso nos outros componentes/telas
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};

export default function TabsLayout() {
  // Captura os parâmetros passados via rota (ex: no login ou redirecionamento)
  const params = useLocalSearchParams<{ userName?: string; voluntarioId?: string }>();
  
  // Estados para manter os dados do usuário
  const [userName, setUserName] = useState(params.userName ?? 'voluntário');
  const [voluntarioId, setVoluntarioId] = useState(params.voluntarioId ?? '0');

  // Atualiza o estado caso os parâmetros mudem
  useEffect(() => {
    if (params.userName) setUserName(params.userName);
    if (params.voluntarioId) setVoluntarioId(params.voluntarioId);
  }, [params.userName, params.voluntarioId]);

  // Memoriza o valor do contexto para evitar re-renders desnecessários
  const userContextValue = useMemo(
    () => ({ userName, voluntarioId }),
    [userName, voluntarioId]
  );

  return (
    <UserContext.Provider value={userContextValue}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#59BA67',
          tabBarInactiveTintColor: '#777',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#e6e6e6',
            elevation: 8,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof MaterialIcons.glyphMap = 'home';

            if (route.name === 'explorar') {
              iconName = 'search';
            } else if (route.name === 'perfil') {
              iconName = 'person';
            } else if (route.name === 'dashboard') {
              iconName = 'dashboard';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Início',
          }}
        />
        <Tabs.Screen
          name="explorar"
          options={{
            title: 'Explorar',
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
          }}
        />
      </Tabs>
    </UserContext.Provider>
  );
}