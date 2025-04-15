import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { createAdminUser } from '../lib/createAdmin';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Geçersiz e-posta veya şifre');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (creatingAdmin) return;
    
    setCreatingAdmin(true);
    try {
      await createAdminUser('admin@example.com', 'admin123');
      toast.success('Admin hesabı oluşturuldu! admin@example.com ve admin123 ile giriş yapabilirsiniz');
    } catch (error: any) {
      toast.error(error.message || 'Admin hesabı oluşturulamadı');
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-sm w-full space-y-8 bg-gray-800 p-8 rounded-xl">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-bold text-white">Admin Paneli</h2>
          <p className="mt-2 text-sm text-gray-400">Menünüzü yönetmek için giriş yapın</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                E-posta adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent sm:text-sm"
                placeholder="E-posta adresi"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent sm:text-sm"
                placeholder="Şifre"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>

            {/* Create Admin Button - Remove in production */}
            <button
              type="button"
              onClick={handleCreateAdmin}
              disabled={creatingAdmin}
              className="w-full flex justify-center py-2 px-4 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingAdmin ? 'Admin Oluşturuluyor...' : 'Admin Hesabı Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};