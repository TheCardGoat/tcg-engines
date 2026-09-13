import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { bareDestructionRed } from "./bare-destruction.ts";
import { alphaInstinctBlue } from "./alpha-instinct.ts";

describe("Alpha Instinct (ARR022) AAA", () => {
  it("happy: discarded to beat chest creates a Might token", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bareDestructionRed, alphaInstinctBlue],
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, hand: 2, deck: 4 },
    );
    const Fai = game.as(fai);
    const alphaId = Fai.findCardInZone("hand", alphaInstinctBlue);

    Fai.play(bareDestructionRed, {
      beatChest: true,
      beatChestInstanceId: alphaId,
      target: game.as(dash).id,
    });

    expect(Fai.zone("arena").some((id) => /might/i.test(id))).toBe(true);
    expect(Fai.zone("graveyard")).toContain(alphaInstinctBlue.canonicalId);
  });

  it("boundary: playing the beat-chest attack without discarding Alpha Instinct creates no Might", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bareDestructionRed, alphaInstinctBlue],
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, hand: 2, deck: 4 },
    );
    const Fai = game.as(fai);

    Fai.play(bareDestructionRed, { target: game.as(dash).id });

    expect(Fai.zone("arena").some((id) => /might/i.test(id))).toBe(false);
    expect(Fai.zone("hand")).toContain(alphaInstinctBlue.canonicalId);
  });
});
