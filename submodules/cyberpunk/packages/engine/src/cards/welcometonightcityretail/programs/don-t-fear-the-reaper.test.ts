import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDonTFearTheReaper,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const reaper = welcomeToNightCityRetailDonTFearTheReaper;

describe("(Don't Fear) The Reaper", () => {
  it("is the exact 7-cost green Samurai Program with ordered spend-all and defeat effects", () => {
    expect(reaper).toMatchObject({
      canonicalId: "don-t-fear-the-reaper",
      slug: "don-t-fear-the-reaper",
      name: "(Don't Fear) The Reaper",
      displayName: "(Don't Fear) The Reaper",
      type: "program",
      color: "green",
      classifications: ["Samurai"],
      cost: 7,
      ram: 3,
      hasSellTag: true,
      printNumber: "098",
      timingTriggers: ["play"],
      rulesText: "Spend all rival Units. Then, defeat a spent Unit.",
      reminderText: ["Discard programs after they resolve."],
    });
    expect(reaper.abilities).toEqual([
      {
        kind: "triggered",
        text: "Spend all rival Units. Then, defeat a spent Unit.",
        trigger: { trigger: "play" },
        source: { selector: "self" },
        effects: [
          {
            effect: "spend",
            target: {
              selector: "card",
              controller: "rival",
              zones: ["field"],
              cardTypes: ["unit"],
            },
          },
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
    ]);
  });

  it("spends all rival Units then defeats a spent Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [reaper],
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: true },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
        ],
        eddies: 7,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
        ],
      },
    );

    engine.playCard(reaper, { as: P1 });
    const rivalCorpo = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2);
    const rivalOperator = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    const friendlyOperator = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    const friendlyCorpo = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P1);
    expect(rivalCorpo.meta.spent).toBe(true);
    expect(rivalOperator.meta.spent).toBe(true);
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected spent Unit choice.");
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    expect(new Set(choice.payload.eligibleIds)).toEqual(
      new Set([rivalCorpo.instanceId, rivalOperator.instanceId, friendlyOperator.instanceId]),
    );
    expect(choice.payload.eligibleIds).not.toContain(friendlyCorpo.instanceId);
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      reaper.id,
    );
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getEvents("cardDefeated")).toHaveLength(1);
  });

  it("can defeat a friendly spent Unit after spending rivals", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [reaper],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true }],
        eddies: 7,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
    );

    engine.playCard(reaper, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("resolves and discards with no spent Unit to defeat", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [reaper],
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      eddies: 7,
    });

    engine.playCard(reaper, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.spent).toBe(
      false,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      reaper.id,
    );
    expect(engine.getEvents("cardDefeated")).toHaveLength(0);
  });
});
