import { SocketContext } from "@/app/providers/SocketProvider";
import { useContext } from "react";

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return ctx;
}
