import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  asPlayerId,
  createMockUnit,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd04CoreFighter013 } from "./013-core-fighter.ts";

describe("Core Fighter (GD04-013)", () => {
  it("grants <Blocker> to friendly (League Militaire) Unit tokens while this Unit is rested", () => {
    const lmToken = createMockUnit({ ap: 1, hp: 1, traits: ["league militaire"] });
    const lmNonToken = createMockUnit({ ap: 1, hp: 1, traits: ["league militaire"] });
    const nonLmToken = createMockUnit({ ap: 1, hp: 1, traits: ["zeon"] });

    const engine = GundamTestEngine.create({
      play: [gd04CoreFighter013, lmToken, lmNonToken, nonLmToken],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [coreFighterId, lmTokenId, lmNonTokenId, nonLmTokenId] = p1.getCardsInZone("battleArea");

    // Flag the two intended tokens as such — the directive's `isToken: true`
    // filter excludes the non-token LM unit even though it shares the trait.
    const state = engine.getState();
    state.ctx.zones.private.cardMeta[lmTokenId!] = { isToken: true };
    state.ctx.zones.private.cardMeta[nonLmTokenId!] = { isToken: true };

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const keywordsOf = (id: string) =>
      getEffectiveStats(id, engine.getG(), framework.cards, framework).keywords;

    // Active Core Fighter: condition `selfIsRested` fails — no Blocker grant.
    expect(keywordsOf(lmTokenId!)).not.toContain("Blocker");

    // Rest Core Fighter — the constant gate now passes and the LM token gains Blocker.
    engine.getRuntime().runTestMutation(asPlayerId(PLAYER_ONE), ({ G }) => {
      G.exhausted[coreFighterId!] = true;
    });

    expect(keywordsOf(lmTokenId!)).toContain("Blocker");
    // Non-token LM unit unaffected (filter has `isToken: true`).
    expect(keywordsOf(lmNonTokenId!)).not.toContain("Blocker");
    // Non-LM token unaffected (filter requires the trait).
    expect(keywordsOf(nonLmTokenId!)).not.toContain("Blocker");
  });

  it("removes the Blocker grant when Core Fighter becomes active again", () => {
    const lmToken = createMockUnit({ ap: 1, hp: 1, traits: ["league militaire"] });

    const engine = GundamTestEngine.create({
      play: [gd04CoreFighter013, lmToken],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [coreFighterId, lmTokenId] = p1.getCardsInZone("battleArea");
    engine.getState().ctx.zones.private.cardMeta[lmTokenId!] = { isToken: true };

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const keywordsOf = (id: string) =>
      getEffectiveStats(id, engine.getG(), framework.cards, framework).keywords;

    // Rest, then unrest — the grant must come and go with the gate.
    engine.getRuntime().runTestMutation(asPlayerId(PLAYER_ONE), ({ G }) => {
      G.exhausted[coreFighterId!] = true;
    });
    expect(keywordsOf(lmTokenId!)).toContain("Blocker");

    engine.getRuntime().runTestMutation(asPlayerId(PLAYER_ONE), ({ G }) => {
      G.exhausted[coreFighterId!] = false;
    });
    expect(keywordsOf(lmTokenId!)).not.toContain("Blocker");
  });
});
