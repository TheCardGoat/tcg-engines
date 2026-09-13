import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { grimoireOfFellingsong } from "./grimoire-of-fellingsong.ts";

describe("Grimoire of Fellingsong (PEN092) AAA", () => {
  it("happy: pay 1 resource and destroy this to create a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [grimoireOfFellingsong],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.activate(grimoireOfFellingsong);
    game.helpers.resolveUntilIdle();

    expectFabCard(Viserai, grimoireOfFellingsong).toBeIn("graveyard");
    expect(Viserai.zone("arena")).toContain("token:runechant");
  });

  it("boundary: the grimoire is gone after it is destroyed for the token", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [grimoireOfFellingsong],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.activate(grimoireOfFellingsong);
    game.helpers.resolveUntilIdle();

    expectFabCard(Viserai, grimoireOfFellingsong).toBeIn("graveyard");
    Viserai.expectActivationRejected(grimoireOfFellingsong);
  });
});
