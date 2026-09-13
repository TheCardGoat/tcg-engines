/**
 * ELE173 Shock Charmers — Lightning Arms d0 Spellvoid 2.
 *
 * Printed:
 *   Instant - {r}{r}: The next time an attack action card you control hits a
 *   hero this turn, it deals 1 damage to them.
 *   Spellvoid 2
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Prior model: immediate deal-damage + appliesTo English residue — dead.
 * 2. Correct: Instant 2{r} arms one-shot delayed-trigger on AAC hit →
 *    deal 1 generic to attack-target, source the AAC.
 * 3. event.target:"hero" + types filter is a false dead shape (matcher applies
 *    identity filters to the hero seat). Model omits target:"hero".
 * 4. Happy: activate → unblocked snatch (p4) hits → defender loses 4+1=5.
 * 5. Boundary: no activate → only snatch 4.
 * 6. Boundary: activate then full block (d≥4) → miss, no extra 1.
 * 7. Spellvoid 2 keyword present (arcane path not required for Instant AAA).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { shockCharmers } from "../../../../../../cards/src/cards/equipment/shock-charmers.ts";

const LIFE = 20;
const SNATCH = 4;
const EXTRA = 1;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
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
    // Simultaneous hit triggers (Snatch draw + Charmers ping) need APNAP order.
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
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

describe("shock-charmers (ELE173)", () => {
  it("core mechanic: Instant 2{r} → next AAC hit deals +1 to hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [shockCharmers],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: LIFE,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.activate(shockCharmers);
    drain(game);
    expect(Attacker.resourcePoints()).toBe(0);
    // Arms stay equipped (not destroy-self).
    expect(Attacker.zone("arms")).toContain(shockCharmers.canonicalId);

    Attacker.attackWith(snatchRed);
    // drain handles ordering (Snatch on-hit draw + Charmers delayed ping).
    drain(game);

    // Snatch 4 + delayed 1 = 5.
    expect(Defender.life()).toBe(LIFE - (SNATCH + EXTRA));
  });

  it("boundaries: no activate → no extra; blocked miss → no extra; model delayed-trigger", () => {
    // No activate → snatch only.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [shockCharmers],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: LIFE,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    bare.as(bravo).attackWith(snatchRed);
    drain(bare);
    expect(bare.as(dash).life()).toBe(LIFE - SNATCH);

    // Activate then full block — no hit, no extra damage.
    // Snatch p4; two blues d3 each: 3+3 = 6 ≥ 4 → miss.
    const blocked = FabTestEngine.start(
      {
        hero: bravo,
        arms: [shockCharmers],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: LIFE,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [nimblismBlue, nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    blocked.as(bravo).activate(shockCharmers);
    drain(blocked);
    blocked.as(bravo).attackWith(snatchRed);
    blocked.as(dash).defendWith([nimblismBlue, nimblismBlue]);
    drain(blocked);
    expect(blocked.as(dash).life()).toBe(LIFE);

    const a1 = shockCharmers.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({
        class: "asset",
        type: "resources",
        amount: 2,
      });
      expect(a1.effect).toMatchObject({
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
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
          effect: {
            type: "deal-damage",
            amount: 1,
            target: { selector: "attack-target" },
          },
        },
      });
      // target:"hero" must not combine with AAC types filter (engine quirk).
      expect(
        a1.effect &&
          a1.effect.type === "delayed-trigger" &&
          a1.effect.trigger.kind !== "state" &&
          !("patterns" in a1.effect.trigger.event) &&
          "target" in a1.effect.trigger.event &&
          a1.effect.trigger.event.target,
      ).toBeFalsy();
    }
    expect(
      shockCharmers.base.keywords?.some(
        (k) => k.name === "spellvoid" && (k as { value?: number }).value === 2,
      ),
    ).toBe(true);
    expect(shockCharmers.base.numeric.defense).toBe(0);
  });
});
