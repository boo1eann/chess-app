import { useBootstrapAuth } from "@/features/auth/hooks/useBootstrapAuth";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./navigation/RootNavigator";
import { QueryProvider } from "./providers/QueryProvider";

export default function App() {
  useBootstrapAuth();

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
