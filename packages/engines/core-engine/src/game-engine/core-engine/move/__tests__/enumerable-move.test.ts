import { LogLevel } from "../../../types/log-types";
import { LogCollector } from "../../../utils/log-collector";
import { MoveEnumerationService } from "../move-enumeration-service";
import { MoveProcessor } from "../move-processor";
import {
  createEnumerableMove,
  type EnumerableMove,
  GameMoveConstraint,
  MoveConstraintFailure,
  TargetSpec,
} from "../move-types";

// Test types
interface TestGameState {
  count: number;
  selectedCards: string[];
  phase: string;
  activePlayer: string;
}

interface TestContext {
  G: TestGameState;
  ctx: {
    currentPhase: string;
    turnPlayer: string;
    gameOver: boolean;
  };
  playerID: string;
  gameOps: {
    getCardById: (
      id: string,
    ) => { id: string; type: string; owner: string } | undefined;
    getCardsInZone: (zone: string, playerId: string) => string[];
  };
}

// Mock MoveProvider for testing
const createMockMoveProvider = (moves: Record<string, EnumerableMove>) => {
  return {
    getAllMovesForCurrentContext: () => moves,
    getMove: (_ctx: any, moveName: string) => moves[moveName] || null,
    canPlayerAct: () => true,
  };
};

