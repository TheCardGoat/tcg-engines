import { describe, expect, test } from "vite-plus/test";
import { createTacticalStrategy } from "../../src/automation/search/tactical.ts";
import type { DecisionContext, EngineHandle } from "../../src/automation/types.ts";
import { createCardInstanceId, createPlayerId, type PlayerId } from "../../src/types/branded.ts";
import type { CommandEnvelope, CommandResult } from "../../src/types/commands.ts";
import type { FilteredCardView, FilteredMatchView } from "../../src/view/filter.ts";
import type { PlayerPrompt } from "../../src/view/player-prompt.ts";

const P1 = createPlayerId("p1");
const P2 = createPlayerId("p2");

interface ScriptedNode {
  view: FilteredMatchView;
  prompts: Record<string, PlayerPrompt>;
  transitions?: Record<string, string>;
}

class ScriptedEngine implements EngineHandle {
  constructor(
    private readonly nodes: Record<string, ScriptedNode>,
    private currentNode: string,
  ) {}

  getFilteredView(_playerId: PlayerId): FilteredMatchView {
    return this.node().view;
  }

  getPrompt(playerId: PlayerId): PlayerPrompt {
    return this.node().prompts[playerId as string] ?? waitingPrompt();
  }

  processCommand(command: CommandEnvelope, playerId: PlayerId): CommandResult {
    const key = `${playerId as string}:${command.move}`;
    const args = command.input?.args;
    const cardId = args && typeof args === "object" && "cardId" in args ? args.cardId : undefined;
    const specificKey = typeof cardId === "string" ? `${key}:${cardId}` : key;
    const next = this.node().transitions?.[specificKey] ?? this.node().transitions?.[key];
    if (!next) {
      return {
        success: false,
        error: `No scripted transition for ${key}`,
        errorCode: "SCRIPTED_ILLEGAL",
        currentStateID: this.node().view.stateID,
      };
    }
    this.currentNode = next;
    return { success: true, stateID: this.node().view.stateID } as CommandResult;
  }

  fork(): EngineHandle {
    return new ScriptedEngine(this.nodes, this.currentNode);
  }

  private node(): ScriptedNode {
    const node = this.nodes[this.currentNode];
    if (!node) throw new Error(`Missing scripted node ${this.currentNode}`);
    return node;
  }
}

