import type { CharacterCard } from "@tcg/lorcana-types";
import { grandPabbieOldestAndWisestI18n } from "./148-grand-pabbie-oldest-and-wisest.i18n";

export const grandPabbieOldestAndWisest: CharacterCard = {
  id: "iZk",
  canonicalId: "ci_KJO",
  reprints: ["set2-148", "set9-150"],
  cardType: "character",
  name: "Grand Pabbie",
  version: "Oldest and Wisest",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "002",
  cardNumber: 148,
  rarity: "common",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_fded826f4af24bb7aac039d15848173e",
    tcgPlayer: 650085,
  },
  text: [
    {
      title: "ANCIENT INSIGHT",
      description: "Whenever you remove 1 or more damage from one of your characters, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "qlg-1",
      name: "ANCIENT INSIGHT",
      text: "ANCIENT INSIGHT Whenever you remove 1 or more damage from one of your characters, gain 2 lore.",
      trigger: {
        event: "remove-damage",
        on: "YOUR_CHARACTERS",
        restrictions: [{ type: "during-turn", whose: "your" }],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: grandPabbieOldestAndWisestI18n,
};
