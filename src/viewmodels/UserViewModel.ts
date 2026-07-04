import { useState, useEffect } from 'react';
import { IUser } from '../components/ListWithFetch';
import { fetchUsers } from '../services/UserService';

export const useUserViewModel = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    console.log('📊 [UserViewModel] loadUsers called');
    console.log('📊 [UserViewModel] Setting loading = true');
    setLoading(true);
    setError(null);
    try {
      console.log('📊 [UserViewModel] Calling fetchUsers()...');
      const usersData = await fetchUsers();
      console.log('📊 [UserViewModel] fetchUsers returned:', usersData);
      console.log('📊 [UserViewModel] Number of users received:', usersData?.length || 0);
      
      console.log('📊 [UserViewModel] Calling setUsers with', usersData?.length || 0, 'users');
      setUsers(usersData);
      console.log('📊 [UserViewModel] Users state updated');
    } catch (e) {
      console.error('📊 [UserViewModel] Error caught:', e);
      const errorMsg = 'Failed to fetch users.';
      console.log('📊 [UserViewModel] Setting error:', errorMsg);
      setError(errorMsg);
    } finally {
      console.log('📊 [UserViewModel] Setting loading = false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('📊 [UserViewModel] useEffect hook triggered');
    loadUsers();
  }, []);

  console.log('📊 [UserViewModel] Rendering with state:', { usersCount: users.length, loading, hasError: !!error });

  return { users, loading, error, loadUsers };
};
