import { Color } from "@/shared/socket/socket-events";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  Searching: undefined;
  Game: {
    gameId: string;
    color: Color;
    opponentId: string;
    opponentUsername: string;
  };
};
