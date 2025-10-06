import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseLeaderOfTheBand: LorcanitoCharacterCardDefinition = {
  id: "mpt",
  name: "Mickey Mouse",
  title: "Leader of the Band",
  characteristics: ["hero", "storyborn"],
  text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_ \n\n\n**STRIKE UP THE MUSIC** When you play this character, chosen character gains **Support ** this turn.",
  type: "character",
  abilities: [
    supportAbility,
    {
      type: "resolution",
      name: "**STRIKE UP THE MUSIC**",
      text: "When you play this character, chosen character gains **Support** this turn.",
      effects: [
        {
          type: "ability",
          ability: "support",
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  illustrator: "Filipe Laurentino",
  number: 15,
  set: "URR",
  rarity: "uncommon",
};
