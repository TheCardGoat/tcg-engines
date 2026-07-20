import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Shanks120,
  op13Otama043,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Wadatsumi056 } from "../../../../../cards/src/cards/OP14EB04/characters/056-wadatsumi.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-056 Wadatsumi", () => {
  test("effect-origin hand trash negates its attack prohibition only during that turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: 3,
        hand: [op13Otama043, eb01Doma005],
        character: [{ card: op14eb04Wadatsumi056, playedOnTurn: 0 }],
        deck: [
          eb01Fourtricks025,
          eb01MountainGod018,
          op01Shanks120,
          eb01Doma005,
          eb01Fourtricks025,
        ],
        activeDon: op13Otama043.cost,
      },
      {
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const wadatsumiId = engine.findCardInZone("south", "character", op14eb04Wadatsumi056);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    let failure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: wadatsumiId,
      targetId: engine.leader("north"),
    });
    expect(failure.reason).toBe("The selected attacker cannot attack.");

    engine.playCard(op13Otama043, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Otama's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(discardedId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");

    engine.declareAttack(wadatsumiId, engine.leader("north"), "south");
    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === wadatsumiId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    engine.endTurn("north");

    failure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: wadatsumiId,
      targetId: engine.leader("north"),
    });
    expect(failure.reason).toBe("The selected attacker cannot attack.");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === wadatsumiId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
