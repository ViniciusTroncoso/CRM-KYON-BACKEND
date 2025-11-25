import { Router, Request, Response } from 'express';
import teamService from '../services/team.service';

const router = Router();

// GET /api/team - Listar todos os membros
router.get('/', async (_req: Request, res: Response) => {
  try {
    const members = await teamService.getAll();
    res.json({ success: true, data: members });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/team/:id - Buscar membro por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const member = await teamService.getById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }
    res.json({ success: true, data: member });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/team - Criar novo membro
router.post('/', async (req: Request, res: Response) => {
  try {
    const member = await teamService.create(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PATCH /api/team/:id - Atualizar membro
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const member = await teamService.update(req.params.id, req.body);
    res.json({ success: true, data: member });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/team/:id - Deletar membro
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await teamService.delete(req.params.id);
    res.json({ success: true, message: 'Member deleted' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/team/:id/toggle - Toggle ativo/inativo
router.post('/:id/toggle', async (req: Request, res: Response) => {
  try {
    const member = await teamService.toggleStatus(req.params.id);
    res.json({ success: true, data: member });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PATCH /api/team/:id/role - Atualizar role do membro
router.patch('/:id/role', async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    
    if (!role || !['Admin', 'Closer', 'SDR'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    const member = await teamService.updateRole(req.params.id, role);
    res.json({ success: true, data: member });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
