import { describe, expect, it } from "vite-plus/test";

import { getBotLabAdapter, listBotLabGames } from "./registry.ts";

describe("BotLab adapter registry", () => {
  it("lists supported games without importing every adapter", () => {
    expect(listBotLabGames()).toEqual(["cyberpunk", "gundam", "lorcana", "one-piece"]);
  });

  it("loads the requested Gundam adapter independently", async () => {
    const adapter = await getBotLabAdapter("gundam");

    expect(adapter.game).toBe("gundam");
    expect((await adapter.doctor()).ok).toBe(true);
  }, 30_000);

  it("rejects unsupported games", async () => {
    await expect(getBotLabAdapter("unknown")).rejects.toThrow(
      "No bot-lab adapter registered for unknown",
    );
  });
});
