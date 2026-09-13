/**
 * CRU179 Gambler's Gloves — Generic Arms d0.
 *
 * Printed:
 *   If a hero would roll one or more 6 sided dice, instead after the roll you
 *   may destroy Gambler's Gloves. If you do, that hero rerolls all 6 sided
 *   dice rolled this way.
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Prior model replaced "clash" — dead event family; never matched a die roll.
 * 2. Remodel: continuous replacement replaces.name "roll" + optional destroy
 *    self then roll sides 6 (while-in-arena).
 * 3. Engine: optional destroy+reroll is an explicit replacement choice while
 *    seated. When accepted, roll-request counts a complete reroll; reduction
 *    discards the final replacement-modified dice pool before sampling again.
 *    proposeRoll peeks with the same count so roll-result bindings match.
 * 4. Happy: equip gloves + Barkbone Instant destroy → roll. Gloves leave to GY;
 *    committed roll result drives floor(n/2) {r}; RP matches that face.
 * 5. Boundary: without gloves, Barkbone rolls once and gloves path is N/A;
 *    model asserts replaces roll + optional destroy + then roll 6 (not clash).
 * 6. d0 seat: no bladeBreak / battleworn on this card.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { gamblerSGloves } from "../../../../../../cards/src/cards/equipment/gambler-s-gloves.ts";
import { barkboneStrapping } from "../../../../../../cards/src/cards/equipment/barkbone-strapping.ts";

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean } = {},
): void {
  const acceptOptional = opts.acceptOptional ?? true;
  for (let safety = 0; safety < 64; safety += 1) {
    if (game.answerForcedDecision()) continue;
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      // Prefer accept so optional destroy on the gloves path fires when present.
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision?.kind === "option") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "option",
            optionIds: acceptOptional ? decision.options.map((option) => option.id) : [],
          },
        },
      });
      continue;
    }
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

function committedRollResult(game: ReturnType<typeof FabTestEngine.start>): number | undefined {
  const rolls = game
    .committedEvents()
    .filter((e) => e.name === "roll")
    .map((e) => (e.data as { result?: number }).result)
    .filter((r): r is number => typeof r === "number");
  return rolls.at(-1);
}

describe("gambler-s-gloves (CRU179)", () => {
  it("core mechanic: d6 roll → destroy gloves + re-roll result drives barkbone {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gamblerSGloves],
        chest: [barkboneStrapping],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, seed: "gamblers-gloves-core" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("arms")).toContain(gamblerSGloves.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);

    const activated = Bravo.activate(barkboneStrapping);
    expect(activated.accepted).toBe(true);
    drain(game);

    // Barkbone destroys itself as cost; gloves destroy via re-roll replacement.
    expect(Bravo.zone("graveyard")).toContain(barkboneStrapping.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(gamblerSGloves.canonicalId);
    expect(Bravo.zone("arms")).not.toContain(gamblerSGloves.canonicalId);
    expect(Bravo.zone("chest")).not.toContain(barkboneStrapping.canonicalId);

    const face = committedRollResult(game);
    expect(typeof face).toBe("number");
    expect(face!).toBeGreaterThanOrEqual(1);
    expect(face!).toBeLessThanOrEqual(6);
    expect(Bravo.resourcePoints()).toBe(Math.floor(face! / 2));
  });

  it("boundaries: bare barkbone keeps gloves absent path; remodel replaces roll not clash", () => {
    const declined = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gamblerSGloves],
        chest: [barkboneStrapping],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, seed: "gamblers-gloves-decline" },
    );
    declined.as(bravo).activate(barkboneStrapping);
    drain(declined, { acceptOptional: false });
    const declinedFace = committedRollResult(declined);
    expect(typeof declinedFace).toBe("number");
    expect(declined.as(bravo).zone("arms")).toContain(gamblerSGloves.canonicalId);
    expect(declined.as(bravo).resourcePoints()).toBe(Math.floor(declinedFace! / 2));

    // Without gloves: barkbone still rolls and gains floor(n/2); no gloves destroy.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        chest: [barkboneStrapping],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, seed: "gamblers-gloves-bare" },
    );
    bare.as(bravo).activate(barkboneStrapping);
    drain(bare);
    const bareFace = committedRollResult(bare);
    expect(typeof bareFace).toBe("number");
    expect(bare.as(bravo).resourcePoints()).toBe(Math.floor(bareFace! / 2));
    expect(bare.as(bravo).zone("graveyard")).toContain(barkboneStrapping.canonicalId);
    expect(bare.as(bravo).zone("graveyard")).not.toContain(gamblerSGloves.canonicalId);

    const a1 = gamblerSGloves.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.staticKind).toBe("continuous");
      expect(a1.effect).toMatchObject({
        type: "replacement",
        replaces: { name: "roll" },
        modification: {
          type: "optional",
          effect: {
            type: "destroy",
            target: { selector: "self" },
          },
          then: {
            type: "roll",
            sides: 6,
          },
        },
        duration: "while-in-arena",
      });
      // Guard against regression to the dead clash model.
      expect(a1.effect).not.toMatchObject({ replaces: { name: "clash" } });
    }
  });
});
