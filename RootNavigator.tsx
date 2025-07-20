import React, { useContext } from 'react';
import { ActivityIndicator, View, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProfileScreen from './screens/ProfileScreen';
import Tabs from './screens/home/tap/Tabs';
import ChattingRoomScreen from './screens/home/tap/ChattingRoomScreen';
import DiaryScreen from './screens/home/DiaryScreen';
import type { RootStackParamList } from './types/navigation';

import ReportScreen from './screens/home/ReportScreen';

import QuestScreen from './screens/home/QuestScreen';
import QuizScreen from './screens/QuizScreen';
import PlusScreen from './screens/home/tap/PlusScreen';
import { AuthContext } from './context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const authContext = useContext(AuthContext);

  if (!authContext || authContext.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const initialRouteName = authContext.user ? 'Main' : 'Login';

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#e8f0ff" />
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Main" component={Tabs} />
        <Stack.Screen name="Diary" component={DiaryScreen} />
        <Stack.Screen name="ChattingRoom" component={ChattingRoomScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="Quest" component={QuestScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Plus" component={PlusScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f0ff',
  },
});

export default RootNavigator;
