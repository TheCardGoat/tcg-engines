/**
 * Characterization of legacy stop points plus the intent-verb contract.
 */
import { describe, expect, it } from "vite-plus/test";
import { defineFleshAndBloodCard } from "@tcg/flesh-and-blood-types";
import {
  describeFabDecision,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  forcedFabDecisionAnswer,
  readFabWaitState,
} from "./index.ts";
import type { FabDecision } from "../rules/process.ts";
import {
  bravo,
  dash,
  dawnblade,
  nimblismBlue,
  sinkBelowRed,
  snatchRed,
} from "../rules/fixtures.ts";

// Synthetic minimal attack whose only play-time mechanic is the opt keyword:
// isolates the begin-play Opt partition for the explicit-drive contract tests.
const optAttackRed = defineFleshAndBloodCard({
  canonicalId: "test:opt-attack-red",
  slug: "opt-attack-red",
  types: ["Action", "Attack"],
  color: "Red",
  pitch: "1",
  cost: 0,
  power: 3,
  defense: 3,
  keywords: [{ name: "opt", value: 1 }],
});

describe("legacy harness stop points (characterization)", () => {
  it("attackWith advances to Defend and auto-declines on-attack optionals", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
    );
    game.as(bravo).attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    expect(
      game.waitState().kind === "defense-declaration" || game.combat()?.step === "defend",
    ).toBe(true);
  });

  it("activate of a weapon under FAB_MANUAL_HARNESS does not land on Defend", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], weapon1: [dawnblade], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).activate(dawnblade);
    expect(game.combat()?.step).not.toBe("defend");
  });

  it("resolveUntilIdle closes combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith();
    game.helpers.resolveUntilIdle();
    expect(game.combat()).toBeNull();
    expectCombat(game).toBeClosed();
  });
});

describe("intent verbs", () => {
  it("playAttack stops at Defend without closing combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
    );
    game.as(bravo).playAttack(snatchRed);
    expectCombat(game).toBeOpen().toBeAtStep("defend");
    expect(game.combat()).not.toBeNull();
  });

  it("activateAttack lands a weapon on Defend", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], weapon1: [dawnblade], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    game.as(bravo).activateAttack(dawnblade);
    expectCombat(game).toBeAtStep("defend");
  });

  it("defendWith rest args apply every card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const copies = Dash.cardsIn("hand", nimblismBlue);
    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(copies[0]!, copies[1]!);
    expectFabCard(Dash, copies[0]!).toBeIn("combatChain");
    expectFabCard(Dash, copies[1]!).toBeIn("combatChain");
  });

  it("closeCombat finishes an open link", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.playAttack(snatchRed);
    Dash.defendWith();
    game.closeCombat();
    expectCombat(game).toBeClosed();
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("omitted hand still seats DEFAULT_HAND (4 cards)", () => {
    const game = FabTestEngine.start({ hero: bravo, deck: 6 }, { hero: dash, deck: 6 });
    expectFabPlayer(game.as(bravo)).toHaveHandCount(4);
    expectFabPlayer(game.as(dash)).toHaveHandCount(4);
  });

  it("hand: [] opts out of DEFAULT_HAND", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    expectFabPlayer(game.as(bravo)).toHaveHandCount(0);
  });

  it("hand: filler seats the legacy dummy hand", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: "filler", deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    expectFabPlayer(game.as(bravo)).toHaveHandCount(4);
  });

  it("deckTop places the last card on top", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], deck: 2, deckTop: [snatchRed] },
      { hero: dash, hand: [], deck: 6 },
    );
    expect(game.as(bravo).zone("deck").at(-1)).toBe(snatchRed.canonicalId);
  });

  it("playAttack with stopAt on-attack returns before Defend when a decision is pending", () => {
    // advanceUntil({ stopAt: "on-attack" }) must NOT auto-answer a non-forced
    // decision: it returns immediately so the test can decline/choose/target.
    // We assert the contract by checking that a card with no on-attack optional
    // still stops cleanly at Defend (the on-attack stop also matches Defend),
    // while the unit suite below proves a non-forced decision is left pending.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    game.as(bravo).playAttack(snatchRed, { stopAt: "on-attack" });
    expectCombat(game).toBeAtStep("defend");
  });

  it("toReaction('defender') gives the defender reaction priority for a DR", () => {
    // Manual harness: default auto-pass would close combat through the empty
    // reaction window before Dash could fire sinkBelow (see playbook §7.2).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [sinkBelowRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.playAttack(snatchRed);
    game.toReaction("defender");
    expectCombat(game).toBeAtStep("reaction");
    expect(Dash.hasPriority()).toBe(true);
    Dash.play(sinkBelowRed);
    // The DR layer resolves onto the active link (manual harness keeps combat open).
    for (let i = 0; i < 4 && game.getState().rulesStack.length; i += 1) game.passBoth();
    expectFabCard(Dash, sinkBelowRed).toBeIn("combatChain");
  });
});

