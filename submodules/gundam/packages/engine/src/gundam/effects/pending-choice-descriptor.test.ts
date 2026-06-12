/**
 * PR F.1 — Pending-choice descriptor (player-choice UX projection surface).
 *
 * Covers `buildPendingChoicePrompt` and the `GundamBoardView.pendingChoice`
 * wire-up. No move-input changes yet; these tests only exercise the
 * inspection API.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO, createMockUnit } from "../../index.ts";
import type { PendingEffect } from "../types.ts";

const restOpponentUnitEffect: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [
    {
      action: {
        action: "rest",
        target: { owner: "opponent", cardType: "unit", count: 1 },
      },
    },
  ],
  sourceText: "Rest 1 enemy unit.",
};

const optionalDrawEffect: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [{ action: { action: "draw", count: 1 }, optional: true }],
  sourceText: "You may draw 1.",
};

const deckLookEffect: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [
    {
      action: {
        action: "lookAtTopDeck",
        count: 2,
        return: "chooseTop",
        remainingDestination: "trash",
      },
    },
  ],
  sourceText: "Look at the top 2. Return 1 to the top.",
};

const optionalDeckLookEffect: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [
    { action: { action: "discard", count: 1 }, optional: true },
    {
      action: {
        action: "lookAtTopDeck",
        count: 2,
        return: "chooseTop",
        remainingDestination: "trash",
      },
      dependsOnPrevious: true,
    },
  ],
  sourceText: "You may discard 1. If you do, look at the top 2.",
};

let peIdCounter = 0;
function makePending(
  overrides: Partial<PendingEffect> & Pick<PendingEffect, "effect" | "controllerId">,
): PendingEffect {
  return {
    id: overrides.id ?? `pct_${++peIdCounter}`,
    sourceCardId: overrides.sourceCardId ?? "unused",
    effectIndex: overrides.effectIndex ?? 0,
    kind: overrides.kind ?? "activated",
    ...overrides,
  };
}

describe("Pending choice — descriptor (PR F.1)", () => {
  it("returns undefined when the queue is empty", () => {
    const engine = GundamTestEngine.create({}, {});
    expect(engine.getPendingChoice()).toBeUndefined();
  });

  it("emits a targetSelection prompt for an activated effect waiting on opponent-target", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    engine.getG().pendingEffects.push(
      makePending({
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        sourceCardId: "src",
        kind: "activated",
      }),
    );

    const choice = engine.getPendingChoice();
    expect(choice?.kind).toBe("targetSelection");
    if (choice?.kind !== "targetSelection") return;

    expect(choice.controllerId).toBe(PLAYER_ONE);
    expect(choice.sourceCardId).toBe("src");
    expect(choice.directiveIndex).toBe(0);
    expect(choice.minTargets).toBe(1);
    expect(choice.maxTargets).toBe(1);
    expect(choice.legalTargetIds).toContain(enemyId);
    // Friendly units must not be listed for an owner: "opponent" filter.
    const myUnitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    expect(choice.legalTargetIds).not.toContain(myUnitId);
    expect(choice.prompt).toBe("Rest 1 enemy unit.");
  });

  it("emits an optional prompt for an activated effect with a 'you may' directive", () => {
    const engine = GundamTestEngine.create({ deck: 3 }, {});
    engine.getG().pendingEffects.push(
      makePending({
        effect: optionalDrawEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    const choice = engine.getPendingChoice();
    expect(choice?.kind).toBe("optional");
    if (choice?.kind !== "optional") return;

    expect(choice.controllerId).toBe(PLAYER_ONE);
    expect(choice.directiveIndex).toBe(0);
    expect(choice.prompt).toBe("You may draw 1.");
  });

  it("emits a deckLook prompt with the revealed top-deck ids", () => {
    const top = createMockUnit({ name: "Top" });
    const second = createMockUnit({ name: "Second" });
    const engine = GundamTestEngine.create({ deck: [top, second] }, {});
    const revealed = engine.asPlayer(PLAYER_ONE).getCardsInZone("deck").slice(0, 2);

    engine.getG().pendingEffects.push(
      makePending({
        effect: deckLookEffect,
        controllerId: PLAYER_ONE,
        sourceCardId: "src",
        kind: "activated",
      }),
    );

    const choice = engine.getPendingChoice();
    expect(choice?.kind).toBe("deckLook");
    if (choice?.kind !== "deckLook") return;

    expect(choice.directiveIndex).toBe(0);
    expect(choice.revealedCardIds).toEqual(revealed);
    expect(choice.returnMode).toBe("chooseTop");
    expect(choice.remainingDestination).toBe("trash");
    expect(choice.tutorDestination).toBe("hand");
  });

  it("emits a deckLook prompt for an optional-gated look rider", () => {
    const top = createMockUnit({ name: "Top" });
    const second = createMockUnit({ name: "Second" });
    const engine = GundamTestEngine.create({ deck: [top, second] }, {});

    engine.getG().pendingEffects.push(
      makePending({
        effect: optionalDeckLookEffect,
        controllerId: PLAYER_ONE,
        sourceCardId: "src",
        kind: "activated",
      }),
    );

    const choice = engine.getPendingChoice();
    expect(choice?.kind).toBe("deckLook");
    if (choice?.kind !== "deckLook") return;

    expect(choice.directiveIndex).toBe(1);
    expect(choice.acceptOptionalDirectiveIndex).toBe(0);
  });

  it("returns undefined when the priority head is a triggered effect that auto-picks", () => {
    const drawOne: CardEffect = {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "Draw 1.",
    };
    const engine = GundamTestEngine.create({ deck: 3 }, {});
    engine
      .getG()
      .pendingEffects.push(
        makePending({ effect: drawOne, controllerId: PLAYER_ONE, kind: "triggered" }),
      );
    // Triggered without a target filter — auto-drains; nothing to ask.
    expect(engine.getPendingChoice()).toBeUndefined();
  });

  it("ranged count maps to minTargets / maxTargets correctly", () => {
    const rangedRest: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: { min: 1, max: 2 },
            },
          },
        },
      ],
      sourceText: "Rest up to 2 enemy units.",
    };
    const a = createMockUnit({ ap: 1, hp: 1 });
    const b = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({}, { play: [a, b] });
    engine
      .getG()
      .pendingEffects.push(
        makePending({ effect: rangedRest, controllerId: PLAYER_ONE, kind: "activated" }),
      );

    const choice = engine.getPendingChoice();
    if (choice?.kind !== "targetSelection") throw new Error("expected targetSelection");
    expect(choice.minTargets).toBe(1);
    expect(choice.maxTargets).toBe(2);
    expect(choice.legalTargetIds).toHaveLength(2);
  });

  it("board view surfaces the same descriptor via pendingChoice", () => {
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({}, { play: [enemy] });
    engine.getG().pendingEffects.push(
      makePending({
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    const view = engine.getRuntime().getBoardView({ role: "judge" });
    expect(view.pendingChoice?.kind).toBe("targetSelection");
    expect(view.pendingEffectCount).toBe(1);
  });
});

describe("Pending choice — role-scoped visibility", () => {
  it("only surfaces the descriptor to the controller, judge — not opponent or spectator", () => {
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({}, { play: [enemy] });
    engine.getG().pendingEffects.push(
      makePending({
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    const runtime = engine.getRuntime();

    // Controller sees full descriptor.
    const ctrlView = runtime.getBoardView({ role: "player", playerId: PLAYER_ONE as never });
    expect(ctrlView.pendingChoice?.kind).toBe("targetSelection");

    // Opponent does not — pendingEffectCount still tells them something is pending.
    const oppView = runtime.getBoardView({ role: "player", playerId: PLAYER_TWO as never });
    expect(oppView.pendingChoice).toBeUndefined();
    expect(oppView.pendingEffectCount).toBe(1);

    // Spectators are blanket-redacted.
    const specView = runtime.getBoardView({ role: "spectator" });
    expect(specView.pendingChoice).toBeUndefined();

    // Judge sees full descriptor.
    expect(runtime.getBoardView({ role: "judge" }).pendingChoice?.kind).toBe("targetSelection");
  });
});

describe("Pending choice — conditional directives", () => {
  it("recurses into a conditional then-branch to surface a nested 'you may'", () => {
    const conditionalOptional: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      directives: [
        {
          condition: { type: "unitCount", owner: "friendly", comparison: "gte", count: 1 },
          thenDirectives: [{ action: { action: "draw", count: 1 }, optional: true }],
        },
      ],
      sourceText: "If you have a friendly unit, you may draw 1.",
    };
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, {});
    engine
      .getG()
      .pendingEffects.push(
        makePending({ effect: conditionalOptional, controllerId: PLAYER_ONE, kind: "activated" }),
      );

    const choice = engine.getPendingChoice();
    expect(choice?.kind).toBe("optional");
    if (choice?.kind !== "optional") return;
    // directiveIndex points at the enclosing conditional (top-level index 0).
    expect(choice.directiveIndex).toBe(0);
  });

  it("recurses into a conditional else-branch to surface a counted target filter", () => {
    const conditionalTargeted: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      directives: [
        {
          condition: { type: "unitCount", owner: "friendly", comparison: "gte", count: 99 },
          thenDirectives: [{ action: { action: "draw", count: 1 } }],
          elseDirectives: [
            {
              action: {
                action: "rest",
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
        },
      ],
      sourceText: "Conditional rest.",
    };
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({}, { play: [enemy] });
    engine
      .getG()
      .pendingEffects.push(
        makePending({ effect: conditionalTargeted, controllerId: PLAYER_ONE, kind: "activated" }),
      );

    const choice = engine.getPendingChoice();
    expect(choice?.kind).toBe("targetSelection");
    if (choice?.kind !== "targetSelection") return;
    expect(choice.legalTargetIds).toHaveLength(1);
  });
});
