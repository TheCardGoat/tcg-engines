import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03MAVTactics106 } from "./106-m-a-v-tactics.ts";
import { gd03OverTheRiverAndThroughTheWoods107 } from "./107-over-the-river-and-through-the-woods.ts";

describe("Over the River and Through the Woods (GD03-107)", () => {
  it("deals damage equal to the Unit tokens deployed through a legal Command", () => {
    const regularUnit = createMockUnit({ name: "Regular Unit" });
    const enemy = createMockUnit({ level: 5, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03MAVTactics106, gd03OverTheRiverAndThroughTheWoods107],
        play: [regularUnit],
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const [tokenCommandId, damageCommandId] = p1.getHand();

    expectSuccess(p1.playCommand(tokenCommandId!));
    expectSuccess(p1.playCommand(damageCommandId!, { targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(2);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(3);
    expect(p1.getCardZone(damageCommandId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("deals 0 damage when only regular Units are in play", () => {
    const regularUnit = createMockUnit({ name: "Regular Unit" });
    const enemy = createMockUnit({ level: 5, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03OverTheRiverAndThroughTheWoods107],
        play: [regularUnit],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03OverTheRiverAndThroughTheWoods107, { targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(0);
  });

  it("cannot target an enemy Unit above Lv.5", () => {
    const highLevelEnemy = createMockUnit({ level: 6, hp: 6 });
    const engine = GundamTestEngine.create(
      { hand: [gd03OverTheRiverAndThroughTheWoods107], resourceArea: activeResources(4) },
      { play: [highLevelEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "INVALID_TARGET");

    expect(p2.getDamage(enemyId)).toBe(0);
    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot use its Main effect during an Action step", () => {
    const enemyAttacker = createMockUnit({ level: 5, ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd03OverTheRiverAndThroughTheWoods107], resourceArea: activeResources(4) },
      { play: [enemyAttacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "WRONG_TIMING");

    expect(p2.getDamage(enemyId)).toBe(0);
    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("can be paired as Hardie Steiner instead of activating the Command effect", () => {
    const host = createMockUnit({ ap: 2, hp: 3, linkCondition: "[Hardie Steiner]" });
    const engine = GundamTestEngine.create({
      hand: [gd03OverTheRiverAndThroughTheWoods107],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
  });
});
