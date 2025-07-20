import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { AuthContext } from '../context/AuthContext';

/* ── 캐릭터 이미지 3종 ── */
const kitty3 = require('../assets/logo/kitty3.png');
const kitty4 = require('../assets/logo/kitty4.png');
const kitty5 = require('../assets/logo/kitty5.png');

const characters = [kitty3, kitty4, kitty5];
const badWords = ['비난', '폭력적', '선정적', '정신적'];

export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const authContext = useContext(AuthContext);

  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'남자' | '여자'>('남자');
  const [charIdx, setCharIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  // 유저 정보가 아직 없으면 로딩 화면
  if (!authContext || !authContext.user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading user profile...</Text>
      </View>
    );
  }

  const { user } = authContext;

  const toggleWord = (word: string) => {
    setSelectedWords(prev =>
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word],
    );
  };

  const handleStart = () => {
    if (!age) {
      Alert.alert('알림', '나이를 입력해 주세요.');
      return;
    }
    // TODO: 서버 저장 등 로직
    Alert.alert('프로필 설정 완료', '홈 화면으로 이동합니다.');
    navigation.replace('Main');
  };

  const handleLogout = () => {
    authContext.logout();
    Alert.alert('로그아웃', '로그아웃 되었습니다.');
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>프로필 설정</Text>

      {/* 이름 */}
      <Text style={styles.label}>이름</Text>
      <Text style={styles.profileText}>{user.username}</Text>

      {/* 나이 */}
      <Text style={styles.label}>나이</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        style={styles.input}
        keyboardType="number-pad"
      />

      {/* 성별 */}
      <Text style={styles.label}>성별</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={gender} onValueChange={v => setGender(v)}>
          <Picker.Item label="남자" value="남자" />
          <Picker.Item label="여자" value="여자" />
        </Picker>
      </View>

      {/* 캐릭터 선택 */}
      <Text style={styles.label}>캐릭터 선택</Text>
      <View style={styles.charRow}>
        {characters.map((src, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.charCircle,
              charIdx === idx && styles.charSelected,
            ]}
            onPress={() => setCharIdx(idx)}>
            <Image source={src} style={styles.charImage} />
          </TouchableOpacity>
        ))}
      </View>

      {/* 비선호 분야 */}
      <Text style={styles.label}>비선호 분야 선택</Text>
      <View style={styles.badWordRow}>
        {badWords.map(word => (
          <TouchableOpacity
            key={word}
            style={[
              styles.badChip,
              selectedWords.includes(word) && styles.badChipSelected,
            ]}
            onPress={() => toggleWord(word)}>
            <Text
              style={[
                styles.badChipText,
                selectedWords.includes(word) && styles.badChipTextSel,
              ]}>
              {word}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 시작하기 */}
      <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
        <Text style={styles.startText}>시작하기</Text>
      </TouchableOpacity>

      {/* 로그아웃 */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ── 스타일 ── */
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8f0ff',
    paddingHorizontal: 30,
    paddingVertical: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  label: {
    alignSelf: 'flex-start',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  profileText: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#111827',
    marginTop: 4,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 4,
    fontSize: 16,
  },
  pickerWrapper: {
    width: '100%',
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 4,
  },
  charRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  charCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  charSelected: {
    borderColor: '#2563eb',
  },
  charImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  badWordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  badChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  badChipSelected: {
    backgroundColor: '#2563eb',
  },
  badChipText: {
    fontSize: 13,
    color: '#374151',
  },
  badChipTextSel: {
    color: '#fff',
    fontWeight: '600',
  },
  startBtn: {
    marginTop: 28,
    backgroundColor: '#2563eb',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  startText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutBtn: {
    marginTop: 12,
    backgroundColor: '#ef4444',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f0ff',
  },
});
