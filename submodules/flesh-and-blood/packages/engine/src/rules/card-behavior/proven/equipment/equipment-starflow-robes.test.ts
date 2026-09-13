/**
 * OMN143 Starflow Robes — Lightning Chest d0.
 *
 * Printed:
 *   Instant - {r}{r}, destroy this: Prevent the next 1 damage that would be
 *   dealt to you this turn. If you prevent damage this way, create a Lightning
 *   Flow token.
 *
 * Reasoning (case-by-case; constella-tiara twin on Chest):
 * 1. Instant 2{r}+destroy-self arms prevention 1 (this-turn).
 * 2. "If you prevent damage this way" is deferred then on the prevention —
 *    fires only when damage is actually reduced, not at registration.
 * 3. Defend priority: activate → GY; combat damage 4−1=3; Lightning Flow created.
 * 4. Insufficient RP illegal; model uses additionalModification create-token.
 *
 * Status: ✅ Instant 2{r} destroy→prevent 1 + Lightning Flow; low RP illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { starflowRobes } from "../../../../../../cards/src/cards/equipment/starflow-robes.ts";

const SNATCH = 4;
const LIFE = 20;

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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("starflow-robes (OMN143)", () => {
  it("core mechanic: Instant 2{r} destroy → prevent 1 + create Lightning Flow when damage prevented", () => {
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
        chest: [starflowRobes],
        resourcePoints: 2,
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith([]);
    Attacker.pass();
    expect(game.getState().priority?.holderPlayerId).toBe(Defender.id);

    Defender.activate(starflowRobes);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Defender.zone("graveyard")).toContain(starflowRobes.canonicalId);
    expect(Defender.zone("chest")).not.toContain(starflowRobes.canonicalId);
    expect(Defender.resourcePoints()).toBe(0);
    // Snatch 4, prevent 1 → 3 damage; Lightning Flow created when prevention applied.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
    const hasFlow = Object.values(game.getState().objects).some((o) => {
      const def = game.getState().cardDefinitions[o.canonicalId];
      const slug = def?.slug ?? o.canonicalId;
      return /lightning-flow/i.test(slug) || /lightning.flow/i.test(o.canonicalId);
    });
    expect(hasFlow).toBe(true);
  });

  it("boundaries: insufficient RP illegal; model additionalModification lightning-flow", () => {
    const poor = FabTestEngine.start(
      {
        hero: bravo,
        chest: [starflowRobes],
        resourcePoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => poor.as(bravo).activate(starflowRobes)).toThrow();
    expect(poor.as(bravo).zone("chest")).toContain(starflowRobes.canonicalId);

    const a1 = starflowRobes.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "asset", type: "resources", amount: 2 },
        { class: "effect", type: "destroy-self" },
      ],
    });
    expect(a1.effect).toMatchObject({
      type: "prevention",
      preventionKind: "fixed",
      amount: 1,
      shielded: { selector: "controller" },
      duration: "this-turn",
      additionalModification: {
        type: "create-token",
        token: "lightning-flow",
        controller: "controller",
      },
    });
    expect(starflowRobes.base.numeric.defense).toBe(0);
  });
});
