import React, { useState, useEffect } from 'react';
import { getRooms } from '../../../services/api';
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

export default function ChatListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    const avatars = [
      { id: '1', avatar: require('../../../assets/profile/profile3(su).png') },
      { id: '2', avatar: require('../../../assets/profile/profile5(sung).png') },
      { id: '3', avatar: require('../../../assets/profile/profile8(woo).png') },
      { id: '4', avatar: require('../../../assets/logo/kitty.jpeg'), },
      { id: '5', avatar: require('../../../assets/profile/profile10(jo).png'), },
      { id: '6', avatar: require('../../../assets/profile/profile11(im).png') },
      { id: '7', avatar: require('../../../assets/profile/profile2(brother).png')},
      { id: '8', avatar: require('../../../assets/profile/profile9(o).png') },
      { id: '9', avatar: require('../../../assets/profile/profile4(teacher).png') },
      { id: '10', avatar: require('../../../assets/profile/profile6(dad).png') }
    ];

    const fetchRooms = async () => {
      try {
        const rooms = await getRooms();
        const roomsWithAvatars = rooms.map((room: any) => {
          const randomAvatar =
            avatars[Math.floor(Math.random() * avatars.length)].avatar;
          return { ...room, avatar: randomAvatar };
        });
        setChats(roomsWithAvatars);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

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
            onPress={() => navigation.navigate('ChattingRoom', { name: item.name, roomId: item.id, avatar: require('../../../assets/logo/kitty.jpeg') })}
          >
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>{item.last_message}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
