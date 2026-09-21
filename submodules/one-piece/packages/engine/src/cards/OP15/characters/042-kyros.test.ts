import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01ConquererOfThreeWorldsRagnaraku039,
  eb01Fourtricks025,
} from "@tcg/op-cards";
import { op15Kyros042 } from "../../../../../cards/src/cards/characters/op15-042-kyros.ts";
import { op15Rebecca039 } from "../../../../../cards/src/cards/leaders/op15-039-rebecca.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-042 Kyros", () => {
  test("[On Play] with a Rebecca Leader, trashes a card and gains Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Rebecca039,
        hand: [op15Kyros042, eb01Doma005],
        activeDon: 3,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard("OP15-042");
    const kyrosId = engine.findCardInZone("south", "character", op15Kyros042);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // The lone hand card is trashed automatically.

    // Rush lets the just-played Kyros attack immediately.
    engine.declareAttack(kyrosId, engine.leader("north"), "south");
  });

  test("[On K.O.] returns itself from trash to hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Kyros042], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const kyrosId = engine.findCardInZone("south", "character", op15Kyros042);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [kyrosId] }, "north");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      kyrosId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declines the Rush cost and never gains Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Rebecca039,
        hand: [op15Kyros042, eb01Fourtricks025],
        activeDon: 3,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard("OP15-042");
    const kyrosId = engine.findCardInZone("south", "character", op15Kyros042);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const failure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: kyrosId,
      targetId: engine.leader("north"),
    });
    expect(failure.reason).toBeTruthy();
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-042", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-042",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const kyros = "OP15-042";
    const engine = OnePieceTestEngine.create(
      { hand: [kyros], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(kyros);
    const gate = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    const gateIntent = gate?.extensions?.resolutionIntent;
    if (gateIntent === "effectOptional") {
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    } else if (gateIntent) {
      const gateStep = engine.pendingDecision(gateIntent as never, "south").steps[0];
      if (gateStep?.kind === "selectEntity" || gateStep?.kind === "orderItems") {
        engine.resolveDecision(gateIntent as never, { selectedIds: [] }, "south");
      } else if (gateStep?.kind === "chooseOption") {
        engine.resolveDecision(gateIntent as never, { optionId: "0" }, "south");
      }
    }

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(kyros);
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
