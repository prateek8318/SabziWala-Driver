declare module 'socket.io-client' {
  interface Socket {
    on(event: string, callback: (data: any) => void): Socket;
    emit(event: string, data?: any): Socket;
    disconnect(): Socket;
    connect(): Socket;
    connected: boolean;
    id: string;
  }

  interface SocketOptions {
    withCredentials?: boolean;
    transports?: string[];
    timeout?: number;
  }

  function io(url: string, options?: SocketOptions): Socket;
  export = io;
}

declare module 'socket.io-client/dist/socket.io' {
  interface Socket {
    on(event: string, callback: (data: any) => void): Socket;
    emit(event: string, data?: any): Socket;
    disconnect(): Socket;
    connect(): Socket;
    connected: boolean;
    id: string;
  }

  interface SocketOptions {
    withCredentials?: boolean;
    transports?: string[];
    timeout?: number;
  }

  function io(url: string, options?: SocketOptions): Socket;
  export = io;
}
