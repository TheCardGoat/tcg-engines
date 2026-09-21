import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailLiveWithTheAftermath,
  welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
  welcomeToNightCityRetailRebootOptics,
  welcomeToNightCityRetailUnlikelyBond,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectBlockerCandidate,
  expectEligibleTargets,
  expectNoPendingChoice,
  expectPendingChoice,
} from "../../../testing/index.ts";

describe("Lizzy Wizzy - Delicate Weapon", () => {
  it("is the exact blue 5-cost 2-power Rocker with the printed Play ability and Blocker", () => {
    expect(welcomeToNightCityRetailLizzyWizzyDelicateWeapon).toMatchObject({
      type: "unit",
      color: "blue",
      classifications: ["Rocker"],
      printNumber: "117",
      cost: 5,
      power: 2,
      ram: 2,
      hasSellTag: false,
      timingTriggers: ["play"],
      keywords: ["blocker"],
      abilities: [
        expect.objectContaining({ kind: "keyword", keyword: "blocker" }),
        expect.objectContaining({
          trigger: { trigger: "play" },
          bindings: [
            expect.objectContaining({
              id: "selectedProgram",
              target: expect.objectContaining({
                controller: "friendly",
                zones: ["hand", "trash"],
                cardTypes: ["program"],
                maxCost: 3,
                selection: { mode: "choose", min: 0, max: 1 },
              }),
            }),
          ],
          effects: [
            expect.objectContaining({
              effect: "ifYouDo",
              doEffect: expect.objectContaining({ effect: "playCard", free: true }),
              ifEffects: [
                expect.objectContaining({
                  effect: "delayed",
                  timing: "afterTriggerResolution",
                }),
              ],
            }),
          ],
        }),
      ],
    });
  });

  it("offers only friendly hand-or-trash Programs costing at most 3", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
          welcomeToNightCityRetailRebootOptics,
          welcomeToNightCityRetailLiveWithTheAftermath,
          welcomeToNightCityRetailUnlikelyBond,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        trash: [welcomeToNightCityRetailFloorIt],
        eddies: 5,
      },
      { trash: [welcomeToNightCityRetailRebootOptics] },
    );
    const friendlyReboot = engine.getCard(welcomeToNightCityRetailRebootOptics, "hand", P1);
    const friendlyAftermath = engine.getCard(
      welcomeToNightCityRetailLiveWithTheAftermath,
      "hand",
      P1,
    );
    const friendlyFloorIt = engine.getCard(welcomeToNightCityRetailFloorIt, "trash", P1);
    const expensiveProgram = engine.getCard(welcomeToNightCityRetailUnlikelyBond, "hand", P1);
    const nonProgram = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "hand", P1);
    const rivalProgram = engine.getCard(welcomeToNightCityRetailRebootOptics, "trash", P2);

    engine.playCard(welcomeToNightCityRetailLizzyWizzyDelicateWeapon, { as: P1 });

    const choice = expectPendingChoice(engine, "chooseTarget");
    expect(choice.payload).toMatchObject({ min: 0, max: 1, canDecline: true });
    expect(choice.payload.eligibleIds).toEqual(
      expect.arrayContaining([
        friendlyReboot.instanceId,
        friendlyAftermath.instanceId,
        friendlyFloorIt.instanceId,
      ]),
    );
    expect(choice.payload.eligibleIds).not.toEqual(
      expect.arrayContaining([
        expensiveProgram.instanceId,
        nonProgram.instanceId,
        rivalProgram.instanceId,
      ]),
    );
  });

  it("plays a cheap Program from hand for free and bottom-decks it after it resolves", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [
        welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
        welcomeToNightCityRetailRebootOptics,
      ],
      eddies: 5,
    });

    engine.playCard(welcomeToNightCityRetailLizzyWizzyDelicateWeapon, { as: P1 });
    expectEligibleTargets(engine, [welcomeToNightCityRetailRebootOptics], {
      as: P1,
      zone: "hand",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailRebootOptics, { as: P1 });
    expectNoPendingChoice(engine);

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailRebootOptics.id,
    );
    expect(
      engine
        .getCardsInZone("deck", P1)
        .map((card) => card.definitionId)
        .at(-1),
    ).toBe(welcomeToNightCityRetailRebootOptics.id);
  });

  it("can decline the optional Program selection without opening a follow-up play choice", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [
        welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
        welcomeToNightCityRetailRebootOptics,
      ],
      eddies: 5,
    });

    engine.playCard(welcomeToNightCityRetailLizzyWizzyDelicateWeapon, { as: P1 });
    engine.resolveEffectTargetIds([], { as: P1 });

    expectNoPendingChoice(engine);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRebootOptics.id,
    );
  });

  it("plays a cheap Program from trash for free, finishes it, then bottom-decks it", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailLizzyWizzyDelicateWeapon],
        trash: [welcomeToNightCityRetailFloorIt],
        deck: [welcomeToNightCityRetailFieldOperator],
        eddies: 7,
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, hasLag: false }] },
      { preserveDeckOrder: true },
    );
    const rivalUnit = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2);

    engine.playCard(welcomeToNightCityRetailLizzyWizzyDelicateWeapon, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFloorIt, {
      as: P1,
      zone: "trash",
      allowPendingChoice: true,
      reason: "the free Program must finish resolving before it is bottom-decked",
    });

    expectPendingChoice(engine, "chooseTarget");
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
    expect(engine.getCardsInZone("deck", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailFloorIt.id,
    );

    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expectNoPendingChoice(engine);
    expect(getEffectivePower(engine.getState(), rivalUnit.instanceId)).toBe(
      welcomeToNightCityRetailCorpoSecurity.power - 1,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(
      engine
        .getCardsInZone("deck", P1)
        .map((card) => card.definitionId)
        .at(-1),
    ).toBe(welcomeToNightCityRetailFloorIt.id);
    expect(engine.getEddies(P1)).toBe(2);
  });

  it("resolves cleanly when there is no cheap Program in hand or trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [
        welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
        welcomeToNightCityRetailCorpoSecurity,
      ],
      eddies: 5,
    });

    engine.playCard(welcomeToNightCityRetailLizzyWizzyDelicateWeapon, { as: P1 });
    engine.resolveEffectTargetIds([], { as: P1 });

    expectNoPendingChoice(engine);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("uses Blocker while lagging, spends, and redirects a rival direct attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
            spent: false,
            hasLag: true,
          },
        ],
      },
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });
    expectBlockerCandidate(engine, welcomeToNightCityRetailLizzyWizzyDelicateWeapon, { as: P1 });
    engine.useBlocker(welcomeToNightCityRetailLizzyWizzyDelicateWeapon, { as: P1 });

    const lizzy = engine.getCard(welcomeToNightCityRetailLizzyWizzyDelicateWeapon, "field", P1);
    expect(lizzy.meta.spent).toBe(true);
    expect(engine.getState().G.attackState).toMatchObject({
      kind: "fight",
      step: "react",
      defenderId: lizzy.instanceId,
      redirectedByBlocker: true,
    });
  });
});