describe("tactical strategy", () => {
  test("steals the Gig that serves its color plan before the highest rival value", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseGigsToSteal",
        chooserId: "p1",
        payload: {
          count: 1,
          attackerId: "attacker",
          rivalId: "p2",
          eligibleDice: [
            { dieId: "low", faceValue: 1 },
            { dieId: "high", faceValue: 6 },
          ],
        },
      },
    };
    const before = view({
      p1Field: [card("blue-legend", 2, { type: "legend", color: "blue" })],
      p1Gigs: [2],
      p2Gigs: [1, 6],
    });
    const nodes: Record<string, ScriptedNode> = {
      root: {
        view: before,
        prompts: { p1: prompt, p2: waitingPrompt() },
        transitions: { "p1:resolveStealGigs": "done" },
      },
      done: { view: before, prompts: {} },
    };
    expect(decide(nodes, prompt)).toMatchObject({
      kind: "command",
      move: "resolveStealGigs",
      args: { dieIds: ["low"] },
    });
  });

  test("uses an ability before attacking when the defender has a winning public reply", () => {
    const attacker = card("attacker", 12);
    const remover = card("remover", 2);
    const blocker = card("blocker", 6, { keywords: ["blocker"] });
    const rootPrompt = actionPrompt([
      {
        moveId: "attackRival",
        inputSpec: { type: "selectCard", candidates: [attacker.instanceId] },
      },
      {
        moveId: "activateAbility",
        inputSpec: {
          type: "selectAbility",
          candidates: [
            {
              cardId: remover.instanceId,
              abilityIndex: 0,
              effectHints: ["trashCard"],
              eddieCost: 0,
              spendsCard: false,
            },
          ],
        },
      },
    ]);
    const nodes: Record<string, ScriptedNode> = {
      root: {
        view: view({ p1Field: [attacker, remover], p2Field: [blocker] }),
        prompts: { p1: rootPrompt, p2: waitingPrompt() },
        transitions: { "p1:attackRival": "react", "p1:activateAbility": "setup" },
      },
      react: {
        view: view({ p1Field: [attacker, remover], p2Field: [blocker] }),
        prompts: {
          p1: waitingPrompt(),
          p2: actionPrompt([
            {
              moveId: "useBlocker",
              inputSpec: { type: "selectCard", candidates: [blocker.instanceId] },
            },
            { moveId: "resolveAttack", inputSpec: { type: "none" } },
          ]),
        },
        transitions: { "p2:useBlocker": "loss", "p2:resolveAttack": "win" },
      },
      setup: {
        view: view({ p1Field: [attacker, remover], p2Field: [] }),
        prompts: {
          p1: actionPrompt([
            {
              moveId: "attackRival",
              inputSpec: { type: "selectCard", candidates: [attacker.instanceId] },
            },
          ]),
          p2: waitingPrompt(),
        },
        transitions: { "p1:attackRival": "win" },
      },
      win: { view: view({ winnerId: "p1" }), prompts: {} },
      loss: { view: view({ winnerId: "p2" }), prompts: {} },
    };

    const decision = decide(nodes, rootPrompt);

    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("activateAbility");
    expect(decision.diagnostics?.nodesEvaluated).toBeGreaterThan(1);
    expect(decision.diagnostics?.scoreGap).toBeGreaterThan(0);
  });

  test("does not rank a deck-changing branch from its hidden outcome", () => {
    const attacker = card("attacker", 12);
    const defender = card("defender", 10);
    const secret = card("secret", 1, { zone: "hand" });
    const prompt = actionPrompt([
      {
        moveId: "sellCard",
        inputSpec: { type: "selectCard", candidates: [secret.instanceId] },
      },
      {
        moveId: "attackUnit",
        inputSpec: {
          type: "selectPair",
          fromCandidates: [attacker.instanceId],
          toCandidates: [defender.instanceId],
        },
      },
    ]);

    for (const hiddenWinner of ["p1", "p2"] as const) {
      const nodes: Record<string, ScriptedNode> = {
        root: {
          view: view({ p1Field: [attacker], p1Hand: [secret], p2Field: [defender] }),
          prompts: { p1: prompt, p2: waitingPrompt() },
          transitions: { "p1:sellCard": "hidden", "p1:attackUnit": "public" },
        },
        hidden: {
          view: view({ winnerId: hiddenWinner, p1Deck: 19 }),
          prompts: {},
        },
        public: {
          view: view({ p1Field: [attacker], p1Hand: [secret], p2Field: [] }),
          prompts: {},
        },
      };

      // With the removal mandate the winning fight is forced and the hidden
      // sell branch never enters the candidate set at all.
      const forced = decide(nodes, prompt);
      expect(forced.kind).toBe("command");
      if (forced.kind !== "command") continue;
      expect(forced.move).toBe("attackUnit");
      expect(forced.diagnostics?.cutoffReason).toBe("complete");

      // With the mandate off the search must still rank the fight above the
      // sell purely from public outcomes — never from the hidden fork.
      const decision = decide(nodes, prompt, { disabledHeuristics: ["remove-targets"] });
      expect(decision.kind).toBe("command");
      if (decision.kind !== "command") continue;
      expect(decision.move).toBe("attackUnit");
      expect(decision.diagnostics?.cutoffReason).toBe("hidden-information");
    }
  });

  test("does not spend search depth on forced attack-resolution commands", () => {
    const attacker = card("attacker", 12);
    const prompt = actionPrompt([
      {
        moveId: "attackRival",
        inputSpec: { type: "selectCard", candidates: [attacker.instanceId] },
      },
      { moveId: "passPhase", inputSpec: { type: "none" } },
    ]);
    const forcedResolve = actionPrompt([{ moveId: "resolveAttack", inputSpec: { type: "none" } }]);
    const nodes: Record<string, ScriptedNode> = {
      root: {
        view: view({ p1Field: [attacker] }),
        prompts: { p1: prompt, p2: waitingPrompt() },
        transitions: { "p1:attackRival": "resolve-1", "p1:passPhase": "loss" },
      },
      "resolve-1": {
        view: view({ p1Field: [attacker] }),
        prompts: { p1: waitingPrompt(), p2: forcedResolve },
        transitions: { "p2:resolveAttack": "resolve-2" },
      },
      "resolve-2": {
        view: view({ p1Field: [attacker] }),
        prompts: { p1: forcedResolve, p2: waitingPrompt() },
        transitions: { "p1:resolveAttack": "resolve-3" },
      },
      "resolve-3": {
        view: view({ p1Field: [attacker] }),
        prompts: { p1: forcedResolve, p2: waitingPrompt() },
        transitions: { "p1:resolveAttack": "win" },
      },
      win: { view: view({ winnerId: "p1" }), prompts: {} },
      loss: { view: view({ winnerId: "p2" }), prompts: {} },
    };

    const decision = decide(nodes, prompt, { maxDepth: 1 });

    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("attackRival");
  });

  test("does not search future gain-Gig die rolls", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [{ moveId: "gainGig", inputSpec: { type: "none" } }],
      choice: {
        type: "gainGig",
        chooserId: "p1",
        payload: { allowedDieIds: ["die-a", "die-b"] },
      },
    };
    const nodes: Record<string, ScriptedNode> = {
      root: {
        view: view(),
        prompts: { p1: prompt, p2: waitingPrompt() },
      },
    };

    const decision = decide(nodes, prompt);

    expect(decision).toMatchObject({
      kind: "command",
      move: "gainGig",
      args: { dieId: "die-a" },
      diagnostics: { nodesEvaluated: 0 },
    });
  });

  test("does not rank mulligan from the future redraw", () => {
    const prompt = actionPrompt([
      { moveId: "mulligan", inputSpec: { type: "none" } },
      { moveId: "keepHand", inputSpec: { type: "none" } },
    ]);

    for (const hiddenWinner of ["p1", "p2"] as const) {
      const nodes: Record<string, ScriptedNode> = {
        root: {
          view: view(),
          prompts: { p1: prompt, p2: waitingPrompt() },
          transitions: { "p1:mulligan": "redraw", "p1:keepHand": "kept" },
        },
        redraw: { view: view({ winnerId: hiddenWinner }), prompts: {} },
        kept: { view: view(), prompts: {} },
      };

      const decision = decide(nodes, prompt);
      expect(decision).toMatchObject({ kind: "command", move: "keepHand" });
    }
  });

  test("does not rank a reroll ability from its future die result", () => {
    const reroller = card("reroller", 2);
    const development = card("development", 6, { zone: "hand" });
    const prompt = actionPrompt([
      {
        moveId: "activateAbility",
        inputSpec: {
          type: "selectAbility",
          candidates: [
            {
              cardId: reroller.instanceId,
              abilityIndex: 0,
              effectHints: ["rerollGig"],
              eddieCost: 0,
              spendsCard: false,
            },
          ],
        },
      },
      {
        moveId: "playCard",
        inputSpec: { type: "playCard", candidates: [{ cardId: development.instanceId }] },
      },
    ]);

    for (const hiddenWinner of ["p1", "p2"] as const) {
      const nodes: Record<string, ScriptedNode> = {
        root: {
          view: view({ p1Field: [reroller], p1Hand: [development] }),
          prompts: { p1: prompt, p2: waitingPrompt() },
          transitions: { "p1:activateAbility": "rolled", "p1:playCard": "developed" },
        },
        rolled: { view: view({ winnerId: hiddenWinner }), prompts: {} },
        developed: {
          view: view({ p1Field: [reroller, development] }),
          prompts: {},
        },
      };

      const decision = decide(nodes, prompt);
      expect(decision).toMatchObject({ kind: "command", move: "playCard" });
    }
  });

  test("does not search the unrevealed top card when choosing a card type", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [{ moveId: "resolveCardTypeChoice", inputSpec: { type: "none" } }],
      choice: {
        type: "chooseCardType",
        chooserId: "p1",
        payload: { cardTypes: ["unit", "gear"] },
      },
    };
    const nodes: Record<string, ScriptedNode> = {
      root: { view: view(), prompts: { p1: prompt, p2: waitingPrompt() } },
    };

    const decision = decide(nodes, prompt);

    expect(decision).toMatchObject({
      kind: "command",
      move: "resolveCardTypeChoice",
      args: { cardType: "unit" },
      diagnostics: { nodesEvaluated: 0 },
    });
  });

  test("breaks equal scores by stable action identity", () => {
    const a = card("a", 3, { zone: "hand" });
    const b = card("b", 3, { zone: "hand" });
    const prompt = actionPrompt([
      {
        moveId: "playCard",
        inputSpec: { type: "playCard", candidates: [{ cardId: "b" }, { cardId: "a" }] },
      },
    ]);
    const nodes: Record<string, ScriptedNode> = {
      root: {
        view: view({ p1Hand: [b, a] }),
        prompts: { p1: prompt, p2: waitingPrompt() },
        transitions: { "p1:playCard": "same" },
      },
      same: { view: view({ p1Hand: [b, a] }), prompts: {} },
    };

    const decision = decide(nodes, prompt);

    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.args?.cardId).toBe("a");
  });

  test("plays a strong Unit when its visible Gig-pair on-play ability is ready", () => {
    const payoff = card("z-payoff", 6, {
      zone: "hand",
      abilityHints: [
        abilityHint({
          timing: "play",
          roles: ["cardAdvantage"],
          conditions: ["hasGigPair"],
        }),
      ],
    });
    const plain = card("a-plain", 6, { zone: "hand" });
    const prompt = playPrompt([plain.instanceId, payoff.instanceId]);
    const makeNodes = (gigs: number[]): Record<string, ScriptedNode> => ({
      root: {
        view: view({ p1Hand: [plain, payoff], p1Gigs: gigs }),
        prompts: { p1: prompt, p2: waitingPrompt() },
        transitions: {
          [`p1:playCard:${plain.instanceId}`]: "plain",
          [`p1:playCard:${payoff.instanceId}`]: "payoff",
        },
      },
      plain: {
        view: view({ p1Hand: [payoff], p1Field: [{ ...plain, zone: "field" }], p1Gigs: gigs }),
        prompts: {},
      },
      payoff: {
        view: view({ p1Hand: [plain], p1Field: [{ ...payoff, zone: "field" }], p1Gigs: gigs }),
        prompts: {},
      },
    });

    expect(decide(makeNodes([3, 3]), prompt)).toMatchObject({
      kind: "command",
      move: "playCard",
      args: { cardId: payoff.instanceId },
    });
    expect(decide(makeNodes([3, 5]), prompt)).toMatchObject({
      kind: "command",
      move: "playCard",
      args: { cardId: plain.instanceId },
    });
  });

  test("uses a soft removal to stop a late-game ready rival Unit", () => {
    const rival = card("rival", 7);
    const remover = card("remover", 1);
    const prompt = actionPrompt([
      {
        moveId: "activateAbility",
        inputSpec: {
          type: "selectAbility",
          candidates: [
            {
              cardId: remover.instanceId,
              abilityIndex: 0,
              effectHints: ["spend"],
              eddieCost: 0,
              spendsCard: false,
            },
          ],
        },
      },
      { moveId: "passPhase", inputSpec: { type: "none" } },
    ]);
    const nodes: Record<string, ScriptedNode> = {
      root: {
        view: view({ p1Field: [remover], p2Field: [rival], p1Gigs: [1, 2, 3, 4, 5] }),
        prompts: { p1: prompt, p2: waitingPrompt() },
        transitions: { "p1:activateAbility": "locked", "p1:passPhase": "passed" },
      },
      locked: {
        view: view({
          p1Field: [remover],
          p2Field: [{ ...rival, spent: true }],
          p1Gigs: [1, 2, 3, 4, 5],
        }),
        prompts: {},
      },
      passed: {
        view: view({ p1Field: [remover], p2Field: [rival], p1Gigs: [1, 2, 3, 4, 5] }),
        prompts: {},
      },
    };

    expect(decide(nodes, prompt)).toMatchObject({ kind: "command", move: "activateAbility" });
  });

  test("prefers cheap hard removal early when both cards remove the same Unit", () => {
    const rival = card("rival", 5);
    const expensive = card("a-expensive", 0, {
      zone: "hand",
      type: "program",
      cost: 4,
      effectiveCost: 4,
    });
    const cheap = card("z-cheap", 0, {
      zone: "hand",
      type: "program",
      cost: 1,
      effectiveCost: 1,
    });
    const prompt = playPrompt([expensive.instanceId, cheap.instanceId]);
    const nodes: Record<string, ScriptedNode> = {
      root: {
        view: view({ p1Hand: [expensive, cheap], p2Field: [rival], p1Gigs: [2] }),
        prompts: { p1: prompt, p2: waitingPrompt() },
        transitions: {
          [`p1:playCard:${expensive.instanceId}`]: "expensive",
          [`p1:playCard:${cheap.instanceId}`]: "cheap",
        },
      },
      expensive: {
        view: view({ p1Hand: [cheap], p2Field: [], p1Gigs: [2] }),
        prompts: {},
      },
      cheap: {
        view: view({ p1Hand: [expensive], p2Field: [], p1Gigs: [2] }),
        prompts: {},
      },
    };

    expect(decide(nodes, prompt)).toMatchObject({
      kind: "command",
      move: "playCard",
      args: { cardId: cheap.instanceId },
    });
  });

  test("plays a repeatable card-advantage engine before a late-game payoff", () => {
    const engineCard = card("z-engine", 2, {
      zone: "hand",
      abilityHints: [abilityHint({ timing: "event", roles: ["cardAdvantage"] })],
    });
    const finisher = card("a-finisher", 2, {
      zone: "hand",
      abilityHints: [
        abilityHint({
          timing: "play",
          roles: ["gigPressure"],
          requirements: ["rivalGig"],
        }),
      ],
    });
    const prompt = playPrompt([finisher.instanceId, engineCard.instanceId]);
    const nodes = sameResultPlayNodes(
      view({ p1Hand: [finisher, engineCard], p1Gigs: [2], p2Gigs: [3], turnNumber: 3 }),
      prompt,
    );

    const decision = decide(nodes, prompt, { abilityAware: true });

    expect(decision).toMatchObject({
      kind: "command",
      move: "playCard",
      args: { cardId: engineCard.instanceId },
    });
  });

  test("switches to an immediate Gig payoff late in the race", () => {
    const engineCard = card("z-engine", 2, {
      zone: "hand",
      abilityHints: [abilityHint({ timing: "event", roles: ["cardAdvantage"] })],
    });
    const finisher = card("a-finisher", 2, {
      zone: "hand",
      abilityHints: [
        abilityHint({
          timing: "play",
          roles: ["gigPressure"],
          requirements: ["rivalGig"],
        }),
      ],
    });
    const prompt = playPrompt([engineCard.instanceId, finisher.instanceId]);
    const nodes = sameResultPlayNodes(
      view({
        p1Hand: [engineCard, finisher],
        p1Gigs: [2, 3, 4, 5, 6],
        p2Gigs: [1, 2, 3, 4, 5],
        turnNumber: 11,
      }),
      prompt,
    );

    const decision = decide(nodes, prompt, { abilityAware: true });

    expect(decision).toMatchObject({
      kind: "command",
      move: "playCard",
      args: { cardId: finisher.instanceId },
    });
  });

  test("honours the printed minimum for a conditional ability", () => {
    const conditional = card("a-conditional", 2, {
      zone: "hand",
      abilityHints: [
        abilityHint({
          timing: "play",
          roles: ["cardAdvantage"],
          conditions: ["hasDistinctGigValues"],
          conditionThresholds: [{ condition: "hasDistinctGigValues", minCount: 3 }],
        }),
      ],
    });
    const development = card("z-development", 2, {
      zone: "hand",
      abilityHints: [abilityHint({ timing: "play", roles: ["development"] })],
    });
    const prompt = playPrompt([conditional.instanceId, development.instanceId]);
    const shortNodes = sameResultPlayNodes(
      view({ p1Hand: [conditional, development], p1Gigs: [2, 3], p2Gigs: [4] }),
      prompt,
    );
    const readyNodes = sameResultPlayNodes(
      view({ p1Hand: [conditional, development], p1Gigs: [2, 3, 4], p2Gigs: [5] }),
      prompt,
    );

    expect(decide(shortNodes, prompt, { abilityAware: true })).toMatchObject({
      args: { cardId: development.instanceId },
    });
    expect(decide(readyNodes, prompt, { abilityAware: true })).toMatchObject({
      args: { cardId: conditional.instanceId },
    });
  });

  test("holds an attack-reactive Program until an attack is in progress", () => {
    const reactive = card("a-reactive", 0, {
      zone: "hand",
      type: "program",
      abilityHints: [
        abilityHint({
          timing: "play",
          reactive: true,
          roles: ["cardAdvantage", "combat"],
          requirements: ["attackContext"],
        }),
      ],
    });
    const development = card("z-development", 0, {
      zone: "hand",
      type: "program",
      abilityHints: [abilityHint({ timing: "play", roles: ["development"] })],
    });
    const prompt = playPrompt([reactive.instanceId, development.instanceId]);
    const quietNodes = sameResultPlayNodes(
      view({ p1Hand: [reactive, development], p1Gigs: [2], p2Gigs: [3] }),
      prompt,
    );
    const attackView = view({
      p1Hand: [reactive, development],
      p1Gigs: [2],
      p2Gigs: [3],
      attackInProgress: true,
    });
    const attackNodes = sameResultPlayNodes(attackView, prompt);

    expect(decide(quietNodes, prompt, { abilityAware: true })).toMatchObject({
      args: { cardId: development.instanceId },
    });
    expect(decide(attackNodes, prompt, { abilityAware: true })).toMatchObject({
      args: { cardId: reactive.instanceId },
    });
  });

  test("changes activated-ability priority with the visible rival board", () => {
    const control = card("a-control", 2, {
      abilityHints: [
        abilityHint({
          timing: "activated",
          roles: ["boardControl"],
          requirements: ["rivalBoard"],
        }),
      ],
    });
    const draw = card("z-draw", 2, {
      abilityHints: [abilityHint({ timing: "activated", roles: ["cardAdvantage"] })],
    });
    const rivalA = card("rival-a", 4);
    const rivalB = card("rival-b", 5);
    const prompt = actionPrompt([
      {
        moveId: "activateAbility",
        inputSpec: {
          type: "selectAbility",
          candidates: [
            {
              cardId: control.instanceId,
              abilityIndex: 0,
              effectHints: ["defeat"],
              eddieCost: 0,
              spendsCard: false,
            },
            {
              cardId: draw.instanceId,
              abilityIndex: 0,
              effectHints: ["draw"],
              eddieCost: 0,
              spendsCard: false,
            },
          ],
        },
      },
    ]);
    const earlyView = view({ p1Field: [control, draw], p1Gigs: [2], p2Gigs: [3] });
    const pressuredView = view({
      p1Field: [control, draw],
      p2Field: [rivalA, rivalB],
      p1Gigs: [2, 3, 4, 5, 6],
      p2Gigs: [1, 2, 3, 4, 5],
      turnNumber: 11,
    });

    expect(
      decide(sameResultAbilityNodes(earlyView, prompt), prompt, { abilityAware: true }),
    ).toMatchObject({
      args: { cardId: draw.instanceId },
    });
    expect(
      decide(sameResultAbilityNodes(pressuredView, prompt), prompt, { abilityAware: true }),
    ).toMatchObject({ args: { cardId: control.instanceId } });
  });

  test("attaches conditional Gear to the host that satisfies its named-card ability", () => {
    const gear = card("conditional-gear", 1, {
      zone: "hand",
      type: "gear",
      abilityHints: [
        abilityHint({
          timing: "event",
          roles: ["economy"],
          conditions: ["cardName"],
          requiredHostNames: ["V"],
        }),
      ],
    });
    const otherHost = card("a-other-host", 4, { cardName: "Jackie Welles" });
    const matchingHost = card("z-matching-host", 3, { cardName: "V" });
    const prompt = actionPrompt([
      {
        moveId: "playCard",
        inputSpec: {
          type: "playCard",
          candidates: [
            {
              cardId: gear.instanceId,
              attachTargets: [otherHost.instanceId, matchingHost.instanceId],
            },
          ],
        },
      },
    ]);
    const nodes = sameResultPlayNodes(
      view({ p1Hand: [gear], p1Field: [otherHost, matchingHost], p1Gigs: [2], p2Gigs: [3] }),
      prompt,
    );

    expect(decide(nodes, prompt, { abilityAware: true })).toMatchObject({
      kind: "command",
      move: "playCard",
      args: { cardId: gear.instanceId, attachToId: matchingHost.instanceId },
    });
  });
});

