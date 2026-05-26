import { useSocket } from "@/shared/socket/useSocket";
import { useEffect } from "react";
import { useMatchmakingStore } from "../store/matchmaking.store";
import { navigationRef } from "@/app/navigation/navigation-ref";

export function useGlobalMatchmakingListener(): void {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handler: Parameters<typeof socket.on<"match:found">>[1] = (
      payload,
    ) => {
      useMatchmakingStore.getState().setIdle();

      if (!navigationRef.isReady()) return;

      navigationRef.reset({
        index: 1,
        routes: [
          { name: "Home" },
          {
            name: "Game",
            params: {
              gameId: payload.gameId,
              color: payload.color,
              opponentId: payload.opponent.userId,
              opponentUsername: payload.opponent.username,
            },
          },
        ],
      });
    };

    socket.on("match:found", handler);
    return () => {
      socket.off("match:found", handler);
    };
  }, [socket]);
}
