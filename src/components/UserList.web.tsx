import React from 'react';
import { ScrollView } from 'react-native';
import { YStack } from 'tamagui';
import { IUser } from './ListWithFetch';
import { renderUserItem } from './UserItemRenderer';

export const UserList = ({ users }: { users: IUser[] }) => (
  <ScrollView testID="user-list" style={{ flex: 1 }}>
    <YStack padding="$0" gap="$0">
      {users.map((user, index) =>
        renderUserItem({
          item: user,
          index,
        } as any)
      )}
    </YStack>
  </ScrollView>
);
