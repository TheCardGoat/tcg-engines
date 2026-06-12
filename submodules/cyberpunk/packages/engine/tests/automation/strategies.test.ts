import { describe, expect, test } from "vite-plus/test";
import { createMatchState } from "../../src/state/initial-state.ts";
import { LocalEngine } from "../../src/transport/local-engine.ts";
import {
  buildDecisionContext,
  createGreedyStrategy,
  DEFAULT_GREEDY_WEIGHTS,
  firstLegalStrategy,
  greedyStrategy,
  randomStrategy,
} from "../../src/automation/index.ts";
import { shouldMulligan } from "../../src/automation/strategies/greedy.ts";
import type { DecisionContext } from "../../src/automation/types.ts";
import type { AvailableMove } from "../../src/view/player-prompt.ts";
import type { FilteredCardView } from "../../src/view/filter.ts";
import type { PlayerId } from "../../src/types/branded.ts";
import { createTestCatalog, createTestDecks, createTestPlayers } from "./fixtures.ts";

function makeFakeCtx(availableMoves: AvailableMove[]): DecisionContext {
  return {
    view: {} as DecisionContext["view"],
    playerId: "p1" as PlayerId,
    prompt: { status: "action", availableMoves, choice: null },
    rng: () => 0,
  };
}

function makeHandCard(id: string, cost: number, hasSellTag = false): FilteredCardView {
  return {
    instanceId: id,
    definitionId: `def-${id}`,
    zone: "hand",
    faceDown: false,
    spent: false,
    damage: 0,
    power: 0,
    effectivePower: 0,
    cost,
    type: "unit",
    classifications: [],
    hasSellTag,
    attachedGearIds: [],
    attachedToId: null,
    playedThisTurn: false,
    hasAttackedThisTurn: false,
    grantedRules: [],
    keywords: [],
  };
}

function makeCtxWithHand(hand: FilteredCardView[]): DecisionContext {
  return {
    view: {
      players: {
        p1: {
          zones: { hand },
          eddies: 0,
          gigCount: 0,
          fixerCount: 6,
          streetCred: 0,
        },
      },
    } as unknown as DecisionContext["view"],
    playerId: "p1" as PlayerId,
    prompt: { status: "action", availableMoves: [], choice: null },
    rng: () => 0,
  };
}

function makeEngineAndContext(seed: string) {
  const players = createTestPlayers();
  const decks = createTestDecks();
  const catalog = createTestCatalog();
  const state = createMatchState({ players, catalog, deckLists: decks, seed });
  const engine = new LocalEngine(state);
  const active = engine.getFilteredView(players[0]!.id).activePlayerId;
  const activeId = active === (players[0]!.id as string) ? players[0]!.id : players[1]!.id;
  let counter = 0;
  const ctx = buildDecisionContext(engine, activeId, () => {
    counter += 1;
    return (counter * 0.1234) % 1;
  });
  return { engine, ctx };
}

