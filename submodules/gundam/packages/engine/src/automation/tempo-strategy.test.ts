import { describe, expect, it } from "vite-plus/test";

import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
} from "../gundam/testing/index.ts";
import type { PlayerId } from "../types/branded.ts";

import { enumerateGundamBotCandidates } from "./candidate-enumerator.ts";
import { tempoStrategy } from "./tempo-strategy.ts";

/**
 * `tempoStrategy` overrides three policies on top of the shared defaults:
 *
 *   - `chooseFirstPlayer` → pick the OPPONENT (go second).
 *   - `declareBlock`     → filter to units with `<Blocker>`, never self-block,
 *                          skip entirely when attacker has `<High-Maneuver>`.
 *   - pending-choice short-circuit → keep only `resolveEffect` candidates
 *                                    after the inner strategy has ranked them.
 *
 * The bench data justifying the strategy lives in `tools/bot-bench/`; these
 * tests pin the behaviour at the policy layer so future refactors can't
 * regress the contract.
 */

describe("tempoStrategy: chooseFirstPlayer goes second", () => {
  it("picks the opponent as the first player", () => {
    // The chooseFirstPlayer candidate-enumerator emits one candidate
    // per legal first-player choice. The default policy picks own seat;
    // tempoStrategy should pick the OTHER seat.
    const engine = GundamTestEngine.create({}, {}, { skipToMainPhase: false });
    engine.runtime.getState().ctx.status.phase = "choose-first-player";

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );
    const view = engine.runtime.getFilteredView({
      role: "player",
      playerId: PLAYER_ONE as PlayerId,
    });

    const ranked = tempoStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view,
      candidates,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    });

    const first = ranked.find((c) => c.family === "chooseFirstPlayer");
    if (!first || first.family !== "chooseFirstPlayer") {
      throw new Error("expected at least one chooseFirstPlayer candidate");
    }
    expect(first.playerId).toBe(PLAYER_TWO);
  });
});

