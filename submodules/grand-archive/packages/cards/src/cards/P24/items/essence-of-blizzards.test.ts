import { blightroot } from "../../ALC/tokens/blightroot.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { manaroot } from "../../ALC/tokens/manaroot.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe } from "vitest";
import { essenceOfBlizzards } from "./essence-of-blizzards.ts";

/** @covers k1l75tlzsm-a1 */
describe("Essence of Blizzards Brew", () => {
  proveBrewPotion({
    card: essenceOfBlizzards,
    reserveCost: 4,
    ingredients: [fraysia, blightroot],
    wrongIngredients: [fraysia, manaroot],
  });
});
