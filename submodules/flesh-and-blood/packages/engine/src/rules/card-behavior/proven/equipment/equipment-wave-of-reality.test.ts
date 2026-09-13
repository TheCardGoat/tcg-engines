/**
 * DYN214 Wave of Reality — Illusionist Arms, Ward 1 (no printed defense).
 *
 * Printed:
 *   When Wave of Reality is destroyed, create a Spectral Shield token.
 *   Ward 1
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Ward 1 (CR 8.3.20): controller damage → destroy this to prevent 1.
 *    No {d} — cannot defend; path is combat damage into Ward auto-destroy.
 * 2. Ward destroy emits destroy → subject:self trigger creates Spectral Shield.
 * 3. Happy: snatch 4 − ward 1 = 3 life loss; arms GY; arena has Spectral Shield.
 * 4. Boundary: no equipment → full 4 damage, no shield.
 * 5. Model: destroy subject:self (not bare destroy) + ward(1); no defense.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { waveOfReality } from "../../../../../../cards/src/cards/equipment/wave-of-reality.ts";
import { spectralShield } from "../../../../../../cards/src/cards/tokens/spectral-shield.ts";

const LIFE = 20;
const SNATCH = 4;
const WARD = 1;

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

function hasSpectralShield(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): boolean {
  const arena = game.getState().containers.zonesByPlayerId[playerId]!.arena ?? [];
  return arena.some((id) => {
    const canonical = game.getState().objects[id]?.canonicalId ?? "";
    return (
      canonical === spectralShield.canonicalId ||
      canonical === "token:spectral-shield" ||
      /spectral-shield/i.test(canonical)
    );
  });
}

describe("wave-of-reality (DYN214)", () => {
  it("core mechanic: Ward 1 destroy on damage → create Spectral Shield", () => {
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
        arms: [waveOfReality],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    expect(Dash.zone("arms")).toContain(waveOfReality.canonicalId);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Snatch 4 − ward 1 = 3 damage.
    expect(Dash.life()).toBe(LIFE - (SNATCH - WARD));
    // Ward destroys the equipment.
    expect(Dash.zone("arms")).not.toContain(waveOfReality.canonicalId);
    expect(Dash.zone("graveyard")).toContain(waveOfReality.canonicalId);
    // Destroy trigger creates Spectral Shield.
    expect(hasSpectralShield(game, Dash.id)).toBe(true);
  });

  it("boundaries: no equipment → full damage, no shield; model subject:self + ward", () => {
    const bare = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    bare.as(bravo).attackWith(snatchRed);
    bare.helpers.resolveRestOfCombat();
    expect(bare.as(dash).life()).toBe(LIFE - SNATCH);
    expect(hasSpectralShield(bare, bare.as(dash).id)).toBe(false);

    const a1 = waveOfReality.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
    expect(a1.staticKind).toBe("triggered");
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "destroy",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "source",
          selector: "moved-object",
        },
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "create-token",
      token: "spectral-shield",
      controller: "controller",
    });
    expect(
      waveOfReality.base.keywords?.some(
        (k) => k.name === "ward" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
    expect(waveOfReality.base.numeric.defense).toBeUndefined();
  });
});
