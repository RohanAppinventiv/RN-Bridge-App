
import MainScreen from './MainScreen';
import { emvConfig } from './utils/config';

export default function App() {
  return <MainScreen config={emvConfig} />;
}