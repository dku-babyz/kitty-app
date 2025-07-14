import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const sections = ['알림 설정', '친구 관리', '채팅/미디어 관리', '고객센터/도움말'];

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      {/* 내 프로필 */}
      <TouchableOpacity style={styles.profileRow}>
        <Image source={require('../../../assets/profile/profile1(jun).png')} style={styles.avatar} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.name}>김민준</Text>
          <Text style={styles.subTxt}>프로필 보기</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.greyDivider} />

      {/* 메뉴 리스트 */}
      {sections.map(text => (
        <TouchableOpacity key={text} style={styles.menuRow}>
          <Text style={styles.menuText}>{text}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  /* 헤더 */
  header: {
    height: 56,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: { alignSelf: 'center', fontSize: 16, fontWeight: '700' },

  /* 프로필 */
  profileRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 72 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  name: { fontSize: 17, fontWeight: '700' },
  subTxt: { fontSize: 13, color: '#6b7280' },

  greyDivider: { height: 8, backgroundColor: '#f3f4f6' },

  /* 메뉴 */
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f3f4f6',
  },
  menuText: { fontSize: 15 },
  chevron: { fontSize: 18, color: '#9ca3af' },
});
