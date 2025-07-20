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
import type { RootStackParamList } from '../../types/navigation';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

/* ── 퀴즈 데이터 (2문항) ── */
interface QuizItem {
  question: string;
  options: string[];
}
const QUIZZES: QuizItem[] = [
  {
    question: '"ㅈㄹ" 대신 쓸 수 있는 유해하지 않은 표현은?',
    options: [
      '“속상해”',               // 0번 (정답)
      '“정말 어이없었어”',
      '“환장하겠네 진짜”',
      '“완전 개판이었어”',
    ],
  },
  {
    question: '"씨발" 대신 쓸 수 있는 유해하지 않은 표현은?',
    options: [
      '“많이 당황했어.”',       // 0번 (정답)
      '“좀 힘들어.”',
      '“정말 어이없었어”',
      '“내 생각과 달라서 아쉬워.”',
    ],
  },
];

export default function QuizScreen() {
  const navigation = useNavigation<Navigation>();
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const quiz = QUIZZES[qIndex];
  const correctIndex = 0; // 항상 첫 번째가 정답

  const handleCheck = () => {
    if (selected === null) {
      Alert.alert('알림', '먼저 보기를 선택해주세요.');
      return;
    }
    if (selected === correctIndex) {
      Alert.alert('정답입니다!', '경험치 +10 획득🎉');
    } else {
      Alert.alert('아쉽지만…', '틀렸어요. 다시 시도해보세요.');
    }
  };

  const handleNext = () => {
    if (qIndex < QUIZZES.length - 1) {
      // 다음 문제로
      setQIndex(qIndex + 1);
      setSelected(null);
    } else {
      // 마지막 문제 후에는 뒤로
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* 헤더 */}
      <Text style={styles.header}>퀴즈 {qIndex + 1}/{QUIZZES.length}</Text>

      {/* 문항 카드 */}
      <View style={styles.cardBox}>
        <Text style={styles.question}>{quiz.question}</Text>
        {quiz.options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.option,
              selected === i && styles.optionSelected,
            ]}
            onPress={() => setSelected(i)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 정답 확인하기 */}
      <TouchableOpacity style={styles.checkBtn} onPress={handleCheck}>
        <Text style={styles.checkBtnText}>정답 확인하기</Text>
      </TouchableOpacity>

      {/* 다음 문제 / 완료 */}
      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextBtnText}>다음</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#dbeafe', padding: 16 },
  header: { fontSize: 18, fontWeight: '600', alignSelf: 'center', marginBottom: 12 },

  cardBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  question: { fontSize: 16, fontWeight: '500', marginBottom: 12 },
  option: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  optionSelected: { borderColor: '#2563eb', backgroundColor: '#e0f2fe' },
  optionText: { fontSize: 15 },

  checkBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  checkBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  nextBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
