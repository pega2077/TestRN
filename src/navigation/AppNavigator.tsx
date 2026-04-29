import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

import MainTabNavigator from './MainTabNavigator';
import CustomerDetailScreen from '../screens/CustomerDetailScreen';
import CustomerFormScreen from '../screens/CustomerFormScreen';
import SalesFormScreen from '../screens/SalesFormScreen';
import ContactFormScreen from '../screens/ContactFormScreen';
import ScheduleFormScreen from '../screens/ScheduleFormScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
      <Stack.Screen
        name="CustomerForm"
        component={CustomerFormScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="SalesForm"
        component={SalesFormScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="ContactForm"
        component={ContactFormScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="ScheduleForm"
        component={ScheduleFormScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
