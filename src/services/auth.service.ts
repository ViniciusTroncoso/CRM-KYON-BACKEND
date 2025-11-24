import { supabaseAdmin } from '../config/supabase';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export class AuthService {
  private readonly SALT_ROUNDS = 10;
  private readonly TOKEN_EXPIRY_HOURS = 24;

  async login(email: string, password: string): Promise<LoginResponse> {
    // Buscar usuário por email
    const { data: user, error } = await supabaseAdmin
      .from('team_members')
      .select('*')
      .eq('email', email)
      .eq('active', true)
      .single();

    if (error || !user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token de sessão
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.TOKEN_EXPIRY_HOURS);

    // Salvar sessão
    await supabaseAdmin
      .from('user_sessions')
      .insert([{
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString()
      }]);

    // Atualizar last_login
    await supabaseAdmin
      .from('team_members')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async validateToken(token: string): Promise<any> {
    const { data: session, error } = await supabaseAdmin
      .from('user_sessions')
      .select('*, team_members(*)')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !session) {
      throw new Error('Token inválido ou expirado');
    }

    return session.team_members;
  }

  async logout(token: string): Promise<void> {
    await supabaseAdmin
      .from('user_sessions')
      .delete()
      .eq('token', token);
  }

  async createUser(name: string, email: string, role: string, password: string): Promise<{ user: any; password: string }> {
    // Hash da senha
    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Criar usuário
    const { data, error } = await supabaseAdmin
      .from('team_members')
      .insert([{
        name,
        email,
        role,
        password_hash: passwordHash,
        active: true,
        individual_goal: 0
      }])
      .select()
      .single();

    if (error) throw error;
    return { user: data, password };
  }

  async sendCredentialsEmail(email: string, password: string, name: string): Promise<void> {
    // TODO: Implementar envio de email real
    // Por enquanto, apenas log
    console.log(`
      ========================================
      CREDENCIAIS DE ACESSO
      ========================================
      Nome: ${name}
      Email: ${email}
      Senha: ${password}
      
      Acesse: http://localhost:3000
      ========================================
    `);
  }

  generateRandomPassword(): string {
    return crypto.randomBytes(8).toString('hex');
  }
}

export default new AuthService();
