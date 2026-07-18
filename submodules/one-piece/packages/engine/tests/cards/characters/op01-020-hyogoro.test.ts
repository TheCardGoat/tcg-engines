import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Hyogoro020 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-020 Hyogoro", () => {
  test("rests itself to give a Leader or Character +2000 for the turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op01Hyogoro020, eb01Doma005],
    });
    const hyogoroId = engine.findCardInZone("south", "character", op01Hyogoro020);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(hyogoroId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === hyogoroId)?.rested,
    ).toBe(true);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(5000);

    engine.endTurn("south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(3000);
  });
});
