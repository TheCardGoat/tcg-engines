import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { fetchReplay, ReplayNotFoundError } from "../src/fetch.ts";

describe("fetchReplay", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  test("uses the Cyberpunk-scoped consolidated runtime route", async () => {
    vi.stubEnv("MATCH_MANAGEMENT_API_KEY", "test-key");
    const fetchMock = vi.fn(async () => new Response(null, { status: 404 }));
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    await expect(fetchReplay("game 1", "https://api.tcg.online")).rejects.toBeInstanceOf(
      ReplayNotFoundError,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.tcg.online/v1/internal/games/cyberpunk/runtime/games/game%201/replay-data",
      expect.objectContaining({
        headers: { "x-api-key": "test-key" },
      }),
    );
  });
});
