# 💸 Bolso Furado

Aplicativo web de **finanças pessoais** com foco em dispositivos móveis (Mobile-First), desenvolvido como projeto acadêmico no curso de Sistemas de Informação.

---

## 📌 Sobre o Projeto

O Bolso Furado funciona como uma carteira digital onde o usuário pode visualizar, registrar e organizar seus lançamentos financeiros (entradas e saídas) de forma clara e intuitiva. O design segue uma paleta neutra em tons de cinza frio, priorizando legibilidade e simplicidade.

---

## 🛠️ Tecnologias Utilizadas

### Front-end
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- TypeScript
- CSS Modular (por componente)
- [Flaticon Uicons](https://www.flaticon.com/uicons) — biblioteca de ícones

### Back-end
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- Banco de dados relacional via Prisma

---

## 📁 Estrutura do Projeto

```
📁 front/
├── src/
│   ├── features/
│   │   └── Lancamentos/
│   │       ├── Lancamento.tsx
│   │       ├── Lancamento.css
│   │       ├── ListaLancamentos.tsx
│   │       ├── ListaLancamentos.css
│   │       ├── ModalNovoLancamento.tsx
│   │       └── ModalNovoLancamento.css
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
└── .env

📁 back/
├── src/
│   ├── lib/
│   │   └── prisma.ts
│   └── server.ts
├── prisma/
│   └── schema.prisma
└── .env
```

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado
- Gerenciador de pacotes (npm ou yarn)

### Back-end

```bash
cd back
npm install
npx prisma migrate dev
npm run dev
```

O servidor iniciará em `http://localhost:3000`.

### Front-end

```bash
cd front
npm install
npm run dev
```

O app iniciará em `http://localhost:5173`.

### Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `front/` com o seguinte conteúdo:

```env
VITE_API_URL=http://localhost:3000
```

---

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/lancamentos` | Lista todos os lançamentos |
| POST | `/lancamentos` | Cria um novo lançamento |

### Exemplo de corpo para POST `/lancamentos`

```json
{
  "nome": "Academia",
  "valor": 120.00,
  "tipo": "saida",
  "status": "Pago",
  "recorrencia": "2025-02-01",
  "origem": "Salário",
  "categoria": "Saúde",
  "motivacao": "Necessidade"
}
```

---

## 🗃️ Model do Banco de Dados

```prisma
model Lancamento {
  id          Int       @id @default(autoincrement())
  nome        String
  valor       Float
  origem      String?
  tipo        String
  motivacao   String?
  status      String
  recorrencia String
  data        DateTime  @default(now())
  dataFR      DateTime?
  categoria   String?
}
```

---



## 👨‍💻 Autores


Desenvolvido como projeto acadêmico no curso de **Sistemas de Informação**.