import { describe, expect, it } from "vite-plus/test";

import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  createMockResource,
} from "../gundam/testing/index.ts";
import { asPlayerId } from "../types/branded.ts";
import type { PlayerId } from "../types/branded.ts";

import type { CardEffect } from "@tcg/gundam-types";
import type { PendingEffect } from "../gundam/types.ts";
import { enumerateGundamBotCandidates } from "./candidate-enumerator.ts";

/**
 * Enumerator tests. Each test pins an expected candidate *family* set
 * for a hand-seeded engine state — no card-level ids (those vary by
 * instance counter). The goal is "for scenario X, the bot sees move
 * family Y as an option" — inside each family we also assert the
 * basic shape (single-target vs multi-target, one-per-effect, etc.).
 */
describe("candidate-enumerator: deployUnit", () => {
  it("enumerates a cost-1 unit deploy when the viewer has the resources", () => {
    const rx = createMockUnit({
      cost: 1,
      level: 1,
      ap: 2,
      hp: 3,
      color: "blue",
      name: "RX-78-2",
    });
    const engine = GundamTestEngine.create(
      { hand: [rx], resourceArea: [createMockResource(), createMockResource()] },
      {},
    );

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );

    const deploys = candidates.filter((c) => c.family === "deployUnit");
    expect(deploys).toHaveLength(1);
    const [deploy] = deploys;
    if (deploy?.family !== "deployUnit") throw new Error("type narrow");
    expect(typeof deploy.cardId).toBe("string");
  });

  it("skips deployUnit when no resources are active", () => {
    const rx = createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, name: "RX-78-2" });
    const engine = GundamTestEngine.create({ hand: [rx], resourceArea: [] }, {});

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );

    expect(candidates.some((c) => c.family === "deployUnit")).toBe(false);
  });
});

describe("candidate-enumerator: enterBattle", () => {
  it("fans out attacker × rested-target pairs", () => {
    const attacker = createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, name: "RX-78-2" });
    const dom = createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "red", name: "Dom" });
    const zaku = createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "red", name: "Zaku II" });

    const engine = GundamTestEngine.create(
      { play: [attacker] },
      {
        play: [
          { card: dom, exhausted: true },
          { card: zaku, exhausted: true },
        ],
      },
    );

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );

    const attacks = candidates.filter((c) => c.family === "enterBattle");
    // One attacker × (two rested targets + direct) = three candidates.
    expect(attacks).toHaveLength(3);
    for (const attack of attacks) {
      if (attack.family !== "enterBattle") throw new Error("type narrow");
      expect(typeof attack.attackerId).toBe("string");
      expect(typeof attack.target).toBe("string");
    }
  });

  it("emits a direct-attack candidate when opponent has only active units", () => {
    // Active opponent units are not legal unit-targets (rule 8-1-3), but the
    // attacker may always declare a direct attack on the player; the defender
    // can only redirect via the <Blocker> keyword in the block step.
    const attacker = createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, name: "RX-78-2" });
    const dom = createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, name: "Dom" });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [dom] });

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );

    const attacks = candidates.filter((c) => c.family === "enterBattle");
    expect(attacks).toHaveLength(1);
    if (attacks[0]?.family === "enterBattle") {
      expect(attacks[0].target).toBe("direct");
    }
  });
});

describe("candidate-enumerator: passTurn fallback", () => {
  it("emits passTurn when the viewer is in main-phase with no other useful moves", () => {
    // Empty hand, empty board → the only main-phase action is passTurn.
    const engine = GundamTestEngine.create({}, {});

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );

    expect(candidates.some((c) => c.family === "passTurn")).toBe(true);
  });
});

describe("candidate-enumerator: gameEnded short-circuit", () => {
  it("returns [] when the game has ended", () => {
    const engine = GundamTestEngine.create({}, {});
    const state = engine.runtime.getState();
    state.ctx.status.gameEnded = true;

    const candidates = enumerateGundamBotCandidates(
      state,
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );

    expect(candidates).toEqual([]);
  });
});

describe("candidate-enumerator: search caps", () => {
  it("caps primary seeds at the configured limit", () => {
    // Ten deployable units of different names in hand with enough
    // resources to make all of them valid `deployUnit` candidates.
    const units = Array.from({ length: 10 }, (_, i) =>
      createMockUnit({
        cost: 1,
        level: 1,
        ap: 1,
        hp: 2,
        color: "blue",
        name: `Unit ${i + 1}`,
      }),
    );
    const resources = Array.from({ length: 3 }, () => createMockResource());
    const engine = GundamTestEngine.create({ hand: units, resourceArea: resources }, {});

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
      { caps: { primarySeeds: 3 } },
    );

    const deploys = candidates.filter((c) => c.family === "deployUnit");
    expect(deploys).toHaveLength(3);
  });
});

