import { describe, expect, it } from "vite-plus/test";

import {
  createGundamWebviewReadyMessage,
  resolveGundamWebviewHostOrigin,
} from "./webviewBridge.ts";

describe("Gundam practice webview bridge", () => {
  it("announces the embedded practice capabilities", () => {
    expect(createGundamWebviewReadyMessage()).toEqual({
      type: "gundam.webview.ready.v1",
      capabilities: {
        deckPayloadUrl: true,
        serverPractice: true,
        pointerDragDrop: true,
      },
    });
  });

  it("targets only the exact HTTP(S) referrer origin", () => {
    expect(resolveGundamWebviewHostOrigin("https://tcg.online/gundam/decks/blue")).toBe(
      "https://tcg.online",
    );
    expect(resolveGundamWebviewHostOrigin("http://127.0.0.1:5173/gundam/decks/blue")).toBe(
      "http://127.0.0.1:5173",
    );
    expect(resolveGundamWebviewHostOrigin("javascript:alert(1)")).toBeNull();
  });
});
