import { Router, Request, Response } from 'express';
import activityLogsService from '../services/activity-logs.service';

const router = Router();

// GET /api/activity-logs - Listar todos os logs (com filtros opcionais)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, userId, entityType, action } = req.query;
    const logs = await activityLogsService.getAll({
      startDate: startDate as string,
      endDate: endDate as string,
      userId: userId as string,
      entityType: entityType as string,
      action: action as string
    });
    res.json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/activity-logs/:id - Buscar log por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const log = await activityLogsService.getById(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, error: 'Log not found' });
    }
    res.json({ success: true, data: log });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/activity-logs - Criar novo log
router.post('/', async (req: Request, res: Response) => {
  try {
    const log = await activityLogsService.create(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/activity-logs/:id - Deletar log
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await activityLogsService.delete(req.params.id);
    res.json({ success: true, message: 'Log deleted' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
