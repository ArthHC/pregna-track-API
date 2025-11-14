# 🔄 Novos Endpoints de Autenticação

## ✅ Endpoints Implementados

### 1. 🔄 POST /auth/refresh
**Renovar Token JWT**

Permite renovar um token JWT expirado ou próximo do vencimento.

**Request:**
```bash
POST http://localhost:3000/auth/refresh
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "joao.silva@email.com",
    "name": "Dr. João",
    "surname": "Silva"
  }
}
```

### 2. 👤 GET /auth/me
**Buscar Médico Logado**

Retorna dados completos do médico atualmente autenticado.

**Request:**
```bash
GET http://localhost:3000/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Dr. João",
  "surname": "Silva", 
  "email": "joao.silva@email.com",
  "dateOfBirth": "1985-03-15T00:00:00.000Z",
  "parity": null
}
```

### 3. 🔐 PATCH /auth/change-password
**Alterar Senha**

Permite alterar a senha do médico fornecendo a senha atual e nova senha.

**Request:**
```bash
PATCH http://localhost:3000/auth/change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "currentPassword": "senhaAtual123",
  "newPassword": "novaSenha456"
}
```

**Response (200 OK):**
```json
{
  "message": "Senha alterada com sucesso",
  "timestamp": "2025-10-20T14:30:00.000Z"
}
```

## 🧪 Exemplos cURL

### Refresh Token
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### Get Current Doctor
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Change Password
```bash
curl -X PATCH http://localhost:3000/auth/change-password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "admin123",
    "newPassword": "novasenha123"
  }'
```

## 🔒 Validações Implementadas

### RefreshTokenDto
- **token**: Deve ser um JWT válido (validação @IsJWT)

### ChangePasswordDto
- **currentPassword**: Mínimo 6 caracteres, não pode estar vazio
- **newPassword**: Mínimo 6 caracteres, deve ser diferente da senha atual

## ⚡ Funcionalidades

### Refresh Token
- ✅ Decodifica token mesmo se expirado
- ✅ Verifica se o médico ainda existe no sistema
- ✅ Gera novo token com mesmos dados do usuário
- ✅ Retorna dados atualizados do médico

### Get Current Doctor  
- ✅ Busca dados completos do médico logado
- ✅ Remove senha dos dados retornados
- ✅ Baseado no ID do token JWT

### Change Password
- ✅ Verifica senha atual com bcrypt
- ✅ Impede usar mesma senha atual como nova
- ✅ Hash seguro da nova senha (bcrypt salt 10)
- ✅ Atualização segura no banco de dados

## 🛡️ Segurança

- **Autenticação obrigatória** para /me e /change-password
- **Validação de senha atual** antes da alteração
- **Hash seguro** com bcrypt salt rounds 10
- **Verificação de existência** do usuário no refresh
- **Token validation** robusto com tratamento de erros

## 📚 Documentação Swagger

Todos os endpoints estão documentados no Swagger UI:
- **Exemplos interativos** para cada endpoint
- **Esquemas de validação** detalhados
- **Códigos de resposta** com exemplos
- **Autenticação JWT** integrada na interface

**Acesse:** http://localhost:3000/api

---
**✨ Endpoints implementados com sucesso! A API de autenticação está agora completa.**