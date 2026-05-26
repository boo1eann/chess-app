import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackParamList } from "./types";
import { HomeScreen } from "@/features/home/screens/HomeScreen";
import { SearchingScreen } from "@/features/matchmaking/screens/SearchingScreen";
import { GameScreen } from "@/features/game/screens/GameScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Searching" component={SearchingScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
    </Stack.Navigator>
  );
}
