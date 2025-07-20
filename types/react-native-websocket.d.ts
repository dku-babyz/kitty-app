declare module 'react-native-websocket' {
  import { Component } from 'react';
  import { WebSocket as RNWebSocket } from 'react-native';

  interface WebSocketProps {
    url: string;
    onOpen?: (event: WebSocketEventMap['open']) => void;
    onMessage?: (event: WebSocketEventMap['message']) => void;
    onError?: (event: WebSocketEventMap['error']) => void;
    onClose?: (event: WebSocketEventMap['close']) => void;
    reconnect?: boolean;
    reconnectInterval?: number;
    reconnectAttempts?: number;
    children?: React.ReactNode;
  }

  export default class WebSocket extends Component<WebSocketProps> {
    send: (data: string | ArrayBufferLike | Blob) => void;
    close: (code?: number, reason?: string) => void;
    readyState: number;
    CONNECTING: number;
    OPEN: number;
    CLOSING: number;
    CLOSED: number;
  }

  interface WebSocketEventMap {
    close: CloseEvent;
    message: MessageEvent;
    error: Event;
    open: Event;
  }

  // Extend the global WebSocket interface if necessary, though usually not needed for react-native-websocket
  // declare global {
  //   interface WebSocket extends RNWebSocket {}
  // }
}