describe("firstLegalStrategy.decideAction", () => {
  test("returns a command for the first available move", () => {
    const { ctx } = makeEngineAndContext("first-legal");
    const decision = firstLegalStrategy.decideAction(ctx);
    if (ctx.prompt.availableMoves.length === 0) {
      expect(decision.kind).toBe("stuck");
      return;
    }
    expect(decision.kind).toBe("command");
  });

  test("prefers a meaningful move over passPhase and concede", () => {
    const ctx = makeFakeCtx([
      { moveId: "passPhase", inputSpec: { type: "none" } },
      { moveId: "concede", inputSpec: { type: "none" } },
      {
        moveId: "playCard",
        inputSpec: { type: "playCard", candidates: [{ cardId: "c1" }, { cardId: "c2" }] },
      },
    ]);
    const decision = firstLegalStrategy.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("playCard");
  });

  test("falls back to passPhase when only passPhase and concede are available", () => {
    const ctx = makeFakeCtx([
      { moveId: "concede", inputSpec: { type: "none" } },
      { moveId: "passPhase", inputSpec: { type: "none" } },
    ]);
    const decision = firstLegalStrategy.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("passPhase");
  });

  test("only picks concede when it is the only option", () => {
    const ctx = makeFakeCtx([{ moveId: "concede", inputSpec: { type: "none" } }]);
    const decision = firstLegalStrategy.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("concede");
  });

  test("skips moves with empty candidate lists in favor of passPhase", () => {
    const ctx = makeFakeCtx([
      { moveId: "playCard", inputSpec: { type: "playCard", candidates: [] } },
      {
        moveId: "attackUnit",
        inputSpec: { type: "selectPair", fromCandidates: ["a"], toCandidates: [] },
      },
      { moveId: "passPhase", inputSpec: { type: "none" } },
    ]);
    const decision = firstLegalStrategy.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("passPhase");
  });

  test("plays a gear card with its first valid attach target", () => {
    const ctx = makeFakeCtx([
      {
        moveId: "playCard",
        inputSpec: {
          type: "playCard",
          candidates: [{ cardId: "gear-1", attachTargets: ["unit-a", "unit-b"] }],
        },
      },
    ]);
    const decision = firstLegalStrategy.decideAction(ctx);
    expect(decision).toEqual({
      kind: "command",
      move: "playCard",
      args: { cardId: "gear-1", attachToId: "unit-a" },
    });
  });

  test("skips blocker when this attack was already redirected by a blocker", () => {
    const ctx = makeFakeCtx([
      { moveId: "useBlocker", inputSpec: { type: "selectCard", candidates: ["reserve-blocker"] } },
      { moveId: "resolveAttack", inputSpec: { type: "none" } },
    ]);
    ctx.view = {
      attackState: {
        attackerId: "attacker",
        defenderId: "first-blocker",
        kind: "fight",
        step: "defensive",
        redirectedByBlocker: true,
      },
    } as DecisionContext["view"];

    expect(firstLegalStrategy.decideAction(ctx)).toEqual({
      kind: "command",
      move: "resolveAttack",
      args: { pass: true },
    });
  });
});

describe("randomStrategy.decideAction", () => {
  test("returns a command using ctx.rng", () => {
    const { ctx } = makeEngineAndContext("random-strategy");
    if (ctx.prompt.availableMoves.length === 0) return;
    const decision = randomStrategy.decideAction(ctx);
    expect(["command", "stuck"]).toContain(decision.kind);
  });

  test("is deterministic given the same RNG sequence", () => {
    const a = makeEngineAndContext("random-strategy-determinism").ctx;
    const b = makeEngineAndContext("random-strategy-determinism").ctx;
    if (a.prompt.availableMoves.length === 0) return;
    expect(randomStrategy.decideAction(a)).toEqual(randomStrategy.decideAction(b));
  });
});

