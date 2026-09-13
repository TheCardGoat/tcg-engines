import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { requiemForTheDamnedRed } from "./requiem-for-the-damned.ts";

describe("Requiem for the Damned (DTD141) AAA", () => {
  it("happy: playing Requiem from hand creates an Eloquence token", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [requiemForTheDamnedRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(requiemForTheDamnedRed);
    game.helpers.resolveUntilIdle();

    expect(Chane.zone("arena")).toContain("token:eloquence");
    expectFabPlayer(Chane).toHaveTokenCount("eloquence", 1);
    expectFabCard(Chane, requiemForTheDamnedRed).toBeIn("graveyard");
  });

  it("boundary: the Eloquence token is created only under the controller", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [requiemForTheDamnedRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(requiemForTheDamnedRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Chane).toHaveTokenCount("eloquence", 1);
    expectFabPlayer(Dash).toHaveTokenCount("eloquence", 0);
    expect(Dash.zone("arena")).not.toContain("token:eloquence");
  });

  it("timing: playing Requiem from the banished zone still creates the token", () => {
    const game = FabTestEngine.start(
      { hero: chane, banished: [requiemForTheDamnedRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(requiemForTheDamnedRed, { from: "banished" });
    game.helpers.resolveUntilIdle();

    expect(Chane.zone("arena")).toContain("token:eloquence");
    expectFabPlayer(Chane).toHaveTokenCount("eloquence", 1);
    expectFabCard(Chane, requiemForTheDamnedRed).toBeIn("graveyard");
  });
});
