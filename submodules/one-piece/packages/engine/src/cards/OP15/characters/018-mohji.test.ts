import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15Mohji018 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-018 Mohji", () => {
  test("[When Attacking] K.O.s a DON!!-carrying Character with 3000 or less power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op15Mohji018, playedOnTurn: 0 }],
        activeDon: 3,
      },
      {
        character: [
          { card: eb01Doma005, rested: true, attachedDon: 1 },
          { cardId: "OP13-013", rested: true },
          { cardId: "OP16-096", rested: true, attachedDon: 1 },
        ],
      },
    );
    const mohjiId = engine.findCardInZone("south", "character", op15Mohji018);
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(mohjiId, engine.leader("north"), "south");
    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (ko?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    const candidates = ko.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toEqual([domaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(domaId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(domaId);
    expect(view.prompts).toHaveLength(0);
  });

  test("offers no K.O. targets when no opposing Character qualifies", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op15Mohji018, playedOnTurn: 0 }],
        activeDon: 3,
      },
      { character: [{ cardId: "OP13-013", rested: true }] },
    );

    engine.declareAttack(
      engine.findCardInZone("south", "character", op15Mohji018),
      engine.leader("north"),
      "south",
    );

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
