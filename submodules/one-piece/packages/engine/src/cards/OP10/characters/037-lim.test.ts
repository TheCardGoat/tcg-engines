import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02Koby098 } from "@tcg/op-cards";
import { op10Lim037 } from "../../../../../cards/src/cards/OP10/characters/037-lim.ts";
import { op10Perona036 } from "../../../../../cards/src/cards/OP10/characters/036-perona.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-037 Lim", () => {
  test("at end of turn sets an included ODYSSEY Character active", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10Lim037, { card: op10Perona036, rested: true }],
    });
    const peronaId = engine.findCardInZone("south", "character", op10Perona036);

    engine.endTurn("south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [peronaId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === peronaId)
        ?.rested,
    ).toBe(false);
  });

  test("once per turn rests an ODYSSEY ally instead of opponent-effect removal", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Lim037, op10Perona036] },
      { hand: [op02Koby098, eb01Doma005], activeDon: op02Koby098.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const limId = engine.findCardInZone("south", "character", op10Lim037);
    const peronaId = engine.findCardInZone("south", "character", op10Perona036);

    engine.playCard(op02Koby098, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [limId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [peronaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(limId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === peronaId)?.rested,
    ).toBe(true);
  });
});
