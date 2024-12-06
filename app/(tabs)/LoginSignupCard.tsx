import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Switch,
  SafeAreaView,
} from 'react-native';

const LoginSignupCard: React.FC = () => {
  const [isFlip, setIsFlip] = useState<boolean>(false); 

  const flipAnim = new Animated.Value(0); 

  const toggleFlip = () => {
    setIsFlip((prev) => !prev); 
    Animated.timing(flipAnim, {
      toValue: isFlip ? 0 : 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.cardSwitch}>
        <View style={styles.switchContainer}>
          <Switch
            value={isFlip}
            onValueChange={toggleFlip}
            trackColor={{ true: '#2d8cf0', false: '#ccc' }}
            thumbColor="#fff"
          />
          <Text style={styles.cardSideText}>{isFlip ? 'Sign up' : 'Log in'}</Text>
        </View>

        <Animated.View
          style={[styles.flipCardInner, { transform: [{ rotateY }] }]}>
          {/* Front (Log in) */}
          {!isFlip ? (
            <View style={styles.flipCardSide}>
              <Text style={styles.title}>Log in</Text>
              <TextInput
                style={styles.flipCardInput}
                placeholder="Email"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.flipCardInput}
                placeholder="Password"
                secureTextEntry
              />
              <TouchableOpacity style={styles.flipCardBtn}>
                <Text style={styles.flipCardBtnText}>Let's go!</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Back (Sign up)
            <View style={[styles.flipCardSide, { transform: [{ rotateY: '180deg' }] }]}>
              <Text style={styles.title}>Sign up</Text>
              <TextInput
                style={styles.flipCardInput}
                placeholder="Name"
              />
              <TextInput
                style={styles.flipCardInput}
                placeholder="Email"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.flipCardInput}
                placeholder="Password"
                secureTextEntry
              />
              <TouchableOpacity style={styles.flipCardBtn}>
                <Text style={styles.flipCardBtnText}>Confirm!</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardSwitch: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 350,
    position: 'relative',
  },

  switchContainer: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
  },

  cardSideText: {
    position: 'absolute',
    top: 0,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#323232',
    textDecorationLine: 'underline',
  },

  flipCardInner: {
    width: 300,
    height: 350,
    position: 'relative',
    backgroundColor: 'transparent',
    textAlign: 'center',
    perspective: '1000', 
  },
  
  flipCardSide: {
    width: '100%',
    height: '100%',
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#323232',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 25,
    fontWeight: '900',
    color: '#323232',
    marginBottom: 20,
  },

  flipCardInput: {
    width: 250,
    height: 40,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#323232',
    backgroundColor: '#fff',
    padding: 5,
    marginBottom: 20,
    fontSize: 15,
    fontWeight: '600',
    color: '#323232',
  },

  flipCardBtn: {
    width: 120,
    height: 40,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#323232',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  flipCardBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#323232',
  },
});

export default LoginSignupCard;
