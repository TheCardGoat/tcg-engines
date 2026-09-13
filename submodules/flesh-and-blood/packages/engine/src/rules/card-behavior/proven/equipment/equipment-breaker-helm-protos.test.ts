/**
 * AMX003 Breaker Helm Protos — Mechanologist Base Head d1 Temper.
 *
 * Printed:
 *   When this defends, you may discard a Hyper Driver. If you do, draw a card
 *   and this gets +1{d} until end of turn.
 *   Temper
 *
 * Model:
 *   static triggered on defend → optional discard (hand, name Hyper Driver)
 *   → then sequence draw 1 + modify-numeric defense +1 self until-end-of-turn
 *
 * Reasoning:
 * 1. Optional discard filter is name "Hyper Driver" — seed ARC036 hyper-driver
 *    red (Action Item with that printed name) in hand.
 * 2. Accept → discard HD, draw 1, +1{d} buff (blocks snatch for 2 with base 1).
 * 3. Decline / no HD in hand → no draw, no buff; temper still applies.
 * 4. "If you do" is optional.then — same structural path as Anticipating Gaze
 *    (principal discard must produce events).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { breakerHelmProtos } from "../../../../../../cards/src/cards/equipment/breaker-helm-protos.ts";
import { hyperDriverRed } from "../../../../../../cards/src/cards/actions/hyper-driver.ts";

const SNATCH = 4;
const LIFE = 20;

function answerOptional(
  game: ReturnType<typeof FabTestEngine.start>,
  accept: boolean,
  discardCanonicalId?: string,
): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      if (!accept) continue;
      continue;
    }
    if (decision?.kind === "entity-target" && accept) {
      const pick =
        (discardCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === discardCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
      if (!pick) throw new Error("no discard candidate");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [pick.instanceId] },
        },
      });
      continue;
    }
    if (decision) throw new Error(`unexpected decision: ${decision.kind}`);
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("breaker-helm-protos (AMX003)", () => {
  it("core mechanic: defend + discard Hyper Driver → draw and +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        head: [breakerHelmProtos],
        hand: [hyperDriverRed],
        deck: 8,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    const handBefore = Defender.handCount();
    Attacker.attackWith(snatchRed);
    Defender.defendWith(breakerHelmProtos);
    answerOptional(game, true, hyperDriverRed.canonicalId);

    expect(Defender.zone("graveyard")).toContain(hyperDriverRed.canonicalId);
    // Discard 1 + draw 1 → hand count same as after remove HD from defend? HD was in hand.
    // handBefore includes HD; after discard+draw: still 1 card (drawn).
    expect(Defender.handCount()).toBe(handBefore); // −1 discard +1 draw
    // d1 + +1{d} buff blocks 2 of snatch 4.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
  });

  it("boundaries: decline optional — HD stays, no buff (blocks only d1)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        head: [breakerHelmProtos],
        hand: [hyperDriverRed],
        deck: 8,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(breakerHelmProtos);
    answerOptional(game, false);

    expect(Defender.zone("hand")).toContain(hyperDriverRed.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
  });

  it("boundaries: non-Hyper-Driver in hand cannot satisfy discard filter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        head: [breakerHelmProtos],
        hand: [nimblismBlue],
        deck: 8,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(breakerHelmProtos);
    // Decline if optional opens; if entity-target opens, nimblism must not be legal.
    for (let safety = 0; safety < 16; safety += 1) {
      const decision = game.getState().decision;
      if (!decision) break;
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
        const illegal = decision.candidates.filter(
          (c) => game.getState().objects[c.instanceId]?.canonicalId === nimblismBlue.canonicalId,
        );
        expect(illegal).toHaveLength(0);
        break;
      }
      break;
    }
    game.helpers.resolveRestOfCombat();

    expect(Defender.zone("hand")).toContain(nimblismBlue.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
  });
});
