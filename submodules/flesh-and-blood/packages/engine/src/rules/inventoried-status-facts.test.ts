import { describe, expect, it } from "vite-plus/test";
import { briar } from "../../../cards/src/cards/heroes/briar.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { nimblismBlue } from "../../../cards/src/cards/actions/nimblism.ts";
import { snatchRed } from "../../../cards/src/cards/actions/snatch.ts";
import { ravenousRabbleRed } from "../../../cards/src/cards/actions/ravenous-rabble.ts";
import { rhinar } from "../../../cards/src/cards/heroes/rhinar.ts";
import { scabskinLeathers } from "../../../cards/src/cards/equipment/scabskin-leathers.ts";
import { dawnblade } from "../../../cards/src/cards/weapons/dawnblade.ts";
import { FAB_MANUAL_HARNESS } from "../testing/harness-config.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import type { CommittedEvent } from "./events.ts";
import { EMPTY_RULES_FACTS, evaluateFabRules } from "./rules-evaluator.ts";
import { buildFabRulesView } from "./state-rules-view.ts";
import type { FabResolvedBindings } from "./continuous/ir.ts";

const emptyBindings: FabResolvedBindings = { objects: {}, numbers: {}, strings: {} };

const INVENTORIED_MARKERS = [
  "has-lost-life-this-turn",
  "last-attack-on-combat-chain-hit",
  "played-at-chain-link-4-or-higher",
  "played-at-chain-link-3-or-higher",
  "yellow-card-in-pitch-zone",
  "defending-hero-has-cards-in-soul",
  "defended-by-action",
  "charged-to-play",
  "played-or-activated-this-chain-link-attack-reaction",
  "attacked-or-defended-with-attack-action-this-turn",
  "last-action-card-played-this-turn-was-lightning",
  "first-action-of-your-turn",
  "chose-war",
  "chose-peace",
  "revealed-power-greater-than-damage-dealt-this-turn",
  "attacking-with-weapon-this-chain-link",
  "face-up-in-any-zone",
  "rune-gated",
  "dealt-arcane-lt-bind-counters-on-self",
  "this-has-not-hit-this-turn",
] as const;

