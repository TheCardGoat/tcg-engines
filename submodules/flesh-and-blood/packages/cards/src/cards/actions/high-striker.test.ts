import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { highStrikerBlue, highStrikerRed, highStrikerYellow } from "./high-striker.ts";

const variants = [
  { label: "red", card: highStrikerRed, count: 6 },
  { label: "yellow", card: highStrikerYellow, count: 4 },
  { label: "blue", card: highStrikerBlue, count: 2 },
] as const;

describe.each(variants)("High Striker $label AAA", ({ card, count }) => {
  it("happy: the next attack hit creates pitch-scaled Copper", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [card, snatchRed], actionPoints: 2, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(card);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });
    expect(Dash.zone("arena").filter((id) => id === "token:copper")).toHaveLength(count);
    expectFabCard(Dash, card).toBeIn("graveyard");
  });

  it("boundary: a fully defended attack creates no Copper", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [card, snatchRed], actionPoints: 2, deck: 6 },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(card);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(snatchRed);
    game.as(bravo).defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat({ ordering: "listed" });
    expect(Dash.zone("arena")).not.toContain("token:copper");
  });
});
