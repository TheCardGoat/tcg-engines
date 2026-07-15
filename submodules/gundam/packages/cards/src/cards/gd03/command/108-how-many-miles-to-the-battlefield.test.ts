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
import { gd03OverTheRiverAndThroughTheWoods107 } from "./107-over-the-river-and-through-the-woods.ts";
import { gd03HowManyMilesToTheBattlefield108 } from "./108-how-many-miles-to-the-battlefield.ts";

describe("How Many Miles to the Battlefield? (GD03-108)", () => {
  it("【Main】 deploys an active 2/1 Unit token that counts for token effects", () => {
    const enemy = createMockUnit({ level: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03HowManyMilesToTheBattlefield108, gd03OverTheRiverAndThroughTheWoods107],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const [tokenCommandId, damageCommandId] = p1.getHand();
    const before = new Set(p1.getCardsInZone("battleArea"));

    expectSuccess(p1.playCommand(tokenCommandId!));

    const tokenId = p1.getCardsInZone("battleArea").find((id) => !before.has(id));
    expect(tokenId).toBeDefined();
    expect(p1.getVisibleCard(tokenId!)).toMatchObject({
      effectiveAp: 2,
      effectiveHp: 1,
      exhausted: false,
    });
    expectSuccess(p1.playCommand(damageCommandId!, { targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(1);
  });

  it("cannot deploy the token during an Action step", () => {
    const enemyAttacker = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd03HowManyMilesToTheBattlefield108], resourceArea: activeResources(3) },
      { play: [enemyAttacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectFailure(p1.playCommand(commandId), "WRONG_TIMING");

    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("can be paired as Gabriel Ramirez Garcia instead of activating the Command effect", () => {
    const host = createMockUnit({
      ap: 2,
      hp: 3,
      linkCondition: "[Gabriel Ramirez Garcia]",
    });
    const engine = GundamTestEngine.create({
      hand: [gd03HowManyMilesToTheBattlefield108],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
  });
});
