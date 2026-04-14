# PregnaTrack API - Análise de Casos de Uso do Backend

## Visão Geral do Sistema Backend

A **PregnaTrack API** é um sistema backend para acompanhamento pré-natal que processa todas as operações do lado servidor. Este documento detalha exclusivamente os casos de uso que ocorrem no backend, sem considerar interações de frontend.

## Atores do Sistema

### 1. **Médico** (Actor Principal)
- Profissional de saúde que utiliza o sistema
- Possui credenciais de acesso (email/senha)
- Responsável pelo acompanhamento de pacientes gestantes

### 2. **Sistema de Banco de Dados** (Actor Secundário)
- PostgreSQL que persiste todas as informações
- Gerenciado através do Prisma ORM
- Responsável pela integridade dos dados

### 3. **Sistema de Autenticação** (Actor Secundário)
- Módulo JWT que valida tokens de acesso
- Responsável pela segurança das operações
- Gerencia sessões e permissões

## Casos de Uso do Sistema Backend

### 1. **Gerenciamento de Autenticação**

#### UC001 - Registrar Novo Médico
**Ator:** Sistema Backend
**Processo:**
1. Receber dados do médico (nome, surname?, email, senha)
2. Validar formato dos dados (DTOs + class-validator)
3. Verificar se email já existe no banco
4. Criptografar senha usando bcryptjs
5. Salvar médico no banco de dados via Prisma
6. Retornar dados do médico (sem senha)

**Fluxo Alternativo:**
- Email duplicado: Retornar erro de conflito
- Dados inválidos: Retornar erro de validação

#### UC002 - Autenticar Médico (Login)
**Ator:** Sistema Backend
**Processo:**
1. Receber credenciais (email, senha)
2. Buscar médico por email no banco
3. Comparar senha fornecida com hash armazenado (bcryptjs)
4. Gerar token JWT com payload (id, email, nome)
5. Retornar token + dados do usuário

**Fluxo Alternativo:**
- Credenciais inválidas: Retornar erro não autorizado

#### UC003 - Validar Token JWT
**Ator:** Sistema Backend
**Processo:**
1. Interceptar requisição com JWT Guard
2. Extrair token do header Authorization
3. Verificar validade e assinatura do token
4. Decodificar payload para obter dados do usuário
5. Permitir ou negar acesso ao endpoint

#### UC004 - Renovar Token Expirado
**Ator:** Sistema Backend
**Processo:**
1. Receber token expirado
2. Decodificar token (ignorando expiração)
3. Validar se usuário ainda existe no banco
4. Gerar novo token com dados atualizados
5. Retornar novo token + dados do usuário

#### UC005 - Alterar Senha do Médico
**Ator:** Sistema Backend
**Processo:**
1. Validar token JWT do usuário logado
2. Receber senha atual e nova senha
3. Verificar senha atual com hash do banco
4. Criptografar nova senha
5. Atualizar senha no banco de dados
6. Confirmar alteração

### 2. **Gerenciamento de Médicos (CRUD)**

#### UC006 - Listar Todos os Médicos
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT
2. Consultar tabela Doctor via Prisma
3. Excluir campo password dos resultados
4. Retornar lista de médicos

#### UC007 - Buscar Médico por ID
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT
2. Receber ID do médico
3. Consultar banco por ID específico
4. Verificar se médico existe
5. Retornar dados do médico (sem senha)

**Fluxo Alternativo:**
- Médico não encontrado: Retornar erro 404

#### UC008 - Atualizar Dados do Médico
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT
2. Receber ID e dados para atualização
3. Validar novos dados (DTOs)
4. Se senha fornecida, criptografar com bcryptjs
5. Atualizar registro no banco via Prisma
6. Retornar dados atualizados

#### UC009 - Deletar Médico
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT
2. Receber ID do médico
3. Verificar se médico existe
4. Remover médico do banco (cascade para pacientes/notificações)
5. Confirmar remoção

### 3. **Gerenciamento de Pacientes**

#### UC010 - Criar Nova Paciente Gestante
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT do médico
2. Receber dados da paciente via DTO
3. Validar campos obrigatórios (nome, EDD, doctorId)
4. Converter strings de data para objetos Date
5. Aplicar valor padrão para pregnancyStatus se não fornecido
6. Validar se médico existe (FK constraint)
7. Salvar paciente no banco com relacionamento
8. Retornar paciente criada + dados do médico

**Regras de Negócio:**
- EDD (Data Provável do Parto) é obrigatória
- assistanceDaysBeforeEDD e assistanceDaysAfterEDD devem ser ≥ 0
- color deve ser formato hexadecimal se fornecido
- Toda paciente deve estar associada a um médico

#### UC011 - Listar Pacientes
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT
2. Verificar se há filtro por doctorId
3. Consultar banco com ou sem filtro
4. Incluir dados do médico responsável (JOIN)
5. Retornar lista com relacionamentos

**Variações:**
- Sem filtro: Retorna todas as pacientes
- Com doctorId: Retorna apenas pacientes do médico específico

#### UC012 - Buscar Paciente por ID
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT
2. Receber ID da paciente
3. Consultar banco incluindo dados do médico
4. Verificar se paciente existe
5. Retornar dados completos da paciente

#### UC013 - Atualizar Dados da Paciente
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT
2. Receber ID e campos para atualização
3. Validar novos dados via DTO
4. Converter datas se fornecidas
5. Atualizar registro mantendo relacionamentos
6. Retornar paciente atualizada + dados do médico

**Campos Atualizáveis:**
- Dados pessoais (nome, babyName, telefone, cor)
- Datas (nascimento, EDD, nascimento do bebê)
- Informações médicas (paridade, status, observações)
- Configurações de assistência (dias antes/depois EDD)

