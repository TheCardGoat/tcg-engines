import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJapantownJonin,
  welcomeToNightCityRetailMandibularUpgrade,
  welcomeToNightCityRetailTowerfall,
  welcomeToNightCityRetailTygerSWhisper,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const towerfall = welcomeToNightCityRetailTowerfall;

describe("Towerfall", () => {
  it("has the exact blue Braindance identity and conditional three-option DSL", () => {
    expect(towerfall).toMatchObject({
      canonicalId: "towerfall",
      slug: "towerfall",
      name: "Towerfall",
      displayName: "Towerfall",
      type: "program",
      color: "blue",
      classifications: ["Braindance"],
      cost: 6,
      power: null,
      ram: 4,
      hasSellTag: true,
      rarity: "Epic",
      printNumber: "138",
      timingTriggers: ["play"],
      reminderText: ["Discard programs after they resolve."],
      rulesText:
        "Choose one effect. If you have less ☆ (Street Cred) than a Rival, choose both instead.\nGive all rival Units -5 power this turn. // Bottom-deck all rival Units with power 0.",
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "chooseEffect",
              options: [
                {
                  id: "both",
                  conditions: [
                    {
                      condition: "streetCredComparison",
                      controller: "friendly",
                      comparison: "lt",
                      other: "rival",
                    },
                  ],
                  effects: [
                    {
                      effect: "modifyPower",
                      target: {
                        selector: "card",
                        controller: "rival",
                        zones: ["field"],
                        cardTypes: ["unit"],
                      },
                      value: -5,
                      duration: "turn",
                    },
                    {
                      effect: "moveCard",
                      target: {
                        selector: "card",
                        controller: "rival",
                        zones: ["field"],
                        cardTypes: ["unit"],
                        maxPower: 0,
                      },
                      destination: "deckBottom",
                    },
                  ],
                },
                {
                  id: "power-down",
                  conditions: [
                    {
                      condition: "not",
                      of: {
                        condition: "streetCredComparison",
                        controller: "friendly",
                        comparison: "lt",
                        other: "rival",
                      },
                    },
                  ],
                  effects: [
                    {
                      effect: "modifyPower",
                      target: {
                        selector: "card",
                        controller: "rival",
                        zones: ["field"],
                        cardTypes: ["unit"],
                      },
                      value: -5,
                      duration: "turn",
                    },
                  ],
                },
                {
                  id: "bottom-deck",
                  conditions: [
                    {
                      condition: "not",
                      of: {
                        condition: "streetCredComparison",
                        controller: "friendly",
                        comparison: "lt",
                        other: "rival",
                      },
                    },
                  ],
                  effects: [
                    {
                      effect: "moveCard",
                      target: {
                        selector: "card",
                        controller: "rival",
                        zones: ["field"],
                        cardTypes: ["unit"],
                        maxPower: 0,
                      },
                      destination: "deckBottom",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("pays exactly 6 and rejects one less before offering a mode", () => {
    const createEngine = (eddies: number) => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [towerfall],
          eddies,
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
        { gigArea: [{ dieType: "d4", faceValue: 1 }] },
      );
      for (const legend of engine.getCardsInZone("legendArea", P1)) {
        engine.judgeSpendCard(legend, { as: P1 });
      }
      return engine;
    };

    const success = createEngine(6);
    success.playCard(towerfall, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    expect(success.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseEffect");

    const short = createEngine(5);
    expect(short.expectFailure(() => short.playCard(towerfall, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
  });

  it("gives all rival Units -5 power when that mode is chosen", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailJapantownJonin, spent: false }],
        hand: [towerfall],
        eddies: 6,
        gigArea: [{ dieType: "d12", faceValue: 12 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(towerfall, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseEffect");
    engine.resolveChooseEffect("power-down", { as: P1 });

    const operator = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    expect(welcomeToNightCityRetailFieldOperator.power).toBe(2);
    expect(
      engine
        .getState()
        .G.activeEffects.some(
          (effect) =>
            effect.kind === "powerModifier" &&
            effect.targetCardId === operator.instanceId &&
            effect.powerModifier === -5,
        ),
    ).toBe(true);
    expect(getEffectivePower(engine.getState(), operator.instanceId as string)).toBe(0);
    const friendly = engine.getCard(welcomeToNightCityRetailJapantownJonin, "field", P1);
    expect(getEffectivePower(engine.getState(), friendly.instanceId as string)).toBe(
      welcomeToNightCityRetailJapantownJonin.power,
    );

    engine.completeTurn({ as: P1 });
    expect(getEffectivePower(engine.getState(), operator.instanceId as string)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );
  });

  it("bottom-decks rival Units that already have power 0", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [towerfall],
        eddies: 6,
        gigArea: [{ dieType: "d12", faceValue: 12 }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailTygerSWhisper, spent: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(towerfall, { as: P1 });
    engine.resolveChooseEffect("bottom-deck", { as: P1 });

    expect(engine.getCardsInZone("deck", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailTygerSWhisper.id,
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("bottom-decks rival Units and attached Gear as one randomized batch", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [towerfall],
        eddies: 6,
        gigArea: [{ dieType: "d12", faceValue: 12 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailTygerSWhisper,
            spent: false,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
          { card: welcomeToNightCityRetailJapantownJonin, spent: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { seed: "towerfall-bottom-deck-batch" },
    );

    const fieldBefore = engine.getCardsInZone("field", P2);
    const tyger = fieldBefore.find(
      (card) => card.definitionId === welcomeToNightCityRetailTygerSWhisper.id,
    );
    const jonin = fieldBefore.find(
      (card) => card.definitionId === welcomeToNightCityRetailJapantownJonin.id,
    );
    const mandibular = fieldBefore.find(
      (card) => card.definitionId === welcomeToNightCityRetailMandibularUpgrade.id,
    );
    expect(tyger).toBeDefined();
    expect(jonin).toBeDefined();
    expect(mandibular).toBeDefined();
    expect(tyger?.meta.attachedGearIds).toEqual([mandibular!.instanceId]);

    const unshuffledAppend = [tyger!.instanceId, mandibular!.instanceId, jonin!.instanceId];

    engine.playCard(towerfall, { as: P1 });
    engine.resolveChooseEffect("bottom-deck", { as: P1 });

    expect(engine.getCardsInZone("field", P2)).toEqual([]);
    const bottom = engine
      .getCardsInZone("deck", P2)
      .slice(-unshuffledAppend.length)
      .map((card) => card.instanceId);
    expect([...bottom].sort()).toEqual([...unshuffledAppend].sort());
    expect(bottom).not.toEqual(unshuffledAppend);
  });

  it("applies both modes when the caster has less Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [towerfall],
        eddies: 6,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailTygerSWhisper, spent: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
        ],
        gigArea: [{ dieType: "d12", faceValue: 12 }],
      },
    );

    engine.playCard(towerfall, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();

    expect(engine.getCardsInZone("deck", P2).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailTygerSWhisper.id,
        welcomeToNightCityRetailFieldOperator.id,
      ]),
    );
  });
});
