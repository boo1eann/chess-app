import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validators/auth.validators";

type FormValues = {
  email: string;
  username: string;
  password: string;
};

export function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", username: "", password: "" },
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      console.log(values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err: any) {
      setError(err.message ?? "Registration failed");
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
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
    </View>
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
});
