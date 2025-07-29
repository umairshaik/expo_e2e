import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

const AVATAR_SIZE = 68;

// Check if we're in a test environment or if Maestro is running
const isTestEnvironment =
  __DEV__ &&
  // Check for Maestro environment variable or any test indicator
  (process.env.NODE_ENV === 'test' || (global as any).__MAESTRO__ || false); // You can add more conditions here

// For Maestro testing - use WireMock server
// Note: In production, you'd use environment variables or build-time flags
const BASE_URL = __DEV__
  ? 'http://10.136.126.9:8080' // WireMock server (host machine IP)
  : 'https://dummyjson.com';

// Add some logging to help debug
console.log('🔍 Debug info:', {
  __DEV__,
  NODE_ENV: process.env.NODE_ENV,
  __MAESTRO__: (global as any).__MAESTRO__,
  isTestEnvironment,
  BASE_URL,
});

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  image: string;
  birthDate: string;
}

export default () => {
  const [usersData, setUsersData] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/users`);
        setUsersData(response.data.users);
      } catch (e) {
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRenderItem = useCallback(
    ({ item: { firstName, lastName, email, image, id, birthDate } }: { item: IUser }) => (
      <View style={styles.userContainer} testID={`${id}-user-container`}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        <View style={styles.userInfoContainer}>
          <Text>
            {firstName} {lastName}
          </Text>
          <Text>{email}</Text>
          <Text>{birthDate}</Text>
        </View>
      </View>
    ),
    [],
  );

  return (
    <View>
      {loading && <ActivityIndicator color={'#000'} size={'large'} accessibilityLabel={'loader'} />}
      {hasError && (
        <View style={styles.errorContainer} accessibilityLabel={'alert'}>
          <Text>Error oopsie!</Text>
        </View>
      )}
      <FlatList
        data={usersData}
        renderItem={handleRenderItem}
        keyExtractor={item => item.id}
        testID="user-list"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: { backgroundColor: '#C63939', padding: 16, borderRadius: 6 },
  userContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  avatarWrapper: {
    backgroundColor: 'rgba(88,186,224,0.65)',
    padding: 16,
    borderRadius: AVATAR_SIZE,
  },
  userInfoContainer: { flex: 1, marginLeft: 16 },
  image: { height: AVATAR_SIZE, width: AVATAR_SIZE },
});
