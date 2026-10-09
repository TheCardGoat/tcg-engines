import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { springleaf } from "../../ALC/tokens/springleaf.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe } from "vitest";
import { aquaVitae } from "./aqua-vitae.ts";

/** @covers y5ttkat9hr-a1 */
describe("Aqua Vitae Brew", () => {
  proveBrewPotion({
    card: aquaVitae,
    reserveCost: 2,
    ingredients: [springleaf],
    wrongIngredients: [fraysia],
  });
});
