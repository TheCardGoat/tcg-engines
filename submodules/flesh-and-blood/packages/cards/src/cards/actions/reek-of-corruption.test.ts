import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { sigilOfFyendalBlue } from "./sigil-of-fyendal.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { reekOfCorruptionRed } from "./reek-of-corruption.ts";

/**
 * Reek of Corruption, Red (EVR113) — if you played/created an aura, on-hit discard.
 */

describe("Reek of Corruption (EVR113) AAA", () => {
  it("happy: after playing an aura, a hit makes the hero discard", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sigilOfFyendalBlue, reekOfCorruptionRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(sigilOfFyendalBlue);
    game.helpers.resolveUntilIdle();
    Viserai.playAttack(reekOfCorruptionRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expect(Dash.zone("hand")).toHaveLength(0);
    expect(Dash.zone("graveyard")).toContain(nimblismBlue.canonicalId);
  });

  it("boundary: without an aura this turn a hit does not discard", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [reekOfCorruptionRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(reekOfCorruptionRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(16);
    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [reekOfCorruptionRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Viserai.defendWith([reekOfCorruptionRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Viserai).toHaveLife(19);
  });
});
