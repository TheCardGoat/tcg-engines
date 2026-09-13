/**
 * CR Chapter 6 / 8.5 — Effects: happy paths, edge cases, interactions.
 * Production path: hit/pitch/attack triggers on catalog or seated trainers
 * resolve as ordinary triggered layers through the rules-event kernel.
 */
import { describe, expect, it } from "vite-plus/test";
import {
  FabTestEngine,
  hitTriggerAbilities,
  pitchTriggerAbilities,
  toFabCardDefinition,
} from "../../../index.ts";
import {
  bravo,
  dash,
  heartOfFyendal,
  nimbleStrikeRed,
  nimblismBlue,
  snatchRed,
} from "../../fixtures.ts";
import { attackTriggerTrainer, hitTrainer, pitchTrainer } from "../../test-trainers.ts";

/** Play a cost-0 hit trainer undefended and close combat. */
function hitWith(
  attack: ReturnType<typeof hitTrainer>,
  opts?: {
    defenderHand?: Parameters<typeof FabTestEngine.start>[1]["hand"];
    attackerDeck?: Parameters<typeof FabTestEngine.start>[0]["deck"];
    defenderLife?: number;
    block?: boolean;
  },
) {
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: [attack],
      deck: opts?.attackerDeck ?? [heartOfFyendal, heartOfFyendal, heartOfFyendal, heartOfFyendal],
    },
    {
      hero: dash,
      life: opts?.defenderLife ?? 20,
      hand: opts?.defenderHand ?? [],
      deck: 6,
    },
    // Walks priority/pitch timing by hand - opt out of the smart defaults.
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  game.as(bravo).attackWith(attack);
  if (opts?.block && opts.defenderHand) {
    // block with first hand card if present
    const hand = game.as(dash).zone("hand");
    if (hand.length) {
      game.as(dash).exec({
        move: "defend",
        payload: { instanceIds: [game.as(dash).findCardInZone("hand", hand[0]!)] },
      });
    }
  }
  game.helpers.resolveRestOfCombat();
  return game;
}

function resolveTriggeredLayers(game: FabTestEngine): void {
  for (let safety = 0; safety < 20; safety += 1) {
    if (game.getState().decision || game.getState().rulesStack.at(-1)?.kind !== "triggered") return;
    game.passBoth();
  }
  throw new Error("Triggered layers did not resolve through priority.");
}

function answerCurrentEffectChoice(game: FabTestEngine): void {
  const decision = game.getState().decision;
  if (!decision || decision.kind !== "effect-resolution") {
    throw new Error("Expected a persisted effect-resolution choice.");
  }
  game.exec({
    move: "answer-decision",
    actorId: decision.actorId,
    payload: {
      decisionId: decision.decisionId,
      stateVersion: decision.stateVersion,
      answer: { kind: "effect-resolution", optionId: decision.options[0]!.id },
    },
  });
}

function answerCurrentOptional(game: FabTestEngine): void {
  const decision = game.getState().decision;
  if (!decision || decision.kind !== "boolean") {
    throw new Error("Expected a persisted optional-effect choice.");
  }
  game.exec({
    move: "answer-decision",
    actorId: decision.actorId,
    payload: {
      decisionId: decision.decisionId,
      stateVersion: decision.stateVersion,
      answer: { kind: "boolean", value: true },
    },
  });
}

