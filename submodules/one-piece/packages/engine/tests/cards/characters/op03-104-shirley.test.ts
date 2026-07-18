import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op03Shirley104 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-104 Shirley", () => {
  test("privately repositions either top Life card, then blocks an attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Shirley104],
        life: [eb01Doma005, eb01Fourtricks025],
        activeDon: op03Shirley104.cost,
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        life: [eb01Fourtricks025, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const opposingTopLifeId = engine.getState().players.north.life[0]!;
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op03Shirley104, "south");
    const shirleyId = engine.findCardInZone("south", "character", op03Shirley104);
    const owner = engine.pendingDecision("effectLookAtLifeOwner", "south").steps[0];
    expect(owner?.kind).toBe("chooseOption");
    if (owner?.kind !== "chooseOption") throw new Error("Expected Shirley's Life owner choice.");
    expect(owner.options.map((option) => option.id)).toEqual(["skip", "self", "opponent"]);
    engine.resolveDecision("effectLookAtLifeOwner", { optionId: "opponent" }, "south");
    expect(engine.pendingDecision("effectLookAtLifePosition", "south").message).toContain(
      eb01Fourtricks025.name,
    );
    expect(JSON.stringify(engine.getView("north").decisions)).not.toContain(eb01Fourtricks025.name);
    engine.resolveDecision("effectLookAtLifePosition", { optionId: "bottom" }, "south");
    expect(engine.getState().players.north.life.at(-1)).toBe(opposingTopLifeId);

    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Shirley's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", shirleyId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [shirleyId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      shirleyId,
    );
  });
});
