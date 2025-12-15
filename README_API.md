# 🤰 PregnaTrack API

## 📋 Visão Geral

A **PregnaTrack API** é uma aplicação backend desenvolvida para o gerenciamento de acompanhamento pré-natal, permitindo que médicos monitorem suas pacientes gestantes de forma eficiente e organizada. A API é construída com **NestJS**, **Prisma ORM**, **PostgreSQL** e implementa autenticação **JWT**.

## 🎯 Objetivo do Sistema

O sistema foi desenvolvido como **Trabalho de Conclusão de Curso (TCC)** com o objetivo de:

- Facilitar o acompanhamento médico de gestantes
- Centralizar informações sobre pacientes em um só lugar
- Permitir o gerenciamento de consultas e notificações
- Oferecer uma API robusta e bem documentada para integração com aplicações frontend
- Garantir segurança no acesso aos dados médicos sensíveis

## 🏗️ Arquitetura do Sistema

### Stack Tecnológica

- **Framework**: NestJS (Node.js)
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT (JSON Web Token)
- **Validação**: class-validator
- **Documentação**: Swagger/OpenAPI
- **Criptografia**: bcryptjs
- **Linguagem**: TypeScript

### Estrutura de Módulos

```
src/
├── auth/           # Módulo de autenticação
├── doctors/        # Módulo de gerenciamento de médicos
├── patients/       # Módulo de gerenciamento de pacientes
├── notifications/  # Módulo de notificações
├── prisma/         # Configuração do Prisma ORM
└── main.ts         # Ponto de entrada da aplicação
```

## 🗄️ Modelo de Dados

### Entidades Principais

#### 1. **Doctor** (Médico)
```typescript
model Doctor {
  id              Int            @id @default(autoincrement())
  name            String         @db.VarChar(45)    // Nome do médico
  surname         String?        @db.VarChar(255)   // Sobrenome (opcional)
  email           String         @unique @db.VarChar(320)  // Email único
  password        String         @db.VarChar(255)   // Senha criptografada
  patients        Patient[]      // Relacionamento com pacientes
  notifications   Notification[] // Relacionamento com notificações
}
```

#### 2. **Patient** (Paciente)
```typescript
model Patient {
  id                      Int       @id @default(autoincrement())
  name                    String    @db.VarChar(255)  // Nome da paciente
  dateOfBirth             DateTime? // Data de nascimento (opcional)
  phoneNumber             String?   @db.VarChar(20)   // Telefone (opcional)
  color                   String?   @db.VarChar(7)    // Cor de identificação (hex)
  babyName                String?   @db.VarChar(255)  // Nome do bebê (opcional)
  EDD                     DateTime  // Expected Delivery Date (Data Provável do Parto)
  assistanceDaysBeforeEDD Int       // Dias de assistência antes da DPP
  assistanceDaysAfterEDD  Int       // Dias de assistência após a DPP
  parity                  String?   @db.VarChar(12)   // Paridade (G1P0, etc.)
  babyBirthDate           DateTime? // Data real do nascimento
  pregnancyStatus         String?   @db.VarChar(20)   // Status da gravidez
  observation             String?   @db.Text          // Observações médicas
  doctorId                Int       // FK para Doctor
  doctor                  Doctor    @relation(fields: [doctorId], references: [id])
}
```

#### 3. **Notification** (Notificação)
```typescript
model Notification {
  id          Int      @id @default(autoincrement())
  doctorId    Int      // FK para Doctor
  doctor      Doctor   @relation(fields: [doctorId], references: [id])
  date        DateTime // Data/hora da notificação
  message     String   @db.Text  // Mensagem da notificação
}
```

## 🔐 Sistema de Autenticação

### Estratégias de Autenticação

1. **Local Strategy**: Para login com email/senha
2. **JWT Strategy**: Para proteção de rotas autenticadas

### Fluxo de Autenticação

