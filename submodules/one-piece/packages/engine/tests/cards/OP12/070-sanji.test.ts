import { describe, expect, test } from "vite-plus/test";
import { op01RoundTable027 } from "../../../../cards/src/cards/events/op01-027-round-table.ts";
import { op12Sanji070 } from "../../../../cards/src/cards/characters/op12-070-sanji.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-070 Sanji", () => {
  test("gains +1000 power for each complete group of 5 Events in trash", () => {
    const engine = OnePieceTestEngine.create({
      character: [op12Sanji070],
      trash: Array.from({ length: 10 }, () => op01RoundTable027),
    });
    const sanjiId = engine.findCardInZone("south", "character", op12Sanji070);

    const projectedSanji = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === sanjiId);

    expect(projectedSanji?.power).toBe((op12Sanji070.power ?? 0) + 2000);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    expect(engine.getView("south").players.south.characters.filter(Boolean).length).toBeGreaterThan(
      0,
    );
  });
});