describe("greedyStrategy.decideAction", () => {
  test("returns a command from its priority list when one is available", () => {
    const { ctx } = makeEngineAndContext("greedy-strategy");
    if (ctx.prompt.availableMoves.length === 0) return;
    const decision = greedyStrategy.decideAction(ctx);
    expect(["command", "stuck"]).toContain(decision.kind);
  });

  test("keeps concede behind ordinary unweighted moves", () => {
    const strategy = createGreedyStrategy({
      ...DEFAULT_GREEDY_WEIGHTS,
      defaultPriority: {},
    });
    const ctx = makeFakeCtx([
      { moveId: "concede", inputSpec: { type: "none" } },
      { moveId: "passPhase", inputSpec: { type: "none" } },
    ]);
    expect(strategy.decideAction(ctx)).toEqual({ kind: "command", move: "passPhase" });
  });

  test("clones supplied weights so later caller mutations do not leak in", () => {
    const weights = { ...DEFAULT_GREEDY_WEIGHTS, mulliganMinSellable: 0 };
    const strategy = createGreedyStrategy(weights);
    weights.mulliganMinSellable = 6;

    const ctx = makeCtxWithHand([
      makeHandCard("a", 1),
      makeHandCard("b", 2),
      makeHandCard("c", 3),
      makeHandCard("d", 4),
      makeHandCard("e", 5),
      makeHandCard("f", 6),
    ]);
    ctx.prompt.availableMoves = [
      { moveId: "mulligan", inputSpec: { type: "none" } },
      { moveId: "keepHand", inputSpec: { type: "none" } },
    ];

    expect(strategy.decideAction(ctx)).toEqual({ kind: "command", move: "keepHand" });
  });

  test("playCard prefers a blocker when rival has unanswered ready units", () => {
    const rivalThreat: FilteredCardView = {
      ...makeHandCard("rival-unit", 3),
      instanceId: "rival-unit",
      zone: "field",
      power: 4,
      effectivePower: 4,
    };
    const ctx: DecisionContext = {
      view: {
        players: {
          p1: {
            zones: { field: [], hand: [] },
            eddies: 5,
            gigCount: 0,
            fixerCount: 6,
            streetCred: 0,
          },
          p2: {
            zones: { field: [rivalThreat], hand: 0 },
            eddies: 0,
            gigCount: 0,
            fixerCount: 6,
            streetCred: 0,
          },
        },
      } as unknown as DecisionContext["view"],
      playerId: "p1" as PlayerId,
      prompt: {
        status: "action",
        availableMoves: [
          {
            moveId: "playCard",
            inputSpec: {
              type: "playCard",
              candidates: [{ cardId: "big-attacker" }, { cardId: "small-blocker" }],
            },
          },
        ],
        choice: null,
      },
      rng: () => 0,
    };
    // Project hand cards into the view so findCard can resolve them.
    const big: FilteredCardView = {
      ...makeHandCard("big-attacker", 5),
      effectivePower: 6,
      keywords: [],
    };
    const blocker: FilteredCardView = {
      ...makeHandCard("small-blocker", 2),
      effectivePower: 1,
      keywords: ["blocker"],
    };
    (ctx.view.players.p1!.zones as { hand: FilteredCardView[] }).hand = [big, blocker];

    const decision = greedyStrategy.decideAction(ctx);
    expect(decision).toEqual({
      kind: "command",
      move: "playCard",
      args: { cardId: "small-blocker" },
    });
  });

  test("playCard falls back to highest-cost when the board is safe", () => {
    const ctx: DecisionContext = {
      view: {
        players: {
          p1: {
            zones: { field: [], hand: [] },
            eddies: 5,
            gigCount: 0,
            fixerCount: 6,
            streetCred: 0,
          },
          p2: {
            zones: { field: [], hand: 0 },
            eddies: 0,
            gigCount: 0,
            fixerCount: 6,
            streetCred: 0,
          },
        },
      } as unknown as DecisionContext["view"],
      playerId: "p1" as PlayerId,
      prompt: {
        status: "action",
        availableMoves: [
          {
            moveId: "playCard",
            inputSpec: {
              type: "playCard",
              candidates: [{ cardId: "big-attacker" }, { cardId: "small-blocker" }],
            },
          },
        ],
        choice: null,
      },
      rng: () => 0,
    };
    const big: FilteredCardView = {
      ...makeHandCard("big-attacker", 5),
      effectivePower: 6,
      keywords: [],
    };
    const blocker: FilteredCardView = {
      ...makeHandCard("small-blocker", 2),
      effectivePower: 1,
      keywords: ["blocker"],
    };
    (ctx.view.players.p1!.zones as { hand: FilteredCardView[] }).hand = [big, blocker];

    const decision = greedyStrategy.decideAction(ctx);
    expect(decision).toEqual({
      kind: "command",
      move: "playCard",
      args: { cardId: "big-attacker" },
    });
  });

  test("blocks during the defensive step instead of passing the attack through", () => {
    const ctx: DecisionContext = {
      view: {
        players: {
          p1: {
            zones: {
              field: [
                {
                  ...makeHandCard("blocker", 1),
                  zone: "field",
                  power: 1,
                  effectivePower: 1,
                },
              ],
            },
            eddies: 0,
            gigCount: 0,
            fixerCount: 6,
            streetCred: 0,
          },
          p2: {
            zones: { field: [] },
            eddies: 0,
            gigCount: 3,
            fixerCount: 3,
            streetCred: 0,
          },
        },
        attackState: {
          attackerId: "attacker",
          defenderId: "original-target",
          kind: "fight",
          step: "defensive",
          redirectedByBlocker: false,
        },
      } as unknown as DecisionContext["view"],
      playerId: "p1" as PlayerId,
      // Defensive step: useBlocker AND resolveAttack are both available; the
      // strategy must pick useBlocker rather than passing.
      prompt: {
        status: "action",
        availableMoves: [
          { moveId: "useBlocker", inputSpec: { type: "selectCard", candidates: ["blocker"] } },
          { moveId: "resolveAttack", inputSpec: { type: "none" } },
        ],
        choice: null,
      },
      rng: () => 0,
    };
    const decision = greedyStrategy.decideAction(ctx);
    expect(decision).toEqual({
      kind: "command",
      move: "useBlocker",
      args: { blockerId: "blocker" },
    });
  });

  test("does not spend another blocker after the attack was already redirected", () => {
    const ctx: DecisionContext = {
      view: {
        players: {
          p1: {
            zones: {
              field: [
                {
                  ...makeHandCard("first-blocker", 1),
                  zone: "field",
                  spent: true,
                  power: 1,
                  effectivePower: 1,
                },
                {
                  ...makeHandCard("reserve-blocker", 2),
                  zone: "field",
                  power: 2,
                  effectivePower: 2,
                },
              ],
            },
            eddies: 0,
            gigCount: 0,
            fixerCount: 6,
            streetCred: 0,
          },
          p2: {
            zones: { field: [] },
            eddies: 0,
            gigCount: 3,
            fixerCount: 3,
            streetCred: 0,
          },
        },
        attackState: {
          attackerId: "attacker",
          defenderId: "first-blocker",
          kind: "fight",
          step: "defensive",
          redirectedByBlocker: true,
        },
      } as unknown as DecisionContext["view"],
      playerId: "p1" as PlayerId,
      prompt: {
        status: "action",
        availableMoves: [
          {
            moveId: "useBlocker",
            inputSpec: { type: "selectCard", candidates: ["reserve-blocker"] },
          },
          { moveId: "resolveAttack", inputSpec: { type: "none" } },
        ],
        choice: null,
      },
      rng: () => 0,
    };

    expect(greedyStrategy.decideAction(ctx)).toEqual({
      kind: "command",
      move: "resolveAttack",
      args: { pass: true },
    });
  });

  test("does not sell when the rival is one gig from winning", () => {
    const ctx: DecisionContext = {
      view: {
        players: {
          p1: {
            zones: { field: [], hand: [] },
            eddies: 0,
            gigCount: 2,
            fixerCount: 4,
            streetCred: 0,
          },
          p2: {
            zones: { field: [] },
            eddies: 0,
            gigCount: 5,
            fixerCount: 1,
            streetCred: 0,
          },
        },
      } as unknown as DecisionContext["view"],
      playerId: "p1" as PlayerId,
      prompt: {
        status: "action",
        availableMoves: [
          { moveId: "sellCard", inputSpec: { type: "selectCard", candidates: ["c1"] } },
          { moveId: "passPhase", inputSpec: { type: "none" } },
        ],
        choice: null,
      },
      rng: () => 0,
    };
    const decision = greedyStrategy.decideAction(ctx);
    // sellCard is deprioritised below passPhase when rival is near-winning.
    expect(decision).toEqual({ kind: "command", move: "passPhase" });
  });

  test("when we're one gig from winning, prefers attacks/abilities over selling", () => {
    const ctx: DecisionContext = {
      view: {
        players: {
          p1: {
            zones: { field: [], hand: [] },
            eddies: 0,
            gigCount: 5,
            fixerCount: 1,
            streetCred: 0,
          },
          p2: {
            zones: { field: [] },
            eddies: 0,
            gigCount: 2,
            fixerCount: 4,
            streetCred: 0,
          },
        },
      } as unknown as DecisionContext["view"],
      playerId: "p1" as PlayerId,
      prompt: {
        status: "action",
        availableMoves: [
          { moveId: "sellCard", inputSpec: { type: "selectCard", candidates: ["c1"] } },
          { moveId: "passPhase", inputSpec: { type: "none" } },
        ],
        choice: null,
      },
      rng: () => 0,
    };
    // sellCard sits below passPhase in the own-near-win branch.
    expect(greedyStrategy.decideAction(ctx)).toEqual({ kind: "command", move: "passPhase" });
  });

  test("still sells normally when the game is not in panic mode", () => {
    const ctx: DecisionContext = {
      view: {
        players: {
          p1: {
            zones: { field: [], hand: [] },
            eddies: 0,
            gigCount: 0,
            fixerCount: 6,
            streetCred: 0,
          },
          p2: {
            zones: { field: [] },
            eddies: 0,
            gigCount: 0,
            fixerCount: 6,
            streetCred: 0,
          },
        },
      } as unknown as DecisionContext["view"],
      playerId: "p1" as PlayerId,
      prompt: {
        status: "action",
        availableMoves: [
          { moveId: "sellCard", inputSpec: { type: "selectCard", candidates: ["c1"] } },
          { moveId: "passPhase", inputSpec: { type: "none" } },
        ],
        choice: null,
      },
      rng: () => 0,
    };
    const decision = greedyStrategy.decideAction(ctx);
    expect(decision).toEqual({
      kind: "command",
      move: "sellCard",
      args: { cardId: "c1" },
    });
  });

  test("useBlocker picks the lowest-power friendly blocker", () => {
    const ctx: DecisionContext = {
      view: {
        players: {
          p1: {
            zones: {
              field: [
                {
                  ...makeHandCard("strong-blocker", 5),
                  zone: "field",
                  power: 5,
                  effectivePower: 5,
                },
                {
                  ...makeHandCard("weak-blocker", 1),
                  zone: "field",
                  power: 1,
                  effectivePower: 1,
                },
              ],
            },
            eddies: 0,
            gigCount: 0,
            fixerCount: 6,
            streetCred: 0,
          },
        },
      } as unknown as DecisionContext["view"],
      playerId: "p1" as PlayerId,
      prompt: {
        status: "action",
        availableMoves: [
          {
            moveId: "useBlocker",
            inputSpec: {
              type: "selectCard",
              candidates: ["strong-blocker", "weak-blocker"],
            },
          },
        ],
        choice: null,
      },
      rng: () => 0,
    };
    const decision = greedyStrategy.decideAction(ctx);
    expect(decision).toEqual({
      kind: "command",
      move: "useBlocker",
      args: { blockerId: "weak-blocker" },
    });
  });

  test("activates an ability before passing the phase", () => {
    const ctx = makeFakeCtx([
      {
        moveId: "activateAbility",
        inputSpec: {
          type: "selectAbility",
          candidates: [
            { cardId: "c1", abilityIndex: 0 },
            { cardId: "c2", abilityIndex: 1 },
          ],
        },
      },
      { moveId: "passPhase", inputSpec: { type: "none" } },
    ]);
    const decision = greedyStrategy.decideAction(ctx);
    expect(decision).toEqual({
      kind: "command",
      move: "activateAbility",
      args: { cardId: "c1", abilityIndex: 0 },
    });
  });
});

