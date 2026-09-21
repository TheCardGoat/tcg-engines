import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Doma005 } from "@tcg/op-cards";
import { op15Pearl011 } from "../../../../../cards/src/cards/characters/op15-011-pearl.ts";
import { op15Krieg001 } from "../../../../../cards/src/cards/leaders/op15-001-krieg.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-011 Pearl", () => {
  test("[Opponent's Turn] blocks with an East Blue Leader and +2000 power", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Krieg001, character: [op15Pearl011], activeDon: 2 },
      { activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const pearlId = engine.findCardInZone("south", "character", op15Pearl011);

    expect(engine.getView("south").players.south.characters[0]?.power).toBe(4000);

    engine.endTurn("south");

    expect(engine.getView("south").players.south.characters[0]?.power).toBe(6000);

    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected a Blocker decision.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(pearlId);
    engine.resolveDecision("battleBlocker", { selectedIds: [pearlId] }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On K.O.] K.O.s an opposing Character with 6000 base power or less", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Krieg001, character: [op15Pearl011], activeDon: 2 },
      {
        character: [eb01Doma005],
        hand: [eb01ConquererOfThreeWorldsRagnaraku039],
        activeDon: 5,
        restedDon: 1,
      },
    );
    const pearlId = engine.findCardInZone("south", "character", op15Pearl011);
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [pearlId] }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Pearl's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      domaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
