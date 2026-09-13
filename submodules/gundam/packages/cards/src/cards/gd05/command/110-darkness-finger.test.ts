import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05DarknessFinger110 } from "./110-darkness-finger.ts";
import { gd05ShiningGundamSuperMode068 } from "../unit/068-shining-gundam-super-mode.ts";

describe("Darkness Finger (GD05-110)", () => {
  it("deals 2 damage and draws only while a Master Gundam is in play", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd05DarknessFinger110],
        play: [createMockUnit({ name: "Master Gundam" })],
        resourceArea: activeResources(4),
        deck: 2,
      },
      { play: [createMockUnit({ hp: 5 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05DarknessFinger110));
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(2);
    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
  });

  it("does not draw while only an unrelated friendly Unit is in play", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd05DarknessFinger110],
        play: [createMockUnit({ name: "Shining Gundam" })],
        resourceArea: activeResources(4),
        deck: 2,
      },
      { play: [createMockUnit({ hp: 5 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05DarknessFinger110));
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(2);
    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
  });

  it("accepts its Burst, then resolves the replayed Main against the chosen Unit", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        play: [gd05ShiningGundamSuperMode068],
        shieldArea: [gd05DarknessFinger110],
      },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    // Burst is optional (13-2-5-2). Accepting runs activateTiming, which
    // enqueues the Main effect (and records command activation hooks).
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
    });
    expectSuccess(p1.resolveEffect({ targets: [attackerId] }));

    expect(p2.getDamage(attackerId)).toBe(2);
    const shiningId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(shiningId)?.keywords).toContain("Suppression");
  });
});
