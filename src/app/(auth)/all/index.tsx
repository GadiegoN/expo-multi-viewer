import { Button } from "@/components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, FlatList, Text, Image, StyleSheet, ScrollView } from "react-native";

interface Components {
    photo: string | undefined
    name: string;
}

interface Product {
    id: string;
    userId: string
    userName: string;
    name: string;
    creationDate: string;
    components: Components[];
}

export default function All() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        loadAllProducts();
    }, []);

    async function loadAllProducts() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const productKeys = keys.filter(key => key.startsWith('@product_'));
            const productValues = await AsyncStorage.multiGet(productKeys);
            const loadedProducts = productValues.map(([key, value]) => value ? JSON.parse(value) : null);

            setProducts(loadedProducts.filter(product => product !== null) as Product[]);
        } catch (e) {
            console.error('Erro ao carregar os produtos do localStorage', e);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent style="dark" />
            <Button title="Voltar" onPress={() => router.navigate("/")} />
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.product}>
                        <Text style={styles.title}>{item.userName}</Text>
                        <Text style={styles.subtitle}>Equipamento: {item.name}</Text>
                        <Text>{item.creationDate}</Text>
                        <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
                            {item.components.map((component, index) => (
                                <View style={styles.components} key={index}>
                                    {component.photo && <Image source={{ uri: component.photo }} style={{ width: 400, height: 300, borderRadius: 16, marginTop: 16 }} />}
                                    <Text style={{ fontSize: 18, fontWeight: "700" }}>{component.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}
                ListEmptyComponent={() => <Text>Lista vazia.</Text>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 42,
        paddingHorizontal: 10,
        gap: 32,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    image: {
        width: 92,
        height: 92,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#000"
    },
    content: {

    },
    product: {
        gap: 12,
        paddingBottom: 32,
        borderBottomWidth: 1,
        marginTop: 8
    },
    components: {
        gap: 4,
    }
})