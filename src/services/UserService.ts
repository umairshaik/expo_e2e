import axios from 'axios';
import { BASE_URL } from '../config/environment';
import { IUser } from '../components/ListWithFetch';

export const fetchUsers = async (): Promise<IUser[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
