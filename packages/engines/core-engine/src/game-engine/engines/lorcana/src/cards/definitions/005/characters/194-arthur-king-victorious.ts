import type {
  AbilityEffect,
  LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";

export const arthurKingVictorious: LorcanaCharacterCardDefinition = {
  id: "l90",
  name: "Arthur",
  title: "King Victorious",
  characteristics: ["hero", "floodborn", "king"],
  text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Arthur.)_\n \n**KNIGHTED BY THE KING** When you play this character, chosen character gains **Challenger** +2 and **Resist** +2 and can challenge ready characters this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_",
  type: "character",
  abilities: [
    shiftAbility(5, "Arthur"),
    {
      type: "resolution",
      name: "KNIGHTED BY THE KING",
      text: "When you play this character, chosen character gains **Challenger** +2 and **Resist** +2 and can challenge ready characters this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_",
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 2,
          modifier: "add",
          duration: "turn",
          until: true,
          target: chosenCharacter,
        } as AbilityEffect,
        {
          type: "ability",
          ability: "resist",
          amount: 2,
          modifier: "add",
          duration: "turn",
          until: true,
          target: chosenCharacter,
        } as AbilityEffect,
        {
          type: "ability",
          ability: "challenge_ready_chars",
          modifier: "add",
          duration: "turn",
          until: true,
          target: chosenCharacter,
        } as AbilityEffect,
      ],
    },
  ],
  colors: ["steel"],
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 3,
  illustrator: "Anna Stosik",
  number: 194,
  set: "SSK",
  rarity: "legendary",
};
