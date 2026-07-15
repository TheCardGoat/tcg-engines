import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  asPlayerId,
  expectSuccess,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02DramaticTurnabout100 } from "./100-dramatic-turnabout.ts";
describe("Dramatic Turnabout (GD02-100)", () => {
  it("【Burst】Draw 1.", () => {
    const engine = GundamTestEngine.create({
      deck: [gd02DramaticTurnabout100, gd02DramaticTurnabout100, gd02DramaticTurnabout100],
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd02DramaticTurnabout100.cardNumber, asPlayerId(PLAYER_ONE));

    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;
    const deckBefore = p1.getCardsInZone("deck").length;

    engine.fireShieldBurst(shieldId);

    expect(p1.getHand().length).toBe(handBefore + 1);
    expect(p1.getCardsInZone("deck").length).toBe(deckBefore - 1);
  });

  describe("【Main】Choose 1 friendly damaged Unit. It recovers 2 HP. Then, draw 1.", () => {
    it("recovers 2 HP from a damaged unit and draws 1 card", () => {
      const unit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [gd02DramaticTurnabout100],
        play: [unit],
        deck: 5,
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      engine.getG().damage[unitId!] = 3;
      const cmdId = p1.getHand()[0]!;
      const handBefore = p1.getHand().length;

      expectSuccess(p1.playCommand(gd02DramaticTurnabout100, { targets: [unitId!] }));

      // 3 - 2 = 1
      expect(getDamageCounter(engine, unitId!)).toBe(1);
      // Before: 1 (the command) — after: command is in trash, plus 1 drawn → handBefore
      expect(p1.getHand().length).toBe(handBefore);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