#### UC014 - Deletar Paciente
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT
2. Receber ID da paciente
3. Verificar se paciente existe
4. Remover paciente do banco
5. Confirmar remoção

### 4. **Gerenciamento de Notificações**

#### UC015 - Criar Notificação
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT
2. Receber dados da notificação (doctorId, message)
3. Validar se médico destinatário existe
4. Aplicar timestamp atual automaticamente
5. Salvar notificação com relacionamento
6. Retornar notificação criada + dados do médico

#### UC016 - Listar Notificações
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT
2. Consultar todas as notificações
3. Incluir dados do médico destinatário (JOIN)
4. Ordenar por data (mais recentes primeiro)
5. Retornar lista completa

#### UC017 - Buscar Notificação por ID
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT
2. Receber ID da notificação
3. Consultar banco incluindo dados do médico
4. Verificar se notificação existe
5. Retornar dados completos

#### UC018 - Atualizar Notificação
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT
2. Receber ID e novos dados
3. Validar campos atualizáveis
4. Atualizar registro mantendo relacionamentos
5. Retornar notificação atualizada

#### UC019 - Deletar Notificação
**Ator:** Sistema Backend
**Processo:**
1. Validar autenticação JWT
2. Receber ID da notificação
3. Verificar se notificação existe
4. Remover do banco de dados
5. Confirmar remoção

### 5. **Processos de Validação e Segurança**

#### UC020 - Validar Dados de Entrada (DTOs)
**Ator:** Sistema Backend
**Processo Automático:**
1. Interceptar requisição com ValidationPipe
2. Aplicar decorators do class-validator
3. Verificar tipos, formatos e restrições
4. Sanitizar dados (whitelist)
5. Rejeitar campos não permitidos
6. Retornar erros detalhados se inválido

**Validações Aplicadas:**
- Formatos de email
- Tamanhos mínimos/máximos de strings
- Tipos de dados (string, number, date)
- Campos obrigatórios vs opcionais
- Expressões regulares para formatos específicos

#### UC021 - Gerenciar Relacionamentos de Banco
**Ator:** Sistema Backend (Prisma)
**Processo:**
1. Verificar integridade referencial (FKs)
2. Aplicar constraints automáticas
3. Gerenciar cascata em deleções
4. Manter consistência transacional
5. Aplicar índices para performance

#### UC022 - Processar Conversões de Dados
**Ator:** Sistema Backend
**Processo:**
1. Receber strings de data do JSON
2. Validar formato ISO 8601
3. Converter para objetos Date do JavaScript
4. Aplicar timezone correto
5. Persistir como timestamp no PostgreSQL

### 6. **Casos de Uso de Sistema**

#### UC023 - Inicializar Aplicação
**Ator:** Sistema Backend
**Processo:**
1. Carregar variáveis de ambiente (.env)
2. Estabelecer conexão com PostgreSQL
3. Inicializar módulos NestJS
4. Configurar middlewares globais (CORS, ValidationPipe)
5. Gerar documentação Swagger
6. Iniciar servidor HTTP na porta 3000

#### UC024 - Gerenciar Migrações de Banco
**Ator:** Sistema Backend (Prisma)
**Processo:**
1. Detectar mudanças no schema.prisma
2. Gerar arquivos SQL de migração
3. Aplicar mudanças ao banco de desenvolvimento
4. Atualizar tabela _prisma_migrations
5. Regenerar cliente Prisma

#### UC025 - Servir Documentação da API
**Ator:** Sistema Backend
**Processo:**
1. Gerar especificação OpenAPI dos endpoints
2. Incluir schemas dos DTOs automaticamente
3. Aplicar configurações de autenticação
4. Personalizar interface Swagger
5. Servir documentação em /api

## Fluxos de Dados Principais

### Fluxo de Autenticação
```
Requisição → JWT Guard → Validação Token → Decodificação → Permissão/Negação
```

### Fluxo de Criação de Entidade
```
Dados JSON → DTO Validation → Conversões → Prisma ORM → PostgreSQL → Resposta
```

### Fluxo de Consulta com Relacionamento
```
Requisição → Autenticação → Prisma Query (include) → JOIN SQL → Formatação → Resposta
```

## Regras de Negócio Críticas

### Para Pacientes Gestantes:
1. **EDD Obrigatória**: Toda gestante deve ter Data Provável do Parto
2. **Associação Médica**: Paciente deve estar vinculada a um médico existente
3. **Períodos de Assistência**: Dias antes/depois da EDD devem ser não-negativos
4. **Status Padrão**: Se não informado, status é "Em acompanhamento"

### Para Médicos:
1. **Email Único**: Não pode haver dois médicos com mesmo email
2. **Senha Segura**: Sempre criptografada, nunca retornada em responses
3. **Cascade Delete**: Remover médico remove pacientes e notificações associadas

### Para Autenticação:
1. **Token Obrigatório**: Todos os endpoints (exceto registro/login) requerem JWT
2. **Validação Contínua**: Token verificado a cada requisição
3. **Renovação Controlada**: Tokens expirados podem ser renovados se usuário existir

## Pontos de Integração

### Com Banco de Dados:
- Conexão persistente via connection pool
- Transações automáticas para operações críticas
- Índices automáticos para chaves primárias/estrangeiras

### Com Sistema de Arquivos:
- Logs de aplicação em console
- Migrações salvas em arquivos SQL
- Configurações via arquivo .env

### Com Rede:
- Servidor HTTP para receber requisições
- CORS habilitado para requisições cross-origin
- Headers de segurança aplicados automaticamente

Este documento fornece uma visão completa dos processos que acontecem exclusivamente no backend da API PregnaTrack, sem considerar qualquer interação de frontend.