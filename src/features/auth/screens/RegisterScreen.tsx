import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterFormValues,
  registerSchema,
} from "../validators/auth.validators";
import { authApi } from "@/shared/api/auth.api";
import { isApiErrorResponse } from "@/shared/types/api-error";
import { secureStorage } from "@/shared/storage/secure-storage";
import { useAuthStore } from "../store/auth.store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/app/navigation/types";

type FormValues = {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
};

export function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: useFormSetError,
  } = useForm<FormValues>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
    },
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitting(true);
    setLocalError(null);
    try {
      const { data } = await authApi.register(values);
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
                RegisterFormValues,
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
      <Text style={styles.title}>Sign up</Text>

      <Controller
        control={control}
        name="email"
        render={(props) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={props.field.value}
            onChangeText={props.field.onChange}
            onBlur={props.field.onBlur}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && (
        <Text style={styles.fieldError}>{errors.email.message}</Text>
      )}

      <Controller
        control={control}
        name="username"
        render={(props) => (
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={props.field.value}
            onChangeText={props.field.onChange}
            onBlur={props.field.onBlur}
            autoCapitalize="none"
          />
        )}
      />
      {errors.username && (
        <Text style={styles.fieldError}>{errors.username.message}</Text>
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
            secureTextEntry
            autoCapitalize="none"
          />
        )}
      />
      {errors.password && (
        <Text style={styles.fieldError}>{errors.password.message}</Text>
      )}

      <Controller
        control={control}
        name="passwordConfirm"
        render={(props) => (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={props.field.value}
            onChangeText={props.field.onChange}
            onBlur={props.field.onBlur}
            secureTextEntry
            autoCapitalize="none"
          />
        )}
      />
      {errors.passwordConfirm && (
        <Text style={styles.fieldError}>{errors.passwordConfirm.message}</Text>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Create account</Text>
        )}
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
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
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  error: {
    color: "#d33",
    fontSize: 14,
    marginVertical: 12,
    textAlign: "center",
  },
  fieldError: {
    color: "#d33",
    fontSize: 12,
    marginBottom: 8,
  },
  link: {
    color: "#2563eb",
    textAlign: "center",
    marginTop: 16,
  },
});
