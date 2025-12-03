import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const QCM = ({ options, onSelect }) => {
  const gradients = [
    ['#ff00c8', '#b300ff'],
    ['#4facfe', '#00f2fe'],
    ['#f093fb', '#f5576c'],
    ['#00ff88', '#00cc6a'],
  ];

  const icons = ['musical-notes', 'disc', 'headset', 'mic'];

  return (
    <View style={styles.optionsContainer}>
      {options.map((opt, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.touchable}
          activeOpacity={0.85}
          onPress={() => onSelect(opt)}
        >
          <LinearGradient 
            colors={gradients[index % gradients.length]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.optionButton}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name={icons[index % icons.length]} size={20} color="rgba(255,255,255,0.4)" />
            </View>
            <Text style={styles.optionText} numberOfLines={2}>{opt.trackName}</Text>
            <View style={styles.shimmer} />
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 15,
    paddingHorizontal: 5,
  },
  touchable: {
    width: '46%',
    margin: '2%',
  },
  optionButton: {
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
  },
  iconWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  optionText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 24,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 50,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: [{ skewX: '-20deg' }],
  },
});

export default QCM;
