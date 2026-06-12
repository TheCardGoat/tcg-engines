import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  createMockBase,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd02HyakuShiki072 } from "./072-hyaku-shiki.ts";

describe("Hyaku-Shiki (GD02-072)", () => {
  it("<Blocker> lets Hyaku-Shiki intercept an attack targeted at another friendly Unit", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [defender, gd02HyakuShiki072] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.declareBlock(blockerId));
  });

  // While a friendly white Base is in play, this Unit gains <Repair 1>.
  // Constant effect with `friendlyBaseInPlay { color: "white" }` condition;
  // derived-state.ts re-evaluates on every getEffectiveStats call.

  it("positive: friendly white Base in play → gains <Repair>", () => {
    const whiteBase = createMockBase({ color: "white" });
    const engine = GundamTestEngine.create(
      { play: [gd02HyakuShiki072], baseSection: [whiteBase] },
      { deck: 5 },
    );
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gd02HyakuShiki072.cardNumber)!;
    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).toContain("Repair");
  });

  it("negative: no friendly Base in play → no <Repair>", () => {
    const engine = GundamTestEngine.create({ play: [gd02HyakuShiki072] }, { deck: 5 });
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gd02HyakuShiki072.cardNumber)!;
    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("Repair");
  });

  it("negative: friendly non-white Base in play → no <Repair>", () => {
    const blueBase = createMockBase({ color: "blue" });
    const engine = GundamTestEngine.create(
      { play: [gd02HyakuShiki072], baseSection: [blueBase] },
      { deck: 5 },
    );
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gd02HyakuShiki072.cardNumber)!;
    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("Repair");
  });

  it("transition: base deployed between two reads flips the grant on", () => {
    const engineBefore = GundamTestEngine.create({ play: [gd02HyakuShiki072] }, { deck: 5 });
    const rtBefore = engineBefore.getRuntime();
    const uidBefore = rtBefore.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02HyakuShiki072.cardNumber,
    )!;
    const fwBefore = rtBefore.getFrameworkReadAPI();
    expect(
      getEffectiveStats(uidBefore, engineBefore.getG(), fwBefore.cards, fwBefore).keywords,
    ).not.toContain("Repair");

    const whiteBase = createMockBase({ color: "white" });
    const engineAfter = GundamTestEngine.create(
      { play: [gd02HyakuShiki072], baseSection: [whiteBase] },
      { deck: 5 },
    );
    const rtAfter = engineAfter.getRuntime();
    const uidAfter = rtAfter.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02HyakuShiki072.cardNumber,
    )!;
    const fwAfter = rtAfter.getFrameworkReadAPI();
    expect(
      getEffectiveStats(uidAfter, engineAfter.getG(), fwAfter.cards, fwAfter).keywords,
    ).toContain("Repair");
  });
});
