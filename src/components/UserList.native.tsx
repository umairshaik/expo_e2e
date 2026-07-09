import React from 'react';
import { FlatList } from 'react-native';
import { IUser } from './ListWithFetch';
import { renderUserItem } from './UserItemRenderer';

export const UserList = ({ users }: { users: IUser[] }) => (
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
);
