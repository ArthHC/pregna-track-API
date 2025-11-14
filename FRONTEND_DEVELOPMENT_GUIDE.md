# 📱 Manual da PregnaTrack API para Desenvolvimento Frontend React Native + Expo

## 🎯 Visão Geral da API

**Base URL:** `http://localhost:3000` (desenvolvimento)  
**Tipo:** REST API  
**Autenticação:** JWT Bearer Token  
**Formato:** JSON  
**Framework:** NestJS + Prisma + PostgreSQL  

## 🔗 Estrutura da API

A API possui **3 módulos principais** com **15 endpoints** totais:

### 📋 Resumo dos Módulos:
- **🔐 Autenticação** (5 endpoints) - Login, refresh token, perfil, alterar senha
- **👨‍⚕️ Médicos** (5 endpoints) - CRUD completo de médicos
- **🤰 Pacientes** (5 endpoints) - CRUD completo de pacientes

---

## 🔐 MÓDULO DE AUTENTICAÇÃO

### 1. **POST /auth/login** - Login do Médico
**Função:** Autentica médico e retorna token JWT válido por 24h

**Request:**
```typescript
interface LoginRequest {
  email: string;      // Email do médico
  password: string;   // Senha (mínimo 6 caracteres)
}
```

**Response (200 OK):**
```typescript
interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    surname: string | null;
  };
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pregnatrack.com",
    "password": "admin123"
  }'
```

**Códigos de Erro:**
- `400` - Dados inválidos (email/senha formato incorreto)
- `401` - Credenciais incorretas

---

### 2. **POST /auth/refresh** - Renovar Token JWT
**Função:** Renova token JWT expirado ou próximo do vencimento

**Request:**
```typescript
interface RefreshTokenRequest {
  token: string;  // Token JWT a ser renovado
}
```

**Response (200 OK):**
```typescript
interface RefreshTokenResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    surname: string | null;
  };
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Códigos de Erro:**
- `401` - Token inválido ou não renovável

---

### 3. **GET /auth/me** - Dados Completos do Médico Logado
**Função:** Retorna dados completos do médico autenticado

**Headers Obrigatórios:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```typescript
interface CurrentDoctorResponse {
  id: number;
  name: string;
  surname: string | null;
  email: string;
  dateOfBirth: string | null;  // ISO date string
  parity: string | null;
}
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Códigos de Erro:**
- `401` - Token inválido ou expirado

---

### 4. **PATCH /auth/change-password** - Alterar Senha
**Função:** Permite alterar senha do médico logado

**Headers Obrigatórios:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request:**
```typescript
interface ChangePasswordRequest {
  currentPassword: string;  // Senha atual (mínimo 6 chars)
  newPassword: string;      // Nova senha (mínimo 6 chars)
}
```

**Response (200 OK):**
```typescript
interface ChangePasswordResponse {
  message: string;      // "Senha alterada com sucesso"
  timestamp: string;    // ISO date string
}
```

**Exemplo cURL:**
```bash
curl -X PATCH http://localhost:3000/auth/change-password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "admin123",
    "newPassword": "novasenha456"
  }'
```

**Códigos de Erro:**
- `400` - Senha atual incorreta ou nova senha inválida
- `401` - Token inválido

---

### 5. **GET /auth/profile** - Perfil Básico (Legado)
**Função:** Retorna informações básicas do médico (endpoint legado)

**Headers Obrigatórios:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```typescript
interface ProfileResponse {
  id: number;
  email: string;
  name: string;
}
```

---

## 👨‍⚕️ MÓDULO DE MÉDICOS

### 1. **POST /doctors** - Criar Médico
**Função:** Cadastra novo médico no sistema

**Headers Obrigatórios:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request:**
```typescript
interface CreateDoctorRequest {
  name: string;           // Nome (máximo 45 chars)
  email: string;          // Email único
  password: string;       // Senha (mínimo 6 chars)
  surname?: string;       // Sobrenome (opcional, máx 255 chars)
  dateOfBirth?: string;   // Data nascimento (opcional, ISO date)
  parity?: string;        // Paridade (opcional, máx 12 chars)
}
```

