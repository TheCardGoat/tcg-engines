/**
 * ROS028 Barkskin of the Millennium Tree — Earth Chest d2 Temper.
 *
 * Printed:
 *   When this defends, if there are 4 or more Earth cards in your banished
 *   zone, create an Embodiment of Earth token.
 *   Temper
 *
 * Reasoning (case-by-case):
 * 1. Defend trigger must be subject:self ("when this defends") — remodel
 *    from bare defend (would fire on co-defenders).
 * 2. Condition zone-count banished controller ≥4 Earth (talent supertype).
 * 3. create-token embodiment-of-earth under controller.
 * 4. <4 Earth or non-Earth banished → no token.
 * 5. Temper d2 on defend path.
 *
 * Status: ✅ 4 Earth banished defend → Embodiment; boundary; Temper; subject:self.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { barkskinOfTheMillenniumTree } from "../../../../../../cards/src/cards/equipment/barkskin-of-the-millennium-tree.ts";
import { cadaverousTillingRed } from "../../../../../../cards/src/cards/actions/cadaverous-tilling.ts";
import { cadaverousTillingBlue } from "../../../../../../cards/src/cards/actions/cadaverous-tilling.ts";
import { earthFormBlue } from "../../../../../../cards/src/cards/actions/earth-form.ts";
import { fruitsOfTheForestRed } from "../../../../../../cards/src/cards/actions/fruits-of-the-forest.ts";

const SNATCH = 4;
const LIFE = 20;
const DEF = 2;

const FOUR_EARTH = [
  cadaverousTillingRed,
  cadaverousTillingBlue,
  earthFormBlue,
  fruitsOfTheForestRed,
] as const;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.answerForcedDecision()) continue;
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

function arenaHasEmbodiment(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): boolean {
  const state = game.getState();
  return (state.containers.zonesByPlayerId[playerId]?.arena ?? []).some((id) => {
    const o = state.objects[id];
    const name = (o as { name?: string } | undefined)?.name;
    const def = state.cardDefinitions[o?.canonicalId ?? ""];
    return (
      o?.canonicalId === "token:embodiment-of-earth" ||
      /embodiment.of.earth/i.test(o?.canonicalId ?? "") ||
      /embodiment of earth/i.test(name ?? "") ||
      /embodiment of earth/i.test(def?.base.names[0] ?? "")
    );
  });
}

describe("barkskin-of-the-millennium-tree (ROS028)", () => {
  it("core mechanic: defend with 4+ Earth banished → Embodiment of Earth", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [barkskinOfTheMillenniumTree],
        banished: [...FOUR_EARTH],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(bravo);
    expect(Defender.zone("banished").length).toBeGreaterThanOrEqual(4);
    expect(arenaHasEmbodiment(game, Defender.id)).toBe(false);

    game.as(dash).attackWith(snatchRed);
    Defender.defendWith(barkskinOfTheMillenniumTree);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(arenaHasEmbodiment(game, Defender.id)).toBe(true);
    // Temper: d2 with −1 counter stays (or may destroy if counters clear — Temper
    // stamps −1{d}; first defend keeps seat when base d2).
    expect(Defender.zone("chest")).toContain(barkskinOfTheMillenniumTree.canonicalId);
    // Snatch 4 − 2 = 2 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - DEF));
  });

  it("boundaries: <4 Earth no token; subject:self model; Temper keyword", () => {
    const short = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [barkskinOfTheMillenniumTree],
        banished: [cadaverousTillingRed, cadaverousTillingBlue, earthFormBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    short.as(dash).attackWith(snatchRed);
    short.as(bravo).defendWith(barkskinOfTheMillenniumTree);
    drain(short);
    short.helpers.resolveRestOfCombat();
    drain(short);
    expect(arenaHasEmbodiment(short, short.as(bravo).id)).toBe(false);

    // 3 Earth + 1 Generic still under threshold.
    const mixed = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [barkskinOfTheMillenniumTree],
        banished: [cadaverousTillingRed, cadaverousTillingBlue, earthFormBlue, snatchRed],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    mixed.as(dash).attackWith(snatchRed);
    mixed.as(bravo).defendWith(barkskinOfTheMillenniumTree);
    drain(mixed);
    mixed.helpers.resolveRestOfCombat();
    drain(mixed);
    expect(arenaHasEmbodiment(mixed, mixed.as(bravo).id)).toBe(false);

    const a1 = barkskinOfTheMillenniumTree.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || a1.staticKind !== "triggered") return;
    expect(a1.trigger).toMatchObject({
      kind: "event-and-state",
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
    expect(a1.trigger.kind === "event-and-state" ? a1.trigger.state : undefined).toMatchObject({
      type: "zone-count",
      zone: "banished",
      player: "controller",
      filter: { typeBox: { supertypes: ["Earth"] } },
      comparison: { op: "gte", value: 4 },
    });
    expect(a1.resolution.kind === "effect" ? a1.resolution.effect : undefined).toMatchObject({
      type: "create-token",
      token: "embodiment-of-earth",
      controller: "controller",
    });
    expect(barkskinOfTheMillenniumTree.base.keywords?.some((k) => k.name === "temper")).toBe(true);
    expect(barkskinOfTheMillenniumTree.base.numeric.defense).toBe(2);
  });
});
