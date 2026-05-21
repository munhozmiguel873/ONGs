import { Tabs, useLocalSearchParams } from 'expo-router';
import {
  createContext,
  useMemo,
  useState,
  useEffect,
  useContext,
} from 'react';

import { MaterialIcons } from '@expo/vector-icons';


// =========================
// TIPOS DO CONTEXTO
// =========================

export type UserContextValue = {
  userName: string;
  voluntarioId: string;
};


// =========================
// CRIAÇÃO DO CONTEXTO
// =========================

export const UserContext =
  createContext<UserContextValue | undefined>(undefined);


// =========================
// HOOK PERSONALIZADO
// =========================

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      'useUser deve ser usado dentro de um UserProvider'
    );
  }

  return context;
};


// =========================
// LAYOUT DAS TABS
// =========================

export default function TabsLayout() {

  // Pegando parâmetros da rota
  const params = useLocalSearchParams<{
    userName?: string;
    voluntarioId?: string;
  }>();


  // Estados do usuário
  const [userName, setUserName] = useState(
    params.userName ?? 'Voluntário'
  );

  const [voluntarioId, setVoluntarioId] = useState(
    params.voluntarioId ?? '0'
  );


  // Atualiza caso os parâmetros mudem
  useEffect(() => {

    if (params.userName) {
      setUserName(params.userName);
    }

    if (params.voluntarioId) {
      setVoluntarioId(params.voluntarioId);
    }

  }, [params.userName, params.voluntarioId]);


  // Memoriza os dados do contexto
  const userContextValue = useMemo(
    () => ({
      userName,
      voluntarioId,
    }),
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
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E6E6E6',
            borderTopWidth: 1,

            elevation: 8,

            height: 70,

            paddingBottom: 8,
            paddingTop: 8,
          },

          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },

          tabBarIcon: ({ color, size }) => {

            let iconName: keyof typeof MaterialIcons.glyphMap =
              'dashboard';

            // Dashboard
            if (route.name === 'dashboard') {
              iconName = 'dashboard';
            }

            // Explorar
            else if (route.name === 'explorar') {
              iconName = 'travel-explore';
            }

            // Perfil
            else if (route.name === 'perfil') {
              iconName = 'person';
            }

            return (
              <MaterialIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
        })}
      >

        {/* DASHBOARD */}
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
          }}
        />


        {/* EXPLORAR */}
        <Tabs.Screen
          name="explorar"
          options={{
            title: 'ONGs',
          }}
        />


        {/* PERFIL */}
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