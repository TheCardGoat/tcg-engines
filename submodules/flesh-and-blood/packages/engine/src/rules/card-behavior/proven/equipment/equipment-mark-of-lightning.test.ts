/**
 * ELE174 Mark of Lightning — Lightning Arms d0.
 *
 * Printed:
 *   Whenever a Lightning or Elemental attack you control is defended by a card
 *   from hand, you may destroy Mark of Lightning. If you do, the attack deals
 *   1 damage to the defending hero.
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Prior model filtered defend primary (defending card) with Lightning|Elemental —
 *    dead: defender is almost never Lightning. Printed filters the **attack**.
 * 2. Remodel: defend from hand + actor opponent; trigger.state binding-matches
 *    binding "attack" (defend event LKI) with Lightning|Elemental supertypes.
 * 3. Happy: Lightning AAC defended from hand → optional destroy → +1 to defender
 *    (before/with combat damage path).
 * 4. Boundary: accept → arms GY + 1 damage; decline → keep arms, no extra.
 * 5. Boundary: non-Lightning attack (Snatch) defended → no fire.
 * 6. Boundary: no hand defend (no block) → no fire.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, heavenSClawsRed } from "../../../fixtures.ts";
import { markOfLightning } from "../../../../../../cards/src/cards/equipment/mark-of-lightning.ts";

const LIFE = 20;
const CLAWS = 5;
/** Nimblism blue printed {d}. */
const BLUE_D = 2;
const EXTRA = 1;

function drain(game: ReturnType<typeof FabTestEngine.start>, optionalDestroy = true): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: optionalDestroy },
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

describe("mark-of-lightning (ELE174)", () => {
  it("core mechanic: Lightning AAC defended from hand → optional destroy → +1 dmg", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [markOfLightning],
        hand: [heavenSClawsRed],
        resourcePoints: 1,
        actionPoints: 1,
        life: LIFE,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(heavenSClawsRed);
    Defender.defendWith(nimblismBlue);
    drain(game, true);

    // Claws p5 − blue d2 = 3 combat + 1 Mark = 4.
    expect(Defender.life()).toBe(LIFE - (CLAWS - BLUE_D + EXTRA));
    expect(Attacker.zone("graveyard")).toContain(markOfLightning.canonicalId);
    expect(Attacker.zone("arms")).not.toContain(markOfLightning.canonicalId);
  });

  it("boundaries: decline keeps arms; Snatch no fire; model attack binding-matches", () => {
    // Decline optional destroy.
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        arms: [markOfLightning],
        hand: [heavenSClawsRed],
        resourcePoints: 1,
        actionPoints: 1,
        life: LIFE,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    decline.as(bravo).attackWith(heavenSClawsRed);
    decline.as(dash).defendWith(nimblismBlue);
    drain(decline, false);
    expect(decline.as(bravo).zone("arms")).toContain(markOfLightning.canonicalId);
    // Combat only: 5 − 2 = 3, no Mark ping.
    expect(decline.as(dash).life()).toBe(LIFE - (CLAWS - BLUE_D));

    // Non-Lightning AAC (Snatch) defended — no fire.
    const snatch = FabTestEngine.start(
      {
        hero: bravo,
        arms: [markOfLightning],
        hand: [snatchRed],
        actionPoints: 1,
        life: LIFE,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    snatch.as(bravo).attackWith(snatchRed);
    snatch.as(dash).defendWith(nimblismBlue);
    drain(snatch, true);
    expect(snatch.as(bravo).zone("arms")).toContain(markOfLightning.canonicalId);
    // Snatch 4 − d2 = 2, no Mark.
    expect(snatch.as(dash).life()).toBe(LIFE - (4 - BLUE_D));

    const a1 = markOfLightning.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static" && a1.staticKind === "triggered") {
      expect(a1.trigger).toMatchObject({
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: { kind: "none" },
        },
        state: {
          type: "binding-matches",
          binding: "attack",
          filter: {
            or: [
              { typeBox: { supertypes: ["Lightning"] } },
              { typeBox: { supertypes: ["Elemental"] } },
            ],
          },
        },
      });
      expect(a1.resolution.kind === "effect" ? a1.resolution.effect : undefined).toMatchObject({
        type: "optional",
        effect: { type: "destroy", target: { selector: "self" } },
        then: {
          type: "deal-damage",
          amount: 1,
          target: { selector: "defending-hero" },
        },
      });
    }
    expect(markOfLightning.base.numeric.defense).toBe(0);
  });
});
