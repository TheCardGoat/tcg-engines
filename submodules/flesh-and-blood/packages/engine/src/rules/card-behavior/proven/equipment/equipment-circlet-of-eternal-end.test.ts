/**
 * IAR223 Circlet of Eternal End — Generic Head d2 Blade Break.
 *
 * Printed:
 *   When this defends, turn a card in the attacking hero's banished zone
 *   face-down.
 *   Blade Break
 *
 * Reasoning (hand-authored, 1v1 product):
 * 1. "When this defends" requires subject:self (model was bare defend and
 *    would fire on any co-defender — same class of bug as Scowling Flesh Bag).
 * 2. On defend, choose 1 card in the attacking hero's banished → face-down.
 * 3. In 1v1, attacking hero = sole opponent of the defending controller.
 * 4. Blade Break destroys the head after it defends (d2 still applies).
 * 5. Empty attacker banished → no face-down target; still BB + d2.
 * 6. Other hand defender alone → circlet does not fire (subject:self).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { circletOfEternalEnd } from "../../../../../../cards/src/cards/equipment/circlet-of-eternal-end.ts";
import { hungeringDemigonYellow } from "../../../../../../cards/src/cards/actions/hungering-demigon.ts";

const SNATCH = 4;
const LIFE = 20;
const DEF = 2;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
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
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
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

describe("circlet-of-eternal-end (IAR223)", () => {
  it("core mechanic: defend → turn attacking hero banished face-down + BB d2", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        banished: [hungeringDemigonYellow],
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [circletOfEternalEnd],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    const debtId = Attacker.card(hungeringDemigonYellow);
    expect(game.getState().objects[debtId]?.markers.some((m) => m.kind === "face-down")).toBe(
      false,
    );

    Attacker.attackWith(snatchRed);
    Defender.defendWith(circletOfEternalEnd);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Attacker's banished card is private now.
    expect(Attacker.zone("banished")).toContain(hungeringDemigonYellow.canonicalId);
    expect(game.getState().objects[debtId]?.markers.some((m) => m.kind === "face-down")).toBe(true);

    // Blade Break + d2 block.
    expect(Defender.zone("graveyard")).toContain(circletOfEternalEnd.canonicalId);
    expect(Defender.zone("head")).not.toContain(circletOfEternalEnd.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - DEF));
  });

  it("boundaries: empty attacker banished → no face-down; still BB; subject:self", () => {
    // Empty banished: effect has nothing to turn; d2 + BB still apply.
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        banished: [],
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [circletOfEternalEnd],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    empty.as(bravo).attackWith(snatchRed);
    empty.as(dash).defendWith(circletOfEternalEnd);
    drain(empty);
    empty.helpers.resolveRestOfCombat();
    expect(empty.as(dash).zone("graveyard")).toContain(circletOfEternalEnd.canonicalId);
    expect(empty.as(dash).life()).toBe(LIFE - (SNATCH - DEF));

    // Other hand defender alone — circlet stays equipped and does not face-down.
    const other = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        banished: [hungeringDemigonYellow],
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [circletOfEternalEnd],
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const A = other.as(bravo);
    const D = other.as(dash);
    const debtId = A.card(hungeringDemigonYellow);
    A.attackWith(snatchRed);
    D.defendWith(nimblismBlue);
    drain(other);
    other.helpers.resolveRestOfCombat();

    expect(other.getState().objects[debtId]?.markers.some((m) => m.kind === "face-down")).toBe(
      false,
    );
    expect(D.zone("head")).toContain(circletOfEternalEnd.canonicalId);
    expect(D.zone("graveyard")).not.toContain(circletOfEternalEnd.canonicalId);

    // Model shape: subject:self on defend; opponent banished target.
    const a1 = circletOfEternalEnd.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.trigger) return;
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "defend",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "defender",
        },
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "turn-face-down",
      target: {
        selector: "object",
        player: "opponent",
        zones: ["banished"],
        count: 1,
      },
    });
    expect(circletOfEternalEnd.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
  });
});
