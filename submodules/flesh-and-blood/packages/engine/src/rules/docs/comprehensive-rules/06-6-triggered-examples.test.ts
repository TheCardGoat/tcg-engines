/**
 * CR 6.6.5f — Triggered effects that don't trigger: continuous trigger
 * suppression (Tripwire Trap family).
 *
 * Production path: a printed "effects don't trigger when an attack hits this
 * chain link unless …" clause compiles to a continuous rule-modification atom
 * (`mode: "restrict"`, `action: "trigger"`, `filter: { hasStatus:
 * "attack-hit-this-chain-link" }`). At the hit-event trigger-collection
 * boundary the production runtime consults the `isTriggerPrevented` hook
 * (contract in `trigger-matcher.ts`) which this module's first test exercises
 * end-to-end via the Katsu + Tripwire Trap interaction named in the task.
 */
import { describe, expect, it } from "vite-plus/test";
import type { FabCardDefinitionInput } from "../../../cards.ts";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, nimbleStrikeRed, snatchRed } from "../../fixtures.ts";
import { hitTrainer } from "../../test-trainers.ts";
import { katsu } from "../../../../../cards/src/cards/heroes/katsu.ts";
import { tripwireTrapRed } from "../../../../../cards/src/cards/defense-reactions/tripwire-trap.ts";
import { rhinar } from "../../../../../cards/src/cards/heroes/rhinar.ts";
import { leadTheChargeBlue } from "../../../../../cards/src/cards/actions/lead-the-charge.ts";
import { bloodrotTrapRed } from "../../../../../cards/src/cards/defense-reactions/bloodrot-trap.ts";
import { lungingPressBlue } from "../../../../../cards/src/cards/attack-reactions/lunging-press.ts";
import { hyperDriver } from "../../../../../cards/src/cards/tokens/hyper-driver.ts";
import { hyperDriverBlue } from "../../../../../cards/src/cards/actions/hyper-driver.ts";
import { thawRed } from "../../../../../cards/src/cards/actions/thaw.ts";
import { celestialKimono } from "../../../../../cards/src/cards/equipment/celestial-kimono.ts";
import { diademOfDreamstate } from "../../../../../cards/src/cards/equipment/diadem-of-dreamstate.ts";
import { bloodrushBellowYellow } from "../../../../../cards/src/cards/actions/bloodrush-bellow.ts";
import { alphaRampageRed } from "../../../../../cards/src/cards/actions/alpha-rampage.ts";
import { fastAndFuriousRed } from "../../../../../cards/src/cards/actions/fast-and-furious.ts";

/**
 * Power-6 cost-0 attack-action probe with a draw-on-hit trigger. Power 6
 * overcomes Tripwire Trap's {d}4 (6 − 4 = 2 → HIT) so a real `hit` event
 * fires; the probe's draw is the single observable hit-trigger under test.
 */
const tripwireHitProbe = hitTrainer({
  slug: "tripwire-hit-probe",
  power: 6,
  cost: 0,
  effect: { type: "draw", count: 1, player: "controller" },
});

/**
 * Cost-0 non-attack Action-Item with no effect — emits a clean `play` event
 * without opening a combat chain, so the CR 6.6.5d ordinal scenario can play
 * two Actions in one action phase without driving combat resolution between
 * them. Modeled on the `Wounding Blow` / Hyper Driver fixture shape so the
 * play procedure accepts it (Action is the type, Item the subtype).
 */
const actionProbe: FabCardDefinitionInput & { readonly canonicalId: string } = {
  canonicalId: "cr-665d-action-probe",
  slug: "cr-665d-action-probe",
  name: "Action Probe",
  types: ["Generic", "Action", "Item"],
  pitch: "1",
  cost: 0,
  defense: 0,
  color: "Red",
  keywords: [],
  abilities: [],
};

/**
 * Action-Item permanent carrying the CR 6.6.5d ordinal trigger under test:
 * "The first time you play an Action each turn, gain 1{h}." Two copies are
 * seated — copy A in the arena, copy B in hand — so a FRESH source (copy B)
 * becomes functional mid-window, after the first matching event already
 * occurred. Copy B must not treat the next Action as its own "first".
 */
