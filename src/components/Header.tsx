import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from './Icon';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
}

export default function Header({
  title,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.inner}>
        {showBack ? (
          <TouchableOpacity style={styles.sideBtn} onPress={onBack} activeOpacity={0.7}>
            <Icon name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
        ) : (
          <View style={styles.sideBtn} />
        )}

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {rightIcon ? (
          <TouchableOpacity style={styles.sideBtn} onPress={onRightPress} activeOpacity={0.7}>
            <Icon name={rightIcon} size={24} color="#4A90E2" />
          </TouchableOpacity>
        ) : (
          <View style={styles.sideBtn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  inner: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  sideBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
