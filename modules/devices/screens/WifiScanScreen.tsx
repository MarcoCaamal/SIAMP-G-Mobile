import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WifiManager from "react-native-wifi-reborn";
import { TabParamList } from "../../../navigation/TabNavigator";

interface WiFiNetwork {
  SSID: string;
  BSSID: string;
  capabilities: string;
  frequency: number;
  level: number;
  timestamp: number;
}

// IMPORTANTE: Ahora que tienes un proyecto bare (nativo), puedes usar WiFi real!
// Este código funciona con react-native-wifi-reborn en dispositivos reales
export default function WifiScanScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [networks, setNetworks] = useState<WiFiNetwork[]>([]);
  const [scanning, setScanning] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<WiFiNetwork | null>(
    null
  );
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permisos de Ubicación",
            message:
              "La aplicación necesita permisos de ubicación para escanear redes WiFi",
            buttonNeutral: "Preguntar después",
            buttonNegative: "Cancelar",
            buttonPositive: "OK",
          }
        );
        console.log(
          "Location permission status:",
          granted === PermissionsAndroid.RESULTS.GRANTED ? "granted" : "denied"
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };
  const scanNetworks = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        "Permisos Requeridos",
        "Se necesitan permisos de ubicación para escanear redes WiFi"
      );
      return;
    }

    try {
      setScanning(true);
      setNetworks([]);

      console.log("Starting WiFi scan...");

      // Verificar si WiFi está habilitado
      const isEnabled = await WifiManager.isEnabled();
      console.log("WiFi enabled:", isEnabled);

      if (!isEnabled) {
        Alert.alert(
          "WiFi Deshabilitado",
          "El WiFi está deshabilitado. Por favor, habilítalo para escanear redes.",
          [{ text: "OK", style: "cancel" }]
        );
        return;
      }
      // Escanear redes usando la API real
      const wifiList = await WifiManager.loadWifiList();
      console.log("Networks found:", wifiList.length);
      console.log("Raw network data:", wifiList);

      if (wifiList.length === 0) {
        Alert.alert("Información", "No se encontraron redes WiFi");
      } else {
        // Filtrar redes duplicadas por SSID, mostrar solo redes SIAMP-G y ordenar por señal
        const uniqueNetworks = wifiList
          .filter(
            (network: any, index: number, self: any[]) =>
              network.SSID &&
              network.SSID.trim() !== "" &&
              network.SSID.startsWith("SIAMP-G") && // Solo redes SIAMP-G
              index === self.findIndex((n: any) => n.SSID === network.SSID)
          )
          .sort((a: any, b: any) => b.level - a.level);

        console.log("Filtered SIAMP-G networks:", uniqueNetworks.length);
        setNetworks(uniqueNetworks);

        if (uniqueNetworks.length === 0) {
          Alert.alert(
            "Información",
            "No se encontraron redes SIAMP-G disponibles"
          );
        }
      }
    } catch (error) {
      console.error("Error scanning networks:", error);
      Alert.alert(
        "Error",
        `No se pudieron escanear las redes WiFi: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setScanning(false);
    }
  };
  const connectToWifi = async () => {
    if (!selectedNetwork) return;

    const isSecure = isSecureNetwork(selectedNetwork.capabilities);

    if (isSecure && !password.trim()) {
      Alert.alert("Error", "Esta red requiere contraseña");
      return;
    }

    try {
      setConnecting(true);
      console.log(`Attempting to connect to ${selectedNetwork.SSID}...`);

      if (isSecure) {
        // Conectar a red protegida con contraseña
        await WifiManager.connectToProtectedSSID(
          selectedNetwork.SSID,
          password,
          false, // isWEP - la mayoría son WPA/WPA2
          false // isHidden
        );
      } else {
        // Conectar a red abierta
        await WifiManager.connectToSSID(selectedNetwork.SSID);
      }

      console.log("Connection initiated successfully");

      // Dar un poco de tiempo para la conexión y verificar
      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        const currentSSID = await WifiManager.getCurrentWifiSSID();
        console.log("Current connected SSID:", currentSSID);
        if (currentSSID === selectedNetwork.SSID) {
          // Si es una red SIAMP-G, ir a la pantalla de configuración
          if (selectedNetwork.SSID.startsWith("SIAMP-G")) {
            Alert.alert(
              "Éxito",
              `Conectado exitosamente a ${selectedNetwork.SSID}`,
              [
                {
                  text: "Configurar Dispositivo",
                  onPress: () => {
                    setModalVisible(false);
                    setPassword("");

                    // Navegar a la pantalla de configuración del dispositivo
                    navigation.navigate("DeviceConfig", {
                      ssid: selectedNetwork.SSID,
                      capabilities: selectedNetwork.capabilities,
                    });

                    setSelectedNetwork(null);
                  },
                },
              ]
            );
          } else {
            Alert.alert(
              "Éxito",
              `Conectado exitosamente a ${selectedNetwork.SSID}`,
              [
                {
                  text: "OK",
                  onPress: () => {
                    setModalVisible(false);
                    setPassword("");
                    setSelectedNetwork(null);
                  },
                },
              ]
            );
          }
        } else {
          Alert.alert(
            "Estado de Conexión",
            `Se inició el proceso de conexión a ${selectedNetwork.SSID}. Verifica la configuración de WiFi del dispositivo para confirmar la conexión.`,
            [
              {
                text: "Abrir Configuración WiFi",
                onPress: () => {
                  Linking.openSettings();
                  setModalVisible(false);
                  setPassword("");
                  setSelectedNetwork(null);
                },
              },
              {
                text: "OK",
                onPress: () => {
                  setModalVisible(false);
                  setPassword("");
                  setSelectedNetwork(null);
                },
              },
            ]
          );
        }
      } catch (verifyError) {
        console.log("Could not verify connection:", verifyError);
        Alert.alert(
          "Conexión Iniciada",
          `Se inició el proceso de conexión a ${selectedNetwork.SSID}. Verifica la configuración de WiFi del dispositivo.`,
          [
            {
              text: "Abrir Configuración WiFi",
              onPress: () => {
                Linking.openSettings();
                setModalVisible(false);
                setPassword("");
                setSelectedNetwork(null);
              },
            },
            {
              text: "OK",
              onPress: () => {
                setModalVisible(false);
                setPassword("");
                setSelectedNetwork(null);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error connecting to WiFi:", error);
      Alert.alert(
        "Error",
        `Error al conectar a la red WiFi: ${
          error instanceof Error ? error.message : String(error)
        }`,
        [
          {
            text: "Reintentar",
            style: "default",
          },
          {
            text: "Abrir Configuración WiFi",
            onPress: () => {
              Linking.openSettings();
              setModalVisible(false);
              setPassword("");
              setSelectedNetwork(null);
            },
          },
        ]
      );
    } finally {
      setConnecting(false);
    }
  };

  const getSignalStrength = (level: number) => {
    // level es negativo, más cerca de 0 es mejor señal
    if (level > -50)
      return { icon: "📶", strength: "Excelente", color: "#4CAF50" };
    if (level > -60) return { icon: "📶", strength: "Buena", color: "#8BC34A" };
    if (level > -70)
      return { icon: "📶", strength: "Regular", color: "#FF9800" };
    return { icon: "📶", strength: "Débil", color: "#F44336" };
  };

  const isSecureNetwork = (capabilities: string) => {
    return (
      capabilities.includes("WPA") ||
      capabilities.includes("WEP") ||
      capabilities.includes("PSK")
    );
  };
  const renderNetworkItem = ({ item }: { item: WiFiNetwork }) => {
    const signal = getSignalStrength(item.level);
    const isSecure = isSecureNetwork(item.capabilities);
    return (
      <TouchableOpacity
        style={styles.networkItem}
        onPress={() => {
          // Siempre conectarse primero a la red SIAMP-G antes de ir a la configuración
          setSelectedNetwork(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.networkInfo}>
          <View style={styles.networkHeader}>
            <Text style={styles.ssid}>{item.SSID}</Text>
            <View style={styles.securityBadge}>
              <Text style={styles.securityText}>{isSecure ? "🔒" : "🔓"}</Text>
            </View>
          </View>
          <View style={styles.networkDetails}>
            <Text style={[styles.signalText, { color: signal.color }]}>
              {signal.icon} {signal.strength} ({item.level} dBm)
            </Text>
            <Text style={styles.frequencyText}>{item.frequency} MHz</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Escáner WiFi</Text>
        <Text style={styles.subtitle}>Conecta a tu dispositivo SIAMP-G</Text>
      </View>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={scanNetworks}
        disabled={scanning}
      >
        {scanning ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.scanButtonText}>
            🔍 Buscar Dispositivos SIAMP-G
          </Text>
        )}
      </TouchableOpacity>
      <View style={styles.networksContainer}>
        <Text style={styles.sectionTitle}>
          Dispositivos SIAMP-G ({networks.length})
        </Text>

        <FlatList
          data={networks}
          keyExtractor={(item) => item.BSSID}
          renderItem={renderNetworkItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {scanning
                  ? "Buscando dispositivos SIAMP-G..."
                  : "No se encontraron dispositivos SIAMP-G"}
              </Text>
              <Text style={styles.emptySubtext}>
                Asegúrate que tu dispositivo esté en modo de configuración y
                presiona el botón para buscar
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Connection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Conectar a WiFi</Text>

            {selectedNetwork && (
              <>
                <View style={styles.selectedNetwork}>
                  <Text style={styles.selectedNetworkName}>
                    📶 {selectedNetwork.SSID}
                  </Text>
                  <Text style={styles.selectedNetworkInfo}>
                    {isSecureNetwork(selectedNetwork.capabilities)
                      ? "🔒 Protegida"
                      : "🔓 Abierta"}
                      {selectedNetwork.frequency} MHz
                  </Text>
                </View>

                {isSecureNetwork(selectedNetwork.capabilities) && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Contraseña WiFi</Text>
                    <TextInput
                      style={styles.textInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Ingresa la contraseña"
                      secureTextEntry
                      autoCapitalize="none"
                    />
                  </View>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setModalVisible(false);
                      setPassword("");
                      setSelectedNetwork(null);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.connectButton]}
                    onPress={connectToWifi}
                    disabled={connecting}
                  >
                    {connecting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.connectButtonText}>Conectar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  scanButton: {
    backgroundColor: "#007AFF",
    marginHorizontal: 16,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  networksContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  networkItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  networkInfo: {
    flex: 1,
  },
  networkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ssid: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  securityBadge: {
    marginLeft: 8,
  },
  securityText: {
    fontSize: 16,
  },
  networkDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  signalText: {
    fontSize: 14,
    fontWeight: "500",
  },
  frequencyText: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  selectedNetwork: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  selectedNetworkName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  selectedNetworkInfo: {
    fontSize: 14,
    color: "#666",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  connectButton: {
    backgroundColor: "#007AFF",
    marginLeft: 8,
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
