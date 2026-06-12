import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectFailure,
  expectSuccess,
  restedResources,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03Downes130 } from "../base/130-downes.ts";
import { gd03Farsia058 } from "./058-farsia.ts";

describe("Farsia (GD03-058)", () => {
  describe("This card in your trash gets cost -1.", () => {
    it("deploys from trash for 1 less resource when another effect pays its cost", () => {
      const engine = GundamTestEngine.create({
        hand: [gd03Downes130],
        trash: [gd03Farsia058],
        resourceArea: [...restedResources(2), ...activeResources(3)],
        deck: 6,
      });
      seedShieldsFromDeck(engine, PLAYER_ONE, 1);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const farsiaId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.deployBase(gd03Downes130, { targets: [farsiaId] }));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: true } }));

      expect(p1.getCardsInZone("battleArea")).toContain(farsiaId);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(5);
    });

    it("does not reduce Farsia's cost while it is in hand", () => {
      const engine = GundamTestEngine.create({
        hand: [gd03Farsia058],
        resourceArea: [...restedResources(1), ...activeResources(1)],
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(gd03Farsia058),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });
});
