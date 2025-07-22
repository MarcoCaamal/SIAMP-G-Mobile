import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabParamList } from '../../../navigation/TabNavigator';
import { LightMode, lightModeService } from '../services/lightModeService';

// Función para obtener el color en formato hexadecimal
const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Función para obtener la etiqueta del tipo de hábitat
const getHabitatLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    terrarium: 'Terrario',
    aquarium: 'Acuario',
    garden: 'Jardín',
    greenhouse: 'Invernadero',
  };
  return labels[type] || type;
};

// Función para obtener el color de la primera secuencia
const getSequenceColor = (lightMode: LightMode) => {
  if (lightMode.sequence && lightMode.sequence.length > 0) {
    const firstStep = lightMode.sequence[0];
    const { r, g, b } = firstStep.state.color.rgb;
    return rgbToHex(r, g, b);
  }
  return '#ffffff';
};

// Función para obtener el brillo de la primera secuencia
const getSequenceBrightness = (lightMode: LightMode) => {
  if (lightMode.sequence && lightMode.sequence.length > 0) {
    return lightMode.sequence[0].state.brightness;
  }
  return 0;
};

// Función para obtener la duración total de la secuencia
const getSequenceDuration = (lightMode: LightMode) => {
  if (lightMode.sequence && lightMode.sequence.length > 0) {
    return lightMode.sequence.reduce((total, step) => total + step.duration, 0);
  }
  return 0;
};

