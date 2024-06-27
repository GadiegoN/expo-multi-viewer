import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

export function Header() {
    const { user } = useUser();

    return (
        <View style={styles.header}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Image source={{ uri: user?.imageUrl }} style={styles.image} />
                <Text style={styles.title}>Ola {"\n"} {user?.fullName}!</Text>
            </View>
            <TouchableOpacity onPress={() => router.navigate("/(auth)")}>
                <Ionicons name="list-circle" size={46} color="black" />
            </TouchableOpacity>
        </View>
    )
}