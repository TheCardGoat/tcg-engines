/**
 * EVO016 Cogwerx Base Arms — Mechanologist Base Arms.
 *
 * Printed:
 *   When this is equipped, put a steam counter on it.
 *   Once per Turn Instant - {r}, remove a steam counter from this: Your next
 *   Mechanologist attack this turn gets +1{p}. Activate this ability only if
 *   you've boosted this turn.
 *
 * Reasoning (hand-authored; case-by-case; EVO014/015 siblings):
 * 1. Equip subject:self → steam 1 at start.
 * 2. Boost stamps boosted-this-turn (Throttle with boost).
 * 3. Instant pays 1{r}+steam → floating +1{p} for next Mech AAC.
 * 4. Happy: after Instant, second Throttle hits at p6+1=7 (block 0).
 * 5. Boundary: no boost / 0 RP / OPT; Snatch after Instant stays p4 (not Mech).
 * 6. Model: equip subject:self; appliesTo types Action+Attack+Mechanologist.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, throttleRed, snatchRed } from "../../../fixtures.ts";
import { cogwerxBaseArms } from "../../../../../../cards/src/cards/equipment/cogwerx-base-arms.ts";

const LIFE = 40;
const THROTTLE_P = 6;
const BUFF = 1;

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
          answer: { kind: "boolean", value: true },
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

function steamOnArms(game: ReturnType<typeof FabTestEngine.start>, playerId: string): number {
  const armsId = game
    .getState()
    .containers.zonesByPlayerId[playerId]!.arms.find(
      (id) => game.getState().objects[id]?.canonicalId === cogwerxBaseArms.canonicalId,
    );
  if (!armsId) return 0;
  const record = game.getState().objects[armsId];
  return (
    record?.counters
      .filter((c) => c.kind === "named" && c.name === "steam")
      .reduce((sum, c) => sum + ("count" in c ? c.count : 0), 0) ?? 0
  );
}

describe("cogwerx-base-arms (EVO016)", () => {
  it("core mechanic: equip steam; boost → Instant → next Mech attack +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [cogwerxBaseArms],
        // First throttle boosts; second receives floating +1.
        hand: [throttleRed, throttleRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
        // 2+2 throttles + 1 Instant.
        resourcePoints: 5,
        actionPoints: 2,
        life: 20,
      },
      { hero: bravo, life: LIFE, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    drain(game);

    expect(Dash.zone("arms")).toContain(cogwerxBaseArms.canonicalId);
    expect(steamOnArms(game, Dash.id)).toBe(1);

    // Boost this turn (first throttle unbuffed).
    Dash.play(throttleRed, { boost: true });
    expect(game.getState().players[Dash.id]!.history.turn.boosted).toBe(true);
    drain(game);
    expect(Bravo.life()).toBe(LIFE - THROTTLE_P);

    // Instant arms floating +1.
    Dash.activate(cogwerxBaseArms);
    drain(game);
    expect(steamOnArms(game, Dash.id)).toBe(0);
    expect(Dash.zone("arms")).toContain(cogwerxBaseArms.canonicalId);

    // Second Mech attack gets +1.
    const lifeBefore = Bravo.life();
    Dash.play(throttleRed);
    drain(game);
    expect(Bravo.life()).toBe(lifeBefore - (THROTTLE_P + BUFF));
  });

  it("boundaries: no boost illegal; Snatch unbuffed; model equip subject:self + appliesTo", () => {
    const noBoost = FabTestEngine.start(
      {
        hero: dash,
        arms: [cogwerxBaseArms],
        resourcePoints: 1,
        deck: 4,
      },
      { hero: bravo, deck: 4 },
      { autoPassPriority: false },
    );
    drain(noBoost);
    expect(steamOnArms(noBoost, noBoost.as(dash).id)).toBe(1);
    expect(() => noBoost.as(dash).activate(cogwerxBaseArms)).toThrow();

    // Instant after boost, then Snatch (Generic AAC) — not Mechanologist → no +1.
    const snatch = FabTestEngine.start(
      {
        hero: dash,
        arms: [cogwerxBaseArms],
        hand: [throttleRed, snatchRed],
        deck: [snatchRed, snatchRed, snatchRed],
        resourcePoints: 4, // throttle 2 + Instant 1 + snatch 0
        actionPoints: 2,
        life: 20,
      },
      { hero: bravo, life: LIFE, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    drain(snatch);
    snatch.as(dash).play(throttleRed, { boost: true });
    drain(snatch);
    snatch.as(dash).activate(cogwerxBaseArms);
    drain(snatch);
    const lifeBefore = snatch.as(bravo).life();
    snatch.as(dash).play(snatchRed);
    drain(snatch);
    // Snatch base 4 — floating Mech-only does not apply.
    expect(snatch.as(bravo).life()).toBe(lifeBefore - 4);

    const a1 = cogwerxBaseArms.base.abilities?.[0];
    const a2 = cogwerxBaseArms.base.abilities?.[1];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.trigger).toMatchObject({
        event: { name: "equip", observes: { kind: "source" } },
      });
    }
    expect(a2?.kind).toBe("activated");
    if (a2?.kind === "activated") {
      expect(a2.condition).toMatchObject({
        type: "performed-this-turn",
        event: "boost",
        player: "controller",
      });
      expect(a2.effect).toMatchObject({
        type: "modify-numeric",
        property: "power",
        amount: 1,
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Mechanologist"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      });
    }
  });
});
