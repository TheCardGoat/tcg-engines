import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03DistantReunion115 } from "./115-distant-reunion.ts";

describe("Distant Reunion (GD03-115)", () => {
  function setup(attackerAp: number, playerLevel: number, pilotTraits = ["x-rounder"]) {
    const pilot = createMockPilot({ traits: pilotTraits, cost: 1 });
    const target = createMockUnit({ ap: 1, hp: 7 });
    const attacker = createMockUnit({ ap: attackerAp, hp: 7 });
    const transitionDefender = createMockUnit({ ap: 0, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03DistantReunion115, pilot],
        play: [target],
        resourceArea: activeResources(playerLevel),
        deck: 5,
      },
      { play: [attacker, { card: transitionDefender, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const targetId = p1.getCardsInZone("battleArea")[0]!;
    const [attackerId, transitionDefenderId] = p2.getCardsInZone("battleArea");
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.assignPilot(pilot, targetId));
    expectSuccess(p1.enterBattle(targetId, transitionDefenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    return { p1, p2, targetId, attackerId: attackerId!, commandId };
  }

  function resolveBattle(ctx: ReturnType<typeof setup>) {
    expectSuccess(ctx.p2.enterBattle(ctx.attackerId, ctx.targetId));
    expectSuccess(ctx.p1.passBlock());
    expectSuccess(ctx.p1.playCommand(ctx.commandId, { targets: [ctx.targetId] }));
    expectSuccess(ctx.p2.passBattleAction());
    expectSuccess(ctx.p1.passBattleAction());
  }

  it("prevents battle damage from an enemy Unit with 2 AP below Lv.7", () => {
    const ctx = setup(2, 6);

    resolveBattle(ctx);

    expect(ctx.p1.getDamage(ctx.targetId)).toBe(0);
    expect(ctx.p2.getDamage(ctx.attackerId)).toBe(2);
  });

  it("does not prevent battle damage from an enemy Unit with 3 AP below Lv.7", () => {
    const ctx = setup(3, 6);

    resolveBattle(ctx);

    expect(ctx.p1.getDamage(ctx.targetId)).toBe(3);
  });

  it("prevents battle damage from an enemy Unit with 5 AP at Lv.7", () => {
    const ctx = setup(5, 7);

    resolveBattle(ctx);

    expect(ctx.p1.getDamage(ctx.targetId)).toBe(0);
  });

  it("cannot target a Unit whose paired Pilot is not an X-Rounder", () => {
    const ctx = setup(2, 6, ["earth federation"]);

    expectSuccess(ctx.p2.enterBattle(ctx.attackerId, ctx.targetId));
    expectSuccess(ctx.p1.passBlock());
    expectFailure(ctx.p1.playCommand(ctx.commandId, { targets: [ctx.targetId] }), "INVALID_TARGET");
  });

  it("can be played as Yurin L'Ciel and visibly grants AP+1", () => {
    const host = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({
      hand: [gd03DistantReunion115],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
  });
});
