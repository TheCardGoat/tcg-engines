import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op11Streusen074 } from "../../../../../cards/src/cards/OP11/characters/074-streusen.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-074 Streusen", () => {
  test("returns DON!!, rests itself, and rests only an eligible Character after a cost match", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Streusen074], activeDon: 2 },
      {
        deck: [eb01Doma005, eb01MountainGod018],
        character: [eb01Doma005, eb01MountainGod018],
      },
    );
    const streusenId = engine.findCardInZone("south", "character", op11Streusen074);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(streusenId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore + 1);
    engine.resolveDecision("effectGuessTopDeckCost", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Streusen's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === streusenId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === expensiveId)?.rested,
    ).toBe(false);
  });
});
