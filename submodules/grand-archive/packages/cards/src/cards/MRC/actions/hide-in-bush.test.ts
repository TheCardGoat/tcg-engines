import { blightroot } from "../../ALC/tokens/blightroot.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { springleaf } from "../../ALC/tokens/springleaf.ts";
import { manaroot } from "../../ALC/tokens/manaroot.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe } from "vitest";
import { hideInBush } from "./hide-in-bush.ts";

/** @covers hj1trn0yet-a1 */
describe("Hide in Bush Brew", () => {
  proveBrewPotion({
    card: hideInBush,
    reserveCost: 5,
    ingredients: [fraysia, springleaf, blightroot, manaroot],
    wrongIngredients: [fraysia, springleaf, blightroot, woodlandSquirrels],
  });
});