function decide(
  nodes: Record<string, ScriptedNode>,
  prompt: PlayerPrompt,
  options: {
    maxDepth?: number;
    abilityAware?: boolean;
    disabledHeuristics?: readonly string[];
  } = {},
) {
  const engine = new ScriptedEngine(nodes, "root");
  const strategy = createTacticalStrategy({
    maxDepth: options.maxDepth ?? 4,
    maxNodes: 64,
    branchLimit: 8,
    abilityAware: options.abilityAware,
    disabledHeuristics: options.disabledHeuristics,
  });
  const ctx: DecisionContext = {
    view: engine.getFilteredView(P1),
    playerId: P1,
    prompt,
    rng: () => 0.5,
    engine,
  };
  return strategy.decideAction(ctx);
}

function actionPrompt(availableMoves: PlayerPrompt["availableMoves"]): PlayerPrompt {
  return { status: "action", availableMoves, choice: null };
}

function waitingPrompt(): PlayerPrompt {
  return { status: "waiting", availableMoves: [], choice: null };
}

function playPrompt(cardIds: string[]): PlayerPrompt {
  return actionPrompt([
    {
      moveId: "playCard",
      inputSpec: { type: "playCard", candidates: cardIds.map((cardId) => ({ cardId })) },
    },
  ]);
}

