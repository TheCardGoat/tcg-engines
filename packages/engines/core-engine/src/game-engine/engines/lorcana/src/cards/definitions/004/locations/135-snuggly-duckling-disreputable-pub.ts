import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";
import { wheneverChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

export const snugglyDucklingDisreputablePub: LorcanaLocationCardDefinition = {
  id: "ut6",
  name: "Snuggly Duckling",
  title: "Disreputable Pub",
  characteristics: ["location"],
  text: "**ROUTINE RUCKUS** Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "Routine Ruckus",
      text: "Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
      ability: wheneverChallengesAnotherChar({
        name: "Routine Ruckus",
        text: "Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
        attackerFilters: [
          {
            filter: "attribute",
            value: "strength",
            comparison: { operator: "gte", value: 3 },
          },
          {
            filter: "attribute",
            value: "strength",
            comparison: { operator: "lt", value: 6 },
          },
        ],
        effects: [youGainLore(1)],
      }),
    }),
    gainAbilityWhileHere({
      name: "Routine Ruckus",
      text: "Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
      ability: wheneverChallengesAnotherChar({
        name: "Routine Ruckus",
        text: "Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
        attackerFilters: [
          {
            filter: "attribute",
            value: "strength",
            comparison: { operator: "gte", value: 6 },
          },
        ],
        effects: [youGainLore(3)],
      }),
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  moveCost: 2,
  willpower: 9,
  illustrator: "Roberto Gatto",
  number: 135,
  set: "URR",
  // Not sure
  rarity: "rare",
};
