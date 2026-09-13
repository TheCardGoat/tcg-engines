import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { bareDestructionRed } from "./bare-destruction.ts";
import { aggressivePounceRed } from "./aggressive-pounce.ts";
import { snatchRed } from "./snatch.ts";
import { beastWithinYellow } from "./beast-within.ts";

describe("Beast Within (CRU007) AAA", () => {
  it("happy: discarded from hand banishes the top card and returns it if it has 6+ {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bareDestructionRed, beastWithinYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
        ],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const beastId = Fai.findCardInZone("hand", beastWithinYellow);
    const lifeBefore = Fai.life();

    Fai.play(bareDestructionRed, {
      beatChest: true,
      beatChestInstanceId: beastId,
      target: game.as(dash).id,
    });
    game.helpers.resolveUntilIdle();

    expectFabCard(Fai, beastWithinYellow).toBeIn("graveyard");
    const banishedPounce = Fai.zone("banished").includes(aggressivePounceRed.canonicalId);
    const handedPounce = Fai.zone("hand").includes(aggressivePounceRed.canonicalId);
    expect(banishedPounce || handedPounce).toBe(true);
    expect(Fai.life()).toBeLessThan(lifeBefore);
  });

  it("boundary: resolving from the combat chain does not banish or lose life", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [beastWithinYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
        ],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const lifeBefore = Fai.life();

    Fai.attackWith(beastWithinYellow);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Fai, beastWithinYellow).toBeIn("graveyard");
    expect(Fai.zone("hand")).not.toContain(aggressivePounceRed.canonicalId);
    expectFabPlayer(Fai).toHaveLife(lifeBefore);
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("timing: if the banished card has less than 6 {p}, repeat until a 6+ {p} card is banished", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bareDestructionRed, beastWithinYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
          aggressivePounceRed,
          snatchRed,
        ],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const beastId = Fai.findCardInZone("hand", beastWithinYellow);
    const lifeBefore = Fai.life();

    Fai.play(bareDestructionRed, {
      beatChest: true,
      beatChestInstanceId: beastId,
      target: game.as(dash).id,
    });
    game.helpers.resolveUntilIdle();

    expectFabCard(Fai, beastWithinYellow).toBeIn("graveyard");
    expect(Fai.zone("banished")).toContain(snatchRed.canonicalId);
    expect(Fai.zone("hand")).toContain(aggressivePounceRed.canonicalId);
    expect(
      Fai.zone("banished").filter((id) => id === aggressivePounceRed.canonicalId),
    ).toHaveLength(0);
    expect(Fai.life()).toBe(lifeBefore - 2);
  });
});
