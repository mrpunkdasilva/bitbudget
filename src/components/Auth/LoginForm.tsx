import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../NotificationManager';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onRegisterClick,
  onForgotPasswordClick,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { error } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      error('Por favor, preencha todos os campos');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Login failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Seu email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="auth-links">
        <button type="button" className="btn-link" onClick={onForgotPasswordClick}>
          Esqueceu a senha?
        </button>

        <button type="button" className="btn-link" onClick={onRegisterClick}>
          Não tem uma conta? Registre-se
        </button>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../NotificationManager';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onRegisterClick,
  onForgotPasswordClick,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { error } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      error('Por favor, preencha todos os campos');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Login failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Seu email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="auth-links">
        <button type="button" className="btn-link" onClick={onForgotPasswordClick}>
          Esqueceu a senha?
        </button>

        <button type="button" className="btn-link" onClick={onRegisterClick}>
          Não tem uma conta? Registre-se
        </button>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../NotificationManager';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onRegisterClick,
  onForgotPasswordClick,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { error } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      error('Por favor, preencha todos os campos');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Login failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Seu email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="auth-links">
        <button type="button" className="btn-link" onClick={onForgotPasswordClick}>
          Esqueceu a senha?
        </button>

        <button type="button" className="btn-link" onClick={onRegisterClick}>
          Não tem uma conta? Registre-se
        </button>
      </div>
    </div>
  );
};
