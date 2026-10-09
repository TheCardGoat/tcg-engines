import { proveBrewEntry } from "../../../testing/brew-entry.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { springleaf } from "../../ALC/tokens/springleaf.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe } from "vitest";
import { speedPotion } from "./speed-potion.ts";

/** @covers 0Z1r8GC8a8-a1 */
describe("Speed Potion Brew", () => {
  proveBrewPotion({
    card: speedPotion,
    reserveCost: 3,
    ingredients: [fraysia, springleaf],
    wrongIngredients: [fraysia, woodlandSquirrels],
  });
});

/** @covers 0Z1r8GC8a8-a2 */
describe("speedPotion brewed entry", () => {
  proveBrewEntry({
    card: speedPotion,
    ingredients: [fraysia, springleaf],
    reserveCost: 3,
    draw: 1,
  });
});
