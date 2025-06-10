import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileInitials}>MC</Text>
          </View>
          <Text style={styles.profileName}>Marco Antonio Caamal</Text>
          <Text style={styles.profileEmail}>caamalmarco99@gmail.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          
          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Información Personal</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>
          
          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Cambiar Contraseña</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>
          
          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Configuración de Notificaciones</Text>
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
          <Pressable style={[styles.menuItem, styles.logoutItem]}>
            <Text style={[styles.menuItemText, styles.logoutText]}>Cerrar Sesión</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SIAMP-G v1.0.0</Text>
          <Text style={styles.footerText}>© 2025 Todos los derechos reservados</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8EC5FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#130065',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingLeft: 4,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
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
    color: '#333',
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#8EC5FC',
    fontWeight: 'bold',
  },
  logoutItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  logoutText: {
    color: '#dc3545',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});
