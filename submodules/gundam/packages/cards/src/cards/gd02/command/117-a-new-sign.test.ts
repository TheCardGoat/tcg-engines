import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  asPlayerId,
  expectSuccess,
  activeResources,
  createMockBase,
  expectCardInHand,
  expectCardInTrash,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02ANewSign117 } from "./117-a-new-sign.ts";

describe("A New Sign (GD02-117)", () => {
  it("【Burst】Chooses an AEUG Base from trash and moves it to hand", () => {
    const aeugBase = createMockBase({ traits: ["aeug"], hp: 5 });
    const engine = GundamTestEngine.create({ deck: [gd02ANewSign117], trash: [aeugBase] }, {});
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd02ANewSign117.cardNumber, asPlayerId(PLAYER_ONE));

    const p1 = engine.asPlayer(PLAYER_ONE);
    const [baseId] = p1.getCardsInZone("trash");
    if (!baseId) throw new Error("seed setup: no base in trash");

    engine.fireShieldBurst(shieldId, { targets: [baseId] });

    expectCardInHand(engine, baseId, p1.playerId);
  });

  describe("【Main】Draw 3. Then, discard 2.", () => {
    it("draws 3 then discards 2 (net 0 overall hand size after playing the command)", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02ANewSign117],
        resourceArea: activeResources(4),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;
      const deckBefore = p1.getCardsInZone("deck").length;
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd02ANewSign117));

      const handAfter = p1.getHand().length;
      const deckAfter = p1.getCardsInZone("deck").length;
      // Hand: lost command (-1), drew 3 (+3), discarded 2 (-2) = net 0
      expect(handAfter).toBe(handBefore);
      expect(deckAfter).toBe(deckBefore - 3);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
