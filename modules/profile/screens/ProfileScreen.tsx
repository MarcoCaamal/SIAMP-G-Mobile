import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "../../auth/context/AuthContext";
import { useUserProfile } from "../../users/hooks/useUserProfile";

export default function ProfileScreen() {
  const { authState, logout } = useAuthContext();
  const {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateNotifications,
    changePassword,
  } = useUserProfile();

  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  // Estados para edición de perfil
  const [editName, setEditName] = useState("");
  const [editTimezone, setEditTimezone] = useState("");
  // Estados para notificaciones
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [silentHoursEnabled, setSilentHoursEnabled] = useState(false);
  const [silentHoursStart, setSilentHoursStart] = useState("22:00");
  const [silentHoursEnd, setSilentHoursEnd] = useState("08:00");
  const [deviceConnection, setDeviceConnection] = useState(true);
  const [deviceDisconnection, setDeviceDisconnection] = useState(true);
  const [scheduledEvent, setScheduledEvent] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  // Estados para cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(() => {
    if (profile) {
      setEditName(profile.name);
      setEditTimezone(profile.timezone);
      setEmailNotifications(profile.notificationPreferences.email);
      setPushNotifications(profile.notificationPreferences.push);
      setSilentHoursEnabled(
        profile.notificationPreferences.silentHours.enabled
      );
      setSilentHoursStart(profile.notificationPreferences.silentHours.start);
      setSilentHoursEnd(profile.notificationPreferences.silentHours.end);
      setDeviceConnection(
        profile.notificationPreferences.eventTypes.deviceConnection
      );
      setDeviceDisconnection(
        profile.notificationPreferences.eventTypes.deviceDisconnection
      );
      setScheduledEvent(
        profile.notificationPreferences.eventTypes.scheduledEvent
      );
      setSystemAlerts(profile.notificationPreferences.eventTypes.systemAlerts);
    }
  }, [profile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    const result = await updateProfile({
      name: editName.trim() !== profile?.name ? editName.trim() : undefined,
      timezone: editTimezone !== profile?.timezone ? editTimezone : undefined,
    });

    if (result.success) {
      Alert.alert("Éxito", result.message);
      setEditModalVisible(false);
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const handleNotificationSettings = () => {
    setNotificationsModalVisible(true);
  };
  const handleSaveNotifications = async () => {
    const result = await updateNotifications({
      email:
        emailNotifications !== profile?.notificationPreferences.email
          ? emailNotifications
          : undefined,
      push:
        pushNotifications !== profile?.notificationPreferences.push
          ? pushNotifications
          : undefined,
      silentHours:
        silentHoursEnabled !==
          profile?.notificationPreferences.silentHours.enabled ||
        silentHoursStart !==
          profile?.notificationPreferences.silentHours.start ||
        silentHoursEnd !== profile?.notificationPreferences.silentHours.end
          ? {
              enabled: silentHoursEnabled,
              start: silentHoursStart,
              end: silentHoursEnd,
            }
          : undefined,
      eventTypes:
        deviceConnection !==
          profile?.notificationPreferences.eventTypes.deviceConnection ||
        deviceDisconnection !==
          profile?.notificationPreferences.eventTypes.deviceDisconnection ||
        scheduledEvent !==
          profile?.notificationPreferences.eventTypes.scheduledEvent ||
        systemAlerts !==
          profile?.notificationPreferences.eventTypes.systemAlerts
          ? {
              deviceConnection,
              deviceDisconnection,
              scheduledEvent,
              systemAlerts,
            }
          : undefined,
    });

    if (result.success) {
      Alert.alert("Éxito", result.message);
      setNotificationsModalVisible(false);
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const handleChangePassword = () => {
    setPasswordModalVisible(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        "Error",
        "La nueva contraseña debe tener al menos 8 caracteres"
      );
      return;
    }

    const result = await changePassword({
      currentPassword,
      newPassword,
    });

    if (result.success) {
      Alert.alert("Éxito", result.message);
      setPasswordModalVisible(false);
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const displayProfile = profile || authState.user;

  if (loading && !profile && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8EC5FC" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchProfile}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && !refreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8EC5FC" />
            <Text style={styles.loadingText}>Cargando perfil...</Text>
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>
              {error.includes("Network request failed")
                ? "🌐 Error de Conexión"
                : "⚠️ Error"}
            </Text>
            <Text style={styles.errorText}>
              {error.includes("Network request failed")
                ? "No se pudo conectar al servidor. Verifica tu conexión a internet y la configuración de la API."
                : error}
            </Text>
            {error.includes("Network request failed") && (
              <Text style={styles.errorSubtext}>
                💡 Si estás en desarrollo, revisa NETWORK_SETUP.md para
                configurar la URL correcta.
              </Text>
            )}
            <Pressable style={styles.retryButton} onPress={fetchProfile}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileInitials}>
              {displayProfile?.name
                ? displayProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </Text>
          </View>
          <Text style={styles.profileName}>
            {displayProfile?.name || "Usuario"}
          </Text>
          <Text style={styles.profileEmail}>
            {displayProfile?.email || "email@ejemplo.com"}
          </Text>
          {profile && (
            <Text style={styles.profileMeta}>
              Cuenta {profile.accountType} • Zona horaria: {profile.timezone}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>

          <Pressable style={styles.menuItem} onPress={handleEditProfile}>
            <Text style={styles.menuItemText}>Información Personal</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleChangePassword}>
            <Text style={styles.menuItemText}>Cambiar Contraseña</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={handleNotificationSettings}
          >
            <Text style={styles.menuItemText}>
              Configuración de Notificaciones
            </Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dispositivos</Text>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Mis Dispositivos</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Configuración WiFi</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Historial de Actividad</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Centro de Ayuda</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Contactar Soporte</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Acerca de SIAMP-G</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Pressable
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <Text style={[styles.menuItemText, styles.logoutText]}>
              Cerrar Sesión
            </Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SIAMP-G v1.0.0</Text>
          <Text style={styles.footerText}>
            © 2025 Todos los derechos reservados
          </Text>
        </View>
      </ScrollView>

      {/* Modal para editar perfil */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setEditModalVisible(false)}>
              <Text style={styles.modalCancelButton}>Cancelar</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <Pressable onPress={handleSaveProfile} disabled={loading}>
              <Text
                style={[
                  styles.modalSaveButton,
                  loading && styles.disabledButton,
                ]}
              >
                Guardar
              </Text>
            </Pressable>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Tu nombre completo"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Zona Horaria</Text>
              <TextInput
                style={styles.input}
                value={editTimezone}
                onChangeText={setEditTimezone}
                placeholder="Ej: America/Mexico_City"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal para notificaciones */}
      <Modal
        visible={notificationsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setNotificationsModalVisible(false)}>
              <Text style={styles.modalCancelButton}>Cancelar</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Notificaciones</Text>
            <Pressable onPress={handleSaveNotifications} disabled={loading}>
              <Text
                style={[
                  styles.modalSaveButton,
                  loading && styles.disabledButton,
                ]}
              >
                Guardar
              </Text>
            </Pressable>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Notificaciones por Email</Text>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: "#ccc", true: "#8EC5FC" }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Notificaciones Push</Text>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: "#ccc", true: "#8EC5FC" }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Horario Silencioso</Text>
              <Switch
                value={silentHoursEnabled}
                onValueChange={setSilentHoursEnabled}
                trackColor={{ false: "#ccc", true: "#8EC5FC" }}
                thumbColor="#fff"
              />
            </View>

            {silentHoursEnabled && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Hora de Inicio</Text>
                  <TextInput
                    style={styles.input}
                    value={silentHoursStart}
                    onChangeText={setSilentHoursStart}
                    placeholder="Ej: 22:00"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Hora de Fin</Text>
                  <TextInput
                    style={styles.input}
                    value={silentHoursEnd}
                    onChangeText={setSilentHoursEnd}
                    placeholder="Ej: 08:00"
                  />
                </View>
              </>
            )}

            <Text
              style={[styles.inputLabel, { marginTop: 24, marginBottom: 12 }]}
            >
              Tipos de Eventos
            </Text>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Conexión de Dispositivos</Text>
              <Switch
                value={deviceConnection}
                onValueChange={setDeviceConnection}
                trackColor={{ false: "#ccc", true: "#8EC5FC" }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>
                Desconexión de Dispositivos
              </Text>
              <Switch
                value={deviceDisconnection}
                onValueChange={setDeviceDisconnection}
                trackColor={{ false: "#ccc", true: "#8EC5FC" }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Eventos Programados</Text>
              <Switch
                value={scheduledEvent}
                onValueChange={setScheduledEvent}
                trackColor={{ false: "#ccc", true: "#8EC5FC" }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Alertas del Sistema</Text>
              <Switch
                value={systemAlerts}
                onValueChange={setSystemAlerts}
                trackColor={{ false: "#ccc", true: "#8EC5FC" }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setPasswordModalVisible(false)}>
              <Text style={styles.modalCancelButton}>Cancelar</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
            <Pressable onPress={handleSavePassword} disabled={loading}>
              <Text
                style={[
                  styles.modalSaveButton,
                  loading && styles.disabledButton,
                ]}
              >
                Guardar
              </Text>
            </Pressable>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contraseña Actual</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Tu contraseña actual"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nueva Contraseña</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Mínimo 8 caracteres"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repite la nueva contraseña"
                secureTextEntry
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 24,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8EC5FC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#130065",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    paddingLeft: 4,
  },
  menuItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  menuItemArrow: {
    fontSize: 20,
    color: "#8EC5FC",
    fontWeight: "bold",
  },
  logoutItem: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dc3545",
  },
  logoutText: {
    color: "#dc3545",
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalCancelButton: {
    fontSize: 16,
    color: "#007bff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalSaveButton: {
    fontSize: 16,
    color: "#28a745",
  },
  disabledButton: {
    color: "#ccc",
  },
  modalContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    fontStyle: "italic",
  },
  retryButton: {
    backgroundColor: "#8EC5FC",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  profileMeta: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
});
