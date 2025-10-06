// TODO: Once the set is released, we organize the cards by set and type

import {
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tinkerBellQueenOfTheAzuriteFairies: LorcanaCharacterCardDefinition =
  {
    id: "rdx",
    missingTestCase: true,
    name: "Tinker Bell",
    title: "Queen of the Azurite Fairies",
    characteristics: ["floodborn", "ally", "queen", "fairy", "captain"],
    text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Tinker Bell.)\nEvasive (Only characters with Evasive can challenge this character.)\nSHINING EXAMPLE Whenever this character quests, your other Fairy characters get +1 {L} this turn.",
    type: "character",
    abilities: [
      shiftAbility(5, "Tinker Bell"),
      evasiveAbility,
      wheneverQuests({
        name: "Shining Example",
        text: "Whenever this character quests, your other Fairy characters get +1 {L} this turn.",
        effects: [
          {
            type: "attribute",
            attribute: "lore",
            amount: 1,
            modifier: "add",
            duration: "turn",
            target: {
              type: "card",
              value: "all",
              excludeSelf: true,
              filters: [
                { filter: "owner", value: "self" },
                { filter: "type", value: "character" },
                { filter: "zone", value: "play" },
                { filter: "characteristics", value: ["fairy"] },
              ],
            },
          },
        ],
      }),
    ],
    inkwell: true,
    colors: ["amethyst"],
    cost: 7,
    strength: 5,
    willpower: 6,
    lore: 2,
    illustrator: "Livia Lopez",
    number: 48,
    set: "006",
    rarity: "uncommon",
  };
