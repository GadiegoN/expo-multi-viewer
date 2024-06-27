import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { styles } from "./styles";

interface ButtonProps extends TouchableOpacityProps {
    title: string
    isLoading?: boolean
    icon?: keyof typeof Ionicons.glyphMap
    variant?: "default" | "outline"
}

export function Button({ title, isLoading = false, icon, variant = "default", ...rest }: ButtonProps) {
    return (
        <TouchableOpacity
            style={variant === "default" ? styles.container : styles.outline}
            disabled={isLoading}
            activeOpacity={.7} {...rest}
        >
            {isLoading
                ? <ActivityIndicator color="white" />
                : (
                    <>
                        <Ionicons style={styles.icon} name={icon} />
                        <Text style={variant === "default" ? { fontSize: 16, color: "#FFF" } : { fontSize: 16, color: "#000" }}>{title}</Text>
                    </>
                )}
        </TouchableOpacity>
    )
}