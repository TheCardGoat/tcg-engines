import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  duringYourTurnGains,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jasmineFearlessPrincess: LorcanaCharacterCardDefinition = {
  id: "a7h",
  name: "Jasmine",
  title: "Fearless Princess",
  characteristics: ["storyborn", "hero", "princess"],
  text: "TAKE THE LEAP During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nNOW'S MY CHANCE Choose and discard a card — This character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  type: "character",
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 3,
  willpower: 7,
  illustrator: "Ian MacDonald",
  number: 178,
  set: "009",
  rarity: "rare",
  abilities: [
    duringYourTurnGains(
      "TAKE THE LEAP",
      "During your turn, this character gains Evasive.",
      evasiveAbility,
    ),
    {
      type: "activated",
      name: "NOW'S MY CHANCE",
      text: "Choose and discard a card — This character gains Challenger +3 this turn.",
      optional: false,
      costs: [
        {
          type: "card",
          action: "discard",
          amount: 1,
          filters: [
            { filter: "zone", value: "hand" },
            { filter: "owner", value: "self" },
          ],
        },
      ],
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 3,
          modifier: "add",
          duration: "turn",
          target: thisCharacter,
        },
      ],
    },
  ],
  lore: 2,
};
