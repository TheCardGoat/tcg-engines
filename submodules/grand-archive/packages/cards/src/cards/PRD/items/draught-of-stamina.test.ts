import { blightroot } from "../../ALC/tokens/blightroot.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { springleaf } from "../../ALC/tokens/springleaf.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe } from "vitest";
import { draughtOfStamina } from "./draught-of-stamina.ts";

/** @covers lpnvx7mnu1-a1 */
describe("Draught of Stamina Brew", () => {
  proveBrewPotion({
    card: draughtOfStamina,
    reserveCost: 4,
    ingredients: [springleaf, fraysia, blightroot],
    wrongIngredients: [fraysia, fraysia, blightroot],
  });
});
