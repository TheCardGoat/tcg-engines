// TODO: Once the set is released, we organize the cards by set and type

import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const madamMimTinyAdversary: LorcanaCharacterCardDefinition = {
  id: "mha",
  name: "Madam Mim",
  title: "Tiny Adversary",
  characteristics: ["storyborn", "villain", "sorcerer"],
  text: "Challenger +1 (While challenging, this character gets +1 {S}.)\nZIM ZABBERIM ZIM Your other characters gain Challenger +1.",
  type: "character",
  abilities: [
    challengerAbility(1),
    {
      type: "static",
      ability: "gain-ability",
      name: "Zim Zabberim Zim",
      text: "Your other characters gain Challenger +1.",
      gainedAbility: challengerAbility(1),
      target: {
        type: "card",
        value: "all",
        excludeSelf: true,
        filters: [
          { filter: "zone", value: "play" },
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
        ],
      },
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 0,
  willpower: 3,
  lore: 1,
  illustrator: "Moniek Schilder",
  number: 37,
  set: "006",
  rarity: "rare",
};
