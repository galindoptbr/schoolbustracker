import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const useAuth = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setIsClient(true); // Marca que o componente está montado no cliente
  }, []);

  useEffect(() => {
    if (isClient) {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setIsAuthenticated(true);
          setUser(currentUser); // Define o usuário autenticado
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [isClient]);

  useEffect(() => {
    if (!loading && !isAuthenticated && isClient) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, isClient, router]);

  return { loading, isAuthenticated, user };
};

export default useAuth;
