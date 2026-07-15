import { describe, expect, it } from "vitest";
import { resolveAuthBaseUrl } from "./config";

describe("Cyberpunk auth config", () => {
  it("uses the platform auth origin even when Cyberpunk runtime API is overridden", () => {
    expect(
      resolveAuthBaseUrl({
        PROD: true,
        VITE_GAME_RUNTIME_API_URLS: JSON.stringify({
          cyberpunk: "https://cyberpunk-api.example/v1",
        }),
      }),
    ).toBe("https://api.tcg.online");
  });

  it("prefers explicit platform auth config", () => {
    expect(
      resolveAuthBaseUrl({
        PROD: true,
        VITE_AUTH_BASE_URL: "https://api.example/v1",
        VITE_GAME_RUNTIME_API_URLS: JSON.stringify({
          cyberpunk: "https://cyberpunk-api.example/v1",
        }),
      }),
    ).toBe("https://api.example");
  });
});
