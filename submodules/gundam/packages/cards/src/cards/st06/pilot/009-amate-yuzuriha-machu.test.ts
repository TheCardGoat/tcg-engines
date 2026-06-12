import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st06AmateYuzurihaMachu009 } from "./009-amate-yuzuriha-machu.ts";

describe("Amate Yuzuriha (Machu) (ST06-009)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [st06AmateYuzurihaMachu009] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  describe("【When Linked】 top-deck reveal / Clan tutor", () => {
    it("reveals top Clan card and moves it to hand on a link pairing", () => {
      const hostUnit = createMockUnit({
        level: 5,
        cost: 1,
        linkCondition: "[Amate Yuzuriha]",
      });
      const clanCardOnTop = createMockUnit({
        level: 3,
        cost: 2,
        traits: ["clan"],
      });
      const filler = createMockUnit({ level: 1, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [hostUnit, st06AmateYuzurihaMachu009],
          resourceArea: activeResources(6),
          deck: [clanCardOnTop, filler],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
      expectSuccess(p1.deployUnit(hostUnit));
      expectSuccess(p1.assignPilot(st06AmateYuzurihaMachu009, hostUnit));

      // The Clan top card was tutored into hand by the auto-resolving
      // lookAtTopDeck + tutorFilter path — deck loses exactly one card.
      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    });

    it("non-link pairing (no unit linkCondition) does NOT fire whenLinked — Clan card stays in deck", () => {
      const hostUnit = createMockUnit({ level: 5, cost: 1 }); // no linkCondition
      const clanCardOnTop = createMockUnit({
        level: 3,
        cost: 2,
        traits: ["clan"],
      });
      const filler = createMockUnit({ level: 1, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [hostUnit, st06AmateYuzurihaMachu009],
          resourceArea: activeResources(6),
          deck: [clanCardOnTop, filler],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
      expectSuccess(p1.deployUnit(hostUnit));
      expectSuccess(p1.assignPilot(st06AmateYuzurihaMachu009, hostUnit));
      // Not a Link Unit → whenLinked must not fire, deck size unchanged.
      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
    });
  });
});
