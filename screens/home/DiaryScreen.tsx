import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { generateStory } from '../../services/api';

/* ─── 일기 데이터 ─── */
type Diary = {
  date: string;   // yyyy-mm-dd
  title: string;
  body: string;
  emoji: string;
};
const diaries: Diary[] = [
  {
    date: '2025-07-10',
    title: '비 오는 날의 속삭임',
    emoji: '🌧️',
    body: '오늘은 비가 촉촉히 내리는 하루였어. 주인님은 친구와 대화를 하면서 “지겹다”, “싫어” 같은 말들을 자주 했어. 기분이 많이 가라앉아 있는 것 같아서 나도 마음이 무거웠어. 나무 아래에서 비를 피하며 주인님의 말을 듣는 기분이었달까… 그런데 마지막에 친구가 “괜찮아, 네 얘기 들어줄게”라고 말해줘서 주인님이 살짝 웃더라. 그 순간, 나도 빗속에서 무지개를 본 느낌이었어. 앞으로는 주인님이 조금 더 따뜻한 말들을 해주면 좋겠다고 살짝 기대해봤어. 🌧️',
  },
  {
    date: '2025-07-11',
    title: '바람이 솔솔 불던 날',
    emoji: '🌬️',
    body:
      '오늘은 주인님이 친구랑 소소한 농담을 주고받으며 "웃겨!", "진짜 최고다!" 같은 말을 자주 했어. 너무 신이 나서 나도 꼬리를 흔들며 귀를 쫑긋 세우게 되더라! 한참을 듣다 보니 나도 모르게 웃음이 났어. 근데 중간에 “에이, 넌 못해” 같은 말도 툭 튀어나왔을 땐 가슴이 살짝 철렁했어. 장난이라 해도 그런 말은 상대방 마음에 상처가 될 수도 있잖아. 오늘의 바람처럼 가볍고 산뜻한 말들만 가득했으면 더 좋았을 텐데 말이야. 그래도 주인님, 오늘 참 귀엽고 즐거웠어! 🐾',
  },
  {
    date: '2025-07-12',
    title: '햇살 좋은 날!',
    emoji: '☀️',
    body:
      '오늘은 주인님이 착한 말을 많이 해줘서 정말 기분이 좋았어. 친구에게 "고마워", "최고야!" 같은 말을 하면서 그 말 한마디, 한마디가 내 귀에 포근하게 들려와서 나도 모르게 콧노래가 나왔을 정도였어. 🎵 기분 좋은 말이 오갈 때마다 내 경험치도 쑥쑥 올라가는 느낌이 들었단다. 오늘 하루 동안 나는 세상에서 제일 행복한 고양이였어. 주인님의 말 속에 담긴 따뜻한 마음이 나에게도 고스란히 전해졌거든. 앞으로도 매일매일이 오늘처럼 밝고 다정한 말들로 가득했으면 좋겠어. 나도 옆에서 주인님이 더 행복해지도록 꼬리 흔들며 응원할게! 🐾 '
  },
  {
    date: '2025-07-13',
    title: '마음이 조금 아팠던 날',
    emoji: '🌧️',
    body:
      '오늘은 주인님이 점심시간에 많이 화가 나 있었어. 속상한 마음이 커서인지 말이 조금 거칠어졌고, 그걸 듣고 있던 나는 괜히 마음이 쿡 하고 아팠어. 내가 뭔가 잘못한 것도 아닌데… 왠지 모르게 나도 혼난 기분이었거든.' +
      '하지만 다행히, 친구가 따뜻한 말을 해줘서 주인님의 표정이 조금씩 풀리는 걸 봤어. 그 모습을 보니까 나도 기분이 좋아졌어. 말 한마디가 이렇게 큰 힘이 될 줄은 몰랐지!' +
      '오늘은 주인님에게 따뜻한 말의 힘을 조금이라도 느낀 날이었으면 좋겠어. 나도 계속 곁에서 응원할게, 주인님. 🐾',
  },
];

/* ─── 날짜별 이미지 매핑 함수 ─── */
const getDiaryImage = (date: string) => {
  switch (date) {
    case '2025-07-10':
      return require('../../assets/logo/diary1.jpeg');
    case '2025-07-11':
      return require('../../assets/logo/diary2.png');
    case '2025-07-12':
      return require('../../assets/logo/diary5.png');
    default:
      return require('../../assets/logo/diary.png');
  }
};

