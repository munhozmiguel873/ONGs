import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Login: undefined;
    Dashboard: {
        userName: string;
        voluntarioId: number;
    };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;