1. **Registro**: Médico se registra com email, senha, nome
2. **Login**: Autenticação retorna JWT token + dados do usuário
3. **Proteção de Rotas**: Token JWT validado em rotas protegidas
4. **Refresh Token**: Renovação de tokens expirados
5. **Alteração de Senha**: Endpoint seguro para mudança de senha

### Endpoints de Autenticação

```typescript
POST /auth/register     # Registro de novo médico
POST /auth/login        # Login (email + senha)
POST /auth/refresh      # Renovação de token
GET  /auth/profile      # Dados do médico logado
PUT  /auth/change-password  # Alteração de senha
```

## 🏥 Módulo de Médicos (Doctors)

### Funcionalidades

- **CRUD Completo**: Criar, listar, buscar, atualizar e deletar médicos
- **Validação de Dados**: Email único, validação de formato
- **Criptografia de Senha**: bcryptjs para hash das senhas
- **Relacionamentos**: Associação com pacientes e notificações

### Campos do Médico

```typescript
interface Doctor {
  id: number;           // ID único
  name: string;         // Nome (obrigatório, max 45 chars)
  surname?: string;     // Sobrenome (opcional, max 255 chars)
  email: string;        // Email único (obrigatório, max 320 chars)
  password: string;     // Senha criptografada (min 6 chars)
}
```

### Endpoints

```typescript
GET    /doctors         # Listar todos os médicos
GET    /doctors/:id     # Buscar médico por ID
POST   /doctors         # Criar novo médico
PUT    /doctors/:id     # Atualizar médico
DELETE /doctors/:id     # Deletar médico
```

## 🤰 Módulo de Pacientes (Patients)

### Funcionalidades Principais

- **Gestão Completa de Gestantes**: CRUD com campos específicos para acompanhamento pré-natal
- **Cálculo de DPP**: Data Provável do Parto (Expected Delivery Date)
- **Período de Assistência**: Definição de dias antes/depois da DPP para acompanhamento
- **Status da Gravidez**: Acompanhamento do status atual
- **Identificação Visual**: Sistema de cores para organização
- **Relacionamento Médico-Paciente**: Cada paciente vinculada a um médico

### Campos da Paciente

```typescript
interface Patient {
  id: number;                      // ID único
  name: string;                    // Nome (obrigatório, max 255 chars)
  dateOfBirth?: Date;             // Data de nascimento (opcional)
  phoneNumber?: string;           // Telefone (opcional, max 20 chars)
  color?: string;                 // Cor hex para identificação (opcional)
  babyName?: string;              // Nome do bebê (opcional, max 255 chars)
  EDD: Date;                      // Data Provável do Parto (obrigatório)
  assistanceDaysBeforeEDD: number; // Dias de assistência antes DPP
  assistanceDaysAfterEDD: number;  // Dias de assistência após DPP
  parity?: string;                // Paridade obstétrica (G1P0, etc.)
  babyBirthDate?: Date;           // Data real do nascimento
  pregnancyStatus?: string;        // Status da gravidez
  observation?: string;           // Observações médicas
  doctorId: number;               // ID do médico responsável
}
```

### Conceitos Médicos Implementados

#### 1. **Data Provável do Parto (DPP/EDD)**
- Campo obrigatório para cálculo do acompanhamento
- Base para determinar período de assistência
- Fundamental para o planejamento médico

#### 2. **Paridade Obstétrica**
- Formato padrão: G(gestações)P(partos)
- Exemplo: "G1P0" = primeira gestação, nenhum parto anterior
- Importante para histórico médico

#### 3. **Período de Assistência**
- **assistanceDaysBeforeEDD**: Quantos dias antes da DPP iniciar acompanhamento intensivo
- **assistanceDaysAfterEDD**: Quantos dias após DPP manter acompanhamento
- Permite personalização por paciente

#### 4. **Status da Gravidez**
- Estados possíveis: "Em acompanhamento", "Finalizada", "Parto realizado"
- Padrão: "Em acompanhamento" se não especificado

### Endpoints

