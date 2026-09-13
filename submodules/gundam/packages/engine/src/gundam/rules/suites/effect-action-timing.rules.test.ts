/**
 * Spec → tests: ../specs/09-action-steps.md, 10-effect-activation.md (fluent API)
 */

import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCard,
  expectPlayer,
  expectFailure,
  passMainIntoEndAction,
} from "../../index.ts";
import { st01KaiSResolve013 } from "../../../../../cards/src/cards/st01/command/013-kai-s-resolve.ts";
import { st01UnforeseenIncident014 } from "../../../../../cards/src/cards/st01/command/014-unforeseen-incident.ts";
import { st05CgsMobileWorker003 } from "../../../../../cards/src/cards/st05/unit/003-cgs-mobile-worker.ts";
import { st01Gundam001 } from "../../../../../cards/src/cards/st01/unit/001-gundam.ts";
import { st10ZetaGundam002 } from "../../../../../cards/src/cards/st10/unit/002-zeta-gundam.ts";
import { st10MobileWorkerTekkadan010 } from "../../../../../cards/src/cards/st10/unit/010-mobile-worker-tekkadan.ts";

describe("Section 9 — Action Steps (specs/09-action-steps.md)", () => {
  it("9-3-3 / 9-5: consecutive Action Step passes advance the end phase", () => {
    const engine = GundamTestEngine.create({ play: [st01Gundam001], deck: 5 }, { deck: 5 });
    passMainIntoEndAction(engine);
    expect(engine.getState().ctx.status.step === "action-step").toBe(false);
  });

  it("9-2 / 9-3: standby player has first Action priority after main ends", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [st01UnforeseenIncident014],
        play: [st01Gundam001],
        resourceArea: activeResources(4),
        deck: 5,
      },
      {
        hand: [st01UnforeseenIncident014],
        play: [{ card: createMockUnit({ ap: 3, hp: 3 }), exhausted: true }],
        resourceArea: activeResources(4),
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    p1.must.passPhase();
    // Standby (P2) acts first — can play Action command
    p2.must.playCommand(st01UnforeseenIncident014, { targets: [st01Gundam001] });
  });

  it("13-2-4: 【Main】/【Action】 Command resolves during end-phase Action Step", () => {
    const enemy = createMockUnit({ ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [st01UnforeseenIncident014],
        play: [st01Gundam001],
        resourceArea: activeResources(4),
        deck: 5,
      },
      {
        play: [{ card: enemy, exhausted: true }],
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectCard(p2, enemy).toHaveAp(1);
    p1.must.passPhase();
    p2.must.passActionStep();
    p1.must.playCommand(st01UnforeseenIncident014, { targets: [enemy] });
    expectCard(p2, enemy).toHaveAp(0);
    expectPlayer(p1).toHaveZoneCount("trash", 1);
  });

  it("13-2-3 / 9-x: 【Main】-only Command is illegal during Action Step", () => {
    const damaged = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [st01KaiSResolve013],
      play: [{ card: damaged, damage: 2 }],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    p1.must.passPhase();
    p2.must.passActionStep();
    expectFailure(
      p1.playCommand(st01KaiSResolve013, { targets: [p1.unit(damaged).instanceId] }),
      "WRONG_TIMING",
    );
  });
});

describe("Section 10 — Effect Activation (specs/10-effect-activation.md)", () => {
  it("10-1-8 / 3-4-4: 【Main】 Command resolves and goes to trash", () => {
    const damaged = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [st01KaiSResolve013],
      play: [{ card: damaged, damage: 3 }],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.playCommand(st01KaiSResolve013, { targets: [damaged] });
    expectCard(p1, damaged).toHaveDamage(0);
    expectPlayer(p1).toHaveZoneCount("trash", 1);
  });

  it("10-1-7 / 13-2-1: 【Activate･Main】 works in Main and fails in Action Step", () => {
    const ally = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({
      play: [st05CgsMobileWorker003, ally],
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.activateAbility(st05CgsMobileWorker003, 0, { targets: [ally] });
    expectCard(p1, st05CgsMobileWorker003).toBeRested();
    expectCard(p1, ally).toHaveDamage(1);

    const outsideMain = GundamTestEngine.create({
      play: [st05CgsMobileWorker003],
      deck: 5,
    });
    const actionP1 = outsideMain.asPlayer(PLAYER_ONE);
    const actionP2 = outsideMain.asPlayer(PLAYER_TWO);
    actionP1.must.passPhase();
    actionP2.must.passActionStep();
    expectFailure(
      actionP1.activateAbility(st05CgsMobileWorker003, 0, {
        targets: [actionP1.unit(st05CgsMobileWorker003).instanceId],
      }),
      "WRONG_PHASE",
    );
  });

  it("10-1-3 / 13-1-8: optional Development can be declined", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [st10ZetaGundam002],
        trash: [st10ZetaGundam002, st10ZetaGundam002],
        resourceArea: activeResources(5),
      },
      { play: [st10MobileWorkerTekkadan010] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const trashIds = p1.getCardsInZone("trash");
    p1.must.deployUnit(st10ZetaGundam002);
    const development = p1.getBoardView().pendingChoice;
    if (
      development?.kind !== "targetSelection" ||
      development.optionalDirectiveIndex === undefined
    ) {
      throw new Error("Expected optional Development exile choice");
    }
    p1.must.resolveEffect({
      optionalAnswers: { [development.optionalDirectiveIndex]: false },
    });
    expect(p1.getCardsInZone("trash")).toEqual(trashIds);
    expectCard(p2, st10MobileWorkerTekkadan010).toBeReady();
  });

  it("10-1-8-1-1 / 10-2-2: targeted Command fails without a legal target", () => {
    const engine = GundamTestEngine.create({
      hand: [st01UnforeseenIncident014],
      // No enemy Units
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const result = p1.playCommand(st01UnforeseenIncident014);
    expect(result.success).toBe(false);
    if (result.success) throw new Error("expected failure");
    expect(
      result.errorCode === "NO_LEGAL_TARGETS" ||
        result.errorCode === "INVALID_TARGET" ||
        result.errorCode === "ILLEGAL_TARGET" ||
        result.errorCode === "MISSING_TARGET",
    ).toBe(true);
  });

  it("10-2-2: enemy-targeting Command cannot choose a friendly Unit", () => {
    const engine = GundamTestEngine.create({
      hand: [st01UnforeseenIncident014],
      play: [st01Gundam001],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const result = p1.playCommand(st01UnforeseenIncident014, {
      targets: [p1.unit(st01Gundam001).instanceId],
    });
    expect(result.success).toBe(false);
  });
});
