import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DifficultyScreen from '../screens/DifficultyScreen';
import ModeScreen from '../screens/ModeScreen';
import GameScreen from '../screens/GameScreen';
import ClassementScreen from '../screens/ClassementScreen';
import GameHardScreen from '../screens/GameHardScreen';
import MultiplayerScreen from '../screens/MultiplayerScreen';
import CreateGameScreen from '../screens/CreateGameScreen';
import JoinGameScreen from '../screens/JoinGameScreen';
import LobbyScreen from '../screens/LobbyScreen';
import GameMultiScreen from '../screens/GameMultiScreen';
import GameMultiResultsScreen from '../screens/GameMultiResultsScreen';

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
        <Stack.Screen name="Classement" component={ClassementScreen} />
        <Stack.Screen name="GameHard" component={GameHardScreen} />
        <Stack.Screen name="Multiplayer" component={MultiplayerScreen} />
        <Stack.Screen name="CreateGame" component={CreateGameScreen} />
        <Stack.Screen name="JoinGame" component={JoinGameScreen} />
        <Stack.Screen name="Lobby" component={LobbyScreen} />
        <Stack.Screen name="GameMulti" component={GameMultiScreen} />
        <Stack.Screen name="GameMultiResults" component={GameMultiResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}