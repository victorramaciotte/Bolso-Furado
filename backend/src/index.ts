import express from 'express';
import { prisma } from './lib/prisma.js';
import cors from 'cors'


const app = express();
app.use(express.json());
app.use(cors()) 


// Rota para Listar
app.get('/entries', async (req, res) => {
  const entries = await prisma.entry.findMany({
    include: { category: true}
  });
  res.json(entries);
});

// Rota para Criar
app.post('/entries', async (req, res) => {
  console.log('body recebido:', req.body)
  try {
    const { name, value, type, source, reason, status, recurrence, date, endDate, category_id } = req.body;
    
    const novo = await prisma.entry.create({
      data: { 
        name, 
        value, 
        type, 
        source, 
        reason, 
        status, 
        recurrence, 
        category_id,
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
    const { name, value, type, source, reason, status, recurrence, date, endDate, category_id } = req.body;
  
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
            category_id,
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

//GOALS//////////////////////////////////////////////////////////////////////
// Rota para Listar
app.get('/goals', async (req, res) => {
  const goals = await prisma.goal.findMany();
  res.json(goals);
});

// Rota para Criar
app.post('/goals', async (req, res) => {
  console.log('body recebido:', req.body)
  try {
    const { name, target_amount, current_amount, initial_amount, deadline } = req.body;
    
    const novo = await prisma.goal.create({
      data: { 
        name, 
        target_amount, 
        current_amount, 
        initial_amount, 
        ...(deadline && { deadline: new Date(deadline) }),
    }
    });
    
    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar:', err)
    res.status(500).json({ error: String(err) })
  }
});

// Rota para Editar
app.put('/goals/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, target_amount, current_amount, initial_amount, deadline  } = req.body;
  
    const atualizado = await prisma.goal.update({
        where: {id},
        data: { 
            name, 
            target_amount, 
            current_amount, 
            initial_amount, 
            ...(deadline && { deadline: new Date(deadline) }),
        }
  });
  
  res.status(201).json(atualizado);
});

// Rota para Deletar
app.delete('/goals/:id', async (req, res) => {
    try {
    const id = parseInt(req.params.id);
    await prisma.goal.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar:', err)
    res.status(500).json({ error: String(err) })
  }
});

//CATEGORIES//////////////////////////////////////////////////////////////////////
// Rota para Listar
app.get('/categories', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// Rota para Criar
app.post('/categories', async (req, res) => {
  console.log('body recebido:', req.body)
  try {
    const { name } = req.body;
    
    const novo = await prisma.category.create(name);
    
    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar:', err)
    res.status(500).json({ error: String(err) })
  }
});

// Rota para Editar
app.put('/categories/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
  
    const atualizado = await prisma.category.update({
        where: {id},
        data: { name }
  });
  
  res.status(201).json(atualizado);
});

// Rota para Deletar
app.delete('/categories/:id', async (req, res) => {
    try {
    const id = parseInt(req.params.id);
    await prisma.category.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar:', err)
    res.status(500).json({ error: String(err) })
  }
});


app.listen(3000, () => console.log("Servidor ON na porta 3000"));