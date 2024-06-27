import { useAuth, useUser } from "@clerk/clerk-expo";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
    const { user } = useUser()
    const { signOut } = useAuth()

    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center", gap: 8, justifyContent: "center" }}>
                <Image source={{ uri: user?.imageUrl }} style={styles.image} />
                <Text style={styles.title}>{user?.fullName}!</Text>
            </View>
            <TouchableOpacity onPress={() => signOut()} style={styles.exitButton}>
                <Text style={styles.textButton}>Sair</Text>
                <Ionicons name="exit" size={24} color="white" />
            </TouchableOpacity>
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    image: {
        width: 92,
        height: 92,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#000"
    },
    textButton: {
        fontSize: 24,
        fontWeight: "500",
        color: "#FFF"
    },
    exitButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#000",
        borderRadius: 32,
        padding: 16,
        justifyContent: "center"
    }
})