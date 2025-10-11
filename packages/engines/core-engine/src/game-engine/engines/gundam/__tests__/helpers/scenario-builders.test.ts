import { describe, expect, it } from "bun:test";
import {
  buildCombatScenario,
  buildDeckConstructionScenario,
  buildGameStartScenario,
  buildResourceScenario,
} from "./scenario-builders";

describe("Scenario Builders", () => {
  describe("buildGameStartScenario", () => {
    it("should create a game start scenario with proper initial state", () => {
      const engine = buildGameStartScenario();

      // Verify default game start state
      expect(engine.getGameSegment()).toBe("startingAGame");
      expect(engine.getZone("hand", "player_one").length).toBe(5);
      expect(engine.getZone("hand", "player_two").length).toBe(5);
      expect(engine.getZone("shieldSection", "player_one").length).toBe(6);
      expect(engine.getZone("shieldSection", "player_two").length).toBe(6);
    });

    it("should allow customization of starting hands", () => {
      const engine = buildGameStartScenario({
        playerOneHandSize: 3,
        playerTwoHandSize: 4,
      });

      expect(engine.getZone("hand", "player_one").length).toBe(3);
      expect(engine.getZone("hand", "player_two").length).toBe(4);
    });
  });

  describe("buildCombatScenario", () => {
    it("should create a combat scenario with attacking and defending units", () => {
      const scenario = buildCombatScenario({
        attackerCount: 2,
        defenderCount: 3,
      });

      const { engine } = scenario;

      // Verify both players have units in battle area
      expect(engine.getZone("battleArea", "player_one").length).toBe(2);
      expect(engine.getZone("battleArea", "player_two").length).toBe(3);

      // Verify game is in correct phase for combat
      expect(engine.getGamePhase()).toBe("mainPhase");
    });

    it("should support single unit combat", () => {
      const scenario = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      expect(scenario.engine.getZone("battleArea", "player_one").length).toBe(
        1,
      );
      expect(scenario.engine.getZone("battleArea", "player_two").length).toBe(
        1,
      );
    });
  });

  describe("buildResourceScenario", () => {
    it("should create scenario with specified resource counts", () => {
      const engine = buildResourceScenario({
        playerOneResources: 5,
        playerTwoResources: 3,
      });

      expect(engine.getZone("resourceArea", "player_one").length).toBe(5);
      expect(engine.getZone("resourceArea", "player_two").length).toBe(3);
    });

    it("should respect resource limits", () => {
      const engine = buildResourceScenario({
        playerOneResources: 15, // Maximum resources
        playerTwoResources: 0,
      });

      expect(engine.getZone("resourceArea", "player_one").length).toBe(15);
      expect(engine.getZone("resourceArea", "player_two").length).toBe(0);
    });
  });

  describe("buildDeckConstructionScenario", () => {
    it("should create a scenario for testing deck construction rules", () => {
      const scenario = buildDeckConstructionScenario({
        deckSize: 50,
        resourceDeckSize: 10,
      });

      const { engine } = scenario;

      // Verify proper deck sizes
      expect(engine.getZone("deck", "player_one").length).toBe(50);
      expect(engine.getZone("resourceDeck", "player_one").length).toBe(10);
    });

    it("should support custom deck sizes for testing", () => {
      const scenario = buildDeckConstructionScenario({
        deckSize: 30,
        resourceDeckSize: 5,
      });

      expect(scenario.engine.getZone("deck", "player_one").length).toBe(30);
      expect(scenario.engine.getZone("resourceDeck", "player_one").length).toBe(
        5,
      );
    });
  });
});
