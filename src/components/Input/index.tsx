import { TextInput, TextInputProps, View } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { styles } from "./styles";

interface InputProps extends TextInputProps {
    placeholder: string
    icon?: keyof typeof Ionicons.glyphMap
}

export function Input({ placeholder, icon }: InputProps) {
    return (
        <View style={styles.container}>
            <TextInput placeholder={placeholder} />
            {icon && (
                <Ionicons name={icon} size={24} />
            )}
        </View>
    )
}