import type {
  AbilityEffect,
  LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";

export const rafikiShamanDuelist: LorcanaCharacterCardDefinition = {
  id: "qke",
  name: "Rafiki",
  title: "Shaman Duelist",
  characteristics: ["sorcerer", "storyborn", "mentor"],
  text: "**Rush** _(This character can challenge the turn they’re played.)_ **SURPRISING SKILL** When you play this character, he gains **Challenger** +4 this turn. _(They get +4 while challenging.)_",
  type: "character",
  abilities: [
    rushAbility,
    {
      type: "resolution",
      name: "SURPRISING SKILL",
      text: "When you play this character, he gains **Challenger** +4 this turn. _(They get +4 while challenging.)_",
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 4,
          modifier: "add",
          duration: "turn",
          target: thisCharacter,
        } as AbilityEffect,
      ],
    },
  ],
  colors: ["amethyst"],
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Giulia Riva",
  number: 55,
  set: "SSK",
  rarity: "rare",
};
