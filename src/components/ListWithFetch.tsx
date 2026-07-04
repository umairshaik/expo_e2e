import React, { useCallback, useMemo } from 'react';
import { Image, FlatList, ScrollView, Platform } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  Spinner,
  Card,
  Avatar,
  Theme,
} from 'tamagui';
import { useUserViewModel } from '../viewmodels/UserViewModel';

const AVATAR_SIZE = 68;

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  image: string;
  birthDate: string;
}

const renderUserItem = ({ item: { firstName, lastName, email, image, id, birthDate } }: { item: IUser }) => (
  <Card
    key={id}
    testID={`${id}-user-container`}
    overflow="hidden"
    marginHorizontal="$4"
    marginVertical="$2"
    padding="$4"
    borderRadius="$4"
    borderWidth={1}
    borderColor="$borderColor"
    backgroundColor="$card"
    pressStyle={{
      backgroundColor: '$cardHover',
      transform: [{ scale: 0.98 }],
    }}
  >
    <XStack gap="$4" alignItems="center" flex={1}>
      <Avatar
        circular
        size={AVATAR_SIZE}
        borderRadius={AVATAR_SIZE / 2}
        borderWidth={2}
        borderColor="$blue7"
        overflow="hidden"
      >
        <Image
          source={{ uri: image }}
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
          }}
        />
      </Avatar>

      <YStack flex={1} gap="$1">
        <Text
          fontSize="$5"
          fontWeight="600"
          color="$color"
          numberOfLines={1}
        >
          {firstName} {lastName}
        </Text>
        <Text
          fontSize="$3"
          color="$gray10"
          numberOfLines={1}
        >
          {email}
        </Text>
        <Text
          fontSize="$2"
          color="$gray9"
        >
          {birthDate}
        </Text>
      </YStack>
    </XStack>
  </Card>
);

export default () => {
  const { users, loading, error } = useUserViewModel();

  console.log('🎨 [ListWithFetch] Rendering with state:', { usersCount: users.length, loading, error });

  if (loading) {
    console.log('🎨 [ListWithFetch] Rendering LOADING state');
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
    console.log('🎨 [ListWithFetch] Rendering ERROR state:', error);
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

  // Use ScrollView on web, FlatList on mobile
  const isWeb = Platform.OS === 'web';
  console.log('🎨 [ListWithFetch] Rendering SUCCESS state with', users.length, 'users on', isWeb ? 'WEB' : 'MOBILE');

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

      {isWeb ? (
        <ScrollView testID="user-list" style={{ flex: 1 }}>
          <YStack padding="$0" gap="$0">
            {users.map((user) =>
              renderUserItem({
                item: user,
                index: users.indexOf(user),
              } as any)
            )}
          </YStack>
        </ScrollView>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          testID="user-list"
          scrollEnabled={true}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
      )}
    </YStack>
  );
};