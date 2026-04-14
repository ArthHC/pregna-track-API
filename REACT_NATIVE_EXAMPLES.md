# 📱 Exemplos de Integração React Native + Expo para PregnaTrack API

## 🔧 Configuração Inicial

### 1. Dependências Sugeridas
```json
{
  "dependencies": {
    "@expo/vector-icons": "^14.0.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@reduxjs/toolkit": "^1.9.0",
    "@tanstack/react-query": "^4.29.0",
    "axios": "^1.4.0",
    "expo": "~49.0.0",
    "expo-secure-store": "~12.3.1",
    "expo-constants": "~14.4.2",
    "react": "18.2.0",
    "react-native": "0.72.0",
    "react-native-paper": "^5.8.0",
    "react-hook-form": "^7.45.0",
    "react-native-toast-message": "^2.1.6"
  }
}
```

### 2. Configuração do Axios
```typescript
// services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const API_URL = __DEV__ 
  ? 'http://localhost:3000' 
  : 'https://your-production-api.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refresh automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        try {
          const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
            token
          });
          
          const newToken = refreshResponse.data.access_token;
          await SecureStore.setItemAsync('authToken', newToken);
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(error.config);
        } catch (refreshError) {
          // Redirect to login
          await SecureStore.deleteItemAsync('authToken');
          // Navigate to login screen
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔐 Serviços de Autenticação

### AuthService
```typescript
// services/authService.ts
import api from './api';
import * as SecureStore from 'expo-secure-store';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    surname: string | null;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface DoctorProfile {
  id: number;
  name: string;
  surname: string | null;
  email: string;
  dateOfBirth: string | null;
  parity: string | null;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Salvar token
    await SecureStore.setItemAsync('authToken', response.data.access_token);
    
    return response.data;
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('authToken');
  }

  async getProfile(): Promise<DoctorProfile> {
    const response = await api.get<DoctorProfile>('/auth/me');
    return response.data;
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.patch('/auth/change-password', data);
  }

  async refreshToken(): Promise<LoginResponse> {
    const currentToken = await SecureStore.getItemAsync('authToken');
    if (!currentToken) throw new Error('No token found');
    
    const response = await api.post<LoginResponse>('/auth/refresh', {
      token: currentToken
    });
    
    await SecureStore.setItemAsync('authToken', response.data.access_token);
    return response.data;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync('authToken');
    return !!token;
  }
}

export default new AuthService();
```

---

## 👨‍⚕️ Serviços de Médicos

### DoctorsService
```typescript
// services/doctorsService.ts
import api from './api';

export interface Doctor {
  id: number;
  name: string;
  surname: string | null;
  email: string;
  dateOfBirth: string | null;
  parity: string | null;
}

export interface CreateDoctorData {
  name: string;
  email: string;
  password: string;
  surname?: string;
  dateOfBirth?: string;
  parity?: string;
}

export interface UpdateDoctorData {
  name?: string;
  email?: string;
  password?: string;
  surname?: string;
  dateOfBirth?: string;
  parity?: string;
}

class DoctorsService {
  async getAllDoctors(): Promise<Doctor[]> {
    const response = await api.get<Doctor[]>('/doctors');
    return response.data;
  }

  async getDoctorById(id: number): Promise<Doctor> {
    const response = await api.get<Doctor>(`/doctors/${id}`);
    return response.data;
  }

  async createDoctor(data: CreateDoctorData): Promise<Doctor> {
    const response = await api.post<Doctor>('/doctors', data);
    return response.data;
  }

  async updateDoctor(id: number, data: UpdateDoctorData): Promise<Doctor> {
    const response = await api.patch<Doctor>(`/doctors/${id}`, data);
    return response.data;
  }

  async deleteDoctor(id: number): Promise<void> {
    await api.delete(`/doctors/${id}`);
  }
}

export default new DoctorsService();
```

---

## 🤰 Serviços de Pacientes

### PatientsService
```typescript
// services/patientsService.ts
import api from './api';

export interface Patient {
  id: number;
  name: string;
  surname: string | null;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  color: string | null;
  EDD: string;
  assistanceDaysBeforeEDD: number;
  assistanceDaysAfterEDD: number;
  babyBirthDate: string | null;
  pregnancyStatus: string;
  parity: string | null;
  observation: string | null;
  doctorId: number;
  doctor: {
    id: number;
    name: string;
    email?: string;
  };
}

export interface CreatePatientData {
  name: string;
  surname?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  color?: string;
  EDD: string;
  assistanceDaysBeforeEDD: number;
  assistanceDaysAfterEDD: number;
  babyBirthDate?: string;
  pregnancyStatus: string;
  parity?: string;
  observation?: string;
  doctorId: number;
}

export interface UpdatePatientData {
  name?: string;
  surname?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  color?: string;
  EDD?: string;
  assistanceDaysBeforeEDD?: number;
  assistanceDaysAfterEDD?: number;
  babyBirthDate?: string;
  pregnancyStatus?: string;
  parity?: string;
  observation?: string;
  doctorId?: number;
}

class PatientsService {
  async getAllPatients(): Promise<Patient[]> {
    const response = await api.get<Patient[]>('/patients');
    return response.data;
  }

  async getPatientsByDoctor(doctorId: number): Promise<Patient[]> {
    const response = await api.get<Patient[]>(`/patients?doctorId=${doctorId}`);
    return response.data;
  }

