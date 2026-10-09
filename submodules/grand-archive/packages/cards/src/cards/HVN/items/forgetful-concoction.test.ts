import { manaroot } from "../../ALC/tokens/manaroot.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe } from "vitest";
import { forgetfulConcoction } from "./forgetful-concoction.ts";

/** @covers 7kr1haizu8-a1 */
describe("Forgetful Concoction Brew", () => {
  proveBrewPotion({
    card: forgetfulConcoction,
    reserveCost: 7,
    ingredients: [manaroot, fraysia],
    wrongIngredients: [fraysia, fraysia],
  });
});
