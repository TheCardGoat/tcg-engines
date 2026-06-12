import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Gyan032 } from "./032-gyan.ts";

describe("Gyan (GD01-032)", () => {
  it("【When Paired·(Zeon) Pilot】destroys enemy <Blocker> Lv.2 or lower", () => {
    const zeonPilot = createMockPilot({ traits: ["zeon"] });
    const enemyBlocker = createMockUnit({
      ap: 1,
      hp: 3,
      level: 2,
      keywordEffects: [{ keyword: "Blocker" }],
    });

    const engine = GundamTestEngine.create(
      {
        hand: [zeonPilot],
        play: [gd01Gyan032],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [enemyBlocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const gyanId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(zeonPilot, gyanId));

    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    }

    expect(p2.getCardsInZone("trash")).toContain(enemyId);
  });

  it("【When Paired·(Zeon) Pilot】does NOT fire with a non-Zeon pilot", () => {
    const nonZeonPilot = createMockPilot({ traits: ["earth federation"] });
    const enemyBlocker = createMockUnit({
      ap: 1,
      hp: 3,
      level: 2,
      keywordEffects: [{ keyword: "Blocker" }],
    });

    const engine = GundamTestEngine.create(
      {
        hand: [nonZeonPilot],
        play: [gd01Gyan032],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [enemyBlocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const gyanId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(nonZeonPilot, gyanId));

    expect(engine.getPendingChoice()).toBeFalsy();
    expect(p2.getCardsInZone("trash")).not.toContain(enemyId);
  });
});
