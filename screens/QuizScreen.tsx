// screens/QuizScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Quiz: undefined;
  Quest: undefined;
};

type Navigation = NativeStackNavigationProp<RootStackParamList>;

/* ── 예시 퀴즈 데이터 ── */
interface QuizItem {
  question: string;
  options: string[];
  answer: number; // 정답 인덱스
}

const QUIZ: QuizItem[] = [
  {
    question: '"ㅈㄹ" 대신 쓸 수 있는 유해하지 않은 표현은?',
    options: ['“속상해”', '"정말 어이없었어”', '“환장하겠네 진짜”', '“완전 개판이었어”'],
    answer: 0,
  },
  {
    question: '"좆같다"의 대체 표현으로 적절한 것은?',
    options: ['“조금 속상해”', '“엄청 좋아!”', '“배고파”', '“졸려”'],
    answer: 0,
  },
];

export default function QuizScreen() {
  const navigation = useNavigation<Navigation>();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const item = QUIZ[idx];
  const isLast = idx === QUIZ.length - 1;

  const handleNext = () => {
    setSelected(null);
    if (isLast) {
      // TODO: 결과 화면으로 이동하거나 Alert
      navigation.goBack();
    } else {
      setIdx(i => i + 1);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTxt}>퀴즈&nbsp;{idx + 1}/{QUIZ.length}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 문제 카드 */}
      <View style={styles.card}>
        <Text style={styles.qText}>{item.question}</Text>
        <FlatList
          data={item.options}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item: opt, index }) => (
            <TouchableOpacity
              style={[
                styles.option,
                selected === index && styles.optionSel,
              ]}
              onPress={() => setSelected(index)}>
              <Text
                style={[
                  styles.optTxt,
                  selected === index && styles.optTxtSel,
                ]}>
                {opt}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[
          styles.nextBtn,
          selected === null && { opacity: 0.4 },
        ]}
        disabled={selected === null}
        onPress={handleNext}>
        <Text style={styles.nextTxt}>{isLast ? '완료' : '다음'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ── 스타일 ── */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#dbeafe', paddingHorizontal: 20 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    justifyContent: 'space-between',
  },
  back: { fontSize: 22, color: '#1f2937' },
  headerTxt: { fontSize: 18, fontWeight: '700', color: '#1f2937' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    flex: 1,
    elevation: 2,
  },
  qText: { fontSize: 16, fontWeight: '700', marginBottom: 16, color: '#1f2937' },

  option: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  optionSel: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  optTxt: { fontSize: 15, color: '#374151' },
  optTxtSel: { color: '#1e40af', fontWeight: '700' },

  nextBtn: {
    alignSelf: 'center',
    marginVertical: 20,
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 30,
  },
  nextTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
