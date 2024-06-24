import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Button } from "@/components/Button";
import { router } from "expo-router";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Input } from "@/components/Input";

interface Components {
    photo: string | undefined
    name: string;
}

interface Product {
    id: string;
    name: string;
    components: Components[];
}

export default function Home() {
    const { user } = useUser()

    const [productName, setProductName] = useState('')
    const [components, setComponents] = useState<Components[]>([])

    async function handleImagePick(index: number) {
        const permissionResult =
            await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your photos!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({ quality: 1 });

        if (!result.canceled) {

            const newComponents = [...components]
            newComponents[index].photo = result.assets[0].uri
            setComponents(newComponents)
        }
    };

    function addComponent() {
        setComponents([...components, { name: '', photo: undefined }])
    }

    function handleComponentChange(index: number, name: string) {
        const newComponents = [...components]

        newComponents[index].name = name
        setComponents(newComponents)
    }

    function createProduct() {
        const product: Product = {
            id: Date.now().toString(),
            name: productName,
            components: components
        }

        console.log('Produto criado!', product)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Image source={{ uri: user?.imageUrl }} style={styles.image} />
                    <Text style={styles.title}>Ola {"\n"} {user?.fullName}!</Text>
                </View>
                <TouchableOpacity onPress={() => router.navigate("/(auth)")}>
                    <Ionicons name="backspace" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 60 }} style={styles.content}>
                <Input
                    placeholder="Nome do equipamento"
                    value={productName}
                    onChangeText={setProductName}
                />

                <View style={{ gap: 8, marginBottom: 8 }}>
                    {components.map((component, index) => (
                        <View key={index}>
                            <Input
                                placeholder="Lado da foto"
                                value={component.name}
                                onChangeText={(text) => handleComponentChange(index, text)}
                            />

                            <Button
                                title="Tira foto"
                                onPress={() => handleImagePick(index)}
                            />

                            {component.photo && (
                                <Image
                                    source={{ uri: component.photo }}
                                    style={{ width: 300, height: 300 }}
                                />
                            )}
                        </View>
                    ))}
                </View>

                <Button title="Add Componente" onPress={addComponent} />
                <Button title="Criar Ferramenta" onPress={createProduct} />

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
        gap: 8
    }
})