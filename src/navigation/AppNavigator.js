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
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
        <Stack.Screen name="Mode" component={ModeScreen} options={{ title: 'Mode de jeu' }} />
        <Stack.Screen name="Difficulty" component={DifficultyScreen} options={{ title: 'Difficulté' }} />
        <Stack.Screen name="Game" component={GameScreen} options={{ title: 'Jeu' }} />
        <Stack.Screen name="Classement" component={ClassementScreen} options={{ title: 'Classement' }} />
        <Stack.Screen name="GameHard" component={GameHardScreen} options={{ title: 'Jeu Difficile' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
