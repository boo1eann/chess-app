import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackParamList } from "./types";
import { HomeScreen } from "@/features/home/screens/HomeScreen";
import { SearchingScreen } from "@/features/matchmaking/screens/SearchingScreen";
import { GameScreen } from "@/features/game/screens/GameScreen";
import { useGlobalMatchmakingListener } from "@/features/matchmaking/hooks/useGlobalMatchmakingListener";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  useGlobalMatchmakingListener();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Searching"
        component={SearchingScreen}
        options={{ animation: "fade" }}
      />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{
          animation: "fade",
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
