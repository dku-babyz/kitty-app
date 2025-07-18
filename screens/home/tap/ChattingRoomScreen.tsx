import React, { useState, useEffect } from 'react';
import { getMessages } from '../../../services/api';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../types/navigation';

type ChattingRoomScreenRouteProp = RouteProp<
  RootStackParamList,
  'ChattingRoom'
>;

const ChattingRoomScreen = () => {
  const route = useRoute<ChattingRoomScreenRouteProp>();
  const { name, avatar, roomId } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const currentUserId = 1;
  const wsRef = React.useRef<WebSocket | null>(null);


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessages(roomId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    wsRef.current = new WebSocket(`ws://10.0.2.2:8000/ws/${roomId}`);

    wsRef.current!.onopen = () => {
      console.log('WebSocket connected');
      wsRef.current!.send(JSON.stringify({ type: 'join_room', room_id: roomId }));
    };

    wsRef.current!.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.type === 'new_message') {
          setMessages((prev) => [...prev, data.message]);
        }
      } catch (err) {
        console.warn('Invalid WS message:', event.data);
      }
    };

    wsRef.current!.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    wsRef.current!.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      wsRef.current?.close();
    };
  }, [roomId]);

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const messageData = {
      sender_id: currentUserId,
      content: inputText,
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(messageData));
      setInputText('');
    } else {
      console.warn('WebSocket is not open.');
    }
  };

  const renderMessage = ({ item }: { item: { id: string; content: string; owner_id: number } }) => (
    <View>
      <View
        style={[
          styles.messageContainer,
          item.owner_id === currentUserId ? styles.myMessage : styles.theirMessage,
        ]}>
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={avatar} style={styles.avatar} />
        <Text style={styles.headerTitle}>{name}</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  messagesContainer: { padding: 10 },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#f1f0f0',
    alignSelf: 'flex-start',
  },
  messageText: { fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: { marginLeft: 10, padding: 10 },
  sendButtonText: { color: '#2563eb', fontWeight: '600' },
  expContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  expText: {
    fontSize: 12,
    color: 'gray',
  },
  characterIcon: {
    width: 24,
    height: 24,
    marginLeft: 5,
  },
});

export default ChattingRoomScreen;
