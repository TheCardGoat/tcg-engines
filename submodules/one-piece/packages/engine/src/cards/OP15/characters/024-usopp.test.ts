import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Doma005 } from "@tcg/op-cards";
import { op15Krieg001 } from "../../../../../cards/src/cards/leaders/op15-001-krieg.ts";
import { op15Usopp024 } from "../../../../../cards/src/cards/characters/op15-024-usopp.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-024 Usopp", () => {
  test("[On K.O.] rests an opposing Leader or Character with cost 7 or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Usopp024], activeDon: 2 },
      {
        character: [eb01Doma005],
        hand: [eb01ConquererOfThreeWorldsRagnaraku039],
        activeDon: 5,
        restedDon: 1,
      },
    );
    const usoppId = engine.findCardInZone("south", "character", op15Usopp024);
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [usoppId] }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Usopp's rest target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === domaId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Opponent's Turn] blocks with gained Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Usopp024], activeDon: 2 },
      { activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const usoppId = engine.findCardInZone("south", "character", op15Usopp024);

    engine.endTurn("south");
    expect(engine.getView("south").players.south.characters[0]?.rested).toBe(false);

    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected a Blocker decision.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(usoppId);
    engine.resolveDecision("battleBlocker", { selectedIds: [usoppId] }, "south");

    // The battle K.O.s Usopp (2000 vs 5000) and his On K.O. fires.
    const onKo = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (onKo?.kind !== "selectEntity") throw new Error("Expected Usopp's On K.O. rest.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("cannot be rested by the opponent's effects while protected", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Usopp024], activeDon: 2 },
      { leaderCardId: op15Krieg001, activeDon: 2 },
    );
    const usoppId = engine.findCardInZone("south", "character", op15Usopp024);
    engine.attachDon(usoppId, 2, "south");

    engine.endTurn("south");

    // North's Krieg rests an opposing Character with 2 or more DON!!; Usopp
    // is protected, so the rest finds no candidate and he stays active.
    engine.activateEffect(engine.leader("north"), "activateMain", "north");

    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === usoppId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
