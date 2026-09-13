import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { healingBalmBlue, healingBalmRed, healingBalmYellow } from "./healing-balm.ts";

const variants = [
  { label: "red", card: healingBalmRed, amount: 3 },
  { label: "yellow", card: healingBalmYellow, amount: 2 },
  { label: "blue", card: healingBalmBlue, amount: 1 },
] as const;

describe.each(variants)("Healing Balm $label AAA", ({ card, amount }) => {
  it("happy: gains the pitch-scaled life amount", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [card], actionPoints: 1, life: 20, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(card);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(20 + amount);
    expectFabCard(Dash, card).toBeIn("graveyard");
  });
});
