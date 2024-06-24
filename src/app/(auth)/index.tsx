import { useAuth, useUser } from "@clerk/clerk-expo";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Button } from "@/components/Button";
import { router } from "expo-router";

export default function Home() {
    const { user } = useUser()
    const { signOut } = useAuth()

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Image source={{ uri: user?.imageUrl }} style={styles.image} />
                    <Text style={styles.title}>Ola {"\n"} {user?.fullName}!</Text>
                </View>
                <TouchableOpacity onPress={() => signOut()}>
                    <Ionicons name="exit" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Button title="Adicionar equipamento" onPress={() => router.navigate("/(auth)/add")} />
            </View>
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

    }
})