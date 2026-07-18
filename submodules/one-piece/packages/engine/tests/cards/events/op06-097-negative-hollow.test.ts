import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06NegativeHollow097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP06-097 Negative Hollow", () => {
  test("Main lets the controller choose one opaque card from the opponent's concealed hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06NegativeHollow097],
        activeDon: 2,
      },
      {
        hand: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const opponentHandIds = [...engine.getState().players.north.hand];

    engine.playCard(op06NegativeHollow097);

    const decision = engine.pendingDecision("effectTrashFromHandSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose an opaque opposing hand card.");
    }
    expect(step.candidates).toHaveLength(2);
    expect(step.candidates.every((candidate) => candidate.ref.id.startsWith("hidden-card:"))).toBe(
      true,
    );
    expect(
      engine.getView("north").decisions.some((candidate) => candidate.id === decision.id),
    ).toBe(false);
    expect(
      engine.getView("spectator").decisions.some((candidate) => candidate.id === decision.id),
    ).toBe(false);
    expect(
      engine.getView("judge").decisions.some((candidate) => candidate.id === decision.id),
    ).toBe(true);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [step.candidates[0]!.ref.id] },
      "south",
    );

    const trashedIds = engine.getView("south").players.north.trash.map((card) => card.instanceId);
    expect(trashedIds).toHaveLength(1);
    expect(opponentHandIds).toContain(trashedIds[0]);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Main under the damaged player's control without DON!! payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Fourtricks025],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op06NegativeHollow097],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const attackerHandIds = [...engine.getState().players.south.hand];

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const decision = engine.pendingDecision("effectTrashFromHandSelection", "north");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose an opaque attacking hand card.");
    }
    expect(step.candidates.every((candidate) => candidate.ref.id.startsWith("hidden-card:"))).toBe(
      true,
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [step.candidates[0]!.ref.id] },
      "north",
    );

    const trashedIds = engine.getView("north").players.south.trash.map((card) => card.instanceId);
    expect(trashedIds).toHaveLength(1);
    expect(attackerHandIds).toContain(trashedIds[0]);
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Main resolves automatically when the opponent has no cards in hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06NegativeHollow097],
      activeDon: 2,
    });

    engine.playCard(op06NegativeHollow097);

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.north.trash).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
