import ListWithFetch from './ListWithFetch';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <ListWithFetch />
    </SafeAreaProvider>
  );
}
