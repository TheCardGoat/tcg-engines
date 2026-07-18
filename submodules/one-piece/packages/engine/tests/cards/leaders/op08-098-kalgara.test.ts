import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op06Genbo105,
  op08Kalgara098,
  op08Wyper110,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("OP08-098 Kalgara", () => {
  test("maps an affordable included Shandian Warrior and adds Life only after playing it", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08Kalgara098,
        hand: [op06Genbo105, op08Wyper110],
        life: [eb01Doma005],
        activeDon: 3,
      },
      { life: [eb01MountainGod018] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const eligibleId = engine.findCardInZone("south", "hand", op06Genbo105);
    const excludedId = engine.findCardInZone("south", "hand", op08Wyper110);
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Kalgara's hand play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
