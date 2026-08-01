import { describe, expect, it } from "vitest";

import {
  canBeAttacked,
  characterAttackBlock,
  leaderAttackBlock,
} from "../src/queries";
import { applyAction } from "../src/reducer";
import { addCharacter, bareState, statOf, weakCharacterId } from "./helpers";

describe("combat", () => {
  it("attack on leader reduces life by the attacker's damage stat", () => {
    const state = bareState();
    const attacker = addCharacter(state, "p1", "N-004"); // damage 1, power 5
    const afterDeclare = applyAction(state, {
      type: "DECLARE_ATTACK",
      player: "p1",
      attackerUid: attacker.uid,
      attackerKind: "character",
      targetKind: "leader",
      targetUid: null,
    });
    expect(afterDeclare).not.toBe(state);
    expect(afterDeclare.step).toBe("counter");
    expect(afterDeclare.priority).toBe("p2");
    expect(afterDeclare.pendingAttack?.attackerUid).toBe(attacker.uid);
    // Attacking rests the attacker and uses its attack.
    expect(afterDeclare.players.p1.characters[0]?.rested).toBe(true);
    expect(afterDeclare.players.p1.characters[0]?.attacksUsed).toBe(1);

    // Original state untouched (immutability).
    expect(state.pendingAttack).toBeNull();
    expect(state.players.p1.characters[0]?.rested).toBe(false);

    const resolved = applyAction(afterDeclare, { type: "PASS_COUNTER", player: "p2" });
    expect(resolved.step).toBe("normal");
    expect(resolved.pendingAttack).toBeNull();
    expect(resolved.players.p2.life).toBe(15 - statOf("N-004", "damage"));
    // Attacker takes no damage.
    expect(resolved.players.p1.characters[0]?.damage).toBe(0);
  });

  it("leaders attack with their own damage stat", () => {
    const state = bareState();
    const afterDeclare = applyAction(state, {
      type: "DECLARE_ATTACK",
      player: "p1",
      attackerUid: "leader:p1",
      attackerKind: "leader",
      targetKind: "leader",
      targetUid: null,
    });
    expect(afterDeclare.players.p1.leaderRested).toBe(true);
    const resolved = applyAction(afterDeclare, { type: "PASS_COUNTER", player: "p2" });
    expect(resolved.players.p2.life).toBe(15 - statOf("N-001", "damage"));
  });

  it("only rested characters can be attacked", () => {
    const state = bareState();
    const attacker = addCharacter(state, "p1", "N-004");
    const standing = addCharacter(state, "p2", "N-choji");
    expect(canBeAttacked(state, standing.uid)).toBe(false);
    const blocked = applyAction(state, {
      type: "DECLARE_ATTACK",
      player: "p1",
      attackerUid: attacker.uid,
      attackerKind: "character",
      targetKind: "character",
      targetUid: standing.uid,
    });
    expect(blocked).toBe(state); // illegal: standing target

    const state2 = bareState();
    const attacker2 = addCharacter(state2, "p1", "N-004");
    const rested = addCharacter(state2, "p2", "N-choji", { rested: true });
    expect(canBeAttacked(state2, rested.uid)).toBe(true);
    const declared = applyAction(state2, {
      type: "DECLARE_ATTACK",
      player: "p1",
      attackerUid: attacker2.uid,
      attackerKind: "character",
      targetKind: "character",
      targetUid: rested.uid,
    });
    expect(declared).not.toBe(state2);
  });

  it("character combat deals power as damage and KOs at damage >= health", () => {
    const state = bareState();
    const attacker = addCharacter(state, "p1", "N-007"); // power 8
    const target = addCharacter(state, "p2", "N-choji", { rested: true }); // health 3
    const declared = applyAction(state, {
      type: "DECLARE_ATTACK",
      player: "p1",
      attackerUid: attacker.uid,
      attackerKind: "character",
      targetKind: "character",
      targetUid: target.uid,
    });
    const resolved = applyAction(declared, { type: "PASS_COUNTER", player: "p2" });
    // N-choji (health 3) took 8 damage >= health: KO'd to the trash.
    expect(resolved.players.p2.characters.every((c) => c === null)).toBe(true);
    expect(resolved.players.p2.trash.map((c) => c.cardId)).toContain("N-choji");
    // Attacker survives unscathed.
    expect(resolved.players.p1.characters[0]?.damage).toBe(0);
  });

  it("non-lethal damage stays until end of turn, then wipes", () => {
    const state = bareState();
    const attacker = addCharacter(state, "p1", "N-004"); // power 5
    const target = addCharacter(state, "p2", "N-011", { rested: true }); // health 8
    const declared = applyAction(state, {
      type: "DECLARE_ATTACK",
      player: "p1",
      attackerUid: attacker.uid,
      attackerKind: "character",
      targetKind: "character",
      targetUid: target.uid,
    });
    const resolved = applyAction(declared, { type: "PASS_COUNTER", player: "p2" });
    expect(resolved.players.p2.characters[0]?.damage).toBe(5);
    const nextTurn = applyAction(resolved, { type: "END_TURN", player: "p1" });
    expect(nextTurn.players.p2.characters[0]?.damage).toBe(0);
  });

  it("locks attacks on turns 1-2", () => {
    for (const turn of [1, 2]) {
      const state = bareState({ turn });
      const attacker = addCharacter(state, "p1", "N-004");
      expect(characterAttackBlock(state, "p1", attacker.uid)).toBe("tooEarly");
      expect(leaderAttackBlock(state, "p1")).toBe("tooEarly");
    }
  });

  it("enforces summoning sickness unless the character has Rush", () => {
    const state = bareState();
    const sick = addCharacter(state, "p1", "N-004", { summonedOnTurn: state.turn });
    expect(characterAttackBlock(state, "p1", sick.uid)).toBe("summoningSickness");

    const rushState = bareState();
    const rushed = addCharacter(rushState, "p1", "N-010", { summonedOnTurn: rushState.turn });
    rushed.rushUntilTurn = rushState.turn;
    expect(characterAttackBlock(rushState, "p1", rushed.uid)).toBeNull();
  });

  it("limits characters to 1 attack each and leaders to 1 per turn", () => {
    const state = bareState();
    const attacker = addCharacter(state, "p1", "N-004");
    attacker.attacksUsed = 1;
    expect(characterAttackBlock(state, "p1", attacker.uid)).toBe("noAttackLeft");
    state.players.p1.leaderAttacksUsed = 1;
    expect(leaderAttackBlock(state, "p1")).toBe("noAttackLeft");
  });

  it("recovery rests the leader and flips all chakra face-up (from turn 2)", () => {
    const state = bareState({ turn: 2 });
    const first = state.players.p1.chakra[0];
    const second = state.players.p1.chakra[1];
    if (first) first.faceUp = false;
    if (second) second.faceUp = false;
    const next = applyAction(state, { type: "RECOVERY", player: "p1" });
    expect(next).not.toBe(state);
    expect(next.players.p1.leaderRested).toBe(true);
    expect(next.players.p1.chakra.every((c) => c.faceUp)).toBe(true);
  });

  it("rejects recovery on turn 1, when rested, or while chakra-locked", () => {
    const turnOne = bareState({ turn: 1 });
    expect(applyAction(turnOne, { type: "RECOVERY", player: "p1" })).toBe(turnOne);

    const rested = bareState();
    rested.players.p1.leaderRested = true;
    expect(applyAction(rested, { type: "RECOVERY", player: "p1" })).toBe(rested);

    const locked = bareState();
    locked.players.p1.chakraLockedUntilTurn = 99;
    expect(applyAction(locked, { type: "RECOVERY", player: "p1" })).toBe(locked);
  });

  it("paying a support cost flips that many chakra face-down", () => {
    const state = bareState();
    state.players.p1.hand = [{ uid: "h1", cardId: "N-004" }]; // support cost 2
    const set = applyAction(state, { type: "SET_SUPPORT", player: "p1", handUid: "h1" });
    expect(set).not.toBe(state);
    expect(set.players.p1.supports[0]?.cardId).toBe("N-004");
    expect(set.players.p1.supports[0]?.revealed).toBeUndefined();

    const activated = applyAction(set, { type: "ACTIVATE_SUPPORT", player: "p1", slot: 0 });
    expect(activated).not.toBe(set);
    expect(activated.players.p1.chakra.filter((c) => c.faceUp)).toHaveLength(3);
    // Rasengan wiped the (empty) board and went to the trash.
    expect(activated.players.p1.supports[0]).toBeNull();
    expect(activated.players.p1.trash.map((c) => c.cardId)).toContain("N-004");
  });

  it("cannot activate a support without enough face-up chakra", () => {
    const state = bareState();
    state.players.p1.supports[0] = { uid: "s1", cardId: "N-004" }; // cost 2
    state.players.p1.chakra.forEach((c, i) => {
      if (i > 0) c.faceUp = false;
    });
    expect(applyAction(state, { type: "ACTIVATE_SUPPORT", player: "p1", slot: 0 })).toBe(state);
  });

  it("winner is declared when leader life reaches 0", () => {
    const state = bareState();
    state.players.p2.life = 1;
    const attacker = addCharacter(state, "p1", "N-004"); // damage 1
    const declared = applyAction(state, {
      type: "DECLARE_ATTACK",
      player: "p1",
      attackerUid: attacker.uid,
      attackerKind: "character",
      targetKind: "leader",
      targetUid: null,
    });
    const resolved = applyAction(declared, { type: "PASS_COUNTER", player: "p2" });
    expect(resolved.winner).toBe("p1");
    // Game over: further actions are no-ops.
    expect(applyAction(resolved, { type: "END_TURN", player: "p1" })).toBe(resolved);
  });

  it("uses the weak-character fixture sanely", () => {
    expect(statOf(weakCharacterId(3), "health")).toBeLessThanOrEqual(3);
  });
});
