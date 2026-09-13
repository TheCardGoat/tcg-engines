import { describe, expect, it } from "vitest";
import { getAllCards } from "@tcg-engines/naruto-cards";

import {
  characterAttackBlock,
  effectivePower,
  EX_REQUIREMENTS_BY_CARD_ID,
  exRequirements,
  hasRush,
  leaderAttackBlock,
} from "../src/queries";
import { applyAction } from "../src/reducer";
import { SUPPORT_EFFECTS, supportEffectOf } from "../src/support-effects";
import { addCharacter, bareState } from "./helpers";

describe("deck-out", () => {
  it("drawing from an empty deck loses the game", () => {
    const state = bareState();
    state.players.p2.deck = [];
    const next = applyAction(state, { type: "END_TURN", player: "p1" });
    // p2's turn starts, they must draw 2 from an empty deck.
    expect(next.activePlayer).toBe("p2");
    expect(next.winner).toBe("p1");
    expect(next.log.some((e) => e.key === "log.deckOut")).toBe(true);
  });

  it("N-012's mandatory draw loses through the shared draw path", () => {
    const state = bareState({ leaderP1: "N-012" });
    state.players.p1.deck = [];

    const next = applyAction(state, { type: "LEADER_EFFECT", player: "p1" });

    expect(next).not.toBe(state);
    expect(next.winner).toBe("p2");
    expect(next.pendingChoice).toBeNull();
    expect(next.log.some((entry) => entry.key === "log.deckOut")).toBe(true);
  });
});

describe("Summon Card", () => {
  it("has reviewed requirements for every EX character in the catalog", () => {
    const exCharacterIds = getAllCards()
      .filter((card) => card.cardType === "ex_character")
      .map((card) => card.id)
      .sort();

    expect(Object.keys(EX_REQUIREMENTS_BY_CARD_ID).sort()).toEqual(exCharacterIds);
  });

  it("rests after a normal deployment and cannot deploy a second Character that turn", () => {
    const state = bareState();
    state.players.p1.hand = [
      { uid: "first", cardId: "N-004" },
      { uid: "second", cardId: "N-006" },
    ];

    const first = applyAction(state, { type: "SUMMON", player: "p1", handUid: "first" });
    const second = applyAction(first, { type: "SUMMON", player: "p1", handUid: "second" });

    expect(first.players.p1.summon.rested).toBe(true);
    expect(second).toBe(first);
    expect(first.players.p1.hand.map((card) => card.uid)).toEqual(["second"]);
  });
});

