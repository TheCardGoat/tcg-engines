import { describe, expect, test } from "vitest";
import type { GameSlug } from "@tcg/simulator-contract";
import {
  gameApiBaseUrl,
  gatewaySocketUrl,
  gatewayTicketUrl,
  normalizeApiBase,
  parseRuntimeApiUrlMap,
  playUrl,
} from "./gameRuntimeApi";

describe("game runtime API URLs", () => {
  test("prefers per-game runtime URLs over VITE_API_URL", () => {
    const env = {
      VITE_GAME_RUNTIME_API_URLS: JSON.stringify({
        cyberpunk: "https://cyberpunk-runtime.example/v1/",
      }),
      VITE_API_URL: "https://platform-api.example/v1",
    };

    expect(gameApiBaseUrl("cyberpunk", env)).toBe("https://cyberpunk-runtime.example");
    expect(playUrl("cyberpunk", "/quick-match", env)).toBe(
      "https://cyberpunk-runtime.example/v1/games/cyberpunk/play/quick-match",
    );
  });

  test("uses production game-specific backends before the platform API fallback", () => {
    expect(gameApiBaseUrl("gundam", { VITE_API_URL: "https://api.example/v1" })).toBe(
      "https://gundam-api.tcg.online",
    );
    expect(gameApiBaseUrl("lorcana", { VITE_API_URL: "https://api.example/v1" })).toBe(
      "https://lorcana-api.tcg.online",
    );
  });

  test("normalizes /v1 exactly once", () => {
    expect(normalizeApiBase("https://api.example/v1")).toBe("https://api.example");
    expect(normalizeApiBase("https://api.example/v1/")).toBe("https://api.example");
    expect(playUrl("one-piece", "matches/match_1", {})).toBe(
      "https://one-piece-api.tcg.online/v1/games/one-piece/play/matches/match_1",
    );
  });

  test("falls back safely when the runtime URL map is invalid or missing entries", () => {
    expect(parseRuntimeApiUrlMap("{not json")).toEqual({});
    expect(gameApiBaseUrl("cyberpunk", { VITE_GAME_RUNTIME_API_URLS: "{not json" })).toBe(
      "https://cyberpunk-api.tcg.online",
    );
    expect(
      gameApiBaseUrl("riftbound" as GameSlug, { VITE_API_URL: "https://api.example/v1" }),
    ).toBe("https://api.example");
  });

  test("builds gateway URLs on the selected game backend and namespace", () => {
    const env = {
      VITE_GAME_RUNTIME_API_URLS: JSON.stringify({
        cyberpunk: "https://cyberpunk-runtime.example/v1",
      }),
      VITE_GATEWAY_WS_URL: "wss://gateway.example/socket.io",
    };

    expect(gatewayTicketUrl("cyberpunk", env)).toBe(
      "https://cyberpunk-runtime.example/v1/gateway/ticket",
    );
    expect(gatewaySocketUrl("cyberpunk", env)).toBe("wss://gateway.example/cyberpunk");
  });
});
