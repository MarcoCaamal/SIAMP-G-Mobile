import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WifiManager from 'react-native-wifi-reborn';
import { TabParamList } from '../../../navigation/TabNavigator';
import { API_CONFIG } from '../../shared/config/api.config';
import { DevicePairDto, deviceService } from '../services/deviceService';

// Tipo para la ruta y los parámetros
type DeviceConfigRouteParams = {
    ssid: string;
    capabilities: string;
};

type DeviceConfigScreenRouteProp = RouteProp<
    { DeviceConfigScreen: DeviceConfigRouteParams },
    'DeviceConfigScreen'
>;

export default function DeviceConfigScreen() {
    const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
    const route = useRoute<DeviceConfigScreenRouteProp>();
    // Estado para los datos del formulario
    const [wifiPassword, setWifiPassword] = useState('');
    const [wifiSSID, setWifiSSID] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [habitatType, setHabitatType] = useState('sala');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('config'); // 'config', 'reconnecting', 'pairing'
    const [deviceInfo, setDeviceInfo] = useState<any>(null);
    const [previousWifi, setPreviousWifi] = useState<string | null>(null);

    // Parámetros recibidos
    const selectedWifiSSID = route.params?.ssid || 'SIAMP-G-Config';
    useEffect(() => {
        // Al montar el componente, guardar la información del WiFi actual
        const getCurrentWiFi = async () => {
            try {
                if (Platform.OS === 'android') {
                    const currentSSID = await WifiManager.getCurrentWifiSSID();
                    console.log('SSID actual antes de conectar a SIAMP-G:', currentSSID);

                    // Solo establecer el previousWifi si no es una red SIAMP-G
                    if (currentSSID && !currentSSID.startsWith('SIAMP-G')) {
                        setPreviousWifi(currentSSID);
                        setWifiSSID(currentSSID); // Usamos el SSID actual como valor por defecto
                    }
                }
            } catch (error) {
                console.error('Error al obtener WiFi actual:', error);
            }

            // Intentar obtener información del dispositivo
            // fetchDeviceInfo();
        };

        getCurrentWiFi();
    }, []);

    const fetchDeviceInfo = async () => {
        try {
            // Aquí intentamos obtener información del dispositivo para asegurarnos que estamos conectados
            // La IP del dispositivo en modo AP casi siempre es 192.168.4.1
            const info = await deviceService.getDeviceInfo('192.168.4.1');
            console.log('Información del dispositivo:', info);
            if (info) {
                console.log('Información del dispositivo:', info);
                setDeviceInfo(info);
            } else {
                Alert.alert(
                    'Error de conexión',
                    'No se pudo conectar con el dispositivo. Asegúrate de estar conectado a la red WiFi del dispositivo.'
                );
            }
        } catch (error) {
            console.error('Error al obtener información del dispositivo:', error);
        }
    };
    const handleConfigureDevice = async () => {
        await fetchDeviceInfo(); // Asegurarnos de que tenemos la info del dispositivo
        if (!deviceInfo || !deviceInfo.device_id) {
            Alert.alert('Error', 'No se pudo obtener la información del dispositivo');
            return;
        }

        if (!wifiSSID) {
            Alert.alert('Error', 'Por favor, introduce el nombre de tu red WiFi');
            return;
        }

        try {
            setLoading(true);
            setStep('config');

            console.log('Enviando configuración al dispositivo:', {
                ssid: wifiSSID,
                password: wifiPassword,
                server_url: API_CONFIG.BASE_URL
            });

            // Enviamos configuración WiFi al dispositivo
            const configResult = await deviceService.configureDeviceWifi('192.168.4.1', {
                ssid: wifiSSID, // La red WiFi a la que se conectará el dispositivo (ingresada por el usuario)
                password: wifiPassword,
                server_url: API_CONFIG.BASE_URL // URL del servidor MQTT o backend
            });

            if (configResult.success) {
                Alert.alert(
                    'Configuración enviada',
                    'El dispositivo está intentando conectarse a tu red WiFi. Por favor, reconéctate a tu red WiFi anterior.',
                    [
                        { text: 'OK', onPress: handleReconnectToWifi }
                    ]
                );
            } else {
                Alert.alert('Error', configResult.message);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error al configurar dispositivo:', error);
            Alert.alert('Error', 'Hubo un problema al comunicarse con el dispositivo');
            setLoading(false);
        }
    }; const handleReconnectToWifi = async () => {
        setStep('reconnecting');

        // Para iOS o Android, mostramos instrucciones manuales ya que la reconexión automática puede fallar
        Alert.alert(
            'Reconexión necesaria',
            'Por favor, ve a la configuración de WiFi y conéctate nuevamente a tu red WiFi personal.',
            [
                { text: 'Iré manualmente', onPress: () => handleManualReconnection() },
                { text: 'Ya me reconecté', onPress: () => handlePairDevice() }
            ]
        );

        // No intentamos reconexión automática ya que ha estado causando errores
    };

    const handleManualReconnection = () => {
        Alert.alert(
            'Reconexión manual requerida',
            'Ve a la configuración de WiFi de tu dispositivo y conéctate a tu red personal.',
            [
                { text: 'OK', onPress: () => setStep('pairing') }
            ]
        );
    };
    const handlePairDevice = async () => {
        try {
            setStep('pairing');
            setLoading(true);      // Enviar los datos para emparejar el dispositivo
            const pairData: DevicePairDto = {
                deviceId: deviceInfo.device_id,
                name: deviceName || 'Mi dispositivo SIAMP-G',
                type: 'light',
                model: 'SIAMP-G',
                firmwareVersion: deviceInfo.firmware_version || '1.0.0',
                habitatType: habitatType,
                ssid: wifiSSID || '', // Utilizamos el SSID ingresado por el usuario
                ipAddress: '192.168.1.100' // esto es aproximado, podría variar
            };

            const result = await deviceService.pairDevice(pairData);
            console.log('Resultado del emparejamiento:', result._isSuccess);

            if (result._isSuccess) {
                Alert.alert(
                    'Dispositivo vinculado',
                    'Tu dispositivo ha sido vinculado exitosamente.',
                    [
                        { text: 'OK', onPress: () => navigation.navigate('Devices') }
                    ]
                );
            } else {
                Alert.alert('Error', result._error.message || 'Error al vincular dispositivo');
            }
        } catch (error) {
            console.error('Error al emparejar dispositivo:', error);
            Alert.alert('Error', 'Hubo un problema al emparejar el dispositivo');
        } finally {
            setLoading(false);
        }
    };

    const renderConfigStep = () => (
        <View style={styles.formContainer}>
            <Text style={styles.title}>Configurar dispositivo</Text>
            <Text style={styles.subtitle}>Conectando a: {selectedWifiSSID}</Text>

            {deviceInfo ? (
                <View style={styles.deviceInfoContainer}>
                    <Text style={styles.deviceInfoText}>ID: {deviceInfo.device_id}</Text>
                    <Text style={styles.deviceInfoText}>Modelo: {deviceInfo.device}</Text>
                    <Text style={styles.deviceInfoText}>Firmware: {deviceInfo.firmware_version}</Text>
                </View>
            ) : null}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Red WiFi (SSID)</Text>
                <TextInput
                    style={styles.textInput}
                    value={wifiSSID}
                    onChangeText={setWifiSSID}
                    placeholder="Nombre de tu red WiFi"
                    editable={!loading}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Contraseña de tu WiFi</Text>
                <TextInput
                    style={styles.textInput}
                    value={wifiPassword}
                    onChangeText={setWifiPassword}
                    placeholder="Contraseña de tu red WiFi"
                    secureTextEntry
                    editable={!loading}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nombre del dispositivo</Text>
                <TextInput
                    style={styles.textInput}
                    value={deviceName}
                    onChangeText={setDeviceName}
                    placeholder="Ej: Lámpara del salón"
                    editable={!loading}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Ubicación</Text>
                <TextInput
                    style={styles.textInput}
                    value={habitatType}
                    onChangeText={setHabitatType}
                    placeholder="Ej: sala, cocina, dormitorio"
                    editable={!loading}
                />
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleConfigureDevice}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Configurar dispositivo</Text>
                )}
            </TouchableOpacity>
        </View>
    );

    const renderReconnectingStep = () => (
        <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.title}>Reconectando...</Text>
            <Text style={styles.subtitle}>Conectándote de nuevo a tu red WiFi.</Text>
        </View>
    );

    const renderPairingStep = () => (
        <View style={styles.centerContent}>
            <Text style={styles.title}>Vincular dispositivo</Text>
            <Text style={styles.subtitle}>Completa la vinculación de tu dispositivo con tu cuenta.</Text>

            <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={handlePairDevice}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Vincular dispositivo</Text>
                )}
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {step === 'config' && renderConfigStep()}
                {step === 'reconnecting' && renderReconnectingStep()}
                {step === 'pairing' && renderPairingStep()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
    },
    formContainer: {
        flex: 1,
        marginVertical: 20,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    deviceInfoContainer: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    deviceInfoText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonSecondary: {
        backgroundColor: '#5e17eb',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