describe("support effects", () => {
  it("uses an explicit reviewed registry instead of executable card text", () => {
    const supportCardIds = getAllCards()
      .filter((card) => card.support !== null)
      .map((card) => card.id)
      .sort();

    expect(Object.keys(SUPPORT_EFFECTS).sort()).toEqual(supportCardIds);
    expect(supportEffectOf("N-004")).toEqual({ timing: "main", koAll: true });
    expect(supportEffectOf("unreviewed-support")).toBeUndefined();
  });

  it("board wipe KOs all characters but respects support immunity", () => {
    const state = bareState();
    addCharacter(state, "p1", "N-004");
    addCharacter(state, "p2", "N-010");
    const immune = addCharacter(state, "p2", "N-choji");
    // N-021 (Quick): tag a character with support immunity, summon this card.
    state.players.p1.supports[0] = { uid: "s1", cardId: "N-021" };
    // N-004 (During Your Main): K.O. all Characters.
    state.players.p1.supports[1] = { uid: "s2", cardId: "N-004" };

    const tagged = applyAction(state, { type: "ACTIVATE_SUPPORT", player: "p1", slot: 0 });
    expect(tagged.pendingChoice?.effect).toBe("supportImmune");
    const immunized = applyAction(tagged, {
      type: "RESOLVE_CHOICE",
      player: "p1",
      key: immune.uid,
    });
    expect(immunized.pendingChoice).toBeNull();
    // The tagged character is immune; N-021 itself was summoned as a character.
    const protectedCharacter = immunized.players.p2.characters.find((c) => c?.uid === immune.uid);
    expect(protectedCharacter?.supportImmuneUntilTurn).toBe(immunized.turn);
    expect(immunized.players.p1.characters.some((c) => c?.cardId === "N-021")).toBe(true);

    const wiped = applyAction(immunized, { type: "ACTIVATE_SUPPORT", player: "p1", slot: 1 });
    // Everything else on both boards was KO'd...
    expect(wiped.players.p1.characters.every((c) => c === null)).toBe(true);
    const p2Board = wiped.players.p2.characters.filter((c) => c !== null);
    expect(p2Board.map((c) => c.uid)).toEqual([immune.uid]);
    // ...including p1's own N-021 (immunity only works vs the opponent).
    const p1Trash = wiped.players.p1.trash.map((c) => c.cardId);
    expect(p1Trash).toContain("N-004"); // wiped character
    expect(p1Trash).toContain("N-021"); // wiped summoned support
    expect(p1Trash).toContain("N-004"); // the wipe support itself
    expect(wiped.players.p2.trash.map((c) => c.cardId)).toContain("N-010");
  });

  it("power doubling lasts until end of turn; END_TURN wipes bonuses", () => {
    const state = bareState();
    const target = addCharacter(state, "p1", "N-004"); // power 5
    target.powerBonus = 3; // some earlier boost: effective 8
    state.players.p1.supports[0] = { uid: "s1", cardId: "N-choji" }; // Quick: double power

    const activated = applyAction(state, { type: "ACTIVATE_SUPPORT", player: "p1", slot: 0 });
    // Single target -> the doublePower choice auto-resolved.
    expect(activated.pendingChoice).toBeNull();
    const doubled = activated.players.p1.characters.find((c) => c?.uid === target.uid);
    expect(doubled?.powerDoubledUntilTurn).toBe(activated.turn);
    if (doubled) expect(effectivePower(doubled, activated.turn)).toBe(16); // (5 + 3) * 2
    // The support card itself entered play as a character.
    expect(activated.players.p1.characters.some((c) => c?.cardId === "N-choji")).toBe(true);

    const nextTurn = applyAction(activated, { type: "END_TURN", player: "p1" });
    expect(nextTurn.turn).toBe(activated.turn + 1);
    const after = nextTurn.players.p1.characters.find((c) => c?.uid === target.uid);
    expect(after?.powerBonus).toBe(0); // bonuses wiped
    if (after) expect(effectivePower(after, nextTurn.turn)).toBe(5); // doubling expired
  });

  it("bounce returns the chosen character to its owner's hand", () => {
    const state = bareState();
    const attacker = addCharacter(state, "p1", "N-004");
    const bystander = addCharacter(state, "p1", "N-006");
    // N-sakura (During Your Opponent's Attack): return chosen card to owner's hand.
    state.players.p2.supports[0] = { uid: "s1", cardId: "N-sakura" };

    const declared = applyAction(state, {
      type: "DECLARE_ATTACK",
      player: "p1",
      attackerUid: attacker.uid,
      attackerKind: "character",
      targetKind: "leader",
      targetUid: "leader:p2",
    });
    const activated = applyAction(declared, {
      type: "ACTIVATE_SUPPORT",
      player: "p2",
      slot: 0,
    });
    expect(activated.pendingChoice?.effect).toBe("bounceTarget");
    expect(activated.pendingChoice?.player).toBe("p2");
    expect(activated.pendingChoice?.options.map((o) => o.key).sort()).toEqual(
      [attacker.uid, bystander.uid].sort(),
    );

    const resolved = applyAction(activated, {
      type: "RESOLVE_CHOICE",
      player: "p2",
      key: attacker.uid,
    });
    expect(resolved.pendingChoice).toBeNull();
    // The attacker went back to p1's hand; the attack fizzled (no attacker).
    expect(resolved.players.p1.hand.map((c) => c.cardId)).toContain("N-004");
    expect(resolved.players.p1.characters.filter((c) => c !== null).map((c) => c.uid)).toEqual([
      bystander.uid,
    ]);
    expect(resolved.players.p2.life).toBe(15);
    // The support was consumed to the trash; the attack window closed.
    expect(resolved.players.p2.trash.map((c) => c.cardId)).toContain("N-sakura");
    expect(resolved.pendingAttack).toBeNull();
    expect(resolved.step).toBe("normal");
  });
});

