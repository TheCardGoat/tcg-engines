import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st02Tallgeese006 } from "./006-tallgeese.ts";

describe("Tallgeese (ST02-006)", () => {
  describe("【Activate･Main】【Once per Turn】④：Set this Unit as active.", () => {
    it("data encodes a main activated once-per-turn ready effect with 4-resource cost", () => {
      const effect = st02Tallgeese006.effects?.[0];

      expect(effect?.type).toBe("activated");
      expect(effect?.activation).toEqual({
        timing: ["activate:main"],
        restrictions: [{ type: "oncePerTurn" }],
      });
      expect(effect?.cost).toEqual({ payResources: 4 });
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "setActive",
            target: { owner: "self", cardType: "unit", state: "rested" },
          },
        },
      ]);
    });

    it("pays 4 resources and sets the rested Tallgeese active", () => {
      const engine = GundamTestEngine.create({
        play: [{ card: st02Tallgeese006, exhausted: true }],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [tallgeeseId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.activateAbility(tallgeeseId!, 0));

      expect(p1.isExhausted(tallgeeseId!)).toBe(false);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id)).length).toBe(4);
    });

    it("cannot activate without 4 active resources", () => {
      const engine = GundamTestEngine.create({
        play: [{ card: st02Tallgeese006, exhausted: true }],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [tallgeeseId] = p1.getCardsInZone("battleArea");

      expectFailure(p1.activateAbility(tallgeeseId!, 0), "INSUFFICIENT_RESOURCES");
      expect(p1.isExhausted(tallgeeseId!)).toBe(true);
    });
  });
});
