/**
 * PR F.1 — Pending-choice descriptor (player-choice UX projection surface).
 *
 * Covers `buildPendingChoicePrompt` and the `GundamBoardView.pendingChoice`
 * wire-up consumed by player-facing clients.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
  requiresPlayerChoice,
} from "../../index.ts";
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

  it("preserves independent constraints for a choose-one-A-and-one-B effect", () => {
    const groupedChoiceEffect: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      directives: [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "group a" }],
            },
          },
        },
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "group b" }],
            },
          },
        },
      ],
      sourceText: "Choose 1 Group A card and 1 Group B card from trash.",
    };
    const groupA1 = createMockUnit({ name: "Group A 1", traits: ["group a"] });
    const groupA2 = createMockUnit({ name: "Group A 2", traits: ["group a"] });
    const groupB = createMockUnit({ name: "Group B", traits: ["group b"] });
    const engine = GundamTestEngine.create({ trash: [groupA1, groupA2, groupB] });
    const [groupA1Id, groupA2Id, groupBId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("trash");
    engine.getG().pendingEffects.push(
      makePending({
        effect: groupedChoiceEffect,
        controllerId: PLAYER_ONE,
        sourceCardId: "src",
        kind: "activated",
      }),
    );

    const choice = engine.getPendingChoice();
    expect(choice?.kind).toBe("targetSelection");
    if (choice?.kind !== "targetSelection") return;

    expect(choice).toMatchObject({
      minTargets: 2,
      maxTargets: 2,
      legalTargetIds: [groupA1Id, groupA2Id, groupBId],
      groups: [
        { minTargets: 1, maxTargets: 1, legalTargetIds: [groupA1Id, groupA2Id] },
        { minTargets: 1, maxTargets: 1, legalTargetIds: [groupBId] },
      ],
    });
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

  it("combines an optional battle-damage redirect with its destination choice", () => {
    const redirectEffect: CardEffect = {
      type: "triggered",
      activation: { timing: ["attack"] },
      directives: [
        {
          optional: true,
          action: {
            action: "redirectBattleDamage",
            duration: "thisBattle",
            target: { owner: "self", cardType: "unit" },
            redirectTo: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "academy" }],
            },
          },
        },
      ],
      sourceText: "You may choose 1 of your Academy Units to receive battle damage instead.",
    };
    const host = createMockUnit({ name: "Linked Host" });
    const firstAcademy = createMockUnit({ name: "First Academy Unit", traits: ["academy"] });
    const secondAcademy = createMockUnit({ name: "Second Academy Unit", traits: ["academy"] });
    const engine = GundamTestEngine.create({ play: [host, firstAcademy, secondAcademy] });
    const [hostId, firstAcademyId, secondAcademyId] = engine
      .asPlayer(PLAYER_ONE)
      .getCardsInZone("battleArea");

    engine.getG().pendingEffects.push(
      makePending({
        effect: redirectEffect,
        controllerId: PLAYER_ONE,
        sourceCardId: hostId!,
        kind: "triggered",
      }),
    );

    expect(engine.getPendingChoice()).toMatchObject({
      kind: "targetSelection",
      optionalDirectiveIndex: 0,
      directiveIndex: 0,
      minTargets: 1,
      maxTargets: 1,
      legalTargetIds: [firstAcademyId, secondAcademyId],
      groups: [
        {
          minTargets: 1,
          maxTargets: 1,
          legalTargetIds: [firstAcademyId, secondAcademyId],
        },
      ],
    });
  });

  it("emits a deckLook prompt with the revealed top-deck ids", () => {
    const top = createMockUnit({ name: "Top" });
    const second = createMockUnit({ name: "Second" });
    const engine = GundamTestEngine.create({ deck: [top, second] }, {});
    const revealed = engine.asPlayer(PLAYER_ONE).getCardsInZone("deck").slice(-2).reverse();

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

  it("asks for the optional prerequisite before revealing its dependent Deck look", () => {
    const discard = createMockUnit({ name: "Discard" });
    const top = createMockUnit({ name: "Top" });
    const second = createMockUnit({ name: "Second" });
    const source = createMockUnit({
      name: "Optional Look Source",
      effects: [optionalDeckLookEffect],
    });
    const engine = GundamTestEngine.create(
      { hand: [discard], play: [source], deck: [top, second] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const discardId = p1.getCardsInZone("hand")[0]!;

    expectSuccess(p1.activateAbility(sourceId, 0));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      directiveIndex: 0,
      optionalDirectiveIndex: 0,
      legalTargetIds: [discardId],
    });

    expectSuccess(
      p1.resolveEffect({
        optionalAnswers: { 0: true },
        targets: [discardId],
      }),
    );
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "deckLook",
      controllerId: PLAYER_ONE,
      directiveIndex: 1,
    });
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

  it("returns undefined instead of an empty modal when every staged option lost its target", () => {
    const targetlessModal: CardEffect = {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [
        {
          kind: "chooseOne",
          options: [
            {
              label: "Return an enemy Unit",
              directives: [
                {
                  action: {
                    action: "resolveThenQueue",
                    followUp: {
                      type: "triggered",
                      activation: { timing: [] },
                      directives: [
                        {
                          action: {
                            action: "returnToHand",
                            target: { owner: "opponent", cardType: "unit", count: 1 },
                          },
                        },
                      ],
                      sourceText: "Return an enemy Unit.",
                    },
                  },
                },
              ],
            },
            {
              label: "Rest an enemy Unit",
              directives: [
                {
                  action: {
                    action: "resolveThenQueue",
                    followUp: {
                      type: "triggered",
                      activation: { timing: [] },
                      directives: [
                        {
                          action: {
                            action: "rest",
                            target: { owner: "opponent", cardType: "unit", count: 1 },
                          },
                        },
                      ],
                      sourceText: "Rest an enemy Unit.",
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
      sourceText: "Choose one.",
    };
    const engine = GundamTestEngine.create({}, {});
    const pending = makePending({
      effect: targetlessModal,
      controllerId: PLAYER_ONE,
      kind: "triggered",
    });
    engine.getG().pendingEffects.push(pending);

    expect(engine.getPendingChoice()).toBeUndefined();
    expect(
      requiresPlayerChoice(pending, {
        g: engine.getG(),
        framework: engine.runtime.getFrameworkReadAPI(),
      }),
    ).toBe(false);
    engine.tickFlow(PLAYER_ONE);
    expect(engine.getG().pendingEffects).toHaveLength(0);
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

  it("publishes only the revealed Burst identity to every viewer", () => {
    const engine = GundamTestEngine.create({ deck: 3 }, {});
    engine.getG().pendingEffects.push(
      makePending({
        id: "burst-choice",
        effect: optionalDrawEffect,
        controllerId: PLAYER_ONE,
        sourceCardId: "revealed-shield",
        kind: "burst",
      }),
    );

    const runtime = engine.getRuntime();
    const controllerView = runtime.getBoardView({
      role: "player",
      playerId: PLAYER_ONE as never,
    });
    const opponentView = runtime.getBoardView({
      role: "player",
      playerId: PLAYER_TWO as never,
    });
    const spectatorView = runtime.getBoardView({ role: "spectator" });

    expect(controllerView.pendingChoice).toMatchObject({
      kind: "optional",
      effectId: "burst-choice",
      sourceCardId: "revealed-shield",
    });
    expect(opponentView.pendingChoice).toBeUndefined();
    expect(spectatorView.pendingChoice).toBeUndefined();
    expect(controllerView.pendingBurst).toEqual({
      kind: "burst",
      effectId: "burst-choice",
      controllerId: PLAYER_ONE,
      sourceCardId: "revealed-shield",
    });
    expect(opponentView.pendingBurst).toEqual(controllerView.pendingBurst);
    expect(spectatorView.pendingBurst).toEqual(controllerView.pendingBurst);
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
