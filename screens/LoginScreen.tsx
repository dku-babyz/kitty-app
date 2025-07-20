import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

import { login } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { saveToken } from '../utils/auth';

/* ── 로고 ── */
const kittyLogo = require('../assets/logo/kitty_logo1.png');

export default function LoginScreen() {
  /* ── 네비게이션 & 컨텍스트 ── */
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const authContext = useContext(AuthContext);

  /* ── 로컬 상태 ── */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  /* ── 로그인 핸들러 ── */
  const handleLogin = useCallback(async () => {
    if (!username || !password) {
      setErrorMsg('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { token, user } = await login(username, password);

      await saveToken(token.access_token);
      authContext?.login(token.access_token, user);

      Alert.alert('로그인 성공', '환영합니다!', [
        { text: '확인', onPress: () => navigation.navigate('Main') },
      ]);
    } catch (err: any) {
      const rawErrorData = err.response?.data;
      let errorMessage = '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';

      if (Array.isArray(rawErrorData)) {
        errorMessage = rawErrorData.map((e: any) => e.msg).join('\n');
      } else if (rawErrorData?.detail) {
        errorMessage = rawErrorData.detail;
      }

      setErrorMsg(errorMessage);
      console.error('Login error:', rawErrorData || err.message);
    } finally {
      setLoading(false);
    }
  }, [username, password, navigation, authContext]);

  /* ── 렌더 ── */
  return (
    <View style={styles.container}>
      <Image source={kittyLogo} style={styles.logo} resizeMode="contain" />

      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>로그인</Text>
        )}
      </TouchableOpacity>

      {/* ── 회원가입 링크 ── */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>계정이 없으신가요? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ── 스타일 ── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  logo: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    marginBottom: 32,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#ef4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#374151',
  },
  signUpText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
});