export default function LightModesScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [lightModes, setLightModes] = useState<LightMode[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHabitat, setSelectedHabitat] = useState<string | undefined>(undefined);

  const fetchLightModes = async () => {
    try {
      setLoading(true);
      const response = await lightModeService.getLightModes(selectedHabitat);
      console.log('Light modes response:', response);

      if (response._isSuccess && response._value && response._value.lightModes) {
        setLightModes(response._value.lightModes || []);
      } else {
        setLightModes([]);
        Alert.alert('Error', response._error || 'No se pudieron cargar los modos de iluminación');
      }
    } catch (error) {
      console.error('Error al cargar modos de iluminación:', error);
      setLightModes([]);
      Alert.alert('Error', 'Ocurrió un error al cargar los modos de iluminación');
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLightModes();
  }, [selectedHabitat]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLightModes();
  };

  const handleCreateMode = () => {
    navigation.navigate('CreateLightMode');
  };

  const handleEditMode = (lightMode: LightMode) => {
    navigation.navigate('EditLightMode', { lightModeId: lightMode.id });
  };

  const handleDeleteMode = (lightMode: LightMode) => {
    if (lightMode.isSystemMode) {
      Alert.alert('Error', 'No se puede eliminar un modo del sistema');
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      `¿Está seguro que desea eliminar el modo "${lightMode.name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await lightModeService.deleteLightMode(lightMode.id);

              if (response._isSuccess) {
                Alert.alert('Éxito', 'El modo de iluminación ha sido eliminado');
                fetchLightModes();
              } else {
                Alert.alert('Error', response._error || 'No se pudo eliminar el modo');
                setLoading(false);
              }
            } catch (error) {
              console.error('Error al eliminar modo:', error);
              Alert.alert('Error', 'Ocurrió un error al eliminar el modo');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleShareMode = async (lightMode: LightMode) => {
    if (lightMode.isSystemMode) {
      Alert.alert('Error', 'No se puede compartir un modo del sistema');
      return;
    }

    try {
      const response = await lightModeService.shareLightMode(lightMode.id);

      if (response._isSuccess && response._value) {
        Alert.alert(
          'Modo Compartido',
          `Código para compartir: ${response._value.shareCode}\n\nEste código expira el ${new Date(response._value.expiresAt).toLocaleDateString()}`
        );
      } else {
        Alert.alert('Error', response._error || 'No se pudo compartir el modo');
      }
    } catch (error) {
      console.error('Error al compartir modo:', error);
      Alert.alert('Error', 'Ocurrió un error al compartir el modo');
    }
  };

  const handleImportMode = () => {
    Alert.prompt(
      'Importar Modo',
      'Ingrese el código del modo compartido:',
      async (shareCode) => {
        if (shareCode) {
          try {
            const response = await lightModeService.importSharedLightMode(shareCode);

            if (response._isSuccess) {
              Alert.alert('Éxito', 'El modo de iluminación ha sido importado');
              fetchLightModes();
            } else {
              Alert.alert('Error', response._error || 'No se pudo importar el modo');
            }
          } catch (error) {
            console.error('Error al importar modo:', error);
            Alert.alert('Error', 'Ocurrió un error al importar el modo');
          }
        }
      }
    );
  };

  const habitatFilters = [
    { key: undefined, label: 'Todos' },
    { key: 'terrarium', label: 'Terrario' },
    { key: 'aquarium', label: 'Acuario' },
    { key: 'garden', label: 'Jardín' },
    { key: 'greenhouse', label: 'Invernadero' },
  ];

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8EC5FC" />
          <Text style={styles.loadingText}>Cargando modos de iluminación...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Modos de Iluminación</Text>
          <Text style={styles.headerSubtitle}>Gestiona tus configuraciones de luz</Text>
        </View>

        {/* Filtros por tipo de hábitat */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {habitatFilters.map((filter) => (
              <TouchableOpacity
                key={filter.key || 'all'}
                style={[
                  styles.filterButton,
                  selectedHabitat === filter.key && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedHabitat(filter.key)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedHabitat === filter.key && styles.filterButtonTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleCreateMode}>
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Crear Modo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleImportMode}>
            <MaterialIcons name="download" size={20} color="#8EC5FC" />
            <Text style={styles.secondaryButtonText}>Importar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de modos de iluminación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Mis Modos ({lightModes?.length || 0})
          </Text>

          {(!lightModes || lightModes.length === 0) ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="lightbulb-outline" size={64} color="#ccc" />
              <Text style={styles.emptyStateTitle}>No hay modos de iluminación</Text>
              <Text style={styles.emptyStateText}>
                Crea tu primer modo de iluminación para comenzar
              </Text>
            </View>
          ) : (
            lightModes && lightModes.map((lightMode) => (
              <View key={lightMode.id} style={styles.modeCard}>
                <View style={styles.modeHeader}>
                  <View style={styles.modeInfo}>
                    <View style={styles.modeNameRow}>
                      <Text style={styles.modeName}>{lightMode.name}</Text>
                      {lightMode.isSystemMode && (
                        <View style={styles.systemBadge}>
                          <Text style={styles.systemBadgeText}>Sistema</Text>
                        </View>
                      )}
                      {lightMode.isShared && (
                        <View style={styles.sharedBadge}>
                          <Text style={styles.sharedBadgeText}>Compartido</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.modeHabitat}>
                      {getHabitatLabel(lightMode.habitatType)}
                    </Text>
                    {lightMode.description && (
                      <Text style={styles.modeDescription}>
                        {lightMode.description}
                      </Text>
                    )}
                  </View>
                  
                  <View
                    style={[
                      styles.colorPreview,
                      {
                        backgroundColor: getSequenceColor(lightMode),
                      },
                    ]}
                  />
                </View>

                <View style={styles.modeDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Brillo:</Text>
                    <Text style={styles.detailValue}>{getSequenceBrightness(lightMode)}%</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duración:</Text>
                    <Text style={styles.detailValue}>
                      {getSequenceDuration(lightMode)}s
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Pasos:</Text>
                    <Text style={styles.detailValue}>
                      {lightMode.sequence?.length || 0} paso(s)
                    </Text>
                  </View>
                  {lightMode.schedule?.isEnabled && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Programado:</Text>
                      <Text style={styles.detailValue}>
                        {lightMode.schedule.timeRanges.length} horario(s)
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.modeActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditMode(lightMode)}
                  >
                    <MaterialIcons name="edit" size={20} color="#666" />
                  </TouchableOpacity>

                  {!lightMode.isSystemMode && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleShareMode(lightMode)}
                    >
                      <MaterialIcons name="share" size={20} color="#666" />
                    </TouchableOpacity>
                  )}

                  {!lightMode.isSystemMode && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteMode(lightMode)}
                    >
                      <MaterialIcons name="delete" size={20} color="#ff6b6b" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#130065',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#8EC5FC',
    borderColor: '#8EC5FC',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8EC5FC',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8EC5FC',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#8EC5FC',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  modeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modeInfo: {
    flex: 1,
    marginRight: 12,
  },
  modeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  modeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  systemBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  systemBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  sharedBadge: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sharedBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  modeHabitat: {
    fontSize: 14,
    color: '#8EC5FC',
    fontWeight: '500',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: '#666',
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  modeDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  modeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
});