import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';

type LoginFormNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginForm() {
  const navigation = useNavigation<LoginFormNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    console.log('LoginForm mounted successfully');
  }, []);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = 'El correo es obligatorio';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    return newErrors;
  };

  const handleLogin = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // Aquí deberías llamar a tu API real de login
    // Simulación de API para ejemplo
    const result = await fakeLoginApi(email, password);
    if (result.success) {
      // Si el usuario está verificado, navega al Main (o lo que corresponda)
      // Si no está verificado, navega a VerificationScreen
      if (result.error === 'User is not verified') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'VerificationScreen' }],
        });
      } else {
        // Aquí iría la navegación al flujo principal de la app
        // navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      }
    } else {
      setErrors({ email: 'Credenciales inválidas' });
    }
  };

  // Simulación de API para ejemplo
  async function fakeLoginApi(email: string, password: string) {
    // Simula un usuario no verificado si el email contiene 'noverificado'
    if (email.includes('noverificado')) {
      return { success: false, error: 'User is not verified' };
    }
    // Simula login exitoso
    if (email && password) {
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
            <Pressable onPress={() => { /* lógica de recuperación */ }}>
              <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
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

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes cuenta? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Regístrate</Text>
          </Pressable>
        </View>
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
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
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
    fontSize: 14,
  },
  forgot: {
    color: '#428bca',
    textDecorationLine: 'underline',
    fontSize: 12,
  },
  error: {
    color: '#cc0000',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  },
});
