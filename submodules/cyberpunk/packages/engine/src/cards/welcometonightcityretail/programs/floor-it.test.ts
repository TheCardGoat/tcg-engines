import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Floor It", () => {
  it("is the exact 1-cost blue Merc Quickhack Program with QUICK and ordered effects", () => {
    const floorIt = welcomeToNightCityRetailFloorIt;

    expect(floorIt).toMatchObject({
      canonicalId: "floor-it",
      slug: "floor-it",
      name: "Floor It",
      displayName: "Floor It",
      type: "program",
      color: "blue",
      classifications: ["Merc", "Quickhack"],
      cost: 1,
      power: null,
      ram: 2,
      hasSellTag: true,
      timingTriggers: ["play"],
      keywords: ["quick"],
      printNumber: "132",
      rarity: "Common",
      rulesText: "{Quick} Give a rival Unit -1 power this turn. Draw 1.",
      reminderText: ["Discard programs after they resolve."],
    });
    expect(floorIt.abilities).toHaveLength(2);
    expect(floorIt.abilities[0]).toMatchObject({ kind: "keyword", keyword: "quick" });
    expect(floorIt.abilities[1]).toMatchObject({
      trigger: { trigger: "play" },
      effects: [
        {
          effect: "modifyPower",
          target: {
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            selection: { min: 1, max: 1 },
          },
          value: -1,
          duration: "turn",
        },
        { effect: "draw", player: "friendly", amount: 1 },
      ],
    });
  });

  it("gives a rival Unit -1 power this turn and draws 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, hasLag: false }],
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, hasLag: false }],
      },
      { preserveDeckOrder: true },
    );
    const target = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P2);

    engine.playCard(welcomeToNightCityRetailFloorIt, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected rival Unit choice.");
    const friendly = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P1);
    expect(choice.payload).toMatchObject({
      min: 1,
      max: 1,
      canDecline: false,
      eligibleIds: [target.instanceId],
    });
    expect(choice.payload.eligibleIds).not.toContain(friendly.instanceId);

    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });

    expect(getEffectivePower(engine.getState(), target.instanceId)).toBe(
      welcomeToNightCityRetailRidingNomad.power - 1,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
    expect(engine.getEddies(P1)).toBe(0);

    engine.completeTurn({ as: P1 });
    expect(getEffectivePower(engine.getState(), target.instanceId)).toBe(
      welcomeToNightCityRetailRidingNomad.power,
    );
  });

  it("can be played as a QUICK reaction during a rival attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
      },
      { activePlayerId: P2, preserveDeckOrder: true },
    );
    const attacker = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P2);

    engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P2 });
    engine.resolveAttack({ as: P2 });
    expect(engine.playCard(welcomeToNightCityRetailFloorIt, { as: P1 })).toMatchObject({
      success: true,
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });

    expect(getEffectivePower(engine.getState(), attacker.instanceId)).toBe(
      welcomeToNightCityRetailRidingNomad.power - 1,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
  });

  it("still draws 1 when no rival Unit can be targeted (the Draw is independent of the debuff target)", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailFloorIt],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 1,
    });

    const handBefore = engine.getCardsInZone("hand", P1).length;
    const deckBefore = engine.getState().G.players[P1].zones.deck.length;

    engine.playCard(welcomeToNightCityRetailFloorIt, { as: P1 });

    // No target choice (no rival Unit), but the independent "Draw 1" resolves:
    // hand is unchanged (played -1, drew +1) and the deck decreased by one.
    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore);
    expect(engine.getState().G.players[P1].zones.deck.length).toBe(deckBefore - 1);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
  });
});
