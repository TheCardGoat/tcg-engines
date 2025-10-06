import {
  madameMimAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const madamMimAsRhinoceros: LorcanaCharacterCardDefinition = {
  id: "xlw",
  name: "Madam Mim",
  title: "Rhino",
  characteristics: ["floodborn", "villain", "mage"],
  text: "SHIFT 2 (You can pay 2 {I} to play this character on one of your Madame Mime characters.)\nMAKE WAY, I'M COMING! When you play this character, banish it or return one of your other characters in play to your hand.",
  type: "character",
  inkwell: false,
  colors: ["amethyst", "ruby"],
  cost: 6,
  strength: 6,
  willpower: 5,
  illustrator: "Allbeth Zermeno",
  number: 69,
  set: "008",
  rarity: "uncommon",
  lore: 1,
  abilities: [
    shiftAbility(2, "Madam Mim"),
    {
      ...madameMimAbility,
      name: "MAKE WAY, I'M COMING!",
    },
  ],
};
