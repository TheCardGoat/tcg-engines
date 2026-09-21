import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailLesElemens,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Les Élémens", () => {
  it("is the exact blue 5-cost Corpo Program with its mandatory lowest-power move", () => {
    expect(welcomeToNightCityRetailLesElemens).toMatchObject({
      type: "program",
      color: "blue",
      classifications: ["Corpo"],
      printNumber: "133",
      cost: 5,
      ram: 4,
      hasSellTag: true,
      timingTriggers: ["play"],
      abilities: [
        expect.objectContaining({
          trigger: { trigger: "play" },
          effects: [
            {
              effect: "moveCard",
              destination: "deckBottom",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                lowestPower: true,
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
        }),
      ],
    });
  });

  it("bottom-decks the rival's uniquely lowest-power Unit beneath the existing deck", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailLesElemens],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
        eddies: 5,
      },
      {
        deck: [welcomeToNightCityRetailFieldOperator],
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: false },
        ],
      },
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailLesElemens, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    const rivalDeck = engine.getCardsInZone("deck", P2).map((card) => card.definitionId);
    expect(rivalDeck[0]).toBe(welcomeToNightCityRetailFieldOperator.id);
    expect(rivalDeck.at(-1)).toBe(welcomeToNightCityRetailCorpoSecurity.id);
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSwordwiseHuscle.id,
    );
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailLesElemens.id,
    );
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("uses effective power when determining the rival's lowest-power Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailLesElemens], eddies: 5 },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false, powerModifier: 2 },
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: false },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailLesElemens, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type === "chooseTarget") {
      expect(choice.payload.eligibleIds).toEqual([
        engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P2),
      ]);
    }
    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    expect(engine.getCardsInZone("deck", P2).at(-1)?.definitionId).toBe(
      welcomeToNightCityRetailSwordwiseHuscle.id,
    );
  });

  it("allows the player to choose among tied lowest-power Units", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailLesElemens], eddies: 5 },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailLesElemens, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "chooseTarget",
      payload: { eligibleIds: expect.any(Array) },
    });
    if (choice?.type !== "chooseTarget") throw new Error("Expected a tied lowest-power choice.");
    expect(choice.payload.eligibleIds).toHaveLength(2);
    expect(choice.payload.min).toBe(1);
    expect(choice.payload.max).toBe(1);
    engine.resolveEffectTargetIds([choice.payload.eligibleIds![1]!], { as: P1 });

    expect(engine.getCardsInZone("field", P2)).toHaveLength(1);
  });

  it("still pays and trashes itself without opening a choice when no rival Unit exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailLesElemens], eddies: 5 },
      { field: [] },
    );

    engine.playCard(welcomeToNightCityRetailLesElemens, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailLesElemens.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailLesElemens.id,
    );
  });
});
