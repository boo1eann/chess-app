import { navigationRef } from "@/app/navigation/navigation-ref";
import { AppStackParamList } from "@/app/navigation/types";
import { useSocket } from "@/shared/socket/useSocket";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";

export function GameScreen() {
  const route = useRoute<RouteProp<AppStackParamList, "Game">>();
  const { socket } = useSocket();
  const { gameId, color, opponentUsername } = route.params;
  const [resigning, setResigning] = useState(false);

  const handleResign = () => {
    Alert.alert("Resign?", "You will lose this game.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Resign",
        style: "destructive",
        onPress: () => {
          if (!socket) return;
          setResigning(true);
          socket.emit("game:resign", { gameId }, () => {
            navigationRef.reset({ index: 0, routes: [{ name: "Home" }] });
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Opponent</Text>
        <Text style={styles.value}>{opponentUsername}</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>You play</Text>
        <Text
          style={[
            styles.value,
            color === "white" ? styles.white : styles.black,
          ]}
        >
          {color}
        </Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Game ID</Text>
        <Text style={styles.mono}>{gameId}</Text>
      </View>

      <Text style={styles.placeholder}>♟ Chess board coming in Stage 3</Text>

      <Pressable
        style={[styles.resignButton, resigning && styles.disabled]}
        onPress={handleResign}
        disabled={resigning}
      >
        {resigning ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.resignText}>Resign</Text>
        )}
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
  },
  card: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  value: {
    fontSize: 20,
    color: "#111827",
    marginTop: 4,
    fontWeight: "600",
  },
  white: { color: "#374151" },
  black: { color: "#111827" },
  mono: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    fontFamily: "monospace",
  },
  placeholder: {
    fontSize: 16,
    color: "#9ca3af",
    marginBottom: 32,
  },
  resignButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  resignText: { color: "white", fontWeight: "600", fontSize: 16 },
  disabled: { opacity: 0.6 },
});
