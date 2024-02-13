import { Provider } from 'react-redux';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { store } from 'app/store';
import Navigation from 'navigation';


export default function App() {
  return (
    <Provider store={store}>
      <Navigation/>
      <Toast/>
    </Provider>
  );
}


