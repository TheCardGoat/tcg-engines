import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op15Krieg001 } from "../../../../../cards/src/cards/leaders/op15-001-krieg.ts";
import { op15BartholomewKuma029 } from "../../../../../cards/src/cards/characters/op15-029-bartholomew-kuma.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-029 Bartholomew Kuma", () => {
  test("[On Play] shields one low-cost opposing Character from being rested", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Krieg001,
        hand: [op15BartholomewKuma029],
        activeDon: 6,
      },
      {
        character: [
          { card: eb01Doma005, attachedDon: 2 },
          { card: eb01Fourtricks025, attachedDon: 2 },
        ],
        activeDon: 2,
      },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);
    const fourtricksId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op15BartholomewKuma029);
    const shield = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (shield?.kind !== "selectEntity") throw new Error("Expected Kuma's shield target.");
    expect(shield.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId, fourtricksId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    // Krieg rests an opposing Character with 2 or more DON!!; the shielded
    // Doma is excluded from the candidates.
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (rest?.kind !== "selectEntity") throw new Error("Expected Krieg's rest target.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual([fourtricksId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [fourtricksId] }, "south");

    const north = engine.getView("south").players.north;
    expect(north.characters.find((card) => card?.instanceId === domaId)?.rested).toBe(false);
    expect(north.characters.find((card) => card?.instanceId === fourtricksId)?.rested).toBe(true);
  });
});
