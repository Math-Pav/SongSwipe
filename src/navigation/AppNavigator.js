import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DifficultyScreen from '../screens/DifficultyScreen';
import ModeScreen from '../screens/ModeScreen';
import GameScreen from '../screens/GameScreen';
import ClassementScreen from '../screens/ClassementScreen';
import GameHardScreen from '../screens/GameHardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Mode" component={ModeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Difficulty" component={DifficultyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Game" component={GameScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Classement" component={ClassementScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GameHard" component={GameHardScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
