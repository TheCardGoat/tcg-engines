import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailWildInTheStreets,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const wild = welcomeToNightCityRetailWildInTheStreets;

describe("Wild in the Streets", () => {
  it("has the exact green Ganger identity and mandatory spent-Unit defeat DSL", () => {
    expect(wild).toMatchObject({
      canonicalId: "wild-in-the-streets",
      slug: "wild-in-the-streets",
      name: "Wild in the Streets",
      displayName: "Wild in the Streets",
      type: "program",
      color: "green",
      classifications: ["Ganger"],
      cost: 5,
      power: null,
      ram: 4,
      hasSellTag: true,
      rarity: "Common",
      printNumber: "105",
      timingTriggers: ["play"],
      reminderText: ["Discard programs after they resolve."],
      rulesText: "Defeat a spent Unit.",
      abilities: [
        {
          kind: "triggered",
          text: "Defeat a spent Unit.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "defeat",
              target: {
                selector: "card",
                zones: ["field"],
                cardTypes: ["unit"],
                state: "spent",
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 5 and rejects one less before creating a target choice", () => {
    const success = CyberpunkTestEngine.createWithFixture(
      { hand: [wild], legendArea: [], eddies: 5 },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );
    success.playCard(wild, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    expect(success.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");

    const short = CyberpunkTestEngine.createWithFixture(
      { hand: [wild], legendArea: [], eddies: 4 },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );
    expect(short.expectFailure(() => short.playCard(wild, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
    expect(short.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("asks which spent Unit to defeat", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailWildInTheStreets], eddies: 5 },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true },
          { card: welcomeToNightCityRetailFieldOperator, spent: true },
        ],
      },
    );

    const playResult = engine.playCard(welcomeToNightCityRetailWildInTheStreets, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    const programId = engine.findCardId(wild, "trash", P1);
    const targetId = engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2);
    expect(playResult.animationScript.steps).toContainEqual(
      expect.objectContaining({
        kind: "cardMove",
        cardId: programId,
        fromZone: "hand",
        toZone: "trash",
        presentation: "resolving-effect",
      }),
    );

    const resolveResult = engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, {
      as: P1,
    });
    const targeting = resolveResult.animationScript.steps.find(
      (step) => step.kind === "effectTarget",
    );
    const defeatedExit = resolveResult.animationScript.steps.find(
      (step) => step.kind === "cardExit" && step.cardId === targetId,
    );
    expect(targeting).toMatchObject({
      sourceCardId: programId,
      targets: [{ kind: "card", cardId: targetId }],
      presentation: "source-card",
      sourceExit: { zone: "trash", playerId: P1 },
      label: "Defeat",
      tone: "negative",
    });
    expect(defeatedExit?.startMs).toBe(620);
    expect(defeatedExit?.startMs).toBeLessThan(
      (targeting?.startMs ?? 0) + (targeting?.durationMs ?? 0),
    );

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(wild.id);
  });

  it("can target either player's spent Unit but excludes every ready Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [wild],
        legendArea: [],
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true },
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
        ],
        eddies: 5,
      },
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: true },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
        ],
      },
    );
    engine.playCard(wild, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("Expected a spent-Unit target choice.");
    }
    expect(new Set(choice.payload.eligibleIds)).toEqual(
      new Set([
        engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P1),
        engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P2),
      ]),
    );
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("leaves a ready Unit on the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailWildInTheStreets], eddies: 5 },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }] },
    );

    engine.playCard(welcomeToNightCityRetailWildInTheStreets, { as: P1 });

    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });
});
