import {
  CloseAction,
  ErrorAction,
  MonacoLanguageClient,
  MonacoServices,
  createConnection,
} from "monaco-languageclient";
import {
  toSocket,
  WebSocketMessageReader,
  WebSocketMessageWriter,
} from "vscode-ws-jsonrpc";

export const createLanguageClient = (languageId: string, socket: WebSocket) => {
  const reader = new WebSocketMessageReader(toSocket(socket));
  const writer = new WebSocketMessageWriter(toSocket(socket));

  const connection = createConnection(reader, writer, () => socket.close());
  return new MonacoLanguageClient({
    name: `${languageId} Language Client`,
    clientOptions: {
      // where Monaco editor is running
      documentSelector: [languageId],
      synchronize: {},
      errorHandler: {
        error: () => ErrorAction.Continue,
        closed: () => CloseAction.Restart,
      },
    },
    connectionProvider: {
      get: () => Promise.resolve(connection),
    },
  });
};

export const connectToLsp = async (monaco: any, languageId: string) => {
  // Register Monaco services for LSP
  MonacoServices.install(monaco);

  // Connect to your Python LSP WebSocket (running at ws://localhost:4000)
  const url = `ws://localhost:4000`;
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log(`[LSP] Connected to ${languageId} server`);
    const languageClient = createLanguageClient(languageId, socket);
    languageClient.start();

    socket.onclose = () => languageClient.stop();
  };

  socket.onerror = (err) => {
    console.error("[LSP] Error connecting:", err);
  };
};
