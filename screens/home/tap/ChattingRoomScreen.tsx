import React, { useState, useEffect, useContext } from 'react';
import { getMessages } from '../../../services/api';
import { connectWebSocket, sendMessage, disconnectWebSocket } from '../../../services/websocket';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert, // Added Alert for displaying quiz/report
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../types/navigation';
import { AuthContext } from '../../../context/AuthContext'; // Import AuthContext

type ChattingRoomScreenRouteProp = RouteProp<
  RootStackParamList,
  'ChattingRoom'
>;

interface Message {
  content: string;
  id: number;
  owner_id: number;
  room_id: number;
  character_state: string;
  experience_points: number;
  is_harmful: boolean;
  created_at: string;
}

interface QuizResult {
  bad_word: string;
  reason: string;
  quiz: string;
}

interface ReportResult {
  summary: string;
  advice: string;
}

const ChattingRoomScreen = () => {
  const route = useRoute<ChattingRoomScreenRouteProp>();
  const { name, avatar, roomId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [quizData, setQuizData] = useState<QuizResult[] | null>(null);
  const [reportData, setReportData] = useState<ReportResult | null>(null);

  const authContext = useContext(AuthContext);
  const currentUserId = authContext?.user?.id || 1; // Use user ID from AuthContext, fallback to 1

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

    connectWebSocket(roomId, (serverMessage) => {
      if (serverMessage.type === 'new_message') {
        setMessages((prev) => [...prev, serverMessage.message]);

        // Update user stats via AuthContext
        if (serverMessage.user_update) {
          authContext?.updateUser({
            experience_points: serverMessage.user_update.experience_points,
            character_state: serverMessage.user_update.character_state,
            harmful_chat_count: serverMessage.user_update.harmful_chat_count,
          });
        }

        // Handle quiz results
        if (serverMessage.quiz_results && serverMessage.quiz_results.length > 0) {
          setQuizData(serverMessage.quiz_results);
          const quizAlertMessage = serverMessage.quiz_results.map(q => `단어: ${q.bad_word}\n이유: ${q.reason}\n퀴즈: ${q.quiz}`).join('\n\n');
          Alert.alert('새로운 퀴즈 도착!', quizAlertMessage);
        }

        // Handle report results
        if (serverMessage.report_results) {
          setReportData(serverMessage.report_results);
          Alert.alert('새로운 리포트 도착!', `요약: ${serverMessage.report_results.summary}\n조언: ${serverMessage.report_results.advice}`);
        }
      }
    });

    return () => {
      disconnectWebSocket();
    };
  }, [roomId, authContext]); // Add authContext to dependency array

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    sendMessage({
      type: "chat",
      content: inputText,
      sender_id: currentUserId,
      room_id: roomId,
    });
    setInputText('');
  };


  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.owner_id === currentUserId;
    const characterIcon = item.character_state === 'smiling'
      ? require('../../../assets/emoji/smile-kitty.png')
      : require('../../../assets/emoji/cry-kitty.png');

    return (
      <View>
        <View
          style={[
            styles.messageContainer,
            isMyMessage ? styles.myMessage : styles.theirMessage,
          ]}>
          <Text style={styles.messageText}>{item.content}</Text>
          <View style={styles.expContainer}>
            <Text style={styles.expText}>EXP: {item.experience_points}</Text>
            <Image source={characterIcon} style={styles.characterIcon} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={avatar} style={styles.avatar} />
        <Text style={styles.headerTitle}>{name}</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
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
