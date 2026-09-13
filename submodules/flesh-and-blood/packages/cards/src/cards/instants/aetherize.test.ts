import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { lubricateBlue } from "./lubricate.ts";
import { aetherizeBlue } from "./aetherize.ts";

const cog = fabToken("golden-cog");

describe("Aetherize (CRU164) AAA", () => {
  it("happy: negates a cost-0 Instant on the stack so it does not untap", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [lubricateBlue],
        arena: [{ card: cog, state: { tapped: true } }],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kano,
        hand: [aetherizeBlue],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Kano = game.as(kano);

    Teklo.play(lubricateBlue);
    Teklo.pass();
    Kano.play(aetherizeBlue, { target: Teklo.findCardInZone("stack", lubricateBlue) });
    game.helpers.resolveUntilIdle();

    expectFabCard(Teklo, lubricateBlue).toBeIn("graveyard");
    expectFabCard(Teklo, cog).toBeTapped();
    expectFabCard(Kano, aetherizeBlue).toBeIn("graveyard");
  });

  it("boundary: with an empty stack the Instant has no legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [aetherizeBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: teklovossen, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    expectFabUnplayable(() => Kano.play(aetherizeBlue), /no legal target|couldn't be played/i);
    expectFabCard(Kano, aetherizeBlue).toBeIn("hand");
  });

  it("timing: the negated Instant never untaps the Cog", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [lubricateBlue],
        arena: [{ card: cog, state: { tapped: true } }],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kano,
        hand: [aetherizeBlue],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Kano = game.as(kano);

    Teklo.play(lubricateBlue);
    Teklo.pass();
    Kano.play(aetherizeBlue, { target: Teklo.findCardInZone("stack", lubricateBlue) });
    game.helpers.resolveUntilIdle();

    expectFabCard(Teklo, cog).toBeTapped();
  });
});
