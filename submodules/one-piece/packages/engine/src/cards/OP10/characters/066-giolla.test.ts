import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op10Giolla066 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-066 Giolla", () => {
  test("once per turn may rest 2 DON!! to rest an opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Giolla066], activeDon: 2 },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const [firstAttacker, secondAttacker] = engine
      .getView("north")
      .players.north.characters.filter((card) => card?.cardId === eb01MountainGod018.id)
      .map((card) => card!.instanceId);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(firstAttacker!, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Giolla's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(secondAttacker);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);

    engine.declareAttack(secondAttacker!, engine.leader("south"), "north");
    view = engine.getView("south");
    expect(view.prompts.some((prompt) => prompt.label.includes("optional effect"))).toBe(false);
  });
});
