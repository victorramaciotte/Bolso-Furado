import express from 'express';
import { prisma } from './lib/prisma.js';
import cors from 'cors'


const app = express();
app.use(express.json());
app.use(cors()) 


// Rota para Listar
app.get('/lancamentos', async (req, res) => {
  const lancamentos = await prisma.lancamento.findMany();
  res.json(lancamentos);
});

// Rota para Criar
app.post('/lancamentos', async (req, res) => {
  const { nome, valor, tipo, status, recorrencia } = req.body;
  
  const novo = await prisma.lancamento.create({
    data: { nome, valor, tipo, status, recorrencia }
  });
  
  res.status(201).json(novo);
});

app.listen(3000, () => console.log("Servidor ON na porta 3000"));