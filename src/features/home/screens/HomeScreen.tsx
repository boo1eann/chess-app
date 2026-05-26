import { AppStackParamList } from "@/app/navigation/types";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useMatchmaking } from "@/features/matchmaking/hooks/useMatchmaking";
import { authApi } from "@/shared/api/auth.api";
import { useSocket } from "@/shared/socket/useSocket";
import { secureStorage } from "@/shared/storage/secure-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const { isConnected } = useSocket();
  const { joinQueue, status, error, clearError } = useMatchmaking();

  useEffect(() => {
    if (error) {
      Alert.alert("Matchmaking error", error, [
        { text: "OK", onPress: clearError },
      ]);
    }
  }, [error, clearError]);

  const handleFindGame = () => {
    if (!isConnected) return;
    joinQueue();
    navigation.navigate("Searching");
  };

  const handleLogout = async () => {
    const refresh = await secureStorage.getRefreshToken();
    if (refresh) {
      authApi.logout(refresh).catch(() => {});
    }
    await secureStorage.clearRefreshToken();
    useAuthStore.getState().clearSession();
  };

  const disabled = !isConnected || status !== "idle";

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi, {user?.username}</Text>

      <View style={styles.statusRow}>
        <View
          style={[styles.dot, isConnected ? styles.dotOn : styles.dotOff]}
        />
        <Text style={styles.status}>{isConnected ? "Online" : "Offline"}</Text>
      </View>

      <Pressable
        onPress={handleFindGame}
        style={[styles.findButton, disabled && styles.disabled]}
        disabled={disabled}
      >
        <Text style={styles.findButtonText}>Find Game</Text>
      </Pressable>

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
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  dotOn: {
    backgroundColor: "#16a34a",
  },
  dotOff: {
    backgroundColor: "#9ca3af",
  },
  status: {
    fontSize: 16,
    color: "#374151",
  },
  findButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
    marginBottom: 24,
  },
  findButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 20,
  },
  disabled: { opacity: 0.5 },
});
