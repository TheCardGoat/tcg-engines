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
    expect(p1.isExhausted(allyId)).toBe(true);
    expect(p1.isExhausted(redId)).toBe(false);
    expect(engine.asPlayer(PLAYER_TWO).getDamage(targetId)).toBe(2);
  });

  it("cannot rest a friendly Unit without the Clan trait", () => {
    const nonClanAlly = createMockUnit({ traits: ["zaft"], ap: 2, hp: 4 });
    const target = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03RedGundam039], play: [nonClanAlly], resourceArea: activeResources(4) },
      { play: [target] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const allyId = p1.getCardsInZone("battleArea")[0]!;
    const targetId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.deployUnit(gd03RedGundam039, { targets: [allyId, targetId] }),
      "INVALID_TARGET",
    );

    expect(p1.isExhausted(allyId)).toBe(false);
    expect(p2.getDamage(targetId)).toBe(0);
  });

  it("cannot deal Deploy damage to an enemy Unit with more than 2 AP", () => {
    const clanAlly = createMockUnit({ traits: ["clan"], ap: 2, hp: 4 });
    const target = createMockUnit({ ap: 3, hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03RedGundam039], play: [clanAlly], resourceArea: activeResources(4) },
      { play: [target] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const allyId = p1.getCardsInZone("battleArea")[0]!;
    const targetId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.deployUnit(gd03RedGundam039, { targets: [allyId, targetId] }),
      "INVALID_TARGET",
    );

    expect(p1.isExhausted(allyId)).toBe(false);
    expect(p2.getDamage(targetId)).toBe(0);
  });
});
