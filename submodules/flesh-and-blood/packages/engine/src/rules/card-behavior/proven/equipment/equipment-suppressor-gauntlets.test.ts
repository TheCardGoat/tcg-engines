/**
 * SUP213 Punching Gloves — Generic Arms d0.
 *
 * Printed:
 *   Action - {r}{r}, destroy this: The next attack card you play this turn
 *   gets +2{p}. Go again
 *
 * Reasoning (hand-authored, riding the proven floating-applicator path):
 * 1. Activated Action — mixed cost 2{r} + destroy-self; layerKeywords [goAgain]
 *    refunds the action point.
 * 2. Effect: modify-numeric power +2 with appliesTo.next subtypes Attack —
 *    latches the next attack ACTION card played this turn (good-time-chapeau /
 *    stubby floating-applicator family).
 * 3. snatchRed (Generic Action Attack, base power 4) is the next attack card →
 *    base 4 + 2 = 6 damage when undefended.
 * 4. Boundary: without activating Punching Gloves, snatch deals its base 4.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

import { punchingGloves } from "../../../../../../cards/src/cards/equipment/punching-gloves.ts";
import { mightyboneKnuckles } from "../../../../../../cards/src/cards/equipment/mightybone-knuckles.ts";
import { holdFirm } from "../../../../../../cards/src/cards/equipment/hold-firm.ts";

const LIFE = 40;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
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

describe("punching-gloves (SUP213)", () => {
  it("core: destroy-self → next attack card gets +2{p}; go again refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [punchingGloves],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(punchingGloves);
    drain(game);

    // Destroy-self cost paid: arms → graveyard.
    expect(Bravo.zone("arms")).not.toContain(punchingGloves.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(punchingGloves.canonicalId);
    // Go again refunded the 1 AP spent on the Action activate.
    expect(Bravo.actionPoints()).toBe(1);
    expect(Bravo.resourcePoints()).toBe(0);

    // The next attack card played gets +2{p}: snatch base 4 → 6 damage.
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 6);
  });

  it("boundary: without activating Punching Gloves, snatch deals its base 4", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [punchingGloves],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // No activate → no floating +2{p}; snatch deals its printed base 4.
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 4);
    // Punching Gloves stays seated (never activated).
    expect(Bravo.zone("arms")).toContain(punchingGloves.canonicalId);
  });
});

// ---------------------------------------------------------------------------
// SUP080 Mightybone Knuckles — Reviled Arms d1 bladeBreak.
//   Action - {r}{r}{r}, destroy this: Create 3 Might tokens. Activate this only
//   if you have more {h} than each other hero. Go again
// ---------------------------------------------------------------------------

describe("mightybone-knuckles (SUP080)", () => {
  it("core: with more life, destroy-self → 3 Might tokens + go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 40,
        arms: [mightyboneKnuckles],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 30, deck: 6 }, // bravo 40 > dash 30 → gt gate satisfied
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(mightyboneKnuckles);
    drain(game);

    // Destroy-self + 3 Might tokens created under the controller.
    expect(Bravo.zone("graveyard")).toContain(mightyboneKnuckles.canonicalId);
    expect(Bravo.zone("arena").filter((id) => id === "token:might")).toHaveLength(3);
    // Go again refunded the 1 AP spent on the Action activate.
    expect(Bravo.actionPoints()).toBe(1);
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("boundary: activate illegal when NOT ahead on life (bravo behind)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 10,
        arms: [mightyboneKnuckles],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 }, // bravo 10 < dash 40 → gt gate fails
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(mightyboneKnuckles)).toThrow();
    // Arms stay seated; no tokens.
    expect(Bravo.zone("arms")).toContain(mightyboneKnuckles.canonicalId);
    expect(Bravo.zone("arena").filter((id) => id === "token:might")).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// SUP018 Hold Firm — Revered Arms d1 bladeBreak.
//   Action - {r}{r}, destroy this: Create 3 Toughness tokens. Activate this
//   only if you have less {h} than each other hero. Go again
// ---------------------------------------------------------------------------

describe("hold-firm (SUP018)", () => {
  it("core: with less life, destroy-self → 3 Toughness tokens + go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 10,
        arms: [holdFirm],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 }, // bravo 10 < dash 40 → lt gate satisfied
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(holdFirm);
    drain(game);

    expect(Bravo.zone("graveyard")).toContain(holdFirm.canonicalId);
    expect(Bravo.zone("arena").filter((id) => id === "token:toughness")).toHaveLength(3);
    expect(Bravo.actionPoints()).toBe(1);
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("boundary: activate illegal when NOT behind on life (bravo ahead)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 40,
        arms: [holdFirm],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 30, deck: 6 }, // bravo 40 > dash 30 → lt gate fails
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(holdFirm)).toThrow();
    expect(Bravo.zone("arms")).toContain(holdFirm.canonicalId);
    expect(Bravo.zone("arena").filter((id) => id === "token:toughness")).toHaveLength(0);
  });
});
