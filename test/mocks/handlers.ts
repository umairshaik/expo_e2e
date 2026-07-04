import { http, HttpResponse } from 'msw';
import mockedApiResponse from './mockedApiResponse.json';

export const handlers = [
  // Handle both development (localhost) and production (dummyjson.com) URLs
  http.get('https://dummyjson.com/users', ({ request }) => {
    console.log('🎭 MSW: Serving mocked users data for dummyjson.com');
    console.log('🔗 Request URL:', request.url);
    console.log('📊 Returning', mockedApiResponse.users.length, 'users from mock data');
    console.log('🔥 First user in mock data:', mockedApiResponse.users[0]?.firstName, mockedApiResponse.users[0]?.lastName);
    return HttpResponse.json(mockedApiResponse);
  }),
  
  http.get('*/users', ({ request }) => {
    console.log('🎭 MSW: Serving mocked users data (wildcard pattern)');
    console.log('🔗 Request URL:', request.url);
    console.log('📊 Returning', mockedApiResponse.users.length, 'users from mock data');
    console.log('🔥 First user in mock data:', mockedApiResponse.users[0]?.firstName, mockedApiResponse.users[0]?.lastName);
    return HttpResponse.json(mockedApiResponse);
  }),
  
  // Handle specific user endpoint
  http.get('*/users/:id', ({ request, params }) => {
    console.log('🎭 MSW: Serving mocked single user data');
    const userId = Number(params.id);
    const user = mockedApiResponse.users.find(u => u.id === userId);
    
    if (user) {
      console.log('👤 Found user:', user.firstName, user.lastName);
      return HttpResponse.json(user);
    } else {
      console.log('❌ User not found for ID:', userId);
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
  }),
];
