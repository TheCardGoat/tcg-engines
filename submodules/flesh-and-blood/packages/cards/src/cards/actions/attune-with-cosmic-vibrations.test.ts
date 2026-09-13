import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { attuneWithCosmicVibrationsBlue } from "./attune-with-cosmic-vibrations.ts";

describe("Attune with Cosmic Vibrations (MST075) AAA", () => {
  it("happy: attacking a hero with a blue deck-top grants +3{p}", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [attuneWithCosmicVibrationsBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deckTop: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(attuneWithCosmicVibrationsBlue, { stopAt: "on-attack" });
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: a red deck-top does not grant +3{p}", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [attuneWithCosmicVibrationsBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deckTop: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(attuneWithCosmicVibrationsBlue);
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("timing: defending a hero's attack with a blue deck-top still fires", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deckTop: [nimblismBlue], deck: 6 },
      { hero: katsu, hand: [attuneWithCosmicVibrationsBlue], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Katsu = game.as(katsu);

    Dash.playAttack(snatchRed);
    Katsu.defendWith(attuneWithCosmicVibrationsBlue);
    game.closeCombat({ ordering: "listed" });
    expectFabCard(Katsu, attuneWithCosmicVibrationsBlue).toBeIn("graveyard");
  });
});