describe("tempoStrategy: declareBlock filters illegal blockers", () => {
  it("drops blocker candidates whose unit lacks the <Blocker> keyword", () => {
    // Synthesise candidates by hand — the enumerator's view of "legal"
    // for declareBlock is optimistic and emits any battlefield unit; the
    // strategy is the layer that filters down to genuine blockers.
    const blockerUnit = createMockUnit({
      cost: 2,
      level: 2,
      ap: 1,
      hp: 3,
      name: "GM (Blocker)",
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const nonBlocker = createMockUnit({
      cost: 1,
      level: 1,
      ap: 2,
      hp: 1,
      name: "Demi Trainer",
    });
    const attacker = createMockUnit({
      cost: 2,
      level: 2,
      ap: 3,
      hp: 2,
      name: "Zaku II",
    });
    const engine = GundamTestEngine.create(
      { play: [blockerUnit, nonBlocker] },
      { play: [attacker] },
    );

    // Find instance IDs.
    const view = engine.runtime.getFilteredView({
      role: "player",
      playerId: PLAYER_ONE as PlayerId,
    });
    const p1Field = view.zones.zones[`battleArea:${PLAYER_ONE as string}`]!;
    const blockerInstance = p1Field.cards.find(
      (c) => c.definition?.type === "unit" && c.definition.name === "GM (Blocker)",
    );
    const nonBlockerInstance = p1Field.cards.find(
      (c) => c.definition?.type === "unit" && c.definition.name === "Demi Trainer",
    );
    expect(blockerInstance).toBeDefined();
    expect(nonBlockerInstance).toBeDefined();

    // Hand-roll a declareBlock candidate list. Both units are in the
    // input; the strategy should filter to only the unit with <Blocker>.
    const candidates = [
      { family: "declareBlock", blockerId: blockerInstance!.instanceId } as const,
      { family: "declareBlock", blockerId: nonBlockerInstance!.instanceId } as const,
    ];

    const ranked = tempoStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view,
      candidates,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    });

    const blockCandidates = ranked.filter((c) => c.family === "declareBlock");
    expect(blockCandidates).toHaveLength(1);
    expect(blockCandidates[0]?.blockerId).toBe(blockerInstance?.instanceId);
  });

  it("rejects self-block (rule 8-3-3) — the attack target cannot block itself", () => {
    // P1 has a single Blocker-keyword unit on the field; it's also the
    // target of the incoming attack. The strategy should drop it from
    // the declareBlock candidate list so the planner doesn't submit a
    // BLOCKER_IS_TARGET-failing move.
    const target = createMockUnit({
      cost: 2,
      level: 2,
      ap: 1,
      hp: 3,
      name: "Targeted Blocker",
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const attacker = createMockUnit({
      cost: 2,
      level: 2,
      ap: 3,
      hp: 2,
      name: "Aggressor",
    });
    const engine = GundamTestEngine.create({ play: [target] }, { play: [attacker] });

    const view = engine.runtime.getFilteredView({
      role: "player",
      playerId: PLAYER_ONE as PlayerId,
    });
    const p1Field = view.zones.zones[`battleArea:${PLAYER_ONE as string}`]!;
    const p2Field = view.zones.zones[`battleArea:${PLAYER_TWO as string}`]!;
    const targetInstance = p1Field.cards[0]!.instanceId;
    const attackerInstance = p2Field.cards[0]!.instanceId;

    // Seed a pending combat so `getPendingCombat` returns a target.
    const g = engine.runtime.getState().G as {
      turnMetadata: { pendingCombat?: { attackerId: string; target: string; stage: string } };
    };
    g.turnMetadata.pendingCombat = {
      attackerId: attackerInstance,
      target: targetInstance,
      stage: "block-step",
    };

    const candidates = [{ family: "declareBlock", blockerId: targetInstance } as const];

    const ranked = tempoStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view,
      candidates,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    });

    const blocks = ranked.filter((c) => c.family === "declareBlock");
    expect(blocks).toHaveLength(0);
  });

  it("emits no blockers when the attacker has <High-Maneuver> (rule 13-1-6)", () => {
    // Attacker has HighManeuver; no unit may block. Even a legal Blocker
    // candidate must be dropped — letting the planner try it would burn
    // an attempt on a guaranteed CANNOT_BLOCK_HIGH_MANEUVER rejection.
    const blocker = createMockUnit({
      cost: 2,
      level: 2,
      ap: 1,
      hp: 3,
      name: "Loyal Blocker",
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const attacker = createMockUnit({
      cost: 3,
      level: 3,
      ap: 4,
      hp: 3,
      name: "Untouchable",
      keywordEffects: [{ keyword: "HighManeuver" }],
    });
    const directTarget = createMockUnit({
      cost: 1,
      level: 1,
      ap: 1,
      hp: 1,
      name: "Bait",
    });
    const engine = GundamTestEngine.create({ play: [blocker, directTarget] }, { play: [attacker] });

    const view = engine.runtime.getFilteredView({
      role: "player",
      playerId: PLAYER_ONE as PlayerId,
    });
    const p1Field = view.zones.zones[`battleArea:${PLAYER_ONE as string}`]!;
    const p2Field = view.zones.zones[`battleArea:${PLAYER_TWO as string}`]!;
    const blockerInstance = p1Field.cards.find(
      (c) => c.definition?.type === "unit" && c.definition.name === "Loyal Blocker",
    )!.instanceId;
    const baitInstance = p1Field.cards.find(
      (c) => c.definition?.type === "unit" && c.definition.name === "Bait",
    )!.instanceId;
    const attackerInstance = p2Field.cards[0]!.instanceId;

    const g = engine.runtime.getState().G as {
      turnMetadata: { pendingCombat?: { attackerId: string; target: string; stage: string } };
    };
    g.turnMetadata.pendingCombat = {
      attackerId: attackerInstance,
      target: baitInstance,
      stage: "block-step",
    };

    const candidates = [{ family: "declareBlock", blockerId: blockerInstance } as const];

    const ranked = tempoStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view,
      candidates,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    });

    const blocks = ranked.filter((c) => c.family === "declareBlock");
    expect(blocks).toHaveLength(0);
  });
});

describe("tempoStrategy: pending-choice short-circuit", () => {
  it("suppresses non-resolveEffect candidates when a choice is pending", () => {
    const attacker = createMockUnit({ cost: 1, level: 1, ap: 2, hp: 2, name: "RX" });
    const engine = GundamTestEngine.create({ play: [attacker] }, {});
    const view = engine.runtime.getFilteredView({
      role: "player",
      playerId: PLAYER_ONE as PlayerId,
    });

    // Construct a synthetic pending choice + a mixed-family candidate
    // list. The strategy should drop everything that isn't `resolveEffect`.
    const pendingChoice = {
      kind: "optional" as const,
      effectId: "effect-1",
      controllerId: PLAYER_ONE as string,
      sourceCardId: "src",
      directiveIndex: 0,
      prompt: "test pending optional",
    };
    const candidates = [
      { family: "passTurn" } as const,
      { family: "deployUnit", cardId: "anything" } as const,
      {
        family: "resolveEffect",
        optionalAnswers: { 0: true },
      } as const,
    ];

    const ranked = tempoStrategy.selectCandidates({
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view,
      candidates,
      turnNumber: 0,
      pendingChoice,
      cards: engine.runtime.getCardReadAPI(),
    });

    // Everything that isn't `resolveEffect` should be filtered out.
    for (const c of ranked) {
      expect(c.family).toBe("resolveEffect");
    }
    expect(ranked.some((c) => c.family === "resolveEffect")).toBe(true);
  });
});
