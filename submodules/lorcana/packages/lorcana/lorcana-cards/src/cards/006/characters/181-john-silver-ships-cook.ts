import type { CharacterCard } from "@tcg/lorcana-types";
import { johnSilverShipsCookI18n } from "./181-john-silver-ships-cook.i18n";

export const johnSilverShipsCook: CharacterCard = {
  id: "d07",
  canonicalId: "ci_d07",
  reprints: ["set6-181"],
  cardType: "character",
  name: "John Silver",
  version: "Ship's Cook",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 181,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fef968cf2e0d47fbb8f241fa7d91fd27",
    tcgPlayer: 587755,
  },
  text: [
    {
      title: "HUNK OF HARDWARE",
      description:
        "When you play this character, chosen character can't challenge during their next turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
  abilities: [
    {
      effect: {
        duration: "their-next-turn",
        restriction: "cant-challenge",
        target: "CHOSEN_CHARACTER",
        type: "restriction",
      },
      id: "1r7-1",
      name: "HUNK OF HARDWARE",
      text: "HUNK OF HARDWARE When you play this character, chosen character can't challenge during their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: johnSilverShipsCookI18n,
};