describe("candidate-enumerator: moveNameFilter", () => {
  it("restricts enumeration to the named move family", () => {
    const engine = GundamTestEngine.create({}, {});
    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
      { moveNameFilter: ["passTurn"] },
    );

    for (const candidate of candidates) {
      expect(candidate.family).toBe("passTurn");
    }
  });
});

describe("candidate-enumerator: setup phases (no describeProcedure)", () => {
  // `chooseFirstPlayer` and `alterHand` have no `describeProcedure`
  // hook — the UI collects their discrete input via dedicated buttons.
  // Without explicit fan-out here the enumerator emits zero candidates
  // for those moves and the bot stalls forever in the setup segment.
  // These tests pin the contract.

  it("emits one chooseFirstPlayer candidate per player at game start", () => {
    const engine = GundamTestEngine.create(
      { deck: 12, resourceDeck: 10 },
      { deck: 12, resourceDeck: 10 },
      { skipToMainPhase: false },
    );
    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );

    const firsts = candidates.filter((c) => c.family === "chooseFirstPlayer");
    expect(firsts).toHaveLength(2);
    const playerIds = firsts.map((c) =>
      c.family === "chooseFirstPlayer" ? c.playerId : undefined,
    );
    expect(playerIds).toContain(PLAYER_ONE);
    expect(playerIds).toContain(PLAYER_TWO);
  });

  it("emits both alterHand candidates (keep + redraw) during mulligan", () => {
    const engine = GundamTestEngine.create(
      { deck: 12, resourceDeck: 10 },
      { deck: 12, resourceDeck: 10 },
      { skipToMainPhase: false },
    );
    engine.doMove("chooseFirstPlayer", asPlayerId(PLAYER_ONE), { playerId: PLAYER_ONE });
    expect(engine.getState().ctx.status.phase).toBe("mulligan");

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );
    const alters = candidates.filter((c) => c.family === "alterHand");
    const wants = alters.map((c) => (c.family === "alterHand" ? c.wantsRedraw : undefined));
    expect(wants).toContain(true);
    expect(wants).toContain(false);
  });

  it("emits alterHand for player_two after player_one has mulliganed", () => {
    // Regression for the stall we hit in manual testing: viewer
    // kept their hand, but the bot (player_two) never submitted its
    // own mulligan because the enumerator produced no candidates
    // when `activePlayer === player_two` and phase === "mulligan".
    const engine = GundamTestEngine.create(
      { deck: 12, resourceDeck: 10 },
      { deck: 12, resourceDeck: 10 },
      { skipToMainPhase: false },
    );
    engine.doMove("chooseFirstPlayer", asPlayerId(PLAYER_ONE), { playerId: PLAYER_ONE });
    engine.doMove("alterHand", asPlayerId(PLAYER_ONE), { wantsRedraw: false });

    // activePlayer should now be player_two per `alterHand.execute`.
    expect(engine.getState().ctx.status.activePlayer).toBe(PLAYER_TWO);

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_TWO as PlayerId,
      engine.runtime.getStaticResources(),
    );
    const alters = candidates.filter((c) => c.family === "alterHand");
    expect(alters.length).toBeGreaterThanOrEqual(1);
  });
});

// =============================================================================
// chooseOne fan-out (PR #239 review feedback — Copilot)
// =============================================================================

const drawOrDiscardChooseOneEffect: CardEffect = {
  type: "command",
  activation: { timing: ["main"] },
  directives: [
    {
      kind: "chooseOne",
      options: [
        { label: "Draw 2", directives: [{ action: { action: "draw", count: 2 } }] },
        { label: "Discard 1", directives: [{ action: { action: "discard", count: 1 } }] },
      ],
    },
  ],
  sourceText: "Choose one: Draw 2 / Discard 1.",
};

describe("candidate-enumerator: resolveEffect chooseOne fan-out", () => {
  it("emits one resolveEffect candidate per option when the head is chooseOne", () => {
    // Push a synthetic command-kind chooseOne onto the queue so the
    // enumerator's `findChooseOneHeadShape` branch fires. Fan-out must
    // produce one candidate per option (matching the optional accept/
    // decline pattern), each carrying the matching `chooseOneAnswers`.
    const engine = GundamTestEngine.create({}, {});
    const pending: PendingEffect = {
      id: "pe_chooseOne",
      controllerId: PLAYER_ONE,
      sourceCardId: "unused",
      effect: drawOrDiscardChooseOneEffect,
      effectIndex: 0,
      kind: "command",
    };
    engine.getG().pendingEffects.push(pending);

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );

    const resolves = candidates.filter((c) => c.family === "resolveEffect");
    expect(resolves).toHaveLength(2);
    const answers = resolves.map((c) =>
      c.family === "resolveEffect" ? c.chooseOneAnswers?.[0] : undefined,
    );
    expect(answers.sort((a, b) => Number(a) - Number(b))).toEqual([0, 1]);
  });
});
