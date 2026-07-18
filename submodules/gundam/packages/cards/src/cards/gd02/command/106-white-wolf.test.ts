import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02WhiteWolf106 } from "./106-white-wolf.ts";

function attackShieldWithLevel(level: number) {
  const attacker = createMockUnit({ level, ap: 2, hp: 5 });
  const shield = createMockUnit({ name: "Protected Shield" });
  const engine = GundamTestEngine.create(
    {
      hand: [gd02WhiteWolf106],
      shieldArea: [shield],
      resourceArea: activeResources(3),
      deck: 3,
    },
    { play: [attacker], deck: 3 },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const attackerId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p2.enterBattle(attackerId, "direct"));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.playCommand(gd02WhiteWolf106));
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());

  return { p1 };
}

function attackBaseWithLevel(level: number) {
  const attacker = createMockUnit({ level, ap: 2, hp: 5 });
  const base = createMockBase({ name: "Protected Base", hp: 5 });
  const engine = GundamTestEngine.create(
    {
      hand: [gd02WhiteWolf106],
      baseSection: [base],
      resourceArea: activeResources(3),
      deck: 3,
    },
    { play: [attacker], deck: 3 },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const baseId = p1.getCardsInZone("baseSection")[0]!;
  const attackerId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p2.enterBattle(attackerId, "direct"));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.playCommand(gd02WhiteWolf106));
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());

  return { p1, baseId };
}

describe("White Wolf (GD02-106)", () => {
  it("prevents a shield-area card from taking damage from an enemy Lv.3 Unit", () => {
    const { p1 } = attackShieldWithLevel(3);

    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(1);
    expect(p1.getCardZone(gd02WhiteWolf106)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("does not prevent damage from an enemy Lv.4 Unit", () => {
    const { p1 } = attackShieldWithLevel(4);

    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
  });

  it("protects its public Base from battle damage dealt by an enemy Lv.3 Unit", () => {
    const { p1, baseId } = attackBaseWithLevel(3);

    expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getDamage(baseId)).toBe(0);
    expect(p1.getBoardView().pendingCombat).toBeUndefined();
  });

  it("does not protect its Base from battle damage dealt by an enemy Lv.4 Unit", () => {
    const { p1, baseId } = attackBaseWithLevel(4);

    expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getDamage(baseId)).toBe(2);
    expect(p1.getBoardView().pendingCombat).toBeUndefined();
  });

  it("can be paired as Woolf Enneacle instead of activating the Command", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd02WhiteWolf106],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
  });

  it("cannot activate during Main", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02WhiteWolf106],
      resourceArea: activeResources(3),
    });

    expectFailure(engine.asPlayer(PLAYER_ONE).playCommand(gd02WhiteWolf106), "WRONG_TIMING");
  });

  it("enforces its printed Lv.3 and active Resource cost 1 in a legal Action step", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02WhiteWolf106],
      resourceArea: activeResources(2),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    expectSuccess(lowP1.passPhase());
    expectSuccess(lowLevel.asPlayer(PLAYER_TWO).passActionStep());
    expectFailure(lowP1.playCommand(gd02WhiteWolf106), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02WhiteWolf106)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02WhiteWolf106],
      resourceArea: activeResources(3),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectSuccess(p1.passPhase());
    expectSuccess(insufficient.asPlayer(PLAYER_TWO).passActionStep());
    expectFailure(p1.playCommand(gd02WhiteWolf106), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02WhiteWolf106)).toBe(`hand:${PLAYER_ONE}`);
  });
});
