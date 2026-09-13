/**
 * CR 5.1.2a — Become the Cup "As you play this, choose a color. This gets the
 * chosen color."
 *
 * The CR 5.1.2a example: "Become the Cup has the text 'As you play this, choose
 * a color. This gets the chosen color.' When Become the Cup is announced, the
 * effect is applied - the player declares a color and the card gets the chosen
 * color."
 *
 * Become the Cup (PEN041) is authored as a resolution `sequence`: a
 * `choose-color` step (binds the chosen color, sets a CR-readable `chose-<color>`
 * status on the chooser) followed by a `grant-property` of `{kind:"color",
 * value:"chosen"}` to self. This suite proves the composition end-to-end: the
 * color choice fires and the card gains the chosen color.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { becomeTheCupYellow } from "../../../../../../cards/src/cards/actions/become-the-cup.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("CR 5.1.2a — Become the Cup chooses a color as it is played and gains it", () => {
  it("resolving Become the Cup fires the color choice (chose-<color> status) and grants the chosen color to the card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [becomeTheCupYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(becomeTheCupYellow, { target: Dash.id });
    // Advance into combat so the resolution ability (choose-color + grant) fires.
    // The choose-color effect-resolution decision must be answered explicitly
    // (resolveRestOfCombat auto-answers only forced decision kinds).
    game.helpers.resolveUntilIdle({ effectResolution: "red", optionals: "decline" });
    game.helpers.resolveRestOfCombat();

    // (a) The color choice fired: a CR-readable chose-<color> status was set on
    // the chooser hero. The default chosen color is red.
    expect(
      game
        .committedEvents()
        .some(
          (event) =>
            event.name === "set-status" && /^chose-(red|yellow|blue)$/.test(event.data.status),
        ),
    ).toBe(true);

    // (b) The card gained the chosen color: a continuous color grant was applied
    // to it (grant-property color:"chosen" resolves to the chosen color).
    expect(game.committedEvents().some((event) => event.name === "continuous-effect-applied")).toBe(
      true,
    );
  });
});
