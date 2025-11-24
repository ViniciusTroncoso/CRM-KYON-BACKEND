import { Router, Request, Response } from 'express';

const router = Router();

// Placeholder para integração futura com Meta Ads
// Este arquivo será expandido quando implementarmos o OAuth completo

router.get('/login', (_req: Request, res: Response) => {
  res.json({ 
    success: false, 
    message: 'Meta OAuth not implemented yet. Configure META_APP_ID and META_APP_SECRET in .env' 
  });
});

router.get('/callback', (_req: Request, res: Response) => {
  res.json({ 
    success: false, 
    message: 'Meta OAuth callback not implemented yet' 
  });
});

export default router;
