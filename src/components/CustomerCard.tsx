import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface Customer {
  id: string;
  name: string;
  company: string;
  tags: string[];
  lastContact: string;
  phone: string;
}

interface CustomerCardProps {
  customer: Customer;
  onPress?: (customer: Customer) => void;
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  VIP客户: { bg: '#FFF3CD', text: '#856404' },
  潜在客户: { bg: '#D1ECF1', text: '#0C5460' },
  合作中: { bg: '#D4EDDA', text: '#155724' },
  已流失: { bg: '#F8D7DA', text: '#721C24' },
};

export default function CustomerCard({ customer, onPress }: CustomerCardProps) {
  const initials = customer.name.slice(0, 2);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(customer)}
      activeOpacity={0.75}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{customer.name}</Text>
          <View style={styles.tagsRow}>
            {customer.tags.map((tag) => {
              const colors = TAG_COLORS[tag] ?? { bg: '#E9ECEF', text: '#495057' };
              return (
                <View key={tag} style={[styles.tag, { backgroundColor: colors.bg }]}>
                  <Text style={[styles.tagText, { color: colors.text }]}>{tag}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={styles.company} numberOfLines={1}>
          <Ionicons name="business-outline" size={12} color="#888" /> {customer.company}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="call-outline" size={12} color="#888" />
          <Text style={styles.metaText}>{customer.phone}</Text>
          <View style={styles.dot} />
          <Ionicons name="time-outline" size={12} color="#888" />
          <Text style={styles.metaText}>上次联系 {customer.lastContact}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  company: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#C7C7CC',
    marginHorizontal: 4,
  },
});
