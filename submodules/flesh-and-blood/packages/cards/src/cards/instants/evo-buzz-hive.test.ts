import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseChest } from "../equipment/teklo-base-chest.ts";
import { evoBuzzHiveYellow } from "./evo-buzz-hive.ts";

describe("Evo Buzz Hive (EVO051) AAA", () => {
  it("happy: transforming a base chest equips this and gains 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
        hand: [evoBuzzHiveYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoBuzzHiveYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Teklo, evoBuzzHiveYellow).toBeIn("chest");
    expect(Teklo.zone("chest")).not.toContain(tekloBaseChest.canonicalId);
    expectFabPlayer(Teklo).toHaveResourceCount(1);
  });

  it("boundary: without a base chest this does not enter the chest slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoBuzzHiveYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoBuzzHiveYellow);
    game.helpers.resolveUntilIdle();

    expect(Teklo.zone("chest")).not.toContain(evoBuzzHiveYellow.canonicalId);
    expectFabCard(Teklo, evoBuzzHiveYellow).toBeIn("graveyard");
  });

  it("timing: the Instant does not spend an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
        hand: [evoBuzzHiveYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoBuzzHiveYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Teklo).toHaveAP(1);
  });
});
