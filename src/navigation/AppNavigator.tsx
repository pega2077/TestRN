import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import CustomerScreen from '../screens/CustomerScreen';
import SalesScreen from '../screens/SalesScreen';
import ContactScreen from '../screens/ContactScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';

const Tab = createBottomTabNavigator();

const PRIMARY = '#4A90E2';
const INACTIVE = '#8E8E93';

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5EA',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];
          const icons: Record<string, [IoniconsName, IoniconsName]> = {
            首页: ['home', 'home-outline'],
            客户: ['people', 'people-outline'],
            销售: ['trending-up', 'trending-up-outline'],
            联系: ['chatbubbles', 'chatbubbles-outline'],
            日程: ['calendar', 'calendar-outline'],
            分析: ['bar-chart', 'bar-chart-outline'],
          };
          const [active, inactive] = icons[route.name] ?? ['ellipse', 'ellipse-outline'];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="首页" component={HomeScreen} />
      <Tab.Screen name="客户" component={CustomerScreen} />
      <Tab.Screen name="销售" component={SalesScreen} />
      <Tab.Screen name="联系" component={ContactScreen} />
      <Tab.Screen name="日程" component={ScheduleScreen} />
      <Tab.Screen name="分析" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
}
