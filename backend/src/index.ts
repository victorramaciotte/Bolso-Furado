import express from 'express';
import { prisma } from './lib/prisma.js';
import cors from 'cors'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const app = express();
app.use(express.json());
app.use(cors()) 

const JWT_SECRET = process.env.JWT_SECRET!;

// MIDDLEWARE DE AUTENTICAÇÃO
function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// REGISTRO
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// LOGIN
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Rota para Listar
app.get('/entries', authMiddleware, async (req, res) => {
  const userId = req.userId!
  const entries = await prisma.entry.findMany({
    where: { userId },
    include: { category: true}
  });
  res.json(entries);
});

// Rota para Criar
app.post('/entries', authMiddleware, async (req, res) => {
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
        user: { connect: { id: req.userId! } },
        category: { connect: { id: Number(category_id) } },
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
app.put('/entries/:id', authMiddleware, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, value, type, source, reason, status, recurrence, date, endDate, category_id } = req.body;
  
    const atualizado = await prisma.entry.update({
        where: {id, userId: req.userId!},
        data: { 
            name, 
            value, 
            type, 
            source, 
            reason, 
            status, 
            recurrence: recurrence || null, 
            category: { connect: { id: Number(category_id) } },
            ...(date && { date: new Date(date + 'T00:00:00') }),
            endDate: endDate ? new Date(endDate + 'T00:00:00') : null,
        }
  });
  console.log('category_id recebido:', category_id, typeof category_id)
  res.status(201).json(atualizado);
});

// Rota para Deletar
app.delete('/entries/:id', authMiddleware, async (req, res) => {
    try {
    const id = parseInt(req.params.id);
    await prisma.entry.delete({
      where: { id, userId: req.userId! }
    });
    res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar:', err)
    res.status(500).json({ error: String(err) })
  }
});

//GOALS//////////////////////////////////////////////////////////////////////
// Rota para Listar
app.get('/goals', authMiddleware, async (req, res) => {
  const userId = req.userId!
  const goals = await prisma.goal.findMany({where: { userId }});
  res.json(goals);
});

// Rota para Criar
app.post('/goals', authMiddleware, async (req, res) => {
  console.log('body recebido:', req.body)
  try {
    const { name, target_amount, current_amount, initial_amount, deadline } = req.body;
    
    const novo = await prisma.goal.create({
      data: { 
        name, 
        target_amount, 
        current_amount, 
        initial_amount,
        user: { connect: { id: req.userId! } }, 
        deadline: deadline? new Date(deadline + 'T00:00:00') : null,
    }
    });
    
    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar:', err)
    res.status(500).json({ error: String(err) })
  }
});

// Rota para Editar
app.put('/goals/:id', authMiddleware, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, target_amount, current_amount, initial_amount, deadline  } = req.body;
  
    const atualizado = await prisma.goal.update({
        where: {id, userId: req.userId!},
        data: { 
            name, 
            target_amount, 
            current_amount, 
            initial_amount, 
            deadline: deadline? new Date(deadline + 'T00:00:00') : null,
        }
  });
  
  res.status(201).json(atualizado);
});

// Rota para Deletar
app.delete('/goals/:id', authMiddleware, async (req, res) => {
    try {
    const id = parseInt(req.params.id);
    await prisma.goal.delete({
      where: { id, userId: req.userId! }
    });
    res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar:', err)
    res.status(500).json({ error: String(err) })
  }
});

//CATEGORIES//////////////////////////////////////////////////////////////////////
// Rota para Listar
app.get('/categories', authMiddleware, async (req, res) => {
  const userId = req.userId!
  const categories = await prisma.category.findMany({where: { userId }});
  res.json(categories);
});

// Rota para Criar
app.post('/categories', authMiddleware, async (req, res) => {
  console.log('body recebido:', req.body)
  try {
    const { name } = req.body;
    
    const novo = await prisma.category.create({data: { name, user: { connect: { id: req.userId! } } }});
    
    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar:', err)
    res.status(500).json({ error: String(err) })
  }
});

// Rota para Editar
app.put('/categories/:id', authMiddleware, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
  
    const atualizado = await prisma.category.update({
        where: {id, userId: req.userId!},
        data: { name }
  });
  
  res.status(201).json(atualizado);
});

// Rota para Deletar
app.delete('/categories/:id', authMiddleware, async (req, res) => {
    try {
    const id = parseInt(req.params.id);
    await prisma.category.delete({
      where: { id, userId: req.userId! }
    });
    res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar:', err)
    res.status(500).json({ error: String(err) })
  }
});


app.listen(3000, () => console.log("Servidor ON na porta 3000"));