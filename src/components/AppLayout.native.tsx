import React from 'react';
import { YStack } from 'tamagui';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaProvider>
    <YStack flex={1} backgroundColor="$background" paddingTop="$4">
      {children}
    </YStack>
  </SafeAreaProvider>
);
