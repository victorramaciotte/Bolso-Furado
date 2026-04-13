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
  console.log('body recebido:', req.body)
  try {
    const { nome, valor, tipo, origem, motivacao, status, recorrencia, data, dataFR, categoria } = req.body;
    
    const novo = await prisma.lancamento.create({
      data: { 
        nome, 
        valor, 
        tipo, 
        origem, 
        motivacao, 
        status, 
        recorrencia, 
        categoria,
        ...(data && { data: new Date(data) }),
        ...(dataFR && { dataFR: new Date(dataFR) }), 
    }
    });
    
    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar:', err)
    res.status(500).json({ error: String(err) })
  }
});

// Rota para Editar
app.put('/lancamentos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, valor, tipo, origem, motivacao, status, recorrencia, data, dataFR, categoria } = req.body;
  
    const atualizado = await prisma.lancamento.update({
        where: {id},
        data: { 
            nome, 
            valor, 
            tipo, 
            origem, 
            motivacao, 
            status, 
            recorrencia, 
            categoria,
            ...(data && { data: new Date(data) }),
            ...(dataFR && { dataFR: new Date(dataFR) }),
        }
  });
  
  res.status(201).json(atualizado);
});

// Rota para Deletar
app.delete('/lancamentos/:id', async (req, res) => {
    try {
    const id = parseInt(req.params.id);
    await prisma.lancamento.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar:', err)
    res.status(500).json({ error: String(err) })
  }
});


app.listen(3000, () => console.log("Servidor ON na porta 3000"));