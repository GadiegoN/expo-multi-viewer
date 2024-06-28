import { useUser } from "@clerk/clerk-expo";
import { Alert, Image, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Button } from "@/components/Button";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function Home() {
    const { user } = useUser();
    const [productName, setProductName] = useState('');
    const [components, setComponents] = useState<Components[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);

    async function handleImagePick(index: number) {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your photos!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({ quality: 1 });

        if (!result.canceled) {
            const newComponents = [...components];
            newComponents[index].photo = result.assets[0].uri;
            setComponents(newComponents);
        }
    }

    function addComponent() {
        setComponents([...components, { name: '', photo: undefined }]);
    }

    function handleComponentChange(index: number, name: string) {
        const newComponents = [...components];
        newComponents[index].name = name;
        setComponents(newComponents);
    }

    async function createProduct() {
        const product: Product = {
            id: Date.now().toString(),
            userId: user?.id || 'unknown',
            userName: user?.fullName || 'unknown',
            name: productName,
            components: components,
            creationDate: new Date().toISOString(),
        };

        try {
            const jsonValue = JSON.stringify(product);
            await AsyncStorage.setItem(`@product_${product.id}`, jsonValue);

            setProducts([...products, product]);
            setProductName('');
            setComponents([]);
        } catch (e) {
            console.error('Erro ao salvar o produto no localStorage', e);
        }
        Alert.alert("Parabéns", "Equipamento criado e adicionado na sua lista de equipamentos!")
    }

    async function loadProducts() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const productKeys = keys.filter(key => key.startsWith('@product_'));
            const productValues = await AsyncStorage.multiGet(productKeys);
            const products = productValues.map(([key, value]) => value ? JSON.parse(value) : null);

            setProducts(products.filter(product => product !== null) as Product[]);
        } catch (e) {
            console.error('Erro ao carregar os produtos do localStorage', e);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 60 }}
                style={styles.content}
            >
                <View style={styles.containerInput}>
                    <TextInput
                        placeholder="Nome do equipamento"
                        value={productName}
                        onChangeText={setProductName}
                    />
                </View>

                <View style={{ gap: 8, marginBottom: 8 }}>
                    {components.map((component, index) => (
                        <View key={index}>
                            <View style={styles.containerInput}>
                                <TextInput
                                    placeholder="Lado da foto"
                                    value={component.name}
                                    onChangeText={(text) => handleComponentChange(index, text)}

                                />
                            </View>

                            <Button
                                title="Tira foto"
                                variant="outline"
                                onPress={() => handleImagePick(index)}
                            />

                            {component.photo && (
                                <Image
                                    source={{ uri: component.photo }}
                                    style={{ width: "100%", height: 300, borderRadius: 16, marginTop: 16 }}
                                />
                            )}
                        </View>
                    ))}
                </View>

                <View style={{ gap: 8 }}>
                    <Button title="Adicionar foto" onPress={addComponent} />
                    <Button title="Adicionar equipamento" onPress={createProduct} />
                </View>
            </ScrollView>
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
    image: {
        width: 92,
        height: 92,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#000"
    },
    content: {
        gap: 16
    },
    containerInput: {
        width: "100%",
        flexDirection: "row",
        gap: 7,
        padding: 22,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24
    },
})