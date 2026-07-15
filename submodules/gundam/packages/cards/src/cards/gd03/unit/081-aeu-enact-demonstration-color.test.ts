import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03AeuEnactDemonstrationColor081 } from "./081-aeu-enact-demonstration-color.ts";

describe("AEU Enact Demonstration Color (GD03-081)", () => {
  describe("This Unit can only attack during a turn when one of your (Superpower Bloc)/(UN) Units is deployed.", () => {
    it("cannot attack before a friendly Superpower Bloc or UN Unit is deployed this turn", () => {
      const engine = GundamTestEngine.create({ play: [gd03AeuEnactDemonstrationColor081] }, {});
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.enterBattle(unitId, "direct"), "CANNOT_ATTACK");
    });

    it("can attack after a friendly Superpower Bloc Unit is deployed this turn", () => {
      const wingman = createMockUnit({ traits: ["superpower bloc"], level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [wingman],
        play: [gd03AeuEnactDemonstrationColor081],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(wingman));
      expectSuccess(p1.enterBattle(unitId, "direct"));
    });

    it("can attack after a friendly UN Unit is deployed this turn", () => {
      const wingman = createMockUnit({ traits: ["un"], level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [wingman],
        play: [gd03AeuEnactDemonstrationColor081],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(wingman));
      expectSuccess(p1.enterBattle(unitId, "direct"));
    });

    it("cannot attack after a friendly Unit with another trait is deployed this turn", () => {
      const wingman = createMockUnit({ traits: ["earth federation"], level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [wingman],
        play: [gd03AeuEnactDemonstrationColor081],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(wingman));
      expectFailure(p1.enterBattle(unitId, "direct"), "CANNOT_ATTACK");
    });
  });
});
