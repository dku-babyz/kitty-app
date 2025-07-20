// ChatScreen.tsx   (PlusScreen 대체)
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://220.149.244.87:8000';

interface ProcessTextRes {
  original_text: string;
  processed_text: string; // plain or JSON string
}

const sanitizeMessage = (res: ProcessTextRes) => {
  let safeText = res.processed_text;
  let isHarmful = false;
  let meta: Record<string, any> | null = null;

  try {
    meta = JSON.parse(res.processed_text);
    safeText = meta['대체 문장'] ?? res.processed_text;
    isHarmful = true;
  } catch {
    /* not harmful */
  }
  return { safeText, isHarmful, meta };
};

type Msg = { id: string; text: string };

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList<Msg>>(null);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post<ProcessTextRes>(
        `${API_BASE_URL}/process_text`,
        { text: trimmed },
        { timeout: 8000 },
      );

      const { safeText } = sanitizeMessage(data);

      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), text: safeText },
      ]);

      // 스크롤 맨 아래로
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      console.error('Error calling /process_text:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: '(전송 실패: 서버 오류)',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Msg }) => (
    <View style={styles.bubble}>
      <Text style={styles.bubbleText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="메시지를 입력하세요"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, loading && { opacity: 0.5 }]}
          onPress={handleSend}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ── 스타일 ── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  list: { padding: 16 },
  bubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1fae5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '85%',
  },
  bubbleText: { fontSize: 15, color: '#111827' },
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: '#fff', fontWeight: '600' },
});
