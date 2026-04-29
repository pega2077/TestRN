/**
 * Pure-JS icon component — maps Ionicons names to Unicode/Chinese characters
 * that render correctly on all platforms without native font linking.
 */
import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';

const ICON_MAP: Record<string, string> = {
  // ── Tab bar (Chinese chars — compact, colourable, contextual) ──
  'home': '首',           'home-outline': '首',
  'people': '客',         'people-outline': '客',
  'trending-up': '销',   'trending-up-outline': '销',
  'chatbubbles': '联',   'chatbubbles-outline': '联',
  'calendar': '程',      'calendar-outline': '程',
  'bar-chart': '析',     'bar-chart-outline': '析',

  // ── Navigation ──
  'chevron-back': '‹',   'chevron-forward': '›',
  'chevron-up': '˄',     'chevron-down': '˅',

  // ── Actions ──
  'add': '+',            'add-circle-outline': '+',   'add-outline': '+',
  'close-circle': '×',   'close': '×',
  'search-outline': '◎', 'search': '◎',
  'notifications-outline': '◈',
  'person-add': '⊕',     'person-add-outline': '⊕',
  'trash-outline': '⊗',  'trash': '⊗',
  'create-outline': '✎', 'pencil': '✎',
  'save-outline': '✓',

  // ── Content / info ──
  'person-outline': '人',
  'business-outline': '企',
  'call': '☎',            'call-outline': '☎',
  'mail': '✉',
  'walk': '访',
  'chatbubble': '语',     'chatbubble-outline': '语',
  'cart': '购',
  'time': '◷',            'time-outline': '◷',
  'timer': '◷',

  // ── Status / state ──
  'checkmark-circle': '✓',      'checkmark-circle-outline': '○',
  'checkmark-done': '✓',
  'ellipse': '●',               'ellipse-outline': '○',
  'ellipsis-horizontal-circle': '…',

  // ── Trends / directions ──
  'arrow-up': '↑',     'arrow-down': '↓',
  'trending-down': '↘',
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export default function Icon({ name, size = 24, color = '#000000', style }: IconProps) {
  const char = ICON_MAP[name] ?? '■';
  return (
    <Text
      style={[{ fontSize: size, color, lineHeight: size * 1.3, textAlign: 'center' }, style]}
      numberOfLines={1}
      accessible={false}
    >
      {char}
    </Text>
  );
}
