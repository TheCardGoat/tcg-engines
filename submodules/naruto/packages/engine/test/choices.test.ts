import { describe, expect, it } from "vitest";

import { leaderEffectBlock } from "../src/effects";
import { deciderOf, effectivePower } from "../src/queries";
import { applyAction } from "../src/reducer";
import { addCharacter, bareState } from "./helpers";

describe("choice flows", () => {
  it("leader boost: resolving the choice pays 1 chakra and gives +3 power", () => {
    const state = bareState();
    const character = addCharacter(state, "p1", "N-004");
    expect(leaderEffectBlock(state, "p1")).toBeNull();
    const next = applyAction(state, { type: "LEADER_EFFECT", player: "p1" });
    // Cancellable choices always prompt, even with a single option.
    expect(next.pendingChoice?.effect).toBe("leaderBoost");
    expect(next.pendingChoice?.options.map((o) => o.key)).toEqual([character.uid]);
    const resolved = applyAction(next, {
      type: "RESOLVE_CHOICE",
      player: "p1",
      key: character.uid,
    });
    expect(resolved.pendingChoice).toBeNull();
    const boosted = resolved.players.p1.characters[0];
    expect(boosted?.powerBonus).toBe(3);
    if (boosted) expect(effectivePower(boosted, resolved.turn)).toBe(8); // 5 + 3
    // The chakra cost was paid on resolution.
    expect(resolved.players.p1.chakra.filter((c) => c.faceUp)).toHaveLength(4);
    expect(resolved.players.p1.leaderUsedThisTurn).toBe(true);
    expect(resolved.log.some((e) => e.key === "log.leaderBoost")).toBe(true);
  });

  it("single non-cancellable option auto-resolves (leader put-back)", () => {
    const state = bareState({ leaderP1: "N-012" });
    state.players.p1.deck = [{ uid: "d1", cardId: "N-004" }];
    state.players.p1.hand = [];
    const next = applyAction(state, { type: "LEADER_EFFECT", player: "p1" });
    // Drew the only deck card; the single hand-card option auto-resolved:
    // the drawn card went straight back on top of the deck.
    expect(next.pendingChoice).toBeNull();
    expect(next.players.p1.hand).toHaveLength(0);
    expect(next.players.p1.deck.map((c) => c.uid)).toEqual(["d1"]);
    expect(next.players.p1.leaderUsedThisTurn).toBe(true);
  });

  it("leader boost is unavailable with no face-up chakra or no targets", () => {
    const noChakra = bareState();
    addCharacter(noChakra, "p1", "N-004");
    noChakra.players.p1.chakra.forEach((c) => {
      c.faceUp = false;
    });
    expect(leaderEffectBlock(noChakra, "p1")).toBe("noChakra");

    const noTargets = bareState();
    expect(leaderEffectBlock(noTargets, "p1")).toBe("noTarget");
  });

  it("multi-option choices wait for RESOLVE_CHOICE and can be cancelled", () => {
    const state = bareState();
    addCharacter(state, "p1", "N-004");
    addCharacter(state, "p2", "N-choji");
    const next = applyAction(state, { type: "LEADER_EFFECT", player: "p1" });
    expect(next.pendingChoice?.effect).toBe("leaderBoost");
    expect(next.pendingChoice?.cancellable).toBe(true);
    expect(next.pendingChoice?.options).toHaveLength(2);
    expect(deciderOf(next)).toBe("p1");

    // Pending choice blocks all other actions.
    const blocked = applyAction(next, { type: "END_TURN", player: "p1" });
    expect(blocked).toBe(next);

    // Cancel: no bonus, no chakra spent, but the action resolves.
    const cancelled = applyAction(next, { type: "RESOLVE_CHOICE", player: "p1", key: null });
    expect(cancelled.pendingChoice).toBeNull();
    expect(cancelled.players.p1.characters[0]?.powerBonus).toBe(0);
    expect(cancelled.players.p1.chakra.filter((c) => c.faceUp)).toHaveLength(5);
    expect(cancelled.log.some((e) => e.key === "log.choiceCancelled")).toBe(true);
  });

  it("resolving a choice with an unknown key is a no-op", () => {
    const state = bareState();
    addCharacter(state, "p1", "N-004");
    addCharacter(state, "p2", "N-choji");
    const next = applyAction(state, { type: "LEADER_EFFECT", player: "p1" });
    expect(applyAction(next, { type: "RESOLVE_CHOICE", player: "p1", key: "nope" })).toBe(next);
    // Wrong player cannot answer.
    const targetKey = next.pendingChoice?.options[0]?.key ?? "";
    expect(applyAction(next, { type: "RESOLVE_CHOICE", player: "p2", key: targetKey })).toBe(next);
  });

  it("N-012 leader effect: draw 1, then put a hand card back on top", () => {
    const state = bareState({ leaderP1: "N-012" });
    state.players.p1.deck = [
      { uid: "d1", cardId: "N-004" },
      { uid: "d2", cardId: "N-006" },
    ];
    state.players.p1.hand = [{ uid: "h1", cardId: "N-007" }];
    const next = applyAction(state, { type: "LEADER_EFFECT", player: "p1" });
    expect(next.players.p1.hand).toHaveLength(2);
    expect(next.pendingChoice?.effect).toBe("leaderPutBack");

    const resolved = applyAction(next, { type: "RESOLVE_CHOICE", player: "p1", key: "h1" });
    expect(resolved.pendingChoice).toBeNull();
    expect(resolved.players.p1.hand.map((c) => c.uid)).toEqual(["d1"]);
    expect(resolved.players.p1.deck.map((c) => c.uid)).toEqual(["h1", "d2"]);
    expect(resolved.players.p1.leaderUsedThisTurn).toBe(true);
  });

  it("EX summon: multi-step exRequirement flow trashes requirements and summons", () => {
    const state = bareState();
    // N-014 needs "1 of your Characters" + "1 of your {The Taka} type Characters".
    const fodder = addCharacter(state, "p1", "N-004"); // red, not Taka
    const bystander = addCharacter(state, "p1", "N-008"); // red, not Taka
    const taka = addCharacter(state, "p1", "N-010"); // The Taka
    const enemy = addCharacter(state, "p2", "N-choji", { rested: true });
    state.players.p1.hand = [{ uid: "ex1", cardId: "N-014" }];

    const started = applyAction(state, { type: "SUMMON", player: "p1", handUid: "ex1" });
    expect(started).not.toBe(state);
    expect(started.pendingChoice?.effect).toBe("exRequirement");
    // The Taka card is not a valid first pick (it is reserved for step 2).
    expect(started.pendingChoice?.options.map((o) => o.key).sort()).toEqual(
      [fodder.uid, bystander.uid].sort(),
    );

    const stepTwo = applyAction(started, {
      type: "RESOLVE_CHOICE",
      player: "p1",
      key: fodder.uid,
    });
    // Step 2 has a single option (the Taka card) -> auto-resolved, EX summoned.
    const trashed = stepTwo.players.p1.trash.map((c) => c.cardId);
    expect(trashed).toContain("N-004");
    expect(trashed).toContain("N-010");
    expect(stepTwo.players.p1.characters.some((c) => c?.cardId === "N-014")).toBe(true);
    expect(stepTwo.players.p1.hand).toHaveLength(0);

    // N-014's own On Summon (KO any 1 character) always asks, even for 1 target.
    expect(stepTwo.pendingChoice?.effect).toBe("koTarget");
    const koed = applyAction(stepTwo, {
      type: "RESOLVE_CHOICE",
      player: "p1",
      key: enemy.uid,
    });
    expect(koed.pendingChoice).toBeNull();
    expect(koed.players.p2.trash.map((c) => c.cardId)).toContain("N-choji");
    void taka;
  });

  it("EX summon is rejected when requirements cannot be met", () => {
    const state = bareState();
    addCharacter(state, "p1", "N-004"); // no {The Taka} character available
    state.players.p1.hand = [{ uid: "ex1", cardId: "N-014" }];
    expect(applyAction(state, { type: "SUMMON", player: "p1", handUid: "ex1" })).toBe(state);
  });

  it("EX summons do not consume the normal per-turn summon", () => {
    const state = bareState();
    addCharacter(state, "p1", "N-004");
    addCharacter(state, "p1", "N-010");
    const enemy = addCharacter(state, "p2", "N-choji");
    state.players.p1.hand = [
      { uid: "ex1", cardId: "N-014" },
      { uid: "h2", cardId: "N-008" },
    ];
    // Both exRequirement steps have a single valid option -> auto-resolve,
    // leaving N-014's On Summon KO choice pending.
    const started = applyAction(state, { type: "SUMMON", player: "p1", handUid: "ex1" });
    expect(started.pendingChoice?.effect).toBe("koTarget");
    const resolved = applyAction(started, {
      type: "RESOLVE_CHOICE",
      player: "p1",
      key: enemy.uid,
    });
    expect(resolved.pendingChoice).toBeNull();
    expect(resolved.players.p1.summonsUsedThisTurn).toBe(0);
    const summoned = applyAction(resolved, { type: "SUMMON", player: "p1", handUid: "h2" });
    expect(summoned.players.p1.characters.some((c) => c?.cardId === "N-008")).toBe(true);
  });

  it("N-013 freeze choice: revealing an Uchiha card freezes the target", () => {
    const state = bareState({ leaderP1: "N-012" });
    state.players.p1.deck = [{ uid: "top", cardId: "N-013" }]; // Uchiha Clan trait
    state.players.p1.hand = [{ uid: "h1", cardId: "N-013" }];
    const enemy = addCharacter(state, "p2", "N-013");
    const summoned = applyAction(state, { type: "SUMMON", player: "p1", handUid: "h1" });
    expect(summoned.pendingChoice?.effect).toBe("freezeTarget");
    // Options: both leaders + all characters.
    const enemyOption = summoned.pendingChoice?.options.find((o) => o.key === enemy.uid);
    expect(enemyOption).toBeDefined();
    const resolved = applyAction(summoned, {
      type: "RESOLVE_CHOICE",
      player: "p1",
      key: enemy.uid,
    });
    expect(resolved.pendingChoice).toBeNull();
    const frozen = resolved.players.p2.characters.find((c) => c?.uid === enemy.uid);
    expect(frozen?.cannotAttackUntilTurn).toBe(resolved.turn + 1);
  });
});
