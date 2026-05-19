import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { LoginFormValues, loginSchema } from "../validators/auth.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { authApi } from "@/shared/api/auth.api";
import { secureStorage } from "@/shared/storage/secure-storage";
import { useAuthStore } from "../store/auth.store";
import { isApiErrorResponse } from "@/shared/types/api-error";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/app/navigation/types";

export function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: useFormSetError,
  } = useForm<LoginFormValues>({
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "" },
  });

  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    setLocalError(null);
    try {
      const { data } = await authApi.login(values);
      await secureStorage.setRefreshToken(data.tokens.refreshToken);
      useAuthStore.getState().setSession({
        user: data.user,
        accessToken: data.tokens.accessToken,
      });
    } catch (err: any) {
      const data = err?.response?.data;

      if (!err?.response) {
        setLocalError("Network error");
        setSubmitting(false);
        return;
      }

      if (isApiErrorResponse(data)) {
        const { error } = data;

        if (error.errors?.length) {
          for (const fieldErr of error.errors) {
            useFormSetError(
              fieldErr.field as keyof Omit<
                LoginFormValues,
                "deviceName" | "deviceType"
              >,
              {
                type: "server",
                message: fieldErr.message,
              },
            );
          }
        } else {
          setLocalError(
            error.userAction ?? error.message ?? "Registration failed",
          );
        }
      }

      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Sign in</Text>

      <Controller
        control={control}
        name="login"
        render={(props) => (
          <TextInput
            style={styles.input}
            placeholder="Email or username"
            value={props.field.value}
            onChangeText={props.field.onChange}
            onBlur={props.field.onBlur}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />
      {errors.login && (
        <Text style={styles.fieldError}>{errors.login.message}</Text>
      )}

      <Controller
        control={control}
        name="password"
        render={(props) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={props.field.value}
            onChangeText={props.field.onChange}
            onBlur={props.field.onBlur}
            autoCapitalize="none"
            secureTextEntry
          />
        )}
      />
      {errors.password && (
        <Text style={styles.fieldError}>{errors.password.message}</Text>
      )}

      {localError && <Text style={styles.error}>{localError}</Text>}

      <Pressable
        style={[styles.button, submitting && styles.buttonDisabled]}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
      >
        {submitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign in</Text>
        )}
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 4,
  },
  fieldError: {
    color: "#d33",
    fontSize: 12,
    marginBottom: 8,
  },
  error: {
    color: "#d33",
    fontSize: 14,
    marginVertical: 12,
    textAlign: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: 600,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  link: {
    color: "#2563eb",
    textAlign: "center",
    marginTop: 16,
  },
});
