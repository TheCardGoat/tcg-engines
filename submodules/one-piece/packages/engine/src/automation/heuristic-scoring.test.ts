/**
 * Unit tests for pure heuristic scoring helpers on fixed mid-game fixtures.
 * Proves the two challenging policies differ on leader pressure vs removal
 * without running full bot matches.
 */
import "@tcg/op-cards";
import { describe, test } from "vite-plus/test";
import { strict as assert } from "node:assert";
import { createTestMatchState } from "../testing/test-fixtures.ts";
import { getPlayer } from "../shared.ts";
import {
  AGGRESSIVE_POLICY,
  BALANCED_POLICY,
  computeDonReserve,
  scoreAttachDon,
  scoreCharacterAttack,
  scoreCharacterPlay,
  scoreLeaderAttack,
} from "./heuristic-strategy.ts";

describe("One Piece heuristic scoring policies", () => {
  test("aggressive ranks leader pressure higher than balanced on the same state", () => {
    // Active mid-game: both sides have leaders and a board; south is attacking.
    const state = createTestMatchState(
      {
        leaderCardId: "OP01-001",
        character: [
          { cardId: "OP01-025", rested: false, playedOnTurn: 1 }, // Zoro 3/5000 Rush
        ],
        activeDon: 4,
        life: 3,
        hand: 3,
      },
      {
        leaderCardId: "OP01-001",
        character: [{ cardId: "OP01-019", rested: true, playedOnTurn: 1 }], // Bartolomeo blocker
        activeDon: 2,
        life: 3,
        hand: 3,
      },
      { skipSetup: true, activeSeat: "south", turnNumber: 4 },
    );

    const south = getPlayer(state, "south");
    const attackerId = south.characterArea.find((id): id is string => id !== null)!;
    const attackerPower = 5000; // printed Zoro power; DON!! not attached in fixture
    const attackerCount = 1;

    const balancedLeader = scoreLeaderAttack(
      state,
      "south",
      attackerId,
      attackerPower,
      attackerCount,
      BALANCED_POLICY,
    );
    const aggressiveLeader = scoreLeaderAttack(
      state,
      "south",
      attackerId,
      attackerPower,
      attackerCount,
      AGGRESSIVE_POLICY,
    );

    assert.ok(balancedLeader > 0, `balanced leader score expected positive, got ${balancedLeader}`);
    assert.ok(
      aggressiveLeader > balancedLeader,
      `aggressive leader score ${aggressiveLeader} should exceed balanced ${balancedLeader}`,
    );

    const north = getPlayer(state, "north");
    const blockerId = north.characterArea.find((id): id is string => id !== null)!;
    const balancedChar = scoreCharacterAttack(state, attackerPower, blockerId, BALANCED_POLICY);
    const aggressiveChar = scoreCharacterAttack(state, attackerPower, blockerId, AGGRESSIVE_POLICY);

    // Both should want to remove a blocker; aggressive still scores it (blocker bonus)
    // but with lower characterAttackBias so leader pressure can win the sort more often.
    assert.ok(balancedChar > 0);
    assert.ok(aggressiveChar > 0);
    assert.ok(
      aggressiveLeader / balancedLeader > aggressiveChar / balancedChar ||
        aggressiveLeader > aggressiveChar,
      "aggressive policy tilts relatively toward leader attacks vs character KOs",
    );
  });

  test("aggressive awards more for Rush characters than balanced", () => {
    const state = createTestMatchState(
      {
        leaderCardId: "OP01-001",
        hand: ["OP01-025", "OP01-012"], // Rush Zoro vs non-rush Sai
        activeDon: 3,
        life: 5,
      },
      {
        leaderCardId: "OP01-001",
        life: 5,
      },
      { skipSetup: true, activeSeat: "south", turnNumber: 3 },
    );

    const hand = getPlayer(state, "south").hand;
    const rushId = hand[0]!;
    const nonRushId = hand[1]!;

    const balancedRush = scoreCharacterPlay(state, rushId, 3, BALANCED_POLICY);
    const aggressiveRush = scoreCharacterPlay(state, rushId, 3, AGGRESSIVE_POLICY);
    const balancedNonRush = scoreCharacterPlay(state, nonRushId, 3, BALANCED_POLICY);
    const aggressiveNonRush = scoreCharacterPlay(state, nonRushId, 3, AGGRESSIVE_POLICY);

    const balancedRushEdge = balancedRush - balancedNonRush;
    const aggressiveRushEdge = aggressiveRush - aggressiveNonRush;
    assert.ok(
      aggressiveRushEdge > balancedRushEdge,
      `aggressive Rush edge ${aggressiveRushEdge} should exceed balanced ${balancedRushEdge}`,
    );
  });

  test("lethal window: at 2 life, power equal to leader scores positive without +1000 margin", () => {
    const state = createTestMatchState(
      {
        leaderCardId: "OP01-001",
        character: [{ cardId: "OP01-025", rested: false, playedOnTurn: 1 }],
        activeDon: 2,
        life: 3,
        hand: 2,
      },
      {
        leaderCardId: "OP01-001", // 5000 power leader
        life: 2,
        hand: 4,
      },
      { skipSetup: true, activeSeat: "south", turnNumber: 5 },
    );
    const attackerId = getPlayer(state, "south").characterArea.find(
      (id): id is string => id !== null,
    )!;
    // 5000 vs 5000 leader at 2 life must score as a real attack, not -1.
    const score = scoreLeaderAttack(state, "south", attackerId, 5000, 1, BALANCED_POLICY);
    assert.ok(score > 0, `expected lethal-window leader attack score > 0, got ${score}`);
  });

  test("DON!! reserve drops to 0 when racing for lethal", () => {
    const state = createTestMatchState(
      {
        leaderCardId: "OP01-001",
        character: [
          { cardId: "OP01-025", rested: false, playedOnTurn: 1 },
          { cardId: "OP01-012", rested: false, playedOnTurn: 1 },
        ],
        // Put a cheap [Counter] event in hand so a non-zero reserve would apply
        // outside the race window (OP01-029 Gum-Gum Whip is a red counter event).
        hand: ["OP01-029", "OP01-029"],
        activeDon: 5,
        life: 3,
      },
      {
        leaderCardId: "OP01-001",
        life: 2, // lethal race window
        hand: 2,
      },
      { skipSetup: true, activeSeat: "south", turnNumber: 5 },
    );
    const reserve = computeDonReserve(state, "south", 2, BALANCED_POLICY);
    assert.strictEqual(reserve, 0, `expected 0 DON!! reserve in lethal race, got ${reserve}`);
  });

  test("attachDon prefers attackers that need +1000 to clear the leader", () => {
    const state = createTestMatchState(
      {
        leaderCardId: "OP01-001",
        character: [
          // 5000 already clears a 5000 leader — overkill stack target
          { cardId: "OP01-025", rested: false, playedOnTurn: 1, attachedDon: 0 },
          // 4000 needs one DON!! to clear 5000 leader
          { cardId: "OP01-012", rested: false, playedOnTurn: 1, attachedDon: 0 },
        ],
        activeDon: 3,
        life: 4,
        hand: 2,
      },
      {
        leaderCardId: "OP01-001", // 5000
        life: 3,
        hand: 2,
      },
      { skipSetup: true, activeSeat: "south", turnNumber: 4 },
    );
    const chars = getPlayer(state, "south").characterArea.filter((id): id is string => id !== null);
    const strongId = chars[0]!;
    const weakId = chars[1]!;
    const strongScore = scoreAttachDon(state, "south", strongId, strongId, BALANCED_POLICY);
    const weakScore = scoreAttachDon(state, "south", weakId, strongId, BALANCED_POLICY);
    assert.ok(
      weakScore > strongScore,
      `under-threshold attacker attach ${weakScore} should beat overkill stack ${strongScore}`,
    );
  });
});