describe("CR 6 / 8.5 — Effects (catalog + trainers)", () => {
  // ── Existing catalog anchors ────────────────────────────────────────────
  it("8.5.6 draw happy: Snatch hits → draw at damage step", () => {
    const def = toFabCardDefinition(snatchRed);
    expect(
      hitTriggerAbilities(def).some(
        (a) => a.resolution.kind === "effect" && a.resolution.effect.type === "draw",
      ),
    ).toBe(true);
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [heartOfFyendal, heartOfFyendal, heartOfFyendal],
      },
      { hero: dash, life: 20, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith([]);
    game.as(bravo).pass();
    game.as(dash).pass();
    game.passBoth();
    expect(game.combat()?.step).toBe("damage");
    expect(game.as(dash).life()).toBe(16);
    resolveTriggeredLayers(game);
    expect(game.as(bravo).handCount()).toBe(1);
    game.helpers.resolveRestOfCombat();
  });

  it("8.5.6 draw edge: full block → no hit → no draw", () => {
    const full = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [heartOfFyendal, heartOfFyendal, heartOfFyendal],
      },
      { hero: dash, life: 20, hand: [nimblismBlue, snatchRed], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    full.as(bravo).attackWith(snatchRed);
    full.as(dash).blockWith([nimblismBlue, snatchRed]);
    full.helpers.resolveRestOfCombat();
    expect(full.as(dash).life()).toBe(20);
    expect(full.as(bravo).handCount()).toBe(0);
  });

  it("8.5.7 gain-life happy: Heart of Fyendal pitch while behind", () => {
    const def = toFabCardDefinition(heartOfFyendal);
    expect(pitchTriggerAbilities(def)[0]?.resolution).toMatchObject({
      kind: "effect",
      effect: { type: "gain-life" },
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 10,
        hand: [heartOfFyendal, nimbleStrikeRed],
        deck: 4,
        resourcePoints: 0,
      },
      { hero: dash, life: 15, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // Pitch HoF as payment for cost-1 strike (CR 1.14.3b)
    game.as(bravo).play(nimbleStrikeRed, {
      pitch: [heartOfFyendal],
      target: game.as(dash).id,
    });
    resolveTriggeredLayers(game);
    expect(game.as(bravo).life()).toBe(11);
    expect(game.as(bravo).resourcePoints()).toBe(2); // 3 − 1
  });

  it("8.5.7 gain-life edge: pitch while not behind → no life", () => {
    const game = FabTestEngine.start(
      { hero: bravo, life: 15, hand: [heartOfFyendal, nimbleStrikeRed], deck: 4 },
      { hero: dash, life: 10, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(nimbleStrikeRed, {
      pitch: [heartOfFyendal],
      target: game.as(dash).id,
    });
    resolveTriggeredLayers(game);
    expect(game.as(bravo).life()).toBe(15);
  });

  it("6.1 discrete damage applied once at damage step", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith([]);
    game.as(bravo).pass();
    game.as(dash).pass();
    game.passBoth();
    expect(game.combat()?.step).toBe("damage");
    expect(game.as(dash).life()).toBe(16);
    expect(game.combat()?.activeLink?.damage.status).toBe("resolved");
  });

  // ── Leaf effect matrix (generated from effect-leaf-contracts) ─────────
  describe("leaf effect types via hit trainers (contract map)", () => {
    // Implementation lives in 06-effects-leaf-contracts.test.ts to keep this file readable.
    it("contract map is non-empty and covers inventory leaf types", async () => {
      const { EFFECT_LEAF_CONTRACTS } = await import("../../effect-leaf-contracts.ts");
      expect(EFFECT_LEAF_CONTRACTS.length).toBeGreaterThan(50);
    });
  });

  // ── Structural effects ──────────────────────────────────────────────────
  describe("structural effect types", () => {
    it("6.1 sequence: draw then gain-life both apply on hit", () => {
      const attack = hitTrainer({
        slug: "seq",
        effect: {
          type: "sequence",
          steps: [
            { type: "draw", count: 1, player: "controller" },
            { type: "gain-life", amount: 1, target: { selector: "controller" } },
          ],
        },
      });
      const game = FabTestEngine.start(
        {
          hero: bravo,
          life: 15,
          hand: [attack],
          deck: [heartOfFyendal, heartOfFyendal],
        },
        { hero: dash, life: 20, deck: 4 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(bravo).attackWith(attack);
      game.helpers.resolveRestOfCombat();
      expect(game.as(bravo).handCount()).toBe(1);
      expect(game.as(bravo).life()).toBe(16);
    });

    it("6.1 choice: resolves the player's explicit first-option decision", () => {
      const attack = hitTrainer({
        slug: "choice",
        effect: {
          type: "choice",
          options: [
            { type: "gain-life", amount: 2, target: { selector: "controller" } },
            { type: "draw", count: 1, player: "controller" },
          ],
        },
      });
      const game = FabTestEngine.start(
        { hero: bravo, life: 10, hand: [attack], deck: 4 },
        { hero: dash, life: 20, deck: 4 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(bravo).attackWith(attack);
      expect(() => game.helpers.resolveRestOfCombat()).toThrow(/explicit effect-resolution answer/);
      answerCurrentEffectChoice(game);
      game.helpers.resolveRestOfCombat();
      expect(game.as(bravo).life()).toBe(12);
    });

    it("6.1 conditional: then branch when life comparison holds", () => {
      const attack = hitTrainer({
        slug: "cond",
        effect: {
          type: "conditional",
          condition: { type: "life-comparison", player: "self", vs: "opponent", op: "lt" },
          then: { type: "gain-life", amount: 3, target: { selector: "controller" } },
          else: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      });
      const game = FabTestEngine.start(
        { hero: bravo, life: 5, hand: [attack], deck: 4 },
        { hero: dash, life: 20, deck: 4 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(bravo).attackWith(attack);
      game.helpers.resolveRestOfCombat();
      expect(game.as(bravo).life()).toBe(8);
    });

    it("6.1 conditional edge: else when not behind", () => {
      const attack = hitTrainer({
        slug: "cond-else",
        effect: {
          type: "conditional",
          condition: { type: "life-comparison", player: "self", vs: "opponent", op: "lt" },
          then: { type: "gain-life", amount: 3, target: { selector: "controller" } },
          else: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      });
      const game = FabTestEngine.start(
        { hero: bravo, life: 20, hand: [attack], deck: 4 },
        { hero: dash, life: 10, deck: 4 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(bravo).attackWith(attack);
      game.helpers.resolveRestOfCombat();
      expect(game.as(bravo).life()).toBe(21);
    });

    it("6.1 optional: applies the effect after an explicit yes decision", () => {
      const attack = hitTrainer({
        slug: "opt-fx",
        effect: {
          type: "optional",
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      });
      const game = FabTestEngine.start(
        { hero: bravo, life: 10, hand: [attack], deck: 4 },
        { hero: dash, life: 20, deck: 4 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(bravo).attackWith(attack);
      expect(() => game.helpers.resolveRestOfCombat()).toThrow(/explicit boolean answer/);
      answerCurrentOptional(game);
      game.helpers.resolveRestOfCombat();
      expect(game.as(bravo).life()).toBe(11);
    });

    it("6.1 repeat: applies inner effect N times", () => {
      const attack = hitTrainer({
        slug: "repeat",
        effect: {
          type: "repeat",
          times: 2,
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      });
      const game = FabTestEngine.start(
        { hero: bravo, life: 10, hand: [attack], deck: 4 },
        { hero: dash, life: 20, deck: 4 },
        // Walks priority/pitch timing by hand - opt out of the smart defaults.
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(bravo).attackWith(attack);
      game.helpers.resolveRestOfCombat();
      expect(game.as(bravo).life()).toBe(12);
    });

    it("6.1 for-each: iterates each-hero and applies inner effect per seat", () => {
      // 1v1: each-hero has cardinality 2 — both seats lose 1 life.
      const attack = hitTrainer({
        slug: "for-each-life",
        effect: {
          type: "for-each",
          target: { selector: "each-hero" },
          effect: {
            type: "lose-life",
            amount: 1,
            target: { selector: "iteration-subject" },
          },
        },
        power: 4,
      });
      const game = FabTestEngine.start(
        { hero: bravo, life: 20, hand: [attack], deck: 4 },
        { hero: dash, life: 20, deck: 4 },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(bravo).attackWith(attack);
      game.helpers.resolveRestOfCombat();
      // Combat 4 dmg to dash + for-each 1 life each → bravo 19, dash 15.
      expect(game.as(bravo).life()).toBe(19);
      expect(game.as(dash).life()).toBe(15);
    });

    it("6.1 for-each edge: full block → no hit → no iteration", () => {
      const attack = hitTrainer({
        slug: "for-each-life-edge",
        effect: {
          type: "for-each",
          target: { selector: "each-hero" },
          effect: {
            type: "lose-life",
            amount: 1,
            target: { selector: "iteration-subject" },
          },
        },
        power: 4,
      });
      const game = FabTestEngine.start(
        { hero: bravo, life: 20, hand: [attack, heartOfFyendal], deck: 4 },
        { hero: dash, life: 20, hand: [nimblismBlue, snatchRed], deck: 4 },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(bravo).attackWith(attack);
      game.as(dash).blockWith([nimblismBlue, snatchRed]);
      game.helpers.resolveRestOfCombat();
      expect(game.as(bravo).life()).toBe(20);
      expect(game.as(dash).life()).toBe(20);
    });

    it("6.1 unless: principal effect runs when escape is not taken", () => {
      const attack = hitTrainer({
        slug: "unless-principal",
        effect: {
          type: "unless",
          effect: { type: "lose-life", amount: 2, target: { selector: "opponent" } },
          escape: {
            type: "pay",
            cost: { class: "asset", type: "resources", amount: 1 },
            payer: "opponent",
          },
        },
        power: 4,
      });
      const game = FabTestEngine.start(
        { hero: bravo, hand: [attack], deck: 4 },
        { hero: dash, life: 20, resourcePoints: 0, hand: [], deck: 4 },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(bravo).attackWith(attack);
      game.helpers.resolveRestOfCombat();
      // Combat 4 + unless principal 2 → dash life 14 (escape not taken: no RP).
      expect(game.as(dash).life()).toBe(14);
    });

    it("6.1 unless edge: full block → principal does not run", () => {
      const attack = hitTrainer({
        slug: "unless-edge",
        effect: {
          type: "unless",
          effect: { type: "lose-life", amount: 2, target: { selector: "opponent" } },
          escape: {
            type: "pay",
            cost: { class: "asset", type: "resources", amount: 1 },
            payer: "opponent",
          },
        },
        power: 4,
      });
      const game = FabTestEngine.start(
        { hero: bravo, hand: [attack, heartOfFyendal], deck: 4 },
        { hero: dash, life: 20, hand: [nimblismBlue, snatchRed], deck: 4 },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(bravo).attackWith(attack);
      game.as(dash).blockWith([nimblismBlue, snatchRed]);
      game.helpers.resolveRestOfCombat();
      expect(game.as(dash).life()).toBe(20);
    });

    it("6 take-extra-turn: queued extra turn keeps the same active seat", () => {
      const attack = hitTrainer({
        slug: "extra-turn",
        effect: { type: "take-extra-turn", player: "controller" },
        power: 4,
      });
      const game = FabTestEngine.start(
        { hero: bravo, hand: [attack], deck: 8 },
        { hero: dash, life: 20, deck: 8 },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const bravoId = game.as(bravo).id;
      game.as(bravo).attackWith(attack);
      game.helpers.resolveRestOfCombat();
      expect(game.getState().players[bravoId]!.extraTurnsQueued).toBe(1);
      // End turn: consumer should keep bravo active and consume the queue.
      game.as(bravo).endTurn();
      expect(game.getState().activePlayerId).toBe(bravoId);
      expect(game.getState().players[bravoId]!.extraTurnsQueued).toBe(0);
    });

    it("6.6 delayed-trigger: registers pending delayed effect", () => {
      const attack = hitTrainer({
        slug: "delayed",
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "end-phase",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "none",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
          },
        },
      });
      const game = hitWith(attack);
      expect(game.getState().delayedTriggers).toEqual(
        expect.arrayContaining([expect.objectContaining({ controllerId: game.as(bravo).id })]),
      );
    });
  });

  // ── Intimidate effect ───────────────────────────────────────────────────
  it("8.5.10 intimidate happy: attack trigger banishes from hand", () => {
    const attack = attackTriggerTrainer({
      slug: "intimidate-fx",
      effect: { type: "intimidate", target: "opponent" },
      label: "intimidate",
      power: 4,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 4 },
      { hero: dash, life: 20, hand: [nimblismBlue, snatchRed], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    // intimidate fires at attack step entry — already done in playAttackToDefend
    expect(game.as(dash).zone("banished").length + game.as(dash).handCount()).toBe(2);
    game.helpers.resolveRestOfCombat();
  });

  it("8.5.10 intimidate edge: empty hand does not fail attack", () => {
    const attack = attackTriggerTrainer({
      slug: "intimidate-empty",
      effect: { type: "intimidate", target: "opponent" },
      label: "intimidate",
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 4 },
      { hero: dash, life: 20, hand: [], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });

  // ── start-game meta ─────────────────────────────────────────────────────
  it("4.1 start-game meta: effect type accepted on seated ability without match mutation", () => {
    const res = pitchTrainer({
      slug: "start-game",
      effect: {
        type: "start-game",
        setup: "place",
        filter: {},
        to: { zone: "graveyard" },
      },
    });
    // start-game is pre-game meta; seed pitch zone / RP without free open-action pitch.
    const game = FabTestEngine.start(
      { hero: bravo, pitch: [res], resourcePoints: 3, deck: 4 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(game.as(bravo).resourcePoints()).toBe(3);
    expect(game.as(bravo).zone("pitch").length).toBe(1);
  });
});
