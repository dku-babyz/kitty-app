// ReportScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';   
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

/* ─── 네비게이션 타입 (필요 시 수정) ─── */
type RootStackParamList = { Report: undefined };
type Navigation = NativeStackNavigationProp<RootStackParamList>;

/* ─── 진행률 바 ─── */
interface ProgressBarProps {
  ratio: number; // 0~1
  harmfulColor?: string;
  cleanColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  ratio,
  harmfulColor = '#ef4444',
  cleanColor = '#10b981',
}) => (
  <View style={styles.progressBg}>
    <View style={{ flex: ratio, backgroundColor: harmfulColor }} />
    <View style={{ flex: 1 - ratio, backgroundColor: cleanColor }} />
  </View>
);

/* ─── (A) 채팅 보고서 ─── */
const ChatReport: React.FC = () => (
  <ScrollView contentContainerStyle={styles.reportWrapper}>
    <Text style={styles.sectionTitle}>사용자 채팅 통계</Text>

    {/* 수신자 */}
    <Text style={styles.barLabel}>사용자(수신자) 입력</Text>
    <ProgressBar ratio={0.35} />
    <Text style={styles.barDesc}>유해 35% | 클린 65%</Text>
    <Text style={[styles.summaryText, { color: '#10b981' }]}>
      수신자의 입력은 클린합니다.
    </Text>

    {/* 발신자 */}
    <Text style={[styles.barLabel, { marginTop: 16 }]}>발신자 입력</Text>
    <ProgressBar ratio={0.73} />
    <Text style={styles.barDesc}>유해 73% | 클린 27%</Text>
    <Text style={[styles.summaryText, { color: '#ef4444' }]}>
      발신자의 입력은 유해합니다.
    </Text>

    {/* 유해 채팅 예시 */}
    <Text style={styles.sectionTitle}>유해 채팅 사용</Text>
    {['“야, 너 진짜 뭐냐?”', '“그렇게 살지 마라.”', '“짜증나게 하지마.”'].map(t => (
      <View key={t} style={styles.badExampleBox}>
        <Text style={styles.badExampleText}>{t}</Text>
      </View>
    ))}

    {/* TOP 3 */}
    <Text style={styles.sectionTitle}>주로 사용하는 유해 표현 TOP 3</Text>
    {['1. 진짜', '2. 뭐냐', '3. 짜증나'].map(t => (
      <Text key={t} style={styles.topThree}>
        {t}
      </Text>
    ))}

    {/* LLM 보고서 */}
    <Text style={styles.sectionTitle}>LLM 기반 유해성 보고서</Text>
    <Text style={styles.paragraph}>
      사용자의 채팅 내용을 분석한 결과, 발신자 측에서 부정적·공격적 어휘 사용이 다수
      감지되었습니다. “짜증”, “뭐냐” 등의 반복적 표현은 상대방에게 부정적 감정을 유발할 수
      있으므로 지속 모니터링이 필요합니다.
    </Text>
  </ScrollView>
);

/* ─── (B) 방문 사이트 보고서 ─── */
interface CategoryDatum {
  label: string;
  ratio: number; // 0~1
  color: string;
}

const CATEGORY_DATA: CategoryDatum[] = [
  { label: '비난', ratio: 0.45, color: '#8b5cf6' },
  { label: '폭력적', ratio: 0.65, color: '#ef4444' },
  { label: '선정적', ratio: 0.25, color: '#ec4899' },
  { label: '정신적', ratio: 0.35, color: '#eab308' },
];

/* ─ 정확한 퍼센트 도넛 ─ */
interface DonutProps {
  percent: number;                // 0–100
  size?: number;                  // 지름
  stroke?: number;                // 링 두께
  bgColor?: string;               // 회색 링
  fgColor?: string;               // 진행 색
}

const Donut: React.FC<DonutProps> = ({
  percent,
  size = 120,
  stroke = 12,
  bgColor = '#e5e7eb',
  fgColor = '#ef4444',
}) => {
  const clamped = Math.max(0, Math.min(percent, 100));
  const angle = clamped * 3.6;                    // 0–360°
  const rightAngle = Math.min(angle, 180);        // 0–180
  const leftAngle  = angle > 180 ? angle - 180 : 0; // 0–180

  /* 반원용 마스크 */
  const halfMask = (side: 'left' | 'right'): ViewStyle => ({
    position: 'absolute',
    width: size / 2,
    height: size,
    overflow: 'hidden',
    [side]: 0,
  });

  /* 실제 원(테두리) */
  const halfCircle: ViewStyle = {
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: stroke,
    borderColor: fgColor,
    top: 0,
    left: -size / 2,        // 원 중심을 마스크 중심에 맞춤
  };

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* 회색(배경) 링 */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: bgColor,
        }}
      />

      {/* 오른쪽 반원 : -90°(12시) → +90° 까지 */}
      <View style={halfMask('right')}>
        <View
          style={[
            halfCircle,
            {
              transform: [{ rotateZ: `${-90 + rightAngle}deg` }], // -90° 출발
            },
          ]}
        />
      </View>

      {/* 왼쪽 반원 : -90° → + (angle - 180)° */}
      {angle > 180 && (
        <View style={halfMask('left')}>
          <View
            style={[
              halfCircle,
              {
                transform: [{ rotateZ: `${-90 + leftAngle}deg` }],
              },
            ]}
          />
        </View>
      )}

      {/* 중앙 값 */}
      <View
        style={{
          position: 'absolute',
          width: size - stroke * 2,
          height: size - stroke * 2,
          borderRadius: (size - stroke * 2) / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#dbeafe',
        }}
      >
        <Text style={styles.bigPercent}>{clamped}%</Text>
      </View>
    </View>
  );
};



