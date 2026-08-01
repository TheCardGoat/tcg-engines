import { describe, expect, it } from "vitest";

import { applyAction } from "../src/reducer";
import { addCharacter, bareState, statOf } from "./helpers";
import type { GameState } from "../src/types";

/** p1 declares an N-004 attack on p2's leader; returns the counter-step state. */
function declareAttackOnLeader(state: GameState): GameState {
  const attacker = addCharacter(state, "p1", "N-004");
  const declared = applyAction(state, {
    type: "DECLARE_ATTACK",
    player: "p1",
    attackerUid: attacker.uid,
    attackerKind: "character",
    targetKind: "leader",
    targetUid: null,
  });
  expect(declared.step).toBe("counter");
  expect(declared.priority).toBe("p2");
  return declared;
}

describe("chain & counter step", () => {
  it("counter support activation goes on the chain; interrupt cancels the attack", () => {
    const state = bareState();
    // N-008 Shadow Possession Jutsu: counter timing, "Summon this card and interrupt that attack."
    state.players.p2.supports[0] = { uid: "s1", cardId: "N-008" };
    const declared = declareAttackOnLeader(state);

    const activated = applyAction(declared, {
      type: "ACTIVATE_SUPPORT",
      player: "p2",
      slot: 0,
    });
    // p1 has no activatable support, so the chain resolves immediately:
    // the attack is interrupted and N-008 is summoned as a character.
    expect(activated.pendingAttack).toBeNull();
    expect(activated.step).toBe("normal");
    expect(activated.players.p2.characters.some((c) => c?.cardId === "N-008")).toBe(true);
    // The support card moved to the character zone (kept, not trashed).
    expect(activated.players.p2.trash).toHaveLength(0);
    // No damage was dealt.
    expect(activated.players.p2.life).toBe(15);
    // The attacker stays rested (provisional rule: interrupt uses the attack).
    expect(activated.players.p1.characters[0]?.rested).toBe(true);
    expect(
      activated.log.some((entry) => entry.key === "log.attackInterrupted"),
    ).toBe(true);
  });

  it("defender cannot activate counter supports outside an attack window", () => {
    const state = bareState();
    state.players.p2.supports[0] = { uid: "s1", cardId: "N-008" };
    const blocked = applyAction(state, { type: "ACTIVATE_SUPPORT", player: "p2", slot: 0 });
    expect(blocked).toBe(state);
  });

  it("negate removes the previous chain link; negated support goes to trash", () => {
    const state = bareState();
    // p2: N-006 (counter, KO up to 2 rested); p1: K-039 (response, negate + life cost 2).
    state.players.p2.supports[0] = { uid: "s1", cardId: "N-006" };
    state.players.p1.supports[0] = { uid: "s2", cardId: "K-039" };
    const declared = declareAttackOnLeader(state);

    const chained = applyAction(declared, { type: "ACTIVATE_SUPPORT", player: "p2", slot: 0 });
    // p1 has K-039 (response) available -> priority passes to p1.
    expect(chained.step).toBe("counter");
    expect(chained.priority).toBe("p1");
    expect(chained.chain).toHaveLength(1);

    const negated = applyAction(chained, { type: "ACTIVATE_SUPPORT", player: "p1", slot: 0 });
    // Nobody else can respond -> chain resolves LIFO: K-039 negates N-006.
    expect(negated.step).toBe("normal");
    // N-006's effect never ran: no KO choice was queued, both supports trashed.
    expect(negated.players.p2.trash.map((c) => c.cardId)).toContain("N-006");
    expect(negated.players.p1.trash.map((c) => c.cardId)).toContain("K-039");
    // Negate life cost: p1 lost 2 life.
    expect(negated.players.p1.life).toBe(13);
    // The attack then resolved against the leader (N-004 damage 1).
    expect(negated.players.p2.life).toBe(15 - statOf("N-004", "damage"));
    expect(negated.log.some((entry) => entry.key === "log.negated")).toBe(true);
  });

  it("two consecutive passes resolve the chain LIFO, then the attack", () => {
    const state = bareState();
    // p2 has two counter supports; p1 has one response support.
    state.players.p2.supports[0] = { uid: "s1", cardId: "N-010" }; // summon + gain 2 life
    state.players.p2.supports[1] = { uid: "s2", cardId: "N-008" }; // summon + interrupt
    state.players.p1.supports[0] = { uid: "s3", cardId: "K-039" }; // negate
    const declared = declareAttackOnLeader(state);

    // p2 activates N-010 (gain life + summon); priority moves to p1.
    const chained = applyAction(declared, { type: "ACTIVATE_SUPPORT", player: "p2", slot: 0 });
    expect(chained.priority).toBe("p1");
    expect(chained.chain).toHaveLength(1);

    // p1 passes; priority returns to p2 (they still have an activatable support).
    const pass1 = applyAction(chained, { type: "PASS_COUNTER", player: "p1" });
    expect(pass1.step).toBe("counter");
    expect(pass1.priority).toBe("p2");
    expect(pass1.consecutivePasses).toBe(1);

    // p2 passes; two consecutive passes -> resolve.
    const resolved = applyAction(pass1, { type: "PASS_COUNTER", player: "p2" });
    expect(resolved.step).toBe("normal");
    expect(resolved.consecutivePasses).toBe(0);
    // N-010 resolved: p2 gained 2 life and summoned the card as a character...
    // ...then the attack hit for 1.
    expect(resolved.players.p2.life).toBe(15 + 2 - statOf("N-004", "damage"));
    expect(resolved.players.p2.characters.some((c) => c?.cardId === "N-010")).toBe(true);
    // p2's unused support is still set; p1's negate was never used.
    expect(resolved.players.p2.supports[1]?.cardId).toBe("N-008");
    expect(resolved.players.p1.supports[0]?.cardId).toBe("K-039");
  });

  it("passing with an empty chain resolves the attack immediately", () => {
    const state = bareState();
    const declared = declareAttackOnLeader(state);
    const resolved = applyAction(declared, { type: "PASS_COUNTER", player: "p2" });
    expect(resolved.pendingAttack).toBeNull();
    expect(resolved.players.p2.life).toBe(14);
  });

  it("the attacker cannot pass for the defender", () => {
    const state = bareState();
    const declared = declareAttackOnLeader(state);
    expect(applyAction(declared, { type: "PASS_COUNTER", player: "p1" })).toBe(declared);
  });

  it("life gain can push a leader above the starting 15", () => {
    const state = bareState();
    state.players.p2.supports[0] = { uid: "s1", cardId: "N-010" };
    const declared = declareAttackOnLeader(state);
    const resolved = applyAction(declared, {
      type: "ACTIVATE_SUPPORT",
      player: "p2",
      slot: 0,
    });
    // +2 from N-010, -1 from the N-004 attack.
    expect(resolved.players.p2.life).toBe(16);
  });
});
