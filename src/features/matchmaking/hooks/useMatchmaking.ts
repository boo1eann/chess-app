import { useSocket } from "@/shared/socket/useSocket";
import { useMatchmakingStore } from "../store/matchmaking.store";
import { useCallback } from "react";

export function useMatchmaking() {
  const { socket } = useSocket();
  const status = useMatchmakingStore((s) => s.status);
  const error = useMatchmakingStore((s) => s.error);

  const joinQueue = useCallback(() => {
    if (!socket) return;
    const store = useMatchmakingStore.getState();
    store.setQueueing();

    socket.emit("matchmaking:join", (ack) => {
      if (!ack.ok) {
        store.setError(ack.error.message);
        store.setIdle();
      }
    });
  }, [socket]);

  const cancelQueue = useCallback(() => {
    if (!socket) {
      useMatchmakingStore.getState().setIdle();
      return;
    }
    socket.emit("matchmaking:cancel", () => {
      useMatchmakingStore.getState().setIdle();
    });
  }, [socket]);

  const clearError = useCallback(() => {
    useMatchmakingStore.getState().setError(null);
  }, []);

  return { status, error, joinQueue, cancelQueue, clearError };
}
