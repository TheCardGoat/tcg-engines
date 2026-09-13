import { describe, expect, it } from "vite-plus/test";

import { getBotLabAdapter, listBotLabGames } from "./registry.ts";

describe("BotLab adapter registry", () => {
  it("lists supported games without importing every adapter", () => {
    expect(listBotLabGames()).toEqual(["cyberpunk", "gundam", "lorcana", "one-piece"]);
  });

  // Dynamic import of the Gundam adapter graph is heavy under concurrent CI
  // transforms; allow a generous budget without re-running doctor (covered in
  // adapters/gundam.test.ts).
  it("loads the requested Gundam adapter independently", async () => {
    const adapter = await getBotLabAdapter("gundam");

    expect(adapter.game).toBe("gundam");
    expect(adapter.adapterVersion).toEqual(expect.any(String));
    expect(typeof adapter.doctor).toBe("function");
    expect(typeof adapter.runMatch).toBe("function");
    expect(adapter.getCurrentDefaultStrategyId()).toEqual(expect.any(String));
  }, 60_000);

  it("rejects unsupported games", async () => {
    await expect(getBotLabAdapter("unknown")).rejects.toThrow(
      "No bot-lab adapter registered for unknown",
    );
  });
});
