import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03TierenHighMobilityType078 } from "./078-tieren-high-mobility-type.ts";

describe("Tieren High Mobility Type (GD03-078)", () => {
  describe("【During Link】【Destroyed】Return the card paired with this Unit to your hand.", () => {
    it("returns the paired Pilot to hand when destroyed as a Link Unit", () => {
      const sergei = createMockPilot({ name: "Sergei Smirnov", cost: 1 });
      const attacker = createMockUnit({ ap: 2, hp: 10 });
      const transitionDefender = createMockUnit({ ap: 0, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [sergei],
          play: [gd03TierenHighMobilityType078],
          resourceArea: activeResources(2),
          deck: 5,
        },
        { play: [attacker, { card: transitionDefender, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [attackerId, transitionDefenderId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(sergei, unitId));
      const pilotId = p1.getPilotId(unitId)!;
      expectSuccess(p1.enterBattle(unitId, transitionDefenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.enterBattle(attackerId!, unitId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getCardZone(unitId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(unitId)).toBeUndefined();
    });

    it("does not return the paired Pilot when destroyed while paired but not linked", () => {
      const wrongPilot = createMockPilot({ name: "Wrong Pilot", cost: 1 });
      const attacker = createMockUnit({ ap: 2, hp: 10 });
      const transitionDefender = createMockUnit({ ap: 0, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [wrongPilot],
          play: [gd03TierenHighMobilityType078],
          resourceArea: activeResources(2),
          deck: 5,
        },
        { play: [attacker, { card: transitionDefender, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [attackerId, transitionDefenderId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(wrongPilot, unitId));
      const pilotId = p1.getPilotId(unitId)!;
      expectSuccess(p1.enterBattle(unitId, transitionDefenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.enterBattle(attackerId!, unitId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getCardZone(unitId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getPilotId(unitId)).toBeUndefined();
    });
  });
});
