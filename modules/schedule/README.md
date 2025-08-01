# Dependencias requeridas para el módulo de programaciones

Para usar el módulo de programaciones, necesitas instalar las siguientes dependencias:

```bash
# DateTimePicker para selección de hora
npm install @react-native-community/datetimepicker

# Picker para seleccionar opciones
npm install @react-native-picker/picker

# AsyncStorage para almacenamiento local
npm install @react-native-async-storage/async-storage

# Para Android, también ejecuta:
npx react-native run-android
```

## Configuración adicional

### Para iOS:
```bash
cd ios && pod install
```

### Variables de entorno:
Crea un archivo `.env` en la raíz del proyecto:
```
EXPO_PUBLIC_API_URL=http://tu-servidor:3000/api
```

### Estructura de archivos:
```
modules/schedule/
├── components/
│   ├── ScheduleCard.tsx
│   └── ScheduleForm.tsx
├── hooks/
│   └── useSchedules.ts
├── screens/
│   └── ScheduleScreen.tsx
├── services/
│   └── schedule.service.ts
├── types/
│   └── schedule.types.ts
└── index.ts
```

## Uso

```tsx
import { ScheduleScreen } from './modules/schedule';

// En tu navegador
<Tab.Screen 
  name="Schedule" 
  component={ScheduleScreen} 
  options={{
    title: 'Programaciones',
    tabBarIcon: ({ color }) => (
      <Ionicons name="calendar-outline" size={24} color={color} />
    ),
  }}
/>
```
