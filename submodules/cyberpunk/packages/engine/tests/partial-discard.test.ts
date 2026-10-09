import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailPanamPalmerStrengthThroughFamily,
} from "@tcg/cyberpunk-cards";
import type { Effect } from "@tcg/cyberpunk-types";
import { clearDefinitionOverride, overrideDefinition } from "../src/state/card-registry.ts";
import { CyberpunkTestEngine, P1 } from "../src/testing/index.ts";

const panam = welcomeToNightCityRetailPanamPalmerStrengthThroughFamily;
const security = welcomeToNightCityRetailCorpoSecurity;

function withAttackEffect(
  effect: Effect,
  run: (createEngine: (handCount: number) => CyberpunkTestEngine) => void,
): void {
  const attack = structuredClone(panam.abilities[1]!);
  if (attack.kind !== "triggered" || attack.trigger.trigger !== "attack") {
    throw new Error("Expected Panam's attack trigger");
  }
  try {
    run((handCount) => {
      const engine = engineWithHand(handCount);
      overrideDefinition({
        ...panam,
        abilities: [panam.abilities[0]!, { ...attack, effects: [effect] }],
      });
      return engine;
    });
  } finally {
    clearDefinitionOverride(panam.id);
  }
}

function engineWithHand(count: number): CyberpunkTestEngine {
  return CyberpunkTestEngine.createWithFixture(
    {
      field: [{ card: panam, spent: false, hasLag: false }],
      hand: Array.from({ length: count }, () => security),
      deck: Array.from({ length: 4 }, () => security),
    },
    { gigArea: [{ dieType: "d6", faceValue: 3 }] },
  );
}

describe("partial mandatory discard", () => {
  it("discards all available cards when fewer than the requested number exist", () => {
    withAttackEffect(
      { effect: "discardFromHand", player: "friendly", amount: 3 },
      (createEngine) => {
        const engine = createEngine(2);
        engine.attackRival(panam, { as: P1 });
        const choice = engine.getState().G.turnMetadata.pendingChoice;
        expect(choice).toMatchObject({
          type: "chooseTarget",
          payload: { type: "discardFromHand", amount: 2 },
        });
        engine.resolveDiscardFromHand(engine.getCardsInZone("hand", P1), { as: P1 });
        expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
        expect(engine.getCardsInZone("trash", P1)).toHaveLength(2);
      },
    );
  });

  it("withholds the conditional payoff on a partial discard and uses the else branch", () => {
    withAttackEffect(
      {
        effect: "ifYouDo",
        doEffect: { effect: "discardFromHand", player: "friendly", amount: 2 },
        ifEffects: [{ effect: "draw", player: "friendly", amount: 1 }],
        elseEffects: [{ effect: "draw", player: "friendly", amount: 2 }],
      },
      (createEngine) => {
        const partial = createEngine(1);
        partial.attackRival(panam, { as: P1 });
        expect(partial.getCardsInZone("trash", P1)).toHaveLength(1);
        expect(partial.getCardsInZone("hand", P1)).toHaveLength(2);

        const complete = createEngine(2);
        complete.attackRival(panam, { as: P1 });
        complete.resolveDiscardFromHand(complete.getCardsInZone("hand", P1), { as: P1 });
        expect(complete.getCardsInZone("trash", P1)).toHaveLength(2);
        expect(complete.getCardsInZone("hand", P1)).toHaveLength(1);
      },
    );
  });

  it("preserves the else branch after a two-card partial discard choice", () => {
    withAttackEffect(
      {
        effect: "ifYouDo",
        doEffect: { effect: "discardFromHand", player: "friendly", amount: 3 },
        ifEffects: [{ effect: "draw", player: "friendly", amount: 1 }],
        elseEffects: [{ effect: "draw", player: "friendly", amount: 2 }],
      },
      (createEngine) => {
        const engine = createEngine(2);
        engine.attackRival(panam, { as: P1 });
        expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
          type: "chooseTarget",
          payload: { type: "discardFromHand", amount: 2 },
        });
        engine.resolveDiscardFromHand(engine.getCardsInZone("hand", P1), { as: P1 });
        expect(engine.getCardsInZone("trash", P1)).toHaveLength(2);
        expect(engine.getCardsInZone("hand", P1)).toHaveLength(2);
      },
    );
  });

  it.each([false, true])(
    "treats an empty-hand discard-all as no action (optional=%s)",
    (optional) => {
      withAttackEffect(
        {
          effect: "ifYouDo",
          doEffect: { effect: "discardFromHand", player: "friendly", amount: "all", optional },
          ifEffects: [{ effect: "draw", player: "friendly", amount: 1 }],
          elseEffects: [{ effect: "draw", player: "friendly", amount: 2 }],
        },
        (createEngine) => {
          const empty = createEngine(0);
          empty.attackRival(panam, { as: P1 });
          expect(empty.getState().G.turnMetadata.pendingChoice).toBeUndefined();
          expect(empty.getCardsInZone("hand", P1)).toHaveLength(2);

          const nonempty = createEngine(1);
          nonempty.attackRival(panam, { as: P1 });
          if (optional) {
            expect(nonempty.getState().G.turnMetadata.pendingChoice).toMatchObject({
              type: "chooseTarget",
              payload: { type: "discardFromHand", amount: 1, canDecline: true },
            });
            nonempty.resolveDiscardFromHand(nonempty.getCardsInZone("hand", P1), { as: P1 });
          }
          expect(nonempty.getCardsInZone("trash", P1)).toHaveLength(1);
          expect(nonempty.getCardsInZone("hand", P1)).toHaveLength(1);
        },
      );
    },
  );
});