```typescript
GET    /patients             # Listar todas as pacientes
GET    /patients?doctorId=X  # Filtrar por médico específico
GET    /patients/:id         # Buscar paciente por ID
POST   /patients             # Criar nova paciente
PUT    /patients/:id         # Atualizar paciente
DELETE /patients/:id         # Deletar paciente
```

### Regras de Negócio

1. **Associação Obrigatória**: Toda paciente deve estar vinculada a um médico
2. **DPP Obrigatória**: Data Provável do Parto é campo obrigatório
3. **Validação de Períodos**: Dias de assistência devem ser números positivos
4. **Cor de Identificação**: Se fornecida, deve estar em formato hexadecimal
5. **Status Automático**: Se não informado, status padrão é "Em acompanhamento"

## 🔔 Módulo de Notificações

### Funcionalidades

- **Sistema de Alertas**: Notificações personalizadas para médicos
- **Associação por Médico**: Cada notificação vinculada a um médico específico
- **Timestamping**: Data/hora precisa de cada notificação
- **Mensagens Flexíveis**: Campo de texto livre para mensagens

### Campos da Notificação

```typescript
interface Notification {
  id: number;        // ID único
  doctorId: number;  // ID do médico destinatário
  date: Date;        // Data/hora da notificação
  message: string;   // Conteúdo da mensagem
}
```

### Endpoints

```typescript
GET    /notifications          # Listar todas as notificações
GET    /notifications/:id      # Buscar notificação por ID
POST   /notifications          # Criar nova notificação
PUT    /notifications/:id      # Atualizar notificação
DELETE /notifications/:id      # Deletar notificação
```

### Casos de Uso

1. **Lembretes de Consulta**: Notificar sobre consultas próximas
2. **Alertas de DPP**: Avisar quando paciente se aproxima da data provável
3. **Status Changes**: Informar mudanças no status das pacientes
4. **Comunicações Gerais**: Mensagens administrativas ou clínicas

## 🛡️ Segurança e Validação

### Validações Implementadas

#### Validação de Dados de Entrada
```typescript
// Exemplo: CreatePatientDto
class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @IsNotEmpty()
  @IsDateString()
  EDD: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  assistanceDaysBeforeEDD: number;
}
```

### Segurança

1. **Autenticação JWT**: Todas as rotas principais protegidas
2. **Senha Criptografada**: bcryptjs com salt automático
3. **Validação de Input**: class-validator em todos os DTOs
4. **CORS Habilitado**: Configurado para permitir requisições frontend
5. **Sanitização**: whitelist e forbidNonWhitelisted habilitados

### Guards Implementados

- **JwtAuthGuard**: Proteção por token JWT
- **LocalAuthGuard**: Validação de login local

## 📋 Pipeline de Dados

### Fluxo de Criação de Paciente

1. **Recepção**: DTO validado pelo class-validator
2. **Transformação**: Conversão de strings de data para objetos Date
3. **Defaults**: Aplicação de valores padrão (pregnancyStatus)
4. **Persistência**: Salvamento via Prisma com relacionamentos incluídos
5. **Resposta**: Retorno da paciente criada com dados do médico

### Processamento de Datas

```typescript
// Conversão automática de strings para Date
const createData: any = { ...rest };

if (dateOfBirth) {
  createData.dateOfBirth = new Date(dateOfBirth);
}

if (babyBirthDate) {
  createData.babyBirthDate = new Date(babyBirthDate);
}

createData.EDD = new Date(EDD);
```

## 📊 Relacionamentos e Consultas

### Relacionamentos Implementados

1. **Doctor → Patient**: Um para muitos (1:N)
2. **Doctor → Notification**: Um para muitos (1:N)

### Consultas Otimizadas

```typescript
// Incluindo relacionamentos nas consultas
return this.prisma.patient.findMany({
  include: {
    doctor: true,  // Inclui dados do médico responsável
  },
});
```

### Filtros Disponíveis

