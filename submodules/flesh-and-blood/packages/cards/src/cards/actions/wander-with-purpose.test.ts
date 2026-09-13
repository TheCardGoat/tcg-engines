import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { benjiThePiercingWind } from "../heroes/benji-the-piercing-wind.ts";
import { flusterFistRed } from "./fluster-fist.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { wanderWithPurposeYellow } from "./wander-with-purpose.ts";

/**
 * Wander with Purpose (OUT053) — Benji spec Ninja Attack. Yellow 0-cost 2{p}/3{d}. Go again.
 * When this hits, you may discard a cost-0 card. If you do, search combo, banish it, you may play it this turn.
 */

describe("Wander with Purpose (OUT053) AAA", () => {
  it("happy: when this hits, discard a cost-0 card and banish a combo card from deck", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [wanderWithPurposeYellow, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
        deckTop: [flusterFistRed],
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Benji = game.as(benjiThePiercingWind);

    Benji.playAttack(wanderWithPurposeYellow);
    game.closeCombat({
      optionals: "accept",
      ordering: "listed",
      entityTargets: "maximum",
    });

    expectFabPlayer(game.as(dash)).toHaveLife(18);
    expectFabCard(Benji, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Benji, flusterFistRed).toBeBanished();
  });

  it("boundary: a blocked miss does not search a combo card", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [wanderWithPurposeYellow, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
        deckTop: [flusterFistRed],
      },
      { hero: dash, life: 20, hand: [snatchRed, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Benji = game.as(benjiThePiercingWind);
    const Dash = game.as(dash);

    Benji.playAttack(wanderWithPurposeYellow);
    expect(() => Dash.defendWith(snatchRed, snatchRed)).toThrow(
      /prevents this card from defending/,
    );
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(18);
    expect(Benji.zone("deck")).toContain(flusterFistRed.canonicalId);
  });

  it("timing: declining the discard leaves the combo card in the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [wanderWithPurposeYellow, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
        deckTop: [flusterFistRed],
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Benji = game.as(benjiThePiercingWind);

    Benji.playAttack(wanderWithPurposeYellow);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(18);
    expect(Benji.zone("hand")).toContain(nimblismBlue.canonicalId);
    expect(Benji.zone("deck")).toContain(flusterFistRed.canonicalId);
  });
});
