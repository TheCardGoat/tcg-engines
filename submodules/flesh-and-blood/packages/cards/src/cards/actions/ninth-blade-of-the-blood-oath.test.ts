import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { ninthBladeOfTheBloodOathYellow } from "./ninth-blade-of-the-blood-oath.ts";

/**
 * Ninth Blade of the Blood Oath (ARC082) — Runeblade Action - Attack.
 *
 * Printed: This costs {r} less to play for each Runechant you control.
 *
 * CR 5.4.2/6.2: the self-cost static generates a continuous effect while
 * functional (self cost-modify applies from hand at play time). CR 8.6.3: a
 * Runechant token is named "Runechant" and is controlled from its controller's
 * arena; playing this attack action destroys them via their triggered-static.
 */

const runechant = fabToken("runechant");

describe("Ninth Blade of the Blood Oath (ARC082) AAA", () => {
  it("happy: 5 Runechants reduce the 9{r} cost to 4", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ninthBladeOfTheBloodOathYellow],
        arena: [runechant, runechant, runechant, runechant, runechant],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(ninthBladeOfTheBloodOathYellow);

    expectCombat(game).toHaveAttackPower(9);
    expectFabPlayer(Briar).toHaveResourceCount(0);
  });

  it("boundary: with no Runechants the full 9{r} cost is unpayable at 8{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ninthBladeOfTheBloodOathYellow],
        resourcePoints: 8,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expect(() => Briar.attackWith(ninthBladeOfTheBloodOathYellow)).toThrow();
    expectFabPlayer(Briar).toHaveResourceCount(8);
  });

  it("timing: the play consumes the Runechants, so a second copy pays full cost", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ninthBladeOfTheBloodOathYellow, ninthBladeOfTheBloodOathYellow],
        arena: [
          runechant,
          runechant,
          runechant,
          runechant,
          runechant,
          runechant,
          runechant,
          runechant,
          runechant,
        ],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    // 9 Runechants discount the first copy to 0{r} (CR 8.6.3 destroy-on-play
    // triggers fire when the attack action is played).
    const blades = Briar.cardsIn("hand", ninthBladeOfTheBloodOathYellow);
    Briar.attackWith(blades[0]!);
    expectCombat(game).toHaveAttackPower(9);
    expectFabPlayer(Briar).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();

    // The Runechants were destroyed by the play, and the second copy faces
    // the full 9{r} cost with 0{r} available.
    expect(Briar.zone("arena").filter((id) => id === "token:runechant")).toHaveLength(0);
    expect(() => Briar.attackWith(blades[1]!)).toThrow();
  });
});
