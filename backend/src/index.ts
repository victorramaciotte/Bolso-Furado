import express from 'express';
import { prisma } from './lib/prisma.js';
import cors from 'cors'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import { sendEmail } from './lib/mailer.js'


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

// RECUPERAÇÃO DE CONTA
function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

// SOLICITAR RECUPERAÇÃO DE SENHA
app.post('/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.json({ message: 'Se o email existir, um link foi enviado' })
    }

    const resetToken = generateToken()
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 30)

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    })

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`
    await sendEmail(
      email,
      'Recuperação de senha — Bolso Furado',
      `<p>Clique <a href="${resetUrl}">aqui</a> para redefinir sua senha. O link expira em 30 minutos.</p>`
    )

    res.json({ message: 'Se o email existir, um link foi enviado' })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// REDEFINIR SENHA
app.post('/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }
      }
    })

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    res.json({ message: 'Senha redefinida com sucesso!' })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

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
  
  const categories = await prisma.category.findMany({
      where: { 
        OR: [
        { userId: null},      
        { userId: req.userId!}
      ] 
    }
  })
  res.json(categories);
});

// Rota para Criar
function normalizeCategoryName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

app.post('/categories', authMiddleware, async (req, res) => {
  console.log('body recebido:', req.body)
  try {
    const { name } = req.body;
    const normalizedName = normalizeCategoryName(name)
    
    const exists = await prisma.category.findFirst({
      where: {
        normalizedName,
        OR: [
          { userId: null },        
          { userId: req.userId! }  
        ]
      }
    })

    if (exists) {
      return res.status(409).json({ error: 'Categoria já existe' });
    }

    const novo = await prisma.category.create({
      data: {
        name,
        user: { connect: { id: req.userId! } }
      }
    })
    
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


//ACCOUNT//////////////////////////////////////////////////////////////////////

function getCurrentMonthRange() {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  return { startDate, endDate }
}

app.get('/account/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!
    const { startDate, endDate } = getCurrentMonthRange()

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { initialBalance: true }
    })

    const entries = await prisma.entry.findMany({
      where: { userId },
      select: { value: true, type: true }
    })

    const goals = await prisma.goal.findMany({
      where: { userId },
      select: { current_amount: true }
    })

    const budget = await prisma.budget.findFirst({
      where: {
        userId,
        periodType: 'month',
        startDate,
        endDate
      },
      include: {
        categories: {
          include: { category: true }
        }
      }
    })

    const totalIncome = entries
      .filter(entry => entry.type === 'income')
      .reduce((sum, entry) => sum + entry.value, 0)

    const totalExpenses = entries
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + entry.value, 0)

    const totalGoals = goals.reduce((sum, goal) => sum + goal.current_amount, 0)

    const availableBalance =
      (user?.initialBalance ?? 0) + totalIncome - totalExpenses - totalGoals

    res.json({
      initialBalance: user?.initialBalance ?? 0,
      availableBalance,
      budgetAmount: budget?.amount ?? 0,
      categoryLimits: budget?.categories.map(item => ({
        categoryId: item.categoryId,
        categoryName: item.category.name,
        amount: item.amount
      })) ?? []
    })
  } catch (err) {
    console.error('Erro ao buscar resumo da conta:', err)
    res.status(500).json({ error: String(err) })
  }
})

app.put('/account/settings', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!
    const { initialBalance, budgetAmount, categoryLimits } = req.body
    const { startDate, endDate } = getCurrentMonthRange()

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { initialBalance: Number(initialBalance || 0) }
      })

      const existingBudget = await tx.budget.findFirst({
        where: {
          userId,
          periodType: 'month',
          startDate,
          endDate
        }
      })

      const budget = existingBudget
        ? await tx.budget.update({
            where: { id: existingBudget.id },
            data: { amount: Number(budgetAmount || 0) }
          })
        : await tx.budget.create({
            data: {
              userId,
              name: 'Orçamento mensal',
              periodType: 'month',
              startDate,
              endDate,
              amount: Number(budgetAmount || 0)
            }
          })

      await tx.categoryBudget.deleteMany({
        where: { budgetId: budget.id }
      })

      if (Array.isArray(categoryLimits) && categoryLimits.length > 0) {
        await tx.categoryBudget.createMany({
          data: categoryLimits.map((limit: { categoryId: number; amount: number }) => ({
            budgetId: budget.id,
            categoryId: Number(limit.categoryId),
            amount: Number(limit.amount || 0)
          }))
        })
      }

      return budget
    })

    res.json(result)
  } catch (err) {
    console.error('Erro ao salvar configurações da conta:', err)
    res.status(500).json({ error: String(err) })
  }
})


app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000')
})