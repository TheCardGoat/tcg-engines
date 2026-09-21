import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDetonate,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGorillaArms,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const detonate = welcomeToNightCityRetailDetonate;

describe("Detonate", () => {
  it("is the exact 1-cost red Quickhack Program that defeats one rival Gear with power 2 or less", () => {
    expect(detonate).toMatchObject({
      canonicalId: "detonate",
      slug: "detonate",
      name: "Detonate",
      displayName: "Detonate",
      type: "program",
      color: "red",
      classifications: ["Quickhack"],
      cost: 1,
      power: null,
      ram: 2,
      hasSellTag: true,
      printNumber: "031",
      rulesText: "{Quick} Defeat a rival Gear with power 2 or less.",
      keywords: ["quick"],
      reminderText: ["Discard programs after they resolve."],
    });
    expect(detonate.abilities).toEqual([
      {
        kind: "keyword",
        text: "QUICK",
        keyword: "quick",
        source: { selector: "self" },
        effects: [],
      },
      {
        kind: "triggered",
        text: "Defeat a rival Gear with power 2 or less.",
        trigger: { trigger: "play" },
        source: { selector: "self" },
        effects: [
          {
            effect: "defeat",
            target: {
              selector: "card",
              controller: "rival",
              zones: ["field"],
              cardTypes: ["gear"],
              maxPower: 2,
              selection: { mode: "choose", min: 1, max: 1 },
            },
          },
        ],
      },
    ]);
  });

  it("defeats an equipped rival Gear of power 2 or less", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [detonate],
        eddies: 1,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
      },
    );

    engine.playCard(detonate, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailKiroshiOptics, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      detonate.id,
    );
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getEvents("cardDefeated")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ cardId: expect.any(String), playerId: P2 }),
      ]),
    );
  });

  it("offers exactly a rival Gear at the inclusive power-2 boundary", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [detonate],
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
        eddies: 1,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailRidingNomad,
            spent: false,
            attachedGears: [
              welcomeToNightCityRetailMantisBlades,
              welcomeToNightCityRetailGorillaArms,
            ],
          },
        ],
      },
    );

    engine.playCard(detonate, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Gear choice.");
    const mantis = engine.getCard(welcomeToNightCityRetailMantisBlades, "field", P2);
    const friendlyOptics = engine.getCard(welcomeToNightCityRetailKiroshiOptics, "field", P1);
    const gorilla = engine.getCard(welcomeToNightCityRetailGorillaArms, "field", P2);
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    expect(choice.payload.eligibleIds).toEqual([mantis.instanceId]);
    expect(choice.payload.eligibleIds).not.toContain(friendlyOptics.instanceId);
    expect(choice.payload.eligibleIds).not.toContain(gorilla.instanceId);

    engine.resolveEffectTarget(welcomeToNightCityRetailMantisBlades, { as: P1 });
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMantisBlades.id,
    );
  });

  it("can be played as a QUICK reaction during a rival attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [detonate], eddies: 1 },
      {
        field: [
          {
            card: welcomeToNightCityRetailRidingNomad,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P2 });
    engine.resolveAttack({ as: P2 });
    expect(engine.playCard(detonate, { as: P1 })).toMatchObject({ success: true });
    engine.resolveEffectTarget(welcomeToNightCityRetailMantisBlades, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMantisBlades.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      detonate.id,
    );
  });

  it("does not offer a Gear whose power is greater than 2", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [detonate],
        eddies: 1,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            attachedGears: [welcomeToNightCityRetailGorillaArms],
          },
        ],
      },
    );

    engine.playCard(detonate, { as: P1 });

    const gorilla = engine.getCard(welcomeToNightCityRetailGorillaArms, "field", P2);
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).not.toBe("chooseTarget");
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailGorillaArms.id,
    );
    expect(gorilla.zone).toBe("field");
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      detonate.id,
    );
  });
});
