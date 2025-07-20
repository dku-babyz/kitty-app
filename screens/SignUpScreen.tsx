import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../types/navigation";
import { createUser, type UserCreate } from "../services/api";

/***************
 * CONSTANTS  *
 ***************/
const REGEX = {
  id: /^[A-Za-z\d]{4,12}$/,
  phone: /^\d{10,11}$/,
  password:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}|\\:;'"<>.,.?/~`+=_-]).{8,}$/,
} as const;

/*********************
 * COMPONENT         *
 *********************/
export default function SignUpScreen() {
  // ─── Navigation ───────────────────────────────────────────────────────────────
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ─── Local State ─────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    userId: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const onChange = useCallback(
    (key: keyof typeof form, value: string) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const { userId, phone, password, passwordConfirm } = form;

  const isValid = useMemo(() => {
    if (!REGEX.id.test(userId))
      return "아이디 형식이 올바르지 않습니다. (영문, 숫자 4~12자)";
    if (!REGEX.phone.test(phone.replace(/-/g, "")))
      return "전화번호 형식이 올바르지 않습니다.";
    if (!REGEX.password.test(password))
      return "비밀번호 형식이 올바르지 않습니다. (영문, 숫자, 특수문자 포함 8자 이상)";
    if (password !== passwordConfirm) return "비밀번호가 일치하지 않습니다.";
    return "";
  }, [userId, phone, password, passwordConfirm]);

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSignUp = async () => {
    setError(isValid);
    if (isValid) return;

    setLoading(true);
    try {
      const payload: UserCreate = {
        username: userId.trim(),
        phone_number: phone.replace(/-/g, ""),
        password,
      };
      await createUser(payload);
      Alert.alert("회원가입 완료", "로그인 페이지로 이동합니다.", [
        { text: "확인", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (e: any) {
      console.error("Sign up error:", e.response?.data || e.message);
      setError(e.response?.data?.detail || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      {/** 아이디 */}
      <Label text="아이디" />
      <TextInput
        value={userId}
        onChangeText={(v) => onChange("userId", v)}
        style={styles.input}
        autoCapitalize="none"
      />

      {/** 전화번호 */}
      <Label text="전화번호" />
      <TextInput
        value={phone}
        onChangeText={(v) => onChange("phone", v)}
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="01012345678"
      />

      {/** 비밀번호 */}
      <Label text="비밀번호" />
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={(v) => onChange("password", v)}
        style={styles.input}
      />
      <Text style={styles.helper}>* 영문, 숫자, 특수문자 포함 8자 이상</Text>

      {/** 비밀번호 확인 */}
      <Label text="비밀번호 확인" />
      <TextInput
        secureTextEntry
        value={passwordConfirm}
        onChangeText={(v) => onChange("passwordConfirm", v)}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>회원가입</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footer}>
        이미 계정이 있으신가요?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>로그인</Text>
      </Text>
    </View>
  );
}

/*********************
 * SUB‑COMPONENTS    *
 *********************/
const Label = ({ text }: { text: string }) => (
  <Text style={styles.label}>{text}</Text>
);

/*********************
 * STYLES            *
 *********************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f0ff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 32,
  },
  label: {
    alignSelf: "flex-start",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 4,
    fontSize: 16,
  },
  helper: {
    alignSelf: "flex-start",
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  error: {
    alignSelf: "flex-start",
    marginTop: 4,
    fontSize: 13,
    color: "#dc2626",
    fontWeight: "600",
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 24,
    fontSize: 14,
    color: "#555",
  },
  link: {
    color: "#2563eb",
    fontWeight: "bold",
  },
});
