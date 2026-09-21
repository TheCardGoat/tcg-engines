import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMandibularUpgrade,
  welcomeToNightCityRetailSecondhandBombus,
  welcomeToNightCityRetailSandevistan,
  welcomeToNightCityRetailTakeControl,
  welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const viktor = welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch;

describe("Viktor Vektor - You Might Feel a Little Pinch", () => {
  it("has the exact yellow Ripperdoc identity and free trash-equip DSL", () => {
    expect(viktor).toMatchObject({
      canonicalId: "viktor-vektor-you-might-feel-a-little-pinch",
      slug: "viktor-vektor-you-might-feel-a-little-pinch",
      name: "Viktor Vektor",
      subname: "You Might Feel a Little Pinch",
      displayName: "Viktor Vektor: You Might Feel a Little Pinch",
      type: "unit",
      color: "yellow",
      classifications: ["Ripperdoc"],
      cost: 3,
      power: 3,
      ram: 2,
      hasSellTag: false,
      timingTriggers: ["play"],
      rarity: "Uncommon",
      printNumber: "058",
      rulesText:
        "{Play} Play a CYBERWARE Gear with cost 2 or less from your trash for free. Equip it only to another friendly Unit.",
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          bindings: [
            {
              id: "selectedGear",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["trash"],
                cardTypes: ["gear"],
                classifications: ["Cyberware"],
                maxCost: 2,
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
            {
              id: "selectedUnit",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
                excludeSelf: true,
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
          effects: [
            {
              effect: "attachCard",
              target: { selector: "bound", id: "selectedGear" },
              attachTo: { selector: "bound", id: "selectedUnit" },
              free: true,
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 3, enters with Lag, and rejects one less", () => {
    const success = CyberpunkTestEngine.createWithFixture({ hand: [viktor], eddies: 3 });
    success.spendAllLegends();
    success.playCard(viktor, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    expect(success.getCard(viktor, "field", P1).meta.hasLag).toBe(true);

    const short = CyberpunkTestEngine.createWithFixture({ hand: [viktor], eddies: 2 });
    short.spendAllLegends();
    expect(short.expectFailure(() => short.playCard(viktor, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
  });

  it("equips a cheap Cyberware Gear from trash to another friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch],
      field: [welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailSecondhandBombus],
      trash: [welcomeToNightCityRetailMandibularUpgrade],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch, { as: P1 });
    engine.expectEffectTargetChoice(welcomeToNightCityRetailMandibularUpgrade, {
      as: P1,
      zone: "trash",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailMandibularUpgrade, {
      as: P1,
      allowPendingChoice: true,
      reason: "Viktor still needs a friendly Unit to host the chosen Gear",
    });
    engine.expectEffectTargetChoice(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      zone: "field",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.expectAttachedGear(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailMandibularUpgrade,
      {
        as: P1,
      },
    );
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("offers only friendly trash Cyberware costing at most 2, then only another friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [viktor],
        field: [welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailSecondhandBombus],
        trash: [
          welcomeToNightCityRetailMandibularUpgrade,
          welcomeToNightCityRetailZetatechFaceplate,
          welcomeToNightCityRetailSandevistan,
          welcomeToNightCityRetailDyingNightVSPistol,
        ],
        eddies: 3,
      },
      { field: [welcomeToNightCityRetailSecondhandBombus] },
    );
    engine.playCard(viktor, { as: P1 });
    const gearChoice = engine.getState().G.turnMetadata.pendingChoice;
    if (
      !gearChoice ||
      gearChoice.type !== "chooseTarget" ||
      gearChoice.payload.type !== "effectTarget"
    ) {
      throw new Error(`Expected Gear choice, got ${JSON.stringify(gearChoice)}.`);
    }
    expect(new Set(gearChoice.payload.eligibleIds)).toEqual(
      new Set([
        engine.findCardId(welcomeToNightCityRetailMandibularUpgrade, "trash", P1),
        engine.findCardId(welcomeToNightCityRetailZetatechFaceplate, "trash", P1),
      ]),
    );
    engine.resolveEffectTarget(welcomeToNightCityRetailZetatechFaceplate, {
      as: P1,
      allowPendingChoice: true,
      reason: "Viktor still needs a host",
    });
    const hostChoice = engine.getState().G.turnMetadata.pendingChoice;
    if (
      !hostChoice ||
      hostChoice.type !== "chooseTarget" ||
      hostChoice.payload.type !== "effectTarget"
    ) {
      throw new Error("Expected host choice.");
    }
    expect(new Set(hostChoice.payload.eligibleIds)).toEqual(
      new Set([
        engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1),
        engine.findCardId(welcomeToNightCityRetailSecondhandBombus, "field", P1),
      ]),
    );
    expect(hostChoice.payload.eligibleIds).not.toContain(engine.findCardId(viktor, "field", P1));
    expect(hostChoice.payload.eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailSecondhandBombus, "field", P2),
    );
  });

  it("ignores the impossible Gear portion and resolves the remaining mandatory host choice", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch],
      field: [welcomeToNightCityRetailFieldOperator],
      trash: [welcomeToNightCityRetailDyingNightVSPistol, welcomeToNightCityRetailTakeControl],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch, { as: P1 });

    engine.expectEffectTargetChoice(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      zone: "field",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailDyingNightVSPistol.id,
        welcomeToNightCityRetailTakeControl.id,
      ]),
    );
  });

  it("ignores the impossible host portion after selecting an eligible trash Gear", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch],
      trash: [welcomeToNightCityRetailMandibularUpgrade],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch, { as: P1 });

    engine.expectEffectTargetChoice(welcomeToNightCityRetailMandibularUpgrade, {
      as: P1,
      zone: "trash",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailMandibularUpgrade, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMandibularUpgrade.id,
    );
  });

  it("does not prompt when neither a cheap Cyberware Gear nor a host Unit exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch],
      trash: [welcomeToNightCityRetailTakeControl],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
