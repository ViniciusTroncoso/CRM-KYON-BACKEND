import { Router, Request, Response } from 'express';
import sdrLogsService from '../services/sdr-logs.service';

const router = Router();

// GET /api/sdr-logs - Listar todos os logs (com filtros opcionais)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, sdrName } = req.query;
    const logs = await sdrLogsService.getAll({
      startDate: startDate as string,
      endDate: endDate as string,
      sdrName: sdrName as string
    });
    res.json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/sdr-logs/:id - Buscar log por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const log = await sdrLogsService.getById(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, error: 'Log not found' });
    }
    res.json({ success: true, data: log });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/sdr-logs - Criar novo log
router.post('/', async (req: Request, res: Response) => {
  try {
    const log = await sdrLogsService.create(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PATCH /api/sdr-logs/:id - Atualizar log
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const log = await sdrLogsService.update(req.params.id, req.body);
    res.json({ success: true, data: log });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/sdr-logs/:id - Deletar log
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await sdrLogsService.delete(req.params.id);
    res.json({ success: true, message: 'Log deleted' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
