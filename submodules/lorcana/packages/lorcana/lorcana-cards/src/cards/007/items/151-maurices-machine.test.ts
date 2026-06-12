import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { healingDecanter } from "../../005/items/030-healing-decanter";
import { sapphireChromicon } from "../../005/items/168-sapphire-chromicon";
import { amethystCoil } from "./084-amethyst-coil";
import { mauricesMachine } from "./151-maurices-machine";

describe("Maurice's Machine", () => {
  it("may return an item with cost 2 or less from your discard when it is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      discard: [healingDecanter],
      inkwell: 2,
      play: [mauricesMachine, sapphireChromicon],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(sapphireChromicon, {
        costs: {
          banishItems: [mauricesMachine],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mauricesMachine)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mauricesMachine, {
        resolveOptional: true,
        targets: [healingDecanter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(healingDecanter)).toBe("hand");
  });

  it("does not trigger BREAK DOWN when only items with cost greater than 2 are in discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      discard: [amethystCoil],
      inkwell: 2,
      play: [mauricesMachine, sapphireChromicon],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(sapphireChromicon, {
        costs: {
          banishItems: [mauricesMachine],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mauricesMachine)).toBe("discard");
    // amethystCoil costs 3, which exceeds the max cost of 2 — no eligible candidates so
    // the optional BREAK DOWN trigger should be suppressed entirely (no bag queued)
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    // amethystCoil should remain in discard
    expect(testEngine.asPlayerOne().getCardZone(amethystCoil)).toBe("discard");
  });
});
