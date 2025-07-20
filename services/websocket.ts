// websocket.ts
// 전역 WebSocket API 사용 – 별도 import 필요 없음

/* ── 상수 및 Enum ── */
const WS_URL = 'ws://220.149.244.87:8000/ws';

/** readyState 비교용 enum (RN 타입 정의에 빠져있음) */
export enum WSReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

/* ── 메시지 타입 ── */
export interface ChatMessage {
  type: 'chat';
  content: string;
  sender_id: number;
  room_id: number;
}

export interface ServerMessage {
  type: 'new_message';
  message: {
    content: string;
    id: number;
    owner_id: number;
    room_id: number;
    character_state: string;
    experience_points: number;
    is_harmful: boolean;
    created_at: string;
  };
  user_update: {
    id: number;
    experience_points: number;
    character_state: string;
    harmful_chat_count: number;
  };
  quiz_results?: {
    bad_word: string;
    reason: string;
    quiz: string;
  }[];
  report_results?: {
    summary: string;
    advice: string;
  };
}

/* ── 모듈 스코프 변수 ── */
let ws: WebSocket | null = null;
let messageHandler: ((msg: ServerMessage) => void) | null = null;

/* ── WebSocket 연결 ── */
export const connectWebSocket = (
  roomId: number,
  onMessage: (msg: ServerMessage) => void,
) => {
  // 기존 연결이 있으면 닫기
  if (ws) ws.close();

  // 새 연결
  ws = new WebSocket(`${WS_URL}/${roomId}`);
  messageHandler = onMessage;

  /* ── 이벤트 바인딩 ── */
  ws.onopen = () => {
    console.log('WebSocket Connected');
    // 필요 시 join_room 전송
    // ws.send(JSON.stringify({ type: 'join_room' }));
  };

  ws.onmessage = (event: WebSocketMessageEvent) => {
    try {
      const data = JSON.parse(event.data as string) as ServerMessage;
      messageHandler?.(data);
    } catch (e) {
      console.error('WebSocket parse error:', e);
    }
  };

  ws.onerror = (event: Event) => {
    console.error('WebSocket error:', event);
  };

  ws.onclose = (event: WebSocketCloseEvent) => {
    console.log('WebSocket closed:', event.code, event.reason);
    // 재연결 로직 필요 시 구현
  };
};

/* ── 메시지 전송 ── */
export const sendMessage = (msg: ChatMessage) => {
  if (ws && ws.readyState === WSReadyState.OPEN) {
    ws.send(JSON.stringify(msg));
  } else {
    console.warn('WebSocket not connected, message dropped:', msg);
  }
};

/* ── 연결 종료 ── */
export const disconnectWebSocket = () => {
  ws?.close();
  ws = null;
  messageHandler = null;
  console.log('WebSocket Disconnected');
};
