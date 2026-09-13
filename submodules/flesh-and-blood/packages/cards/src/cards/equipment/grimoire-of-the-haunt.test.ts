import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { grimoireOfTheHaunt } from "./grimoire-of-the-haunt.ts";

describe("Grimoire of the Haunt (DTD136) AAA", () => {
  it("happy: pay {r} and banish this to create an Eloquence token", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon2: [grimoireOfTheHaunt],
        hand: [],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    expectFabCard(Viserai, grimoireOfTheHaunt).toHaveKeyword("blood-debt");
    Viserai.activate(grimoireOfTheHaunt);
    game.helpers.resolveUntilIdle();

    expectFabCard(Viserai, grimoireOfTheHaunt).toBeBanished();
    expectFabPlayer(Viserai).toHaveTokenCount("eloquence", 1);
    expectFabPlayer(Viserai).toHaveResourceCount(0);
  });

  it("boundary: without {r} the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon2: [grimoireOfTheHaunt],
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.expectActivationRejected(grimoireOfTheHaunt);
    expectFabCard(Viserai, grimoireOfTheHaunt).toBeIn("weapon2");
  });

  it("timing: printed Arcane Barrier stays on the seated grimoire", () => {
    const game = FabTestEngine.start(
      { hero: viserai, weapon2: [grimoireOfTheHaunt], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(viserai), grimoireOfTheHaunt).toHaveKeyword("arcane-barrier");
    expectFabCard(game.as(viserai), grimoireOfTheHaunt).toHaveKeyword("blood-debt");
  });
});
