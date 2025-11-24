import { Router, Request, Response } from 'express';
import marketingService from '../services/marketing.service';

const router = Router();

// GET /api/marketing - Listar todos os dados de marketing (com filtros opcionais)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, platform } = req.query;
    const data = await marketingService.getAll({
      startDate: startDate as string,
      endDate: endDate as string,
      platform: platform as string
    });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/marketing/:id - Buscar item por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const item = await marketingService.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Marketing data not found' });
    }
    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/marketing - Criar novo item
router.post('/', async (req: Request, res: Response) => {
  try {
    const item = await marketingService.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/marketing/bulk - Criar múltiplos itens (para sync do Facebook)
router.post('/bulk', async (req: Request, res: Response) => {
  try {
    const items = await marketingService.bulkCreate(req.body);
    res.status(201).json({ success: true, data: items, count: items.length });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PATCH /api/marketing/:id - Atualizar item
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const item = await marketingService.update(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/marketing/:id - Deletar item
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await marketingService.delete(req.params.id);
    res.json({ success: true, message: 'Marketing data deleted' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
