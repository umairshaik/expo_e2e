import React from 'react';
import { YStack } from 'tamagui';

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <YStack flex={1} backgroundColor="$background" paddingTop="$0">
    {children}
  </YStack>
);