**Response (201 Created):**
```typescript
interface CreateDoctorResponse {
  id: number;
  name: string;
  surname: string | null;
  email: string;
  dateOfBirth: string | null;
  parity: string | null;
  // password não é retornado
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/doctors \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Pedro",
    "surname": "Oliveira",
    "email": "pedro.oliveira@email.com",
    "password": "123456789",
    "dateOfBirth": "1980-08-20"
  }'
```

**Códigos de Erro:**
- `400` - Dados inválidos ou email já existe
- `401` - Token inválido

---

### 2. **GET /doctors** - Listar Médicos
**Função:** Lista todos os médicos cadastrados

**Headers Obrigatórios:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```typescript
interface ListDoctorsResponse {
  id: number;
  name: string;
  surname: string | null;
  email: string;
  dateOfBirth: string | null;
  parity: string | null;
}[]
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:3000/doctors \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. **GET /doctors/{id}** - Buscar Médico por ID
**Função:** Retorna dados de um médico específico

**Headers Obrigatórios:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `id` (number) - ID do médico

**Response (200 OK):**
```typescript
interface GetDoctorResponse {
  id: number;
  name: string;
  surname: string | null;
  email: string;
  dateOfBirth: string | null;
  parity: string | null;
  patients: {
    id: number;
    name: string;
    surname: string | null;
    EDD: string;
  }[];
}
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:3000/doctors/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Códigos de Erro:**
- `404` - Médico não encontrado
- `401` - Token inválido

---

### 4. **PATCH /doctors/{id}** - Atualizar Médico
**Função:** Atualiza dados de um médico (todos campos opcionais)

**Headers Obrigatórios:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Path Parameters:**
- `id` (number) - ID do médico

**Request:**
```typescript
interface UpdateDoctorRequest {
  name?: string;           // Nome (opcional)
  email?: string;          // Email (opcional)
  password?: string;       // Senha (opcional, será hasheada)
  surname?: string;        // Sobrenome (opcional)
  dateOfBirth?: string;    // Data nascimento (opcional)
  parity?: string;         // Paridade (opcional)
}
```

**Response (200 OK):**
```typescript
interface UpdateDoctorResponse {
  id: number;
  name: string;
  surname: string | null;
  email: string;
  dateOfBirth: string | null;
  parity: string | null;
}
```

**Exemplo cURL:**
```bash
curl -X PATCH http://localhost:3000/doctors/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Pedro Atualizado",
    "surname": "Oliveira Santos"
  }'
```

---

### 5. **DELETE /doctors/{id}** - Deletar Médico
**Função:** Remove médico do sistema permanentemente

**Headers Obrigatórios:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `id` (number) - ID do médico

**Response (200 OK):**
```typescript
interface DeleteDoctorResponse {
  id: number;
  name: string;
  email: string;
}
```

**Exemplo cURL:**
```bash
curl -X DELETE http://localhost:3000/doctors/2 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🤰 MÓDULO DE PACIENTES

### 1. **POST /patients** - Criar Paciente
**Função:** Cadastra nova paciente no sistema

**Headers Obrigatórios:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request:**
```typescript
interface CreatePatientRequest {
  name: string;                     // Nome (máximo 45 chars)
  surname?: string;                 // Sobrenome (opcional, máx 255 chars)
  dateOfBirth?: string;            // Data nascimento (opcional, ISO date)
  phoneNumber?: string;            // Telefone (opcional, máx 20 chars)
  color?: string;                  // Cor identificação (opcional, máx 7 chars, ex: "#FF5733")
  EDD: string;                     // Data Provável do Parto (obrigatório, ISO date)
  assistanceDaysBeforeEDD: number; // Dias assistência antes EDD (obrigatório, min 0)
  assistanceDaysAfterEDD: number;  // Dias assistência após EDD (obrigatório, min 0)
  babyBirthDate?: string;          // Data nascimento bebê (opcional, ISO date)
  pregnancyStatus: string;         // Status gravidez (obrigatório, máx 20 chars)
  parity?: string;                 // Paridade (opcional, máx 12 chars, ex: "G1P0")
  observation?: string;            // Observações (opcional)
  doctorId: number;               // ID do médico responsável (obrigatório)
}
```

**Response (201 Created):**
```typescript
interface CreatePatientResponse {
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
    email: string;
  };
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/patients \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria",
    "surname": "Santos",
    "dateOfBirth": "1992-05-15",
    "phoneNumber": "11999888777",
    "color": "#FF5733",
    "EDD": "2025-06-01",
    "assistanceDaysBeforeEDD": 30,
    "assistanceDaysAfterEDD": 15,
    "pregnancyStatus": "Em acompanhamento",
    "parity": "G1P0",
    "observation": "Primeira gestação",
    "doctorId": 1
  }'
