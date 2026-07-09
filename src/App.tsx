import React from 'react';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';
import ListWithFetch from './components/ListWithFetch';
import { AppLayout } from './components/AppLayout';

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <AppLayout>
        <ListWithFetch />
      </AppLayout>
    </TamaguiProvider>
  );
}