function sameResultPlayNodes(rootView: FilteredMatchView, prompt: PlayerPrompt) {
  return {
    root: {
      view: rootView,
      prompts: { p1: prompt, p2: waitingPrompt() },
      transitions: { "p1:playCard": "same" },
    },
    same: { view: rootView, prompts: {} },
  } satisfies Record<string, ScriptedNode>;
}

function sameResultAbilityNodes(rootView: FilteredMatchView, prompt: PlayerPrompt) {
  return {
    root: {
      view: rootView,
      prompts: { p1: prompt, p2: waitingPrompt() },
      transitions: { "p1:activateAbility": "same" },
    },
    same: { view: rootView, prompts: {} },
  } satisfies Record<string, ScriptedNode>;
}

function abilityHint(
  options: Partial<FilteredCardView["abilityHints"][number]>,
): FilteredCardView["abilityHints"][number] {
  return {
    abilityIndex: 0,
    timing: "play",
    event: null,
    reactive: false,
    effects: [],
    conditions: [],
    conditionThresholds: [],
    requiredHostNames: [],
    roles: [],
    requirements: [],
    ...options,
  };
}

function card(
  instanceId: string,
  power: number,
  options: Partial<FilteredCardView> = {},
): FilteredCardView {
  return {
    instanceId,
    definitionId: instanceId,
    cardName: instanceId,
    zone: "field",
    faceDown: false,
    revealed: false,
    spent: false,
    damage: 0,
    power,
    effectivePower: power,
    cost: 1,
    effectiveCost: 1,
    costEffects: [],
    activeEffects: [],
    type: "unit",
    classifications: [],
    hasSellTag: false,
    attachedGearIds: [],
    attachedToId: null,
    hasLag: false,
    hasAttackedThisTurn: false,
    hasStolenGigThisTurn: false,
    grantedRules: [],
    keywords: [],
    triggerHints: [],
    abilityHints: [],
    ...options,
  };
}