```

---

### 2. **GET /patients** - Listar Pacientes
**Função:** Lista todas as pacientes ou filtra por médico

**Headers Obrigatórios:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters (opcional):**
- `doctorId` (number) - Filtrar pacientes por médico

**Response (200 OK):**
```typescript
interface ListPatientsResponse {
  id: number;
  name: string;
  surname: string | null;
  dateOfBirth: string | null;
  EDD: string;
  assistanceDaysBeforeEDD: number;
  assistanceDaysAfterEDD: number;
  pregnancyStatus: string;
  parity: string | null;
  doctorId: number;
  doctor: {
    id: number;
    name: string;
  };
}[]
```

**Exemplos cURL:**
```bash
# Todas as pacientes
curl -X GET http://localhost:3000/patients \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Pacientes de um médico específico
curl -X GET "http://localhost:3000/patients?doctorId=1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. **GET /patients/{id}** - Buscar Paciente por ID
**Função:** Retorna dados completos de uma paciente específica

**Headers Obrigatórios:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `id` (number) - ID da paciente

**Response (200 OK):**
```typescript
interface GetPatientResponse {
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
    email: string;
  };
}
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:3000/patients/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Códigos de Erro:**
- `404` - Paciente não encontrada
- `401` - Token inválido

---

### 4. **PATCH /patients/{id}** - Atualizar Paciente
**Função:** Atualiza dados de uma paciente (todos campos opcionais)

**Headers Obrigatórios:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Path Parameters:**
- `id` (number) - ID da paciente

**Request:**
```typescript
interface UpdatePatientRequest {
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
```

**Response (200 OK):**
```typescript
interface UpdatePatientResponse {
  id: number;
  name: string;
  // ... todos os campos da paciente atualizada
  doctor: {
    id: number;
    name: string;
  };
}
```

**Exemplo cURL:**
```bash
curl -X PATCH http://localhost:3000/patients/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "EDD": "2025-08-01",
    "pregnancyStatus": "Acompanhamento intensivo",
    "observation": "Data atualizada após ultrassom"
  }'
```

---

### 5. **DELETE /patients/{id}** - Deletar Paciente
**Função:** Remove paciente do sistema permanentemente

**Headers Obrigatórios:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `id` (number) - ID da paciente

**Response (200 OK):**
```typescript
interface DeletePatientResponse {
  id: number;
  name: string;
  surname: string | null;
}
```

**Exemplo cURL:**
```bash
curl -X DELETE http://localhost:3000/patients/2 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔧 CONFIGURAÇÕES TÉCNICAS

### 🔐 Autenticação JWT
- **Header:** `Authorization: Bearer {token}`
- **Expiração:** 24 horas
- **Payload:** `{ email, sub (id), name }`
- **Algoritmo:** HS256

### 📝 Validações Globais
- **ValidationPipe:** Ativo em todos endpoints
- **Transform:** `true` (converte tipos automaticamente)
- **Whitelist:** `true` (remove propriedades não definidas nos DTOs)

### 🎯 Códigos de Status HTTP
- **200** - Sucesso (GET, PATCH, DELETE)
- **201** - Criado com sucesso (POST)
- **400** - Dados inválidos (validação falhou)
- **401** - Não autorizado (token inválido/expirado)
- **404** - Recurso não encontrado
- **500** - Erro interno do servidor

### 📅 Formato de Datas
- **Entrada:** ISO 8601 string (`"2025-06-01"`)
- **Saída:** ISO 8601 string (`"2025-06-01T00:00:00.000Z"`)