describe("intent verbs reject missing decisions", () => {
  it("decision verbs and named target intent throw when no matching decision is pending", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    expect(() => Bravo.decline()).toThrow();
    expect(() => Bravo.accept()).toThrow();
    expect(() => Bravo.choose("pay")).toThrow();
    expect(Bravo.target(game.as(dash))).toBeUndefined();
    expect(() => Bravo.targetRequired(game.as(dash))).toThrow(/pending entity-target decision/);
    expect(Bravo.target()).toBeUndefined();
  });

  it("playAttack leaves a non-forced Opt partition pending instead of silently defaulting it", () => {
    // The opt keyword on begin-play is a non-forced partition. Explicit drive
    // must surface it for the test to answer (playAttack then throws "requires
    // an explicit answer"), never silently keep every looked card on top.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [optAttackRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    expect(() => game.as(bravo).playAttack(optAttackRed)).toThrow(
      /requires an explicit answer for partition/,
    );
    expect(game.getState().decision?.kind).toBe("partition");
  });
});

// Unit-level proof of the drain's "mathematically unique answer" detection:
// advanceUntil relies on this to auto-resolve only forced decisions and to
// leave every other prompt for the test to name explicitly. Constructed from
// template-literal ids so no `as`/`any` is needed.
const baseDecision = {
  decisionId: "decision-1",
  stateVersion: 1,
  actorId: "bravo",
  label: "test decision",
  continuation: {
    kind: "replacement-player" as const,
    processId: "process-1",
    playerId: "bravo",
  },
} as const;

