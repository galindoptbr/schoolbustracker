import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UserData {
  name?: string;
  email?: string;
}

const useAuth = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    setIsClient(true); // Marca que o componente está montado no cliente
  }, []);

  useEffect(() => {
    if (isClient) {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setIsAuthenticated(true);
          setUser(currentUser);

          // Buscar dados adicionais do usuário na coleção do Firestore
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data() as UserData);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setUserData(null);
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

  return { loading, isAuthenticated, user, userData };
};

export default useAuth;
