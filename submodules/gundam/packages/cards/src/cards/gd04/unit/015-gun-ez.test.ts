import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GunEz015 } from "./015-gun-ez.ts";

describe("Gun EZ (GD04-015)", () => {
  it("【Deploy】 rests 1 friendly active (League Militaire) Unit and 1 active enemy Lv.3-or-lower Unit", () => {
    const friendly = createMockUnit({ traits: ["league militaire"], ap: 2, hp: 3, level: 2 });
    const enemy = createMockUnit({ ap: 2, hp: 3, level: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd04GunEz015], play: [friendly], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [friendlyId] = p1.getCardsInZone("battleArea");
    const [enemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd04GunEz015, { targets: [friendlyId!, enemyId!] }));

    expect(engine.getG().exhausted[friendlyId!]).toBe(true);
    expect(engine.getG().exhausted[enemyId!]).toBe(true);
  });

  it("rejects a friendly Unit without the (League Militaire) trait", () => {
    const friendly = createMockUnit({ traits: ["earth federation"], ap: 2, hp: 3, level: 2 });
    const enemy = createMockUnit({ ap: 2, hp: 3, level: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd04GunEz015], play: [friendly], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [friendlyId] = p1.getCardsInZone("battleArea");
    const [enemyId] = p2.getCardsInZone("battleArea");

    expectFailure(
      p1.deployUnit(gd04GunEz015, { targets: [friendlyId!, enemyId!] }),
      "INVALID_TARGET",
    );
  });

  it("rejects an enemy Unit above Lv.3", () => {
    const friendly = createMockUnit({ traits: ["league militaire"], ap: 2, hp: 3, level: 2 });
    const enemy = createMockUnit({ ap: 2, hp: 5, level: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd04GunEz015], play: [friendly], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [friendlyId] = p1.getCardsInZone("battleArea");
    const [enemyId] = p2.getCardsInZone("battleArea");

    expectFailure(
      p1.deployUnit(gd04GunEz015, { targets: [friendlyId!, enemyId!] }),
      "INVALID_TARGET",
    );
  });
});
