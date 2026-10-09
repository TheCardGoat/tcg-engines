import { manaroot } from "../../ALC/tokens/manaroot.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe } from "vitest";
import { invigoratingConcoction } from "./invigorating-concoction.ts";

/** @covers nsjukk5zk4-a1 */
describe("Invigorating Concoction Brew", () => {
  proveBrewPotion({
    card: invigoratingConcoction,
    reserveCost: 7,
    ingredients: [fraysia, manaroot],
    wrongIngredients: [manaroot, manaroot],
  });
});
