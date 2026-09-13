/**
 * MPG116 Sunkwater Pincers — Generic Arms d0 Blade Break.
 *
 * Printed:
 *   When this defends, put a face-up card from your arsenal on the bottom of
 *   your deck. If you do, draw a card and this gets +1{d} until end of turn.
 *   Blade Break
 *
 * Reasoning (case-by-case; arms twin of MPG115 Sunkwater Exoshell):
 * 1. Defend subject:self (was bare defend — co-defenders could false-fire).
 * 2. Face-up arsenal → deck bottom; then draw 1 + +1{d} UEOT.
 * 3. Damage uses current defense after +1{d} (snatch 4−1 with buff).
 * 4. Blade Break destroys after defend.
 * 5. Empty arsenal / face-down only → no draw, no +1{d}, still BB (d0 full).
 *
 * Status: ✅ arsenal bottom → draw +1{d} BB; empty/face-down boundaries; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { sunkwaterPincers } from "../../../../../../cards/src/cards/equipment/sunkwater-pincers.ts";

const SNATCH = 4;
const LIFE = 20;

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

describe("sunkwater-pincers (MPG116)", () => {
  it("core mechanic: defend face-up arsenal bottom → draw + +1{d} + BB", () => {
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
        arms: [sunkwaterPincers],
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    const deckBefore = Defender.zone("deck").length;
    const handBefore = Defender.zone("hand").length;

    Attacker.attackWith(snatchRed);
    Defender.defendWith(sunkwaterPincers);
    drain(game);

    expect(Defender.zone("arsenal")).toHaveLength(0);
    expect(Defender.zone("deck")).toContain(nimblismBlue.canonicalId);
    expect(Defender.zone("hand").length).toBe(handBefore + 1);
    expect(Defender.zone("deck").length).toBe(deckBefore);

    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
    expect(Defender.zone("graveyard")).toContain(sunkwaterPincers.canonicalId);
    expect(Defender.zone("arms")).not.toContain(sunkwaterPincers.canonicalId);
  });

  it("boundaries: empty arsenal → no draw, d0 full, BB; face-down arsenal skipped", () => {
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [sunkwaterPincers],
        arsenal: [],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const EmptyDef = empty.as(dash);
    const handBeforeEmpty = EmptyDef.zone("hand").length;
    empty.as(bravo).attackWith(snatchRed);
    EmptyDef.defendWith(sunkwaterPincers);
    drain(empty);
    expect(EmptyDef.zone("hand").length).toBe(handBeforeEmpty);
    empty.helpers.resolveRestOfCombat();

    expect(EmptyDef.life()).toBe(LIFE - SNATCH);
    expect(EmptyDef.zone("graveyard")).toContain(sunkwaterPincers.canonicalId);

    const facedown = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [sunkwaterPincers],
        arsenal: [{ card: nimblismBlue, state: { faceDown: true } }],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const D = facedown.as(dash);
    const handBeforeFd = D.zone("hand").length;

    facedown.as(bravo).attackWith(snatchRed);
    D.defendWith(sunkwaterPincers);
    drain(facedown);

    expect(D.zone("arsenal")).toContain(nimblismBlue.canonicalId);
    expect(D.zone("hand").length).toBe(handBeforeFd);

    facedown.helpers.resolveRestOfCombat();
    expect(D.life()).toBe(LIFE - SNATCH);
    expect(D.zone("graveyard")).toContain(sunkwaterPincers.canonicalId);

    const a1 = sunkwaterPincers.base.abilities?.[0];
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
      },
    });
    expect(sunkwaterPincers.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
  });
});
