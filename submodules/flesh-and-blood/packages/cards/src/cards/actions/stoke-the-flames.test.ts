import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { stokeTheFlamesRed } from "./stoke-the-flames.ts";

/**
 * Stoke the Flames, Red (FAI014) — Draconic Attack, cost 1, 4{p}.
 * Printed: "When Stoke the Flames hits, you may return a Phoenix Flame from
 * your graveyard to your hand. If you do, Stoke the Flames gains go again."
 */

describe("Stoke the Flames (FAI014) AAA", () => {
  it("happy: a hit may return Phoenix Flame from graveyard to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [stokeTheFlamesRed],
        graveyard: [phoenixFlameRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Fai = game.as(fai);

    Fai.playAttack(stokeTheFlamesRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    Fai.target(phoenixFlameRed);

    expectFabCard(Fai, phoenixFlameRed).toBeIn("hand");
    expectFabPlayer(Fai).toHaveAP(1);
  });

  it("boundary: a miss does not return Phoenix Flame", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [stokeTheFlamesRed],
        graveyard: [phoenixFlameRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue, brutalAssaultBlue], deck: 6 },
    );
    const Fai = game.as(fai);
    const Bravo = game.as(bravo);

    Fai.playAttack(stokeTheFlamesRed);
    Bravo.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(Fai).toHaveAP(0);
  });

  it("timing: declining the optional leaves Phoenix Flame in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [stokeTheFlamesRed],
        graveyard: [phoenixFlameRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Fai = game.as(fai);

    Fai.playAttack(stokeTheFlamesRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Fai).toHaveAP(0);

    expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");
  });
});
