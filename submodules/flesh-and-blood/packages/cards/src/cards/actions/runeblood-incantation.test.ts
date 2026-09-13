import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { runebloodIncantationRed as runebloodIncantation } from "./runeblood-incantation.ts";

describe("runebloodIncantation family AAA", () => {
  it("happy: enters the arena with 3 verse counters", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [runebloodIncantation],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(runebloodIncantation);
    game.helpers.resolveUntilIdle();
    expectFabCard(Briar, runebloodIncantation).toBeIn("arena").toHaveCounters(3, "verse");
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("timing: the next action phase removes a verse counter and creates a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [runebloodIncantation],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(runebloodIncantation);
    game.helpers.resolveUntilIdle();
    Briar.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Briar, runebloodIncantation).toBeIn("arena").toHaveCounters(2, "verse");
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);
  });

  it("boundary: with no verse counters left, it is destroyed instead", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        arena: [runebloodIncantation],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expectFabCard(Briar, runebloodIncantation).toBeIn("arena").toHaveCounters(0, "verse");
    Briar.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Briar, runebloodIncantation).toBeIn("graveyard");
  });
});
