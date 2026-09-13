/**
 * SUP248 Golden Heart Plate — Warrior Chest d2 Temper, Legendary Olympia Spec.
 *
 * Printed:
 *   Legendary Olympia Specialization
 *   This counts as a Gold.
 *   Temper
 *
 * Reasoning (hand-authored):
 * 1. Continuous grant-property name "Gold" permanent so name filters treat it
 *    as Gold (destroy a Gold, control a Gold, …). Same leaf path as SUP247
 *    Golden Galea (Head sibling) — Chest seat only difference.
 * 2. Temper d2: defend then −1 counter, seat remains at d1.
 * 3. Legendary / Olympia specialization are metadata keywords (no multi-copy /
 *    hero-legality AAA here).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { buildFabRulesView, matchesFabSnapshotFilter } from "../../../state-rules-view.ts";
import { snapshotObject } from "../../../snapshots.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { goldenHeartPlate } from "../../../../../../cards/src/cards/equipment/golden-heart-plate.ts";

const LIFE = 20;
const SNATCH = 4;
const PLATE_D = 2;

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
      // Prefer Heart Plate when destroying a "Gold".
      const plate = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === goldenHeartPlate.canonicalId,
      );
      const pick = plate ?? decision.candidates[0];
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

describe("golden-heart-plate (SUP248)", () => {
  it("core mechanic: counts as Gold (name filter) + Temper d2 leaves d1", () => {
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
        chest: [goldenHeartPlate],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    const plateId = game
      .getState()
      .containers.zonesByPlayerId[Defender.id]!.chest.find(
        (id) => game.getState().objects[id]?.canonicalId === goldenHeartPlate.canonicalId,
      )!;
    const snap = snapshotObject(game.getState(), plateId, Defender.id, "chest");
    // Continuous "counts as a Gold" — name filter matches.
    expect(matchesFabSnapshotFilter(game.getState(), snap, { name: "Gold" })).toBe(true);
    const view = buildFabRulesView(game.getState());
    const evaluated = view.object({
      instanceId: plateId,
      incarnation: game.getState().objects[plateId]!.incarnation,
    });
    expect(evaluated?.current.names).toEqual(
      expect.arrayContaining(["Golden Heart Plate", "Gold"]),
    );

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(goldenHeartPlate);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // snatch 4 − d2 = 2; Temper −1 on d2 → seat remains.
    expect(Defender.life()).toBe(LIFE - (SNATCH - PLATE_D));
    expect(Defender.zone("chest")).toContain(goldenHeartPlate.canonicalId);
  });

  it("boundaries: second Temper defend destroys; model grant name permanent", () => {
    // After first Temper d2→d1, second defend destroys at d1→0.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [goldenHeartPlate],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(goldenHeartPlate);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);
    expect(Defender.zone("chest")).toContain(goldenHeartPlate.canonicalId);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(goldenHeartPlate);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);
    expect(Defender.zone("chest")).not.toContain(goldenHeartPlate.canonicalId);
    expect(Defender.zone("graveyard")).toContain(goldenHeartPlate.canonicalId);

    const a1 = goldenHeartPlate.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
    expect(a1.effect).toMatchObject({
      type: "grant-property",
      property: { kind: "name", value: "Gold" },
      target: { selector: "self" },
      duration: "permanent",
    });
    expect(goldenHeartPlate.base.numeric.defense).toBe(2);
    expect(goldenHeartPlate.base.keywords).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "temper" }),
        expect.objectContaining({ name: "legendary" }),
      ]),
    );
  });
});
