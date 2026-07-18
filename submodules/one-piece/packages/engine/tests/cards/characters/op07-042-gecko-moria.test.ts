import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op07BoaHancock038,
  op07GeckoMoria042,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const returnCharacter: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP07-042-RETURN",
  canonicalId: "TEST-OP07-042-RETURN",
  name: "Test Gecko Moria Returner",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "any",
              zones: ["character"],
              count: { amount: 1 },
            },
          },
        ],
      },
    ],
  },
};

registerCards([returnCharacter]);

function targetWithReturner(engine: OnePieceTestEngine, targetId: string, seat: "south" | "north") {
  engine.playCard(returnCharacter, seat);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, seat);
}

describe("OP07-042 Gecko Moria", () => {
  test("with a Warlords Leader, may bottom-deck another non-Moria Character instead once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07BoaHancock038,
        character: [op07GeckoMoria042, op07GeckoMoria042, eb01Doma005, eb01Fourtricks025],
      },
      { hand: [returnCharacter, returnCharacter] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const moriaIds = engine
      .getView("south")
      .players.south.characters.filter((card) => card?.cardId === op07GeckoMoria042.id)
      .map((card) => card!.instanceId);
    const eligibleIds = [
      engine.findCardInZone("south", "character", eb01Doma005),
      engine.findCardInZone("south", "character", eb01Fourtricks025),
    ];
    const moriaId = moriaIds[0]!;

    targetWithReturner(engine, moriaId, "north");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(payment?.kind).toBe("selectEntity");
    if (payment?.kind !== "selectEntity") throw new Error("Expected Moria's replacement payment.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(eligibleIds);
    for (const excludedMoriaId of moriaIds) {
      expect(payment.candidates.map((candidate) => candidate.ref.id)).not.toContain(
        excludedMoriaId,
      );
    }
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleIds[0]!] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === moriaId)).toBe(true);
    expect(engine.getState().players.south.deck).toContain(eligibleIds[0]);

    targetWithReturner(engine, moriaId, "north");
    view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(moriaId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace removal by its controller's effect", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07BoaHancock038,
      character: [op07GeckoMoria042, eb01Doma005],
      hand: [returnCharacter],
    });
    const moriaId = engine.findCardInZone("south", "character", op07GeckoMoria042);

    targetWithReturner(engine, moriaId, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(moriaId);
    expect(view.prompts).toHaveLength(0);
  });
});
