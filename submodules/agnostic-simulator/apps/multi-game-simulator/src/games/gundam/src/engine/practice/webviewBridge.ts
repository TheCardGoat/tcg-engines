export interface GundamWebviewReadyMessage {
  readonly type: "gundam.webview.ready.v1";
  readonly capabilities: {
    readonly deckPayloadUrl: true;
    readonly serverPractice: true;
    readonly pointerDragDrop: true;
  };
}

export interface GundamPracticeStartedMessage {
  readonly type: "gundam.practice.started.v1";
  readonly matchId: string;
  readonly gameId: string;
}

export interface GundamPracticeErrorMessage {
  readonly type: "gundam.practice.error.v1";
  readonly message: string;
  readonly details: readonly string[];
}

export type GundamWebviewOutboundMessage =
  | GundamWebviewReadyMessage
  | GundamPracticeStartedMessage
  | GundamPracticeErrorMessage;

export function createGundamWebviewReadyMessage(): GundamWebviewReadyMessage {
  return {
    type: "gundam.webview.ready.v1",
    capabilities: {
      deckPayloadUrl: true,
      serverPractice: true,
      pointerDragDrop: true,
    },
  };
}

export function resolveGundamWebviewHostOrigin(referrer: string): string | null {
  try {
    const url = new URL(referrer);
    return url.protocol === "https:" || url.protocol === "http:" ? url.origin : null;
  } catch {
    return null;
  }
}

export function postGundamWebviewMessage(message: GundamWebviewOutboundMessage): boolean {
  if (typeof window === "undefined" || window.parent === window) return false;
  const origin = resolveGundamWebviewHostOrigin(document.referrer);
  if (!origin) return false;
  window.parent.postMessage(message, origin);
  return true;
}
