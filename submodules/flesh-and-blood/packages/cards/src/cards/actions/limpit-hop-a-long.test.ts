import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { limpitHopALongYellow } from "./limpit-hop-a-long.ts";

/**
 * Limpit, Hop-a-Long (AGB016) — Pirate Necromancer Ally, 2{p} 1{h}.
 *
 * Printed: Action - {r}, {t}: Attack. Go again
 */

describe("Limpit, Hop-a-Long (AGB016) AAA", () => {
  it("happy: activateAttack opens combat at printed 2{p} with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [limpitHopALongYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(limpitHopALongYellow);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(2);
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: insufficient resources cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [limpitHopALongYellow],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).expectActivationRejected(limpitHopALongYellow);
    expectCombat(game).toBeClosed();
  });

  it("timing: go again refunds AP; the tapped ally cannot attack again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [limpitHopALongYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(limpitHopALongYellow);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, limpitHopALongYellow).toBeTapped();
    Bravo.expectActivationRejected(limpitHopALongYellow);
  });
});
