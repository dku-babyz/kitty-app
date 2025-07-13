import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const me = { avatar: require('../../../assets/logo/kitty.jpeg'), name: '김민준' };

const friends = [
  { id: '1', avatar: require('../../../assets/logo/kitty.jpeg'), name: '김철수' },
  { id: '2', avatar: require('../../../assets/logo/kitty.jpeg'), name: '동생' },
  { id: '3', avatar: require('../../../assets/logo/kitty.jpeg'), name: '선생님' },
  { id: '4', avatar: require('../../../assets/logo/kitty.jpeg'), name: '성영준' },
  { id: '5', avatar: require('../../../assets/logo/kitty.jpeg'), name: '아빠' },
  { id: '6', avatar: require('../../../assets/logo/kitty.jpeg'), name: '엄마' },
  { id: '7', avatar: require('../../../assets/logo/kitty.jpeg'), name: '오현택' },
  { id: '8', avatar: require('../../../assets/logo/kitty.jpeg'), name: '윤종우' },
  { id: '9', avatar: require('../../../assets/logo/kitty.jpeg'), name: '임석범' },
  { id: '10', avatar: require('../../../assets/logo/kitty.jpeg'), name: '조민혁' },
  { id: '1', avatar: require('../../../assets/logo/kitty.jpeg'), name: '김철수' },
  { id: '2', avatar: require('../../../assets/logo/kitty.jpeg'), name: '동생' },
  { id: '3', avatar: require('../../../assets/logo/kitty.jpeg'), name: '선생님' },
  { id: '4', avatar: require('../../../assets/logo/kitty.jpeg'), name: '성영준' },
  { id: '5', avatar: require('../../../assets/logo/kitty.jpeg'), name: '아빠' },
  { id: '6', avatar: require('../../../assets/logo/kitty.jpeg'), name: '엄마' },
  { id: '7', avatar: require('../../../assets/logo/kitty.jpeg'), name: '오현택' },
  { id: '8', avatar: require('../../../assets/logo/kitty.jpeg'), name: '윤종우' },
  { id: '9', avatar: require('../../../assets/logo/kitty.jpeg'), name: '임석범' },
  { id: '10', avatar: require('../../../assets/logo/kitty.jpeg'), name: '조민혁' },
  { id: '1', avatar: require('../../../assets/logo/kitty.jpeg'), name: '김철수' },
  { id: '2', avatar: require('../../../assets/logo/kitty.jpeg'), name: '동생' },
  { id: '3', avatar: require('../../../assets/logo/kitty.jpeg'), name: '선생님' },
  { id: '4', avatar: require('../../../assets/logo/kitty.jpeg'), name: '성영준' },
  { id: '5', avatar: require('../../../assets/logo/kitty.jpeg'), name: '아빠' },
  { id: '6', avatar: require('../../../assets/logo/kitty.jpeg'), name: '엄마' },
  { id: '7', avatar: require('../../../assets/logo/kitty.jpeg'), name: '오현택' },
  { id: '8', avatar: require('../../../assets/logo/kitty.jpeg'), name: '윤종우' },
  { id: '9', avatar: require('../../../assets/logo/kitty.jpeg'), name: '임석범' },
  { id: '10', avatar: require('../../../assets/logo/kitty.jpeg'), name: '조민혁' },
  { id: '1', avatar: require('../../../assets/logo/kitty.jpeg'), name: '김철수' },
  { id: '2', avatar: require('../../../assets/logo/kitty.jpeg'), name: '동생' },
  { id: '3', avatar: require('../../../assets/logo/kitty.jpeg'), name: '선생님' },
  { id: '4', avatar: require('../../../assets/logo/kitty.jpeg'), name: '성영준' },
  { id: '5', avatar: require('../../../assets/logo/kitty.jpeg'), name: '아빠' },
  { id: '6', avatar: require('../../../assets/logo/kitty.jpeg'), name: '엄마' },
  { id: '7', avatar: require('../../../assets/logo/kitty.jpeg'), name: '오현택' },
  { id: '8', avatar: require('../../../assets/logo/kitty.jpeg'), name: '윤종우' },
  { id: '9', avatar: require('../../../assets/logo/kitty.jpeg'), name: '임석범' },
  { id: '10', avatar: require('../../../assets/logo/kitty.jpeg'), name: '조민혁' },
  { id: '1', avatar: require('../../../assets/logo/kitty.jpeg'), name: '김철수' },
  { id: '2', avatar: require('../../../assets/logo/kitty.jpeg'), name: '동생' },
  { id: '3', avatar: require('../../../assets/logo/kitty.jpeg'), name: '선생님' },
  { id: '4', avatar: require('../../../assets/logo/kitty.jpeg'), name: '성영준' },
  { id: '5', avatar: require('../../../assets/logo/kitty.jpeg'), name: '아빠' },
  { id: '6', avatar: require('../../../assets/logo/kitty.jpeg'), name: '엄마' },
  { id: '7', avatar: require('../../../assets/logo/kitty.jpeg'), name: '오현택' },
  { id: '8', avatar: require('../../../assets/logo/kitty.jpeg'), name: '윤종우' },
  { id: '9', avatar: require('../../../assets/logo/kitty.jpeg'), name: '임석범' },
  { id: '10', avatar: require('../../../assets/logo/kitty.jpeg'), name: '조민혁' },
  { id: '1', avatar: require('../../../assets/logo/kitty.jpeg'), name: '김철수' },
  { id: '2', avatar: require('../../../assets/logo/kitty.jpeg'), name: '동생' },
  { id: '3', avatar: require('../../../assets/logo/kitty.jpeg'), name: '선생님' },
  { id: '4', avatar: require('../../../assets/logo/kitty.jpeg'), name: '성영준' },
  { id: '5', avatar: require('../../../assets/logo/kitty.jpeg'), name: '아빠' },
  { id: '6', avatar: require('../../../assets/logo/kitty.jpeg'), name: '엄마' },
  { id: '7', avatar: require('../../../assets/logo/kitty.jpeg'), name: '오현택' },
  { id: '8', avatar: require('../../../assets/logo/kitty.jpeg'), name: '윤종우' },
  { id: '9', avatar: require('../../../assets/logo/kitty.jpeg'), name: '임석범' },
  { id: '10', avatar: require('../../../assets/logo/kitty.jpeg'), name: '조민혁' },
  { id: '1', avatar: require('../../../assets/logo/kitty.jpeg'), name: '김철수' },
  { id: '2', avatar: require('../../../assets/logo/kitty.jpeg'), name: '동생' },
  { id: '3', avatar: require('../../../assets/logo/kitty.jpeg'), name: '선생님' },
  { id: '4', avatar: require('../../../assets/logo/kitty.jpeg'), name: '성영준' },
  { id: '5', avatar: require('../../../assets/logo/kitty.jpeg'), name: '아빠' },
];

export default function FriendsScreen() {
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>친구</Text>
      </View>

      {/* 내 프로필 */}
      <View style={styles.mineRow}>
        <Image source={me.avatar} style={styles.avatar} />
        <Text style={styles.name}>{me.name}</Text>
      </View>
      <View style={styles.greyDivider} />

      {/* 친구 섹션 */}
      <Text style={styles.sectionTitle}>친구 {friends.length}</Text>
      <FlatList
        data={friends}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.thinDivider} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={item.avatar} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
      />
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

  /* 내 프로필 & 친구 셀 공통 */
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 72 },
  mineRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 72 },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 14 },
  name: { fontSize: 17, fontWeight: '600' },

  greyDivider: { height: StyleSheet.hairlineWidth, backgroundColor: '#e5e7eb' },
  thinDivider: { height: StyleSheet.hairlineWidth, backgroundColor: '#f3f4f6' },

  sectionTitle: {
    marginLeft: 16,
    marginTop: 12,
    marginBottom: 4,
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '700',
  },
});
