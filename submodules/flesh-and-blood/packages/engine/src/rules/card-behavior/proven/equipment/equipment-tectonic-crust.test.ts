/**
 * AJV005 Tectonic Crust — Earth Guardian Chest d2 Temper.
 *
 * Printed (i18n):
 *   When this defends together with an Earth card, create a Seismic Surge
 *   token.
 *   Temper
 *
 * Model (after fix):
 *   static triggered defend subject:self togetherWith { supertypes: [Earth] }
 *   → create-token seismic-surge controller:controller
 *   + temper keyword
 *
 * Reasoning (hand-authored — sibling of AJV004 Ollin Ice Cap):
 * 1. "When this defends together with …" requires subject:self so co-defender
 *    defend events do not match. Without it, defending with a non-Earth hand
 *    card treats this Earth equipment as the partner and spuriously creates
 *    Surge; with a real Earth partner it double-fires.
 * 2. Earth talent is a supertype on both the chest and partner (evergreen-red).
 * 3. Seismic Surge under the defending controller's arena.
 * 4. Alone / non-Earth co-defend → no token; Temper first defend d2 −1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { tectonicCrust } from "../../../../../../cards/src/cards/equipment/tectonic-crust.ts";
import { evergreenRed } from "../../../../../../cards/src/cards/actions/evergreen.ts";

const SNATCH = 4;
const LIFE = 20;

function hasSeismicSurge(arenaIds: readonly string[]): boolean {
  return arenaIds.some((id) => /seismic.?surge|token:seismic-surge/i.test(id));
}

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

describe("tectonic-crust (AJV005)", () => {
  it("core mechanic: defend together with Earth hand card → Seismic Surge + Temper d2", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        chest: [tectonicCrust],
        hand: [evergreenRed],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith([tectonicCrust, evergreenRed]);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Exactly one Seismic Surge under the defending controller.
    const surges = Defender.zone("arena").filter((id) =>
      /seismic.?surge|token:seismic-surge/i.test(id),
    );
    expect(surges.length).toBe(1);
    // Chest stays (Temper −1, not bladeBreak).
    expect(Defender.zone("chest")).toContain(tectonicCrust.canonicalId);
    const plateId = Defender.findCardInZone("chest", tectonicCrust);
    expect(game.objectState(plateId)?.defenseCounterTotal).toBe(-1);
    // Block: d2 + evergreen d2 = 4 vs snatch 4.
    expect(Defender.life()).toBe(LIFE);
    void Attacker;
  });

  it("boundaries: alone / non-Earth partner → no Surge; Temper; model subject:self", () => {
    // Alone.
    const alone = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        chest: [tectonicCrust],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    alone.as(bravo).attackWith(snatchRed);
    alone.as(dash).defendWith(tectonicCrust);
    drain(alone);
    alone.helpers.resolveRestOfCombat();

    expect(hasSeismicSurge(alone.as(dash).zone("arena"))).toBe(false);
    expect(alone.as(dash).zone("chest")).toContain(tectonicCrust.canonicalId);
    expect(alone.as(dash).life()).toBe(LIFE - (SNATCH - 2));
    const aloneId = alone.as(dash).findCardInZone("chest", tectonicCrust);
    expect(alone.objectState(aloneId)?.defenseCounterTotal).toBe(-1);

    // Non-Earth co-defender — subject:self prevents false positive via this
    // Earth equipment counting as the partner of the hand card's defend event.
    const nonEarth = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        chest: [tectonicCrust],
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    nonEarth.as(bravo).attackWith(snatchRed);
    nonEarth.as(dash).defendWith([tectonicCrust, nimblismBlue]);
    drain(nonEarth);
    nonEarth.helpers.resolveRestOfCombat();
    drain(nonEarth);

    expect(hasSeismicSurge(nonEarth.as(dash).zone("arena"))).toBe(false);

    const a1 = tectonicCrust.base.abilities?.[0];
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
        cohort: {
          kind: "together-with",
          filter: { typeBox: { supertypes: ["Earth"] } },
        },
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "create-token",
      token: "seismic-surge",
      controller: "controller",
    });
  });
});
