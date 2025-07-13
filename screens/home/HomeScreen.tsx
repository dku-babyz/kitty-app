import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

/* ─── 이미지 리소스 ─── */
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

const kitty       = require('../../assets/logo/kitty1.png');
const shopIcon    = require('../../assets/icon/shop.png');
const reportIcon  = require('../../assets/icon/report.png');

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const progress = 0.45;                       // Lv.5 경험치 45 % 예시

  return (
    <SafeAreaView style={styles.screen}>
      {/* ── Header ── */}
      <View style={styles.header}>
        {/* Lv.5 + Progress */}
        <View style={styles.levelBox}>
          <Text style={styles.levelText}>Lv. 5</Text>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* 상점 → 통계분석 아이콘 */}
        <View style={styles.iconBox}>
          <TouchableOpacity activeOpacity={0.7}>
            <Image source={shopIcon} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Image source={reportIcon} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 본문 ── */}
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* 고양이 카드 */}
        <View style={styles.kittyBlock}>
          <Image source={kitty} style={styles.kittyImg} />
          <Text style={styles.caption}>행복한 키티</Text>
        </View>

        {/* 일기 카드 */}
        <TouchableOpacity style={styles.diaryCard} onPress={() => navigation.navigate('Diary')}>
          <Text style={styles.diaryTitle}>🌧️ 비 오는 날의 속삭임</Text>
          <Text style={styles.diaryText}>
            오늘은 비가 촉촉히 내리는 하루였어. 주인님은 친구와 대화를 하면서 “지겹다”, “싫어”
            같은 말들을 자주 했어. 기분이 많이 가라앉아 있는 것 같아서 나도 마음이 무거웠어.
            나무 아래에서 비를 피하며 주인님의 말을 듣는 기분이었달까… 그런데 마지막에 친구가
            “괜찮아, 네 얘기 들어줄게”라고 말해줘서 주인님이 살짝 웃더라. 그 순간, 나도 빗속에서
            무지개를 본 느낌이었어. 앞으로는 주인님이 조금 더 따뜻한 말들을 해주면 좋겠다고
            살짝 기대해봤어. 🌧️
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────────────── */
/*                            Styles                        */
const styles = StyleSheet.create({
  /* Screen */
  screen: {
    flex: 1,
    backgroundColor: '#dbeafe',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  levelBox: { flexDirection: 'row', alignItems: 'center' },

  /* Lv.5 텍스트: 12 → 16  (≈ 1.3×) */
  levelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 8,            // 6 × 1.3 ≈ 8
  },

  /* 경험치 바: 120×10 → 156×13 */
  progressBg: {
    width: 156,
    height: 13,
    backgroundColor: '#E5E7EB',
    borderRadius: 7,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: 7,
  },

  /* 아이콘: 32×32 → 42×42, 간격 28 → 36 */
  iconBox: { flexDirection: 'row', columnGap: 1 },
  icon:    { width: 42, height: 42, resizeMode: 'contain' },

  /* Body */
  body: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /* Kitty Block (이미지 + 캡션) */
  kittyBlock: {
    alignItems: 'center',
    marginTop: 120,              // 화면 중앙보다 아래로
  },
  kittyImg: {
  width: '130%',        // 화면 너비의 70 %만 차지
  aspectRatio: 1,      // 정사각형 비율 유지
  resizeMode: 'contain',
},
  caption: {
    marginTop: 16,
    fontWeight: '700',
    fontSize: 18,
    color: '#111827',
  },

  /* Diary */
  diaryCard: {
    marginTop: 64,               // 고양이 카드와 간격
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  diaryTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10,
    color: '#374151',
  },
  diaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
});
