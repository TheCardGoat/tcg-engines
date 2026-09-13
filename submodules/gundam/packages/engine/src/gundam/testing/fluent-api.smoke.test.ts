import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  expectCard,
  expectPlayer,
  expectWinnerIs,
  resolveBattle,
} from "../index.ts";
import { st01Gundam001 } from "../../../../cards/src/cards/st01/unit/001-gundam.ts";
import { st01Gm005 } from "../../../../cards/src/cards/st01/unit/005-gm.ts";

describe("fluent API smoke", () => {
  it("deploys by definition and resolves battle with defs", () => {
    const engine = GundamTestEngine.create(
      { hand: [st01Gm005], play: [st01Gundam001], resourceArea: activeResources(3), deck: 5 },
      { play: [{ card: st01Gm005, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    // Unique GM in hand — deploy by definition
    p1.must.deployUnit(st01Gm005);
    expectCard(p1, st01Gm005).toBeIn("battleArea");
    expectPlayer(p1).toHaveHandCount(0);

    // Pre-placed Gundam can attack; GM on p2 is unique defender
    resolveBattle(engine, st01Gundam001, st01Gm005);
    expectCard(p2, st01Gm005).toBeIn("trash");
  });

  it("throws AmbiguousCardRef when two copies match", () => {
    const engine = GundamTestEngine.create({
      play: [st01Gm005, st01Gm005],
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expect(() => p1.unit(st01Gm005)).toThrow(/AmbiguousCardRef/);
  });

  it("does not fall back to the opponent when the acting player has an ambiguous match", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001, st01Gm005, st01Gm005], deck: 5 },
      { play: [{ card: st01Gm005, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    // Two GMs for p1; one for p2. Attack-into must not silently pick p2's GM.
    expect(() => p1.must.attack(st01Gundam001).into(st01Gm005)).toThrow(/AmbiguousCardRef/);
  });

  it("direct attack defeat via fluent", () => {
    const engine = GundamTestEngine.create({ play: [st01Gundam001], deck: 5 }, { deck: 5 });
    resolveBattle(engine, st01Gundam001, "direct");
    expectWinnerIs(engine, PLAYER_ONE);
  });
});
