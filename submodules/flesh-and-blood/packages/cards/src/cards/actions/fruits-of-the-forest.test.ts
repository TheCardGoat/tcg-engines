import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { fruitsOfTheForestRed } from "./fruits-of-the-forest.ts";

describe("Fruits of the Forest (FLR008) AAA", () => {
  it("happy: Instant — discard this from hand to gain 2{h}", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [fruitsOfTheForestRed], life: 20, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.activate(fruitsOfTheForestRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveLife(22);
    expectFabCard(Briar, fruitsOfTheForestRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: attacking with it deals printed 7 and does not gain the discard-ability life", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fruitsOfTheForestRed],
        resourcePoints: 3,
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(fruitsOfTheForestRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(Briar).toHaveLife(20);
    expectFabCard(Briar, fruitsOfTheForestRed).toBeIn("graveyard");
  });
});
