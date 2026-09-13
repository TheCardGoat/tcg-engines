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
  it("offers one mode, or both when Street Cred is lower than the Rival's", () => {
    expect(towerfall.abilities[0]?.effects[0]).toMatchObject({
      effect: "chooseEffect",
      options: [{ id: "both" }, { id: "power-down" }, { id: "bottom-deck" }],
    });
  });

  it("gives all rival Units -5 power when that mode is chosen", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
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
