import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text, View, Image, StyleSheet, TouchableOpacity, Dimensions, Animated, TouchableWithoutFeedback } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import KontaktScreen from './screens/KontaktScreen';
import PlannerScreen from './screens/PlannerScreen';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [navigation, setNavigation] = useState(null);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const toggleMenu = () => {
    const toValue = menuVisible ? width : width - 200; // Szerokość menu wynosi 200
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  const closeMenu = () => {
    if (menuVisible) {
      setMenuVisible(false);
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f26b8a',
          },
          headerTintColor: 'white',
          headerRight: () => (
            <Pressable onPress={toggleMenu} >
              <Text style={{ color: 'white', fontSize: 16, marginRight: 20, backgroundColor: "#fc94af", padding: 10, borderRadius: 10 }}>Menu</Text>
            </Pressable>
          ),
          contentStyle: {
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            headerTitle: (props) => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Image source={require('./assets/favicon.png')} style={{width: 50, height: 50}} />                
                <Text style={{ color: 'white', fontSize: 25, marginStart: 10, padding: 10}}>Strona główna</Text>
              </View>
            ),
          }} 
          listeners={({ navigation }) => ({
            focus: () => setNavigation(navigation)
          })}
        />
        <Stack.Screen 
          name="Edytuj planer" 
          component={PlannerScreen} 
          options={{
            headerTitle: (props) => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Image source={require('./assets/favicon.png')} style={{width: 50, height: 50}} />                
                <Text style={{ color: 'white', fontSize: 25, marginStart: 10, paddingStart: 10}}>Edytuj twój planer</Text>
              </View>
            ),
          }}
        />
        <Stack.Screen 
          name="Kontakt" 
          component={KontaktScreen} 
          options={{
            headerTitle: (props) => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Image source={require('./assets/favicon.png')} style={{width: 50, height: 50}} />                
                <Text style={{ color: 'white', fontSize: 25, marginStart: 10, paddingStart: 10}}>Kontakt</Text>
              </View>
            ),
          }} 
        />
      </Stack.Navigator>

      {menuVisible &&
        <TouchableWithoutFeedback onPress={closeMenu}>
          <Animated.View style={[styles.menu, { left: slideAnim }]}>
            <TouchableOpacity onPress={() => { closeMenu(); navigation.navigate('Home'); }}>
              <Text style={styles.menuItem}>Strona główna</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { closeMenu(); navigation.navigate('Edytuj planer'); }}>
              <Text style={styles.menuItem}>Edytuj planer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { closeMenu(); navigation.navigate('Kontakt'); }}>
              <Text style={styles.menuItem}>Kontakt</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableWithoutFeedback>
      }
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: '#f26b8a',
    width: 200,
    height: height,
    marginTop: 60,
    paddingTop: 20,
    paddingHorizontal: 20, // Adjust as needed
    alignItems: 'start',
    position: 'absolute',
    top: 0,
  },
  menuItem: {
    fontSize: 18,
    backgroundColor: "#fc94af", 
    padding: 10, 
    borderRadius: 10,
    width: 150,
    marginBottom: 10,
    color: 'white',
  },
});
