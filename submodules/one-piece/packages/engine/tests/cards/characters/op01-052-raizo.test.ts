import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01KinEmon040, op01Raizo052 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-052 Raizo", () => {
  test("draws with two rested Characters and does not draw again after being readied this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op01Raizo052, playedOnTurn: 0 },
          { card: op01KinEmon040, attachedDon: 1, playedOnTurn: 0 },
          { card: eb01Doma005, rested: true, playedOnTurn: 0 },
        ],
        deck: [eb01Fourtricks025, eb01Fourtricks025],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const raizoId = engine.findCardInZone("south", "character", op01Raizo052);
    const kinEmonId = engine.findCardInZone("south", "character", op01KinEmon040);
    const handBefore = engine.getView("south").players.south.hand.length;

    engine.declareAttack(raizoId, engine.leader("north"), "south");
    expect(engine.getView("south").players.south.hand).toHaveLength(handBefore + 1);

    engine.declareAttack(kinEmonId, engine.leader("north"), "south");
    const ready = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ready?.kind).toBe("selectEntity");
    if (ready?.kind !== "selectEntity") throw new Error("Expected Kin'emon's ready target.");
    expect(ready.candidates.map((candidate) => candidate.ref.id)).toContain(raizoId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [raizoId] }, "south");

    engine.declareAttack(raizoId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(handBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });
});
