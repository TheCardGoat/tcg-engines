import { silvershine } from "../../ALC/tokens/silvershine.ts";
import { blightroot } from "../../ALC/tokens/blightroot.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { manaroot } from "../../ALC/tokens/manaroot.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe } from "vitest";
import { refractedTwilight } from "./refracted-twilight.ts";

/** @covers me0xxw0plq-a1 */
describe("Refracted Twilight Brew", () => {
  proveBrewPotion({
    card: refractedTwilight,
    reserveCost: 6,
    ingredients: [silvershine, silvershine, fraysia, blightroot, manaroot],
    wrongIngredients: [silvershine, fraysia, fraysia, blightroot, manaroot],
  });
});
