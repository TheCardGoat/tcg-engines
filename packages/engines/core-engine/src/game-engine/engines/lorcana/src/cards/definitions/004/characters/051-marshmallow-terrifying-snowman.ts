import { forEachCardInYourHand } from "~/game-engine/engines/lorcana/src/abilities/amounts";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities";

export const marshmallowTerrifyingSnowman: LorcanaCharacterCardDefinition = {
  id: "np5",
  missingTestCase: true,
  name: "Marshmallow",
  title: "Terrifying Snowman",
  characteristics: ["storyborn", "ally"],
  text: "**BEHEMOTH** This character gets +1 {S} for each card in your hand.",
  type: "character",
  abilities: [
    propertyStaticAbilities({
      name: "Behemoth",
      text: "This character gets +1 {S} for each card in your hand.",
      attribute: "strength",
      amount: forEachCardInYourHand,
    }),
  ],
  flavour: "You're very strong. Do you work out? −Olaf",
  colors: ["amethyst"],
  cost: 3,
  willpower: 3,
  strength: 0,
  lore: 1,
  illustrator: "Simone Buonfantion",
  number: 51,
  set: "URR",
  rarity: "uncommon",
};