describe("character effects", () => {
  it("N-014's Character On Summon KO bypasses Support-only immunity", () => {
    const state = bareState({ leaderP1: "N-012" });
    const protectedCharacter = addCharacter(state, "p2", "N-010");
    // Apply N-021's actual Support effect first, rather than synthesizing the
    // immunity field, so the regression covers its player-visible source.
    state.players.p1.supports[0] = { uid: "immune-support", cardId: "N-021" };
    const immunized = applyAction(state, { type: "ACTIVATE_SUPPORT", player: "p1", slot: 0 });
    expect(
      immunized.players.p2.characters.find((character) => character?.uid === protectedCharacter.uid)
        ?.supportImmuneUntilTurn,
    ).toBe(immunized.turn);

    const fodder = addCharacter(immunized, "p1", "N-013");
    const taka = addCharacter(immunized, "p1", "N-010");
    immunized.players.p1.hand = [{ uid: "sasuke-ex", cardId: "N-014" }];
    const exStarted = applyAction(immunized, {
      type: "SUMMON",
      player: "p1",
      handUid: "sasuke-ex",
    });
    const firstRequirement = applyAction(exStarted, {
      type: "RESOLVE_CHOICE",
      player: "p1",
      key: fodder.uid,
    });
    const summoned = applyAction(firstRequirement, {
      type: "RESOLVE_CHOICE",
      player: "p1",
      key: taka.uid,
    });
    expect(summoned.pendingChoice?.effect).toBe("koTarget");
    expect(summoned.pendingChoice?.sourceKind).toBe("character");

    const koed = applyAction(summoned, {
      type: "RESOLVE_CHOICE",
      player: "p1",
      key: protectedCharacter.uid,
    });
    expect(
      koed.players.p2.characters.some((character) => character?.uid === protectedCharacter.uid),
    ).toBe(false);
    expect(koed.players.p2.trash.map((card) => card.uid)).toContain(protectedCharacter.uid);
  });

  it("N-005 revives a bracket-named character from the trash", () => {
    const state = bareState();
    const fodder = addCharacter(state, "p1", "N-004"); // Naruto Uzumaki, power 5
    fodder.powerBonus = 5; // effective 10: meets N-005's summon requirement
    state.players.p1.trash = [{ uid: "t1", cardId: "N-007" }]; // Minato Namikaze
    state.players.p1.hand = [{ uid: "ex1", cardId: "N-005" }]; // Gamabunta (EX)

    const started = applyAction(state, { type: "SUMMON", player: "p1", handUid: "ex1" });
    // The single requirement candidate auto-paid; N-005 hit the board and its
    // On Summon offered the trash revival choice (Minato + the just-trashed Naruto).
    expect(started.pendingChoice?.effect).toBe("reviveFromTrash");
    expect(started.pendingChoice?.options.map((o) => o.key).sort()).toEqual(
      ["t1", fodder.uid].sort(),
    );
    expect(started.players.p1.characters.some((c) => c?.cardId === "N-005")).toBe(true);

    const revived = applyAction(started, {
      type: "RESOLVE_CHOICE",
      player: "p1",
      key: "t1",
    });
    expect(revived.pendingChoice).toBeNull();
    expect(revived.players.p1.characters.some((c) => c?.cardId === "N-007")).toBe(true);
    expect(revived.players.p1.trash.map((c) => c.uid)).toEqual([fodder.uid]);
    expect(revived.log.some((e) => e.key === "log.summonFromTrash")).toBe(true);
  });

  it("conditional Rush (N-007 at 10+ power) allows attacking the summon turn", () => {
    const state = bareState(); // turn 3
    const minato = addCharacter(state, "p1", "N-007", { summonedOnTurn: state.turn }); // power 8
    expect(hasRush(minato, state.turn)).toBe(false);
    expect(characterAttackBlock(state, "p1", minato.uid)).toBe("summoningSickness");

    minato.powerBonus = 2; // effective 10 -> gains [Rush]
    expect(hasRush(minato, state.turn)).toBe(true);
    expect(characterAttackBlock(state, "p1", minato.uid)).toBeNull();
  });

  it("keeps reviewed Rush and EX requirements keyed by card id", () => {
    const state = bareState();
    const sasuke = addCharacter(state, "p1", "N-014", { summonedOnTurn: state.turn });

    expect(hasRush(sasuke, state.turn)).toBe(true);
    expect(exRequirements("N-005")).toEqual([{ minPower: 10 }]);
    expect(exRequirements("N-014")).toEqual([{}, { trait: "The Taka" }]);
    expect(exRequirements("N-022")).toEqual([{}]);
    expect(exRequirements("N-naruto-ex")).toEqual([{}, { minPower: 10 }]);
    expect(exRequirements("unknown-card")).toEqual([]);
  });

  it("N-013 freezing a LEADER sets leaderCannotAttackUntilTurn and blocks with 'frozen'", () => {
    const state = bareState({ leaderP1: "N-012" });
    state.players.p1.deck = [{ uid: "top", cardId: "N-013" }]; // Uchiha Clan trait
    state.players.p1.hand = [{ uid: "h1", cardId: "N-013" }];

    const summoned = applyAction(state, { type: "SUMMON", player: "p1", handUid: "h1" });
    expect(summoned.pendingChoice?.effect).toBe("freezeTarget");
    const leaderOption = summoned.pendingChoice?.options.find(
      (o) => o.zone === "leader" && o.owner === "p2",
    );
    expect(leaderOption).toBeDefined();

    const resolved = applyAction(summoned, {
      type: "RESOLVE_CHOICE",
      player: "p1",
      key: leaderOption?.key ?? "",
    });
    expect(resolved.pendingChoice).toBeNull();
    expect(resolved.players.p2.leaderCannotAttackUntilTurn).toBe(resolved.turn + 1);
    expect(resolved.log.some((e) => e.key === "log.frozen")).toBe(true);

    // On p2's upcoming turn context (same turn number window), the leader is frozen.
    resolved.activePlayer = "p2";
    expect(leaderAttackBlock(resolved, "p2")).toBe("frozen");
  });

  it("N-013 freeze fizzles when the revealed card is not Uchiha Clan", () => {
    const state = bareState({ leaderP1: "N-012" });
    state.players.p1.deck = [{ uid: "top", cardId: "N-004" }]; // red, no Uchiha Clan trait
    state.players.p1.hand = [{ uid: "h1", cardId: "N-013" }];
    const enemy = addCharacter(state, "p2", "N-choji");

    const summoned = applyAction(state, { type: "SUMMON", player: "p1", handUid: "h1" });
    const resolved = applyAction(summoned, {
      type: "RESOLVE_CHOICE",
      player: "p1",
      key: enemy.uid,
    });
    const target = resolved.players.p2.characters.find((c) => c?.uid === enemy.uid);
    expect(target?.cannotAttackUntilTurn).toBe(0);
    expect(resolved.log.some((e) => e.key === "log.revealNoMatch")).toBe(true);
  });
});