describe("activateAbility inputSpec wiring", () => {
  test("first-legal treats an empty ability list as non-actionable", () => {
    const ctx = makeFakeCtx([
      { moveId: "activateAbility", inputSpec: { type: "selectAbility", candidates: [] } },
      { moveId: "passPhase", inputSpec: { type: "none" } },
    ]);
    const decision = firstLegalStrategy.decideAction(ctx);
    expect(decision).toEqual({ kind: "command", move: "passPhase" });
  });

  test("first-legal picks the first available ability candidate", () => {
    const ctx = makeFakeCtx([
      {
        moveId: "activateAbility",
        inputSpec: {
          type: "selectAbility",
          candidates: [{ cardId: "c1", abilityIndex: 0 }],
        },
      },
      { moveId: "passPhase", inputSpec: { type: "none" } },
    ]);
    const decision = firstLegalStrategy.decideAction(ctx);
    expect(decision).toEqual({
      kind: "command",
      move: "activateAbility",
      args: { cardId: "c1", abilityIndex: 0 },
    });
  });
});

describe("greedy mulligan heuristic", () => {
  test("keeps a hand with 2+ cheap cards AND a sellable", () => {
    const ctx = makeCtxWithHand([
      makeHandCard("a", 1, true),
      makeHandCard("b", 2),
      makeHandCard("c", 4),
      makeHandCard("d", 5),
      makeHandCard("e", 5),
      makeHandCard("f", 6),
    ]);
    expect(shouldMulligan(ctx)).toBe(false);
  });

  test("mulligans when there are no sellable cards (no eddie ramp)", () => {
    const ctx = makeCtxWithHand([
      makeHandCard("a", 1),
      makeHandCard("b", 2),
      makeHandCard("c", 3),
      makeHandCard("d", 4),
      makeHandCard("e", 5),
      makeHandCard("f", 6),
    ]);
    expect(shouldMulligan(ctx)).toBe(true);
  });

  test("mulligans a hand with only one cheap card even if sellable", () => {
    const ctx = makeCtxWithHand([
      makeHandCard("a", 1, true),
      makeHandCard("b", 4),
      makeHandCard("c", 4),
      makeHandCard("d", 5),
      makeHandCard("e", 5),
      makeHandCard("f", 6),
    ]);
    expect(shouldMulligan(ctx)).toBe(true);
  });

  test("mulligans an all-expensive hand", () => {
    const ctx = makeCtxWithHand([
      makeHandCard("a", 4, true),
      makeHandCard("b", 5),
      makeHandCard("c", 5),
      makeHandCard("d", 6),
      makeHandCard("e", 6),
      makeHandCard("f", 7),
    ]);
    expect(shouldMulligan(ctx)).toBe(true);
  });

  test("custom weights flip the mulligan decision (parameterisation works)", () => {
    // Default weights would mulligan this hand (no sell-tag card, no eddie ramp).
    const ctx = makeCtxWithHand([
      makeHandCard("a", 1),
      makeHandCard("b", 2),
      makeHandCard("c", 3),
      makeHandCard("d", 4),
      makeHandCard("e", 5),
      makeHandCard("f", 6),
    ]);
    expect(shouldMulligan(ctx)).toBe(true);
    // Tell greedy "you don't need any sellable cards" → keep the hand.
    const relaxed = { ...DEFAULT_GREEDY_WEIGHTS, mulliganMinSellable: 0 };
    expect(shouldMulligan(ctx, relaxed)).toBe(false);
    // And confirm the wired-through strategy honours the same weights.
    ctx.prompt.availableMoves = [
      { moveId: "mulligan", inputSpec: { type: "none" } },
      { moveId: "keepHand", inputSpec: { type: "none" } },
    ];
    const strategy = createGreedyStrategy(relaxed);
    expect(strategy.decideAction(ctx)).toEqual({ kind: "command", move: "keepHand" });
  });

  test("greedy fires mulligan when the hand is bricked", () => {
    const ctx = makeCtxWithHand([makeHandCard("a", 5), makeHandCard("b", 5), makeHandCard("c", 6)]);
    ctx.prompt.availableMoves = [
      { moveId: "mulligan", inputSpec: { type: "none" } },
      { moveId: "passPhase", inputSpec: { type: "none" } },
    ];
    expect(greedyStrategy.decideAction(ctx)).toEqual({ kind: "command", move: "mulligan" });
  });

  test("greedy keeps a playable opening hand with eddie ramp", () => {
    const ctx = makeCtxWithHand([
      makeHandCard("a", 1, true),
      makeHandCard("b", 2),
      makeHandCard("c", 3),
    ]);
    ctx.prompt.availableMoves = [
      { moveId: "mulligan", inputSpec: { type: "none" } },
      { moveId: "passPhase", inputSpec: { type: "none" } },
    ];
    expect(greedyStrategy.decideAction(ctx)).toEqual({ kind: "command", move: "passPhase" });
  });
});
