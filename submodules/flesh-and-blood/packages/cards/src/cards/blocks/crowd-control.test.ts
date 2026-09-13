import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultYellow } from "../actions/brutal-assault.ts";
import { crowdControlRed } from "./crowd-control.ts";

describe("Crowd Control family AAA", () => {
  it("paying 3 resources grants +1{d} per opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultYellow], deck: 6 },
      { hero: bravo, hand: [crowdControlRed], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    game.as(dash).attackWith(brutalAssaultYellow);
    Bravo.defendWith(crowdControlRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    expectFabCard(Bravo, crowdControlRed).toHaveDefense(5);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("declining the payment leaves printed defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultYellow], deck: 6 },
      { hero: bravo, hand: [crowdControlRed], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    game.as(dash).attackWith(brutalAssaultYellow);
    Bravo.defendWith(crowdControlRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    expectFabCard(Bravo, crowdControlRed).toHaveDefense(4);
  });
});
