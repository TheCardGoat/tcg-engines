import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { teklovossen } from "../heroes/teklovossen.ts";
import { fai } from "../heroes/fai.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { payloadRed } from "./payload.ts";

/**
 * Payload, Red (EVR076) — dominate if you have boosted this combat chain.
 */

describe("Payload (EVR076) AAA", () => {
  it("happy: after a boost this chain, this gets dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zeroToSixtyRed, payloadRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    Teklo.attackWith(payloadRed);
    expectCombat(game).toHaveKeyword("dominate");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(fai)).toHaveLife(10);
  });

  it("boundary: as the first link there is no dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [payloadRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Fai = game.as(fai);

    Teklo.attackWith(payloadRed);
    expectCombat(game).notToHaveKeyword("dominate");
    Fai.defendWith([snatchRed, nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveLife(18);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [payloadRed],
        life: 20,
        deck: 6,
      },
      { hero: fai, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: fai },
    );
    const Teklo = game.as(teklovossen);
    const Fai = game.as(fai);

    Fai.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Teklo.defendWith([payloadRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Teklo).toHaveLife(19);
  });
});
