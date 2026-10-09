import {
  welcomeToNightCityRetailRogueAmendiaresQueenOfTheAfterlife as rogue,
  welcomeToNightCityRetailZetatechFaceplate as faceplate,
  welcomeToNightCityRetailDeadmanTransmitter as transmitter,
} from "@tcg/cyberpunk-cards";
import { LocalEngine } from "../transport/local-engine.ts";
import { ReplayBuilder, ReplayEngine } from "../replay/index.ts";
import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailOffdutyMalfini as attacker,
  welcomeToNightCityRetailCorpoSecurity as blocker,
  welcomeToNightCityRetailRebootOptics as quick,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../testing/test-engine.ts";
import type { PlayerFixture } from "../testing/test-fixtures.ts";

function game(defender: PlayerFixture = {}) {
  return CyberpunkTestEngine.createWithFixture(
    { field: [{ card: attacker, hasLag: false, spent: false }] },
    { legendArea: [], eddies: 0, hand: [], field: [{ card: blocker, spent: true }], ...defender },
    { combatProgression: "automatic" },
  );
}
function hold(engine: CyberpunkTestEngine, mode: "automatic" | "hold") {
  return engine.executeMove("setCombatPriority", { args: { mode } }, P2);
}

describe("automatic combat and private hold", () => {
  it.each([0, 8])("finishes empty combat with %i Eddies without intermediate clicks", (eddies) => {
    const engine = game({ eddies });
    const result = engine.attackUnit(attacker, blocker, { as: P1 });
    expect(result.success).toBe(true);
    expect(engine.getState().G.attackState, JSON.stringify(engine.getPrompt(P2))).toBeNull();
    expect(engine.getCard(blocker, "trash", P2).zone).toBe("trash");
    expect(engine.getState().G.players[P2]!.combatPriority).toBe("automatic");
  });

  it("allows arming while waiting, holds only React, and passes directly through Fight", () => {
    const engine = game();
    expect(hold(engine, "hold").success).toBe(true);
    engine.attackUnit(attacker, blocker, { as: P1 });
    expect(engine.getState().G.attackState?.step).toBe("react");
    engine.executeMove("resolveAttack", { args: { pass: true } }, P2);
    expect(engine.getState().G.attackState, JSON.stringify(engine.getPrompt(P2))).toBeNull();
    expect(engine.getState().G.players[P2]!.combatPriority).toBe("hold");
  });

  it("keeps hold active for a second combat until explicitly switched off", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: attacker, hasLag: false, spent: false },
          { card: attacker, hasLag: false, spent: false },
        ],
      },
      {
        legendArea: [],
        hand: [],
        eddies: 0,
        field: [
          { card: blocker, spent: true },
          { card: blocker, spent: true },
        ],
      },
      { combatProgression: "automatic" },
    );
    const attackers = [...engine.getState().G.players[P1]!.zones.field];
    const defenders = [...engine.getState().G.players[P2]!.zones.field];
    hold(engine, "hold");
    for (let index = 0; index < 2; index++) {
      expect(
        engine.executeMove(
          "attackUnit",
          {
            args: {
              attackerId: attackers[index],
              defenderId: defenders[index],
            },
          },
          P1,
        ).success,
      ).toBe(true);
      expect(engine.getState().G.attackState?.step).toBe("react");
      expect(engine.executeMove("resolveAttack", { args: { pass: true } }, P2).success).toBe(true);
      expect(engine.getState().G.attackState).toBeNull();
      expect(engine.getState().G.players[P2]!.combatPriority).toBe("hold");
    }
    expect(engine.getState().G.players[P2]!.zones.trash).toHaveLength(2);
  });

  it("disabling hold settles the empty held window", () => {
    const engine = game();
    hold(engine, "hold");
    engine.attackUnit(attacker, blocker, { as: P1 });
    hold(engine, "automatic");
    expect(engine.getState().G.attackState, JSON.stringify(engine.getPrompt(P2))).toBeNull();
  });

  it("stops for a ready BLOCKER with zero Eddies", () => {
    const engine = game({
      field: [{ card: blocker, spent: false }],
      gigArea: [{ dieType: "d8", faceValue: 4 }],
    });
    engine.attackRival(attacker, { as: P1 });
    expect(engine.getState().G.attackState?.step).toBe("react");
    engine.useBlocker(blocker, { as: P2 });
    expect(engine.getState().G.attackState, JSON.stringify(engine.getPrompt(P2))).toBeNull();
    expect(engine.getCard(blocker, "trash", P2).zone).toBe("trash");
    expect(engine.getState().G.players[P2]!.gigArea).toHaveLength(1);
  });

  it.each([0, 2])("only pauses for payable QUICK Programs (%i Eddies)", (eddies) => {
    const engine = game({ hand: [quick], eddies });
    engine.attackUnit(attacker, blocker, { as: P1 });
    expect(engine.getState().G.attackState?.step ?? null).toBe(eddies === 0 ? null : "react");
  });

  it("does not let the attacker pass the defender's held window", () => {
    const engine = game();
    hold(engine, "hold");
    engine.attackUnit(attacker, blocker, { as: P1 });
    expect(engine.executeMove("resolveAttack", { args: { pass: true } }, P1).success).toBe(false);
    expect(engine.getState().G.attackState?.step).toBe("react");
  });
});

