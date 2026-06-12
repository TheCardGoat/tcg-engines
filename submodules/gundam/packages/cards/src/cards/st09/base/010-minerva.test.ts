import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  expectSuccess,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st09Minerva010 } from "./010-minerva.ts";

describe("Minerva (ST09-010)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("flips Minerva from shieldArea into baseSection", () => {
      const engine = GundamTestEngine.create({}, { deck: [st09Minerva010] });
      const shieldId = seedBaseAsShield(engine, PLAYER_TWO, st09Minerva010);

      engine.fireShieldBurst(shieldId);

      expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
        `baseSection:${PLAYER_TWO}`,
      );
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, look at the top 2 cards of your deck and return 1 to the top. Place the remaining card into your trash.", () => {
    it("data encodes Burst and Deploy as separate triggered effects", () => {
      expect(st09Minerva010.effects).toHaveLength(2);

      const effects = st09Minerva010.effects ?? [];
      const [burst, deploy] = effects;
      expect(burst?.type).toBe("triggered");
      expect(burst?.activation.timing).toEqual(["burst"]);
      expect(burst?.directives).toEqual([{ action: { action: "deploySelf" } }]);

      expect(deploy?.type).toBe("triggered");
      expect(deploy?.activation.timing).toEqual(["deploy"]);
      expect(deploy?.directives[0]).toEqual({ action: { action: "addShieldToHand", count: 1 } });
      expect(deploy?.directives[1]).toEqual({
        condition: { type: "isTurn", whose: "friendly" },
        thenDirectives: [
          {
            action: {
              action: "lookAtTopDeck",
              count: 2,
              return: "chooseTop",
              remainingDestination: "trash",
            },
          },
        ],
      });
    });

    it("moves the first shield to hand and deploys Minerva to baseSection", () => {
      const engine = GundamTestEngine.create(
        { hand: [st09Minerva010], resourceArea: activeResources(2), deck: 6 },
        {},
      );
      const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st09Minerva010));

      expect(p1.getHand()).toContain(shieldIds[0]);
      expect(p1.getHand().length).toBe(handBefore);
      expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toEqual([
        shieldIds[1],
      ]);
      expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE })).toHaveLength(1);
    });

    it("on its controller's turn, returns one revealed card to top and trashes the other", () => {
      const engine = GundamTestEngine.create(
        { hand: [st09Minerva010], resourceArea: activeResources(2), deck: 6 },
        {},
      );
      seedShieldsFromDeck(engine, PLAYER_ONE, 1);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const deckBefore = p1.getCardsInZone("deck");
      const firstRevealed = deckBefore[0]!;
      const secondRevealed = deckBefore[1]!;
      const trashBefore = p1.getCardsInZone("trash").length;

      expectSuccess(p1.deployBase(st09Minerva010));

      const deckAfter = p1.getCardsInZone("deck");
      expect(deckAfter).toHaveLength(deckBefore.length - 1);
      expect(deckAfter[0]).toBe(firstRevealed);
      expect(p1.getCardsInZone("trash")).toHaveLength(trashBefore + 1);
      expect(p1.getCardsInZone("trash")).toContain(secondRevealed);
    });

    it("does not resolve the deck-look rider when deployed during the opponent's turn", () => {
      const engine = GundamTestEngine.create(
        { deck: [st09Minerva010] },
        {},
        { initialActivePlayer: PLAYER_TWO },
      );
      const shieldId = seedBaseAsShield(engine, PLAYER_ONE, st09Minerva010);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const deckBefore = p1.getCardsInZone("deck");
      const trashBefore = p1.getCardsInZone("trash");

      engine.fireShieldBurst(shieldId);

      expect(p1.getCardsInZone("deck")).toEqual(deckBefore);
      expect(p1.getCardsInZone("trash")).toEqual(trashBefore);
      expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
        `baseSection:${PLAYER_ONE}`,
      );
    });

    it("still deploys cleanly when there are no shields to add", () => {
      const engine = GundamTestEngine.create(
        { hand: [st09Minerva010], resourceArea: activeResources(2), deck: 2 },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st09Minerva010));

      expect(p1.getHand()).toHaveLength(handBefore - 1);
      expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toHaveLength(0);
      expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE })).toHaveLength(1);
    });

    it("handles an empty deck after the shield is added to hand", () => {
      const engine = GundamTestEngine.create(
        { hand: [st09Minerva010], resourceArea: activeResources(2), deck: 1 },
        {},
      );
      const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployBase(st09Minerva010));

      expect(p1.getHand()).toContain(shieldIds[0]);
      expect(p1.getCardsInZone("deck")).toHaveLength(0);
      expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE })).toHaveLength(1);
    });
  });
});
