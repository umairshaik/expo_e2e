import React from 'react';
import { TamaguiProvider, YStack } from 'tamagui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import tamaguiConfig from '../tamagui.config';
import ListWithFetch from './components/ListWithFetch';

export default function App() {
  const content = (
    <YStack flex={1} backgroundColor="$background" paddingTop={Platform.OS === 'web' ? '$0' : '$4'}>
      <ListWithFetch />
    </YStack>
  );

  return (
    <TamaguiProvider config={tamaguiConfig}>
      {Platform.OS === 'web' ? (
        content
      ) : (
        <SafeAreaProvider>
          {content}
        </SafeAreaProvider>
      )}
    </TamaguiProvider>
  );
}
