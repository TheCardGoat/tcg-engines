import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { springleaf } from "../../ALC/tokens/springleaf.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe } from "vitest";
import { explosiveConcoction } from "./explosive-concoction.ts";

/** @covers yorsltrnu3-a1 */
describe("Explosive Concoction Brew", () => {
  proveBrewPotion({
    card: explosiveConcoction,
    reserveCost: 7,
    ingredients: [springleaf, fraysia],
    wrongIngredients: [fraysia, fraysia],
  });
});
