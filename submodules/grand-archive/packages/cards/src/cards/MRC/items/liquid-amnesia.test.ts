import { blightroot } from "../../ALC/tokens/blightroot.ts";
import { manaroot } from "../../ALC/tokens/manaroot.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe } from "vitest";
import { liquidAmnesia } from "./liquid-amnesia.ts";

/** @covers k0hliqs2hi-a1 */
describe("Liquid Amnesia Brew", () => {
  proveBrewPotion({
    card: liquidAmnesia,
    reserveCost: 2,
    ingredients: [blightroot],
    wrongIngredients: [manaroot],
  });
});