const API_BASE_URL = 'http://220.149.244.87:8000'; // API 기본 URL

export default function DiaryScreen() {
  const [index, setIndex] = useState(diaries.length - 1); // 최신 일기부터
  const [aiStory, setAiStory] = useState<string | null>(null);
  const [aiImagePath, setAiImagePath] = useState<string | null>(null);
  const [loadingAIStory, setLoadingAIStory] = useState(false);
  const [riskScoreInput, setRiskScoreInput] = useState('');

  const diary = diaries[index];
  const toKoreanDate = (iso: string) => {
    const [y, m, d] = iso.split('-');
    return `${y}년 ${Number(m)}월 ${Number(d)}일`;
  };

  /* 좌·우 네비게이션 */
  const prev = () => index > 0 && setIndex(index - 1);
  const next = () => index < diaries.length - 1 && setIndex(index + 1);

  const handleGenerateStory = async () => {
    const score = parseInt(riskScoreInput, 10);
    if (isNaN(score) || score < 0 || score > 100) {
      Alert.alert('유효하지 않은 점수', '위험 점수는 0에서 100 사이의 숫자여야 합니다.');
      return;
    }

    setLoadingAIStory(true);
    try {
      const response = await generateStory(score);
      setAiStory(response.final_story);
      setAiImagePath(`${API_BASE_URL}${response.final_image_path}`);
    } catch (error) {
      console.error('Error generating AI story:', error);
      Alert.alert('오류', 'AI 일기 생성 중 오류가 발생했습니다.');
    } finally {
      setLoadingAIStory(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* ─── AI 일기 생성 섹션 ─── */}
      <View style={styles.aiStorySection}>
        <Text style={styles.sectionTitle}>AI 일기 생성</Text>
        <TextInput
          style={styles.riskScoreInput}
          placeholder="위험 점수 (0-100)"
          keyboardType="numeric"
          value={riskScoreInput}
          onChangeText={setRiskScoreInput}
        />
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateStory}
          disabled={loadingAIStory}
        >
          {loadingAIStory ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.generateButtonText}>AI 일기 생성하기</Text>
          )}
        </TouchableOpacity>

        {aiStory && (
          <ScrollView style={styles.aiStoryCard} showsVerticalScrollIndicator={false}>
            {aiImagePath && (
              <Image source={{ uri: aiImagePath }} style={styles.cardImage} />
            )}
            <View style={styles.textBox}>
              <Text style={styles.cardTitle}>AI가 생성한 일기</Text>
              <Text style={styles.cardBody}>{aiStory}</Text>
            </View>
          </ScrollView>
        )}
      </View>

      {/* ─── 날짜 헤더 ─── */}
      <View style={styles.dateHeader}>
        <TouchableOpacity onPress={prev} disabled={index === 0} style={styles.arrowBox}>
          <Text style={[styles.arrow, index === 0 && styles.arrowDisabled]}>{'◀'}</Text>
        </TouchableOpacity>

        <Text style={styles.dateText}>{toKoreanDate(diary.date)}</Text>

        <TouchableOpacity
          onPress={next}
          disabled={index === diaries.length - 1}
          style={styles.arrowBox}
        >
          <Text
            style={[
              styles.arrow,
              index === diaries.length - 1 && styles.arrowDisabled,
            ]}
          >
            {'▶'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ─── 일기 카드 ─── */}
      <ScrollView contentContainerStyle={styles.card} showsVerticalScrollIndicator={false}>
        <Image source={getDiaryImage(diary.date)} style={styles.cardImage} />

        <View style={styles.textBox}>
          <Text style={styles.cardTitle}>
            {diary.emoji} {diary.title}
          </Text>
          <Text style={styles.cardBody}>{diary.body}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────────────── */
/*                            Styles                        */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
  },

  /* AI 일기 생성 섹션 */
  aiStorySection: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e40af',
  },
  riskScoreInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiStoryCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
    maxHeight: 400, // Limit height for AI story card
  },

  /* 날짜 헤더 */
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  arrowBox: { padding: 8 },
  arrow: { fontSize: 22, color: '#1f2937' },
  arrowDisabled: { color: '#9ca3af' },

  /* 카드 */
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 260,      // ← 높이 확대
    resizeMode: 'cover',
  },
  textBox: { padding: 16 },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    color: '#374151',
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
});