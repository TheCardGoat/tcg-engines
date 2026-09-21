import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  theHeistRetailStarterDeckDexterDeshawnOneLastChance,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "../../../logging/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const dyingNight = welcomeToNightCityRetailDyingNightVSPistol;

const namedVUnit = {
  ...welcomeToNightCityRetailFieldOperator,
  id: "test-dying-night-v-unit",
  slug: "test-dying-night-v-unit",
  canonicalId: "test-dying-night-v-unit",
  name: "V",
  displayName: "V",
  abilities: [],
  timingTriggers: [],
};

describe("Dying Night — V's Pistol (retail) attack clause", () => {
  it("is the exact 2-cost 2-power blue Merc Weapon Gear with Attack and V end-turn effects", () => {
    expect(dyingNight).toMatchObject({
      canonicalId: "dying-night-v-s-pistol",
      slug: "dying-night-v-s-pistol",
      name: "Dying Night",
      subname: "V's Pistol",
      displayName: "Dying Night: V's Pistol",
      type: "gear",
      color: "blue",
      classifications: ["Merc", "Weapon"],
      cost: 2,
      power: 2,
      ram: 2,
      hasSellTag: true,
      printNumber: "128",
      timingTriggers: ["attack"],
      rulesText:
        '(Equip to a friendly Unit or face-up Legend.)\n{Attack} Decrease a Gig by up to 2. At the end of your turn, if this Unit is named "V", ready 2 Eddies.',
    });
    expect(dyingNight.attachment).toMatchObject({
      target: {
        controller: "friendly",
        zones: ["field", "legendArea"],
        cardTypes: ["unit", "legend"],
        face: "faceUp",
      },
    });
    expect(dyingNight.abilities).toHaveLength(2);
    expect(dyingNight.abilities[0]).toMatchObject({
      trigger: { trigger: "attack" },
      source: { selector: "host" },
      bindings: [{ target: { selector: "gig", amount: 1, selection: { min: 1, max: 1 } } }],
      effects: [{ effect: "adjustGig", maxAmount: 2, direction: "decrease", chooseUpTo: true }],
    });
    expect(dyingNight.abilities[1]).toMatchObject({
      trigger: { trigger: "event", event: { event: "turnEnded", player: "friendly" } },
      source: { selector: "host" },
      effects: [
        {
          effect: "readyEddies",
          player: "friendly",
          amount: 2,
          conditions: [{ condition: "cardName", name: "V" }],
        },
      ],
    });
  });

  it("ATTACK decreases a Gig by up to 2", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
          },
        ],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 6 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });

    // The attack clause suspends an adjustGig value choice. Resolve it by
    // setting the rival d8 to 4 (decrease by 2).
    engine.resolveEffectTargetIds([engine.findGigIdByType(P2, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Dying Night still needs the selected Gig's new face value",
    });
    engine.resolveAdjustGig(4, { as: P1 });

    const rivalDie = engine.getGigDice(P2)[0]!;
    expect(engine.getState().G.gigDice[rivalDie.id]!.faceValue).toBe(4);

    const log = engine.getLastActionLog();
    expect(log?.messageKey).toBe("move.resolveAdjustGig");
    expect(formatActionLog(log!, enMessages)).toBe("Adjusted D8 gig die from 6 to 4.");
  });

  it("does not open an adjust choice when no Gig exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
        },
      ],
    });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getPrompt(P1).choice).toBeNull();
  });

  it("offers either player's Gig and permits decreasing it by 0", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [dyingNight],
          },
        ],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      { gigArea: [{ dieType: "d8", faceValue: 4 }] },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Gig choice.");
    expect(new Set(choice.payload.eligibleIds)).toEqual(
      new Set([engine.findGigIdByType(P1, "d6"), engine.findGigIdByType(P2, "d8")]),
    );
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Dying Night still needs the optional decrease amount",
    });
    engine.resolveAdjustGig(3, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(3);
    engine.expectNoPendingChoice();
  });

  it("readies 2 Eddies at end of turn when equipped to a Legend named 'V'", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: namedVUnit,
          spent: false,
          hasLag: false,
          attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
        },
      ],
      hand: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 6,
    });

    // Play a 2-cost card to move 2 Eddies from `eddies` to `spentEddies`.
    engine.playCard(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    expect(engine.getEddies(P1)).toBe(4);
    expect(engine.getState().G.players[P1].spentEddies).toBe(2);

    // End turn — V legend condition matches → readyEddies(2) fires.
    engine.completeTurn({ as: P1 });

    // 2 spent Eddies readied back during the end-of-turn trigger window.
    expect(engine.getEddies(P1)).toBe(6);
    expect(engine.getState().G.players[P1].spentEddies).toBe(0);
  });

  it("does NOT ready Eddies at end of turn when equipped to a non-V host", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
        },
      ],
      hand: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 6,
    });

    engine.playCard(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    expect(engine.getEddies(P1)).toBe(4);
    expect(engine.getState().G.players[P1].spentEddies).toBe(2);

    engine.completeTurn({ as: P1 });

    // No V host → readyEddies does not fire → Eddies unchanged.
    expect(engine.getEddies(P1)).toBe(4);
    expect(engine.getState().G.players[P1].spentEddies).toBe(2);
  });

  it("readies exactly 2 Eddies and leaves a third spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: namedVUnit,
          spent: false,
          hasLag: false,
          attachedGears: [dyingNight],
        },
      ],
      hand: [theHeistRetailStarterDeckDexterDeshawnOneLastChance],
      eddies: 6,
    });

    engine.playCard(theHeistRetailStarterDeckDexterDeshawnOneLastChance, { as: P1 });
    engine.resolveEffectTargetIds([], { as: P1 });
    expect(engine.getState().G.players[P1].spentEddies).toBe(3);
    engine.completeTurn({ as: P1 });

    expect(engine.getEddies(P1)).toBe(5);
    expect(engine.getState().G.players[P1].spentEddies).toBe(1);
  });
});
