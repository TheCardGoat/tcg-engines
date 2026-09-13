import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { callToTheGraveBlue } from "./call-to-the-grave.ts";

describe("Call to the Grave (ROS218) AAA", () => {
  it("happy: search puts the chosen deck card into the graveyard and shuffles", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [callToTheGraveBlue],
        deck: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(callToTheGraveBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: brutalAssaultBlue.canonicalId });

    expectFabCard(Briar, brutalAssaultBlue).toBeIn("graveyard");
    expectFabCard(Briar, callToTheGraveBlue).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: an empty deck still resolves and refunds the action point", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [callToTheGraveBlue], deck: [], actionPoints: 1 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(callToTheGraveBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Briar, callToTheGraveBlue).toBeIn("graveyard");
    expect(Briar.zone("graveyard")).toHaveLength(1);
    expectFabPlayer(Briar).toHaveAP(1);
  });
});
