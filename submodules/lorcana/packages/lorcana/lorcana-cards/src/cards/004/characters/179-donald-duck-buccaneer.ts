import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckBuccaneerI18n } from "./179-donald-duck-buccaneer.i18n";

export const donaldDuckBuccaneer: CharacterCard = {
  id: "LVd",
  canonicalId: "ci_LVd",
  reprints: ["set4-179"],
  cardType: "character",
  name: "Donald Duck",
  version: "Buccaneer",
  inkType: ["steel"],
  set: "004",
  cardNumber: 179,
  rarity: "legendary",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_da097130ff544f99b4ff980b404c053e",
    tcgPlayer: 549457,
  },
  text: [
    {
      title: "BOARDING PARTY",
      description:
        "During your turn, whenever this character banishes a character in a challenge, your other characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "YOUR_OTHER_CHARACTERS",
        type: "modify-stat",
      },
      id: "va5-1",
      name: "BOARDING PARTY",
      text: "BOARDING PARTY During your turn, whenever this character banishes a character in a challenge, your other characters get +1 {L} this turn.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: donaldDuckBuccaneerI18n,
};
