import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07Vegapunk097,
  op09Sanji105,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-105 Sanji", () => {
  test("Life Trigger adds the deck top to Life, then trashes two chosen hand cards", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op07Vegapunk097,
        life: [op09Sanji105],
        hand: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const discardIds = engine
      .getView("north")
      .players.north.hand.map((card) => card.instanceId)
      .filter((instanceId): instanceId is string => Boolean(instanceId));
    const lifeCardId = engine.findCardInZone("north", "deck", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "north");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Sanji's discard choice.");
    expect(trash).toMatchObject({ min: 2, max: 2 });
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: discardIds }, "north");

    const view = engine.getView("north");
    expect(engine.getState().players.north.life).toEqual([lifeCardId]);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(discardIds),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
