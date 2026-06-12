export interface TransportMessage {
  type: "stateUpdate" | "patch" | "commandResult" | "error" | "gameEnd";
  stateID: number;
  payload: unknown;
}

export interface Transport {
  send(message: TransportMessage): void;
  onMessage(handler: (message: TransportMessage) => void): () => void;
  close(): void;
}
