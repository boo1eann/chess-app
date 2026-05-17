import { useAuthStore } from "@/features/auth/store/auth.store";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { AuthStack } from "./AuthStack";

export function RootNavigator() {
  const status = useAuthStore((s) => s.status);

  if (status === "bootstraping") {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (status === "authenticated") {
    return (
      <View>
        <Text>AppStack</Text>
      </View>
    );
  }

  return <AuthStack />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
