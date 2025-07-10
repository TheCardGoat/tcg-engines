import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { TestCoreEngine } from "./test-core-engine";

describe("Core Engine", () => {
  let testEngine: TestCoreEngine;

  beforeEach(() => {
    testEngine = new TestCoreEngine();
  });

  afterEach(() => {
    // cleanup
  });

  it("should initialize correctly", () => {
    const { authoritativeEngine, playerOneEngine, playerTwoEngine } =
      testEngine;
    expect(authoritativeEngine).toBeDefined();
    expect(playerOneEngine).toBeDefined();
    expect(playerTwoEngine).toBeDefined();

    const state = authoritativeEngine.getGameState();
    expect(state).toBeDefined();
    expect(state.G.players.player_one).toBeDefined();
    expect(state.G.players.player_two).toBeDefined();
  });

  it("should have synchronized states after initialization", () => {
    const { authoritativeEngine, playerOneEngine, playerTwoEngine } =
      testEngine;
    const authHash = authoritativeEngine.getGameStateHash();
    const p1Hash = playerOneEngine.getGameStateHash();
    const p2Hash = playerTwoEngine.getGameStateHash();

    expect(authHash).toEqual(p1Hash);
    expect(authHash).toEqual(p2Hash);
  });

  it("should share state between G, coreOps, and gameOps in moves", () => {
    const { authoritativeEngine, playerOneEngine } = testEngine;

    // Get initial state
    const initialState = authoritativeEngine.getGameState();
    expect(initialState.G.testValue).toBeUndefined();
    expect(initialState.G.directModified).toBeUndefined();
    expect(initialState.G.coreOpsModified).toBeUndefined();
    expect(initialState.G.gameOpsModified).toBeUndefined();

    // Execute the state sharing test move
    const moveResult = playerOneEngine.processMove(
      "player_one",
      "stateSharedMove",
      [],
    );

    // Verify the move was successful
    expect(moveResult.success).toBe(true);

    // Get the updated state
    const updatedState = authoritativeEngine.getGameState();

    // Verify that the move executed and modified G directly
    expect(updatedState.G.testValue).toBe("modified by direct G access");
    expect(updatedState.G.directModified).toBe(true);

    // This test will validate the current behavior and help identify the state sharing issue
    // If state sharing works correctly, these should all be true:
    console.log("State sharing test results:");
    console.log("- Direct G modification:", updatedState.G.directModified);
    console.log(
      "- CoreOps could see G changes:",
      updatedState.G.coreOpsModified,
    );
    console.log(
      "- GameOps could see all changes:",
      updatedState.G.gameOpsModified,
    );

    // These assertions will help identify the state sharing issue
    expect(updatedState.G.coreOpsModified).toBe(true); // This should pass if coreOps sees G changes
    expect(updatedState.G.gameOpsModified).toBe(true); // This should pass if gameOps sees all changes

    // Additional verification: Check that context was modified by coreOps
    const ctx = authoritativeEngine.getCtx();
    expect(ctx.priorityPlayerPos).toBeDefined(); // Should be set by coreOps.setPriorityPlayer
  });

  it("should demonstrate the state sharing issue when it exists", () => {
    const { authoritativeEngine, playerOneEngine } = testEngine;

    // Execute the state sharing test move
    const moveResult = playerOneEngine.processMove(
      "player_one",
      "stateSharedMove",
      [],
    );
    expect(moveResult.success).toBe(true);

    const updatedState = authoritativeEngine.getGameState();

    // Log the actual behavior to help with debugging
    const stateReport = {
      testValue: updatedState.G.testValue,
      directModified: updatedState.G.directModified,
      coreOpsModified: updatedState.G.coreOpsModified,
      gameOpsModified: updatedState.G.gameOpsModified,
    };

    console.log(
      "Current state sharing behavior:",
      JSON.stringify(stateReport, null, 2),
    );

    // This test serves as documentation of the current behavior
    // When the issue is fixed, these assertions should be updated accordingly
    if (!(updatedState.G.coreOpsModified && updatedState.G.gameOpsModified)) {
      console.warn(
        "State sharing issue detected: coreOps and/or gameOps cannot see G modifications",
      );
    }
  });

  it("should demonstrate the REAL context sharing issue between coreOps and gameOps", () => {
    const { authoritativeEngine, playerOneEngine } = testEngine;

    // Get initial context state
    const initialCtx = authoritativeEngine.getCtx();
    const initialTurnCount = initialCtx.numTurns || 0;

    // Execute the context sharing test move
    const moveResult = playerOneEngine.processMove(
      "player_one",
      "contextSharingMove",
      [],
    );

    expect(moveResult.success).toBe(true);

    const updatedState = authoritativeEngine.getGameState();
    const finalCtx = authoritativeEngine.getCtx();

    console.log("=== CONTEXT SHARING TEST RESULTS ===");
    console.log("Initial turn count:", initialTurnCount);
    console.log("Final turn count:", finalCtx.numTurns);
    console.log("Test details:", updatedState.G.testValue);
    console.log(
      "GameOps can see CoreOps changes:",
      updatedState.G.coreOpsModified,
    );
    console.log(
      "CoreOps can see GameOps changes:",
      updatedState.G.gameOpsModified,
    );

    // This test will reveal the actual state sharing issue
    // If both operations modify the same context property, do they see each other's changes?

    // These might fail if there's a state sharing issue between coreOps and gameOps
    expect(updatedState.G.directModified).toBe(true); // Test ran

    // The following tests will show the actual state sharing behavior
    // If they fail, it indicates the state sharing issue you described
    if (updatedState.G.coreOpsModified) {
      console.log("✅ gameOps can see changes made by coreOps");
    } else {
      console.error(
        "❌ ISSUE DETECTED: gameOps cannot see changes made by coreOps",
      );
    }

    if (updatedState.G.gameOpsModified) {
      console.log("✅ coreOps can see changes made by gameOps");
    } else {
      console.error(
        "❌ ISSUE DETECTED: coreOps cannot see changes made by gameOps",
      );
    }
  });

  it("should test the original issue scenario closely", () => {
    const { authoritativeEngine, playerOneEngine } = testEngine;

    // Execute the original issue test move
    const moveResult = playerOneEngine.processMove(
      "player_one",
      "originalIssueTest",
      [],
    );

    expect(moveResult.success).toBe(true);

    const updatedState = authoritativeEngine.getGameState();
    const finalCtx = authoritativeEngine.getCtx();

    console.log("=== ORIGINAL ISSUE TEST RESULTS ===");
    console.log("G.testValue:", updatedState.G.testValue);
    console.log("Final OTP in context:", finalCtx.otp);
    console.log(
      "CoreOps can work with G state:",
      updatedState.G.coreOpsModified,
    );
    console.log(
      "GameOps can see both G and Ctx changes:",
      updatedState.G.gameOpsModified,
    );

    // Validate that the test ran
    expect(updatedState.G.directModified).toBe(true);
    expect(updatedState.G.testValue).toBe("bar");

    // Check if the operations can see each other's work
    expect(updatedState.G.coreOpsModified).toBe(true); // coreOps should be able to work with G
    expect(updatedState.G.gameOpsModified).toBe(true); // gameOps should see both G and ctx changes
  });

  it("should test your specific context sharing scenario with turn count", () => {
    const { authoritativeEngine, playerOneEngine } = testEngine;

    // Get initial turn count
    const initialTurnCount = authoritativeEngine.getTurnCount();
    console.log("=== YOUR CONTEXT SHARING TEST ===");
    console.log("Initial turn count:", initialTurnCount);

    // Execute your context sharing test move
    const moveResult = playerOneEngine.processMove(
      "player_one",
      "contextSharingMove",
      [],
    );

    if (!moveResult.success) {
      console.error("Move failed:", moveResult.error);
      console.error("This indicates the context sharing issue you described!");
    }

    expect(moveResult.success).toBe(true);

    const finalTurnCount = authoritativeEngine.getTurnCount();
    console.log("Final turn count:", finalTurnCount);
    console.log("Expected turn count:", initialTurnCount + 2); // Should be +2 (one increment from coreOps, one from gameOps)

    // The turn count should have been incremented twice (once by coreOps, once by gameOps)
    expect(finalTurnCount).toBe(initialTurnCount + 2);

    console.log(
      "✅ Context sharing test passed - coreOps and gameOps share the same state!",
    );
  });
});