describe("forcedFabDecisionAnswer (unit)", () => {
  it("answers a forced entity-target (min = max = candidates)", () => {
    const d: FabDecision = {
      ...baseDecision,
      kind: "entity-target",
      min: 2,
      max: 2,
      candidates: [
        {
          instanceId: "a",
          label: "A",
          target: { kind: "object", ref: { instanceId: "a", incarnation: 1 } },
        },
        {
          instanceId: "b",
          label: "B",
          target: { kind: "object", ref: { instanceId: "b", incarnation: 1 } },
        },
      ],
    };
    expect(forcedFabDecisionAnswer(d)).toEqual({
      kind: "entity-target",
      instanceIds: ["a", "b"],
    });
  });

  it("returns null for a non-forced entity-target", () => {
    const d: FabDecision = {
      ...baseDecision,
      kind: "entity-target",
      min: 1,
      max: 1,
      candidates: [
        {
          instanceId: "a",
          label: "A",
          target: { kind: "object", ref: { instanceId: "a", incarnation: 1 } },
        },
        {
          instanceId: "b",
          label: "B",
          target: { kind: "object", ref: { instanceId: "b", incarnation: 1 } },
        },
      ],
    };
    expect(forcedFabDecisionAnswer(d)).toBeNull();
  });

  it("answers a forced option (min = max = options) but not trigger order", () => {
    expect(
      forcedFabDecisionAnswer({
        ...baseDecision,
        kind: "option",
        min: 2,
        max: 2,
        options: [
          { id: "x", label: "X" },
          { id: "y", label: "Y" },
        ],
      }),
    ).toEqual({ kind: "option", optionIds: ["x", "y"] });
    // Trigger order (options > max) is intentionally NOT forced.
    expect(
      forcedFabDecisionAnswer({
        ...baseDecision,
        kind: "option",
        min: 1,
        max: 1,
        options: [
          { id: "x", label: "X" },
          { id: "y", label: "Y" },
        ],
      }),
    ).toBeNull();
  });

  it("answers a forced numeric, null otherwise", () => {
    expect(forcedFabDecisionAnswer({ ...baseDecision, kind: "numeric", min: 3, max: 3 })).toEqual({
      kind: "numeric",
      value: 3,
    });
    expect(
      forcedFabDecisionAnswer({ ...baseDecision, kind: "numeric", min: 1, max: 3 }),
    ).toBeNull();
    expect(
      forcedFabDecisionAnswer({
        ...baseDecision,
        kind: "numeric",
        min: 0,
        max: 0,
        requiresExplicitAnswer: true,
      }),
    ).toBeNull();
  });

  it("answers ordering only with ≤1 entry", () => {
    expect(
      forcedFabDecisionAnswer({
        ...baseDecision,
        kind: "ordering",
        entries: [{ id: "only", label: "Only" }],
      }),
    ).toEqual({ kind: "ordering", orderedIds: ["only"] });
    expect(
      forcedFabDecisionAnswer({
        ...baseDecision,
        kind: "ordering",
        entries: [
          { id: "a", label: "A" },
          { id: "b", label: "B" },
        ],
      }),
    ).toBeNull();
  });

  it("answers effect-resolution only with one option", () => {
    expect(
      forcedFabDecisionAnswer({
        ...baseDecision,
        kind: "effect-resolution",
        options: [{ id: "resolve", label: "Resolve" }],
      }),
    ).toEqual({ kind: "effect-resolution", optionId: "resolve" });
    expect(
      forcedFabDecisionAnswer({
        ...baseDecision,
        kind: "effect-resolution",
        options: [
          { id: "a", label: "A" },
          { id: "b", label: "B" },
        ],
      }),
    ).toBeNull();
  });

  it("never auto-answers boolean / payment / partition / group-choice", () => {
    expect(
      forcedFabDecisionAnswer({
        ...baseDecision,
        kind: "boolean",
        acceptLabel: "Pay",
        declineLabel: "Decline",
      }),
    ).toBeNull();
    expect(
      forcedFabDecisionAnswer({
        ...baseDecision,
        kind: "payment",
        amount: 1,
        oneAtATime: false,
        cancellable: true,
        candidates: [{ instanceId: "c", value: 1 }],
      }),
    ).toBeNull();
    expect(
      forcedFabDecisionAnswer({
        ...baseDecision,
        kind: "partition",
        entries: [{ id: "e", label: "E" }],
        groups: [{ id: "g", label: "G" }],
      }),
    ).toBeNull();
    expect(
      forcedFabDecisionAnswer({
        ...baseDecision,
        kind: "group-choice",
        entries: [{ id: "e", label: "E" }],
        cohorts: [{ id: "c", label: "C", entryIds: ["e"] }],
      }),
    ).toBeNull();
  });

  it("describeFabDecision names the kind and actor", () => {
    expect(
      describeFabDecision({
        ...baseDecision,
        kind: "boolean",
        acceptLabel: "Pay",
        declineLabel: "Decline",
      }),
    ).toContain("boolean");
    expect(
      describeFabDecision({
        ...baseDecision,
        kind: "entity-target",
        min: 1,
        max: 1,
        candidates: [
          {
            instanceId: "a",
            label: "A",
            target: { kind: "object", ref: { instanceId: "a", incarnation: 1 } },
          },
        ],
      }),
    ).toContain("entity-target");
  });
});

describe("readFabWaitState", () => {
  it("reports defense-declaration after playAttack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    game.as(bravo).playAttack(snatchRed);
    const wait = readFabWaitState(game.getState());
    expect(
      wait.kind === "defense-declaration" ||
        (wait.kind === "priority" && wait.combatStep === "defend"),
    ).toBe(true);
  });
});

describe("expectFabToken", () => {
  it("counts zero created tokens on a fresh table", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    expectFabToken(game, "gold").toHaveCount(0);
    expectFabPlayer(game.as(bravo)).toHaveTokenCount("gold", 0);
  });
});

describe("expectFabCard.toHaveColor", () => {
  it("reads evaluated color of a real seated card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimblismBlue], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    expectFabCard(game.as(bravo), nimblismBlue).toHaveColor("Blue");
  });
});
