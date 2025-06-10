import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { useAuthContext } from '../context/AuthContext';
import { useLogin } from '../hooks/useAuth';

type LoginFormNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginForm() {
  const navigation = useNavigation<LoginFormNavigationProp>();
  const { login: apiLogin, loading } = useLogin();
  const { login: saveAuth } = useAuthContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    console.log('LoginForm mounted successfully');
  }, []);
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email.trim()) newErrors.email = 'El correo es obligatorio';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    return newErrors;
  };  const handleLogin = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const result = await apiLogin({ email: email.trim(), password });
      
      if (result._success && result._value) {
        // Guardar datos de autenticación en el contexto
        await saveAuth(
          result._value.accessToken,
          result._value.refreshToken,
          result._value.user
        );
        
        // Login exitoso - navegar al TabNavigator (HomeScreen)
        navigation.reset({
          index: 0,
          routes: [{ name: 'TabNavigator' }],
        });
      } else {
        // Error en el login - mostrar el mensaje de error
        const errorMessage = result._error?.message || 'Error desconocido en el login';
        const errorCode = result._error?.code;
        
        // Si el error indica que el usuario no está verificado
        if (errorMessage.toLowerCase().includes('not verified') || 
            errorMessage.toLowerCase().includes('no verificado') ||
            errorCode === 'AUTH_005' || // Código específico para usuario no verificado
            errorCode === 'USER_NOT_VERIFIED') {
          navigation.navigate('VerificationScreen', { email: email.trim() });
        } else {
          setErrors({ 
            api: errorMessage
          });
        }
      }
    } catch (error) {
      // Error de red u otro error inesperado
      setErrors({ 
        api: 'Error de conexión. Verifica tu conexión a internet.' 
      });
    }
  };
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
            <Pressable onPress={() => navigation.navigate('ResetPasswordScreen' as never)}>
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

        {/* Error general de la API */}
        {errors.api && (
          <View style={styles.apiErrorContainer}>
            <Text style={styles.apiError}>{errors.api}</Text>
          </View>
        )}
        
        <Pressable 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Ingresando...' : 'Entrar'}
          </Text>
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
  },  button: {
    backgroundColor: '#8EC5FC',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    maxWidth: 340,
  },
  buttonDisabled: {
    opacity: 0.6,
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
  },  error: {
    color: '#cc0000',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  apiErrorContainer: {
    backgroundColor: '#ffebee',
    borderColor: '#cc0000',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    width: '100%',
    maxWidth: 340,
  },
  apiError: {
    color: '#cc0000',
    fontSize: 14,
    textAlign: 'center',
  },
});
