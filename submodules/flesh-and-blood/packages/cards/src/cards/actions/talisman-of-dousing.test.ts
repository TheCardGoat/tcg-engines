import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { talismanOfDousingYellow } from "./talisman-of-dousing.ts";

describe("Talisman of Dousing (MON302) AAA", () => {
  it("happy: plays as an item with go again and spellvoid 1", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [talismanOfDousingYellow], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(talismanOfDousingYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, talismanOfDousingYellow).toBeIn("arena");
    expectFabCard(Dash, talismanOfDousingYellow).toHaveKeyword("spellvoid");
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: without the talisman Voltic Bolt deals its full 3 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("timing: spellvoid 1 prevents 1 of Voltic Bolt and destroys the talisman", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, arena: [talismanOfDousingYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, talismanOfDousingYellow).toBeIn("graveyard");
  });
});
