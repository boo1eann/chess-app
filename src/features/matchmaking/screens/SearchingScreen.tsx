import { AppStackParamList } from "@/app/navigation/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Pressable,
} from "react-native";

export function SearchingScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={styles.title}>Looking for opponent...</Text>
      <Text style={styles.hint}>This usually takes a few seconds</Text>

      <Pressable onPress={handleCancel} style={styles.button}>
        <Text style={styles.buttonText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginTop: 24,
    color: "#374151",
    fontWeight: "600",
  },
  hint: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
  },
  button: {
    marginTop: 40,
    backgroundColor: "#6b7280",
    padding: 14,
    borderRadius: 8,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
