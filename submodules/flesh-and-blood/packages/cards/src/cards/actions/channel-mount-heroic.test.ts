import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar, brutalAssaultBlue } from "../shared/test-recipients.ts";
import { weaveEarthRed } from "./weave-earth.ts";
import { channelMountHeroicRed } from "./channel-mount-heroic.ts";

describe("Channel Mount Heroic (ELE117) AAA", () => {
  it("happy: attack action cards you control have +3{p} while this is in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [channelMountHeroicRed, brutalAssaultBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(channelMountHeroicRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    expectFabCard(Briar, channelMountHeroicRed).toBeIn("arena");
    expectFabPlayer(Briar).toHaveAP(1);

    Briar.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: an opposing attack action does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [channelMountHeroicRed],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: at your end phase an Earth card from pitch keeps this in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        arena: [channelMountHeroicRed],
        pitch: [weaveEarthRed],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.endTurn();
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Briar, channelMountHeroicRed).toBeIn("arena");
    expectFabCard(Briar, channelMountHeroicRed).toHaveCounters(1, "flow");
    expect(Briar.zone("deck")[0]).toBe(weaveEarthRed.canonicalId);
  });

  it("timing: with no Earth card in pitch at your end phase this destroys itself", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        arena: [channelMountHeroicRed],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Briar, channelMountHeroicRed).toBeIn("graveyard");
  });
});
