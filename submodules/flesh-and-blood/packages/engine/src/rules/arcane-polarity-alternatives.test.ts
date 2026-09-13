import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, sigilOfSolaceRed } from "./fixtures.ts";
import { flashBoltRed } from "../../../cards/src/cards/instants/flash-bolt.ts";
import { arcanePolarityRed } from "../../../cards/src/cards/instants/arcane-polarity.ts";
import { arcanePolarityYellow } from "../../../cards/src/cards/instants/arcane-polarity.ts";
import { arcanePolarityBlue } from "../../../cards/src/cards/instants/arcane-polarity.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;
type ArcanePolarity = typeof arcanePolarityRed;

function startArcanePolarityGame(card: ArcanePolarity) {
  return FabTestEngine.start(
    {
      hero: dash,
      life: 10,
      hand: [card, nimblismBlue, nimblismBlue, nimblismBlue],
      arsenal: [sigilOfSolaceRed],
      deck: 4,
    },
    {
      hero: bravo,
      resourcePoints: 2,
      hand: [flashBoltRed, nimblismBlue, nimblismBlue, nimblismBlue],
      arsenal: [sigilOfSolaceRed],
      deck: 4,
    },
    manual,
  );
}

describe("Arcane Polarity alternative life gain", () => {
  it("AAA false branch: without arcane damage taken, red gains only 1 life", () => {
    const game = startArcanePolarityGame(arcanePolarityRed);
    const Dash = game.as(dash);

    Dash.play(arcanePolarityRed);
    game.passBoth();

    expect(Dash.life()).toBe(11);
  });

  it("AAA true branch: arcane damage taken by the controller replaces red's base 1 with 4", () => {
    const game = startArcanePolarityGame(arcanePolarityRed);
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.pass();
    Bravo.play(flashBoltRed, { target: Dash.id });
    game.passBoth();
    expect(Dash.life()).toBe(7);

    Dash.play(arcanePolarityRed);
    game.passBoth();

    expect(Dash.life()).toBe(11);
  });

  it("AAA pitch variants: yellow and blue apply their own arcane-damage-taken alternatives", () => {
    const yellow = startArcanePolarityGame(arcanePolarityYellow);
    const YellowDash = yellow.as(dash);
    const YellowBravo = yellow.as(bravo);
    YellowDash.pass();
    YellowBravo.play(flashBoltRed, { target: YellowDash.id });
    yellow.passBoth();
    YellowDash.play(arcanePolarityYellow);
    yellow.passBoth();

    const blue = startArcanePolarityGame(arcanePolarityBlue);
    const BlueDash = blue.as(dash);
    const BlueBravo = blue.as(bravo);
    BlueDash.pass();
    BlueBravo.play(flashBoltRed, { target: BlueDash.id });
    blue.passBoth();
    BlueDash.play(arcanePolarityBlue);
    blue.passBoth();

    expect(YellowDash.life()).toBe(10); // 10 - 3 + 3
    expect(BlueDash.life()).toBe(9); // 10 - 3 + 2
  });
});
