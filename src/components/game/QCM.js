import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const QCM = ({ options, onSelect }) => {
  return (
    <View style={styles.optionsContainer}>
      {options.map((opt, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.touchable}
          activeOpacity={0.8}
          onPress={() => onSelect(opt)}
        >
          <LinearGradient 
            colors={['#ff00c8', '#b300ff']}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>{opt.trackName}</Text>
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
    marginTop: 20,
  },

  touchable: {
    width: '48%',
    margin: '1%',
  },

  optionButton: {
    borderRadius: 22,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },

  optionText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QCM;
