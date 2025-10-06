import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const motherGothelWitheredAndWicked: LorcanaCharacterCardDefinition = {
  id: "dmj",

  name: "Mother Gothel",
  title: "Withered and Wicked",
  characteristics: ["storyborn", "villain"],
  text: "**WHAT HAVE YOU DONE?!** This character enters play with 3 damage.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "What Have You Done?!",
      text: "This character enters play with 3 damage.",
      effects: [
        {
          type: "damage",
          amount: 3,
          target: thisCharacter,
        },
      ],
    },
  ],
  flavour: "Her feelings are written all over her face.",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Koni",
  number: 116,
  set: "ROF",
  rarity: "uncommon",
};
