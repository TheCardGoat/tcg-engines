import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe } from "vitest";
import { distilledWater } from "./distilled-water.ts";

/** @covers O1OU62Zx2Y-a1 */
describe("Distilled Water Brew", () => {
  proveBrewPotion({
    card: distilledWater,
    reserveCost: 0,
    ingredients: [fraysia],
    wrongIngredients: [woodlandSquirrels],
  });
});
