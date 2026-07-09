import React from 'react';
import {
  YStack,
  Text,
  Spinner,
  Theme,
} from 'tamagui';
import { useUserViewModel } from '../viewmodels/UserViewModel';
import { UserList } from './UserList';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  image: string;
  birthDate: string;
}

export default () => {
  const { users, loading, error } = useUserViewModel();

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <YStack gap="$3" alignItems="center">
          <Spinner size="large" color="$blue10" />
          <Text color="$gray11" fontSize="$4">
            Loading users...
          </Text>
        </YStack>
      </YStack>
    );
  }

  if (error) {
    return (
      <Theme name="red">
        <YStack
          padding="$4"
          marginHorizontal="$4"
          marginTop="$4"
          borderRadius="$4"
          backgroundColor="$red3"
          borderColor="$red8"
          borderWidth={1}
          gap="$2"
          testID="error-alert"
        >
          <Text
            fontSize="$5"
            fontWeight="600"
            color="$red11"
          >
            ⚠️ Error Loading Data
          </Text>
          <Text
            fontSize="$3"
            color="$red10"
          >
            {error}
          </Text>
        </YStack>
      </Theme>
    );
  }

  return (
    <YStack flex={1}>
      <YStack paddingHorizontal="$4" paddingVertical="$3" gap="$2">
        <Text fontSize="$7" fontWeight="700" color="$color">
          Users Directory
        </Text>
        <Text fontSize="$3" color="$gray11">
          {users.length} {users.length === 1 ? 'user' : 'users'} found
        </Text>
      </YStack>

      <UserList users={users} />
    </YStack>
  );
};
