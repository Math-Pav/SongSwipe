import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DifficultyScreen from '../screens/DifficultyScreen';
import ModeScreen from '../screens/ModeScreen';
import GameScreen from '../screens/GameScreen';
import ClassementScreen from '../screens/ClassementScreen';
import GameHardScreen from '../screens/GameHardScreen';
import MultiplayerScreen from '../screens/MultiplayerScreen';
import GameMultiLocalScreen from '../screens/GameMultiLocalScreen';
import ClassementDuelScreen from '../screens/ClassementDuelScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Mode" component={ModeScreen} />
        <Stack.Screen name="Difficulty" component={DifficultyScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="GameHard" component={GameHardScreen} />
        <Stack.Screen name="Classement" component={ClassementScreen} />
        <Stack.Screen name="Multiplayer" component={MultiplayerScreen} />
        <Stack.Screen name="GameMultiLocal" component={GameMultiLocalScreen} />
        <Stack.Screen name="ClassementDuel" component={ClassementDuelScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}