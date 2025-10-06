import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import {
  chosenAlienCharacter,
  yourCharacters,
  yourOtherCharacters,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const liloBestExplorerEver: LorcanaCharacterCardDefinition = {
  id: "lbe",
  name: "Lilo",
  title: "Best Explorer Ever",
  characteristics: ["storyborn", "hero"],
  text: "COME ON, PEOPLE, LET'S MOVE When you play this character, your other characters gain Challenger +2 this turn. \nGO GET 'EM Whenever this character quests, chosen Alien character gains Challenger +2 and \"This character can challenge ready characters\" this turn.",
  type: "character",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 2,
  illustrator: "",
  number: 174,
  set: "009",
  rarity: "common",
  abilities: [
    {
      type: "resolution",
      name: "COME ON, PEOPLE, LET'S MOVE",
      text: "When you play this character, your other characters gain Challenger +2 this turn.",
      effects: [
        {
          type: "ability",
          ability: "custom",
          modifier: "add",
          duration: "turn",
          until: true,
          target: yourOtherCharacters,
          customAbility: challengerAbility(2),
        },
      ],
    },
    wheneverThisCharacterQuests({
      effects: [
        {
          type: "ability",
          ability: "custom",
          modifier: "add",
          duration: "turn",
          until: true,
          target: chosenAlienCharacter,
          customAbility: challengerAbility(2),
        },
        {
          type: "ability",
          ability: "challenge_ready_chars",
          modifier: "add",
          duration: "turn",
          until: true,
          target: chosenAlienCharacter,
        },
      ],
    }),
  ],
  lore: 1,
};
