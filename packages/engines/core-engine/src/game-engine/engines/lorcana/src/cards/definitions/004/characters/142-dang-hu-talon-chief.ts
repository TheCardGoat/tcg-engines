import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dangHuTalonChief: LorcanaCharacterCardDefinition = {
  id: "ave",
  missingTestCase: true,
  name: "Dang Hu",
  title: "Talon Chief",
  characteristics: ["storyborn", "villain"],
  text: "**YOU BETTER TALK FAST** Your other Villain characters gain **Support.** _(Whenever they quest, you mad add their {S} to another chosen character's {S} this turn.)_",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "YOU BETTER TALK FAST",
      text: "Your other Villain characters gain **Support.** _(Whenever they quest, you mad add their {S} to another chosen character's {S} this turn.)_",
      gainedAbility: supportAbility,
      target: {
        type: "card",
        value: "all",
        excludeSelf: true,
        filters: [
          { filter: "owner", value: "self" },
          { filter: "type", value: "character" },
          { filter: "characteristics", value: "villain" },
          { filter: "zone", value: "play" },
        ],
      },
    },
  ],
  flavour: "You can find villainy in the most unexpected places.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  illustrator: "Rudy Hill",
  number: 142,
  set: "URR",
  rarity: "rare",
};
