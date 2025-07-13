import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types/navigation';

// --- Mock Data with Timestamps ---
const now = new Date();
const chats = [
  { id: '1', avatar: require('../../../assets/logo/kitty.jpeg'), name: '김철수', sub: '뭐해?', timestamp: new Date(now.getTime() - 10 * 60 * 1000) }, // 10 minutes ago
  { id: '2', avatar: require('../../../assets/logo/kitty.jpeg'), name: '성영준', sub: '응 내일 봐', timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000) }, // 5 hours ago
  { id: '3', avatar: require('../../../assets/logo/kitty.jpeg'), name: '윤종우', sub: '너 어디야', timestamp: new Date(now.getTime() - 23 * 60 * 60 * 1000) }, // 23 hours ago
  { id: '4', avatar: require('../../../assets/logo/kitty.jpeg'), name: '엄마', sub: '밥 먹었어?', timestamp: new Date(now.getTime() - 25 * 60 * 60 * 1000) }, // Yesterday
  { id: '5', avatar: require('../../../assets/logo/kitty.jpeg'), name: '조민혁', sub: '잠온다 어떡하냐', timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) }, // 3 days ago
  { id: '6', avatar: require('../../../assets/logo/kitty.jpeg'), name: '임석범', sub: '내일 청소 누구지?', timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) }, // 5 days ago
  { id: '7', avatar: require('../../../assets/logo/kitty.jpeg'), name: '동생', sub: '응 알겠어', timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }, // 1 week ago
  { id: '8', avatar: require('../../../assets/logo/kitty.jpeg'), name: '오현택', sub: 'ㅋㅋㅋㅋ 게임 얼른 들어와', timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) }, // 10 days ago
  { id: '9', avatar: require('../../../assets/logo/kitty.jpeg'), name: '선생님', sub: '오늘 숙제 다 했니?', timestamp: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000) }, // 2 weeks ago
  { id: '10', avatar: require('../../../assets/logo/kitty.jpeg'), name: '아빠', sub: '주말에 놀이공원에 가고 싶어요', timestamp: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000) }, // 1 month ago
];

// --- Time Formatting Function ---
const formatTime = (date: Date): string => {
  const today = new Date();
  const messageDate = new Date(date);

  // Reset time part for day comparison
  today.setHours(0, 0, 0, 0);
  messageDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - messageDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Today: return HH:mm
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } else if (diffDays === 1) {
    // Yesterday
    return '어제';
  } else {
    // More than 1 day ago
    return `${diffDays}일 전`;
  }
};

export default function ChatListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* ─── Header ─── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity style={styles.plusBtn}>
          <Text style={styles.plusTxt}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Chat List ─── */}
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('ChattingRoom', { name: item.name, avatar: item.avatar })}
          >
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>{item.sub}</Text>
            </View>
            <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  /* ─── Header ─── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 47,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  plusBtn: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  plusTxt: { fontSize: 22, color: '#2563eb', fontWeight: '600' },

  /* ─── Chat Cell ─── */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 72,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 14 },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  sub: { fontSize: 13, color: '#6b7280' },
  time: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#f3f4f6', marginLeft: 86 }, // Adjusted for avatar width + margin
});
