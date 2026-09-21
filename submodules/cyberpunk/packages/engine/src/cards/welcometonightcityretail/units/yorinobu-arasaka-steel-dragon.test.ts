import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJackieWellesRideOrDieChoom,
  welcomeToNightCityRetailLiveWithTheAftermath,
  welcomeToNightCityRetailYorinobuArasakaSteelDragon,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const aftermath = welcomeToNightCityRetailLiveWithTheAftermath;
const yorinobu = welcomeToNightCityRetailYorinobuArasakaSteelDragon;

describe("Yorinobu Arasaka - Steel Dragon", () => {
  it("has the exact red Arasaka Corpo identity and both printed ability DSLs", () => {
    expect(yorinobu).toMatchObject({
      canonicalId: "yorinobu-arasaka-steel-dragon",
      slug: "yorinobu-arasaka-steel-dragon",
      name: "Yorinobu Arasaka",
      subname: "Steel Dragon",
      displayName: "Yorinobu Arasaka: Steel Dragon",
      type: "unit",
      color: "red",
      classifications: ["Arasaka", "Corpo"],
      cost: 7,
      power: 9,
      ram: 3,
      hasSellTag: false,
      rarity: "Rare",
      printNumber: "022",
      rulesText:
        "{Play} You may play a Unit with cost 4 or less from your hand or trash for free. It can attack rival Units this turn.\nThe first time an ARASAKA Unit is defeated each turn, draw 1.",
      timingTriggers: ["play"],
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          bindings: [
            {
              id: "selectedUnit",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["hand", "trash"],
                cardTypes: ["unit"],
                maxCost: 4,
                selection: { mode: "choose", min: 0, max: 1 },
              },
            },
          ],
          effects: [
            { effect: "playCard", target: { selector: "bound", id: "selectedUnit" }, free: true },
            {
              effect: "grantRule",
              target: { selector: "bound", id: "selectedUnit" },
              rule: "canAttackOnPlayedTurnAgainstUnits",
              duration: "turn",
            },
          ],
        },
        {
          kind: "triggered",
          trigger: {
            trigger: "event",
            event: {
              event: "cardDefeated",
              player: "any",
              target: { selector: "card", cardTypes: ["unit"], classifications: ["Arasaka"] },
            },
          },
          limits: ["firstTimeEachTurn"],
          source: { selector: "self" },
          effects: [{ effect: "draw", player: "friendly", amount: 1 }],
        },
      ],
    });
  });

  it("costs exactly 7 and rejects one less", () => {
    const paid = CyberpunkTestEngine.createWithFixture({ hand: [yorinobu], eddies: 7 });
    paid.spendAllLegends();
    paid.playCard(yorinobu, { as: P1 });
    paid.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);
    expect(paid.getEddies(P1)).toBe(0);

    const short = CyberpunkTestEngine.createWithFixture({ hand: [yorinobu], eddies: 6 });
    short.spendAllLegends();
    expect(short.expectFailure(() => short.playCard(yorinobu, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
  });

  it("plays a cheap Unit for free and lets it attack rival Units this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailYorinobuArasakaSteelDragon,
          welcomeToNightCityRetailDelamainCab,
        ],
        eddies: 7,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailYorinobuArasakaSteelDragon, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.expectNoPendingChoice();
    expect(engine.getEddies(P1)).toBe(0);

    const delamainId = engine.findCardId(welcomeToNightCityRetailDelamainCab, "field", P1);
    expect(getEffectiveRules(engine.getState(), delamainId)).toContain(
      "canAttackOnPlayedTurnAgainstUnits",
    );
    expect(() =>
      engine.attackUnit(
        welcomeToNightCityRetailDelamainCab,
        welcomeToNightCityRetailCorpoSecurity,
        {
          as: P1,
        },
      ),
    ).not.toThrow();
  });

  it("does not let the free Unit attack a rival Gig area on its played turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [yorinobu, welcomeToNightCityRetailDelamainCab], eddies: 7 },
      { gigArea: [{ dieType: "d4", faceValue: 3 }] },
    );
    engine.playCard(yorinobu, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailDelamainCab, { as: P1 });

    expect(
      engine.expectFailure(() =>
        engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 }),
      ).errorCode,
    ).toBe("LAG");
    const delamainId = engine.findCardId(welcomeToNightCityRetailDelamainCab, "field", P1);
    engine.completeTurn({ as: P1 });
    expect(getEffectiveRules(engine.getState(), delamainId)).not.toContain(
      "canAttackOnPlayedTurnAgainstUnits",
    );
  });

  it("allows declining the free play even with an eligible Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [yorinobu, welcomeToNightCityRetailFieldOperator],
      eddies: 7,
    });
    engine.playCard(yorinobu, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseTarget",
      payload: { type: "effectTarget", min: 0, max: 1, canDecline: true },
    });
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    engine.expectNoPendingChoice();
  });

  it("plays a cheap Unit from trash for free", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailYorinobuArasakaSteelDragon],
      trash: [welcomeToNightCityRetailFieldOperator],
      eddies: 7,
    });

    engine.playCard(welcomeToNightCityRetailYorinobuArasakaSteelDragon, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      zone: "trash",
    });
    engine.expectNoPendingChoice();

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("skips the free-play effect when there is no valid Unit target", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [
        welcomeToNightCityRetailYorinobuArasakaSteelDragon,
        embracingPowerRetailStarterDeckMinotaur,
      ],
      eddies: 7,
    });

    engine.playCard(welcomeToNightCityRetailYorinobuArasakaSteelDragon, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseTarget",
      payload: {
        type: "effectTarget",
        eligibleIds: [],
      },
    });
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);
    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      embracingPowerRetailStarterDeckMinotaur.id,
    );
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailYorinobuArasakaSteelDragon.id,
    ]);
  });

  it("draws only for the first Arasaka Unit defeated each turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailCorpoSecurity],
        field: [
          welcomeToNightCityRetailYorinobuArasakaSteelDragon,
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
          { card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 8 }],
      },
    );
    const handBefore = engine.getHandCount(P1);

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore + 1);

    engine.attackUnit(
      embracingPowerRetailStarterDeckMinotaur,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailFieldOperator.id,
        embracingPowerRetailStarterDeckMinotaur.id,
      ]),
    );
  });

  it("does not draw when a non-Arasaka Unit is defeated", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          welcomeToNightCityRetailYorinobuArasakaSteelDragon,
          {
            card: welcomeToNightCityRetailJackieWellesRideOrDieChoom,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 8 }],
      },
    );
    const handBefore = engine.getHandCount(P1);

    engine.attackUnit(
      welcomeToNightCityRetailJackieWellesRideOrDieChoom,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailJackieWellesRideOrDieChoom.id,
    );
  });

  it("draws when an Arasaka Unit is defeated by an effect (Live with the Aftermath)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [aftermath],
        eddies: 3,
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          welcomeToNightCityRetailYorinobuArasakaSteelDragon,
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        ],
      },
      {
        field: [welcomeToNightCityRetailCorpoSecurity],
      },
      { preserveDeckOrder: true },
    );

    engine.playCard(aftermath, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      allowPendingChoice: true,
      reason: "the rival must now choose their own Unit",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P2 });

    expect(engine.getHandCount(P1)).toBe(1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([aftermath.id, welcomeToNightCityRetailFieldOperator.id]),
    );
  });

  it("draws when the first defeated Arasaka Unit belongs to the Rival", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailFieldOperator],
        field: [
          yorinobu,
          { card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false },
        ],
      },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true }] },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(
      embracingPowerRetailStarterDeckMinotaur,
      welcomeToNightCityRetailFieldOperator,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getHandCount(P1)).toBe(1);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("resets the first-defeat limit for a later turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        field: [
          yorinobu,
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
          { card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false },
        ],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 8 }] },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
    expect(engine.getHandCount(P1)).toBe(1);

    engine.completeTurn({ as: P1 });
    engine.completeTurn({ as: P2 });
    engine.judgeSpendCard(welcomeToNightCityRetailCorpoSecurity, { as: P2 });
    const handBeforeLaterDefeat = engine.getHandCount(P1);
    engine.attackUnit(
      embracingPowerRetailStarterDeckMinotaur,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBeforeLaterDefeat + 1);
  });
});
