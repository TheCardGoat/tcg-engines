import type { CharacterCard } from "@tcg/lorcana-types";
import { puaPotbelliedBuddyI18n } from "./053-pua-potbellied-buddy.i18n";

export const puaPotbelliedBuddy: CharacterCard = {
  id: "rYO",
  canonicalId: "ci_rYO",
  reprints: ["set3-053"],
  cardType: "character",
  name: "Pua",
  version: "Potbellied Buddy",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "003",
  cardNumber: 53,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_835c907af9be4b9d93b301eb3324b83e",
    tcgPlayer: 538216,
  },
  text: [
    {
      title: "ALWAYS THERE",
      description: "When this character is banished, you may shuffle this card into your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          intoDeck: "owner",
          target: "SELF",
          type: "shuffle-into-deck",
        },
        type: "optional",
      },
      id: "19j-1",
      name: "ALWAYS THERE",
      text: "ALWAYS THERE When this character is banished, you may shuffle this card into your deck.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: puaPotbelliedBuddyI18n,
};
