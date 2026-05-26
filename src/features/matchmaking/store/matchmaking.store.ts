import { create } from "zustand";

export type MatchmakingStatus = "idle" | "queueing";

interface MatchmakingState {
  status: MatchmakingStatus;
  error: string | null;

  setQueueing: () => void;
  setIdle: () => void;
  setError: (msg: string | null) => void;
}

export const useMatchmakingStore = create<MatchmakingState>((set) => ({
  status: "idle",
  error: null,

  setQueueing: () => set({ status: "queueing", error: null }),
  setIdle: () => set({ status: "idle" }),
  setError: (msg) => set({ error: msg }),
}));
