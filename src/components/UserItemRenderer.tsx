import React from 'react';
import { Image } from 'react-native';
import { YStack, XStack, Text, Card, Avatar } from 'tamagui';
import { IUser } from './ListWithFetch';

const AVATAR_SIZE = 68;

export const renderUserItem = ({ item: { firstName, lastName, email, image, id, birthDate } }: { item: IUser }) => (
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