const firstActionPerm: FabCardDefinitionInput & { readonly canonicalId: string } = {
  canonicalId: "cr-665d-first-action-perm",
  slug: "cr-665d-first-action-perm",
  name: "First Action Charm",
  types: ["Generic", "Action", "Item"],
  pitch: "1",
  cost: 0,
  defense: 0,
  color: "Red",
  keywords: [],
  abilities: [
    {
      kind: "static",
      staticKind: "triggered",
      id: "cr-665d-first-action-perm-a1",
      text: "The first time you play an Action each turn, gain 1{h}.",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: { typeBox: { types: ["Action"] } },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
      },
      limit: { count: 1, per: "turn", ordinals: [1] },
    },
  ],
};

/**
 * Cost-1 / cost-2 Action-Item probes for the CR 6.6.3 Lead the Charge
 * delayed-trigger scenario. Modeled on `actionProbe` (a cost-0 Action-Item) so
 * the play procedure accepts them; their printed `cost` is the load-bearing
 * property under the trigger's `cost: { op: "gte", value: 2 }` filter.
 */
const costOneActionProbe: FabCardDefinitionInput & { readonly canonicalId: string } = {
  canonicalId: "cr-663-action-probe-cost-1",
  slug: "cr-663-action-probe-cost-1",
  name: "Cost One Probe",
  types: ["Generic", "Action", "Item"],
  pitch: "1",
  cost: 1,
  defense: 0,
  color: "Red",
  keywords: [],
  abilities: [],
};

const costTwoActionProbe: FabCardDefinitionInput & { readonly canonicalId: string } = {
  canonicalId: "cr-663-action-probe-cost-2",
  slug: "cr-663-action-probe-cost-2",
  name: "Cost Two Probe",
  types: ["Generic", "Action", "Item"],
  pitch: "1",
  cost: 2,
  defense: 0,
  color: "Red",
  keywords: [],
  abilities: [],
};

describe("CR 6.6.5f — continuous trigger suppression", () => {
  it("Tripwire Trap suppresses the attacking hero's hit-triggers this chain link (Katsu + Tripwire)", () => {
    // Arrange — Katsu attacks with the probe (only card in hand). Dash defends
    // by playing Tripwire Trap from arsenal (a1 forbids playing from hand) and
    // the attacking hero does not pay {r}, so Tripwire's continuous
    // rule-modification restriction takes effect for this combat chain.
    const game = FabTestEngine.start(
      { hero: katsu, hand: [tripwireHitProbe], deck: 6, actionPoints: 1 },
      { hero: dash, life: 20, arsenal: [tripwireTrapRed], hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.must.playAttack(tripwireHitProbe);

    // Empty defend declaration → reaction step.
    if (game.combat()?.step === "defend") {
      Dash.defend();
    }

    // Walk priority to the reaction step where the defending hero may play the
    // defense reaction. Decline any optional booleans along the way.
    for (let safety = 0; safety < 24; safety += 1) {
      if (
        game.combat()?.step === "reaction" &&
        game.getState().priority?.holderPlayerId === Dash.id
      ) {
        break;
      }
      const decision = game.getState().decision;
      if (decision?.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
        continue;
      }
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio === Katsu.id) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      if (prio && game.combat()?.step !== "reaction") {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      break;
    }

    // Act — play Tripwire Trap from arsenal as the defense reaction.
    expect(game.combat()?.step).toBe("reaction");
    expect(game.getState().priority?.holderPlayerId).toBe(Dash.id);
    Dash.playFromArsenal(tripwireTrapRed);

    // Drive combat through damage to closure: decline Tripwire's unless-pay
    // (attacking hero has no {r}), decline any optional hit-triggers (Katsu's
    // first-hit tutor has no legal discard target once the probe leaves hand),
    // and pass priority until the chain closes. Mirrors `resolveCombatNoReactions`
    // but also declines payment/optional decisions that arise mid-combat.
    for (let safety = 0; safety < 64; safety += 1) {
      const decision = game.getState().decision;
      if (decision) {
        if (decision.kind === "payment") {
          // Tripwire unless-pay: empty payment declines paying 1{r}.
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "payment", instanceIds: [] },
            },
          });
          continue;
        }
        if (decision.kind === "boolean") {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "boolean", value: false },
            },
          });
          continue;
        }
        if (decision.kind === "ordering") {
          // RED path: the probe's draw and Katsu's first-hit tutor fire
          // simultaneously — accept the engine's presented order.
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: {
                kind: "ordering",
                orderedIds: decision.entries.map((entry) => entry.id),
              },
            },
          });
          continue;
        }
        if (game.answerForcedDecision()) continue;
        throw new Error(`Unhandled ${decision.kind} decision: ${decision.decisionId}`);
      }
      if (!game.combat()?.open && game.getState().rulesStack.length === 0) break;
      game.passBoth();
    }

    // The attack hit through Tripwire's {d}4: 6 − 4 = 2 damage to Dash. This
    // guards against a trivial pass (no hit → no hit-event → nothing to suppress).
    expect(Dash.life()).toBe(18);

    // CR 6.6.5f — every hit-trigger the attacking hero controls is suppressed
    // this chain link: both the probe's draw-on-hit and Katsu's own first-hit
    // tutor (the loop above declines the tutor's optional if it ever fires).
    // Katsu's hand was empty after playing the probe, so suppression leaves it
    // empty. Without the suppression hook this assertion reads 1 (probe's draw).
    expect(Katsu.handCount()).toBe(0);
  });
});