describe("EnumerableMove System - Phase 3 Features", () => {
  let logCollector: LogCollector;
  let moveProcessor: MoveProcessor<TestGameState>;
  let moveEnumerationService: MoveEnumerationService<TestGameState>;

  // Sample game state
  const initialState = {
    G: {
      count: 0,
      selectedCards: [],
      phase: "main",
      activePlayer: "player1",
    },
    ctx: {
      currentPhase: "main",
      turnPlayer: "player1",
      gameOver: false,
    },
    _stateID: 0,
  };

  // Mock game operations
  const gameOps = {
    getCardById: (id: string) => {
      const cards: Record<string, { id: string; type: string; owner: string }> =
        {
          card1: { id: "card1", type: "creature", owner: "player1" },
          card2: { id: "card2", type: "item", owner: "player1" },
          card3: { id: "card3", type: "creature", owner: "player2" },
        };
      return cards[id];
    },
    getCardsInZone: (zone: string, playerId: string) => {
      const zones: Record<string, Record<string, string[]>> = {
        player1: {
          hand: ["card1", "card2"],
          play: [],
        },
        player2: {
          hand: [],
          play: ["card3"],
        },
      };
      return zones[playerId]?.[zone] || [];
    },
  };

  beforeEach(() => {
    logCollector = new LogCollector();
    moveProcessor = new MoveProcessor<TestGameState>(
      { gameOps } as any,
      logCollector,
    );
  });

  describe("Target Dependencies", () => {
    // Move with dependent targets
    const moveWithDependentTargets = createEnumerableMove<TestGameState>({
      execute: (context, primaryCard, secondaryCard) => {
        return {
          ...context.G,
          selectedCards: [primaryCard as string, secondaryCard as string],
        };
      },
      getConstraints: (context) => [
        {
          id: "active-player",
          check: () => context.ctx.turnPlayer === context.playerID,
          failureReason: "Not your turn",
          messageKey: "errors.not_your_turn",
          context: { turnPlayer: context.ctx.turnPlayer },
        },
      ],
      getTargetSpecs: (context) => [
        {
          id: "primary-target",
          parameterIndex: 0,
          required: true,
          targetType: "card",
          cardFilter: {
            owner: context.playerID,
          },
          description: "Select primary card",
          messageKey: "targets.primary_card",
          exclusivityGroup: "card-selection",
          renderHint: "highlight-primary",
        },
        {
          id: "secondary-target",
          parameterIndex: 1,
          required: true,
          targetType: "card",
          cardFilter: {
            // This would normally be more complex, depending on the first selection
          },
          description: "Select secondary card",
          messageKey: "targets.secondary_card",
          dependsOn: ["primary-target"], // This target depends on the first one
          exclusivityGroup: "card-selection", // Same group as primary target
          renderHint: "highlight-secondary",
        },
      ],
      metadata: {
        category: "selection",
        description: "Select two cards with dependencies",
      },
    });

    it("should recognize target dependencies", () => {
      // Setup move provider
      const moves = { selectWithDependency: moveWithDependentTargets };
      moveEnumerationService = new MoveEnumerationService<TestGameState>(
        createMockMoveProvider(moves),
        logCollector,
      );

      // Get potential targets
      const targets = moveEnumerationService.getPotentialTargets(
        initialState,
        "player1",
        "selectWithDependency",
      );

      // Check if dependency information is included
      expect(targets.dependentTargets).toBeDefined();
      expect(targets.dependentTargets?.["secondary-target"]).toContain(
        "primary-target",
      );
    });
  });

  describe("Exclusivity Groups", () => {
    // Move with exclusivity groups
    const moveWithExclusivityGroups = createEnumerableMove<TestGameState>({
      execute: (context, attacker, defender) => {
        return {
          ...context.G,
          selectedCards: [attacker as string, defender as string],
        };
      },
      getTargetSpecs: (context) => [
        {
          id: "attacker",
          parameterIndex: 0,
          required: true,
          targetType: "card",
          cardFilter: {
            owner: context.playerID,
          },
          description: "Select attacker",
          messageKey: "targets.attacker",
          exclusivityGroup: "combat-selection", // Cards in this group can't be selected twice
        },
        {
          id: "defender",
          parameterIndex: 1,
          required: true,
          targetType: "card",
          cardFilter: {
            owner: "player2", // Opponent
          },
          description: "Select defender",
          messageKey: "targets.defender",
          exclusivityGroup: "combat-selection", // Same group as attacker
        },
      ],
    });

    it("should include exclusivity group information in target specs", () => {
      // Setup move provider
      const moves = { combatWithExclusivity: moveWithExclusivityGroups };
      moveEnumerationService = new MoveEnumerationService<TestGameState>(
        createMockMoveProvider(moves),
        logCollector,
      );

      // Get potential targets
      const targets = moveEnumerationService.getPotentialTargets(
        initialState,
        "player1",
        "combatWithExclusivity",
      );

      // Check if exclusivity groups are included
      expect(targets.targets[0].exclusivityGroup).toBe("combat-selection");
      expect(targets.targets[1].exclusivityGroup).toBe("combat-selection");
    });
  });

  describe("Render Hints", () => {
    // Move with render hints
    const moveWithRenderHints = createEnumerableMove<TestGameState>({
      execute: (context, card) => {
        return {
          ...context.G,
          selectedCards: [card as string],
        };
      },
      getTargetSpecs: () => [
        {
          id: "card-to-highlight",
          parameterIndex: 0,
          required: true,
          targetType: "card",
          cardFilter: {},
          description: "Select card",
          messageKey: "targets.card",
          renderHint: "pulse-animation", // UI hint for styling
        },
      ],
    });

    it("should include render hints in target specs", () => {
      // Setup move provider
      const moves = { moveWithRenderHints: moveWithRenderHints };
      moveEnumerationService = new MoveEnumerationService<TestGameState>(
        createMockMoveProvider(moves),
        logCollector,
      );

      // Get potential targets
      const targets = moveEnumerationService.getPotentialTargets(
        initialState,
        "player1",
        "moveWithRenderHints",
      );

      // Check if render hints are included
      expect(targets.targets[0].renderHint).toBe("pulse-animation");
    });
  });

  describe("Rich Move Metadata", () => {
    // Move with rich metadata
    const moveWithRichMetadata = createEnumerableMove<TestGameState>({
      execute: (context) => context.G,
      metadata: {
        category: "resource",
        description: "Test move with rich metadata",
        displayName: "Rich Metadata Move",
        iconKey: "star",
        phase: "main",
        frequency: "once",
        importance: "high",
        customField: "custom value",
      },
    });

    it("should include metadata in available moves", () => {
      // Setup move provider
      const moves = { moveWithMetadata: moveWithRichMetadata };
      moveEnumerationService = new MoveEnumerationService<TestGameState>(
        createMockMoveProvider(moves),
        logCollector,
      );

      // Get available moves
      const availableMoves = moveEnumerationService.getAvailableMoves(
        initialState,
        "player1",
      );

      // Find our move
      const move = availableMoves.find((m) => m.name === "moveWithMetadata");

      // Check if metadata is included
      expect(move).toBeDefined();
      expect(move?.category).toBe("resource");
      expect(move?.description).toBe("Test move with rich metadata");
    });
  });

  describe("Constraint Validation", () => {
    // Move with constraints
    const moveWithConstraints = createEnumerableMove<TestGameState>({
      execute: (context) => context.G,
      getConstraints: (context) => [
        {
          id: "phase-check",
          check: () => context.ctx.currentPhase === "main",
          failureReason: "Wrong phase",
          messageKey: "errors.wrong_phase",
          context: {
            requiredPhase: "main",
            currentPhase: context.ctx.currentPhase,
          },
        },
        {
          id: "active-player",
          check: () => context.ctx.turnPlayer === context.playerID,
          failureReason: "Not your turn",
          messageKey: "errors.not_your_turn",
          context: { turnPlayer: context.ctx.turnPlayer },
        },
      ],
    });

    it("should validate constraints correctly", () => {
      // Setup move processor for validation
      const validationResult = moveProcessor.validateMove(
        initialState,
        "player1",
        "testMove",
        moveWithConstraints,
      );

      // Should be valid when all constraints pass
      expect(validationResult.isValid).toBe(true);

      // Try with a failing constraint (wrong player)
      const invalidResult = moveProcessor.validateMove(
        initialState,
        "player2",
        "testMove",
        moveWithConstraints,
      );

      // Should be invalid
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error?.reason).toBe("Not your turn");
    });
  });
});
