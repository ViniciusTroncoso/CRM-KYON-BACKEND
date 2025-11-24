import { Router, Request, Response } from 'express';
import authService from '../services/auth.service';

const router = Router();

// POST /api/auth/login - Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email e senha são obrigatórios' });
    }

    const result = await authService.login(email, password);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
});

// POST /api/auth/logout - Logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(400).json({ success: false, error: 'Token não fornecido' });
    }

    await authService.logout(token);
    res.json({ success: true, message: 'Logout realizado com sucesso' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/auth/me - Validar token e obter usuário atual
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'Token não fornecido' });
    }

    const user = await authService.validateToken(token);
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
});

// POST /api/auth/create-user - Criar usuário e enviar credenciais (apenas Admin)
router.post('/create-user', async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;
    
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, error: 'Nome, email e role são obrigatórios' });
    }

    // Gerar senha aleatória
    const password = authService.generateRandomPassword();
    
    // Criar usuário
    const result = await authService.createUser(name, email, role, password);
    
    // Enviar email com credenciais (log no console)
    await authService.sendCredentialsEmail(email, password, name);
    
    res.json({ 
      success: true, 
      data: result.user,
      password: result.password,
      message: 'Usuário criado com sucesso'
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
