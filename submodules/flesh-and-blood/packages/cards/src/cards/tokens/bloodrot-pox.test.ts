import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { bloodrotPox } from "./bloodrot-pox.ts";

describe("Bloodrot Pox (ARA027) AAA", () => {
  it("happy: at your end phase this is destroyed and deals 2 damage if you do not pay 3{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [bloodrotPox],
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Bravo.zone("arena")).not.toContain(bloodrotPox.canonicalId);
    expectFabPlayer(Bravo).toHaveLife(18);
  });

  it("boundary: paying 3{r} prevents the 2 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [bloodrotPox],
        resourcePoints: 3,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expect(Bravo.zone("arena")).not.toContain(bloodrotPox.canonicalId);
    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("timing: Bloodrot Pox does not trigger on the opponent's end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [bloodrotPox],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, bloodrotPox).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveLife(20);
  });
});
