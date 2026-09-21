import { afterEach, describe, expect, test, vi } from "vitest";

import {
  isAllowedCardDatabaseOrigin,
  parseDeckImportMessage,
  postWebviewMessage,
} from "./webviewBridge.ts";

function importMessageEvent(origin: string, data: unknown): MessageEvent {
  return new MessageEvent("message", { origin, data });
}

describe("isAllowedCardDatabaseOrigin", () => {
  test("accepts the known production card database origins", () => {
    expect(isAllowedCardDatabaseOrigin("https://tcg.online")).toBe(true);
    expect(isAllowedCardDatabaseOrigin("https://staging.cardgoat.org")).toBe(true);
    expect(isAllowedCardDatabaseOrigin("https://cyberpunktcg.com")).toBe(true);
    expect(isAllowedCardDatabaseOrigin("https://www.cyberpunktcg.com")).toBe(true);
    expect(isAllowedCardDatabaseOrigin("https://thecardgoat.com")).toBe(true);
  });

  test("accepts the embedding page's own origin (same-origin mounted simulator)", () => {
    // Mounted deployments (tcg.online, staging, local docker) serve the deck
    // builder and the simulator from one origin behind the reverse proxy, so
    // deck imports arrive with window.location.origin as the sender.
    expect(isAllowedCardDatabaseOrigin(window.location.origin)).toBe(true);
  });

  test("rejects unrelated origins", () => {
    expect(isAllowedCardDatabaseOrigin("https://evil.example")).toBe(false);
    expect(isAllowedCardDatabaseOrigin("https://tcg.online.evil.example")).toBe(false);
    expect(isAllowedCardDatabaseOrigin("")).toBe(false);
  });

  test("accepts localhost http senders in development builds", () => {
    // import.meta.env.DEV is true under vitest, mirroring the dev simulator.
    expect(isAllowedCardDatabaseOrigin("http://localhost:5173")).toBe(true);
    expect(isAllowedCardDatabaseOrigin("http://127.0.0.1:3000")).toBe(true);
  });
});

describe("parseDeckImportMessage", () => {
  const message = {
    type: "cyberpunk.deck.import.v1",
    requestId: "req-1",
    payload: { game: "cyberpunk", format: "constructed", legends: [], mainDeck: [] },
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("accepts a well-formed import from an allowed origin", () => {
    const parsed = parseDeckImportMessage(importMessageEvent(window.location.origin, message));
    expect(parsed).toEqual({ ok: true, message });
  });

  test("rejects a well-formed import from an untrusted origin with a console warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const parsed = parseDeckImportMessage(importMessageEvent("https://evil.example", message));
    expect(parsed).toEqual({ ok: false, reason: "origin" });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain("https://evil.example");
  });

  test("rejects malformed payloads as type errors without warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(
      parseDeckImportMessage(importMessageEvent(window.location.origin, { type: "other.v1" })),
    ).toEqual({ ok: false, reason: "type" });
    expect(warn).not.toHaveBeenCalled();
  });
});

describe("postWebviewMessage", () => {
  test("posts the message to the target window with the given origin", () => {
    const postMessage = vi.spyOn(window, "postMessage").mockImplementation(() => {});
    const message = {
      type: "cyberpunk.webview.ready.v1",
      capabilities: {
        deckImport: true,
        localPractice: true,
        botDeckPayload: true,
        sessionStorage: true,
      },
    } as const;
    postWebviewMessage(window, "https://parent.example", message);
    expect(postMessage).toHaveBeenCalledExactlyOnceWith(message, "https://parent.example");
  });

  test("tolerates a missing target window", () => {
    expect(() =>
      postWebviewMessage(null, "https://parent.example", {
        type: "cyberpunk.webview.ready.v1",
        capabilities: {
          deckImport: true,
          localPractice: true,
          botDeckPayload: true,
          sessionStorage: true,
        },
      }),
    ).not.toThrow();
  });
});
