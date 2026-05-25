import { useAuthStore } from "@/features/auth/store/auth.store";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { AuthStack } from "./AuthStack";
import { AppStack } from "./AppStack";
import { SocketProvider } from "../providers/SocketProvider";

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
      <SocketProvider>
        <AppStack />
      </SocketProvider>
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