  async getPatientById(id: number): Promise<Patient> {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  }

  async createPatient(data: CreatePatientData): Promise<Patient> {
    const response = await api.post<Patient>('/patients', data);
    return response.data;
  }

  async updatePatient(id: number, data: UpdatePatientData): Promise<Patient> {
    const response = await api.patch<Patient>(`/patients/${id}`, data);
    return response.data;
  }

  async deletePatient(id: number): Promise<void> {
    await api.delete(`/patients/${id}`);
  }
}

export default new PatientsService();
```

---

## 🔄 Hooks Personalizados com React Query

### Auth Hooks
```typescript
// hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AuthService, { LoginCredentials, ChangePasswordData } from '../services/authService';

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => AuthService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => AuthService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => AuthService.changePassword(data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
```

### Patients Hooks
```typescript
// hooks/usePatients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PatientsService, { CreatePatientData, UpdatePatientData } from '../services/patientsService';

export const usePatients = (doctorId?: number) => {
  return useQuery({
    queryKey: ['patients', doctorId],
    queryFn: () => doctorId 
      ? PatientsService.getPatientsByDoctor(doctorId)
      : PatientsService.getAllPatients(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const usePatient = (id: number) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => PatientsService.getPatientById(id),
    enabled: !!id,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePatientData) => PatientsService.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePatientData }) => 
      PatientsService.updatePatient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', id] });
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => PatientsService.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
```

---

## 📱 Exemplos de Componentes React Native

### Tela de Login
```typescript
// screens/LoginScreen.tsx
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useLogin } from '../hooks/useAuth';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen({ navigation }: any) {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const loginMutation = useLogin();

  const onSubmit = async (data: LoginForm) => {
    try {
      await loginMutation.mutateAsync(data);
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            PregnaTrack
          </Text>
          
          <Controller
            control={control}
            rules={{
              required: 'Email é obrigatório',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Email inválido'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
              />
            )}
            name="email"
          />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

          <Controller
            control={control}
            rules={{
              required: 'Senha é obrigatória',
              minLength: {
                value: 6,
                message: 'Senha deve ter pelo menos 6 caracteres'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Senha"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry
                error={!!errors.password}
                style={styles.input}
              />
            )}
            name="password"
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loginMutation.isPending}
            style={styles.button}
          >
            Entrar
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#e91e63',
  },
  input: {
    marginTop: 10,
  },
  button: {
    marginTop: 20,
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 5,
  },
});
```

### Lista de Pacientes
```typescript
// screens/PatientsListScreen.tsx
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Card, Text, FAB, Searchbar, Chip } from 'react-native-paper';
import { usePatients } from '../hooks/usePatients';
import { Patient } from '../services/patientsService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PatientsListScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<number | undefined>();
  
  const { data: patients, isLoading, refetch } = usePatients(selectedDoctor);

  const filteredPatients = patients?.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.surname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPatient = ({ item }: { item: Patient }) => (
    <Card 
      style={styles.card}
      onPress={() => navigation.navigate('PatientDetails', { id: item.id })}
    >
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">
            {item.name} {item.surname}
          </Text>
          {item.color && (
            <View 
              style={[styles.colorIndicator, { backgroundColor: item.color }]} 
            />
          )}
        </View>
        
        <Text variant="bodyMedium" style={styles.subtitle}>
          Dr(a). {item.doctor.name}
        </Text>
        
        <View style={styles.info}>
          <Chip icon="calendar" compact>
            EDD: {format(new Date(item.EDD), 'dd/MM/yyyy', { locale: ptBR })}
          </Chip>
          <Chip icon="medical-bag" compact style={styles.chip}>
            {item.pregnancyStatus}
          </Chip>
        </View>
        
        {item.parity && (
          <Text variant="bodySmall" style={styles.parity}>
            Paridade: {item.parity}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar pacientes..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <FlatList
        data={filteredPatients}
        renderItem={renderPatient}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
          />
        }
        contentContainerStyle={styles.list}
      />
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePatient')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  info: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  chip: {
    marginLeft: 8,
  },
  parity: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#e91e63',
  },
});
```

---

## 🔧 Utilitários e Helpers

### Date Utils
```typescript
// utils/dateUtils.ts
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  
  const date = parseISO(dateString);
  if (!isValid(date)) return '-';
  
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return '-';
  
  const date = parseISO(dateString);
  if (!isValid(date)) return '-';
  
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

export const formatDateForAPI = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const calculateWeeksToEDD = (eddString: string): number => {
  const edd = parseISO(eddString);
  const today = new Date();
  const diffTime = edd.getTime() - today.getTime();
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks;
};
```

### Validation Utils
```typescript
// utils/validationUtils.ts
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\d{10,11}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const isValidHexColor = (color: string): boolean => {
  const hexRegex = /^#[0-9A-F]{6}$/i;
  return hexRegex.test(color);
};
```

---

## 🚀 Configuração do QueryClient

### App.tsx
```typescript
// App.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import RootNavigator from './navigation/RootNavigator';
import { theme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <RootNavigator />
          <Toast />
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
```

---

**🎯 Este arquivo complementa o manual principal com exemplos práticos de implementação em React Native + Expo. Use estes códigos como base para desenvolvimento do frontend!**