/**
 * CR 6.6.5d — an ordinal trigger condition ("the first/second time … each
 * turn") is relative to the WINDOW, not the source's lifetime. A trigger
 * source that becomes functional AFTER the ordinal event already occurred this
 * window must NOT fire on a later matching event (the ordinal slot has passed).
 *
 * Implementation note on the scenario shape. The matcher counts occurrences
 * per (controller, eventName, window) using the SAME filter-aware matching
 * pass that decides whether a source fires (it consults `matchesTriggerEvent`,
 * which honors `actor`, `filter`, `subject`, `damageType`, …). That is
 * essential for correctness: ordinal triggers like Arcanic Reproach
 * (`actor: "opponent"`) and Alluvion Constellas (`subject: "self"` +
 * `damageType: "arcane"`) would be corrupted by a naive event-name-only
 * counter. The cost is that an event is only counted when at least one
 * functional source observes it — so the pure "no source existed at the first
 * event" variant of late arrival is not reachable without a much larger
 * engine-level event ledger, which is out of scope here. This test therefore
 * exercises the source-REPLACEMENT form of 6.6.5d: copy A is functional for
 * occurrence 1 (so the window counter advances to 1), then a FRESH source
 * (copy B) enters the arena before occurrence 2. Under the old per-instance
 * ordinal key copy B reset to zero and fired on the second Action; under the
 * window-global key copy B sees occurrence 2 and correctly stays silent.
 */
