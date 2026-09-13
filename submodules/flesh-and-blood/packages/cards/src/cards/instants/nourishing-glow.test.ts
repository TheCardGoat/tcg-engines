import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nourishingGlowBlue } from "./nourishing-glow.ts";

describe("Nourishing Glow (OMN038) AAA", () => {
  it("happy: entering the arena gains 1 life and the aura stays with Ward 1", () => {
    const game = FabTestEngine.start(
      { hero: zyggyStarlight, hand: [nourishingGlowBlue], life: 40, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.play(nourishingGlowBlue);
    game.passBoth();
    game.passBoth();

    expectFabPlayer(Zyggy).toHaveLife(41);
    expectFabCard(Zyggy, nourishingGlowBlue).toBeIn("arena");
    expectFabCard(Zyggy, nourishingGlowBlue).toHaveKeyword("ward");
    expectFabPlayer(Zyggy).toHaveAP(1);
  });

  it("boundary: Ward 1 prevents 1 incoming damage and destroys the aura", () => {
    const game = FabTestEngine.start(
      { hero: zyggyStarlight, hand: [nourishingGlowBlue], life: 40, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.play(nourishingGlowBlue);
    game.passBoth();
    game.passBoth();
    expectFabPlayer(Zyggy).toHaveLife(41);

    Zyggy.endTurn();
    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Zyggy.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Zyggy).toHaveLife(38);
    expectFabCard(Zyggy, nourishingGlowBlue).toBeIn("graveyard");
  });
});
