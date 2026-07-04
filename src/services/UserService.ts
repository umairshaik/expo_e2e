import axios from 'axios';
import { BASE_URL } from '../config/environment';
import { IUser } from '../components/ListWithFetch';

export const fetchUsers = async (): Promise<IUser[]> => {
  try {
    console.log('🚀 [UserService] Starting fetchUsers...');
    console.log('📍 [UserService] Fetching from URL:', `${BASE_URL}/users`);
    
    const response = await axios.get(`${BASE_URL}/users`);
    
    console.log('✅ [UserService] Response received:', response.status, response.statusText);
    console.log('📦 [UserService] Response data:', response.data);
    console.log('👥 [UserService] Number of users:', response.data.users?.length || 0);
    
    if (response.data.users && response.data.users.length > 0) {
      console.log('🎯 [UserService] First user:', response.data.users[0]);
    }
    
    return response.data.users;
  } catch (error) {
    console.error('❌ [UserService] Error fetching users:', error);
    if (axios.isAxiosError(error)) {
      console.error('   Status:', error.response?.status);
      console.error('   Data:', error.response?.data);
      console.error('   Message:', error.message);
    }
    throw error;
  }
};
