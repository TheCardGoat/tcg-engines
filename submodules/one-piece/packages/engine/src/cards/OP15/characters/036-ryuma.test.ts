import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op15Ryuma036 } from "../../../../../cards/src/cards/characters/op15-036-ryuma.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-036 Ryuma", () => {
  test("[On Play] K.O.s one rested opposing Character with cost 4 or less", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Ryuma036], activeDon: 6 },
      { character: [{ card: eb01Doma005, rested: true }, eb01Fourtricks025] },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);
    const fourtricksId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op15Ryuma036);

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Ryuma's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(fourtricksId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      domaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[When Attacking] K.O.s a rested low-cost Character during battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Ryuma036], activeDon: 4 },
      { character: [{ card: eb01Doma005, rested: true }, eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ryumaId = engine.findCardInZone("south", "character", op15Ryuma036);
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(ryumaId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Ryuma's K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      domaId,
    );
  });
});
