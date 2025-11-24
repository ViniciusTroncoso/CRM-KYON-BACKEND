import { Router, Request, Response } from 'express';
import leadsService from '../services/leads.service';

const router = Router();

// GET /api/leads - Listar todos os leads (com filtros opcionais)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, owner, sdrName } = req.query;
    const leads = await leadsService.getAll({
      startDate: startDate as string,
      endDate: endDate as string,
      owner: owner as string,
      sdrName: sdrName as string
    });
    res.json({ success: true, data: leads });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/leads/:id - Buscar lead por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const lead = await leadsService.getById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/leads - Criar novo lead
router.post('/', async (req: Request, res: Response) => {
  try {
    const lead = await leadsService.create(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PATCH /api/leads/:id - Atualizar lead
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const lead = await leadsService.update(req.params.id, req.body);
    res.json({ success: true, data: lead });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/leads/:id - Deletar lead
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await leadsService.delete(req.params.id);
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
