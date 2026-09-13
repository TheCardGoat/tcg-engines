import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { lexi } from "../heroes/lexi.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { blizzardBoltRed } from "./blizzard-bolt.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { nimbleStrikeRed } from "./nimble-strike.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { insidiousChillBlue } from "./insidious-chill.ts";

describe("Insidious Chill (UPR140) AAA", () => {
  it("happy: enters with 3 frost counters; an Ice Fuse removes one and the target hero discards", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [blizzardBoltRed],
        hand: [insidiousChillBlue, weaveIceRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [nimbleStrikeRed, brutalAssaultBlue], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.play(insidiousChillBlue);
    game.passBoth();
    expectFabCard(Lexi, insidiousChillBlue).toBeIn("arena");
    expectFabCard(Lexi, insidiousChillBlue).toHaveCounters(3, "frost");

    Lexi.attackWith(blizzardBoltRed, { from: "arsenal", fuse: true, fuseCards: [weaveIceRed] });
    // a3 removes a frost counter (3 -> 2); Dash cannot pay {r}{r} (0 seeded) so
    // the unless falls through to the discard.
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Lexi, insidiousChillBlue).toHaveCounters(2, "frost");
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Lexi, weaveIceRed).toBeIn("hand");
  });

  it("boundary (engine gap pin): the {r}{r} escape never surfaces — the discard is forced even with 2{r} banked", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [blizzardBoltRed],
        hand: [insidiousChillBlue, weaveIceRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 4,
      },
      {
        hero: dash,
        hand: [nimbleStrikeRed, brutalAssaultBlue],
        life: 20,
        resourcePoints: 2,
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.play(insidiousChillBlue);
    game.passBoth();

    Lexi.attackWith(blizzardBoltRed, { from: "arsenal", fuse: true, fuseCards: [weaveIceRed] });
    Dash.defendWith();
    game.passBoth();
    // MISBEHAVIOR PIN (plan §5): printed "unless they pay {r}{r}" — the target
    // hero should get a pay decision (2{r} banked here), but no boolean/option
    // ever pends for them; the discard commits unconditionally. Flip this pin
    // when the unless-escape is wired for opponent payers.
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Lexi, insidiousChillBlue).toHaveCounters(2, "frost");
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabPlayer(Dash).toHaveResourceCount(2);
  });

  it("timing: removing the last frost counter destroys Insidious Chill", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [blizzardBoltRed],
        arena: [{ card: insidiousChillBlue, state: { namedCounters: { frost: 1 } } }],
        hand: [weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [nimbleStrikeRed], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    Lexi.attackWith(blizzardBoltRed, { from: "arsenal", fuse: true, fuseCards: [weaveIceRed] });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Lexi, insidiousChillBlue).toBeIn("graveyard");
  });
});
