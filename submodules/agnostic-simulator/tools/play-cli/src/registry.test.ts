import { describe, expect, it } from "vitest";

import { getPlayAdapter, isPlayGame, listPlayGames } from "./registry.ts";

describe("play-cli registry", () => {
  it("lists registered games and rejects unknown ids", async () => {
    expect(listPlayGames()).toContain("one-piece");
    expect(isPlayGame("one-piece")).toBe(true);
    expect(isPlayGame("not-a-game")).toBe(false);

    await expect(getPlayAdapter("not-a-game")).rejects.toThrow(
      /No play-cli adapter registered for not-a-game/,
    );

    const adapter = await getPlayAdapter("one-piece");
    expect(adapter.game).toBe("one-piece");
    expect(typeof adapter.createSession).toBe("function");
    expect(typeof adapter.doctor).toBe("function");
  });
});
