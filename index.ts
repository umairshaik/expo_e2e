import { registerRootComponent } from 'expo';
import App from './src/App';
import { enableApiMocking } from './src/utils/apiMocker';

// Enable API mocking in development
if (__DEV__) {
  enableApiMocking();
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
