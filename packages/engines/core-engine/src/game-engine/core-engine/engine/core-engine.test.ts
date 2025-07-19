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

  it("should share state between G and coreOps in moves", () => {
    const { authoritativeEngine, playerOneEngine } = testEngine;

    // Get initial state
    const initialState = authoritativeEngine.getGameState();
    expect(initialState.G.testValue).toBeUndefined();
    expect(initialState.G.coreOpsModified).toBeUndefined();

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
    expect(updatedState.G.testValue).toBe("foo");

    // CoreOps should be able to access and work with G state
    expect(updatedState.G.coreOpsModified).toBe(true);

    // This test validates state sharing between G and coreOps
    console.log("State sharing test results:");
    console.log(
      "- CoreOps could see G changes:",
      updatedState.G.coreOpsModified,
    );
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
      coreOpsModified: updatedState.G.coreOpsModified,
    };

    console.log(
      "Current state sharing behavior:",
      JSON.stringify(stateReport, null, 2),
    );

    // This test serves as documentation of the current behavior
    // When the issue is fixed, these assertions should be updated accordingly
    if (!updatedState.G.coreOpsModified) {
      console.warn(
        "State sharing issue detected: coreOps cannot see G modifications",
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

    console.log("=== ORIGINAL ISSUE TEST RESULTS ===");
    console.log("G.testValue:", updatedState.G.testValue);
    console.log(
      "CoreOps can work with G state:",
      updatedState.G.coreOpsModified,
    );

    // Validate that the test ran
    expect(updatedState.G.testValue).toBe("bar");
    expect(updatedState.G.coreOpsModified).toBe(true);
  });

  it("should test context sharing scenario with coreOps", () => {
    const { authoritativeEngine, playerOneEngine } = testEngine;

    // Get initial turn count
    const initialTurnCount = authoritativeEngine.getTurnCount();
    console.log("=== CONTEXT SHARING TEST ===");
    console.log("Initial turn count:", initialTurnCount);

    // Execute context sharing test move
    const moveResult = playerOneEngine.processMove(
      "player_one",
      "contextSharingMove",
      [],
    );

    if (!moveResult.success) {
      console.error("Move failed:", moveResult.error);
      console.error("This indicates a context sharing issue!");
    }

    expect(moveResult.success).toBe(true);

    const finalTurnCount = authoritativeEngine.getTurnCount();
    console.log("Final turn count:", finalTurnCount);
    console.log("Expected turn count:", initialTurnCount + 1); // Should be +1 (one increment from coreOps)

    // The turn count should have been incremented once by coreOps
    expect(finalTurnCount).toBe(initialTurnCount + 1);

    console.log(
      "✅ Context sharing test passed - coreOps can modify shared state!",
    );
  });

  it("should synchronize metadata changes between CoreOps and card filters", () => {
    const { authoritativeEngine, playerOneEngine } = testEngine;
    console.log("=== METADATA SHARING TEST ===");

    // Execute a move that sets metadata through CoreOps and then
    // immediately tries to query that same metadata through card filtering
    const moveResult = playerOneEngine.processMove(
      "player_one",
      "metadataSharingMove",
      [],
    );

    expect(moveResult.success).toBe(true);

    const updatedState = authoritativeEngine.getGameState();

    // Check if the test ran successfully
    // If the filter system can see metadata changes made by CoreOps,
    // filteredCardsCount should be 0 (all cards got filtered out)
    expect(updatedState.G.metadataShared).toBe(true);
    expect(updatedState.G.filteredCardsCount).toBe(0);

    console.log("Metadata shared:", updatedState.G.metadataShared);
    console.log("Cards that passed filter:", updatedState.G.filteredCardsCount);
    console.log("Expected count:", 0);

    if (updatedState.G.filteredCardsCount > 0) {
      console.error(
        "❌ Metadata sharing test FAILED - Card filter can't see CoreOps changes!",
      );
    } else {
      console.log(
        "✅ Metadata sharing test passed - Card filter can see CoreOps changes!",
      );
    }
  });

  it("should identify how the card filtering system works with metadata", () => {
    const { authoritativeEngine, playerOneEngine } = testEngine;
    console.log("=== CARD FILTER METADATA TEST ===");

    // Execute the test move that creates test cards with metadata
    const moveResult = playerOneEngine.processMove(
      "player_one",
      "cardFilterMetadataTestMove",
      [],
    );

    expect(moveResult.success).toBe(true);

    const updatedState = authoritativeEngine.getGameState();

    console.log("Test 1 (Direct access to metadata):", {
      exertedCardFound: updatedState.G.test1Direct,
      nonExertedCardFound: updatedState.G.test1NonExerted,
      noMetaCardBehavior: updatedState.G.test1NoMeta,
    });

    console.log("Test 2 (Metadata change immediately visible):", {
      changeDetected: updatedState.G.test2AfterChange,
    });

    console.log(
      "Final conclusion:",
      updatedState.G.metadataResults?.conclusion,
    );

    // Verify direct metadata access
    expect(updatedState.G.test1Direct).toBe(true); // Should find exerted card
    expect(updatedState.G.test1NonExerted).toBe(true); // Initial value before change
    expect(updatedState.G.test1NoMeta).toBe(true); // No meta = undefined

    // Verify that metadata changes are immediately visible
    expect(updatedState.G.test2AfterChange).toBe(true);

    // Check overall conclusion
    expect(updatedState.G.metadataResults?.metaDirectlyAccessible).toBe(true);
    expect(updatedState.G.metadataResults?.metaChangeImmediatelyVisible).toBe(
      true,
    );
  });
});
