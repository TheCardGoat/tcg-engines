import type { CharacterCard } from "@tcg/lorcana-types";
import { chipFriendIndeedI18n } from "./006-chip-friend-indeed.i18n";

export const chipFriendIndeed: CharacterCard = {
  id: "CN5",
  canonicalId: "ci_CN5",
  reprints: ["set6-006"],
  cardType: "character",
  name: "Chip",
  version: "Friend Indeed",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  cardNumber: 6,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a3462450711a4425947830aa8a6039bf",
    tcgPlayer: 578167,
  },
  text: [
    {
      title: "DALE'S PARTNER",
      description: "When you play this character, chosen character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "1x3-1",
      name: "DALE'S PARTNER",
      text: "DALE'S PARTNER When you play this character, chosen character gets +1 {L} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: chipFriendIndeedI18n,
};
