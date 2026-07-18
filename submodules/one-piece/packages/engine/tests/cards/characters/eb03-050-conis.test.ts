import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03Conis050,
  op06Genbo105,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("EB03-050 Conis", () => {
  test("gives a compound Sky Island Character Double Attack for only this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Conis050],
        character: [{ card: op06Genbo105, playedOnTurn: 0 }],
        activeDon: eb03Conis050.cost,
      },
      { life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const skyIslandId = engine.findCardInZone("south", "character", op06Genbo105);

    engine.playCard(eb03Conis050, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Conis's Sky Island target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([
        skyIslandId,
        engine.findCardInZone("south", "character", eb03Conis050),
      ]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [skyIslandId] }, "south");

    const firstLifeBefore = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(skyIslandId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(firstLifeBefore - 2);

    engine.endTurn("south");
    engine.endTurn("north");

    const secondLifeBefore = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(skyIslandId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(engine.getView("south").players.north.lifeCount).toBe(secondLifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
