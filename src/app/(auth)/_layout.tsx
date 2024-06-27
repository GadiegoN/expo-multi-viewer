import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar translucent style="dark" />
            <Drawer>
                <Drawer.Screen
                    name="index"
                    options={{
                        drawerLabel: 'Perfil',
                        title: 'Meu perfil',
                    }}
                />
                <Drawer.Screen
                    name="my"
                    options={{
                        drawerLabel: 'Ver meus equipamentos',
                        title: 'Adcione um novo',
                    }}
                />
                <Drawer.Screen
                    name="all"
                    options={{
                        drawerLabel: 'Ver todos equipamentos',
                        title: 'Lista com todos equipamentos',
                    }}
                />
                <Drawer.Screen
                    name="add"
                    options={{
                        drawerLabel: '+ Novo equipamento',
                        title: 'Adcione um novo',
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}