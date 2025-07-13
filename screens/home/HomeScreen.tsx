import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

/* ─── 이미지 리소스 ─── */
const kitty      = require('../../assets/logo/kitty1.png');
const shopIcon   = require('../../assets/icon/shop.png');
const reportIcon = require('../../assets/icon/report.png');
const questIcon  = require('../../assets/icon/work.png');   // 퀘스트 아이콘

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const progress    = 0.45; // Lv.5 경험치 45 %
  const questCount  = 5;    // 현재 퀘스트 개수 (0이면 뱃지 숨김)

  return (
    <SafeAreaView style={styles.screen}>
      {/* ─── Header ─── */}
      <View style={styles.header}>
        {/* 왼쪽: 레벨 + 진행바 + 퀘스트 */}
        <View style={styles.leftBox}>
          {/* Lv.5 + Progress */}
          <View style={styles.levelBox}>
            <Text style={styles.levelText}>Lv. 5</Text>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
          </View>

          {/* 퀘스트 아이콘 + 뱃지 */}
          <TouchableOpacity activeOpacity={0.7} style={styles.questWrapper}>
            <Image source={questIcon} style={styles.questIcon} />
            {/* 뱃지: questCount > 0 일 때만 표시 */}
            <View
              style={[
                styles.badge,
              ]}
            >
              <Text style={styles.badgeText}>{questCount}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 오른쪽: 상점 → 통계분석 */}
        <View style={styles.iconBox}>
          <TouchableOpacity activeOpacity={0.7}>
            <Image source={shopIcon} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Report')}>
            <Image source={reportIcon} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── 본문 ─── */}
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* 고양이 카드 */}
        <View style={styles.kittyBlock}>
          <Image source={kitty} style={styles.kittyImg} />
          <Text style={styles.caption}>슬픈 키티</Text>
        </View>

        {/* 일기 카드 */}
        <TouchableOpacity style={styles.diaryCard} onPress={() => navigation.navigate('Diary')}>
          <Text style={styles.diaryTitle}>🌧️ 마음이 조금 아팠던 날</Text>
          <Text style={styles.diaryText}>
            오늘은 주인님이 점심시간에 많이 화가 나 있었어.
            속상한 마음이 커서인지 말이 조금 거칠어졌고,
            그걸 듣고 있던 나는 괜히 마음이 쿡 하고 아팠어.
            내가 뭔가 잘못한 것도 아닌데…
            왠지 모르게 나도 혼난 기분이었거든.
            하지만 다행히, 친구가 따뜻한 말을 해줘서
            주인님의 표정이 조금씩 풀리는 걸 봤어.
            그 모습을 보니까 나도 기분이 좋아졌어.
            말 한마디가 이렇게 큰 힘이 될 줄은 몰랐지!
            오늘은 주인님에게 따뜻한 말의 힘을
            조금이라도 느낀 날이었으면 좋겠어.
            나도 계속 곁에서 응원할게, 주인님. 🐾
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────────────── */
/*                            Styles                        */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#dbeafe' },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  leftBox: {
    flexDirection: 'column',
  },

  /* 레벨 + 진행바 */
  levelBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  levelText: { fontSize: 16, fontWeight: '700', color: '#2563EB', marginRight: 8 },
  progressBg: { width: 156, height: 13, backgroundColor: '#E5E7EB', borderRadius: 7, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FBBF24', borderRadius: 7 },

  /* 퀘스트 아이콘 */
  questWrapper: { alignSelf: 'flex-start' },
  questIcon: { width: 40, height: 40, resizeMode: 'contain' },

  /* 뱃지 */
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',   // red-500
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  /* 오른쪽 아이콘 (상점, 통계) */
  iconBox: { flexDirection: 'row', columnGap: 36 },
  icon: { width: 42, height: 42, resizeMode: 'contain' },

  /* Body */
  body: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /* 고양이 카드는 그대로 */
  kittyBlock: { alignItems: 'center', marginTop: 120 },
  kittyImg:   { width: '130%', aspectRatio: 1, resizeMode: 'contain' },
  caption:    { marginTop: 16, fontWeight: '700', fontSize: 18, color: '#111827' },

  /* Diary */
  diaryCard: {
    marginTop: 64,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  diaryTitle: { fontWeight: '700', fontSize: 16, marginBottom: 10, color: '#374151' },
  diaryText:  { fontSize: 15, lineHeight: 22, color: '#374151' },
});
