import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Otama006,
  op07DoguraMagura009,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-009 Dogura & Magura", () => {
  test("gives only a selected red cost-1 Character Double Attack for this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07DoguraMagura009],
        character: [{ card: op01Otama006, attachedDon: 5, playedOnTurn: 0 }, eb01MountainGod018],
        activeDon: op07DoguraMagura009.cost,
      },
      { life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const otamaId = engine.findCardInZone("south", "character", op01Otama006);
    const wrongCostId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.playCard(op07DoguraMagura009, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected a Double Attack target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([otamaId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [otamaId] }, "south");

    const firstLife = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(otamaId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(firstLife - 2);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.attachDon(otamaId, 5, "south");
    const secondLife = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(otamaId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(engine.getView("south").players.north.lifeCount).toBe(secondLife - 1);
  });

  test("may choose no Character on play", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07DoguraMagura009],
        character: [op01Otama006],
        activeDon: op07DoguraMagura009.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op07DoguraMagura009, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
