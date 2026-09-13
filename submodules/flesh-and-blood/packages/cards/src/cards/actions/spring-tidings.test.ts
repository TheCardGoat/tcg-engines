import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { headJabYellow } from "./head-jab.ts";
import { springTidingsYellow } from "./spring-tidings.ts";

describe("Spring Tidings (EVR039) AAA", () => {
  it("happy: on hit, draw 1 for each other base-{p}≤2 AAC on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headJabYellow, springTidingsYellow],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Benji = game.as(bravo);

    Benji.playAttack(headJabYellow);
    game.advanceCombatTo("resolution");
    Benji.playAttack(springTidingsYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Benji).toHaveHandCount(0);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: a lone hit draws 0 extra", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [springTidingsYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Benji = game.as(bravo);

    Benji.playAttack(springTidingsYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Benji).toHaveHandCount(0);
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("timing: go again refunds AP after the hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [springTidingsYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Benji = game.as(bravo);

    Benji.playAttack(springTidingsYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Benji).toHaveAP(1);
  });
});
