import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "../../../logging/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

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
});
