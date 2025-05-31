import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

export default function LoginForm() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = 'El correo es obligatorio';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    return newErrors;
  };

  const handleLogin = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    console.log({ email, password, remember });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>SIAMP-G</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://c0.klipartz.com/pngpicture/992/606/gratis-png-pata-de-perro-salvaje-huella-digital.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Iniciar Sesión</Text>

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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.label}>Contraseña</Text>
            <Text style={styles.forgot} onPress={() => { /* lógica de recuperación */ }}>¿Olvidaste tu contraseña?</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="**********"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}
        </View>

        <View style={styles.checkboxRow}>
          <Switch value={remember} onValueChange={setRemember} />
          <Text>Recordar usuario</Text>
        </View>

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>

        <Text style={styles.registerText}>
          ¿No tienes cuenta?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Register' as never)}>Regístrate</Text>
        </Text>
      </View>

      <Text style={styles.footer}>© 2025 SIAMP-G</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f2f6fb',
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    backgroundColor: '#8EC5FC',
    paddingTop: 40,
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logoContainer: {
    marginBottom: 40,
    backgroundColor: '#e9edf2',
    borderRadius: 100,
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
    maxWidth: 340,
    width: '100%',
  },
  button: {
    backgroundColor: '#8EC5FC',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    maxWidth: 340,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  registerText: {
    textAlign: 'center',
    fontSize: 14,
  },
  footer: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 12,
    color: '#aaa',
  },
  link: {
    color: '#428bca',
    textDecorationLine: 'underline',
    fontSize: 12,
  },
  forgot: {
    color: '#428bca',
    textDecorationLine: 'underline',
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  error: {
    color: '#cc0000',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  },
});