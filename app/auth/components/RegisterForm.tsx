import { Picker } from "@react-native-picker/picker";
import { useNavigation } from '@react-navigation/native';
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RegisterForm() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [timezone, setTimezone] = useState("UTC-03:00");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!email.trim()) newErrors.email = "El correo es obligatorio";
    if (!password) newErrors.password = "La contraseña es obligatoria";
    else if (password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    if (!confirm) newErrors.confirm = "Debes confirmar la contraseña";
    else if (password !== confirm)
      newErrors.confirm = "Las contraseñas no coinciden";
    if (!agree) newErrors.agree = "Debes aceptar los términos y condiciones";
    return newErrors;
  };

  const handleRegister = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    console.log({ name, email, password, timezone });
    navigation.navigate('Verificaton' as never);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>SIAMP-G</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Crear Cuenta</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre completo"
            value={name}
            onChangeText={setName}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@email.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Crea una contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Repite tu contraseña"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />
          {errors.confirm && <Text style={styles.error}>{errors.confirm}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Zona horaria</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={timezone}
              onValueChange={(itemValue: string) => setTimezone(itemValue)}
            >
              <Picker.Item label="UTC -03:00 Buenos Aires" value="UTC-03:00" />
              <Picker.Item label="UTC -06:00 CDMX" value="UTC-06:00" />
              <Picker.Item label="UTC -05:00 Lima" value="UTC-05:00" />
            </Picker>
          </View>
        </View>

        <View style={styles.checkboxRow}>
          <Switch value={agree} onValueChange={setAgree} />
          <Text style={styles.termsText}>
            Acepto los <Text style={styles.link}>Términos y condiciones</Text>
          </Text>
        </View>
        {errors.agree && <Text style={styles.error}>{errors.agree}</Text>}

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </Pressable>

        <Text style={styles.loginText}>
          ¿Ya tienes una cuenta? <Text style={styles.link}>Inicia sesión</Text>
        </Text>
      </View>

      <Text style={styles.footer}>© 2025 SIAMP-G</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f2f6fb",
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: "100%",
  },
  header: {
    backgroundColor: '#8EC5FC',
    paddingTop: 40,
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#130065',
    marginBottom: 24,
    textAlign: 'center',
  },
  field: {
    marginBottom: 16,
    width: '100%',
    maxWidth: 340,
  },
  label: {
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    width: "100%",
  },
  pickerWrapper: {
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    width: "100%",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
    maxWidth: 340,
    width: "100%",
  },
  termsText: {
    flex: 1,
    flexWrap: "wrap",
  },
  link: {
    color: "#428bca",
    textDecorationLine: "underline",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#8EC5FC",
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
    maxWidth: 340,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  loginText: {
    textAlign: "center",
    fontSize: 14,
  },
  footer: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 12,
    color: "#aaa",
  },
  error: {
    color: "#cc0000",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  },
});