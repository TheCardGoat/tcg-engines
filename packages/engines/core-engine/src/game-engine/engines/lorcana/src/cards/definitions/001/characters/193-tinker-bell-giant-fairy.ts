import {
  chosenOpposingCharacter,
  eachOpposingCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverBanishesAnotherCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tinkerBellGiantFairy: LorcanaCharacterCardDefinition = {
  id: "kvc",
  reprints: ["rtd"],
  name: "Tinker Bell",
  title: "Giant Fairy",
  characteristics: ["floodborn", "ally", "fairy"],
  text: "**Shift** 4 (_You may pay 4 {I} to play this on top of one of your characters named Tinker Bell._)\n**ROCK THE BOAT** When you play this character, deal 1 damage to each opposing character.\n\n**PUNY PIRATE!** During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "Rock the Boat",
      text: "When you play this character, deal 1 damage to each opposing character.",
      effects: [
        {
          type: "damage",
          amount: 1,
          target: eachOpposingCharacter,
        },
      ],
    }),
    wheneverBanishesAnotherCharacterInChallenge({
      name: "Puny Pirate!",
      text: "During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
      optional: true,
      effects: [
        {
          type: "damage",
          amount: 2,
          target: chosenOpposingCharacter,
        },
      ],
    }),
    shiftAbility(4, "Tinker Bell"),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  illustrator: "Cookie",
  number: 193,
  set: "TFC",
  rarity: "super_rare",
};
