import { blightroot } from "../../ALC/tokens/blightroot.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { manaroot } from "../../ALC/tokens/manaroot.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe } from "vitest";
import { tonicOfRemembrance } from "./tonic-of-remembrance.ts";

/** @covers uqrptjej4m-a1 */
describe("Tonic of Remembrance Brew", () => {
  proveBrewPotion({
    card: tonicOfRemembrance,
    reserveCost: 3,
    ingredients: [fraysia, blightroot],
    wrongIngredients: [fraysia, manaroot],
  });
});
