// TODO: Once the set is released, we organize the cards by set and type

import { chosenPirateCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMousePirateCaptain: LorcanaCharacterCardDefinition = {
  id: "ds9",
  name: "Mickey Mouse",
  title: "Pirate Captain",
  characteristics: ["floodborn", "hero", "pirate", "captain"],
  text: 'Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse.)\nMARINER’S MIGHT Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.',
  type: "character",
  abilities: [
    shiftAbility(3, "Mickey Mouse"),
    wheneverQuests({
      name: "Mariner’s Might",
      text: 'Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.',
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          duration: "turn",
          target: chosenPirateCharacter,
        },
        {
          type: "ability",
          ability: "custom",
          customAbility: {
            type: "static",
            ability: "effects",
            effects: [
              {
                type: "protection",
                from: "damage",
                as: "attacker",
                target: {
                  type: "card",
                  value: "all",
                  filters: [
                    { filter: "type", value: "character" },
                    { filter: "zone", value: "play" },
                  ],
                },
              },
            ],
          },
          modifier: "add",
          duration: "turn",
          target: chosenPirateCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  illustrator: "Koni",
  number: 103,
  set: "006",
  rarity: "super_rare",
};