/* 사용자 vs 나이대 막대그래프 */
const BarComparison: React.FC = () => (
  <View style={styles.barCompareRow}>
    {/* 사용자 */}
    <View style={styles.singleBar}>
      <View style={[styles.barColumn, { height: 90, backgroundColor: '#c7d2fe' }]} />
      <Text style={styles.barColumnLabel}>사용자</Text>
    </View>
    {/* 나이대 평균 */}
    <View style={styles.singleBar}>
      <View style={[styles.barColumn, { height: 120, backgroundColor: '#d1d5db' }]} />
      <Text style={styles.barColumnLabel}>나이대 평균</Text>
    </View>
  </View>
);

const SiteReport: React.FC = () => (
  <ScrollView contentContainerStyle={styles.reportWrapper}>
    <Text style={styles.sectionTitle}>유해 사이트 방문 비율</Text>

    {/* 막대 비교 */}
    <BarComparison />

    {/* 도넛 */}
    <View style={{ alignItems: 'center', marginVertical: 18 }}>
      <Donut percent={50} />
      <Text style={[styles.paragraph, { marginTop: 8 }]}>
        사이트의 50 %가 잠재적 유해 사이트
      </Text>
    </View>

    {/* 범주별 비율 */}
    <Text style={styles.sectionTitle}>감지된 유해 사이트 범주 비율</Text>
    {CATEGORY_DATA.map(({ label, ratio, color }) => (
      <View key={label} style={{ marginBottom: 8 }}>
        <Text style={styles.barLabel}>{label}</Text>
        <View style={styles.progressBg}>
          <View style={{ flex: ratio, backgroundColor: color, borderRadius: 4 }} />
          <View style={{ flex: 1 - ratio }} />
        </View>
      </View>
    ))}

    {/* 최다 방문 유해 사이트 */}
    <Text style={styles.sectionTitle}>최다 방문 유해 사이트</Text>
    {[
      '1. http://example-harmful-site.com',
      '2. http://another-bad-site.net',
      '3. http://dangerous-web.org',
    ].map(site => (
      <Text key={site} style={styles.topThree}>
        {site}
      </Text>
    ))}

    {/* LLM 보고서 */}
    <Text style={styles.sectionTitle}>LLM 기반 유해성 보고서</Text>
    <Text style={styles.paragraph}>
      사용자의 인터넷 사용 패턴을 분석한 결과, 전체 방문 사이트 중 약 50%가 잠재적으로
      유해한 콘텐츠를 포함하고 있는 것으로 나타났습니다. 이는 동일 연령대 평균보다
      낮은 수치로서 비교적 안전한 사용 습관을 의미합니다. 다만 폭력적·정신 건강에
      부정적 영향을 줄 수 있는 사이트 방문이 포착되어 주의가 필요합니다.
    </Text>
  </ScrollView>
);

/* ─── 메인 스크린 ─── */
const ReportScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const [tab, setTab] = useState<'chat' | 'site'>('chat');

  return (
    <SafeAreaView style={styles.screen}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>리포트 분석</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* 탭 버튼 */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'chat' && styles.tabActive]}
          onPress={() => setTab('chat')}
        >
          <Text style={[styles.tabText, tab === 'chat' && styles.tabTextActive]}>
            사용자 채팅 보고서
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'site' && styles.tabActive]}
          onPress={() => setTab('site')}
        >
          <Text style={[styles.tabText, tab === 'site' && styles.tabTextActive]}>
            방문 사이트 유해성 보고서
          </Text>
        </TouchableOpacity>
      </View>

      {/* 본문 */}
      {tab === 'chat' ? <ChatReport /> : <SiteReport />}
    </SafeAreaView>
  );
};

export default ReportScreen;

/* ─── 스타일 ─── */
import { ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#dbeafe' },

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
  backButtonText: { fontSize: 22, color: '#1f2937' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },

  /* 탭 */
  tabRow: { flexDirection: 'row' },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#bfdbfe',
    alignItems: 'center',
  },
  tabActive: { backgroundColor: '#ffffff' },
  tabText: { fontSize: 14, color: '#475569' },
  tabTextActive: { fontWeight: 'bold', color: '#1e3a8a' },

  /* 공통 */
  reportWrapper: { padding: 16 },
  sectionTitle: { marginTop: 20, fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  paragraph: { marginTop: 8, fontSize: 14, lineHeight: 20, color: '#374151' },

  /* 진행률 바 */
  progressBg: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
  },
  barLabel: { fontSize: 14, color: '#1f2937', marginTop: 12 },
  barDesc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  summaryText: { fontSize: 13, marginTop: 2 },

  /* 예시 박스 */
  badExampleBox: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  badExampleText: { fontSize: 14, color: '#ef4444' },
  topThree: { fontSize: 14, color: '#1f2937', marginTop: 4 },

  /* 사용자 vs 나이대 막대그래프 */
  barCompareRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  singleBar: { alignItems: 'center' },
  barColumn: {
    width: 60,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barColumnLabel: { marginTop: 4, fontSize: 12, color: '#374151' },

  /* 도넛 중앙 퍼센트 */
  bigPercent: { fontSize: 32, fontWeight: 'bold', color: '#ef4444' },
});
