/**
 * TCC030 Civic Peak — Guardian Head d2 Temper.
 *
 * Printed:
 *   Whenever this defends, another target hero draws a card.
 *   Temper
 *
 * Reasoning (hand-authored, 1v1 product):
 * 1. Trigger must be defend subject:self so co-defenders do not fire draw.
 * 2. "another target hero" → player another-hero. In 1v1 that is the sole
 *    opposing seat (no multi-hero chooser).
 * 3. Controller does not draw; attacker/opponent gains one card from their deck.
 * 4. Temper d2: first defend leaves seat at d1 (−1 counter).
 * 5. Assert draw identity via committedEvents.source (Snatch also draws on hit).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { civicPeak } from "../../../../../../cards/src/cards/equipment/civic-peak.ts";

const LIFE = 20;
const SNATCH = 4;
const HELM_D = 2;

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

function drawsFromPeak(game: ReturnType<typeof FabTestEngine.start>): number {
  return game
    .committedEvents()
    .filter((e) => e.name === "draw" && e.source?.canonicalId === civicPeak.canonicalId).length;
}

function peakDrawCanonicalIds(game: ReturnType<typeof FabTestEngine.start>): readonly string[] {
  return game
    .committedEvents()
    .filter((e) => e.name === "draw" && e.source?.canonicalId === civicPeak.canonicalId)
    .flatMap((e) =>
      (e.affected ?? [])
        .map((a) => a.canonicalId)
        .filter((id): id is string => typeof id === "string"),
    );
}

describe("civic-peak (TCC030)", () => {
  it("core mechanic: defend → sole opponent draws 1 (from peak); Temper d2 leaves seat", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        // Deck top = last element — identity of peak-driven draw.
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, snatchRed],
      },
      {
        hero: dash,
        life: LIFE,
        head: [civicPeak],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(civicPeak);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(drawsFromPeak(game)).toBe(1);
    expect(peakDrawCanonicalIds(game)).toEqual([snatchRed.canonicalId]);
    // Opponent (attacker) holds the peak-drawn card; controller hand empty.
    expect(Attacker.zone("hand")).toContain(snatchRed.canonicalId);
    expect(Defender.zone("hand")).not.toContain(snatchRed.canonicalId);
    // snatch 4 − d2 = 2 life loss; Temper keeps helm seated.
    expect(Defender.life()).toBe(LIFE - (SNATCH - HELM_D));
    expect(Defender.zone("head")).toContain(civicPeak.canonicalId);
  });

  it("boundaries: co-defender alone does not fire peak draw; subject:self + another-hero model", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, snatchRed],
      },
      {
        hero: dash,
        life: LIFE,
        head: [civicPeak],
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );

    game.as(bravo).attackWith(snatchRed);
    // Only hand block — peak stays seated (not defending).
    game.as(dash).defendWith(nimblismBlue);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(drawsFromPeak(game)).toBe(0);
    expect(game.as(dash).zone("head")).toContain(civicPeak.canonicalId);

    const a1 = civicPeak.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || a1.staticKind !== "triggered") return;
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
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "draw",
      count: 1,
      player: "another-hero",
    });
    expect(civicPeak.base.numeric.defense).toBe(2);
    expect(civicPeak.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "temper" })]),
    );
  });
});
