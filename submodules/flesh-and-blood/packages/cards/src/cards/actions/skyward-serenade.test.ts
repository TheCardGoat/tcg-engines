import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { skyzykRed } from "./skyzyk.ts";
import { fryRed } from "./fry.ts";
import { skywardSerenadeYellow } from "./skyward-serenade.ts";

describe("Skyward Serenade (AST023) AAA", () => {
  it("happy: creating Lightning and +1{p} makes the next attack hit for +1", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [skywardSerenadeYellow, fryRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(skywardSerenadeYellow, { modeIndexes: [0, 2] });
    game.helpers.resolveUntilIdle();
    expectFabCard(Briar, skywardSerenadeYellow).toBeIn("graveyard");
    expect(Briar.zone("arena")).toContain("token:embodiment-of-lightning");
    expectFabPlayer(Briar).toHaveAP(1);

    Briar.attackWith(fryRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("boundary: searching a Skyzyk banishes it and may play it this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [skywardSerenadeYellow],
        deck: [skyzykRed, skyzykRed, skyzykRed, skyzykRed, skyzykRed, skyzykRed],
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(skywardSerenadeYellow, { modeIndexes: [1, 2] });
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: skyzykRed.canonicalId,
      optionalBoolean: false,
    });

    expectFabCard(Briar, skyzykRed).toBeBanished();
  });
});
