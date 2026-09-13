/**
 * SEA129 Peg Leg — Pirate Legs d1 bladeBreak.
 * Printed: Action - {r}{r}{r}, destroy this: Your next attack this turn gets
 * go again. Go again.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash } from "../../../fixtures.ts";
import { rustyHarpoonBlue } from "../../../../../../cards/src/cards/actions/rusty-harpoon.ts";
import { scurvStowaway } from "../../../../../../cards/src/cards/heroes/scurv-stowaway.ts";
import { pegLeg } from "../../../../../../cards/src/cards/equipment/peg-leg.ts";
import { hammerheadHarpoonCannon } from "../../../../../../cards/src/cards/weapons/hammerhead-harpoon-cannon.ts";

const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let s = 0; s < 96; s += 1) {
    const d = game.getState().decision;
    if (d) break;
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

describe("peg-leg (SEA129)", () => {
  it("AAA: {r}{r}{r}+destroy → next attack gets go again (AP refunded), self goes again", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        legs: [pegLeg],
        weapon1: [hammerheadHarpoonCannon],
        arsenal: [rustyHarpoonBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Scurv = game.as(scurvStowaway);

    // Activate Peg Leg: pay 3, destroy self, itself gains go again.
    Scurv.activate(pegLeg);
    drain(game);
    expect(Scurv.zone("graveyard")).toContain(pegLeg.canonicalId);
    expect(Scurv.resourcePoints()).toBe(0);
    // Self go again refunds the activation's action point (1 → 1).
    expect(Scurv.actionPoints()).toBe(1);

    // Attack with Rusty Harpoon (0-cost Arrow) from arsenal with a bow — gets go again.
    Scurv.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    drain(game);
    // Attack go again refunds the spent AP (1 spent → 1 refunded).
    expect(Scurv.actionPoints()).toBe(1);
    expect(game.as(dash).life()).toBeLessThan(LIFE);
  });

  it("boundary: two resources cannot activate the three-resource ability", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        legs: [pegLeg],
        resourcePoints: 2,
        actionPoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(scurvStowaway).activate(pegLeg)).toThrow();
    expect(game.as(scurvStowaway).zone("legs")).toContain(pegLeg.canonicalId);
  });
});
