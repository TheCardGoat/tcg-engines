import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { springleaf } from "../../ALC/tokens/springleaf.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe } from "vitest";
import { soothingPotion } from "./soothing-potion.ts";

/** @covers gnYM2V6TTw-a1 */
describe("Soothing Potion Brew", () => {
  proveBrewPotion({
    card: soothingPotion,
    reserveCost: 6,
    ingredients: [fraysia, fraysia],
    wrongIngredients: [fraysia, springleaf],
  });
});
