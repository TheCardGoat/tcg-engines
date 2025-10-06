import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { whenYouMoveACharacterHere } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { dealDamageToChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";

export const sevenDwarfsMineSecureFortress: LorcanaLocationCardDefinition = {
  id: "m2o",
  name: "Seven Dwarfs' Mine",
  title: "Secure Fortress",
  characteristics: ["location"],
  text: "**MOUNTAIN DEFENSE** During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
  type: "location",
  abilities: [
    whenYouMoveACharacterHere({
      name: "Mountain Defense",
      text: "During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
      optional: true,
      conditions: [
        { type: "first-time-move-to-location" },
        {
          type: "during-turn",
          value: "self",
        },
      ],
      target: {
        type: "card",
        value: 1,
        filters: [
          { filter: "characteristics", value: ["knight"] },
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
        ],
      },
      effects: [dealDamageToChosenCharacter(2)],
    }),
    whenYouMoveACharacterHere({
      name: "Mountain Defense",
      text: "During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
      optional: true,
      conditions: [
        { type: "first-time-move-to-location" },
        {
          type: "during-turn",
          value: "self",
        },
      ],
      target: {
        type: "card",
        value: 1,
        filters: [
          { filter: "characteristics", value: ["knight"], negate: true },
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
        ],
      },
      effects: [dealDamageToChosenCharacter(1)],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  willpower: 6,
  lore: 1,
  illustrator: "Alexa Rockman",
  number: 204,
  set: "SSK",
  rarity: "uncommon",
  moveCost: 2,
};
