import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  expectSuccess,
  asPlayerId,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01Zanzibar125 } from "./125-zanzibar.ts";

describe("Zanzibar (GD01-125)", () => {
  it("【Burst】Deploy this card — flips Zanzibar into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01Zanzibar125] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01Zanzibar125.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  describe("【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, you may deploy 1 (Zeon) Unit card that is Lv.4 or lower from your hand.", () => {
    it("moves 1 shield from shield area to hand on deploy", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [gd01Zanzibar125],
          resourceArea: activeResources(6),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      for (let i = 0; i < 3; i++) {
        engine.giveCard(asPlayerId(PLAYER_ONE), createMockResource().cardNumber, {
          zone: "shieldArea",
          playerId: PLAYER_ONE,
        });
      }
      const shieldsBefore = p1.getCardsInZone("shieldArea").length;
      const battleAreaBefore = p1.getCardsInZone("battleArea").length;

      expectSuccess(p1.deployBase(gd01Zanzibar125));
      // Base's optional secondary deploy (Zeon Lv.4 unit from hand) is
      // answered via optionalAnswers keyed by the pending choice's
      // directiveIndex. Decline it to exercise the decline path; the
      // shield-add still resolves.
      const pending = engine.getPendingChoice();
      if (pending && pending.kind === "optional") {
        expectSuccess(p1.resolveEffect({ optionalAnswers: { [pending.directiveIndex]: false } }));
      }

      expect(p1.getCardsInZone("baseSection").length).toBe(1);
      expect(p1.getCardsInZone("shieldArea").length).toBe(shieldsBefore - 1);
      // Declining the optional deploy means no unit entered the battle area.
      expect(p1.getCardsInZone("battleArea").length).toBe(battleAreaBefore);
    });
  });
});
