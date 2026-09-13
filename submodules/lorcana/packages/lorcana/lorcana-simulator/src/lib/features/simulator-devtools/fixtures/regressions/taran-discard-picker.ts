import { taranMagicallyArmed } from "@tcg/lorcana-cards/cards/011";
import { donaldDuckStruttingHisStuff, grammaTalaStoryteller } from "@tcg/lorcana-cards/cards/001";
import { olafCarrotEnthusiast } from "@tcg/lorcana-cards/cards/004";
import { createFixture } from "../fixture-factory.js";

export const taranDiscardPickerRegression = createFixture({
  id: "taran-discard-picker",
  name: "Taran - one player's discard selection",
  description: "Choose, deselect, and confirm up to two cards from one player's discard.",
  seed: "taran-discard-picker",
  skipPreGame: true,
  playerOne: {
    hand: [taranMagicallyArmed],
    inkwell: 5,
    discard: [donaldDuckStruttingHisStuff, grammaTalaStoryteller],
    deck: 5,
  },
  playerTwo: { discard: [olafCarrotEnthusiast], deck: 5 },
});
