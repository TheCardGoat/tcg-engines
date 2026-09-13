/**
 * PEN151 Bone Puppetry — Necromancer Arms d2 Blade Break.
 *
 * Printed a1: When this defends, you may return an ally from your graveyard
 * to the arena. If you do, at the beginning of the end phase, destroy it and
 * discard your hand.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { limpitHopALongYellow } from "../../../../../../cards/src/cards/actions/limpit-hop-a-long.ts";
import { bonePuppetry } from "../../../../../../cards/src/cards/equipment/bone-puppetry.ts";

function setup() {
  return FabTestEngine.start(
    {
      hero: bravo,
      hand: [snatchRed],
      actionPoints: 1,
      deck: 0,
    },
    {
      hero: dash,
      arms: [bonePuppetry],
      graveyard: [limpitHopALongYellow],
      hand: [snatchRed],
      intellect: 0,
      deck: 0,
    },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
}

describe("bone-puppetry (PEN151)", () => {
  it("defend trigger returns an Ally, then delayed end phase destroys it and discards hand", () => {
    const game = setup();
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(bonePuppetry);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: limpitHopALongYellow.canonicalId,
    });

    expect(Defender.zone("arena")).toContain(limpitHopALongYellow.canonicalId);
    expect(Defender.zone("graveyard")).not.toContain(limpitHopALongYellow.canonicalId);

    Attacker.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Defender.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Defender.zone("arena")).not.toContain(limpitHopALongYellow.canonicalId);
    expect(Defender.zone("graveyard")).toContain(limpitHopALongYellow.canonicalId);
    expect(Defender.hand()).toEqual([]);
  });

  it("boundary: declining the optional return leaves the Ally in the graveyard", () => {
    const game = setup();
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(bonePuppetry);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Defender.zone("arena")).not.toContain(limpitHopALongYellow.canonicalId);
    expect(Defender.zone("graveyard")).toContain(limpitHopALongYellow.canonicalId);
  });
});
