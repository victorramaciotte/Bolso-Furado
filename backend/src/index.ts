import express from 'express';
import { prisma } from './lib/prisma.js';
import cors from 'cors'


const app = express();
app.use(express.json());
app.use(cors()) 


// Rota para Listar
app.get('/entries', async (req, res) => {
  const entries = await prisma.entry.findMany();
  res.json(entries);
});

// Rota para Criar
app.post('/entries', async (req, res) => {
  console.log('body recebido:', req.body)
  try {
    const { name, value, type, source, reason, status, recurrence, date, endDate, category } = req.body;
    
    const novo = await prisma.entry.create({
      data: { 
        name, 
        value, 
        type, 
        source, 
        reason, 
        status, 
        recurrence, 
        category,
        ...(date && { date: new Date(date) }),
        ...(endDate && { endDate: new Date(endDate) }), 
    }
    });
    
    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar:', err)
    res.status(500).json({ error: String(err) })
  }
});

// Rota para Editar
app.put('/entries/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, value, type, source, reason, status, recurrence, date, endDate, category } = req.body;
  
    const atualizado = await prisma.entry.update({
        where: {id},
        data: { 
            name, 
            value, 
            type, 
            source, 
            reason, 
            status, 
            recurrence, 
            category,
            ...(date && { date: new Date(date) }),
            ...(endDate && { endDate: new Date(endDate) }),
        }
  });
  
  res.status(201).json(atualizado);
});

// Rota para Deletar
app.delete('/entries/:id', async (req, res) => {
    try {
    const id = parseInt(req.params.id);
    await prisma.entry.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar:', err)
    res.status(500).json({ error: String(err) })
  }
});


app.listen(3000, () => console.log("Servidor ON na porta 3000"));