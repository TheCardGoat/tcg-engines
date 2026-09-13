/**
 * CR 5.4.7 — While-static abilities.
 *
 * "A while-static ability is a static ability with a condition that makes it
 * functional under specified circumstances. … While [CONDITION], [ABILITY]."
 *
 * Yinti Yanti (MON290) is the CR-cited example: "While Yinti Yanti is defending
 * and you control an aura, it has +1{d}." The while-static is functional ONLY
 * while Yinti Yanti is defending AND its controller controls an aura; otherwise
 * it grants nothing. This suite guards both the functional case (printed {d} 2
 * + 1 = 3) and the negative case (no aura → printed {d} 2 only).
 *
 * History: an earlier engine gap left the generic "defending"/"attacking"
 * combat statuses unhandled in `evaluateHasStatus`
 * (rules/evaluation/conditions/has-status.ts), which suppressed both of Yinti
 * Yanti's while-statics (and the printed siblings Flittering Forcefield
 * OMN181-183 and Arcanic Cunning OMN088/089/090). That gap is now closed:
 * `defending`/`attacking` read the live combat record directly. This suite
 * guards BOTH of Yinti Yanti's while-statics — the defending +1{d} ability
 * (a2, CR-cited) and the attacking +1{p} ability (a1) — in both their
 * functional and negative (no-aura) forms.
 */
import { describe, expect, it } from "vitest";
import { defineFleshAndBloodCard } from "@tcg/flesh-and-blood-types";
import { FabTestEngine } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";
import { yintiYantiRed } from "../../../../../../cards/src/cards/actions/yinti-yanti.ts";

// Minimal Aura fixture with no abilities, so the only continuous modifier in
// the scenario is Yinti Yanti's own while-static. A bare aura fixture (rather
// than a real catalog aura) keeps the test hermetic: catalog auras carry
// continuous/triggered text that would confound the defense reading.
const trainerAura = defineFleshAndBloodCard({
  canonicalId: "cr-5-4-7-trainer-aura",
  slug: "cr-5-4-7-trainer-aura",
  types: ["Generic", "Action", "Aura"],
  color: "Red",
  pitch: "1",
  cost: 0,
  defense: 1,
});

// Clean power-3 attack so the +1{d} swing (defense 2 → 3) flips the dealt
// damage from 1 to 0, making the while-static observable end-to-end via life.
const powerThreeAttack = hitTrainer({ slug: "yy-power-3-attack", power: 3 });

describe("CR 5.4.7 — Yinti Yanti's while-static grants +1{d} while defending and controlling an aura", () => {
  // The evaluateHasStatus "defending"/"attacking" gap documented in the file
  // header is now closed (generic combat statuses read the live combat record),
  // so the full Arrange/Act/Assert runs green: defense 2 + 1 = 3 ≥ attack power
  // 3 → 0 damage → life 20.
  it("functional: defending with Yinti Yanti while controlling an aura adds +1 defense (printed 2 → 3, attack deals 0)", () => {
    const game = FabTestEngine.start(
      // Dash is the turn player / attacker.
      { hero: dash, hand: [powerThreeAttack], resourcePoints: 1, deck: 6 },
      // Bravo is the defender; he controls an aura and holds Yinti Yanti.
      { hero: bravo, arena: [trainerAura], hand: [yintiYantiRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Dash attacks Bravo; advance the chain to the defend step.
    game.as(dash).play(powerThreeAttack, { target: Bravo.id });
    game.passBoth(); // card layer → attack
    game.passBoth(); // attack → defend
    expect(game.combat()?.step).toBe("defend");

    // Bravo defends with Yinti Yanti, then combat resolves to damage.
    Bravo.blockWith(yintiYantiRed);
    game.helpers.resolveRestOfCombat();

    // Printed defense 2 + while-static 1 = 3 ≥ attack power 3 → 0 damage.
    expect(Bravo.life()).toBe(20);
  });

  it("negative: with NO aura under control, defending with Yinti Yanti grants NO +1 (printed defense 2 only, attack deals 1)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [powerThreeAttack], resourcePoints: 1, deck: 6 },
      // No aura in Bravo's arena → the while-static condition is not met.
      { hero: bravo, hand: [yintiYantiRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    game.as(dash).play(powerThreeAttack, { target: Bravo.id });
    game.passBoth(); // card layer → attack
    game.passBoth(); // attack → defend
    expect(game.combat()?.step).toBe("defend");

    Bravo.blockWith(yintiYantiRed);
    game.helpers.resolveRestOfCombat();

    // Printed defense 2 only < attack power 3 → 1 damage. Guarding the aura
    // condition: controlling no aura yields NO +1{d}.
    expect(Bravo.life()).toBe(19);
  });
});

describe("CR 5.4.7 — Yinti Yanti's while-static grants +1{p} while attacking and controlling an aura", () => {
  it("functional: attacking with Yinti Yanti while controlling an aura adds +1 power (printed 3 → 4, undefended deals 4)", () => {
    const game = FabTestEngine.start(
      // Bravo is the turn player / attacker; he controls an aura and attacks
      // with Yinti Yanti itself, so Yinti Yanti is the attacking card.
      {
        hero: bravo,
        arena: [trainerAura],
        hand: [yintiYantiRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(yintiYantiRed, { target: Dash.id });
    game.helpers.resolveRestOfCombat();

    // Printed power 3 + while-static 1 = 4; undefended → 4 damage.
    expect(Dash.life()).toBe(20 - 4);
  });

  it("negative: with NO aura under control, attacking with Yinti Yanti grants NO +1 (printed power 3 only, undefended deals 3)", () => {
    const game = FabTestEngine.start(
      // No aura in Bravo's arena → the while-static condition is not met.
      { hero: bravo, hand: [yintiYantiRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(yintiYantiRed, { target: Dash.id });
    game.helpers.resolveRestOfCombat();

    // Printed power 3 only; undefended → 3 damage.
    expect(Dash.life()).toBe(20 - 3);
  });
});
