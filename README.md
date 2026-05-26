# 💸 Bolso Furado

Aplicativo web de **finanças pessoais** com foco em dispositivos móveis (Mobile-First), desenvolvido como projeto acadêmico no curso de Sistemas de Informação.

---

## 📌 Sobre o Projeto

O Bolso Furado é uma carteira digital onde o usuário pode registrar, visualizar e organizar seus lançamentos financeiros (entradas e saídas), definir metas de poupança e acompanhar o progresso. O sistema conta com autenticação própria, categorização de lançamentos e suporte a recorrência.

O design segue uma paleta baseada em teal com tons de cinza frio, com suporte a **light mode** e **dark mode**, priorizando legibilidade e simplicidade.

---

## 🛠️ Tecnologias Utilizadas

### Front-end
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- TypeScript
- [Axios](https://axios-http.com/) — cliente HTTP
- [react-number-format](https://s-yadav.github.io/react-number-format/) — formatação monetária
- [Flaticon Uicons](https://www.flaticon.com/uicons) — biblioteca de ícones
- CSS por componente

### Back-end
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- TypeScript
- [Prisma ORM](https://www.prisma.io/) — banco de dados SQLite
- [bcrypt](https://www.npmjs.com/package/bcrypt) — hash de senhas
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) — autenticação via JWT
- [cors](https://www.npmjs.com/package/cors) — controle de origens

---

## 📁 Estrutura do Projeto

```
📁 frontend/
├── src/
│   ├── components/
│   │   └── FAB.tsx
│   ├── constants/
│   │   └── endpoints.ts
│   ├── contexts/
│   ├── features/
│   │   ├── Entries/
│   │   │   ├── Entry.tsx / Entry.css
│   │   │   ├── ListEntries.tsx / ListEntries.css
│   │   │   └── ModalEntry.tsx / ModalEntry.css
│   │   └── Goals/
│   │       ├── Goal.tsx / Goal.css
│   │       ├── ListGoals.tsx
│   │       └── ModalGoal.tsx
│   ├── hooks/
│   │   └── useIsMobile.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── financeService.ts
│   │   └── goalService.ts
│   ├── views/
│   │   ├── AccountCard.tsx
│   │   ├── AuthView.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FinanceView.tsx
│   │   ├── GoalsView.tsx
│   │   └── AnalyticsView.tsx
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
└── .env

📁 backend/
├── src/
│   ├── lib/
│   │   └── prisma.ts
│   ├── types/
│   │   └── express.d.ts
│   └── index.ts
├── prisma/
│   └── schema.prisma
└── .env
```

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado
- npm ou yarn

### Back-end

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

O servidor iniciará em `http://localhost:3000`.

### Front-end

```bash
cd frontend
npm install
npm run dev
```

O app iniciará em `http://localhost:5173`.

### Variáveis de Ambiente

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:3000
```

**`backend/.env`**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=sua_chave_secreta_aqui
```

> Para gerar uma chave segura para o JWT:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

## 🔌 Endpoints da API

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST  | `/auth/register` | Registra novo usuário |
| POST | `/auth/login` | Autentica e retorna token JWT |

> As demais rotas exigem o header: `Authorization: Bearer <token>`

### Lançamentos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/entries` | Lista lançamentos do usuário |
| POST | `/entries` | Cria novo lançamento |
| PUT | `/entries/:id` | Atualiza lançamento |
| DELETE | `/entries/:id` | Remove lançamento |

### Metas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/goals` | Lista metas do usuário |
| POST | `/goals` | Cria nova meta |
| PUT | `/goals/:id` | Atualiza meta |
| DELETE | `/goals/:id` | Remove meta |

### Categorias
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/categories` | Lista categorias do usuário |
| POST | `/categories` | Cria nova categoria |
| PUT | `/categories/:id` | Atualiza categoria |
| DELETE | `/categories/:id` | Remove categoria |

---

## 🗃️ Modelos do Banco de Dados

```prisma
model User {
  id         Int        @id @default(autoincrement())
  name       String
  email      String     @unique
  password   String
  entries    Entry[]
  goals      Goal[]
  categories Category[]
}

model Entry {
  id          Int       @id @default(autoincrement())
  name        String
  value       Float
  source      String?
  type        String
  reason      String?
  status      String
  recurrence  String?
  date        DateTime  @default(now())
  endDate     DateTime?
  category    Category  @relation(fields: [category_id], references: [id])
  category_id Int
  user        User      @relation(fields: [userId], references: [id])
  userId      Int
}

model Goal {
  id             Int       @id @default(autoincrement())
  name           String
  target_amount  Float
  current_amount Float
  initial_amount Float
  deadline       DateTime?
  user           User      @relation(fields: [userId], references: [id])
  userId         Int
}

model Category {
  id      Int     @id @default(autoincrement())
  name    String
  entries Entry[]
  user    User    @relation(fields: [userId], references: [id])
  userId  Int
}
```

---

## 👨‍💻 Autores

- [Victor Ramaciotte](https://github.com/victorramaciotte)
- [Jemyma Matos](https://github.com/JKesly)

Desenvolvido como projeto acadêmico no curso de **Sistemas de Informação**.