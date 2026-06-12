import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd03RedGundam039 } from "./039-red-gundam.ts";

describe("Red Gundam (GD03-039)", () => {
  it("【Deploy】 rests another active friendly Clan Unit to deal 2 damage to an enemy Unit with 2 or less AP", () => {
    const clanAlly = createMockUnit({ traits: ["clan"], ap: 2, hp: 4 });
    const target = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03RedGundam039], play: [clanAlly], resourceArea: activeResources(4) },
      { play: [target] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const allyId = p1.getCardsInZone("battleArea")[0]!;
    const targetId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03RedGundam039, { targets: [allyId, targetId] }));

    const redId = p1.getCardsInZone("battleArea").find((id) => id !== allyId)!;
    expect(engine.getG().exhausted[allyId]).toBe(true);
    expect(engine.getG().exhausted[redId]).not.toBe(true);
    expect(getDamageCounter(engine, targetId)).toBe(2);
  });
});