function view(
  options: {
    p1Field?: FilteredCardView[];
    p1Hand?: FilteredCardView[];
    p2Field?: FilteredCardView[];
    p1Deck?: number;
    winnerId?: string;
    p1Gigs?: number[];
    p2Gigs?: number[];
    turnNumber?: number;
    attackInProgress?: boolean;
  } = {},
): FilteredMatchView {
  const player = (
    field: FilteredCardView[],
    hand: FilteredCardView[] | number,
    deck: number,
    gigs: number[],
    firstPlayer = false,
  ) => ({
    firstPlayer,
    zones: {
      field,
      hand,
      deck,
      trash: [],
      legendArea: [],
      eddieArea: [],
      gigArea: gigs.map((value, index) =>
        card(`gig-${value}-${index}`, value, { zone: "gigArea", type: null, cost: null }),
      ),
      fixerArea: [],
    },
    eddies: 0,
    availableEddies: 0,
    gigCount: gigs.length,
    fixerCount: 5,
    streetCred: 12,
    activeEffects: [],
    soldThisTurn: false,
    calledLegendThisTurn: false,
    calledLegendThisRivalTurn: false,
  });
  return {
    players: {
      p1: player(
        options.p1Field ?? [],
        options.p1Hand ?? [],
        options.p1Deck ?? 20,
        options.p1Gigs ?? [2, 3, 4],
        true,
      ),
      p2: player(options.p2Field ?? [], 0, 20, options.p2Gigs ?? [2, 3, 4]),
    },
    gamePhase: "main",
    turnNumber: options.turnNumber ?? 4,
    activePlayerId: "p1",
    overtimeActive: false,
    previousTurnBeganWithEmptyFixer: false,
    turnBeganWithEmptyFixer: false,
    playedCardTypesThisTurn: { p1: [], p2: [] },
    attackState: options.attackInProgress
      ? {
          attackerId: createCardInstanceId("rival-attacker"),
          defenderId: null,
          rivalId: P1,
          kind: "direct",
          step: "react",
          redirectedByBlocker: false,
        }
      : null,
    gameEnded: options.winnerId !== undefined,
    winnerId: options.winnerId ?? null,
    winReason: options.winnerId ? "winCondition" : null,
    stateID: options.winnerId === "p1" ? 3 : options.winnerId === "p2" ? 4 : 1,
    prompt: waitingPrompt(),
  };
}

void P2;
