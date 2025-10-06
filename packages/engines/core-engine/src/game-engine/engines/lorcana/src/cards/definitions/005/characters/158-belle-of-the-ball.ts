import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import { yourOtherCharacters } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const belleOfTheBall: LorcanaCharacterCardDefinition = {
  id: "npn",
  missingTestCase: true,
  name: "Belle",
  title: "Of the Ball",
  characteristics: ["hero", "dreamborn", "princess"],
  text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n \n**USHERED INTO THE PARTY** When you play this character, your other characters gain **Ward** until the start of your next turn.",
  type: "character",
  abilities: [
    wardAbility,
    {
      type: "resolution",
      name: "Ushered Into The Party",
      text: "When you play this character, your other characters gain **Ward** until the start of your next turn.",
      effects: [
        {
          type: "ability",
          ability: "ward",
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: yourOtherCharacters,
        },
      ],
    },
  ],
  colors: ["sapphire"],
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "French Carlomagno",
  number: 158,
  set: "SSK",
  rarity: "rare",
};