describe("combat decision boundaries", () => {
  it.each([0, 1, 2])("retains only payable QUICK activated abilities (%i Eddies)", (eddies) => {
    const engine = game({
      eddies,
      field: [
        { card: blocker, spent: true },
        { card: rogue, spent: false, hasLag: false },
      ],
    });
    engine.attackUnit(attacker, blocker, { as: P1 });
    expect(engine.getState().G.attackState?.step ?? null).toBe(eddies === 2 ? "react" : null);
    if (eddies === 2) {
      engine.activateAbility(rogue, 2, { as: P2 });
      expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
      engine.resolveEffectTarget(attacker, { as: P2 });
      expect(engine.getState().G.attackState).toBeNull();
      expect(engine.getCard(attacker, "trash", P1)).toBeDefined();
    }
  });

  it("preserves spend-trigger Gig selection before React and resumes after the choice", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: attacker, hasLag: false, spent: false, attachedGears: [faceplate] }],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      { field: [{ card: blocker, spent: true }], legendArea: [], eddies: 0, hand: [] },
      { combatProgression: "automatic" },
    );
    engine.attackUnit(attacker, blocker, { as: P1 });
    expect(engine.getState().G.attackState?.step).toBe("attack");
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    engine.resolveEffectTargetIds([], { as: P1 });
    expect(engine.getState().G.attackState).toBeNull();
    expect(engine.getCard(blocker, "trash", P2)).toBeDefined();
  });

  it("preserves the defending player's defeat replacement choice", () => {
    const engine = game({
      field: [{ card: blocker, spent: true, attachedGears: [transmitter, transmitter] }],
    });
    engine.attackUnit(attacker, blocker, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseSacrificialGear");
    expect(engine.getLocalEngine().getEffectiveActivePlayerId()).toBe(P2);
    const gearId = engine.getCard(blocker, "field", P2).meta.attachedGearIds[0]!;
    engine.chooseSacrificialGear(gearId, { as: P2 });
    expect(engine.getState().G.attackState).toBeNull();
    expect(engine.getCard(blocker, "field", P2)).toBeDefined();
    expect(engine.getCardsInZone("trash", P2)).toHaveLength(1);
  });

  it("preserves the attacking player's choice of Gig to steal", () => {
    const engine = game({
      gigArea: [
        { dieType: "d6", faceValue: 2 },
        { dieType: "d8", faceValue: 3 },
      ],
    });
    engine.attackRival(attacker, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseGigsToSteal");
    const dieId = engine.findGigIdByType(P2, "d8");
    engine.executeMove("resolveStealGigs", { args: { dieIds: [dieId] } }, P1);
    expect(engine.getState().G.attackState).toBeNull();
    expect(engine.getState().G.players[P1]!.gigArea).toContain(dieId);
  });

  it("replays current combat and rejects incompatible historical command semantics", () => {
    const engine = game();
    const state = engine.getState();
    const command = {
      commandID: "attack",
      move: "attackUnit",
      input: {
        args: {
          attackerId: state.G.players[P1]!.zones.field[0],
          defenderId: state.G.players[P2]!.zones.field[0],
        },
      },
      playerId: P1,
      stateID: 1,
      timestamp: 1000,
    };
    const data = new ReplayBuilder().setInitialState(state).addCommand(command).build();
    expect(new ReplayEngine(data).jumpToStep(0)?.G.attackState).toBeNull();
    for (const version of ["1.0.0", "2.0.0"]) {
      expect(() => new ReplayEngine({ ...data, version })).toThrow(
        "Unsupported Cyberpunk replay version",
      );
    }
  });

  it("charges the defender while held and grants no action bonus for a preference or automatic step", () => {
    const fixture = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, hasLag: false, spent: false }] },
      { legendArea: [], hand: [], eddies: 0, field: [{ card: blocker, spent: true }] },
      {
        timeControl: {
          mode: "dynamic",
          config: {
            initialReserveMs: 10000,
            reserveCapMs: 20000,
            perActionBonusMs: 100,
            perTurnPassBonusMs: 0,
            resetTimeOnSkipMs: 0,
            graceMs: 0,
          },
        },
      },
    );
    const state = structuredClone(fixture.getState());
    for (const clock of Object.values(state.ctx.clockState!)) clock.lastUpdatedAtMs = 1000;
    const engine = new LocalEngine(state);
    engine.processCommand(
      {
        commandID: "hold",
        move: "setCombatPriority",
        input: { args: { mode: "hold" } },
        timestamp: 1100,
      },
      P2,
    );
    engine.processCommand(
      {
        commandID: "attack",
        move: "attackUnit",
        input: {
          args: {
            attackerId: state.G.players[P1]!.zones.field[0],
            defenderId: state.G.players[P2]!.zones.field[0],
          },
        },
        timestamp: 1200,
      },
      P1,
    );
    expect(engine.getState().ctx.clockState![P2]!.isOnClock).toBe(true);
    engine.processCommand(
      {
        commandID: "release",
        move: "setCombatPriority",
        input: { args: { mode: "automatic" } },
        timestamp: 1500,
      },
      P2,
    );
    expect(engine.getState().ctx.clockState![P2]!.totalConsumedMs).toBe(300);
    expect(engine.getState().ctx.clockState![P2]!.actionBonusMsGranted ?? 0).toBe(0);
    expect(engine.getState().ctx.clockState![P1]!.actionBonusMsGranted).toBe(100);
    expect(engine.getState().ctx.clockState![P1]!.isOnClock).toBe(true);
  });
});
