import { describe } from "vitest";
import { proveSacrificeRecovery } from "../../../testing/sacrifice-recovery.ts";

import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { blightroot } from "../tokens/blightroot.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "./potion-of-healing.ts";

/** @covers qtb31x97n2-a1 */
describe("potion-of-healing — Brew", () => {
  proveBrewPotion({
    card: potionOfHealing,
    reserveCost: 3,
    ingredients: [fraysia, blightroot],
    wrongIngredients: [fraysia, woodlandSquirrels],
  });
});

/** @covers qtb31x97n2-a2 */
describe("Potion of Healing — Recover 5", () => {
  proveSacrificeRecovery({ card: potionOfHealing, abilityId: "qtb31x97n2-a2", amount: 5 });
});
