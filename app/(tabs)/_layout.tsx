import { Tabs, useLocalSearchParams } from 'expo-router';

import {
  createContext,
  useMemo,
  useState,
  useEffect,
  useContext,
} from 'react';

import { MaterialIcons } from '@expo/vector-icons';

export type UserContextValue = {
  userName: string;
  voluntarioId: string;
};

export const UserContext =
  createContext<UserContextValue | undefined>(undefined);

export function useUser() {

  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      'useUser deve ser usado dentro do UserContext.Provider'
    );
  }

  return context;
}

export default function TabsLayout() {

  const params = useLocalSearchParams<{
    userName?: string;
    voluntarioId?: string;
  }>();


  const [userName, setUserName] = useState(
    params.userName ?? 'Voluntário'
  );

  const [voluntarioId, setVoluntarioId] = useState(
    params.voluntarioId ?? '0'
  );


  useEffect(() => {

    if (params.userName) {
      setUserName(String(params.userName));
    }

    if (params.voluntarioId) {
      setVoluntarioId(String(params.voluntarioId));
    }

  }, [params]);


  const userContextValue = useMemo(() => {

    return {
      userName,
      voluntarioId,
    };

  }, [userName, voluntarioId]);


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
            height: 70,
            paddingTop: 8,
            paddingBottom: 8,
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },


          tabBarIcon: ({ color, size }) => {

            let iconName: keyof typeof MaterialIcons.glyphMap =
              'dashboard';

            if (route.name === 'dashboard') {
              iconName = 'dashboard';
            }

            else if (route.name === 'explorar') {
              iconName = 'travel-explore';
            }

            else if (route.name === 'galeria') {
              iconName = 'photo-library';
            }
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

        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
          }}
        />

        <Tabs.Screen
          name="explorar"
          options={{
            title: 'ONGs',
          }}
        />

        <Tabs.Screen
          name="galeria"
          options={{
            title: 'Galeria',
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