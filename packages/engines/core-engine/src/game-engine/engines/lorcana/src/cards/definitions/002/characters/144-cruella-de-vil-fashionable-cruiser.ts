import {
  duringYourTurnGains,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cruellaDeVilFashionableCruiser: LorcanaCharacterCardDefinition = {
  id: "b6i",
  reprints: ["ej7"],
  name: "Cruella De Vil",
  title: "Fashionable Cruiser",
  characteristics: ["dreamborn", "villain"],
  text: "**NOW GET GOING** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
  type: "character",
  abilities: [
    duringYourTurnGains(
      "Now Get Going",
      "During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
      evasiveAbility,
    ),
  ],
  flavour: "Isn't it just gorgeous, darling? And just as stylish as I am.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Aisha Durmagambetova",
  number: 144,
  set: "ROF",
  rarity: "common",
};
