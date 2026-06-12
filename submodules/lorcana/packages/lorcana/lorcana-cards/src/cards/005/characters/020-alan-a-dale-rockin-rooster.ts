import type { CharacterCard } from "@tcg/lorcana-types";
import { alanadaleRockinRoosterI18n } from "./020-alan-a-dale-rockin-rooster.i18n";

export const alanadaleRockinRooster: CharacterCard = {
  id: "Jj0",
  canonicalId: "ci_Jj0",
  reprints: ["set5-020"],
  cardType: "character",
  name: "Alan-a-Dale",
  version: "Rockin' Rooster",
  inkType: ["amber"],
  franchise: "Robin Hood",
  set: "005",
  cardNumber: 20,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d46b1371e56d486786fb471a1c043d3a",
    tcgPlayer: 560630,
  },
  text: [
    {
      title: "FAN FAVORITE",
      description: "Whenever you play a song, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "ow8-1",
      name: "FAN FAVORITE",
      text: "FAN FAVORITE Whenever you play a song, gain 1 lore.",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: alanadaleRockinRoosterI18n,
};
