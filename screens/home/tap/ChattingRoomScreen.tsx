import React, { useState } from 'react';
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

const initialMessages = [
  { id: '1', text: '밥먹음?', sender: 'them' },
  { id: '2', text: 'ㅇㅇ 먹음?', sender: 'me' },
  { id: '3', text: '그럼 뭐함', sender: 'them' },
  { id: '4', text: '그러게', sender: 'me' },
];

const ChattingRoomScreen = () => {
  const route = useRoute<ChattingRoomScreenRouteProp>();
  const { name, avatar } = route.params;
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: inputText,
        sender: 'me',
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const renderMessage = ({ item }: { item: (typeof messages)[0] }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'me' ? styles.myMessage : styles.theirMessage,
      ]}>
      <Text style={styles.messageText}>{item.text}</Text>
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
    marginBottom: 10,
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
});

export default ChattingRoomScreen;
