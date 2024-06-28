import { useAuth, useUser } from "@clerk/clerk-expo";
import { Alert, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Button } from "@/components/Button";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from "react";
interface Components {
    photo: string | undefined;
    name: string;
}

interface Product {
    id: string;
    userName: string;
    name: string;
    creationDate: string;
    components: Components[];
}

export default function My() {
    const { user } = useUser()
    const { signOut } = useAuth()
    const [products, setProducts] = useState<Product[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            loadMyProducts()
            setRefreshing(false);
        }, 2000);
    }, []);

    async function loadMyProducts() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const productKeys = keys.filter(key => key.startsWith('@product_'));
            const productValues = await AsyncStorage.multiGet(productKeys);
            const loadedProducts = productValues.map(([key, value]) => value ? JSON.parse(value) : null);
            const myProducts = loadedProducts.filter(product => product && product.userId === user?.id);

            setProducts(myProducts.filter(product => product !== null) as Product[]);
        } catch (e) {
            console.error('Erro ao carregar os produtos do localStorage', e);
        }
    }

    async function deleteProduct(id: string) {
        try {
            await AsyncStorage.removeItem(`@product_${id}`);
            const updatedProducts = products.filter(product => product.id !== id);
            setProducts(updatedProducts);
            // console.log('Produto excluído do localStorage!', id);
        } catch (e) {
            console.error('Erro ao excluir o produto do localStorage', e);
        }
    }

    function confirmDeleteProduct(id: string) {
        Alert.alert(
            "Excluir Produto",
            "Você tem certeza que deseja excluir este produto?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    onPress: () => deleteProduct(id),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    useEffect(() => {
        loadMyProducts();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Image source={{ uri: user?.imageUrl }} style={styles.image} />
                    <Text style={styles.title}>Ola, {user?.fullName}!</Text>
                </View>
                <TouchableOpacity onPress={() => signOut()} style={{ paddingVertical: 14, paddingHorizontal: 32, backgroundColor: "orange", borderRadius: 32 }}>
                    <Text style={{ color: "#FFF", fontWeight: "700" }}>Sair</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>Meus equipamentos cadastrados</Text>
            <FlatList
                data={products}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.product}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View>
                                <Text style={styles.title}>{item.userName}</Text>
                                <Text style={styles.subtitle}>Equipamento: {item.name}</Text>
                                <Text>{item.creationDate}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => confirmDeleteProduct(item.id)}
                                style={{ padding: 14, backgroundColor: "red", borderRadius: 32 }}
                            >
                                <Text style={{ color: "#FFF", fontWeight: "700" }}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
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
        fontSize: 18,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    image: {
        width: 46,
        height: 46,
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