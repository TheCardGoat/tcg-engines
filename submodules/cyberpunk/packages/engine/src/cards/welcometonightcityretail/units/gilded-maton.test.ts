import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainRideshareAi,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGildedMaton,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Gilded Maton", () => {
  it("is the exact 4-cost 3-power yellow Ganger Valentino with its optional if-you-do Play effect", () => {
    const maton = welcomeToNightCityRetailGildedMaton;

    expect(maton).toMatchObject({
      canonicalId: "gilded-maton",
      slug: "gilded-maton",
      name: "Gilded Matón",
      displayName: "Gilded Matón",
      type: "unit",
      color: "yellow",
      classifications: ["Ganger", "Valentino"],
      cost: 4,
      power: 3,
      ram: 2,
      hasSellTag: false,
      timingTriggers: ["play"],
      printNumber: "045",
      rarity: "Common",
      rulesText:
        "{Play} You may defeat a friendly Gear. If you do, defeat a rival Unit with cost 3 or less.",
    });
    expect(maton.abilities).toHaveLength(1);
    expect(maton.abilities[0]).toMatchObject({
      trigger: { trigger: "play" },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "defeat",
            optional: true,
            target: {
              controller: "friendly",
              zones: ["field", "legendArea"],
              cardTypes: ["gear"],
              attachedTo: {
                controller: "friendly",
                zones: ["field", "legendArea"],
                cardTypes: ["unit", "legend"],
              },
            },
          },
          ifEffects: [
            {
              effect: "defeat",
              target: {
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                maxCost: 3,
                selection: { min: 1, max: 1 },
              },
            },
          ],
        },
      ],
    });
  });

  it("can defeat an attached friendly Gear to defeat exactly a cost-3-or-less rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailGildedMaton],
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
        eddies: 4,
      },
      {
        field: [welcomeToNightCityRetailDelamainRideshareAi, welcomeToNightCityRetailRidingNomad],
      },
    );

    engine.playCard(welcomeToNightCityRetailGildedMaton, { as: P1 });
    engine.resolveCardToMove(welcomeToNightCityRetailKiroshiOptics, {
      as: P1,
    });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected rival Unit choice.");
    const eligible = engine.getCard(welcomeToNightCityRetailDelamainRideshareAi, "field", P2);
    const tooExpensive = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P2);
    expect(choice.payload).toMatchObject({
      min: 1,
      max: 1,
      canDecline: false,
      eligibleIds: [eligible.instanceId],
    });
    expect(choice.payload.eligibleIds).not.toContain(tooExpensive.instanceId);
    engine.resolveEffectTarget(welcomeToNightCityRetailDelamainRideshareAi, { as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailGildedMaton.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailDelamainRideshareAi.id,
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRidingNomad.id,
    );
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(welcomeToNightCityRetailGildedMaton, "field", P1).meta.hasLag).toBe(true);
  });

  it("does not prompt for a rival Unit when the optional Gear defeat is declined", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailGildedMaton],
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
        eddies: 4,
      },
      {
        field: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.playCard(welcomeToNightCityRetailGildedMaton, { as: P1 });
    engine.resolveCardToMove(undefined, { as: P1, pass: true });

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailKiroshiOptics.id,
    );
  });

  it("defeats the friendly Gear and resolves when no rival Unit costs 3 or less", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailGildedMaton],
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
        eddies: 4,
      },
      { field: [welcomeToNightCityRetailRidingNomad] },
    );

    engine.playCard(welcomeToNightCityRetailGildedMaton, { as: P1 });
    engine.resolveCardToMove(welcomeToNightCityRetailKiroshiOptics, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRidingNomad.id,
    );
  });
});
