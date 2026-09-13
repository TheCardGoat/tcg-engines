import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { katsu } from "../heroes/katsu.ts";
import { maskOfTheSwarmingClaw } from "./mask-of-the-swarming-claw.ts";

describe("Mask of the Swarming Claw (PEN030) AAA", () => {
  it("happy: printed Arcane Barrier and Spellvoid are live at rest", () => {
    const game = FabTestEngine.start(
      { hero: katsu, head: [maskOfTheSwarmingClaw], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    expectFabCard(Katsu, maskOfTheSwarmingClaw).toHaveKeyword("arcane-barrier");
    expectFabCard(Katsu, maskOfTheSwarmingClaw).toHaveKeyword("spellvoid");
    expectFabCard(Katsu, maskOfTheSwarmingClaw).toBeIn("head");
  });

  it("boundary: physical combat does not destroy the mask", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], deck: 6 },
      { hero: katsu, life: 20, head: [maskOfTheSwarmingClaw], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(katsu), maskOfTheSwarmingClaw).toBeIn("head");
    expectFabCard(game.as(katsu), maskOfTheSwarmingClaw).toHaveKeyword("spellvoid");
  });

  it("timing: the mask stays equipped after a turn change", () => {
    const game = FabTestEngine.start(
      { hero: katsu, head: [maskOfTheSwarmingClaw], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.endTurn();

    expectFabCard(Katsu, maskOfTheSwarmingClaw).toBeIn("head");
    expectFabCard(Katsu, maskOfTheSwarmingClaw).toHaveKeyword("spellvoid");
  });
});
