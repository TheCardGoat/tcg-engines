import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { sigilOfProtectionRed } from "../actions/sigil-of-protection.ts";
import { beckoningHaunt } from "./beckoning-haunt.ts";

describe("Beckoning Haunt (PEN095) AAA", () => {
  it("happy: X=1 pays {r}{r}{r} to return the cost-1 aura from the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [beckoningHaunt],
        graveyard: [sigilOfProtectionRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(beckoningHaunt);
    Dash.chooseNumeric(1);
    Dash.target(sigilOfProtectionRed);

    expectFabCard(Dash, beckoningHaunt).toBeIn("graveyard");
    expectFabCard(Dash, sigilOfProtectionRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });

  it("boundary: X=2 with no cost-2 aura in the graveyard reverses the activation", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [beckoningHaunt],
        graveyard: [sigilOfProtectionRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(beckoningHaunt);
    // X=2 has no legal aura target: the activation reverses on the answer.
    expectFabUnplayable(() => Dash.chooseNumeric(2), /unavailable/);

    expectFabCard(Dash, beckoningHaunt).toBeIn("arms");
    expectFabCard(Dash, sigilOfProtectionRed).toBeIn("graveyard");
  });
});
