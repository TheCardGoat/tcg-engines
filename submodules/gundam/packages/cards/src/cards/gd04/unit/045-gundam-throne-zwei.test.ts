import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundamThroneZwei045 } from "./045-gundam-throne-zwei.ts";

describe("Gundam Throne Zwei (GD04-045)", () => {
  it("when linked, grants a chosen CB Unit the option to attack damaged active enemy Units this turn", () => {
    const trinityPilot = createMockPilot({ name: "Trinity Pilot", traits: ["trinity"] });
    const damagedActiveEnemy = createMockUnit({ name: "Damaged Active Enemy", hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [trinityPilot],
        play: [gd04GundamThroneZwei045],
        resourceArea: activeResources(4),
      },
      { play: [damagedActiveEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const zweiId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
    engine.getG().damage[enemyId] = 1;

    expectSuccess(p1.assignPilot(trinityPilot, zweiId));

    const grant = engine
      .getG()
      .continuousEffects.find(
        (effect) =>
          effect.targetId === zweiId && effect.payload.kind === "grant-attack-target-option",
      );
    expect(grant).toBeDefined();
    expect(grant?.duration).toBe("this-turn");
    expect(grant?.payload).toMatchObject({
      kind: "grant-attack-target-option",
      attackTarget: {
        owner: "opponent",
        cardType: "unit",
        state: ["damaged", "active"],
      },
    });
  });
});
