import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { tuffnut } from "../heroes/tuffnut.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { nimblismRed } from "./nimblism.ts";
import { nimblismYellow } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { digInRed } from "./dig-in.ts";

/**
 * Dig In (SUP036) — Revered Action Attack, red.
 * Printed: When this defends, you may pay up to {r}{r}{r}. Create that many
 * Toughness tokens.
 */

describe("Dig In family AAA", () => {
  it("happy: paying 3{r} creates 3 Toughness", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: tuffnut,
        hand: [digInRed, nimblismYellow, nimblismBlue, nimblismRed],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Tuffnut.defendWith(digInRed);
    game.advanceToDecision(Tuffnut, "boolean");
    Tuffnut.chooseBoolean(true);
    game.answerDecision(Tuffnut.id, { kind: "numeric", value: 3 });

    const yellow = Tuffnut.cardIn("hand", nimblismYellow);
    const blue = Tuffnut.cardIn("hand", nimblismBlue);
    game.answerDecision(Tuffnut.id, { kind: "payment", instanceIds: [yellow.instanceId] });
    game.answerDecision(Tuffnut.id, { kind: "payment", instanceIds: [blue.instanceId] });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, ordering: "listed" });

    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 3);
  });

  it("boundary: choosing 0 creates no Toughness", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: tuffnut,
        hand: [digInRed, nimblismBlue],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Tuffnut.defendWith(digInRed);
    game.advanceToDecision(Tuffnut, "boolean");
    Tuffnut.chooseBoolean(true);
    game.answerDecision(Tuffnut.id, { kind: "numeric", value: 0 });
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 0);
    expectFabCard(Tuffnut, nimblismBlue).toBeIn("hand");
  });

  it("timing: declining the defend payment creates no Toughness", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: tuffnut,
        hand: [digInRed],
        resourcePoints: 3,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Tuffnut.defendWith(digInRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 0);
    expectFabPlayer(Tuffnut).toHaveResourceCount(3);
  });
});
