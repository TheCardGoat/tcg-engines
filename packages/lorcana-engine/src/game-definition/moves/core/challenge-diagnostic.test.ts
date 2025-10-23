import { describe, it } from "bun:test";
import { createPlayerId } from "@tcg/core";
import {
  LorcanaTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/lorcana-test-engine";

describe("Challenge Diagnostic", () => {
  it("should show state after setup", () => {
    const testEngine = new LorcanaTestEngine(
      { hand: 5, deck: 10, inkwell: 0 },
      { hand: 5, deck: 10, inkwell: 0 },
      { skipPreGame: false, cardDefinitions: {} },
    );

    // Complete pre-game setup
    const ctx1 = testEngine.getCtx();
    console.log("1. After init:", {
      segment: ctx1.currentSegment,
      phase: ctx1.currentPhase,
      turnPlayer: ctx1.currentPlayer,
      choosingFirstPlayer: ctx1.choosingFirstPlayer,
    });

    testEngine.changeActivePlayer(ctx1.choosingFirstPlayer || PLAYER_ONE);
    testEngine.chooseWhoGoesFirst(PLAYER_ONE);

    const ctx2 = testEngine.getCtx();
    console.log("2. After choosing first:", {
      segment: ctx2.currentSegment,
      phase: ctx2.currentPhase,
      turnPlayer: ctx2.currentPlayer,
      otp: ctx2.otp,
    });

    // Complete mulligans
    testEngine.changeActivePlayer(PLAYER_ONE);
    testEngine.alterHand([]);
    testEngine.changeActivePlayer(PLAYER_TWO);
    testEngine.alterHand([]);

    const ctx3 = testEngine.getCtx();
    console.log("3. After mulligans:", {
      segment: ctx3.currentSegment,
      phase: ctx3.currentPhase,
      turnPlayer: ctx3.currentPlayer,
    });

    testEngine.changeActivePlayer(PLAYER_ONE);

    // Pass turns
    testEngine.passTurn();
    const ctx4 = testEngine.getCtx();
    console.log("4. After first pass:", {
      segment: ctx4.currentSegment,
      phase: ctx4.currentPhase,
      turnPlayer: ctx4.currentPlayer,
    });

    testEngine.passTurn();
    const ctx5 = testEngine.getCtx();
    console.log("5. After second pass:", {
      segment: ctx5.currentSegment,
      phase: ctx5.currentPhase,
      turnPlayer: ctx5.currentPlayer,
    });

    // Create characters
    const attacker = testEngine.createCharacterInPlay(PLAYER_ONE, {
      strength: 3,
      willpower: 4,
    });
    const defender = testEngine.createCharacterInPlay(PLAYER_TWO, {
      strength: 2,
      willpower: 3,
    });

    console.log("6. Characters created:", {
      attacker,
      defender,
      attackerMeta: testEngine.getCardMeta(attacker),
      defenderMeta: testEngine.getCardMeta(defender),
    });

    // Check if characters are in play
    const p1Play = testEngine.getZone("play", PLAYER_ONE);
    const p2Play = testEngine.getZone("play", PLAYER_TWO);
    console.log("7. Characters in zones:", {
      p1Play,
      p2Play,
      attackerInPlay: p1Play.includes(attacker),
      defenderInPlay: p2Play.includes(defender),
    });

    // Try to challenge
    const result = testEngine.engine.executeMove("challenge", {
      playerId: createPlayerId(PLAYER_ONE),
      params: {
        attackerId: attacker,
        defenderId: defender,
      },
    });

    console.log("8. Challenge result:", result);

    testEngine.dispose();
  });
});
