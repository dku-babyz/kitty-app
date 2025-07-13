// QuestScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

/* ── 네비게이션 타입 ── */
type RootStackParamList = { Quest: undefined };
type Navigation = NativeStackNavigationProp<RootStackParamList>;

/* ── 학습 카드 데이터 ── */
interface WordCard {
  bad: string;
  reason: string;
  alternative: string;
}

const WORDS: WordCard[] = [
  {
    bad: '짜증나',
    reason:
      "'짜증'이라는 말은 듣는 사람을 답답하고 화나게 만들 수 있어요. 친구의 기분을 상하게 하고 대화를 어렵게 만들 수 있습니다.",
    alternative: '“조금 속상해.” 또는 “내 생각과 달라서 아쉬워.”',
  },
  {
    bad: '진짜 돌겠네',
    reason:
      '과격한 표현은 듣는 사람에게 불안감·불쾌감을 줄 수 있어요. 문제 상황보다 감정을 크게 부풀려 전달하게 됩니다.',
    alternative: '“많이 당황했어.” 또는 “좀 힘들어.”',
  },
  {
    bad: '너 왜 이래',
    reason:
      '상대방을 비난하는 뉘앙스를 주어 방어적 반응을 일으킵니다. 건설적인 대화를 방해할 수 있어요.',
    alternative: '“혹시 무슨 일 있어?” 또는 “조금 놀랐어.”',
  },
];

const QuestScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex(i => (i === 0 ? WORDS.length - 1 : i - 1));
  const goNext = () => setIndex(i => (i === WORDS.length - 1 ? 0 : i + 1));

  const handleOk = () => {
    Alert.alert('경험치 상승!', '+exp 10');
    goNext();
  };

  const { bad, reason, alternative } = WORDS[index];

  return (
    <SafeAreaView style={styles.screen}>
      {/* ── 헤더 ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backBtnTxt}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>단어 학습</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── 단어 + 화살표 ── */}
      <View style={styles.wordRow}>
        <TouchableOpacity onPress={goPrev}>
          <Text style={styles.sideArrow}>‹</Text>
        </TouchableOpacity>

        <View style={styles.badWordBox}>
          <Text style={styles.badWordText}>{bad}</Text>
        </View>

        <TouchableOpacity onPress={goNext}>
          <Text style={styles.sideArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* ── 카드(Box) ── */}
      <View style={styles.cardBox}>
        <ScrollView
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subTitle}>🤔 이 말은 왜 나쁠까요?</Text>
          <Text style={styles.paragraph}>{reason}</Text>

          <Text style={[styles.subTitle, { marginTop: 16 }]}>
            💡 이렇게 바꿔 말해봐요!
          </Text>
          <Text style={styles.paragraph}>
            {alternative} 라고 말하면 친구가 내 마음을 더 잘 이해해줄 거예요.
          </Text>
        </ScrollView>
      </View>

      {/* ── 카드 바로 아래 버튼 ── */}
      <TouchableOpacity style={styles.okBtn} onPress={handleOk}>
        <Text style={styles.okBtnText}>다음에 잘 사용할게요!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default QuestScreen;

/* ── 스타일 ── */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#dbeafe' },

  /* 헤더 */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: { padding: 4 },
  backBtnTxt: { fontSize: 22, color: '#1f2937' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },

  /* 단어 & 화살표 */
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 12,
  },
  sideArrow: { fontSize: 38, color: '#1f2937', paddingHorizontal: 14 },
  badWordBox: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 28,
    paddingVertical: 8,
    borderRadius: 8,
  },
  badWordText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },

  /* 카드(Box) */
  cardBox: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    maxHeight: '55%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    padding: 20,
  },
  subTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#1f2937' },
  paragraph: { fontSize: 14, lineHeight: 20, color: '#374151' },

  /* 버튼(카드 바로 아래) */
  okBtn: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  okBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
