import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { crossTheLineRed } from "./cross-the-line.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { blessingOfSurayaYellow } from "./blessing-of-suraya.ts";

describe("Blessing of Suraya (IAR) AAA", () => {
  it("happy: a charged card creates Ponder and the next start phase puts Blessing into soul", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [blessingOfSurayaYellow, crossTheLineRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    Boltyn.play(blessingOfSurayaYellow);
    game.untilIdle();
    Boltyn.playAttack(crossTheLineRed, { charge: true, chargeCard: nimblismBlue });
    game.closeCombat();
    expectFabPlayer(Boltyn).toHaveTokenCount("ponder", 1);
    Boltyn.endTurn();
    game.untilIdle({ ordering: "listed" });
    expectFabPlayer(Boltyn).toHaveTokenCount("ponder", 0);
    game.as(dash).endTurn();
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Boltyn, blessingOfSurayaYellow).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveTokenCount("ponder", 1);
  });
  it("boundary: entering arena alone creates no Ponder", () => {
    const game = FabTestEngine.start(
      { hero: boltyn, hand: [blessingOfSurayaYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    Boltyn.play(blessingOfSurayaYellow);
    game.untilIdle();
    expectFabCard(Boltyn, blessingOfSurayaYellow).toBeIn("arena");
    expectFabPlayer(Boltyn).toHaveTokenCount("ponder", 0);
  });

  it("boundary: a card entering the opponent's soul creates no Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [blessingOfSurayaYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: boltyn,
        hand: [crossTheLineRed, nimblismBlue, brutalAssaultBlue],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Boltyn = game.as(boltyn);

    Prism.play(blessingOfSurayaYellow);
    game.untilIdle();
    Prism.endTurn();
    game.untilIdle({ ordering: "listed" });
    Boltyn.must
      .pitch(brutalAssaultBlue)
      .playAttack(crossTheLineRed, { charge: true, chargeCard: nimblismBlue });
    game.untilIdle();

    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Prism).toHaveTokenCount("ponder", 0);
  });
});
