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
import { gd03GundamHajiroboshi2ndForm055 } from "./055-gundam-hajiroboshi-2nd-form.ts";

describe("Gundam Hajiroboshi (2nd Form) (GD03-055)", () => {
  it("【When Paired･Purple Pilot】 destroys an enemy Lv.2 or lower Unit", () => {
    const pilot = createMockPilot({ color: "purple" });
    const enemy = createMockUnit({ level: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03GundamHajiroboshi2ndForm055],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")).not.toContain(enemyId);
  });

  it("does not trigger when the paired Pilot is not purple", () => {
    const pilot = createMockPilot({ color: "red" });
    const enemy = createMockUnit({ level: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03GundamHajiroboshi2ndForm055],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
  });

  it("does not offer an enemy Unit above Lv.2 as a target", () => {
    const pilot = createMockPilot({ color: "purple" });
    const enemy = createMockUnit({ level: 3, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03GundamHajiroboshi2ndForm055],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
  });
});
