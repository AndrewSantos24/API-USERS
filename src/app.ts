import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Definição de tipos para o corpo da requisição
interface UserRequestBody {
  email: string;
  name: string;
  age: string;
}

app.post('/usuarios', async (req: Request<{}, {}, UserRequestBody>, res: Response) => {
  const { email, name, age } = req.body;
  await prisma.user.create({
    data: {
      email,
      name,
      age,
    },
  });
  res.status(201).json(req.body);
});

app.get('/usuarios', async (req: Request, res: Response) => {
  const { name, email, age } = req.query;
  
  // Construa o filtro dinamicamente
  const filter: any = {};
  
  if (name) {
    filter.name = name;
  }
  if (email) {
    filter.email = email;
  }
  if (age) {
    filter.age = String(age as string);
  }

  try {
    // Se não houver filtros, o objeto `filter` será vazio e retornará todos os usuários
    const users = await prisma.user.findMany({
      where: Object.keys(filter).length > 0 ? filter : undefined,
    });
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

app.put('/usuarios/:id', async (req: Request<{ id: string }, {}, UserRequestBody>, res: Response) => {
  const { id } = req.params;
  const { email, name, age } = req.body;
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      email,
      name,
      age,
    },
  });
  res.status(201).json(req.body);
});

app.delete('/usuarios/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: {
      id,
    },
  });
  res.status(200).json({ message: "Usuário deletado com sucesso!" });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
