/**
 * AIO004 Heavy Industry Power Plant — Mechanologist Chest d2 Temper.
 *
 * Printed (i18n):
 *   Action - {r}, destroy this: Whenever you boost this turn, gain {r}.
 *   Go again
 *   Temper
 *
 * Model (after fix):
 *   Action mixed {r}+destroy-self + go again → delayed-trigger boost
 *   (duration this-turn) → gain-resources 1; temper keyword.
 *
 * Reasoning (hand-authored):
 * 1. Prior model used event.per:"turn" with no duration → one-shot arm only
 *    (engine default expiresAt:triggered). Printed "whenever … this turn" is
 *    multi-fire → duration:this-turn (same fix family as CRU102 Viziertronic /
 *    AAC005 nightcowl).
 * 2. Cost is {r} + destroy-self. Go again refunds the Action AP.
 * 3. Each boost this turn gains 1{r}; no boost → no free RP after arm.
 * 4. Temper first defend d2 → −1{d}.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, throttleRed, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { heavyIndustryPowerPlant } from "../../../../../../cards/src/cards/equipment/heavy-industry-power-plant.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const need = decision.min ?? 1;
      const picks = decision.candidates.slice(0, need).map((c) => c.instanceId);
      if (picks.length < need && need > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: picks },
        },
      });
      continue;
    }
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
    if (decision?.kind === "payment") {
      const cand = decision.candidates[0];
      if (!cand) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: [cand.instanceId] },
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

describe("heavy-industry-power-plant (AIO004)", () => {
  it("core mechanic: {r}+destroy → boost gains {r}; multi-fire arm; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heavyIndustryPowerPlant],
        hand: [throttleRed],
        // Boost banishes deck top — seed deck material.
        deck: [throttleRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 2,
        // Activate 1{r} + Throttle cost 2{r}.
        resourcePoints: 3,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const apBefore = Bravo.actionPoints();

    Bravo.activate(heavyIndustryPowerPlant);
    drain(game);

    expect(Bravo.zone("chest")).not.toContain(heavyIndustryPowerPlant.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(heavyIndustryPowerPlant.canonicalId);
    // Go again refunds Action AP; activate spent 1{r}.
    expect(Bravo.actionPoints()).toBe(apBefore);
    expect(Bravo.resourcePoints()).toBe(2);
    expect(game.getState().delayedTriggers.length).toBeGreaterThanOrEqual(1);
    // duration this-turn → multi-fire window (not one-shot expiresAt:triggered).
    const armed = game.getState().delayedTriggers[0];
    expect(armed?.policy).toMatchObject({ kind: "windowed", expiresAt: { kind: "turn" } });

    // Boost: spend 2{r}, delayed gains 1{r} → net −1.
    const rpBefore = Bravo.resourcePoints();
    Bravo.play(throttleRed, {
      target: game.as(dash).id,
      boost: true,
    });
    drain(game);
    expect(game.getState().players[Bravo.id]!.history.turn.boosted).toBe(true);
    expect(Bravo.resourcePoints()).toBe(rpBefore - 2 + 1);
    // Still armed after first fire (whenever this turn).
    expect(game.getState().delayedTriggers.length).toBeGreaterThanOrEqual(1);
  });

  it("boundaries: no boost → no RP gain after arm; temper d2 −1; model duration", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heavyIndustryPowerPlant],
        hand: [nimblismBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(heavyIndustryPowerPlant);
    game.passBoth();

    // Spent the activate {r}; no boost → no refund from delayed clause.
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("graveyard")).toContain(heavyIndustryPowerPlant.canonicalId);

    // Temper first defend.
    const temperGame = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [heavyIndustryPowerPlant],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = temperGame.as(dash);
    const plateId = Defender.findCardInZone("chest", heavyIndustryPowerPlant);

    temperGame.as(bravo).attackWith(snatchRed);
    Defender.defendWith(heavyIndustryPowerPlant);
    drain(temperGame);
    temperGame.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("chest")).toContain(heavyIndustryPowerPlant.canonicalId);
    expect(temperGame.objectState(plateId)?.defenseCounterTotal).toBe(-1);

    const a1 = heavyIndustryPowerPlant.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.effect).toMatchObject({
      type: "delayed-trigger",
      trigger: {
        kind: "event",
        event: {
          name: "boost",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      policy: {
        kind: "windowed",
        duration: "this-turn",
        matching: "every",
      },
      resolution: {
        kind: "effect",
        effect: { type: "gain-resources", amount: 1 },
      },
    });
  });
});
