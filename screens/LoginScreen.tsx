// LoginScreen.tsx
import React from 'react';
import {
  View,
  Text,          // ← 반드시 포함
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

/* ── 로고 이미지 ── */
const kittyLogo = require('../assets/logo/kitty_logo1.png');

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* ── 로고 이미지 ── */}
      <Image source={kittyLogo} style={styles.logo} resizeMode="contain" />

      {/* ── 입력 필드 ── */}
      <TextInput
        placeholder="아이디"
        placeholderTextColor="#999"
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="비밀번호"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
      />

      {/* ── 로그인 버튼 ── */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.loginText}>로그인</Text>
      </TouchableOpacity>

      {/* ── 회원가입 링크 ── */}
      <Text style={styles.footer}>
        계정이 없으신가요?{' '}
        <Text
          style={styles.signup}
          onPress={() => navigation.navigate('SignUp')}>
          회원가입
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#2563eb',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: '#555',
  },
  signup: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
