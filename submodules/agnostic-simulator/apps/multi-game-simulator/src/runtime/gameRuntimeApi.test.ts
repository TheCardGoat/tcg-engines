import { describe, expect, test } from "vitest";
import type { GameSlug } from "@tcg/simulator-contract";
import {
  gameApiBaseUrl,
  gatewaySocketUrl,
  gatewayTicketUrl,
  normalizeApiBase,
  parseRuntimeApiUrlMap,
  playUrl,
  runtimeApiEnvForServer,
} from "./gameRuntimeApi.js";

describe("game runtime API URLs", () => {
  test("prefers the internal runtime map for server-side loaders", () => {
    const publicMap = JSON.stringify({ riftbound: "http://localhost:3000" });
    const internalMap = JSON.stringify({ riftbound: "http://general-api:3000" });

    expect(
      gameApiBaseUrl(
        "riftbound",
        runtimeApiEnvForServer({
          VITE_GAME_RUNTIME_API_URLS: publicMap,
          GAME_RUNTIME_API_INTERNAL_URLS: internalMap,
        }),
      ),
    ).toBe("http://general-api:3000");
  });

  test("never falls back to a public origin for server-side loaders", () => {
    expect(() =>
      gameApiBaseUrl(
        "cyberpunk",
        runtimeApiEnvForServer({
          NODE_ENV: "production",
          VITE_GAME_RUNTIME_API_URLS: JSON.stringify({
            cyberpunk: "https://api.tcg.online",
          }),
        }),
      ),
    ).toThrow(
      "GAME_RUNTIME_API_INTERNAL_URLS is missing an internal runtime API origin for 'cyberpunk'",
    );

    expect(() =>
      gameApiBaseUrl(
        "lorcana",
        runtimeApiEnvForServer({
          GAME_RUNTIME_API_INTERNAL_URLS: JSON.stringify({
            cyberpunk: "http://general-api:3000",
          }),
        }),
      ),
    ).toThrow(
      "GAME_RUNTIME_API_INTERNAL_URLS is missing an internal runtime API origin for 'lorcana'",
    );
  });

  test("retains the configured localhost runtime map during local development", () => {
    expect(
      gameApiBaseUrl(
        "riftbound",
        runtimeApiEnvForServer({
          NODE_ENV: "development",
          VITE_GAME_RUNTIME_API_URLS: JSON.stringify({
            riftbound: "http://localhost:3000",
          }),
        }),
      ),
    ).toBe("http://localhost:3000");
  });

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

  test("uses the consolidated production runtime for Naruto", () => {
    expect(gameApiBaseUrl("naruto", {})).toBe("https://api.tcg.online");
    expect(
      gameApiBaseUrl("naruto", {
        VITE_GAME_RUNTIME_API_URLS: JSON.stringify({ naruto: "http://localhost:3010/v1" }),
      }),
    ).toBe("http://localhost:3010");
  });

  test("uses the configured consolidated API for every game", () => {
    expect(gameApiBaseUrl("gundam", { VITE_API_URL: "https://api.example/v1" })).toBe(
      "https://api.example",
    );
    expect(gameApiBaseUrl("lorcana", { VITE_API_URL: "https://api.example/v1" })).toBe(
      "https://api.example",
    );
    expect(gameApiBaseUrl("cyberpunk", { VITE_API_URL: "https://api.example/v1" })).toBe(
      "https://api.example",
    );
  });

  test("keeps platform settings on the staging API when no per-game map entry exists", () => {
    expect(gameApiBaseUrl("platform", { VITE_API_URL: "https://staging-api.tcg.online/v1" })).toBe(
      "https://staging-api.tcg.online",
    );
  });

  test("normalizes /v1 exactly once", () => {
    expect(normalizeApiBase("https://api.example/v1")).toBe("https://api.example");
    expect(normalizeApiBase("https://api.example/v1/")).toBe("https://api.example");
    expect(playUrl("one-piece", "matches/match_1", {})).toBe(
      "https://api.tcg.online/v1/games/one-piece/play/matches/match_1",
    );
  });

  test("falls back safely when the runtime URL map is invalid or missing entries", () => {
    expect(parseRuntimeApiUrlMap("{not json")).toEqual({});
    expect(gameApiBaseUrl("cyberpunk", { VITE_GAME_RUNTIME_API_URLS: "{not json" })).toBe(
      "https://api.tcg.online",
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
