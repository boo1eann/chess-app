import { useAuthStore } from "@/features/auth/store/auth.store";
import { authApi } from "@/shared/api/auth.api";
import { secureStorage } from "@/shared/storage/secure-storage";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function HomeScreen() {
  const user = useAuthStore((s) => s.user);

  const handleLogout = async () => {
    const refresh = await secureStorage.getRefreshToken();
    if (refresh) {
      authApi.logout(refresh).catch(() => {});
    }
    await secureStorage.clearRefreshToken();
    useAuthStore.getState().clearSession();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi, {user?.username}</Text>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
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
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 8,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
