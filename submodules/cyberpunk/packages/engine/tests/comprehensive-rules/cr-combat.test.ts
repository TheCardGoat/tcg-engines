import { beforeAll, describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailPlacideVoodooSentinel,
  welcomeToNightCityRetailRidingNomad,
  welcomeToNightCityRetailRebootOptics,
  welcomeToNightCityRetailSecondhandBombus,
  welcomeToNightCityRetailSketchyRipper,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, registerMatchers } from "../../src/testing/index.ts";
import "../../src/testing/matchers.d.ts";
import { cover } from "./covered-rules.ts";
import { expectMoveAvailable, expectMoveUnavailable } from "./helpers.ts";

beforeAll(() => {
  registerMatchers();
});

describe("CR real-card: attack, fight, steal, react", () => {
  it("spends a ready Unit to fight a spent rival Unit and defeats the loser", () => {
    cover(
      "8.15",
      "9.1",
      "9.2",
      "9.3",
      "9.3.1",
      "9.3.2",
      "9.3.2.1",
      "9.3.3",
      "9.4",
      "9.4.1",
      "9.4.2",
      "9.4.3",
      "9.4.4",
      "9.15",
      "9.16",
      "9.17",
      "9.17.1",
      "9.17.1.1",
      "9.17.2",
      "9.19",
      "9.19.1",
      "9.19.1.1",
      "11.21",
      "11.21.1",
      "9.26.2",
    );
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, hasLag: false }] },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );
    expect(
      engine.attackUnit(
        welcomeToNightCityRetailSwordwiseHuscle,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      ),
    ).toBeSuccessfulCommand();
    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      true,
    );
    engine.resolveFullFight({ as: P1 });
    expect(
      engine
        .getCardsInZone("trash", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailCorpoSecurity.id),
    ).toBe(true);
    expect(engine.getAttackState()).toBeNull();
  });

  it("ends the attack when the attacker is no longer on the field", () => {
    cover("9.26", "9.26.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: welcomeToNightCityRetailFieldOperator, hasLag: false }] },
      { field: [{ card: welcomeToNightCityRetailRidingNomad, spent: true, hasLag: false }] },
    );
    engine.attackUnit(welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailRidingNomad, {
      as: P1,
    });
    engine.resolveFullFight({ as: P1 });
    expect(
      engine
        .getCardsInZone("field", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailFieldOperator.id),
    ).toBe(false);
    expect(engine.getAttackState()).toBeNull();
    expect(engine.getGigCount(P1)).toBe(0);
  });

  it("ends the attack before the fight if the defender leaves the field", () => {
    cover("9.6", "9.13", "9.26.2", "9.27", "9.27.1", "9.27.2", "10.16", "10.16.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: false, hasLag: false },
        ],
        hand: [welcomeToNightCityRetailFloorIt],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }] },
    );
    engine.attackUnit(
      welcomeToNightCityRetailPlacideVoodooSentinel,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    engine.resolveDiscardFromHand([welcomeToNightCityRetailFloorIt], { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    expect(
      engine
        .getCardsInZone("deck", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailCorpoSecurity.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("trash", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailCorpoSecurity.id),
    ).toBe(false);
    expect(
      engine
        .getCardsInZone("field", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailPlacideVoodooSentinel.id),
    ).toBe(true);
    expect(engine.getAttackState()).toBeNull();
    expect(engine.getLastActionLog()).toMatchObject({
      messageKey: "move.resolveAttack.ended",
    });
  });

  it("still resolves other attack-window pending effects after the defender leaves", () => {
    cover("9.28");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailPlacideVoodooSentinel,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
          },
        ],
        hand: [welcomeToNightCityRetailFloorIt],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }] },
    );
    engine.attackUnit(
      welcomeToNightCityRetailPlacideVoodooSentinel,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    const triggerChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(triggerChoice?.type).toBe("chooseTrigger");
    if (triggerChoice?.type !== "chooseTrigger") {
      throw new Error("Expected chooseTrigger for Placide and Dying Night");
    }
    const placideTrigger = triggerChoice.payload.options.find((option) =>
      option.abilityText.toLowerCase().includes("discard"),
    );
    expect(placideTrigger).toBeDefined();
    engine.executeMove("resolveTrigger", { args: { triggerId: placideTrigger!.triggerId } }, P1);
    engine.resolveDiscardFromHand([welcomeToNightCityRetailFloorIt], { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, {
      as: P1,
      allowPendingChoice: true,
      reason: "Dying Night remains pending after the defender left the field",
    });
    expect(
      engine
        .getCardsInZone("deck", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailCorpoSecurity.id),
    ).toBe(true);
    const afterBounce = engine.getState().G.turnMetadata.pendingChoice;
    expect(afterBounce?.type).toBe("chooseTarget");
    if (afterBounce?.type === "chooseTarget" && afterBounce.payload.type !== "adjustGig") {
      engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
        as: P1,
        allowPendingChoice: true,
        reason: "Dying Night still asks how much to decrease the Gig",
      });
    }
    engine.resolveAdjustGig(3, { as: P1 });
    expect(engine.getGigDice(P1)[0]?.faceValue).toBe(3);
    expect(engine.getAttackState()).toBeNull();
  });

  it("cannot attack a ready rival Unit", () => {
    cover("9.3.2", "9.3.2.1", "9.3.2.4");
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, hasLag: false }] },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }] },
    );
    const failure = engine.expectFailure(() =>
      engine.attackUnit(
        welcomeToNightCityRetailSwordwiseHuscle,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      ),
    );
    expect(failure.errorCode).toBe("TARGET_READY");
  });

  it("ties a fight when both Units have equal power, defeating both", () => {
    cover("9.17.3", "9.19.1", "9.19.1.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, hasLag: false }] },
      { field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: true }] },
    );
    engine.attackUnit(
      welcomeToNightCityRetailSwordwiseHuscle,
      welcomeToNightCityRetailSwordwiseHuscle,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailSwordwiseHuscle.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("trash", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailSwordwiseHuscle.id),
    ).toBe(true);
  });

  it("steals Gigs on a direct attack and steals 0 when power is 0", () => {
    cover(
      "5.12",
      "5.12.3",
      "5.12.4",
      "6.7",
      "6.7.1",
      "6.7.1.1",
      "6.7.2",
      "6.7.2.1",
      "6.7.2.2",
      "6.7.3",
      "9.3.2.2",
      "9.4.5",
      "9.21",
      "9.22",
      "9.23",
      "9.23.2",
      "9.23.2.1",
      "9.23.2.2",
      "9.23.3",
      "9.23.5",
      "9.23.5.1",
    );
    const steal = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, hasLag: false }] },
      {
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 4 },
        ],
      },
    );
    const p2Before = steal.getGigCount(P2);
    steal.attackRival(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });
    steal.resolveFullSteal({ as: P1 });
    expect(steal.getGigCount(P2)).toBeLessThan(p2Before);
    expect(steal.getGigCount(P1)).toBeGreaterThan(0);

    const zero = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: welcomeToNightCityRetailSecondhandBombus, hasLag: false }] },
      { gigArea: [{ dieType: "d6", faceValue: 4 }] },
    );
    const p2Gigs = zero.getGigCount(P2);
    zero.attackRival(welcomeToNightCityRetailSecondhandBombus, { as: P1 });
    zero.resolveFullSteal({ as: P1 });
    expect(zero.getGigCount(P2)).toBe(p2Gigs);
    expect(zero.getGigCount(P1)).toBe(0);
  });

  it("lets the defender Call a Legend, play QUICK, and use BLOCKER during the React Step", () => {
    cover(
      "8.12.2",
      "9.7",
      "9.7.1",
      "9.8",
      "9.9",
      "9.9.1",
      "9.10",
      "9.10.1",
      "9.12",
      "9.14",
      "11.11.2.2",
      "11.24",
      "11.24.1",
      "11.24.2",
      "11.24.3",
      "11.26",
      "11.26.1",
      "11.26.1.1",
      "11.26.2",
      "11.26.3",
      "9.11",
    );
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, hasLag: false }] },
      {
        hand: [welcomeToNightCityRetailFloorIt],
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true },
          { card: welcomeToNightCityRetailSecondhandBombus, spent: false, hasLag: false },
        ],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
        eddies: 2,
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );
    engine.attackUnit(
      welcomeToNightCityRetailSwordwiseHuscle,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveAttack({ as: P1 });
    expectMoveAvailable(engine, P2, "callLegend");
    expectMoveAvailable(engine, P2, "playCard");
    expectMoveAvailable(engine, P2, "useBlocker");
    expectMoveUnavailable(engine, P1, "callLegend");
    engine.spendAllLegends(P2);
    expect(
      engine.callLegend(welcomeToNightCityRetailVStreetkid, { as: P2 }),
    ).toBeSuccessfulCommand();
    expect(engine.getEddies(P2)).toBe(1);
    expect(engine.playCard(welcomeToNightCityRetailFloorIt, { as: P2 })).toBeSuccessfulCommand();
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    if (pending?.type === "chooseTarget") {
      engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P2 });
    }
    expect(
      engine.useBlocker(welcomeToNightCityRetailSecondhandBombus, { as: P2 }),
    ).toBeSuccessfulCommand();
    expect(engine.getState().G.attackState?.kind).toBe("fight");
  });

  it("does not allow a non-QUICK Program as a reaction", () => {
    cover("9.10", "11.26.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, hasLag: false }] },
      {
        hand: [welcomeToNightCityRetailRebootOptics, welcomeToNightCityRetailSketchyRipper],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
        eddies: 5,
      },
    );
    engine.spendAllLegends(P2);
    engine.attackUnit(
      welcomeToNightCityRetailSwordwiseHuscle,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveAttack({ as: P1 });
    const play = engine.getPrompt(P2).availableMoves.find((m) => m.moveId === "playCard");
    expect(play?.inputSpec.type).toBe("playCard");
    if (play?.inputSpec.type === "playCard") {
      const ids = play.inputSpec.candidates.map((c) => c.cardId);
      const reboot = engine.findCardId(welcomeToNightCityRetailRebootOptics, "hand", P2);
      const ripper = engine.findCardId(welcomeToNightCityRetailSketchyRipper, "hand", P2);
      expect(ids).toContain(reboot as string);
      expect(ids).not.toContain(ripper as string);
    }
  });
});
