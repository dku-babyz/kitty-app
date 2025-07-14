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
];

const ChattingRoomScreen = () => {
  const route = useRoute<ChattingRoomScreenRouteProp>();
  const { name, avatar } = route.params;
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const originalText = inputText.trim();

    const substitutions: { [key: string]: { text: string; exp: number; } } = {
      '아 진짜 급식 개노답이야 오늘도 좆같은 미역국 나오고 끝이더라 뭘 쳐먹으라는건지;;': {
        text: '야 오늘 급식 진짜 실망이었어. 또 미역국 나왔는데, 다른 반찬도 없어서 좀 당황했잖아.',
        exp: -10,
      },
      'ㄹㅇ 그딴거 주고선 영양식이다 ㅇㅈㄹ하는데 시발 정신나간거 아님? 점심시간만 기다렸는데 ㅋㅋ 현타 쌉오고 개 빡쳤다 그냥.': {
        text: '맞아 저걸 영양식이라고 설명하던데.. 솔직히 내 기준에선 좀 아쉬웠어 점심시간만 기다렸는데 기대에 못 미쳐서 살짝 멘붕 왔다 ㅋㅋ',
        exp: -10,
      },
      '아 진짜 급식실 폭파하고 싶었음. 내 인생에서 제일 좆같았어 오늘': {
        text: '진심 오늘은 급식실 나오는 길에 마음이 너무 공허했음. 오늘 하루가 다 허탈하게 느껴졌어.',
        exp: -10,
      },
      '그래 그래도 너가 그렇게 말해주니까 기분이 좀 풀리네 너도 오늘 행복한 하루 보내': {
        text: '그래 그래도 너가 그렇게 말해주니까 기분이 좀 풀리네 너도 오늘 행복한 하루 보내',
        exp: +10,
      },
      '벌써부터 기대되네 저녁에 재밌게 놀아보자 고마워': {
        text: '벌써부터 기대되네 저녁에 재밌게 놀아보자 고마워',
        exp: +10,
      },
    };

    const moderationResult = substitutions[originalText];
    const newMessage = {
      id: (messages.length + 1).toString(),
      text: moderationResult ? moderationResult.text : originalText,
      sender: 'me',
      exp: moderationResult?.exp ?? 0,
    };

    setTimeout(() => {
      setMessages(prev => [...prev, newMessage]);
      setInputText('');

      const friendReplies: { [key: string]: string } = {
        '야 오늘 급식 진짜 실망이었어. 또 미역국 나왔는데, 다른 반찬도 없어서 좀 당황했잖아.':
          '급식 아쉽긴 하더라',
        '맞아 저걸 영양식이라고 설명하던데.. 솔직히 내 기준에선 좀 아쉬웠어 점심시간만 기다렸는데 기대에 못 미쳐서 살짝 멘붕 왔다 ㅋㅋ':
          '오늘 급식실에서 화 많이 났겠네 ㅋㅋ',
        '진심 오늘은 급식실 나오는 길에 마음이 너무 공허했음. 오늘 하루가 다 허탈하게 느껴졌어.':
          '그래도 오늘 오후부터는 힘내고 좋은 하루 보내라',
        '그래 그래도 너가 그렇게 말해주니까 기분이 좀 풀리네 너도 오늘 행복한 하루 보내':
          '그래 ㅋㅋ 저녁에 재밌게 같이 놀자',
      };

      const friendResponse = friendReplies[newMessage.text];
      if (friendResponse) {
        setTimeout(() => {
          const friendMessage = {
            id: (messages.length + 2).toString(),
            text: friendResponse,
            sender: 'them',
          };
          setMessages(prev => [...prev, friendMessage]);
        }, 1300); // 1s delay for friend response
      }
    }, 1500); // 0.8s delay
  };

  const renderMessage = ({ item }: { item: (typeof messages)[0] & { exp?: number; emoji?: string } }) => (
    <View>
      <View
        style={[
          styles.messageContainer,
          item.sender === 'me' ? styles.myMessage : styles.theirMessage,
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
      {item.sender === 'me' && item.exp !== undefined && (
        <View style={styles.expContainer}>
          <Text style={styles.expText}>
            {item.exp > 0 ? '+' : ''}
            {item.exp} exp
          </Text>
          <Image
            source={item.exp > 0 ? require('../../../assets//emoji/smile-kitty.png') : require('../../../assets/emoji/cry-kitty.png')}
            style={styles.characterIcon}
          />
        </View>
      )}
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
