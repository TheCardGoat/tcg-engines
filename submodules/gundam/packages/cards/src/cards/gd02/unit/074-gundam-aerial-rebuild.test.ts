import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  createMockCommand,
  expectFailure,
  getEffectiveStats,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd02GundamAerialRebuild074 } from "./074-gundam-aerial-rebuild.ts";

describe("Gundam Aerial Rebuild (GD02-074)", () => {
  it("<High-Maneuver> — opponent cannot declare a blocker", () => {
    const defender = createMockUnit({ ap: 2, hp: 3 });
    const blocker = createMockUnit({
      ap: 2,
      hp: 3,
      keywordEffects: [{ keyword: "Blocker" }],
    });

    const engine = GundamTestEngine.create(
      { play: [gd02GundamAerialRebuild074] },
      { play: [{ card: defender, exhausted: true }, blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    const enter = p1.enterBattle(attackerId, defenderId);
    expect(enter.success).toBe(true);

    // The <High-Maneuver> keyword must reject any block attempt.
    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
  });

  // 【During Pair】While 4+ Command cards in your trash → gains <Blocker>.
  // derived-state.ts re-evaluates duringPair gate + `cardInZone trash
  // command gte 4` on every getEffectiveStats call.

  const commandFixture = () => createMockCommand();
  const commandTrash = (n: number) => Array.from({ length: n }, () => ({ card: commandFixture() }));

  it("positive: paired + 4 Commands in trash → gains <Blocker>", () => {
    const engine = GundamTestEngine.create(
      { play: [gd02GundamAerialRebuild074], trash: commandTrash(4) },
      { deck: 5 },
    );
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02GundamAerialRebuild074.cardNumber,
    )!;
    markAsLinkUnit(engine, uid); // satisfies duringPair

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).toContain("Blocker");
  });

  it("negative: paired but only 3 Commands in trash → no <Blocker>", () => {
    const engine = GundamTestEngine.create(
      { play: [gd02GundamAerialRebuild074], trash: commandTrash(3) },
      { deck: 5 },
    );
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02GundamAerialRebuild074.cardNumber,
    )!;
    markAsLinkUnit(engine, uid);

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("Blocker");
  });

  it("negative: 4 Commands in trash but unpaired → duringPair gate fails", () => {
    const engine = GundamTestEngine.create(
      { play: [gd02GundamAerialRebuild074], trash: commandTrash(4) },
      { deck: 5 },
    );
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02GundamAerialRebuild074.cardNumber,
    )!;
    // No pairing.
    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("Blocker");
  });

  it("transition: 3→4 Commands in trash flips the grant on (no state caching)", () => {
    const engineLow = GundamTestEngine.create(
      { play: [gd02GundamAerialRebuild074], trash: commandTrash(3) },
      { deck: 5 },
    );
    const rtLow = engineLow.getRuntime();
    const uidLow = rtLow.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02GundamAerialRebuild074.cardNumber,
    )!;
    markAsLinkUnit(engineLow, uidLow);
    const fwLow = rtLow.getFrameworkReadAPI();
    expect(getEffectiveStats(uidLow, engineLow.getG(), fwLow.cards, fwLow).keywords).not.toContain(
      "Blocker",
    );

    const engineHigh = GundamTestEngine.create(
      { play: [gd02GundamAerialRebuild074], trash: commandTrash(4) },
      { deck: 5 },
    );
    const rtHigh = engineHigh.getRuntime();
    const uidHigh = rtHigh.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02GundamAerialRebuild074.cardNumber,
    )!;
    markAsLinkUnit(engineHigh, uidHigh);
    const fwHigh = rtHigh.getFrameworkReadAPI();
    expect(getEffectiveStats(uidHigh, engineHigh.getG(), fwHigh.cards, fwHigh).keywords).toContain(
      "Blocker",
    );
  });
});