- **Pacientes por Médico**: `/patients?doctorId=X`
- **Busca Individual**: Por ID específico
- **Listagem Completa**: Com dados relacionados incluídos

## 🚀 Configuração e Deployment

### Variáveis de Ambiente Necessárias

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/pregna_track"
JWT_SECRET="sua_chave_secreta_jwt"
JWT_EXPIRES_IN="24h"
```

### Scripts Disponíveis

```bash
npm run start:dev    # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run start:prod   # Execução em produção
npm run format       # Formatação de código
npm run lint         # Linting
npm run test         # Testes unitários
npm run test:e2e     # Testes end-to-end
```

### Configuração do Banco

```bash
npx prisma migrate dev    # Aplicar migrações em desenvolvimento
npx prisma generate      # Gerar cliente Prisma
npx prisma studio       # Interface visual do banco
```

## 📖 Documentação da API

### Swagger/OpenAPI

- **URL**: `http://localhost:3000/api`
- **Autenticação**: Bearer Token JWT
- **Recursos**:
  - Documentação interativa completa
  - Testes diretos na interface
  - Exemplos para todos os endpoints
  - Schemas detalhados

### Customizações do Swagger

- Interface personalizada com cores temáticas
- Organização por tags funcionais
- Exemplos práticos para cada endpoint
- Persistência de autorização entre sessões

## 🧪 Testes e Qualidade

### Estrutura de Testes

```
test/
├── app.e2e-spec.ts     # Testes end-to-end
└── jest-e2e.json       # Configuração Jest E2E
```

### Ferramentas de Qualidade

- **ESLint**: Linting de código
- **Prettier**: Formatação automática
- **Jest**: Framework de testes
- **Class-validator**: Validação runtime
- **TypeScript**: Tipagem estática

## 📈 Monitoramento e Logs

### Logs da Aplicação

```typescript
// Logs estruturados no bootstrap
console.log('📚 Swagger docs available at: http://localhost:3000/api');
```

### Tratamento de Erros

- **NotFoundException**: Para recursos não encontrados
- **UnauthorizedException**: Para falhas de autenticação
- **BadRequestException**: Para dados inválidos
- **Validation Pipes**: Interceptação automática de erros de validação

## 🔄 Ciclo de Desenvolvimento

### Workflow de Mudanças no Banco

1. **Modificação**: Alteração no `schema.prisma`
2. **Migração**: `npx prisma migrate dev --name nome_da_migracao`
3. **Geração**: `npx prisma generate`
4. **Atualização**: Ajustes nos DTOs e services conforme necessário

### Versionamento

- **Prisma Migrations**: Controle de versão do esquema de banco
- **Git**: Controle de versão do código
- **Semantic Versioning**: Para releases da API

## 🎯 Funcionalidades Futuras

### Possíveis Melhorias

1. **Sistema de Agendamentos**: Integração com calendário médico
2. **Relatórios**: Geração de relatórios estatísticos
3. **Notificações Push**: Sistema de notificações em tempo real
4. **Integração com Dispositivos**: Wearables para monitoramento
5. **Histórico Médico**: Registros detalhados de consultas
6. **Multitenancy**: Suporte para múltiplas clínicas
7. **Backup Automático**: Rotinas de backup dos dados
8. **Analytics**: Dashboard com métricas de acompanhamento

## 📞 Contato e Suporte

Este projeto foi desenvolvido como **Trabalho de Conclusão de Curso** e representa uma solução completa para acompanhamento pré-natal, demonstrando conhecimentos em:

- Desenvolvimento Backend com NestJS
- Modelagem de Banco de Dados Relacionais
- Autenticação e Autorização JWT
- Documentação de API com OpenAPI/Swagger
- Boas Práticas de Desenvolvimento
- Arquitetura de Software
- Validação e Segurança de Dados

A API serve como base sólida para desenvolvimento de aplicações frontend (web, mobile) que necessitem gerenciar acompanhamento médico de gestantes de forma profissional e segura.