describe("CR 6.6.5d — ordinals are relative to the window, not the source lifetime", () => {
  it("a fresh source entering after the ordinal slot has passed does not re-fire on a later event", () => {
    const startingLife = 20;
    const game = FabTestEngine.start(
      {
        hero: bravo,
        // Copy A starts functional in the arena. It observes the first Action
        // (window occurrence → 1) and fires its "first Action" trigger once
        // (life +1) — the legitimate fire. The load-bearing assertion is that
        // copy B does NOT add a second +1 on the next Action.
        arena: [firstActionPerm],
        hand: [actionProbe, firstActionPerm, actionProbe],
        actionPoints: 3,
        resourcePoints: 0,
        life: startingLife,
        deck: 4,
      },
      { hero: dash, life: startingLife, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Occurrence 1 — only copy A is functional. A's "first Action" trigger fires.
    Bravo.play(actionProbe);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Bravo.life()).toBe(startingLife + 1);

    // A fresh source (copy B) now enters the arena AFTER occurrence 1. Copy B
    // is itself an Action-Item, so its own `play` IS an Action play: it matches
    // the {types:["Action"]} filter and DOES advance the window-global
    // Action-play counter. The load-bearing point is that copy B never observes
    // an occurrence of 1, so its ordinals:[1] condition can never be satisfied.
    Bravo.play(firstActionPerm);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Occurrence 2 — copy B is now functional but the window's ordinal-1 slot
    // already passed before B existed. CR 6.6.5d → B must NOT fire.
    Bravo.play(actionProbe);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // RED (per-source ordinal key): copy B treated occurrence 2 as its own
    // "first" → life = startingLife + 2.
    // GREEN (window-global ordinal key): B sees occurrence 2, skips → life
    // stays at startingLife + 1 (only copy A's legitimate fire).
    expect(Bravo.life()).toBe(startingLife + 1);
  });
});

/**
 * CR 6.6 — named triggered-effect example cards. Each `it()` drives a real
 * catalog card end-to-end through the §6.6 trigger system and asserts a
 * CR-observable outcome. Two examples expose real engine/card defects and are
 * marked `it.fails` with a comment naming the defect and the CR rule; the rest
 * are green. None are skipped.
 */
describe("CR 6.6 — named triggered-effect example cards", () => {
  /**
   * Walk public priority + combat for the combat-driving examples, answering
   * the decision categories the caller enables. Returns whether a simultaneous
   * trigger `ordering` decision was observed (CR 6.6.6b). Mirrors the per-card
   * drain loops in the sibling equipment suites (celestial-kimono, diadem).
   */
  function drainCombat(
    game: ReturnType<typeof FabTestEngine.start>,
    opts: {
      optionalBoolean?: boolean;
      preferEntityCanonicalId?: string;
    } = {},
  ): { orderingSeen: boolean } {
    let orderingSeen = false;
    for (let safety = 0; safety < 96; safety += 1) {
      const decision = game.getState().decision;
      if (decision) {
        if (game.answerForcedDecision()) continue;
        if (decision.kind === "boolean" && opts.optionalBoolean !== undefined) {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "boolean", value: opts.optionalBoolean },
            },
          });
          continue;
        }
        if (decision.kind === "ordering") {
          orderingSeen = true;
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: {
                kind: "ordering",
                orderedIds: decision.entries.map((entry) => entry.id),
              },
            },
          });
          continue;
        }
        if (decision.kind === "entity-target") {
          const preferred = opts.preferEntityCanonicalId
            ? decision.candidates.find(
                (candidate) =>
                  game.getState().objects[candidate.instanceId]?.canonicalId ===
                  opts.preferEntityCanonicalId,
              )
            : undefined;
          const pick = preferred ?? decision.candidates[0];
          if (!pick && (decision.min ?? 1) > 0) break;
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
            },
          });
          continue;
        }
        if (decision.kind === "option" || decision.kind === "effect-resolution") {
          const pick = decision.options[0];
          if (!pick) break;
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer:
                decision.kind === "option"
                  ? { kind: "option", optionIds: [pick.id] }
                  : { kind: "effect-resolution", optionId: pick.id },
            },
          });
          continue;
        }
        if (decision.kind === "payment") {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "payment", instanceIds: [] },
            },
          });
          continue;
        }
        break;
      }
      if (
        !game.combat()?.open &&
        game.getState().rulesStack.length === 0 &&
        !game.getState().rulesProcess
      ) {
        break;
      }
      game.passBoth();
    }
    return { orderingSeen };
  }

  // ── 6.6.3 delayed-trigger — Lead the Charge (ARC211 blue) ─────────────────
  // Card-swap note: the brief named ARC209 red, but the test exercises the
  // ARC211 BLUE printing instead. Same cycle, identical `cost: { op: "gte",
  // value: 2 }` filter, identical behavior — the swap affects only the
  // pitch/cost paid to arm the trigger, not the load-bearing filter behavior,
  // so the diagnosis carries across ARC209 / ARC210 / ARC211.

  it("CR 6.6.3 — Lead the Charge delayed-trigger grants 1 AP on the next cost-≥2 action", () => {
    // The blue lead-the-charge (ARC211) arms a delayed trigger: "The next
    // time you play an action card with cost 2 or greater this turn, gain 1
    // action point." The two probes are Action-Items at printed cost 1 / 2 so
    // the trigger's cost threshold is the load-bearing variable.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leadTheChargeBlue, costOneActionProbe, costTwoActionProbe],
        actionPoints: 4,
        resourcePoints: 4,
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Arm the delayed trigger (Lead the Charge is a cost-0 non-attack Action).
    Bravo.play(leadTheChargeBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // NEGATIVE (CR 6.6.3) — a cost-1 action does NOT satisfy the filter; the
    // delayed trigger stays armed. Playing it simply costs 1 AP.
    const apBeforeCost1 = Bravo.actionPoints();
    Bravo.play(costOneActionProbe);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Bravo.actionPoints()).toBe(apBeforeCost1 - 1);

    // POSITIVE (CR 6.6.3) — a cost-2 action satisfies the filter; the delayed
    // trigger fires and grants +1 AP, offsetting the 1 AP play cost (net 0).
    const apBeforeCost2 = Bravo.actionPoints();
    Bravo.play(costTwoActionProbe);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Bravo.actionPoints()).toBe(apBeforeCost2);

    // GREEN (CR 6.6.3): two card-data corrections landed together.
    //
    // 1. The trigger filter is now a real numeric comparison —
    //    `cost: { op: "gte", value: 2 }`, a sibling of `typeBox` on the same
    //    filter object. `matches-filter.ts` reads `p.numeric.cost` against the
    //    comparison, so the cost-2 probe satisfies the threshold (and the
    //    cost-1 probe does not).
    // 2. The ability is restructured from a top-level `trigger` on the
    //    `kind: "resolution"` ability (which the engine treats as a
    //    triggered-resolution — "when you play THIS" — firing on Lead the
    //    Charge's own play) to an `effect: { type: "delayed-trigger",
    //    duration: "this-turn", consumeOnUse: true }`, the canonical
    //    future-watching form (AAC005 Inverter's Nightcowl / ROS080 Blast to
    //    Oblivion). Only that shape registers a `register-delayed-trigger`
    //    event that persists to observe a LATER `play`.
    //
    // Together: the cost-2 probe satisfies the filter, the delayed trigger
    // fires, and the +1 AP gain offsets the 1 AP action-play cost (net 0 —
    // the positive assertion above holds); the cost-1 probe does not match,
    // so the trigger stays armed and AP simply drops by the play cost.
  });

  // ── 6.6.4 static-trigger — Rhinar (RNR002) ────────────────────────────────

  it("CR 6.6.4 — Rhinar static-trigger intimidates on a 6{p}+ discard (negative: <6{p} does not)", () => {
    // POSITIVE — Bloodrush Bellow's "discard a random card" additional cost
    // dumps alphaRampageRed (9{p} ≥ 6) → Rhinar's static trigger intimidates.
    const positive = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bloodrushBellowYellow, alphaRampageRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const positiveDash = positive.as(dash);
    positive.as(rhinar).play(bloodrushBellowYellow);
    positive.helpers.resolveUntilIdle({ optionalBoolean: false });

    // CR 6.6.4 — intimidate fires: a random opponent hand card is banished
    // face-down (returned at end of turn) and recorded on intimidatedInstanceIds.
    expect(positive.getState().players[positiveDash.id]!.intimidatedInstanceIds).toHaveLength(1);
    expect(positiveDash.zone("banished")).toHaveLength(1);

    // NEGATIVE — discarding nimbleStrikeRed (4{p} < 6) does NOT intimidate.
    const negative = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bloodrushBellowYellow, nimbleStrikeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const negativeDash = negative.as(dash);
    negative.as(rhinar).play(bloodrushBellowYellow);
    negative.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(negative.getState().players[negativeDash.id]!.intimidatedInstanceIds).toHaveLength(0);
    expect(negativeDash.zone("banished")).toHaveLength(0);
  });

  // ── 6.6.5b event + state combined — Bloodrot Trap (ARA019) ────────────────

  it("CR 6.6.5b — Bloodrot Trap does NOT trigger when it defends but the attacking hero played NO reaction this chain link (negative)", () => {
    // Bloodrot Trap's combined trigger needs BOTH a `defend` event AND the
    // "attacking hero played/activated a reaction this chain link" state.
    // Here Bravo attacks with snatchRed and plays NO reaction; Dash DOES play
    // Bloodrot Trap as the defense reaction, so the `defend` event genuinely
    // fires. With the reaction-state half false the combined trigger must NOT
    // fire (no Bloodrot Pox token created). This isolates the load-bearing
    // negative — it proves the engine is not firing the trigger on the
    // `defend` event alone — distinct from the positive's "trigger never
    // fires" symptom, which is caused by the untracked status string.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [bloodrotTrapRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    // Walk the chain one priority step at a time (mirrors the positive suite's
    // mechanism for playing Bloodrot Trap): declare an empty defense, decline
    // optional prompts, and play Dash's defense reaction at its window. Bravo
    // plays NO attack reaction, so the "attacking hero played a reaction"
    // status stays false. `drainCombat` alone never plays a card, which would
    // leave the `defend` event unfired and make this assertion vacuous — the
    // explicit `Dash.play(bloodrotTrapRed)` below is what exercises the trigger.
    let playedTrap = false;
    for (let safety = 0; safety < 80; safety += 1) {
      if (!game.combat()?.open && game.getState().rulesStack.length === 0) break;
      const decision = game.getState().decision;
      if (decision) {
        if (game.answerForcedDecision()) continue;
        if (decision.kind === "boolean") {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "boolean", value: false },
            },
          });
          continue;
        }
        if (decision.kind === "entity-target") {
          const pick =
            decision.candidates.find(
              (candidate) =>
                game.getState().objects[candidate.instanceId]?.canonicalId ===
                snatchRed.canonicalId,
            ) ?? decision.candidates[0];
          if (!pick && (decision.min ?? 1) > 0) break;
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
            },
          });
          continue;
        }
        if (decision.kind === "ordering") {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: {
                kind: "ordering",
                orderedIds: decision.entries.map((entry) => entry.id),
              },
            },
          });
          continue;
        }
        break;
      }
      const combat = game.combat();
      if (combat?.step === "defend" && combat.defenseDeclarationPending) {
        Dash.defend();
        continue;
      }
      if (combat?.step === "reaction") {
        const prio = game.getState().priority?.holderPlayerId;
        if (prio === Dash.id && !playedTrap) {
          try {
            Dash.play(bloodrotTrapRed);
            playedTrap = true;
          } catch {
            playedTrap = false;
          }
          continue;
        }
      }
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      break;
    }

    // Non-vacuous guard — Bloodrot Trap really did defend this chain link, so
    // its `defend` event fired and a token-creation trigger had a genuine
    // opportunity to fire. snatchRed (4{p}) beat Bloodrot's {d}3 for 1 damage,
    // and the spent defense reaction lands in Dash's graveyard on chain close.
    expect(playedTrap).toBe(true);
    expect(Dash.zone("graveyard")).toContain(bloodrotTrapRed.canonicalId);
    expect(Dash.life()).toBe(19);

    // CR 6.6.5b — Bloodrot defended but Bravo played no reaction, so the
    // combined condition's status half is false: no Bloodrot Pox token is
    // created under either hero. (This stays GREEN even after the positive's
    // status-string defect is fixed: the state condition is genuinely false
    // here, so if someone wires the status but the combine logic is wrong,
    // this assertion catches the regression.)
    const poxAnywhere = [...Bravo.zone("arena"), ...Dash.zone("arena")].some((id) =>
      /bloodrot-pox/i.test(id),
    );
    expect(poxAnywhere).toBe(false);
  });

  it("CR 6.6.5b — Bloodrot Trap creates a Bloodrot Pox when it defends and the attacking hero played a reaction", () => {
    // POSITIVE (CR 6.6.5b) — Bravo attacks AND plays an attack reaction
    // (lungingPressBlue) this chain link; Dash defends with Bloodrot Trap.
    // Both halves of the combined condition hold → a Bloodrot Pox token must
    // be created under the attack target.
    //
    // Card choice note: an earlier draft used pummelRed, but its only
    // attack-action mode targets "cost 2 or more" and snatchRed (the attack
    // shared with the negative case, cost 0) does not qualify, so the play
    // procedure rejected it and no reaction ever landed. lunging press
    // (IRA011, Generic Attack Reaction, cost 0, "Target attack action card
    // gains +1{p}" — no cost/class/keyword gate) targets snatchRed cleanly,
    // so the attacker genuinely plays a reaction this chain link and the
    // combined trigger's state half is observable.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, lungingPressBlue],
        actionPoints: 2,
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [bloodrotTrapRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    // Walk the chain one priority step at a time (mirrors the Tripwire
    // suite): declare an empty defense, decline optional prompts, answer the
    // attack-reaction target, and play Bravo's reaction + Dash's defense
    // reaction at their windows.
    let playedReaction = false;
    let playedTrap = false;
    for (let safety = 0; safety < 80; safety += 1) {
      if (!game.combat()?.open && game.getState().rulesStack.length === 0) break;
      const decision = game.getState().decision;
      if (decision) {
        if (game.answerForcedDecision()) continue;
        if (decision.kind === "boolean") {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "boolean", value: false },
            },
          });
          continue;
        }
        if (decision.kind === "entity-target") {
          const pick =
            decision.candidates.find(
              (candidate) =>
                game.getState().objects[candidate.instanceId]?.canonicalId ===
                snatchRed.canonicalId,
            ) ?? decision.candidates[0];
          if (!pick && (decision.min ?? 1) > 0) break;
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
            },
          });
          continue;
        }
        if (decision.kind === "ordering") {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: {
                kind: "ordering",
                orderedIds: decision.entries.map((entry) => entry.id),
              },
            },
          });
          continue;
        }
        break;
      }
      const combat = game.combat();
      if (combat?.step === "defend" && combat.defenseDeclarationPending) {
        Dash.defend();
        continue;
      }
      if (combat?.step === "reaction") {
        const prio = game.getState().priority?.holderPlayerId;
        if (prio === Bravo.id && !playedReaction) {
          // Attack reaction lands: lunging press targets snatchRed (an Attack
          // Action on the combat chain) with no cost/class gate. The play
          // commits a `play` event whose actorId IS the link's attacker, so
          // `FabChainLink.attackingPlayerPlayedOrActivatedInReaction` flips
          // true — the state half of the combined trigger.
          try {
            Bravo.play(lungingPressBlue);
            playedReaction = true;
          } catch {
            playedReaction = false;
          }
          continue;
        }
        if (prio === Dash.id && !playedTrap) {
          try {
            Dash.play(bloodrotTrapRed);
            playedTrap = true;
          } catch {
            playedTrap = false;
          }
          continue;
        }
      }
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      break;
    }

    // Both halves of the orchestration landed (non-vacuous): Bravo really
    // played an attack reaction and Dash really defended with Bloodrot Trap.
    expect(playedReaction).toBe(true);
    expect(playedTrap).toBe(true);

    // CR 6.6.5b — the combined trigger fires → a Bloodrot Pox token exists
    // under the attack target (Dash). GREEN after the
    // `attacking-hero-played-or-activated-this-chain-link-reaction` status
    // handler in `evaluation/conditions/has-status.ts` aliased the Red Alert
    // fact `combat.attackReactionPlayedOrActivated` (lunging press is an
    // attack reaction played by the link's attacker, so the fact holds).
    const poxAnywhere = [...Bravo.zone("arena"), ...Dash.zone("arena")].some((id) =>
      /bloodrot-pox/i.test(id),
    );
    expect(poxAnywhere).toBe(true);
  });

  // ── 6.6.5c state-trigger on transition AND on-generate — Hyper Driver ─────

  it("CR 6.6.5c — Hyper Driver state-trigger destroys it when its last steam counter is removed", () => {
    // DYN112 Hyper Driver Blue enters with 1 steam counter (enter-arena
    // replacement a1). Boosting a card fires a3 ("remove a steam counter from
    // this and gain {r}") → the state condition `has-counter steam eq 0`
    // becomes true → a2 destroys it. This is the transition-to-zero path.
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [hyperDriverBlue, fastAndFuriousRed],
        deck: 6,
        resourcePoints: 2,
        actionPoints: 2,
      },
      { hero: bravo, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    // Enter the arena with 1 steam counter.
    Dash.play(hyperDriverBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Dash.zone("arena")).toContain(hyperDriverBlue.canonicalId);

    // Boost the attack → Hyper Driver a3 removes the last steam counter → a2
    // state-trigger destroys it.
    Dash.must.playAttack(fastAndFuriousRed, { boost: true });
    game.helpers.resolveRestOfCombat();
    drainCombat(game, { optionalBoolean: false });

    // CR 6.6.5c — destroyed on transition to zero steam counters.
    expect(Dash.zone("arena")).not.toContain(hyperDriverBlue.canonicalId);
    expect(Dash.zone("graveyard")).toContain(hyperDriverBlue.canonicalId);
  });

  it.fails("CR 6.6.5c — a Hyper Driver entering with ZERO steam counters is destroyed immediately (generate-while-true)", () => {
    // The EVO234 Hyper Driver TOKEN has no enter-arena replacement, so one
    // created with zero steam counters must satisfy `has-counter steam eq 0`
    // the instant it becomes functional and be destroyed by the same a1
    // state-trigger (the generate-while-true path, CR 6.6.5c).
    //
    // This is a HARNESS limitation, not an engine defect. The on-generate
    // state-trigger scan that should destroy the token is the `state-trigger-
    // scan` stage driven by `advanceFabRulesProcessToBoundary` in
    // `process-runner/boundary.ts` (entered from `kernel/transaction.ts`
    // after a real event commit, then `collectStateTriggers` in
    // `trigger-matcher.ts`). That scan DOES fire for objects created by real
    // gameplay moves — but `test-fixtures.ts` seats arena objects by writing
    // them straight into the zone (`applyFixtureEntryStates`), bypassing the
    // rules process entirely, so the scan never runs for this fixture and the
    // zero-counter token sits in the arena un-destroyed.
    //
    // Driving this GREEN needs a REAL creator that puts a Hyper Driver into
    // the arena with zero steam counters, and no such creator is currently
    // drivable: Maxx Nitro / Maxx "The Hype" Nitro / Speed Demon each grant
    // steam counters via `withCounters`, but their activations are gated by
    // statuses the engine does not yet track (`boosted-this-turn`,
    // `scrapped-hyper-driver`) so the token is never created (see the Maxx
    // Nitro suite). Supercell Blue is the only unconditional creator
    // (`withCounters: { count: { type: "x" } }`), but its `target.count:
    // { type: "x" }` is rejected by the play procedure ("The target count is
    // unsupported"), so the card cannot be played at all. With every creator
    // blocked by a separate engine gap, the fixture-seated form is the only
    // available shape, and it cannot exercise the scan.
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: hyperDriver, state: { steamCounters: 0 } }],
        deck: 6,
      },
      { hero: bravo, deck: 4 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    // CR 6.6.5c generate-while-true — destroyed immediately on enter.
    expect(Dash.zone("arena")).not.toContain(hyperDriver.canonicalId);
    expect(Dash.zone("graveyard")).toContain(hyperDriver.canonicalId);
  });

  // ── 6.6.6a cease-to-exist on no legal target — Thaw (UPR086) ──────────────

  it("CR 6.6.6a — Thaw's start-of-turn triggered-layer ceases to exist when no legal target exists", () => {
    // Thaw's graveyard trigger offers a modal choice, each mode requiring a
    // target (Frostbite / Ice affliction / frozen card). With NO legal target
    // for any mode, CR 6.6.6a says the triggered-layer ceases to exist — no
    // layer is put on the stack and no decision is presented to the controller.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        graveyard: [thawRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Thaw starts in Bravo's graveyard. End Bravo's turn, then Dash's turn;
    // when Bravo's next turn starts the start-phase trigger is collected.
    Bravo.endTurn();
    game.as(dash).endTurn();
    // Let any start-of-turn processing settle, declining optional prompts.
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // CR 6.6.6a — with no Frostbite / Ice affliction / frozen card anywhere,
    // the triggered-layer ceased to exist: Thaw was NOT banished (the optional
    // banish never occurred) and no Thaw modal/target decision remains pending.
    expect(Bravo.zone("graveyard")).toContain(thawRed.canonicalId);
    expect(Bravo.zone("banished")).not.toContain(thawRed.canonicalId);
    const decision = game.getState().decision;
    expect(decision === null || decision?.actorId !== Bravo.id).toBe(true);
  });

  // Positive-companion note (CR 6.6.6a). A green "trigger IS collected when a
  // legal target exists" companion was investigated but cannot be cleanly
  // arranged without forcing a fragile test, so the negative stands alone:
  //   • Frostbite — Thaw's a1 target. But Frostbite's own a2/a3 destroy it at
  //     the beginning of ANY end-phase (the `end-phase` trigger is not
  //     controller-scoped in the engine), so a fixture-seated Frostbite is
  //     gone after the very first end-turn — long before the start-of-turn at
  //     which Thaw's graveyard trigger is first collected (turn 3 here, since
  //     fixture-seated sources do not fire the on-setup start scan).
  //   • Ice affliction — Thaw's a2 target. No card in the catalog carries
  //     `types: ["Ice affliction"]`, so the filter has no legal instance.
  //   • Frozen card — Thaw's a3 target. The fixture's `state: { status:
  //     "frozen" }` writes a `{ kind: "status", value: "frozen" }` marker, but
  //     `hasStatus: "frozen"` in `evaluation/matches-filter.ts` checks
  //     `marker.kind === "frozen"` — a marker-shape mismatch, so the fixture
  //     card is never seen as frozen. The harness has no property that writes
  //     a `{ kind: "frozen" }` marker, and seeding one needs a real freeze
  //     effect (an Ice hero + Ice source), which is a different, fragile
  //     scenario. Adding such a positive would couple this suite to a second
  //     hero class and a freeze-creation chain, so it is intentionally
  //     omitted rather than forced.

  // ── 6.6.6b simultaneous ordering — Celestial Kimono + Diadem of Dreamstate ─

  it("CR 6.6.6b — Celestial Kimono + Diadem of Dreamstate: controller orders their two destroy-trigger layers", () => {
    // Dash controls both ward pieces. When one is destroyed, BOTH destroy
    // triggers fire simultaneously — Kimono's own "gain {r}" and Diadem's
    // "you may pay {r} for a Ponder token" — and CR 6.6.6b lets the controller
    // choose their relative order on the stack.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        chest: [celestialKimono],
        head: [diademOfDreamstate],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    // Walk combat. Ward prevents damage by destroying a ward piece; prefer
    // destroying the Kimono so both Kimono's own trigger and Diadem's trigger
    // fire from the single destroy event. Accept every presented order choice.
    const result = drainCombat(game, {
      optionalBoolean: true,
      preferEntityCanonicalId: celestialKimono.canonicalId,
    });

    // CR 6.6.6b — a simultaneous-trigger ordering decision was presented to the
    // controller (Dash) for their two destroy-trigger layers, and the chosen
    // sequence resolved (Kimono destroyed; the optional {r} path was taken).
    expect(result.orderingSeen).toBe(true);
    expect(Dash.zone("graveyard")).toContain(celestialKimono.canonicalId);
  });
});
