/**
 * MST229 Evo Heartdrive (blue) — Mechanologist Instant Evo Chest d0 AB1.
 *
 * Printed:
 *   If you have a base chest equipped, transform it into this, then equip this.
 *   When this is equipped, the next attack action card you play this turn
 *   costs {r} less to play.
 *   Arcane Barrier 1
 *
 * Reasoning (case-by-case; evo-recall + silken-gi family):
 * 1. a1 Evo transform/equip play path OPEN under-zone (same family as MST228).
 *    Model corrected to Base+Chest object target (was transform self + bare Chest).
 * 2. a2 equip subject:self fires on pre-game seat; appliesTo.next AAC cost −1.
 *    Prior model used and[subtypes Attack, subtypes Action] which never matches
 *    (Action is not a subtype) — remodeled types:Action + subtypes:Attack.
 * 3. Brutal Assault cost 2 at 1{r} legal after equip; second AAC full cost;
 *    without Heartdrive 1{r} illegal for cost 2.
 * 4. Arcane Barrier 1 keyword. d0 no defend ability.
 *
 * Status: 🟡 equip→next AAC −1{r} proven; play transform OPEN under-zone.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { evoHeartdriveBlue } from "../../../../../../cards/src/cards/instants/evo-heartdrive.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";

const LIFE = 40;

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

describe("evo-heartdrive-blue (MST229)", () => {
  it("core mechanic: equip → next AAC costs {r} less (cost 2 at 1{r})", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [evoHeartdriveBlue],
        hand: [brutalAssaultRed, brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Seating fires equip subject:self → cost −1 continuous for next AAC.
    drain(game);
    expect(Bravo.zone("chest")).toContain(evoHeartdriveBlue.canonicalId);
    expect(game.getState().continuousEffectInstances.length).toBeGreaterThanOrEqual(1);

    // Brutal Assault base cost 2; with Heartdrive −1 → 1{r}.
    const rpBefore = Bravo.resourcePoints();
    expect(rpBefore).toBe(1);
    Bravo.attackWith(brutalAssaultRed);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);
    expect(Bravo.resourcePoints()).toBe(0);

    // Second AAC: discount consumed; cost 2 illegal at 0{r}.
    expect(() => Bravo.attackWith(brutalAssaultRed)).toThrow();
    expect(Bravo.zone("hand")).toContain(brutalAssaultRed.canonicalId);
  });

  it("boundaries: without Heartdrive cost 2 illegal at 1{r}; model Base+Chest + AAC filter; AB1", () => {
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => bare.as(bravo).attackWith(brutalAssaultRed)).toThrow();
    expect(bare.as(bravo).zone("hand")).toContain(brutalAssaultRed.canonicalId);

    const a1 = evoHeartdriveBlue.base.abilities?.[0];
    expect(a1?.kind).toBe("resolution");
    if (a1?.kind === "resolution") {
      expect(a1.condition).toMatchObject({
        type: "equipped-count",
        filter: { typeBox: { types: ["Equipment"], subtypes: ["Base", "Chest"] } },
      });
      expect(a1.effect).toMatchObject({
        type: "sequence",
        steps: [
          {
            type: "transform",
            target: {
              selector: "object",
              zones: ["equipment-chest"],
              filter: { typeBox: { types: ["Equipment"], subtypes: ["Base", "Chest"] } },
            },
            into: "this",
          },
          { type: "equip", target: { selector: "self" } },
        ],
      });
    }

    const a2 = evoHeartdriveBlue.base.abilities?.[1];
    expect(a2?.kind).toBe("static");
    if (a2?.kind === "static" && a2.staticKind === "triggered") {
      expect(a2.trigger).toMatchObject({
        kind: "event",
        event: {
          name: "equip",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      });
      expect(a2.resolution.kind === "effect" ? a2.resolution.effect : undefined).toMatchObject({
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: 1,
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      });
    }

    expect(
      evoHeartdriveBlue.base.keywords?.some(
        (k) => k.name === "arcane-barrier" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
    expect(evoHeartdriveBlue.base.numeric.defense).toBe(0);
  });
});