### 🔒 Regras de Negócio
- **Email único** para médicos
- **Relacionamento obrigatório** paciente -> médico
- **Senhas hasheadas** com bcrypt (salt rounds 10)
- **Campos opcionais** implementados conforme especificação

---

## 🧪 DADOS DE TESTE

### Usuário Admin Padrão:
```json
{
  "email": "admin@pregnatrack.com",
  "password": "admin123"
}
```

### Exemplo de Médico:
```json
{
  "name": "Dr. João",
  "surname": "Silva",
  "email": "joao.silva@email.com",
  "password": "123456789",
  "dateOfBirth": "1985-03-15"
}
```

### Exemplo de Paciente:
```json
{
  "name": "Maria",
  "surname": "Santos",
  "dateOfBirth": "1992-05-15",
  "EDD": "2025-06-01",
  "assistanceDaysBeforeEDD": 30,
  "assistanceDaysAfterEDD": 15,
  "pregnancyStatus": "Em acompanhamento",
  "parity": "G1P0",
  "doctorId": 1
}
```

---

## 📱 CONSIDERAÇÕES PARA REACT NATIVE + EXPO

### 🔄 Gerenciamento de Estado Sugerido:
- **Redux Toolkit** ou **Zustand** para estado global
- **React Query/TanStack Query** para cache e sincronização de dados
- **AsyncStorage** para persistir token JWT

### 🌐 Cliente HTTP Sugerido:
- **Axios** com interceptors para:
  - Adicionar token automaticamente
  - Refresh automático de token
  - Tratamento de erros globais

### 🔐 Fluxo de Autenticação Sugerido:
1. Login → Salvar token no AsyncStorage
2. Interceptor adiciona token automaticamente
3. Token expirado → Usar `/auth/refresh` automaticamente
4. Logout → Limpar token do AsyncStorage

### 📊 Estrutura de Telas Sugerida:
- **Auth Stack:** Login, Esqueci Senha, Alterar Senha
- **Main Stack:** Dashboard, Lista Pacientes, Detalhes Paciente
- **Profile Stack:** Perfil Médico, Configurações

### 🎨 Funcionalidades de UI/UX:
- **Pull-to-refresh** nas listas
- **Infinite scroll** ou paginação
- **Loading states** e **error handling**
- **Offline support** com cache local
- **Push notifications** para lembretes

---

## 🚀 URLs E RECURSOS

### 📍 Endpoints da API:
- **Base URL Desenvolvimento:** `http://localhost:3000`
- **Documentação Swagger:** `http://localhost:3000/api`

### 📋 Arquivos de Referência:
- **Postman Collection:** `PregnaTrack_API_Complete.postman_collection.json`
- **Documentação Completa:** Vários arquivos `.md` no repositório

### 🔗 Repositório:
- **GitHub:** `ArthHC/pregna-track-API`
- **Branch:** `develop`

---

## ✅ CHECKLIST PARA DESENVOLVIMENTO FRONTEND

### 🔐 Autenticação:
- [ ] Tela de login
- [ ] Gerenciamento de token JWT
- [ ] Refresh automático de token
- [ ] Logout seguro
- [ ] Alterar senha

### 👨‍⚕️ Gestão de Médicos:
- [ ] Listar médicos
- [ ] Ver perfil próprio
- [ ] Editar perfil próprio
- [ ] Cadastrar novo médico (se admin)

### 🤰 Gestão de Pacientes:
- [ ] Listar pacientes
- [ ] Filtrar pacientes por médico
- [ ] Ver detalhes de paciente
- [ ] Cadastrar nova paciente
- [ ] Editar dados de paciente
- [ ] Deletar paciente

### 🛠️ Funcionalidades Técnicas:
- [ ] Interceptors HTTP
- [ ] Cache de dados
- [ ] Tratamento de erros
- [ ] Loading states
- [ ] Offline support
- [ ] Validação de formulários

---

**📱 Este manual contém todas as informações necessárias para desenvolver o frontend React Native + Expo da PregnaTrack API. Use como referência completa para o Claude Sonnet!**