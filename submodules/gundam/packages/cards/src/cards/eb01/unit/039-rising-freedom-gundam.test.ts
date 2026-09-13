import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { eb01RisingFreedomGundam039 } from "./039-rising-freedom-gundam.ts";

describe("Rising Freedom Gundam (EB01-039)", () => {
  describe("When playing this card from your hand, if 3 or more enemy Units are in play, play it as if it has 3 Lv. and cost.", () => {
    it("deploys from hand at Lv.3 and pays cost 3 against three enemy Units", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [eb01RisingFreedomGundam039],
          resourceArea: activeResources(3),
        },
        { play: [createMockUnit(), createMockUnit(), createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expect(p1.getMoveProcedure("deployUnit", { cardId })).toMatchObject([
        {
          kind: "selectMode",
          modes: [{ id: "alternate" }],
        },
      ]);
      expectSuccess(p1.deployUnit(cardId, { mode: "alternate" }));

      expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
    });

    it("keeps its printed Lv.6 requirement below the three-enemy threshold", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [eb01RisingFreedomGundam039],
          resourceArea: activeResources(3),
        },
        { play: [createMockUnit(), createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getCardZone(cardId)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
