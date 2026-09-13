/**
 * AGB006 Washed Up Wave — Pirate Necromancer Arms d0 Blade Break.
 *
 * Printed:
 *   When this defends, you may discard a card or destroy the top card of your
 *   deck. If that card has watery grave, this gets +2{d}.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. Trigger must be defend subject:self (co-defenders do not fire).
 * 2. Optional choice: discard a hand card OR destroy deck top.
 * 3. "that card" needs outputBinding "it" on both arms — prior model never
 *    bound the discarded/destroyed card, so watery-grave +2{d} never applied.
 * 4. Discard a watery-grave card → +2{d} for the defend (snatch 4 − 2 = 2).
 * 5. Decline optional → d0, full damage.
 * 6. Blade Break d0: equipment destroyed after defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { washedUpWave } from "../../../../../../cards/src/cards/equipment/washed-up-wave.ts";
import { scoobaSaltySeaDogYellow } from "../../../../../../cards/src/cards/actions/scooba-salty-sea-dog.ts";

const LIFE = 20;
const SNATCH = 4;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean; preferDiscard?: boolean } = {},
): void {
  const acceptOptional = opts.acceptOptional ?? true;
  const preferDiscard = opts.preferDiscard ?? true;
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: acceptOptional },
        },
      });
      continue;
    }
    if (decision?.kind === "option" || decision?.kind === "effect-resolution") {
      // Choice arms: discard vs destroy deck top (model order / label).
      const pick = preferDiscard
        ? (decision.options.find((o) => /discard/i.test(o.label) || /option-0|0$/.test(o.id)) ??
          decision.options[0])
        : (decision.options.find(
            (o) => /destroy|deck/i.test(o.label) || /option-1|1$/.test(o.id),
          ) ??
          decision.options[1] ??
          decision.options[0]);
      const optionId = pick?.id ?? decision.options[0]!.id;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer:
            decision.kind === "effect-resolution"
              ? { kind: "effect-resolution", optionId }
              : { kind: "option", optionIds: [optionId] },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      // Prefer watery-grave Scooba when discarding.
      const wg = decision.candidates.find(
        (c) =>
          game.getState().objects[c.instanceId]?.canonicalId ===
          scoobaSaltySeaDogYellow.canonicalId,
      );
      const pick = wg ?? decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("washed-up-wave (AGB006)", () => {
  it("core mechanic: defend discard watery-grave → +2{d}; Blade Break", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [washedUpWave],
        // Scooba has watery-grave for the discard arm.
        hand: [scoobaSaltySeaDogYellow],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(washedUpWave);
    for (let safety = 0; safety < 64; safety += 1) {
      drain(game, { acceptOptional: true, preferDiscard: true });
      if (!game.combat() && game.getState().rulesStack.length === 0 && !game.getState().decision)
        break;
      const prio = game.getState().priority?.holderPlayerId;
      if (prio && !game.getState().decision) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      }
    }

    // snatch 4 − (d0 + 2 watery-grave) = 2 life loss.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    // Blade Break: equipment destroyed after defend.
    expect(Defender.zone("arms")).not.toContain(washedUpWave.canonicalId);
    expect(Defender.zone("graveyard")).toContain(washedUpWave.canonicalId);
    // Discarded watery-grave ally left hand.
    expect(Defender.zone("hand")).not.toContain(scoobaSaltySeaDogYellow.canonicalId);
    expect(Defender.zone("graveyard")).toContain(scoobaSaltySeaDogYellow.canonicalId);
  });

  it("boundaries: decline optional → d0 full damage; non-WG discard no +2; co-defend; model", () => {
    // Decline optional: d0, full snatch damage, still blade-break.
    const decline = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [washedUpWave],
        hand: [scoobaSaltySeaDogYellow],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    decline.as(bravo).attackWith(snatchRed);
    decline.as(dash).defendWith(washedUpWave);
    for (let safety = 0; safety < 64; safety += 1) {
      drain(decline, { acceptOptional: false });
      if (
        !decline.combat() &&
        decline.getState().rulesStack.length === 0 &&
        !decline.getState().decision
      )
        break;
      const prio = decline.getState().priority?.holderPlayerId;
      if (prio && !decline.getState().decision) {
        decline.exec({ move: "pass", actorId: prio, payload: {} });
      }
    }
    expect(decline.as(dash).life()).toBe(LIFE - SNATCH);
    expect(decline.as(dash).zone("arms")).not.toContain(washedUpWave.canonicalId);
    // Declined: Scooba still in hand.
    expect(decline.as(dash).zone("hand")).toContain(scoobaSaltySeaDogYellow.canonicalId);

    // Discard non-WG (nimblism): no +2{d}.
    const nonWg = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [washedUpWave],
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    nonWg.as(bravo).attackWith(snatchRed);
    nonWg.as(dash).defendWith(washedUpWave);
    for (let safety = 0; safety < 64; safety += 1) {
      drain(nonWg, { acceptOptional: true, preferDiscard: true });
      if (!nonWg.combat() && nonWg.getState().rulesStack.length === 0 && !nonWg.getState().decision)
        break;
      const prio = nonWg.getState().priority?.holderPlayerId;
      if (prio && !nonWg.getState().decision) {
        nonWg.exec({ move: "pass", actorId: prio, payload: {} });
      }
    }
    expect(nonWg.as(dash).life()).toBe(LIFE - SNATCH);
    expect(nonWg.as(dash).zone("graveyard")).toContain(nimblismBlue.canonicalId);

    // Co-defender alone (hand block only): wave does not fire, stays seated.
    const co = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [washedUpWave],
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    co.as(bravo).attackWith(snatchRed);
    co.as(dash).defendWith(nimblismBlue);
    for (let safety = 0; safety < 64; safety += 1) {
      drain(co, { acceptOptional: true });
      if (!co.combat() && co.getState().rulesStack.length === 0 && !co.getState().decision) break;
      const prio = co.getState().priority?.holderPlayerId;
      if (prio && !co.getState().decision) {
        co.exec({ move: "pass", actorId: prio, payload: {} });
      }
    }
    expect(co.as(dash).zone("arms")).toContain(washedUpWave.canonicalId);

    const a1 = washedUpWave.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static" && a1.staticKind === "triggered") {
      expect(a1.trigger).toMatchObject({
        event: { name: "defend", observes: { kind: "source" } },
      });
      expect(a1.resolution?.effect).toMatchObject({
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "choice",
              options: [
                { type: "discard", outputBinding: "it" },
                { type: "destroy", outputBinding: "it" },
              ],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: { hasKeyword: "watery-grave" },
            },
            then: {
              type: "modify-numeric",
              property: "defense",
              op: "add",
              amount: 2,
            },
          },
        ],
      });
    }
    expect(washedUpWave.base.numeric.defense).toBe(0);
    expect(washedUpWave.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "blade-break" })]),
    );
  });
});