describe("inventoried has-status facts (first-class ledger)", () => {
  it("evaluates every inventoried marker without throwing", () => {
    const view = evaluateFabRules({ objects: [], atoms: [] });
    const context = { controllerId: "p1", source: null, bindings: emptyBindings };
    for (const status of INVENTORIED_MARKERS) {
      expect(
        () => view.evaluateCondition({ type: "has-status", status }, context),
        status,
      ).not.toThrow();
    }
  });

  it("first-action-of-your-turn is true before any action is played", () => {
    const view = evaluateFabRules({ objects: [], atoms: [] });
    expect(
      view.evaluateCondition(
        { type: "has-status", status: "first-action-of-your-turn" },
        { controllerId: "p1", source: null, bindings: emptyBindings },
      ),
    ).toBe(true);
  });

  it("derives every printed die threshold from the highest roll this turn", () => {
    const context = { controllerId: "p1", source: null, bindings: emptyBindings };
    const atFive = evaluateFabRules({
      objects: [],
      atoms: [],
      facts: {
        ...EMPTY_RULES_FACTS,
        playerHighestDieRollThisTurn: { p1: 5 },
        playerPerformedThisTurn: {
          p1: {
            ...EMPTY_RULES_FACTS.playerPerformedThisTurn.p1,
            "roll-4-or-higher": true,
            "roll-5-or-higher": true,
          },
          p2: EMPTY_RULES_FACTS.playerPerformedThisTurn.p2,
        },
      },
    });

    expect(
      atFive.evaluateCondition(
        { type: "performed-this-turn", event: "roll-4-or-higher", player: "controller" },
        context,
      ),
    ).toBe(true);
    expect(
      atFive.evaluateCondition(
        { type: "performed-this-turn", event: "roll-6", player: "controller" },
        context,
      ),
    ).toBe(false);

    const atSix = evaluateFabRules({
      objects: [],
      atoms: [],
      facts: {
        ...EMPTY_RULES_FACTS,
        playerHighestDieRollThisTurn: { p1: 6 },
        playerPerformedThisTurn: {
          p1: {
            ...EMPTY_RULES_FACTS.playerPerformedThisTurn.p1,
            "roll-4-or-higher": true,
            "roll-5-or-higher": true,
            "roll-6": true,
          },
          p2: EMPTY_RULES_FACTS.playerPerformedThisTurn.p2,
        },
      },
    });
    expect(
      atSix.evaluateCondition(
        { type: "performed-this-turn", event: "roll-6", player: "controller" },
        context,
      ),
    ).toBe(true);
  });

  it("a real die roll updates highestDieRoll and the derived threshold facts", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [scabskinLeathers],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: briar, deck: 6, life: 20 },
      { ...FAB_MANUAL_HARNESS, seed: "highest-die-roll-facts" },
    );
    const Rhinar = game.as(rhinar);
    expect(game.getState().players[Rhinar.id]!.history.turn.highestDieRoll).toBe(0);

    Rhinar.activate(scabskinLeathers);
    game.helpers.resolveUntilIdle();

    const roll = game
      .committedEvents()
      .find((event): event is CommittedEvent<"roll"> => event.name === "roll");
    expect(roll, "expected the activated die roll to commit").toBeDefined();
    const face = roll!.data.result;

    // Kernel recording: the committed roll is the turn's highest die face.
    expect(game.getState().players[Rhinar.id]!.history.turn.highestDieRoll).toBe(face);
    // Fact derivation: the projected threshold matches the same face.
    const view = buildFabRulesView(game.getState());
    const context = { controllerId: Rhinar.id, source: null, bindings: emptyBindings };
    expect(
      view.evaluateCondition(
        { type: "performed-this-turn", event: "roll-4-or-higher", player: "controller" },
        context,
      ),
    ).toBe(face >= 4);
    expect(
      view.evaluateCondition(
        { type: "performed-this-turn", event: "roll-6", player: "controller" },
        context,
      ),
    ).toBe(face === 6);
  });

  it("hero-lost-life-this-turn becomes true after a proven hit", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        deck: [nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
        life: 20,
      },
      { hero: briar, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.getState().players[game.as(briar).id]!.history.turn.lostLife).toBe(true);
    expect(game.getState().players[Dash.id]!.history.turn.lostLife).toBe(false);
    expect(
      buildFabRulesView(game.getState()).evaluateCondition(
        {
          type: "compare-amount",
          amount: { type: "count", what: "heroes-lost-life-this-turn" },
          comparison: { op: "gte", value: 1 },
        },
        { controllerId: Dash.id, source: null, bindings: emptyBindings },
      ),
    ).toBe(true);
  });

  it("last-attack-on-combat-chain-hit stamps the prior link when a second attack opens", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ravenousRabbleRed, ravenousRabbleRed],
        deck: [nimblismBlue, nimblismBlue],
        actionPoints: 1,
        life: 20,
      },
      { hero: briar, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(ravenousRabbleRed, { target: game.as(briar).id });
    game.passBoth();
    game.advanceCombatTo("resolution");
    expect(game.getState().players[Dash.id]!.history.combatChain.lastAttackDidHit).toBe(true);
    Dash.play(ravenousRabbleRed, { target: game.as(briar).id });
    game.passBoth();
    expect(game.getState().players[Dash.id]!.history.combatChain.lastAttackDidHit).toBe(true);
  });

  it("this-has-not-hit-this-turn is true until this source produces a hit", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [dawnblade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
        life: 20,
      },
      { hero: briar, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const bladeId = Dash.card(dawnblade);
    const viewBefore = buildFabRulesView(game.getState());
    expect(
      viewBefore.evaluateCondition(
        { type: "has-status", status: "this-has-not-hit-this-turn" },
        {
          controllerId: Dash.id,
          source: {
            instanceId: bladeId,
            incarnation: game.getState().objects[bladeId]!.incarnation,
          },
          bindings: emptyBindings,
        },
      ),
    ).toBe(true);

    Dash.activate(dawnblade);
    game.helpers.resolveRestOfCombat();

    const viewAfter = buildFabRulesView(game.getState());
    expect(game.getState().players[Dash.id]!.history.turn.hitOutcomes).toEqual(
      expect.arrayContaining([expect.objectContaining({ sourceObjectId: bladeId })]),
    );
    expect(
      viewAfter.evaluateCondition(
        { type: "has-status", status: "this-has-not-hit-this-turn" },
        {
          controllerId: Dash.id,
          source: {
            instanceId: bladeId,
            incarnation: game.getState().objects[bladeId]!.incarnation,
          },
          bindings: emptyBindings,
        },
      ),
    ).toBe(false);
  });
});
