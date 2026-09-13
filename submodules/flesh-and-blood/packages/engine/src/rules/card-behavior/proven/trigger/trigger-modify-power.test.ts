/**
 * AAA test for trigger:modify-power.
 * Representative card: Talisman of Featherfoot Yellow (EVR190) — Generic Item.
 * Triggered ability: when an attack you control gains exactly +1{p} during the
 * reaction step, destroy this and the attack gains go again.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { talismanOfFeatherfootYellow } from "../../../../../../cards/src/cards/actions/talisman-of-featherfoot.ts";
import { lungingPressBlue } from "../../../../../../cards/src/cards/attack-reactions/lunging-press.ts";
import { kissOfDeathRed } from "../../../../../../cards/src/cards/actions/kiss-of-death.ts";
import { razorReflexYellow } from "../../../../../../cards/src/cards/attack-reactions/razor-reflex.ts";

describe("trigger: modify-power", () => {
  it("AAA: Talisman of Featherfoot destroys itself and grants go again on exact +1 during reaction (EVR190)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [talismanOfFeatherfootYellow],
        hand: [kissOfDeathRed, lungingPressBlue],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const attacker = game.as(bravo);
    attacker.attackWith(kissOfDeathRed);
    game.passBoth();
    expect(game.combat()?.step).toBe("reaction");
    const attackId = game.getState().containers.zonesByPlayerId[attacker.id]!.combatChain[0]!;
    attacker.play(lungingPressBlue, { targetInstanceId: attackId });
    game.passBoth();
    game.passBoth();

    expect(attacker.zone("arena")).not.toContain(talismanOfFeatherfootYellow.canonicalId);
    expect(attacker.zone("graveyard")).toContain(talismanOfFeatherfootYellow.canonicalId);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("AAA boundary: +2 power during reaction does not destroy Talisman", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [talismanOfFeatherfootYellow],
        hand: [kissOfDeathRed, razorReflexYellow],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const attacker = game.as(bravo);
    attacker.attackWith(kissOfDeathRed);
    game.passBoth();
    const attackId = game.getState().containers.zonesByPlayerId[attacker.id]!.combatChain[0]!;
    attacker.play(razorReflexYellow, {
      targetInstanceId: attackId,
      modeIds: [`${razorReflexYellow.canonicalId}:chooseMode:attackAction`],
    });
    game.passBoth();

    expect(attacker.zone("arena")).toContain(talismanOfFeatherfootYellow.canonicalId);
  });
});
